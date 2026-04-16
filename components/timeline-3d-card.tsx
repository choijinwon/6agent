"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TimelineStep } from "@/types/story";

interface Timeline3DCardProps {
  step: TimelineStep;
  isActive: boolean;
  index: number;
}

export function Timeline3DCard({ step, isActive, index }: Timeline3DCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = -(py - 0.5) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.article
      data-timeline-item="true"
      className={`timeline-item ${isActive ? "is-active" : ""}`}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      initial={
        reduceMotion
          ? undefined
          : {
              opacity: 0,
              y: 56,
              rotateX: -24,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
              rotateX: 0,
            }
      }
      viewport={{ once: false, amount: 0.38 }}
      style={
        reduceMotion
          ? undefined
          : {
              transformStyle: "preserve-3d",
              rotateX: tilt.x,
              rotateY: tilt.y,
              z: isActive ? 24 : 0,
            }
      }
      animate={
        reduceMotion
          ? undefined
          : {
              scale: isActive ? 1.02 : 1,
              y: isActive ? -2 : 0,
              rotateZ: isActive ? 0.22 : 0,
            }
      }
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 24,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.22),
      }}
    >
      <span className="timeline-phase">{step.phase}</span>
      <h3>{step.title}</h3>
      <span className="timeline-owner">{step.owner}</span>
      <p>{step.summary}</p>
      {isActive && step.guide && (
        <div className="timeline-guide">
          <h4>실행 가이드</h4>
          <p>{step.guide.objective}</p>

          <div className="timeline-guide-grid">
            <section>
              <h5>실행 절차</h5>
              <ul>
                {step.guide.process.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h5>산출물</h5>
              <ul>
                {step.guide.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h5>실수 방지 포인트</h5>
              <ul>
                {step.guide.pitfalls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </motion.article>
  );
}
