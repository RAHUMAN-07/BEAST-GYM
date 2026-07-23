import React, { useEffect, useRef, useState } from 'react';

interface ScrollFlyInHeadlineProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  subtext?: string;
}

export const ScrollFlyInHeadline: React.FC<ScrollFlyInHeadlineProps> = ({
  text,
  highlightWords = [],
  className = '',
  subtext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`text-center space-y-4 ${className}`}>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-wider text-white font-anton flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
          const isHighlighted = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
          );

          // Stagger directions: word 0 from left (-100px), word 1 from top (-80px), word 2 from right (100px), etc.
          const directions = [
            'translate3d(-120px, 0, 0) scale(0.6)',
            'translate3d(0, -100px, 0) scale(0.6)',
            'translate3d(120px, 0, 0) scale(0.6)',
            'translate3d(0, 100px, 0) scale(0.6)',
          ];
          const initialTransform = directions[index % directions.length];

          return (
            <span
              key={`${word}-${index}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate3d(0,0,0) scale(1)' : initialTransform,
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms`,
                display: 'inline-block',
              }}
              className={isHighlighted ? 'text-[#00ff66] text-shadow-[0_0_20px_rgba(0,255,102,0.6)]' : ''}
            >
              {word}
            </span>
          );
        })}
      </h1>

      {subtext && (
        <p
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 500ms',
          }}
          className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed"
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
