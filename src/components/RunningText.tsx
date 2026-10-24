import React, { useRef, useState, useEffect } from 'react';

interface RunningTextProps {
  text: string;
  className?: string;
  containerClassName?: string;
  speed?: number; // Pixels per second for smooth reading speed
  title?: string;
  style?: React.CSSProperties;
}

/**
 * RunningText: Renders text statically if it fits. If the title is cut out (overflows),
 * hovering on the card triggers the text to run to the left until the last letter of the name
 * disappears, then the first letter reappears from the right edge and glides in until it stops
 * when the first letter is displayed at the left-hand side.
 */
export const RunningText: React.FC<RunningTextProps> = ({
  text,
  className = '',
  containerClassName = '',
  speed = 36, // px per second for natural reading
  title,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const cWidth = containerRef.current.clientWidth;
      const tWidth = textRef.current.scrollWidth;

      // Check if text exceeds container width (with 2px threshold to ignore subpixel rounding)
      if (tWidth > cWidth + 2) {
        setIsOverflowing(true);
        setContainerWidth(cWidth);
        setTextWidth(tWidth);
      } else {
        setIsOverflowing(false);
        setContainerWidth(cWidth);
        setTextWidth(tWidth);
      }
    };

    // Immediate measurement
    measure();

    // Secondary measurement for DOM stabilization
    animationFrameId = requestAnimationFrame(() => {
      measure();
    });

    const observer = new ResizeObserver(() => {
      measure();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [text]);

  // Total travel distance in a cycle: running out (textWidth + 16px) + running in (containerWidth + 16px)
  const travelDistance = Math.max(120, textWidth + containerWidth + 32);
  // Total duration: constant reading speed plus start and end hold times (~3.6s total pause at left)
  const duration = Math.max(7, Math.round((travelDistance / speed) + 3.6));

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden min-w-0 max-w-full select-none ${containerClassName}`}
      title={title || text}
    >
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap ${
          isOverflowing ? 'running-title-active' : 'max-w-full truncate'
        } ${className}`}
        style={{
          ...style,
          ...(isOverflowing
            ? ({
                '--container-width': `${containerWidth || 180}px`,
                '--text-width': `${textWidth || 200}px`,
                '--marquee-duration': `${duration}s`,
              } as React.CSSProperties)
            : {}),
        }}
      >
        {text}
      </span>

      {/* Subtle right fade gradient indicator */}
      {isOverflowing && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-l from-black/30 to-transparent z-10"
        />
      )}
    </div>
  );
};
