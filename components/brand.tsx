import Image from 'next/image';

export function Brand() {
  return <span className="brand">
    <Image src="/icon.png" alt="" width={38} height={38} priority unoptimized />
    <span>AuthRail</span>
  </span>;
}
