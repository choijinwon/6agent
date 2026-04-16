"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Timeline3DCard } from "@/components/timeline-3d-card";
import { TIMELINE_STEPS } from "@/data/story-data";

export default function TimelinePage() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeStep = TIMELINE_STEPS[activeTimelineIndex];
  const progress = ((activeTimelineIndex + 1) / TIMELINE_STEPS.length) * 100;

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>프로젝트 타임라인</h2>
        <p>
          스크롤 강조 대신 단계 버튼으로 진행 흐름을 선택해서 확인할 수 있습니다.
        </p>
      </div>

      <div className="timeline-page-shell">
        <section className="timeline-stage-head">
          <div className="timeline-step-progress">
            <span>
              Step {activeTimelineIndex + 1} / {TIMELINE_STEPS.length}
            </span>
            <strong>{activeStep.title}</strong>
          </div>
          <div className="timeline-progress-track" aria-hidden="true">
            <motion.div
              className="timeline-progress-fill"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </section>

        <div className="timeline-tabs">
          {TIMELINE_STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`timeline-tab ${index === activeTimelineIndex ? "is-active" : ""}`}
              onClick={() => setActiveTimelineIndex(index)}
            >
              {step.phase}
            </button>
          ))}
        </div>

        <div className="timeline-nav-row">
          <button
            type="button"
            className="timeline-tab"
            onClick={() => setActiveTimelineIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeTimelineIndex === 0}
          >
            이전 단계
          </button>
          <button
            type="button"
            className="timeline-tab"
            onClick={() =>
              setActiveTimelineIndex((prev) => Math.min(TIMELINE_STEPS.length - 1, prev + 1))
            }
            disabled={activeTimelineIndex === TIMELINE_STEPS.length - 1}
          >
            다음 단계
          </button>
        </div>

        <div className="timeline-single">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={reduceMotion ? undefined : { duration: 0.28, ease: "easeOut" }}
            >
              <Timeline3DCard
                step={activeStep}
                index={activeTimelineIndex}
                isActive
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
