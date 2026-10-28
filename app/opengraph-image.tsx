import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { AUTHRAIL } from '@/lib/constants';

export const alt = 'AuthRail — AI governance for your organisation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'app/icon.png'));
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, color: '#071018', background: '#1761df' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 700 }}>
      {/* ImageResponse renders this data URI directly; no remote asset request. */}
      <img src={`data:image/png;base64,${logo.toString('base64')}`} width={60} height={60} alt="" />
      <span>{AUTHRAIL.name}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 78, fontWeight: 800, lineHeight: 1.03, letterSpacing: -4 }}><span>AI governance</span><span>for your organisation.</span></div>
    <div style={{ display: 'flex', fontSize: 24, color: '#fff' }}>Frameworks · Policies · Controls · Runtime</div>
  </div>, size);
}
