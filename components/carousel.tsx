"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./icons";

// Two clones on each end so the peeking sides are never empty while looping.
const OFF = 2;
const INTERVAL = 5000;

type Props = {
  slides: ReactNode[];
  dots?: boolean;
  arrows?: boolean;
};

// Infinite peek carousel: active slide centered, neighbours visible on both sides.
export function Carousel({ slides, dots = false, arrows = false }: Props) {
  const n = slides.length;
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const api = useRef<{ go: (k: number) => void; step: (d: number) => void }>({ go: () => {}, step: () => {} });

  useEffect(() => {
    const car = carRef.current!;
    const track = trackRef.current!;
    const all = Array.from(track.children) as HTMLElement[];
    let pos = OFF;
    let i = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    function place(animate: boolean) {
      const w = all[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transition = animate ? "" : "none";
      track.classList.toggle("jump", !animate);
      track.style.transform = `translateX(${(car.offsetWidth - w) / 2 - pos * (w + gap)}px)`;
      all.forEach((s, k) => s.classList.toggle("on", k === pos));
      if (!animate) {
        void track.offsetHeight;
        track.style.transition = "";
        track.classList.remove("jump");
      }
    }

    function go(p: number) {
      pos = p;
      i = (((pos - OFF) % n) + n) % n;
      place(true);
      dotRefs.current.forEach((d, k) => d?.classList.toggle("on", k === i));
      clearInterval(timer);
      timer = setInterval(() => go(pos + 1), INTERVAL);
    }

    // After sliding onto a clone, jump silently to the matching real slide.
    function onTransitionEnd(e: TransitionEvent) {
      if (e.target !== track) return;
      if (pos >= n + OFF || pos < OFF) {
        pos = i + OFF;
        place(false);
      }
    }
    const onResize = () => place(false);

    api.current = { go: (k) => go(k + OFF), step: (d) => go(pos + d) };
    track.addEventListener("transitionend", onTransitionEnd);
    window.addEventListener("resize", onResize);
    place(false);
    go(OFF);

    return () => {
      clearInterval(timer);
      track.removeEventListener("transitionend", onTransitionEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  const clones = (from: number[], tag: string) =>
    from.map((k) => (
      <div className="car-slide" key={`${tag}${k}`} aria-hidden="true" inert>
        {slides[k]}
      </div>
    ));

  return (
    <div className="car" ref={carRef}>
      {arrows && (
        <button className="car-arrow prev" aria-label="ก่อนหน้า" onClick={() => api.current.step(-1)}>
          <Icon name="arrow" />
        </button>
      )}
      <div className="car-track" ref={trackRef}>
        {clones([n - 2, n - 1], "head")}
        {slides.map((slide, k) => (
          <div className="car-slide" key={k}>
            {slide}
          </div>
        ))}
        {clones([0, 1], "tail")}
      </div>
      {arrows && (
        <button className="car-arrow next" aria-label="ถัดไป" onClick={() => api.current.step(1)}>
          <Icon name="arrow" />
        </button>
      )}
      {dots && (
        <div className="car-dots">
          {slides.map((_, k) => (
            <button
              key={k}
              aria-label={`สไลด์ ${k + 1}`}
              ref={(el) => {
                dotRefs.current[k] = el;
              }}
              onClick={() => api.current.go(k)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
