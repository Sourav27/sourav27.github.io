import { useRef } from 'react';

const QUOTE = 'Passionate about shaping the future of AI through user-centric design thinking.';

export const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Personal Statement
          </span>
          <p className="text-3xl md:text-4xl font-light leading-relaxed text-stone-500 dark:text-stone-500">
            {QUOTE}
          </p>
        </div>

        {/* Portrait — right */}
        <div className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src="/images/SDPasspic.jpg"
              alt="Sourav Debnath"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
