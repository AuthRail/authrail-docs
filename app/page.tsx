import Link from 'next/link';
import { Oxanium } from 'next/font/google';
import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import { Brand } from '@/components/brand';
import { AUTHRAIL } from '@/lib/constants';

const displayFont = Oxanium({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function HomePage() {
  return <main className={`landing ${displayFont.variable}`}>
    <section className="landing-hero">
      <header className="landing-nav">
        <Link href="/" className="landing-brand" aria-label="AuthRail home"><Brand /></Link>
        <nav aria-label="Main navigation">
          <a className="landing-github" aria-label="AuthRail documentation on GitHub" href={AUTHRAIL.repositories.docs}><GithubLogoIcon size={19} aria-hidden="true" /><span>GitHub</span></a>
          <Link className="landing-get-started" href="/docs">Get started</Link>
        </nav>
      </header>
      <div className="landing-intro">
        <h1>AI governance<br />for your organisation.</h1>
        <p>AuthRail helps organisations govern how they use AI. Understand what your AI systems are doing, control which actions they can take, and bring sensitive decisions to a human for approval. Connect that oversight to your organisation’s policies and compliance requirements.</p>
      </div>
    </section>
    <section className="landing-start" aria-label="Documentation">
      <Link href="/docs" className="landing-read-docs">Read the docs</Link>
    </section>
  </main>;
}
