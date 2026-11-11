package invoicetool

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"

	authrail "github.com/AuthRail/authrail-sdk-go"
)

type Session struct{ OrganisationID, UserID, SessionID string }
type Task struct{ OrganisationID, UserID, RequestKey, InvoiceID string }
type Invoice struct{ OrganisationID, OwnerID, InvoiceID, Status string }
type Config struct{ OrganisationID, OperationVersionID string }
type ToolCall struct {
	Tool      string `json:"tool"`
	Arguments struct {
		InvoiceID string `json:"invoiceId"`
	} `json:"arguments"`
}

var safeKey = regexp.MustCompile(`^[A-Za-z0-9_-]{1,96}$`)

// Handle runs after the application's authentication and saved-task lookup.
func Handle(ctx context.Context, client *authrail.Client, config Config, session Session,
	task Task, proposalJSON []byte, invoices map[string]Invoice) (map[string]any, error) {
	if session.OrganisationID != config.OrganisationID || session.UserID == "" || session.SessionID == "" ||
		task.OrganisationID != config.OrganisationID || task.UserID != session.UserID || !safeKey.MatchString(task.RequestKey) {
		return nil, errors.New("authenticated task context required")
	}
	var proposal ToolCall
	decoder := json.NewDecoder(bytes.NewReader(proposalJSON))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&proposal); err != nil {
		return nil, errors.New("invalid invoice tool request")
	}
	var extra any
	if decoder.Decode(&extra) != io.EOF || proposal.Tool != "read_invoice" ||
		!safeKey.MatchString(proposal.Arguments.InvoiceID) || task.InvoiceID != proposal.Arguments.InvoiceID {
		return nil, errors.New("request does not match the saved task")
	}
	invoiceID := proposal.Arguments.InvoiceID
	digest := sha256.Sum256([]byte(config.OrganisationID + "\x00" + session.UserID + "\x00" + task.RequestKey))
	actionKey := fmt.Sprintf("invoice:%x", digest)
	readOwnedInvoice := func() (map[string]any, error) {
		row, exists := invoices[invoiceID]
		if !exists || row.OrganisationID != config.OrganisationID || row.OwnerID != session.UserID ||
			row.InvoiceID != invoiceID || row.Status == "" {
			return nil, errors.New("invoice unavailable to this caller")
		}
		return map[string]any{"invoiceId": row.InvoiceID, "status": row.Status}, nil
	}
	if _, err := readOwnedInvoice(); err != nil {
		return nil, err
	}
	invoice, call, _, err := authrail.Enforce(ctx, client, authrail.Operation{
		VersionID:   config.OperationVersionID,
		ActionKey:   actionKey,
		PrincipalID: session.UserID, SessionID: session.SessionID,
		PrincipalSource: "application_session", ResourceID: invoiceID, ResourceSource: "application_lookup",
	}, map[string]any{"invoiceId": invoiceID},
		func(ctx context.Context, checked map[string]any, execution authrail.ExecutionContext) (map[string]any, error) {
			if checked["invoiceId"] != invoiceID {
				return nil, errors.New("invoice binding changed")
			}
			return readOwnedInvoice()
		})
	if err != nil {
		return nil, err
	}
	return map[string]any{"status": "completed", "actionId": call.ActionID, "invoice": invoice}, nil
}
