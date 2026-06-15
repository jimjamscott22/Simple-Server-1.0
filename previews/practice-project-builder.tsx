import { useMemo, useState } from "react";

type Difficulty = "starter" | "builder" | "portfolio";
type Track = "automation" | "web" | "security" | "data";

type Project = {
  title: string;
  track: Track;
  difficulty: Difficulty;
  stack: string;
  outcome: string;
  stretch: string;
};

const projects: Project[] = [
  {
    title: "Repo Health Dashboard",
    track: "automation",
    difficulty: "builder",
    stack: "Python, FastAPI, SQLite, GitHub API",
    outcome: "Scan local repos for stale branches, missing READMEs, TODOs, and dependency age.",
    stretch: "Add charts and a weekly digest email draft.",
  },
  {
    title: "Personal Snippet Vault",
    track: "web",
    difficulty: "starter",
    stack: "Next.js, TypeScript, SQLite",
    outcome: "Save useful commands, code snippets, notes, and tags in one searchable place.",
    stretch: "Add fuzzy search and import from markdown files.",
  },
  {
    title: "Homelab Uptime Wall",
    track: "security",
    difficulty: "portfolio",
    stack: "React, FastAPI, Docker, Uptime Kuma API",
    outcome: "Display service health for Pi-hole, Jellyfin, Vaultwarden, and app ports.",
    stretch: "Add incident notes and Tailscale-only access.",
  },
  {
    title: "Coding Exercise Bank",
    track: "web",
    difficulty: "portfolio",
    stack: "Next.js, Prisma, PostgreSQL",
    outcome: "Build a searchable practice bank with difficulty, hints, test cases, and progress.",
    stretch: "Add AI-generated hints that unlock gradually.",
  },
  {
    title: "Log Goblin Tamer",
    track: "data",
    difficulty: "builder",
    stack: "Python, Pandas, Rich CLI",
    outcome: "Parse messy logs into summaries, timelines, and suspicious event clusters.",
    stretch: "Add a tiny web UI for uploading logs.",
  },
  {
    title: "CLI Backup Buddy",
    track: "automation",
    difficulty: "starter",
    stack: "Python, Typer, Cron",
    outcome: "Back up chosen folders, timestamp archives, and report what changed.",
    stretch: "Add restic or rclone support.",
  },
];

const difficultyLabels: Record<Difficulty | "all", string> = {
  all: "All levels",
  starter: "Starter",
  builder: "Builder",
  portfolio: "Portfolio-grade",
};

const trackLabels: Record<Track | "all", string> = {
  all: "All tracks",
  automation: "Automation",
  web: "Web apps",
  security: "Security / homelab",
  data: "Data tools",
};

export default function PracticeProjectBuilder() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [track, setTrack] = useState<Track | "all">("all");
  const [selected, setSelected] = useState(projects[0]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const difficultyMatch = difficulty === "all" || project.difficulty === difficulty;
      const trackMatch = track === "all" || project.track === track;
      return difficultyMatch && trackMatch;
    });
  }, [difficulty, track]);

  const phases = [
    { title: "Clone", detail: "Start from a tiny version that works locally." },
    { title: "Shape", detail: "Add real data, real inputs, and annoying edge cases." },
    { title: "Polish", detail: "Improve empty states, loading states, keyboard flow, and docs." },
    { title: "Publish", detail: "Deploy or record a demo so employers can see the thing breathe." },
  ];

  return (
    <main className="project-page">
      <style>{`
        .project-page {
          min-height: 100vh;
          padding: 38px;
          background:
            radial-gradient(circle at 15% 10%, rgba(168, 85, 247, 0.24), transparent 28rem),
            radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.20), transparent 30rem),
            linear-gradient(135deg, #0f1020, #131622 48%, #07111f);
          color: #f8fbff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .wrap { max-width: 1180px; margin: 0 auto; }
        .hero {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 32px;
          padding: 34px;
          background: rgba(10, 15, 30, 0.72);
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.34);
        }
        .eyebrow { color: #c4b5fd; letter-spacing: 0.16em; text-transform: uppercase; font-size: 0.78rem; margin: 0 0 12px; }
        h1 { font-size: clamp(2.2rem, 5vw, 4.7rem); line-height: 0.98; max-width: 880px; margin: 0; }
        .lede { color: #dbeafe; font-size: 1.08rem; line-height: 1.72; max-width: 76ch; }
        .controls { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 22px; }
        .control-card, .project-card, .detail-card, .diagram, .phase-card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(15, 23, 42, 0.66);
          border-radius: 24px;
          padding: 22px;
        }
        .control-card h2, .detail-card h2, .diagram h2 { margin: 0 0 14px; }
        .buttons { display: flex; flex-wrap: wrap; gap: 10px; }
        button {
          cursor: pointer;
          border: 1px solid rgba(196, 181, 253, 0.28);
          background: rgba(30, 41, 59, 0.78);
          color: #f8fbff;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 800;
          transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
        }
        button:hover { transform: translateY(-2px); border-color: #c4b5fd; }
        button.active { background: linear-gradient(135deg, rgba(124, 58, 237, 0.72), rgba(59, 130, 246, 0.5)); border-color: #ddd6fe; }
        .layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 20px; margin-top: 22px; }
        .project-list { display: grid; gap: 12px; }
        .project-card { text-align: left; border-radius: 22px; }
        .project-card h3 { margin: 0 0 8px; font-size: 1.1rem; }
        .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .pill { color: #ddd6fe; background: rgba(88, 28, 135, 0.28); border: 1px solid rgba(196, 181, 253, 0.24); padding: 6px 9px; border-radius: 999px; font-size: 0.78rem; }
        .project-card p, .detail-card p, .phase-card p { color: #dbeafe; line-height: 1.55; margin: 0; }
        .selected-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .big-number { font-size: 3.5rem; font-weight: 900; color: #93c5fd; line-height: 1; }
        .stack {
          margin-top: 16px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(2, 6, 23, 0.72);
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
          color: #bfdbfe;
        }
        .diagram { margin-top: 20px; }
        .ladder { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .phase-card { position: relative; min-height: 140px; }
        .phase-card::after {
          content: "➜";
          position: absolute;
          right: -15px;
          top: 48%;
          color: #c4b5fd;
        }
        .phase-card:last-child::after { content: ""; }
        .phase-card strong { display: block; margin-bottom: 8px; font-size: 1.05rem; }
        .matrix { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 14px; }
        .matrix div {
          min-height: 86px;
          border-radius: 18px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(147, 197, 253, 0.18);
          display: grid;
          place-items: center;
          text-align: center;
          padding: 10px;
          color: #bfdbfe;
          font-weight: 800;
        }
        @media (max-width: 900px) {
          .project-page { padding: 22px; }
          .controls, .layout, .ladder, .matrix { grid-template-columns: 1fr; }
          .phase-card::after { content: "↓"; right: 18px; top: auto; bottom: -20px; }
        }
      `}</style>

      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Practice project generator</p>
          <h1>Build coding experience with projects that have teeth</h1>
          <p className="lede">
            Random tutorials are snacks. Portfolio projects are meals. Use this page to filter ideas, pick one, and turn it into a clean repo with a demo, screenshots, tests, and a README that does not mumble.
          </p>

          <div className="controls">
            <div className="control-card">
              <h2>Difficulty</h2>
              <div className="buttons">
                {(Object.keys(difficultyLabels) as Array<Difficulty | "all">).map((key) => (
                  <button key={key} className={difficulty === key ? "active" : ""} onClick={() => setDifficulty(key)}>
                    {difficultyLabels[key]}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-card">
              <h2>Track</h2>
              <div className="buttons">
                {(Object.keys(trackLabels) as Array<Track | "all">).map((key) => (
                  <button key={key} className={track === key ? "active" : ""} onClick={() => setTrack(key)}>
                    {trackLabels[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="layout">
          <div className="project-list" aria-label="Project ideas">
            {(filtered.length ? filtered : projects).map((project) => (
              <button key={project.title} className={`project-card ${selected.title === project.title ? "active" : ""}`} onClick={() => setSelected(project)}>
                <h3>{project.title}</h3>
                <div className="meta">
                  <span className="pill">{trackLabels[project.track]}</span>
                  <span className="pill">{difficultyLabels[project.difficulty]}</span>
                </div>
                <p>{project.outcome}</p>
              </button>
            ))}
          </div>

          <article className="detail-card">
            <div className="selected-title">
              <div>
                <p className="eyebrow">Selected project</p>
                <h2>{selected.title}</h2>
              </div>
              <span className="big-number">{projects.findIndex((project) => project.title === selected.title) + 1}</span>
            </div>
            <p>{selected.outcome}</p>
            <div className="stack">Stack: {selected.stack}</div>
            <p style={{ marginTop: 16 }}><strong>Stretch goal:</strong> {selected.stretch}</p>

            <div className="diagram">
              <h2>Skill matrix</h2>
              <div className="matrix" aria-label="Skills this project can demonstrate">
                <div>Problem framing</div>
                <div>Data modeling</div>
                <div>UI polish</div>
                <div>Deployment notes</div>
              </div>
            </div>
          </article>
        </section>

        <section className="diagram">
          <h2>Project ladder diagram</h2>
          <div className="ladder">
            {phases.map((phase) => (
              <div className="phase-card" key={phase.title}>
                <strong>{phase.title}</strong>
                <p>{phase.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
