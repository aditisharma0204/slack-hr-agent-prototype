"use client";

import { useState, useEffect } from "react";
import { UB_NOISE, UB_ESSENTIAL, UB_STEPS } from "@/lib/presentation-data";

interface UnbundlingProps {
  onScenesClick: () => void;
  onBack: () => void;
}

export function Unbundling({ onScenesClick, onBack }: UnbundlingProps) {
  const [ubStep, setUbStep] = useState(0);
  const [dissolvedIds, setDissolvedIds] = useState<Set<string>>(new Set());
  const [crystallizedIds, setCrystallizedIds] = useState<Set<string>>(new Set());
  const [stricken, setStricken] = useState<string[]>([]);

  const currentStep = UB_STEPS[ubStep];
  const progress = (ubStep / (UB_STEPS.length - 1)) * 100;

  useEffect(() => {
    if (!currentStep) return;

    // Handle dissolves
    if (currentStep.dissolve) {
      currentStep.dissolve.forEach((id, i) => {
        setTimeout(() => {
          setDissolvedIds((prev) => new Set([...Array.from(prev), id]));
        }, i * 160);
      });
    }

    // Handle crystallize
    if (currentStep.crystallize) {
      UB_ESSENTIAL.forEach((task, i) => {
        setTimeout(() => {
          setCrystallizedIds((prev) => new Set([...Array.from(prev), task.id]));
        }, i * 100);
      });
    }
  }, [ubStep, currentStep]);

  const handleAdvance = () => {
    if (currentStep?.isLast) {
      onBack();
      return;
    }
    if (ubStep < UB_STEPS.length - 1) {
      setUbStep(ubStep + 1);
    }
  };

  const handleRestart = () => {
    setUbStep(0);
    setDissolvedIds(new Set());
    setCrystallizedIds(new Set());
  };

  const getTaskClassName = (taskId: string, type: "noise" | "essential") => {
    const base = `ub-task ${type}`;
    if (dissolvedIds.has(taskId)) return `${base} dissolving`;
    if (type === "noise" && currentStep?.dissolve?.includes(taskId)) {
      return `${base} striking`;
    }
    if (type === "essential" && crystallizedIds.has(taskId)) {
      return `${base} crystallizing alive`;
    }
    if (type === "essential" && currentStep?.state === "unbundled") {
      return `${base} alive`;
    }
    return base;
  };

  const stateText =
    currentStep?.state === "unbundled"
      ? "Unbundled World"
      : currentStep?.state === "transitioning"
        ? "Unbundling…"
        : "Bundled World";

  return (
    <div
      id="sp-unbundling"
      className="fixed z-[200] flex flex-col overflow-hidden"
      style={{
        top: "40px",
        left: 0,
        right: 0,
        bottom: 0,
        height: "calc(100vh - 40px)",
        backgroundColor: "#040A14",
        display: "flex",
        animation: "pageIn 0.4s ease both",
      }}
    >
      {/* Orbital background */}
      <div className="ub-orbital absolute inset-0 pointer-events-none opacity-[0.12] transition-opacity duration-[1.2s] ease">
        <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle cx="600" cy="350" r="280" stroke="#0176D3" strokeWidth="1.2" fill="none" opacity="0.6" />
          <circle cx="600" cy="350" r="380" stroke="#0176D3" strokeWidth="0.8" fill="none" opacity="0.4" />
          <circle cx="600" cy="350" r="480" stroke="#0176D3" strokeWidth="0.6" fill="none" opacity="0.25" />
        </svg>
      </div>

      {/* Topbar */}
      <div className="ub-topbar h-[52px] flex-shrink-0 flex items-center justify-between px-8 relative z-50" style={{ backgroundColor: "rgba(4,10,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="ub-topbar-left flex items-center gap-4">
          <button className="ub-back flex items-center gap-[5px] bg-transparent border-none font-mono text-[9px] tracking-[0.14em] uppercase cursor-pointer transition-colors duration-150" style={{ color: "rgba(255,255,255,0.28)" }} onClick={onBack} onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}>
            ← Home
          </button>
          <div className="ub-sf-brand flex items-center gap-2">
            <div className="ub-sf-dot w-[7px] h-[7px] rounded-full" style={{ background: "var(--sf-blue)", boxShadow: "0 0 8px rgba(1,118,211,0.6)" }} />
            <div className="ub-title font-mono text-[9px] tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>Project Maestro · The Unbundled Seller</div>
          </div>
        </div>
        <div className={`ub-state font-mono text-[9px] tracking-[0.14em] uppercase transition-colors duration-600 ease ${currentStep?.state === "unbundled" ? "text-[var(--ub-green)]" : currentStep?.state === "bundled" ? "text-[var(--ub-noise)]" : ""}`} style={{ color: currentStep?.state === "unbundled" ? "var(--ub-green)" : currentStep?.state === "bundled" ? "var(--ub-noise)" : "rgba(255,255,255,0.28)" }}>
          {stateText}
        </div>
      </div>

      {/* Headline strip */}
      <div className="ub-headline-strip py-4 px-8 flex-shrink-0 flex items-center gap-[18px] relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(1,118,211,0.04)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "var(--sf-blue)" }} />
        <div className="ub-main-headline font-serif text-[clamp(20px,2.4vw,30px)] font-normal leading-[1.1] flex-shrink-0 transition-all duration-500 ease" dangerouslySetInnerHTML={{ __html: currentStep?.headline || "" }} />
        <div className="ub-headline-sep w-px h-7 flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="ub-main-sub font-mono text-[9.5px] tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.35)" }}>{currentStep?.sub || ""}</div>
      </div>

      {/* Task field */}
      <div className="ub-field flex-1 relative overflow-hidden flex flex-col">
        {/* Glow overlays */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-[1.2s] ease ${currentStep?.state === "unbundled" ? "opacity-100" : "opacity-0"}`} style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(46,132,74,0.04) 0%, transparent 70%)" }} />
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-[1.2s] ease ${currentStep?.state === "bundled" ? "opacity-100" : "opacity-0"}`} style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(215,61,61,0.04) 0%, transparent 70%)" }} />

        {/* Badge */}
        {currentStep?.badge && (
          <div className="ub-badge absolute top-3 right-4 z-20 rounded-full px-3 py-1 font-mono text-[9px] tracking-[0.08em] transition-opacity duration-300 ease" style={{ background: "var(--ub-noise-bg)", border: "1px solid var(--ub-noise-b)", color: "var(--ub-noise)", opacity: ubStep === 0 ? 1 : 0 }}>

            70% of the day — not the real job
          </div>
        )}

        {/* Grid - tight cluster */}
        <div className={`ub-grid flex-1 grid gap-3 px-8 max-w-[1400px] mx-auto overflow-y-auto relative z-[5] ${currentStep?.crystallize ? "items-center justify-center" : "items-start align-content-start"}`} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {UB_NOISE.map((task) => {
            const isStricken = stricken.includes(task.id);
            return (
              <div
                key={task.id}
                className={`${getTaskClassName(task.id, "noise")} ${isStricken ? "opacity-40 scale-95 blur-[1px] grayscale pointer-events-none" : "hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"}`}
                onClick={() => {
                  if (!isStricken && !dissolvedIds.has(task.id)) {
                    setStricken((prev) => [...prev, task.id]);
                  }
                }}
                style={{
                  display: dissolvedIds.has(task.id) ? "none" : "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  lineHeight: "1.4",
                  transition: "opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease, box-shadow 0.3s ease",
                  background: "var(--ub-noise-bg)",
                  border: "1px solid var(--ub-noise-b)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span className="ub-task-icon opacity-40 text-[13px] flex-shrink-0 w-4 mt-[1px]">{task.icon}</span>
                <span 
                  className="ub-task-text text-[10.5px] relative"
                  style={{
                    position: "relative",
                  }}
                >
                  {task.text}
                  <span
                    className="absolute top-1/2 left-0 h-[2px] bg-[#D73D3D] transition-all duration-[400ms] ease-out"
                    style={{
                      width: isStricken ? "100%" : "0%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </span>
              </div>
            );
          })}
          {UB_ESSENTIAL.map((task) => (
            <div
              key={task.id}
              className={getTaskClassName(task.id, "essential")}
              style={{
                display: crystallizedIds.has(task.id) || currentStep?.state === "unbundled" ? "flex" : "none",
                alignItems: "flex-start",
                gap: "8px",
                borderRadius: "8px",
                padding: "10px 12px",
                lineHeight: "1.4",
                opacity: crystallizedIds.has(task.id) || currentStep?.state === "unbundled" ? 1 : 0,
                pointerEvents: crystallizedIds.has(task.id) || currentStep?.state === "unbundled" ? "auto" : "none",
                background: "var(--ub-green-bg)",
                border: "1px solid var(--ub-green-b)",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              <span className="ub-task-icon opacity-100 text-sm flex-shrink-0 w-[18px] mt-[1px]">{task.icon}</span>
              <span className="ub-task-text text-[11px] font-normal">{task.text}</span>
            </div>
          ))}
        </div>

        {/* Transition overlay */}
        {currentStep?.showTransition && (
          <div className="ub-transition absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-500 ease" style={{ background: "#040A14", opacity: currentStep?.showTransition ? 1 : 0, pointerEvents: currentStep?.showTransition ? "all" : "none" }}>
            <div className="ub-t-label font-mono text-[9.5px] tracking-[0.2em] uppercase mb-[14px] opacity-0" style={{ color: "var(--sf-blue-li)", animation: "up 0.6s 0.2s ease both" }}>AI takes the mechanical</div>
            <div className="ub-t-head font-serif text-[clamp(28px,4vw,50px)] italic text-center leading-[1.15] mb-[10px] opacity-0" style={{ animation: "up 0.7s 0.4s ease both" }}>
              What remains<br />is the <em style={{ color: "#1B96FF" }}>real work.</em>
            </div>
            <div className="ub-t-sub font-mono text-[10px] tracking-[0.06em] text-center opacity-0" style={{ color: "rgba(255,255,255,0.35)", animation: "up 0.6s 0.6s ease both" }}>// The seller's job — always was — was human</div>
          </div>
        )}

        {/* Stats */}
        {currentStep?.celebrate && (
          <div className="ub-stats absolute inset-0 z-25 flex items-center justify-center gap-[14px] transition-opacity duration-800 ease p-6" style={{ opacity: currentStep?.celebrate ? 1 : 0, pointerEvents: currentStep?.celebrate ? "all" : "none" }}>
            {[
              { n: "70%", l: "of time was\nmechanical work" },
              { n: "12.5h", l: "saved per\nweek" },
              { n: "126%", l: "quota when\nhuman work wins" },
              { n: "$631K", l: "closed without\nopening SFDC", gold: true },
            ].map((stat, i) => (
              <div key={i} className="ub-stat text-center rounded-[14px] p-6 backdrop-blur-[20px] border-t-2" style={{ background: "var(--sf-blue-bg)", border: "1px solid var(--sf-blue-b)", borderTopColor: stat.gold ? "var(--gold)" : "var(--sf-blue)", animation: `ubFloat 4s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
                <div className={`ub-stat-n font-serif text-4xl font-normal leading-none mb-2 ${stat.gold ? "text-[var(--gold)]" : "text-[var(--sf-blue-li)]"}`}>{stat.n}</div>
                <div className="ub-stat-l font-mono text-[8.5px] tracking-[0.1em] uppercase leading-[1.5]" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Insight */}
        {currentStep?.insight && (
          <div className="ub-insight absolute bottom-0 left-0 right-0 z-20 text-center pt-[10px] px-8 transition-opacity duration-500 ease pointer-events-none" style={{ background: "linear-gradient(to top, rgba(4,10,20,0.95) 60%, transparent)", opacity: currentStep?.insight ? 1 : 0 }}>
            <div className="ub-insight-q font-serif text-[clamp(13px,1.4vw,16px)] italic leading-[1.5] mb-[3px]" style={{ color: "rgba(27,150,255,0.9)" }}>{currentStep.insight}</div>
            <div className="ub-insight-s font-mono text-[8px] tracking-[0.12em] uppercase pb-[6px]" style={{ color: "rgba(255,255,255,0.25)" }}>{currentStep.insightSub || ""}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="ub-footer h-12 flex-shrink-0 flex items-center px-8 gap-[14px]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,10,20,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="ub-prog-track flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <div className="ub-prog-fill h-full rounded-full transition-all duration-500 ease" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--ub-noise), var(--sf-blue), #3DD68C)" }} />
        </div>
        <div className="ub-step-lbl font-mono text-[8.5px] tracking-[0.1em] uppercase min-w-[44px] text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
          {ubStep + 1} / {UB_STEPS.length}
        </div>
        <button className="ub-btn rounded-[7px] px-[13px] py-1.5 font-mono text-[9px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-[0.13s]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }} onClick={handleRestart} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          ↺ Replay
        </button>
        {currentStep?.showScenesBtn && (
          <button className="ub-btn-scenes flex items-center gap-[6px] rounded-[7px] px-[13px] py-1.5 font-mono text-[9px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-[0.13s]" style={{ background: "rgba(61,214,140,0.1)", color: "#3DD68C", border: "1px solid rgba(61,214,140,0.25)" }} onClick={onScenesClick} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(61,214,140,0.18)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(61,214,140,0.1)"; }}>
            Enter Scenes →
          </button>
        )}
        <button className="ub-btn-next rounded-[7px] px-[13px] py-1.5 font-mono text-[9px] tracking-[0.08em] uppercase font-medium cursor-pointer transition-all duration-[0.13s]" style={{ background: "var(--sf-blue)", color: "#fff", border: "1px solid var(--sf-blue)" }} onClick={handleAdvance} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sf-blue-li)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sf-blue)"; }}>
          {currentStep?.isLast ? "← Back to Home" : "Next →"}
        </button>
      </div>
    </div>
  );
}
