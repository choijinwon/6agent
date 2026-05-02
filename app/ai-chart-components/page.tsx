"use client";

import { useMemo, useState } from "react";

type ChartMode = "conversion" | "retention" | "risk";
type SampleChart =
  | "lineBar"
  | "donut"
  | "stacked"
  | "heatmap"
  | "sparkline"
  | "radar"
  | "gauge"
  | "waterfall";
type StackedKey = "good" | "neutral" | "risk";

interface PromptPack {
  id: string;
  title: string;
  useCase: string;
  prompt: string;
}

const CHART_DATA: Record<ChartMode, number[]> = {
  conversion: [22, 28, 31, 34, 39, 43, 47],
  retention: [78, 75, 72, 74, 77, 79, 81],
  risk: [14, 18, 12, 9, 16, 11, 8],
};

const MODE_LABELS: Record<ChartMode, string> = {
  conversion: "전환율 예측",
  retention: "리텐션 추이",
  risk: "리스크 경보",
};

const SAMPLE_LABELS: Record<SampleChart, string> = {
  lineBar: "라인 + 바",
  donut: "도넛 분포",
  stacked: "누적 막대",
  heatmap: "히트맵",
  sparkline: "스파크라인",
  radar: "레이더",
  gauge: "게이지",
  waterfall: "워터폴",
};

const DONUT_SEGMENTS = [
  { label: "Organic", value: 34, color: "#aab896" },
  { label: "Paid", value: 26, color: "#79f5c7" },
  { label: "Referral", value: 18, color: "#ffb171" },
  { label: "Direct", value: 22, color: "#f38dff" },
];

const STACKED_DATA = [
  { label: "Week 1", good: 42, neutral: 28, risk: 15 },
  { label: "Week 2", good: 46, neutral: 24, risk: 18 },
  { label: "Week 3", good: 49, neutral: 22, risk: 14 },
  { label: "Week 4", good: 55, neutral: 20, risk: 11 },
];
const STACKED_SERIES: { key: StackedKey; label: string; colorClass: string }[] = [
  { key: "good", label: "Good", colorClass: "good" },
  { key: "neutral", label: "Neutral", colorClass: "neutral" },
  { key: "risk", label: "Risk", colorClass: "risk" },
];

const HEATMAP_DATA = [
  [12, 18, 24, 33, 22, 16, 10],
  [15, 22, 29, 38, 25, 17, 12],
  [11, 20, 31, 41, 28, 21, 14],
  [9, 16, 25, 32, 21, 14, 8],
];

const SPARK_CARDS = [
  { label: "CTR", values: [2.1, 2.4, 2.3, 2.8, 3.1, 3.0, 3.4], trend: "+0.7%" },
  { label: "Activation", values: [28, 31, 30, 33, 35, 37, 39], trend: "+11%" },
  { label: "Churn Risk", values: [16, 15, 14, 13, 12, 11, 10], trend: "-6%" },
];

const RADAR_LABELS = ["UX", "Speed", "A11y", "Quality", "Retention", "ROI"];
const RADAR_VALUES = [82, 74, 79, 88, 71, 85];

const WATERFALL_DATA = [
  { label: "Base", value: 100, type: "base" as const },
  { label: "AI 추천", value: 18, type: "inc" as const },
  { label: "UX 개선", value: 14, type: "inc" as const },
  { label: "버그 영향", value: -9, type: "dec" as const },
  { label: "최종", value: 123, type: "total" as const },
];

const CHART_PROMPT_PACKS: PromptPack[] = [
  {
    id: "create",
    title: "신규 AI 차트 컴포넌트 생성",
    useCase: "새로운 대시보드 화면에 차트 UI를 처음 만들 때",
    prompt: `너는 시니어 프론트엔드 엔지니어다.
React + TypeScript + CSS modules(또는 Tailwind) 기준으로 AI 차트 컴포넌트를 설계/구현해줘.

[요구사항]
1) 차트 타입: line, bar, donut, radar, heatmap
2) 공통 props:
   - title: string
   - description?: string
   - data: number[] | Record<string, number>
   - labels?: string[]
   - onPointHover?: (payload) => void
3) 접근성:
   - aria-label, 키보드 포커스, 색상 대비 준수
4) 기능:
   - legend 토글
   - tooltip
   - empty/loading state
5) 결과물:
   - 컴포넌트 코드
   - 타입 정의
   - 사용 예제
   - 성능/확장 포인트 설명`,
  },
  {
    id: "improve",
    title: "기존 차트 컴포넌트 개선",
    useCase: "이미 만든 차트에 구조화/재사용성을 올릴 때",
    prompt: `현재 차트 코드를 리팩터링해줘.

[개선 목표]
- 차트별 중복 로직 제거
- Tooltip/Legend/Theme를 공통 훅으로 분리
- 데이터 변환 유틸 분리 (linePath, radarPath, arcPath)
- 반응형 레이아웃 개선
- 테스트 가능한 구조로 함수 분리

[출력 형식]
1) 문제점 진단 5개
2) 리팩터링 후 파일 구조
3) 핵심 코드 diff 형태
4) 테스트 시나리오 5개`,
  },
  {
    id: "connect",
    title: "실데이터/API 연동 프롬프트",
    useCase: "차트를 하드코딩이 아닌 API 데이터로 연결할 때",
    prompt: `다음 차트 화면을 실데이터와 연동해줘.

[환경]
- Next.js App Router
- /api/analytics endpoint 제공
- 응답: { series: number[], labels: string[], summary: { ... } }

[요구사항]
1) 서버 fetch + 캐싱 전략 제안
2) 로딩/에러/재시도 UX 구현
3) 데이터 검증(zod) 추가
4) 값 이상치(outlier) 강조 표시
5) 컴포넌트 props와 API 모델 매핑 표 제공

최종적으로 page.tsx 예시와 chart component 예시를 함께 작성해줘.`,
  },
];

function buildLinePath(values: number[]) {
  const width = 520;
  const height = 180;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildSparkPath(values: number[]) {
  const width = 170;
  const height = 52;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function polarPoint(cx: number, cy: number, radius: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function buildRadarPath(values: number[]) {
  const center = { x: 110, y: 110 };
  const maxRadius = 78;
  const maxValue = 100;
  return values
    .map((value, index) => {
      const radius = (value / maxValue) * maxRadius;
      const point = polarPoint(center.x, center.y, radius, index, values.length);
      return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

export default function AiChartComponentsPage() {
  const [seriesData, setSeriesData] = useState<Record<ChartMode, number[]>>(CHART_DATA);
  const [mode, setMode] = useState<ChartMode>("conversion");
  const [sampleChart, setSampleChart] = useState<SampleChart>("lineBar");
  const [disabledDonut, setDisabledDonut] = useState<string[]>([]);
  const [disabledStacked, setDisabledStacked] = useState<StackedKey[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [editableSeriesText, setEditableSeriesText] = useState(CHART_DATA.conversion.join(", "));
  const [radarValues, setRadarValues] = useState(RADAR_VALUES);
  const [editableRadarText, setEditableRadarText] = useState(RADAR_VALUES.join(", "));
  const [gaugeScore, setGaugeScore] = useState(75);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const values = seriesData[mode];
  const path = useMemo(() => buildLinePath(values), [values]);
  const radarPath = useMemo(() => buildRadarPath(radarValues), [radarValues]);
  const linePoints = useMemo(() => {
    const width = 520;
    const height = 180;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return { x, y, value, day: index + 1 };
    });
  }, [values]);

  const donutArcs = useMemo(() => {
    const visibleSegments = DONUT_SEGMENTS.filter((segment) => !disabledDonut.includes(segment.label));
    if (!visibleSegments.length) {
      return [];
    }
    const total = visibleSegments.reduce((acc, item) => acc + item.value, 0);

    return visibleSegments.map((segment, index) => {
      const prevValue = visibleSegments.slice(0, index).reduce((acc, item) => acc + item.value, 0);
      const start = (prevValue / total) * 360;
      const end = ((prevValue + segment.value) / total) * 360;

      return {
        ...segment,
        d: describeArc(80, 80, 58, start, end),
      };
    });
  }, [disabledDonut]);

  const toggleDonut = (label: string) => {
    setDisabledDonut((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const toggleStacked = (key: StackedKey) => {
    setDisabledStacked((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const applySeriesValues = () => {
    const parsed = editableSeriesText
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((num) => Number.isFinite(num));

    if (parsed.length < 3) {
      return;
    }

    setSeriesData((prev) => ({ ...prev, [mode]: parsed }));
  };

  const applyRadarValues = () => {
    const parsed = editableRadarText
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((num) => Number.isFinite(num))
      .slice(0, RADAR_LABELS.length);

    if (parsed.length !== RADAR_LABELS.length) {
      return;
    }

    setRadarValues(parsed);
  };

  const copyPrompt = async (pack: PromptPack) => {
    try {
      await navigator.clipboard.writeText(pack.prompt);
      setCopiedPromptId(pack.id);
      window.setTimeout(() => setCopiedPromptId(null), 1600);
    } catch {
      setCopiedPromptId(null);
    }
  };

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>AI 차트 컴포넌트</h2>
        <p>
          AI 분석 결과를 제품 UI에 바로 반영할 수 있도록 예측선, 비교 막대,
          리스크 카드 샘플을 제공합니다.
        </p>
      </div>

      <div className="template-row">
        {Object.entries(MODE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`timeline-tab ${mode === key ? "is-active" : ""}`}
            onClick={() => setMode(key as ChartMode)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="template-row">
        {Object.entries(SAMPLE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`timeline-tab ${sampleChart === key ? "is-active" : ""}`}
            onClick={() => setSampleChart(key as SampleChart)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="chart-editor">
        <h3>AI 생성 프롬프트</h3>
        <div className="prompt-pack-grid">
          {CHART_PROMPT_PACKS.map((pack) => (
            <article key={pack.id} className="prompt-pack-card">
              <small>{pack.useCase}</small>
              <h4>{pack.title}</h4>
              <pre>{pack.prompt}</pre>
              <button type="button" className="timeline-tab is-active" onClick={() => copyPrompt(pack)}>
                {copiedPromptId === pack.id ? "복사 완료" : "프롬프트 복사"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="chart-editor">
        <h3>샘플 데이터 편집</h3>
        <div className="chart-editor-grid">
          <label>
            {MODE_LABELS[mode]} 값 (CSV)
            <input
              value={editableSeriesText}
              onChange={(event) => setEditableSeriesText(event.target.value)}
              placeholder="예: 22, 28, 31, 34"
            />
            <button type="button" className="timeline-tab is-active" onClick={applySeriesValues}>
              모드 데이터 적용
            </button>
          </label>

          <label>
            레이더 값 (6개 CSV: UX, Speed, A11y, Quality, Retention, ROI)
            <input
              value={editableRadarText}
              onChange={(event) => setEditableRadarText(event.target.value)}
              placeholder="예: 82, 74, 79, 88, 71, 85"
            />
            <button type="button" className="timeline-tab is-active" onClick={applyRadarValues}>
              레이더 데이터 적용
            </button>
          </label>

          <label>
            게이지 스코어: {gaugeScore}
            <input
              type="range"
              min={0}
              max={100}
              value={gaugeScore}
              onChange={(event) => setGaugeScore(Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="chart-panel">
        <div className="chart-head">
          <h3>{MODE_LABELS[mode]}</h3>
          <span>최근 7일 AI 인사이트</span>
        </div>

        <div className="chart-viewport">
          <svg
            viewBox="0 0 520 180"
            className="line-chart"
            aria-label="AI line chart"
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#aab896" />
                <stop offset="100%" stopColor="#79f5c7" />
              </linearGradient>
            </defs>
            <path d={path} fill="none" stroke="url(#chartLine)" strokeWidth="4" strokeLinecap="round" />
            {linePoints.map((point) => (
              <circle
                key={`point-${point.day}`}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#dfe5ff"
                stroke="#aab896"
                strokeWidth="2"
                onMouseEnter={() =>
                  setTooltip({
                    x: point.x / 520,
                    y: point.y / 180,
                    text: `Day ${point.day}: ${point.value}`,
                  })
                }
              />
            ))}
          </svg>
          {tooltip && (
            <div
              className="chart-tooltip"
              style={{
                left: `${Math.max(8, Math.min(94, tooltip.x * 100))}%`,
                top: `${Math.max(8, Math.min(88, tooltip.y * 100))}%`,
              }}
            >
              {tooltip.text}
            </div>
          )}
        </div>

        <div className="bar-grid">
          {values.map((value, index) => (
            <div key={`${mode}-${index}`} className="bar-item">
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(8, value)}%` }}
                  onMouseEnter={() =>
                    setTooltip({
                      x: ((index + 0.5) / values.length) * 0.92,
                      y: 0.82,
                      text: `Bar D${index + 1}: ${value}`,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                ></div>
              </div>
              <small>D{index + 1}</small>
            </div>
          ))}
        </div>
      </section>

      {sampleChart === "donut" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>도넛 분포 샘플</h3>
            <span>유입 채널 비중</span>
          </div>
          <div className="donut-layout">
            <svg viewBox="0 0 160 160" className="donut-chart" aria-label="AI donut chart">
              <circle cx="80" cy="80" r="58" fill="none" stroke="rgb(255 255 255 / 8%)" strokeWidth="14" />
              {donutArcs.map((arc) => (
                <path
                  key={arc.label}
                  d={arc.d}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  onMouseEnter={() =>
                    setTooltip({
                      x: 0.5,
                      y: 0.52,
                      text: `${arc.label}: ${arc.value}%`,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </svg>
            <ul className="donut-legend">
              {DONUT_SEGMENTS.map((segment) => (
                <li key={segment.label} className={disabledDonut.includes(segment.label) ? "disabled" : ""}>
                  <i style={{ backgroundColor: segment.color }}></i>
                  <span>{segment.label}</span>
                  <strong>{segment.value}%</strong>
                  <button type="button" onClick={() => toggleDonut(segment.label)}>
                    {disabledDonut.includes(segment.label) ? "표시" : "숨김"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sampleChart === "stacked" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>누적 막대 샘플</h3>
            <span>주차별 상태 비중</span>
          </div>
          <div className="stacked-grid">
            <div className="template-row compact">
              {STACKED_SERIES.map((series) => (
                <button
                  key={series.key}
                  type="button"
                  className={`timeline-tab ${disabledStacked.includes(series.key) ? "" : "is-active"}`}
                  onClick={() => toggleStacked(series.key)}
                >
                  {series.label}
                </button>
              ))}
            </div>
            {STACKED_DATA.map((row) => (
              <div key={row.label} className="stacked-row">
                <small>{row.label}</small>
                <div className="stacked-track">
                  {!disabledStacked.includes("good") && (
                    <div
                      className="seg good"
                      style={{ width: `${row.good}%` }}
                      onMouseEnter={() => setTooltip({ x: 0.5, y: 0.86, text: `${row.label} Good: ${row.good}` })}
                      onMouseLeave={() => setTooltip(null)}
                    ></div>
                  )}
                  {!disabledStacked.includes("neutral") && (
                    <div
                      className="seg neutral"
                      style={{ width: `${row.neutral}%` }}
                      onMouseEnter={() =>
                        setTooltip({ x: 0.5, y: 0.86, text: `${row.label} Neutral: ${row.neutral}` })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    ></div>
                  )}
                  {!disabledStacked.includes("risk") && (
                    <div
                      className="seg risk"
                      style={{ width: `${row.risk}%` }}
                      onMouseEnter={() => setTooltip({ x: 0.5, y: 0.86, text: `${row.label} Risk: ${row.risk}` })}
                      onMouseLeave={() => setTooltip(null)}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sampleChart === "heatmap" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>히트맵 샘플</h3>
            <span>요일/시간대 활동 밀도</span>
          </div>
          <div className="heatmap">
            {HEATMAP_DATA.flatMap((row, rIdx) =>
              row.map((value, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="heat-cell"
                  style={{ opacity: Math.max(0.2, value / 45) }}
                  onMouseEnter={() =>
                    setTooltip({
                      x: ((cIdx + 0.5) / 7) * 0.92,
                      y: ((rIdx + 0.5) / 4) * 0.84,
                      text: `slot ${rIdx + 1}-${cIdx + 1}: ${value}`,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                ></div>
              )),
            )}
          </div>
        </section>
      )}

      {sampleChart === "sparkline" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>스파크라인 샘플</h3>
            <span>핵심 KPI 미니 트렌드</span>
          </div>
          <div className="spark-grid">
            {SPARK_CARDS.map((card) => (
              <article key={card.label} className="spark-card">
                <div>
                  <small>{card.label}</small>
                  <strong>{card.trend}</strong>
                </div>
                <svg viewBox="0 0 170 52" className="spark-svg" aria-label={`${card.label} sparkline`}>
                  <path
                    d={buildSparkPath(card.values)}
                    fill="none"
                    stroke="url(#chartLine)"
                    strokeWidth="3"
                    onMouseEnter={() =>
                      setTooltip({
                        x: 0.52,
                        y: 0.9,
                        text: `${card.label}: ${card.values[card.values.length - 1]} (${card.trend})`,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                </svg>
              </article>
            ))}
          </div>
        </section>
      )}

      {sampleChart === "radar" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>레이더 차트 샘플</h3>
            <span>역량/품질 다축 비교</span>
          </div>
          <div className="radar-layout">
            <svg viewBox="0 0 220 220" className="radar-chart" aria-label="AI radar chart">
              {[1, 2, 3, 4].map((level) => (
                <polygon
                  key={level}
                  points={RADAR_LABELS.map((_, idx) => {
                    const p = polarPoint(110, 110, level * 20, idx, RADAR_LABELS.length);
                    return `${p.x},${p.y}`;
                  }).join(" ")}
                  fill="none"
                  stroke="rgb(255 255 255 / 10%)"
                />
              ))}
              {RADAR_LABELS.map((label, idx) => {
                const p = polarPoint(110, 110, 92, idx, RADAR_LABELS.length);
                return (
                  <text key={label} x={p.x} y={p.y} textAnchor="middle" className="radar-label">
                    {label}
                  </text>
                );
              })}
              <path d={radarPath} className="radar-shape" />
            </svg>
            <ul className="response-list">
              {RADAR_LABELS.map((label, idx) => (
                <li key={label}>
                  {label}: {radarValues[idx]}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sampleChart === "gauge" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>게이지 차트 샘플</h3>
            <span>AI 헬스 스코어</span>
          </div>
          <div className="gauge-wrap">
            <svg viewBox="0 0 240 140" className="gauge-chart" aria-label="AI gauge chart">
              <path d={describeArc(120, 120, 90, 180, 360)} className="gauge-track" />
              <path
                d={describeArc(120, 120, 90, 180, 180 + gaugeScore * 1.8)}
                className="gauge-fill"
              />
              <circle cx="120" cy="120" r="6" fill="#dfe5ff" />
              <line
                x1="120"
                y1="120"
                x2={120 + 66 * Math.cos(((gaugeScore * 1.8 - 90) * Math.PI) / 180)}
                y2={120 + 66 * Math.sin(((gaugeScore * 1.8 - 90) * Math.PI) / 180)}
                className="gauge-needle"
              />
              <text x="120" y="108" textAnchor="middle" className="gauge-value">
                {gaugeScore}
              </text>
            </svg>
            <p>현재 릴리즈 헬스 점수는 양호하며, 성능 구간 최적화 시 80+ 진입 가능</p>
          </div>
        </section>
      )}

      {sampleChart === "waterfall" && (
        <section className="chart-panel">
          <div className="chart-head">
            <h3>워터폴 차트 샘플</h3>
            <span>지표 기여도 분석</span>
          </div>
          <div className="waterfall-grid">
            {WATERFALL_DATA.map((item) => (
              <div key={item.label} className="waterfall-item">
                <div
                  className={`waterfall-bar ${item.type}`}
                  style={{ height: `${Math.max(12, Math.abs(item.value))}%` }}
                ></div>
                <small>{item.label}</small>
                <strong>{item.value > 0 ? `+${item.value}` : item.value}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="chart-metrics">
        <article className="metric-card">
          <small>AI 요약</small>
          <h4>핵심 지표 변화</h4>
          <p>{mode === "risk" ? "경보 강도 감소 추세" : "상향 추세가 유지되고 있습니다."}</p>
        </article>
        <article className="metric-card">
          <small>추천 액션</small>
          <h4>다음 실험</h4>
          <p>상위 변동 구간을 대상으로 A/B 실험을 실행해 원인 가설을 검증하세요.</p>
        </article>
        <article className="metric-card">
          <small>주의 포인트</small>
          <h4>리스크 감시</h4>
          <p>주말 트래픽 구간에서 변동성이 높아 임계치 재조정이 필요합니다.</p>
        </article>
      </section>
    </main>
  );
}
