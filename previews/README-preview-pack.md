# Simple-Server Guide Preview Pack

Drop these files directly into your `previews/` directory:

```text
previews/
├── terminal-ai-agent-field-guide.tsx
├── practice-project-builder.tsx
├── portfolio-homelab-roadmap.jsx
└── agent-workflow-cheatsheet.html
```

Then run:

```bash
npm run dev
```

Open the dashboard at `http://localhost:3000` and click each preview.

## Files

| File | Topic | Type |
|---|---|---|
| `terminal-ai-agent-field-guide.tsx` | Building apps with terminal AI agents | Interactive TSX guide |
| `practice-project-builder.tsx` | Developing practice projects for coding experience | Interactive TSX project picker |
| `portfolio-homelab-roadmap.jsx` | Turning homelab/tooling projects into portfolio proof | Interactive JSX roadmap |
| `agent-workflow-cheatsheet.html` | Terminal AI agent workflow cheatsheet | Standalone HTML page |

## Notes

- The React files default-export components, matching Simple-Server's preview requirement.
- The pages use embedded CSS, so they do not need Tailwind classes or extra assets.
- The HTML file is standalone and includes its own CSS and JavaScript.
