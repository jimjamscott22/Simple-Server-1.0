import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Stage = {
  name: string;
  icon: string;
  command: string;
  goal: string;
  tip: string;
};

type ModeKey = "solo" | "review" | "ship";

const stages: Stage[] = [
  {
    name: "Scope",
    icon: "🎯",
    command: "write SPEC.md",
    goal: "Turn the fuzzy idea into constraints, acceptance criteria, and a tiny first version.",
    tip: "Ask the agent for questions first, not code first. That keeps the robot from sprinting into fog.",
  },
  {
    name: "Plan",
    icon: "🧭",
    command: "create task map",
    goal: "Split the feature into files, steps, risks, and testable checkpoints.",
    tip: "A good plan names the files it will touch and what should stay untouched.",
  },
  {
    name: "Patch",
    icon: "🧩",
    command: "apply small diff",
    goal: "Let the terminal agent modify one slice of the app at a time.",
    tip: "Small diffs are easier to review, easier to revert, and less likely to summon spaghetti gremlins.",
  },
  {
    name: "Verify",
    icon: "🧪",
    command: "npm test && npm run lint",
    goal: "Run the app, inspect the UI, and check that the original requirement still matches reality.",
    tip: "Never trust a green terminal alone. Click the page like a curious raccoon.",
  },
  {
    name: "Ship",
    icon: "🚀",
    command: "git commit",
    goal: "Commit the smallest complete improvement with a message future-you understands.",
    tip: "Write the commit message like a tiny changelog entry, not a cry for help.",
  },
];

const modes: Record<ModeKey, { label: string; prompt: string; emphasis: string[] }> = {
  solo: {
    label: "Solo builder",
    prompt:
      "Act as a careful pair programmer. First inspect the codebase, then propose a small implementation plan before editing.",
    emphasis: ["Learning", "Small commits", "Explain decisions"],
  },
  review: {
    label: "Review captain",
    prompt:
      "Review the current diff for correctness, readability, security, and missed edge cases. Return prioritized fixes.",
    emphasis: ["Bug hunt", "Risk ranking", "No drive-by rewrites"],
  },
  ship: {
    label: "Release helper",
    prompt:
      "Prepare this feature for release. Check docs, tests, environment variables, build output, and rollback notes.",
    emphasis: ["Build confidence", "Docs", "Deployment notes"],
  },
};

export default function TerminalAiAgentFieldGuide() {
  const [activeStage, setActiveStage] = useState(0);
  const [mode, setMode] = useState<ModeKey>("solo");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const completed = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const active = stages[activeStage];
  const selectedMode = modes[mode];

  const checklist = [
    "Create a SPEC.md before code changes",
    "Run the app locally after each meaningful change",
    "Ask for a diff summary before accepting edits",
    "Keep secrets out of prompts and commits",
    "Commit when one feature slice works",
  ];

  return (
    <main className="agent-page">
      <style>{`
        :root { color-scheme: dark; }
        .agent-page {
          min-height: 100vh;
          padding: 40px;
          background:
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.28), transparent 34rem),
            radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.18), transparent 28rem),
            #06110c;
          color: #eafff2;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          align-items: stretch;
        }
        .panel {
          border: 1px solid rgba(134, 239, 172, 0.24);
          background: rgba(3, 15, 9, 0.74);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          border-radius: 28px;
          overflow: hidden;
        }
        .hero-copy { padding: 34px; }
        .eyebrow {
          color: #86efac;
          letter-spacing: 0.18em;
          font-size: 0.78rem;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        h1 {
          font-size: clamp(2.2rem, 5vw, 5rem);
          line-height: 0.92;
          margin: 0;
        }
        .lede {
          color: #b9f6ca;
          font-size: 1.08rem;
          line-height: 1.7;
          max-width: 68ch;
          margin: 22px 0 0;
        }
        .terminal {
          border-radius: 28px;
          background: #020807;
          border: 1px solid rgba(34, 197, 94, 0.28);
          min-height: 100%;
        }
        .bar {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(134, 239, 172, 0.18);
          color: #86efac;
        }
        .dot { width: 12px; height: 12px; border-radius: 999px; background: #22c55e; opacity: 0.8; }
        .dot:nth-child(2) { background: #eab308; }
        .dot:nth-child(3) { background: #ef4444; }
        .term-body { padding: 24px; font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, monospace; }
        .prompt { color: #67e8f9; }
        .line { margin: 0 0 12px; color: #d1fae5; }
        .comment { color: #86efac; opacity: 0.8; }
        .mode-buttons, .stage-grid, .cards, .checklist { display: grid; gap: 14px; }
        .mode-buttons { grid-template-columns: repeat(3, 1fr); margin-top: 24px; }
        button {
          cursor: pointer;
          border: 1px solid rgba(134, 239, 172, 0.28);
          background: rgba(9, 30, 21, 0.88);
          color: #eafff2;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 800;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        button:hover { transform: translateY(-2px); border-color: #86efac; }
        button.active { background: linear-gradient(135deg, rgba(34, 197, 94, 0.42), rgba(14, 165, 233, 0.24)); border-color: #86efac; }
        .section { margin-top: 28px; }
        .section h2 { margin: 0 0 14px; font-size: 1.55rem; }
        .workflow {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .stage {
          position: relative;
          min-height: 148px;
          text-align: left;
          display: grid;
          align-content: start;
          gap: 10px;
        }
        .stage::after {
          content: "→";
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-50%);
          color: #86efac;
          opacity: 0.65;
        }
        .stage:last-child::after { content: ""; }
        .stage-icon { font-size: 1.8rem; }
        .stage-name { font-size: 1.1rem; }
        .stage-command { color: #67e8f9; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.8rem; }
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .detail, .check-card, .mini-card {
          border: 1px solid rgba(134, 239, 172, 0.2);
          border-radius: 24px;
          padding: 24px;
          background: rgba(3, 15, 9, 0.66);
        }
        .big-icon { font-size: 3rem; margin: 0; }
        .goal { color: #d1fae5; line-height: 1.65; }
        .tip { color: #bef264; line-height: 1.6; }
        .prompt-box {
          padding: 18px;
          border-radius: 18px;
          background: rgba(2, 8, 7, 0.88);
          border: 1px dashed rgba(134, 239, 172, 0.3);
          color: #d1fae5;
          line-height: 1.6;
          font-family: "JetBrains Mono", ui-monospace, monospace;
        }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .chip {
          border: 1px solid rgba(103, 232, 249, 0.24);
          color: #a5f3fc;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.85rem;
          background: rgba(8, 47, 73, 0.42);
        }
        .checklist { margin-top: 8px; }
        .check-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(134, 239, 172, 0.18);
          border-radius: 16px;
          padding: 12px 14px;
          background: rgba(6, 17, 12, 0.72);
        }
        .check-row label { line-height: 1.4; }
        input[type="checkbox"] { width: 18px; height: 18px; accent-color: #22c55e; }
        .meter {
          height: 12px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(134, 239, 172, 0.14);
          margin: 12px 0 4px;
        }
        .meter span {
          display: block;
          height: 100%;
          width: var(--progress);
          background: linear-gradient(90deg, #22c55e, #67e8f9);
        }
        .cards { grid-template-columns: repeat(3, 1fr); }
        .mini-card h3 { margin: 0 0 8px; }
        .mini-card p { color: #b9f6ca; line-height: 1.55; margin: 0; }
        @media (max-width: 900px) {
          .agent-page { padding: 22px; }
          .hero, .detail-layout, .workflow, .cards { grid-template-columns: 1fr; }
          .stage::after { content: "↓"; right: 18px; top: auto; bottom: -18px; transform: none; }
        }
      `}</style>

      <div className="shell">
        <section className="hero">
          <div className="panel hero-copy">
            <p className="eyebrow">Simple-Server preview guide</p>
            <h1>Building apps with terminal AI agents</h1>
            <p className="lede">
              A practical field guide for using Codex, Claude Code, OpenCode, or any terminal-side code goblin without letting it bulldoze your repo. The trick is rhythm: scope, plan, patch, verify, ship.
            </p>
            <div className="mode-buttons" aria-label="Agent modes">
              {(Object.keys(modes) as ModeKey[]).map((key) => (
                <button key={key} className={mode === key ? "active" : ""} onClick={() => setMode(key)}>
                  {modes[key].label}
                </button>
              ))}
            </div>
          </div>

          <aside className="terminal" aria-label="Terminal prompt preview">
            <div className="bar"><span className="dot" /><span className="dot" /><span className="dot" /> agent-session.sh</div>
            <div className="term-body">
              <p className="line"><span className="prompt">jamie@legion</span>:~/apps/simple-server$ agent start</p>
              <p className="line comment"># selected mode: {selectedMode.label}</p>
              <p className="line">{selectedMode.prompt}</p>
              <p className="line comment"># emphasis</p>
              {selectedMode.emphasis.map((item) => <p className="line" key={item}>✓ {item}</p>)}
            </div>
          </aside>
        </section>

        <section className="section panel" style={{ padding: 24 }}>
          <h2>Agent workflow diagram</h2>
          <div className="workflow" role="list">
            {stages.map((stage, index) => (
              <button
                key={stage.name}
                className={`stage ${activeStage === index ? "active" : ""}`}
                onClick={() => setActiveStage(index)}
                role="listitem"
              >
                <span className="stage-icon">{stage.icon}</span>
                <span className="stage-name">{stage.name}</span>
                <span className="stage-command">{stage.command}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section detail-layout">
          <article className="detail">
            <p className="big-icon">{active.icon}</p>
            <h2>{active.name}: {active.command}</h2>
            <p className="goal">{active.goal}</p>
            <p className="tip">Pro tip: {active.tip}</p>
          </article>

          <article className="check-card">
            <h2>Safety checklist</h2>
            <p className="goal">Use this before you let an agent touch a repo. Progress: {completed}/{checklist.length}</p>
            <div className="meter" aria-hidden="true"><span style={{ "--progress": `${(completed / checklist.length) * 100}%` } as CSSProperties} /></div>
            <div className="checklist">
              {checklist.map((item) => (
                <div className="check-row" key={item}>
                  <label htmlFor={item}>{item}</label>
                  <input
                    id={item}
                    type="checkbox"
                    checked={Boolean(checked[item])}
                    onChange={(event) => setChecked((prev) => ({ ...prev, [item]: event.target.checked }))}
                  />
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section cards">
          <article className="mini-card">
            <h3>Best first prompt</h3>
            <div className="prompt-box">Inspect this repo and explain the architecture. Do not edit files yet. Ask questions if anything is risky.</div>
          </article>
          <article className="mini-card">
            <h3>Best review prompt</h3>
            <div className="prompt-box">Review the diff against SPEC.md. List bugs, missing tests, confusing names, and security issues.</div>
          </article>
          <article className="mini-card">
            <h3>Best habit</h3>
            <p>Use branches like disposable lab benches. Let agents experiment there, then promote only the code that earns its tiny helmet. 🪖</p>
          </article>
        </section>
      </div>
    </main>
  );
}
