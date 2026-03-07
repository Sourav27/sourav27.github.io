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
    <div className="border-t border-stone-800 border-b overflow-hidden py-4">
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{ animation: 'marquee 35s linear infinite' }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="text-sm uppercase tracking-widest text-stone-600 shrink-0"
          >
            {item}
            <span className="ml-16 text-stone-800">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
