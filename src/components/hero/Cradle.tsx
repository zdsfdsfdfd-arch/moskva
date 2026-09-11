/**
 * Window-washer's cradle: a platform with two ropes going up out of frame.
 * Positioned under Klir's feet; ropes extend far above (overflow visible).
 */
export function Cradle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 60" overflow="visible" aria-hidden className={className}>
      {/* ropes */}
      <path d="M22 26 V-4000 M278 26 V-4000" stroke="#1b1f2a" strokeWidth="7" />
      <path d="M22 26 V-4000 M278 26 V-4000" stroke="#d9a066" strokeWidth="3" strokeDasharray="10 8" />
      {/* rails */}
      <path d="M22 26 V-40 M278 26 V-40" stroke="#1b1f2a" strokeWidth="8" strokeLinecap="round" />
      <path d="M22 -36 H278" stroke="#1b1f2a" strokeWidth="8" strokeLinecap="round" />
      <path d="M22 -36 H278" stroke="#d5dde6" strokeWidth="3" />
      {/* platform */}
      <rect x="0" y="22" width="300" height="26" rx="8" fill="#178f83" stroke="#1b1f2a" strokeWidth="5" />
      <path d="M14 30 h60" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* bucket riding along */}
      <path d="M230 -2 h40 l-4 26 h-32 Z" fill="#1fb6a6" stroke="#1b1f2a" strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="250" cy="-2" rx="20" ry="4" fill="#a9e4f7" stroke="#1b1f2a" strokeWidth="3" />
    </svg>
  );
}
