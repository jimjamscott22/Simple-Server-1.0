import { useMemo, useState } from "react";

const tracks = [
  {
    id: "homelab",
    label: "Homelab utility",
    icon: "🏠",
    projects: ["Pi-hole companion", "Tailscale service map", "Jellyfin watch dashboard"],
    proof: "Shows networking awareness, service monitoring, Linux comfort, and practical problem solving.",
  },
  {
    id: "security",
    label: "Security dashboard",
    icon: "🛡️",
    projects: ["Threat feed lite", "Log analyzer", "UFW rule explainer"],
    proof: "Shows defensive thinking, parsing skills, dashboards, and clear technical communication.",
  },
  {
    id: "developer",
    label: "Developer tool",
    icon: "🧰",
    projects: ["Ripgrep GUI", "Snippet vault", "Repo cleanup assistant"],
    proof: "Shows you can build tools that solve your own workflow pain instead of just collecting framework stickers.",
  },
];

const milestones = [
  "README with screenshots",
  "One command local setup",
  "Seed/demo data",
  "Input validation",
  "Error states",
  "Small test suite",
  "Deployment or demo video",
];

export default function PortfolioHomelabRoadmap() {
  const [trackId, setTrackId] = useState("homelab");
  const [done, setDone] = useState({});
  const active = useMemo(() => tracks.find((track) => track.id === trackId) || tracks[0], [trackId]);
  const count = Object.values(done).filter(Boolean).length;

  return (
    <main className="roadmap-page">
      <style>{`
        .roadmap-page {
          min-height: 100vh;
          padding: 40px;
          background:
            linear-gradient(120deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.92)),
            radial-gradient(circle at 20% 10%, rgba(20, 184, 166, 0.35), transparent 28rem);
          color: #f9fafb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .wrap { max-width: 1120px; margin: 0 auto; }
        .hero, .panel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(2, 6, 23, 0.58);
          border-radius: 30px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
        }
        .hero { padding: 34px; }
        .eyebrow { color: #5eead4; letter-spacing: 0.16em; text-transform: uppercase; font-size: 0.78rem; margin: 0 0 12px; }
        h1 { font-size: clamp(2rem, 5vw, 4.5rem); line-height: 0.98; margin: 0; max-width: 900px; }
        .lede { color: #ccfbf1; line-height: 1.7; max-width: 78ch; font-size: 1.05rem; }
        .track-buttons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 22px; }
        button {
          cursor: pointer;
          border: 1px solid rgba(94, 234, 212, 0.22);
          background: rgba(15, 23, 42, 0.72);
          color: #f9fafb;
          border-radius: 22px;
          padding: 18px;
          font-weight: 900;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        button:hover { transform: translateY(-2px); border-color: #5eead4; }
        button.active { background: linear-gradient(135deg, rgba(20, 184, 166, 0.42), rgba(59, 130, 246, 0.22)); border-color: #99f6e4; }
        .icon { display: block; font-size: 2rem; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 22px; margin-top: 24px; }
        .panel { padding: 24px; }
        .project-strip { display: grid; gap: 12px; margin: 18px 0; }
        .project-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 18px;
          padding: 16px;
          background: rgba(15, 23, 42, 0.62);
        }
        .node {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(20, 184, 166, 0.2);
          color: #99f6e4;
          font-weight: 900;
        }
        .project-card strong { display: block; }
        .project-card span, .panel p, .check span { color: #ccfbf1; line-height: 1.55; }
        .diagram {
          margin-top: 16px;
          min-height: 220px;
          border-radius: 22px;
          border: 1px dashed rgba(94, 234, 212, 0.28);
          background:
            linear-gradient(90deg, rgba(94, 234, 212, 0.08) 1px, transparent 1px),
            linear-gradient(rgba(94, 234, 212, 0.08) 1px, transparent 1px);
          background-size: 26px 26px;
          position: relative;
          overflow: hidden;
        }
        .bubble {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(153, 246, 228, 0.42);
          background: rgba(2, 6, 23, 0.84);
          padding: 12px 14px;
          font-weight: 900;
        }
        .bubble:nth-child(1) { left: 7%; top: 16%; }
        .bubble:nth-child(2) { left: 38%; top: 42%; }
        .bubble:nth-child(3) { right: 7%; top: 20%; }
        .path {
          position: absolute;
          left: 14%;
          right: 14%;
          top: 50%;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #5eead4, #60a5fa);
          transform: rotate(-6deg);
        }
        .checklist { display: grid; gap: 10px; }
        .check {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        input { width: 18px; height: 18px; accent-color: #14b8a6; }
        .score {
          display: grid;
          place-items: center;
          min-height: 120px;
          border-radius: 22px;
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(94, 234, 212, 0.18);
          margin-bottom: 18px;
          text-align: center;
        }
        .score strong { font-size: 2.6rem; color: #99f6e4; }
        @media (max-width: 900px) {
          .roadmap-page { padding: 22px; }
          .track-buttons, .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Portfolio roadmap</p>
          <h1>Turn tinkering into proof employers can understand</h1>
          <p className="lede">
            The best personal projects are tiny arguments: "I can learn, build, document, and solve real problems." Pick a track, follow the proof checklist, and turn your repo into a little neon billboard for your skills.
          </p>
          <div className="track-buttons">
            {tracks.map((track) => (
              <button key={track.id} className={active.id === track.id ? "active" : ""} onClick={() => setTrackId(track.id)}>
                <span className="icon">{track.icon}</span>
                {track.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid">
          <article className="panel">
            <p className="eyebrow">Selected track</p>
            <h2>{active.icon} {active.label}</h2>
            <p>{active.proof}</p>
            <div className="project-strip">
              {active.projects.map((project, index) => (
                <div className="project-card" key={project}>
                  <div className="node">{index + 1}</div>
                  <div>
                    <strong>{project}</strong>
                    <span>Build the tiny version, then add one impressive stretch feature.</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="diagram" aria-label="Idea to repo to portfolio diagram">
              <div className="path" />
              <div className="bubble">Idea</div>
              <div className="bubble">Working repo</div>
              <div className="bubble">Portfolio proof</div>
            </div>
          </article>

          <aside className="panel">
            <div className="score">
              <div>
                <strong>{count}/{milestones.length}</strong>
                <div>portfolio proof points</div>
              </div>
            </div>
            <div className="checklist">
              {milestones.map((item) => (
                <label className="check" key={item}>
                  <span>{item}</span>
                  <input type="checkbox" checked={Boolean(done[item])} onChange={(event) => setDone({ ...done, [item]: event.target.checked })} />
                </label>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
