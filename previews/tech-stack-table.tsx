import { useState } from "react";

const stackData = [
  {
    category: "Frontend (Web UI)",
    color: "#00e5ff",
    items: [
      { name: "React", role: "Component-based UI library for building dynamic, stateful interfaces", useCase: "SPAs, dashboards, complex interactive UIs", usedBy: "X, Netflix, Airbnb, Meta" },
      { name: "Vue.js", role: "Progressive UI framework with two-way data binding and gentle learning curve", useCase: "Incremental adoption, fast prototypes, mid-scale apps", usedBy: "Alibaba, GitLab, Adobe" },
      { name: "Angular", role: "Full opinionated framework with built-in DI, routing, and forms", useCase: "Large enterprise apps requiring strict structure", usedBy: "Google, Microsoft, Deutsche Bank" },
      { name: "Svelte", role: "Compile-time framework — ships zero runtime, updates real DOM directly", useCase: "Performance-critical UIs, lightweight apps", usedBy: "Apple, Spotify, The New York Times" },
      { name: "SolidJS", role: "Fine-grained reactive signals, no virtual DOM, surgical DOM updates", useCase: "Real-time dashboards, data-heavy interactive apps", usedBy: "Emerging; growing in performance-focused teams" },
    ],
  },
  {
    category: "Meta-Frameworks",
    color: "#b388ff",
    items: [
      { name: "Next.js", role: "React meta-framework adding SSR, SSG, App Router, and Edge Functions", useCase: "Full-stack React apps, SEO-heavy sites, hybrid rendering", usedBy: "Vercel, TikTok, Twitch, Hulu" },
      { name: "Nuxt", role: "Vue meta-framework with SSR, file-based routing, and auto-imports", useCase: "Full-stack Vue apps, content sites", usedBy: "Upwork, Ecosia, Roland" },
      { name: "Astro", role: "Island architecture — server-renders HTML, hydrates only interactive components", useCase: "Content-heavy sites, blogs, marketing pages", usedBy: "Google, The Guardian, Porsche" },
      { name: "Remix", role: "React meta-framework emphasizing web standards and nested layouts", useCase: "Data-driven React apps, forms, progressive enhancement", usedBy: "Shopify, Netlify" },
      { name: "SvelteKit", role: "Svelte's official meta-framework with SSR and file-based routing", useCase: "Full-stack Svelte apps, fast-loading sites", usedBy: "Packages.svelte.dev, Vercel" },
    ],
  },
  {
    category: "Backend / Server",
    color: "#69ff47",
    items: [
      { name: "Node.js + Express", role: "JavaScript runtime with minimal HTTP server framework", useCase: "REST APIs, real-time services, microservices", usedBy: "LinkedIn, Uber, PayPal" },
      { name: "FastAPI (Python)", role: "Async Python framework with auto-generated OpenAPI docs and type validation", useCase: "ML-adjacent APIs, data pipelines, rapid API development", usedBy: "Microsoft, Uber, Explosion AI" },
      { name: "Django (Python)", role: "Batteries-included framework with ORM, admin panel, and auth", useCase: "Content platforms, rapid full-stack apps", usedBy: "Instagram, Pinterest, Disqus" },
      { name: "Spring Boot (Java)", role: "Enterprise-grade Java framework with DI, security, and data access built in", useCase: "Large-scale enterprise backends, microservices", usedBy: "Amazon, Booking.com, Intuit" },
      { name: "Go (net/http + Fiber)", role: "Compiled, statically typed language — extremely fast and low memory footprint", useCase: "High-throughput APIs, infrastructure tooling, CLI tools", usedBy: "Google, Cloudflare, Dropbox, Docker" },
      { name: "Scala / Akka", role: "JVM language with actor model for concurrent, distributed systems", useCase: "Real-time event streaming, high-concurrency backends", usedBy: "X (Twitter), LinkedIn, Coursera" },
    ],
  },
  {
    category: "Database",
    color: "#ffd740",
    items: [
      { name: "PostgreSQL", role: "Relational DB with ACID compliance, rich indexing, JSON support", useCase: "General-purpose structured data, transactional apps", usedBy: "Apple, Instagram, Spotify" },
      { name: "MySQL / MariaDB", role: "Widely-deployed relational DB; MariaDB is open-source fork with extras", useCase: "Web apps, CMS backends, e-commerce", usedBy: "Facebook, WordPress, Wikipedia" },
      { name: "SQLite", role: "Embedded, serverless relational DB — entire DB is a single file", useCase: "Local apps, mobile apps, dev/test environments", usedBy: "Android, Firefox, Airbus" },
      { name: "MongoDB", role: "Document-oriented NoSQL — stores JSON-like BSON documents", useCase: "Flexible schema data, content platforms, catalogs", usedBy: "Atlassian, Adobe, Verizon" },
      { name: "Redis", role: "In-memory key-value store with pub/sub, sorted sets, and TTL support", useCase: "Caching, session storage, real-time leaderboards, queues", usedBy: "GitHub, Twitter, Stack Overflow" },
      { name: "Cassandra", role: "Wide-column NoSQL built for massive write throughput and linear scaling", useCase: "Time-series data, IoT, global-scale distributed storage", usedBy: "Netflix, Uber, Apple" },
    ],
  },
  {
    category: "Mobile",
    color: "#ff6d00",
    items: [
      { name: "Swift / UIKit / SwiftUI", role: "Apple-native language and UI frameworks for iOS/macOS development", useCase: "iOS apps requiring deep OS integration and top performance", usedBy: "Apple, Airbnb, LinkedIn (iOS)" },
      { name: "Kotlin / Jetpack Compose", role: "Modern Android-native language and declarative UI toolkit", useCase: "Android apps, Material Design UIs", usedBy: "Google, Pinterest, Trello (Android)" },
      { name: "React Native", role: "JavaScript framework rendering native components via a JS bridge (or JSI)", useCase: "Cross-platform mobile with shared codebase", usedBy: "Meta, Shopify, Microsoft" },
      { name: "Flutter", role: "Dart framework with its own rendering engine — pixel-perfect cross-platform", useCase: "Cross-platform iOS/Android/Web/Desktop from one codebase", usedBy: "Google, BMW, eBay Motors" },
    ],
  },
  {
    category: "Infrastructure & DevOps",
    color: "#ff4081",
    items: [
      { name: "Docker", role: "Container runtime — packages apps and dependencies into portable images", useCase: "Consistent dev/prod environments, microservice isolation", usedBy: "Universally adopted" },
      { name: "Kubernetes (K8s)", role: "Container orchestration — handles scaling, self-healing, rolling deploys", useCase: "Managing containerized services at scale", usedBy: "Google, Spotify, The New York Times" },
      { name: "Nginx / Caddy", role: "High-performance reverse proxies and web servers with TLS support", useCase: "Load balancing, SSL termination, static file serving", usedBy: "Cloudflare, Netflix, Dropbox" },
      { name: "GitHub Actions / CI/CD", role: "Automated pipelines for testing, building, and deploying on code push", useCase: "Continuous integration and deployment workflows", usedBy: "Universally adopted" },
    ],
  },
  {
    category: "Real-Time & Messaging",
    color: "#00e676",
    items: [
      { name: "WebSockets", role: "Full-duplex TCP connection enabling live bidirectional data between client/server", useCase: "Chat, live feeds, collaborative editing, gaming", usedBy: "Slack, Figma, Discord" },
      { name: "Apache Kafka", role: "Distributed event streaming platform for high-throughput message pipelines", useCase: "Event sourcing, log aggregation, stream processing", usedBy: "LinkedIn, Uber, Airbnb" },
      { name: "gRPC", role: "High-performance RPC framework using Protocol Buffers over HTTP/2", useCase: "Microservice-to-microservice communication, low-latency APIs", usedBy: "Google, Netflix, Cisco" },
      { name: "GraphQL", role: "Query language for APIs — clients request exactly the data they need", useCase: "Complex data relationships, mobile-optimized APIs", usedBy: "GitHub, Shopify, Twitter" },
    ],
  },
];

const categoryIcons: Record<string, string> = {
  "Frontend (Web UI)": "⬡",
  "Meta-Frameworks": "⬢",
  "Backend / Server": "⚙",
  "Database": "◈",
  "Mobile": "◉",
  "Infrastructure & DevOps": "⬟",
  "Real-Time & Messaging": "⟁",
};

export default function TechStackTable() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = stackData.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.useCase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usedBy.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(cat =>
    (activeCategory === null || cat.category === activeCategory) &&
    cat.items.length > 0
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#c9d1d9",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      padding: "32px 24px",
    }}>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: "#3fb950", letterSpacing: "4px", marginBottom: "8px" }}>
            // TECH_STACK_REFERENCE_v2026
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: "700",
            margin: "0 0 8px 0",
            background: "linear-gradient(90deg, #e6edf3 40%, #3fb950)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px",
          }}>
            Application Dev Stack Reference
          </h1>
          <p style={{ color: "#8b949e", fontSize: "13px", margin: 0 }}>
            Frameworks, databases, and infrastructure — what each layer does and who uses it.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "24px", position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#3fb950", fontSize: "14px" }}>
            ›_
          </span>
          <input
            placeholder="Filter by name, role, use case, or company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              background: "#0d1117",
              border: "1px solid #21262d",
              borderRadius: "6px",
              padding: "10px 14px 10px 38px",
              color: "#e6edf3",
              fontFamily: "inherit",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#3fb950"}
            onBlur={e => e.target.style.borderColor = "#21262d"}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              background: activeCategory === null ? "#3fb950" : "transparent",
              border: `1px solid ${activeCategory === null ? "#3fb950" : "#30363d"}`,
              borderRadius: "4px",
              padding: "5px 12px",
              color: activeCategory === null ? "#0d1117" : "#8b949e",
              fontFamily: "inherit",
              fontSize: "11px",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.15s",
              fontWeight: activeCategory === null ? "700" : "400",
            }}
          >
            ALL
          </button>
          {stackData.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              style={{
                background: activeCategory === cat.category ? cat.color + "22" : "transparent",
                border: `1px solid ${activeCategory === cat.category ? cat.color : "#30363d"}`,
                borderRadius: "4px",
                padding: "5px 12px",
                color: activeCategory === cat.category ? cat.color : "#8b949e",
                fontFamily: "inherit",
                fontSize: "11px",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {categoryIcons[cat.category]} {cat.category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tables */}
        {filtered.map(cat => (
          <div key={cat.category} style={{ marginBottom: "36px" }}>

            {/* Category Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "10px", paddingBottom: "8px",
              borderBottom: `1px solid ${cat.color}33`,
            }}>
              <span style={{ color: cat.color, fontSize: "18px" }}>{categoryIcons[cat.category]}</span>
              <span style={{ color: cat.color, fontSize: "12px", fontWeight: "700", letterSpacing: "2px" }}>
                {cat.category.toUpperCase()}
              </span>
              <span style={{
                marginLeft: "auto",
                background: cat.color + "18",
                border: `1px solid ${cat.color}44`,
                borderRadius: "3px",
                padding: "2px 8px",
                color: cat.color,
                fontSize: "10px",
                letterSpacing: "1px",
              }}>
                {cat.items.length} ENTRIES
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}>
                <thead>
                  <tr style={{ background: "#0d1117" }}>
                    {["Technology", "Role / What It Does", "Best For", "Notable Users"].map((h, i) => (
                      <th key={h} style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        color: "#3fb950",
                        fontWeight: "600",
                        letterSpacing: "1.5px",
                        fontSize: "10px",
                        borderBottom: "1px solid #21262d",
                        whiteSpace: "nowrap",
                        width: i === 0 ? "14%" : i === 1 ? "38%" : i === 2 ? "28%" : "20%",
                      }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item, idx) => {
                    const rowKey = `${cat.category}-${item.name}`;
                    const isHovered = hoveredRow === rowKey;
                    return (
                      <tr
                        key={item.name}
                        onMouseEnter={() => setHoveredRow(rowKey)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          background: isHovered ? cat.color + "0d" : idx % 2 === 0 ? "transparent" : "#0d111788",
                          borderBottom: "1px solid #161b22",
                          transition: "background 0.15s",
                          cursor: "default",
                        }}
                      >
                        <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                          <span style={{
                            color: cat.color,
                            fontWeight: "700",
                            fontSize: "12px",
                          }}>
                            {item.name}
                          </span>
                        </td>
                        <td style={{ padding: "11px 14px", color: "#c9d1d9", lineHeight: "1.55" }}>
                          {item.role}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#8b949e", lineHeight: "1.55" }}>
                          {item.useCase}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#6e7681", fontSize: "11px", lineHeight: "1.55" }}>
                          {item.usedBy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#3fb950", fontSize: "13px", letterSpacing: "2px",
          }}>
            // NO RESULTS FOUND FOR "{searchTerm}"
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "40px", paddingTop: "16px",
          borderTop: "1px solid #21262d",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <span style={{ color: "#3fb950", fontSize: "10px", letterSpacing: "2px" }}>
            // {stackData.reduce((a, c) => a + c.items.length, 0)} TECHNOLOGIES INDEXED
          </span>
          <span style={{ color: "#30363d", fontSize: "10px", letterSpacing: "1px" }}>
            LAST UPDATED: 2026
          </span>
        </div>
      </div>
    </div>
  );
}
