import Image from 'next/image';
export function ProductShot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return <figure className="product-shot"><a href={src} target="_blank" rel="noreferrer" aria-label={`Open full-size screenshot: ${alt}`}><Image src={src} alt={alt} width={1470} height={695} sizes="(max-width: 700px) 100vw, 1180px" /></a><figcaption>{caption}</figcaption></figure>;
}
