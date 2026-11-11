package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"syscall"

	authrail "github.com/AuthRail/authrail-sdk-go"
)

type Binding struct {
	OrganisationID     string
	DeploymentID       string
	OperationVersionID string
	PrincipalID        string
	SessionID          string
	RequestKey         string
}
type Input struct {
	InvoiceID string `json:"invoiceId"`
}
type Invoice struct {
	InvoiceID string `json:"invoiceId"`
	Status    string `json:"status"`
}
type Task struct {
	Binding      Binding
	Status       string
	Input        Input
	Continuation *authrail.ApprovalContinuation
	Recovery     *authrail.Recovery
}
type Store struct {
	directory  string
	path       string
	binding    Binding
	encryption cipher.AEAD
}

func (s Store) save(task *Task) error {
	encoded, err := json.Marshal(task)
	if err != nil {
		return err
	}
	associated, err := json.Marshal(s.binding)
	if err != nil {
		return err
	}
	nonce := make([]byte, s.encryption.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return err
	}
	encrypted := s.encryption.Seal(nonce, nonce, encoded, associated)
	temporary, err := os.CreateTemp(s.directory, ".invoice-*.tmp")
	if err != nil {
		return err
	}
	name := temporary.Name()
	defer os.Remove(name)
	if err := temporary.Chmod(0o600); err != nil {
		temporary.Close()
		return err
	}
	if _, err := temporary.Write(encrypted); err != nil {
		temporary.Close()
		return err
	}
	if err := temporary.Sync(); err != nil {
		temporary.Close()
		return err
	}
	if err := temporary.Close(); err != nil {
		return err
	}
	if err := os.Rename(name, s.path); err != nil {
		return err
	}
	directory, err := os.Open(s.directory)
	if err != nil {
		return err
	}
	defer directory.Close()
	return directory.Sync()
}
func (s Store) load() (*Task, error) {
	encrypted, err := os.ReadFile(s.path)
	if err != nil {
		return nil, err
	}
	size := s.encryption.NonceSize()
	if len(encrypted) < size {
		return nil, errors.New("invalid encrypted task")
	}
	associated, err := json.Marshal(s.binding)
	if err != nil {
		return nil, err
	}
	decoded, err := s.encryption.Open(nil, encrypted[:size], encrypted[size:], associated)
	if err != nil {
		return nil, err
	}
	var task Task
	if err := json.Unmarshal(decoded, &task); err != nil {
		return nil, err
	}
	if task.Binding != s.binding {
		return nil, errors.New("task binding changed")
	}
	return &task, nil
}
func newStore(private string, binding Binding) (Store, error) {
	store := Store{directory: filepath.Join(private, "go-invoice-tasks"), binding: binding}
	if err := os.MkdirAll(store.directory, 0o700); err != nil {
		return store, err
	}
	metadata, err := os.Stat(store.directory)
	if err != nil {
		return store, err
	}
	owner, ok := metadata.Sys().(*syscall.Stat_t)
	if metadata.Mode().Perm()&0o077 != 0 || !ok || int(owner.Uid) != os.Getuid() {
		return store, errors.New("task directory must be private and owned by this application user")
	}
	keyPath := filepath.Join(store.directory, "journal-key")
	file, err := os.OpenFile(keyPath, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o600)
	if err == nil {
		key := make([]byte, 32)
		if _, err = rand.Read(key); err == nil {
			_, err = file.Write(key)
		}
		if err == nil {
			err = file.Sync()
		}
		closeErr := file.Close()
		if err != nil {
			return store, err
		}
		if closeErr != nil {
			return store, closeErr
		}
	} else if !errors.Is(err, os.ErrExist) {
		return store, err
	}
	key, err := os.ReadFile(keyPath)
	if err != nil {
		return store, err
	}
	if len(key) != 32 {
		return store, errors.New("invalid task encryption key")
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return store, err
	}
	store.encryption, err = cipher.NewGCM(block)
	store.path = filepath.Join(store.directory, binding.RequestKey+".json.enc")
	return store, err
}
func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
func run() error {
	// A single-operator, single-host example. The agent cannot choose these identities.
	syscall.Umask(0o077)
	args := os.Args[1:]
	if len(args) < 2 {
		return errors.New("use submit INVOICE_ID REQUEST_KEY | resume REQUEST_KEY | recover-permit REQUEST_KEY | status REQUEST_KEY")
	}
	command := args[0]
	requestKey := args[1]
	invoiceID := ""
	if command == "submit" {
		if len(args) != 3 {
			return errors.New("submit requires an invoice ID and request key")
		}
		invoiceID, requestKey = args[1], args[2]
	} else if len(args) != 2 || (command != "resume" && command != "recover-permit" && command != "status") {
		return errors.New("invalid command")
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9_-]{1,64}$`).MatchString(requestKey) ||
		(command == "submit" && !regexp.MustCompile(`^invoice_[a-zA-Z0-9_-]{1,64}$`).MatchString(invoiceID)) {
		return errors.New("invalid request key or invoice identifier")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	private := filepath.Join(home, ".local/share/authrail/my-deployment")
	readPrivate := func(name string) ([]byte, error) { return os.ReadFile(filepath.Join(private, name)) }
	var connection struct {
		OrganisationID string `json:"organisationId"`
		DeploymentID   string `json:"deploymentId"`
	}
	var settings struct {
		OperationVersionID string `json:"operation_version_id"`
	}
	encoded, err := readPrivate("connection.json")
	if err != nil {
		return err
	}
	if err := json.Unmarshal(encoded, &connection); err != nil {
		return err
	}
	encoded, err = readPrivate("example-config.json")
	if err != nil {
		return err
	}
	if err := json.Unmarshal(encoded, &settings); err != nil {
		return err
	}
	// The catalogue resolves identifiers to fixed application-owned files, not model-written paths.
	catalogue := map[string]string{"invoice_123": "invoice.json", "invoice_456": "invoice-denied.json"}
	lookupInvoice := func(id string) (Invoice, error) {
		filename, ok := catalogue[id]
		if !ok {
			return Invoice{}, errors.New("invoice is outside this sample catalogue")
		}
		encoded, err := readPrivate(filename)
		if err != nil {
			return Invoice{}, err
		}
		var invoice map[string]any
		if err := json.Unmarshal(encoded, &invoice); err != nil {
			return Invoice{}, err
		}
		if len(invoice) != 2 || invoice["invoiceId"] != id || invoice["status"] != "open" {
			return Invoice{}, errors.New("invoice fixture does not match this request")
		}
		return Invoice{InvoiceID: id, Status: "open"}, nil
	}
	binding := Binding{OrganisationID: connection.OrganisationID, DeploymentID: connection.DeploymentID,
		OperationVersionID: settings.OperationVersionID, PrincipalID: "staff_123", SessionID: "task_123", RequestKey: requestKey}
	store, err := newStore(private, binding)
	if err != nil {
		return err
	}
	lock := filepath.Join(store.directory, requestKey+".lock")
	// An existing or crash-left lock needs operator inspection, not automatic removal.
	if err := os.Mkdir(lock, 0o700); err != nil {
		return err
	}
	defer os.Remove(lock)
	var task *Task
	if command == "submit" {
		if _, err := os.Stat(store.path); !errors.Is(err, os.ErrNotExist) {
			return errors.New("request key already exists or cannot be inspected")
		}
		if _, ok := catalogue[invoiceID]; !ok {
			return errors.New("invoice is outside this sample catalogue")
		}
		task = &Task{Binding: binding, Status: "prepared", Input: Input{InvoiceID: invoiceID}}
		if err := store.save(task); err != nil {
			return err
		}
	} else {
		task, err = store.load()
		if err != nil {
			return err
		}
	}
	if command == "status" {
		fmt.Println("Saved task:", task.Status)
		return nil
	}
	token, err := readPrivate("adapter-token")
	if err != nil {
		return err
	}
	pem, err := readPrivate("executor-private.pem")
	if err != nil {
		return err
	}
	key, err := authrail.ParseExecutorPrivateKeyPEM(pem)
	if err != nil {
		return err
	}
	client, err := authrail.NewClient(authrail.Config{SidecarURL: "http://127.0.0.1:7078",
		OrganisationID: connection.OrganisationID, DeploymentID: connection.DeploymentID,
		AdapterToken: strings.TrimSpace(string(token)), ExecutorPrivateKey: key})
	if err != nil {
		return err
	}
	reader := func(_ context.Context, checked Input, execution authrail.ExecutionContext) (Invoice, error) {
		if checked != task.Input {
			return Invoice{}, errors.New("checked input changed")
		}
		task.Status, task.Recovery = "started", &execution
		if err := store.save(task); err != nil {
			return Invoice{}, err
		}
		fmt.Println("Protected reader invoked")
		return lookupInvoice(checked.InvoiceID)
	}
	ctx := context.Background()
	var invoice Invoice
	var decision *authrail.Decision
	if command == "submit" {
		operation := authrail.Operation{VersionID: binding.OperationVersionID, ActionKey: "invoice-" + requestKey,
			PrincipalID: binding.PrincipalID, SessionID: binding.SessionID, ResourceID: task.Input.InvoiceID,
			PrincipalSource: "application_session", ResourceSource: "application_lookup"}
		invoice, _, decision, err = authrail.Enforce(ctx, client, operation, task.Input, reader)
	} else {
		expected := "awaiting_approval"
		if command == "recover-permit" {
			expected = "claiming"
		}
		if task.Status != expected || task.Continuation == nil {
			return errors.New("task is not in the required approval state; inspect instead of retrying")
		}
		task.Status = "claiming"
		if err := store.save(task); err != nil {
			return err
		}
		if command == "resume" {
			invoice, decision, err = authrail.ResumeApprovalFrom(ctx, client, *task.Continuation, reader)
		}
		if command == "recover-permit" {
			invoice, decision, err = authrail.RecoverApprovalFrom(ctx, client, *task.Continuation, reader)
		}
	}
	if err == nil {
		task.Status = "completed"
		if err := store.save(task); err != nil {
			return err
		}
		fmt.Println("Invoice status:", invoice.Status)
		if decision != nil {
			fmt.Println("result", decision.Outcome, decision.RecordingStatus)
			fmt.Println("Action:", decision.ActionID)
		}
		return nil
	}
	var pending *authrail.ApprovalRequired
	var blocked *authrail.EnforceBlockedError
	var unknown *authrail.OutcomeUnknownError
	switch {
	case errors.As(err, &pending) && task.Status == "prepared":
		continuation, snapshotErr := pending.Continuation()
		if snapshotErr != nil {
			return snapshotErr
		}
		task.Status, task.Continuation = "awaiting_approval", &continuation
		fmt.Println("Action:", pending.Decision.ActionID)
	case errors.As(err, &blocked):
		if blocked.EffectMayHaveOccurred {
			task.Status = "result_withheld"
		} else if task.Status == "prepared" {
			task.Status = "blocked"
		}
	case errors.As(err, &unknown):
		task.Status, task.Recovery = "outcome_unknown", &unknown.Recovery
	default:
		return err
	}
	if err := store.save(task); err != nil {
		return err
	}
	fmt.Println("Saved task:", task.Status, "|", err)
	return nil
}
