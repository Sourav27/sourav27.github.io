const ITEMS = [
  'AB InBev',
  'Bain & Company',
  'Vedanta',
  'Google',
  'Microsoft',
  'IIT Madras',
  'IIM Bangalore',
];

export const Marquee = () => {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="border-t border-b overflow-hidden py-4" style={{ borderColor: 'var(--color-border)' }}>
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{ animation: 'marquee 35s linear infinite' }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="text-sm uppercase tracking-widest shrink-0" style={{ color: 'var(--color-text-muted)' }}
          >
            {item}
            <span className="ml-16" style={{ color: 'var(--color-border)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
