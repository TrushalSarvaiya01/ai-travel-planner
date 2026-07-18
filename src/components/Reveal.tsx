import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delayClassName?: string;
  className?: string;
}

export default function Reveal({ children, className = '', delayClassName }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${delayClassName ?? ''} transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
