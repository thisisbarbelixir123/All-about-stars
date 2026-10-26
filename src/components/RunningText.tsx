import React, { useRef, useState, useEffect, useMemo } from 'react';

interface RunningTextProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: number; // Pixels per second for smooth reading speed
  title?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fadeGradient?: boolean;
}

/**
 * Extracts plain text string from React children (recursively if needed)
 */
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (React.isValidElement(children) && children.props && typeof children.props === 'object' && 'children' in (children.props as Record<string, unknown>)) {
    return extractTextFromChildren((children.props as Record<string, React.ReactNode>).children);
  }
  return '';
}

/**
 * RunningText: Renders text statically if it fits the container.
 * If the text doesn't fit (overflows horizontally), it automatically becomes
 * smooth running text (marquee ticker) that glides left to reveal the hidden text,
 * then reappears from the right edge and rests at the start for comfortable reading.
 * Pauses on hover for user reading and clicking.
 */
export const RunningText: React.FC<RunningTextProps> = ({
  text,
  children,
  className = '',
  containerClassName = '',
  speed = 36, // px per second for natural reading
  title,
  style,
  as: Component = 'div',
  fadeGradient = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const rawText = useMemo(() => {
    if (text !== undefined) return text;
    return extractTextFromChildren(children);
  }, [text, children]);

  useEffect(() => {
    let animationFrameId: number;

    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const cWidth = containerRef.current.clientWidth;
      const tWidth = textRef.current.scrollWidth;

      // Check if text exceeds container width (with 2px threshold to ignore subpixel rounding)
      if (tWidth > cWidth + 2 && cWidth > 0) {
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

    // Secondary measurement for DOM stabilization & layout calculation
    animationFrameId = requestAnimationFrame(() => {
      measure();
    });

    const observer = new ResizeObserver(() => {
      measure();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (textRef.current) {
      observer.observe(textRef.current);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [rawText]);

  // Total travel distance in a cycle: running out (textWidth + 16px) + running in (containerWidth + 16px)
  const travelDistance = Math.max(120, textWidth + containerWidth + 32);
  // Total duration: constant reading speed plus start and end hold times (~3.6s total pause at left)
  const duration = Math.max(6, Math.round(travelDistance / speed + 3.6));

  // When overflowing, remove clipping classes from inner track so text can glide unclipped
  const cleanedSpanClassName = useMemo(() => {
    if (!isOverflowing) {
      return `max-w-full truncate ${className}`;
    }
    // Remove truncate / overflow-hidden from inner span so it doesn't clip itself
    return className
      .replace(/\btruncate\b/g, '')
      .replace(/\boverflow-hidden\b/g, '')
      .replace(/\bmax-w-full\b/g, '')
      .trim();
  }, [isOverflowing, className]);

  const displayTitle = title || (rawText ? String(rawText) : undefined);

  return (
    <Component
      ref={containerRef as any}
      data-running-text="true"
      className={`${
        Component === 'span' ? 'inline-flex' : 'relative'
      } overflow-hidden min-w-0 max-w-full select-none ${containerClassName}`}
      title={displayTitle}
    >
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap ${
          isOverflowing ? 'running-title-active' : ''
        } ${cleanedSpanClassName}`}
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
        {children ?? text}
      </span>

      {/* Subtle right fade gradient indicator when text exceeds container */}
      {isOverflowing && fadeGradient && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-[#060a1a]/90 via-[#060a1a]/50 to-transparent z-10"
        />
      )}
    </Component>
  );
};

export default RunningText;
