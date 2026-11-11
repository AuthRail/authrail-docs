'use client';

import { useId, useState } from 'react';
import { ArrowSquareOutIcon, CaretDownIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';

type CopyTarget = 'page' | 'agent' | 'ChatGPT' | 'Claude';
type Props = {
  markdown: string;
  markdownUrl: string;
  chatgptUrl: string;
  claudeUrl: string;
};

export function PageActions({ markdown, markdownUrl, chatgptUrl, claudeUrl }: Props) {
  const helpId = useId();
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copying, setCopying] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  async function copy(target: CopyTarget) {
    if (copying) return;
    setCopying(true);
    setFailed(false);
    setMessage('');
    const text = target === 'page' ? markdown
      : target === 'agent' ? `Use the following AuthRail documentation as a reference for the task I describe.\n\n${markdown}`
        : `I want to ask about this AuthRail documentation. Please use the page below as context.\n\n${markdown}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(target);
      setMessage(target === 'page' ? 'Page copied.' : target === 'agent'
        ? 'Copied. Paste the page into your agent.'
        : `Copied. Open ${target} and paste the page into a conversation.`);
    } catch {
      setCopied(null);
      setFailed(true);
      setMessage('Automatic copying is unavailable. Open the Markdown version to select and copy the page.');
    } finally {
      setCopying(false);
    }
  }

  const choiceClass = 'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring disabled:opacity-50';
  return <div className="not-prose mb-8 space-y-2">
    <div role="group" className="flex flex-wrap items-center gap-2" aria-label="Page actions">
      <button type="button" disabled={copying} onClick={() => void copy('page')} className={buttonVariants({ color: 'secondary', size: 'sm', className: 'gap-2' })}>
        {copied === 'page' ? <CheckIcon size={16} aria-hidden="true" /> : <CopyIcon size={16} aria-hidden="true" />}
        {copied === 'page' ? 'Copied' : 'Copy page'}
      </button>
      <Popover>
        <PopoverTrigger className={buttonVariants({ color: 'secondary', size: 'sm', className: 'gap-2' })}>
          Use with AI <CaretDownIcon size={14} aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 max-w-[calc(100vw-2rem)] p-2">
          <p id={helpId} className="px-3 py-2 text-xs leading-5 text-fd-muted-foreground">Copy this page, then paste it into your assistant.</p>
          {(['agent', 'ChatGPT', 'Claude'] as const).map(target => <button key={target} type="button" disabled={copying} aria-describedby={helpId} onClick={() => void copy(target)} className={choiceClass}>
            {copied === target ? <CheckIcon size={16} aria-hidden="true" /> : <CopyIcon size={16} aria-hidden="true" />}
            Copy for {target === 'agent' ? 'an agent' : target}
          </button>)}
          <div className="my-2 border-t border-fd-border" />
          <a href={chatgptUrl} target="_blank" rel="noopener noreferrer" className={choiceClass}>Open ChatGPT <ArrowSquareOutIcon size={14} aria-hidden="true" /></a>
          <a href={claudeUrl} target="_blank" rel="noopener noreferrer" className={choiceClass}>Open Claude <ArrowSquareOutIcon size={14} aria-hidden="true" /></a>
        </PopoverContent>
      </Popover>
      <a href={markdownUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ color: 'ghost', size: 'sm', className: 'gap-2' })}>View Markdown <ArrowSquareOutIcon size={14} aria-hidden="true" /></a>
    </div>
    <p role={failed ? 'alert' : 'status'} aria-live={failed ? 'assertive' : 'polite'} className="text-xs leading-5 text-fd-muted-foreground">
      {message}{failed && <> <a href={markdownUrl} className="underline underline-offset-4">Open Markdown</a>.</>}
    </p>
  </div>;
}
