import { ImageResponse } from 'next/og';
export const alt = 'AuthRail — Govern AI actions. Keep the proof.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: '#f7faff', color: '#10213d', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px' }}><div style={{ display: 'flex', fontSize: 38, fontWeight: 700 }}>Auth<span style={{ color: '#145bd7' }}>Rail</span></div><div style={{ display: 'flex', flexDirection: 'column', fontSize: 78, fontWeight: 700, letterSpacing: '-4px', lineHeight: 1.05 }}><span>Govern AI actions.</span><span style={{ color: '#145bd7' }}>Keep the proof.</span></div><div style={{ fontSize: 25 }}>Rules · Human approval · Execution records · Framework proof</div></div>, size);
}
