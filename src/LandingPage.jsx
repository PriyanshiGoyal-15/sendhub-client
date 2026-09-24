import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── useInView (only used inside real components, never inside .map) ── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

/* ── Animated number counter ── */
function Num({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  const [ref, v] = useInView(0.5);
  useEffect(() => {
    if (!v) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setN(cur);
      if (cur >= to) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [v, to]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Typewriter ── */
function TW({ words }) {
  const [i, setI] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(false);
  useEffect(() => {
    const w = words[i];
    const t = setTimeout(
      () => {
        if (!d && c < w.length) setC((x) => x + 1);
        else if (!d) setTimeout(() => setD(true), 1800);
        else if (c > 0) setC((x) => x - 1);
        else {
          setD(false);
          setI((x) => (x + 1) % words.length);
        }
      },
      d ? 40 : 85,
    );
    return () => clearTimeout(t);
  }, [c, d, i, words]);
  return (
    <span className="lp-tw">
      {words[i].slice(0, c)}
      <span className="lp-cur">|</span>
    </span>
  );
}

/* ── Reveal wrapper (each one is its own component with its own hook) ── */
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "none" : "translateY(24px)",
        transition: `all 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Chat mockup ── */
function ChatMockup() {
  const msgs = [
    {
      from: "app",
      contact: "Rahul S.",
      tag: "vip",
      text: "Hi Rahul 👋 Your order #4521 is confirmed!\nExpected: Friday, Oct 3rd 📦",
    },
    {
      from: "app",
      contact: "Priya M.",
      tag: "summer",
      text: "Hey Priya ☀️! 30% off with code SUMMER30 — expires tonight!",
    },
    { from: "user", text: "Great! Can I track my order?" },
    {
      from: "app",
      contact: "Rahul S.",
      tag: "vip",
      text: "Track here → sendhub.app/track/4521 🔗",
    },
  ];
  const [vis, setVis] = useState(1);
  useEffect(() => {
    if (vis >= msgs.length) return;
    const t = setTimeout(() => setVis((v) => v + 1), 1200);
    return () => clearTimeout(t);
  }, [vis]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: "1.5px solid rgba(0,200,83,0.15)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(0,200,83,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        style={{
          width: 288,
          background: "#fff",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,200,83,0.15)",
          border: "1px solid rgba(0,200,83,0.15)",
          animation: "lp-float 5s ease-in-out infinite",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "#f8f9fa",
            padding: "6px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#9CA3AF",
            fontWeight: 600,
          }}
        >
          <span>9:41 AM</span>
          <span>●●▮</span>
        </div>
        <div
          style={{
            background: "#00C853",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            SH
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
              SendHub Campaigns
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>
              Campaign Manager · Online
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ADFFC8",
              boxShadow: "0 0 6px rgba(173,255,200,0.9)",
            }}
          />
        </div>
        <div
          style={{
            background: "#EFEFEF",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minHeight: 240,
          }}
        >
          {msgs.slice(0, vis).map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: m.from === "user" ? "flex-end" : "flex-start",
                animation: "lp-pop 0.35s ease forwards",
              }}
            >
              {m.from === "app" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{ fontSize: 9, fontWeight: 700, color: "#009624" }}
                  >
                    {m.contact}
                  </span>
                  <span
                    style={{
                      background: "#E6F9EE",
                      color: "#009624",
                      fontSize: 8,
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: 8,
                      border: "1px solid #C8F0D8",
                    }}
                  >
                    {m.tag}
                  </span>
                </div>
              )}
              <div
                style={{
                  maxWidth: "82%",
                  padding: "7px 11px",
                  borderRadius:
                    m.from === "app"
                      ? "2px 12px 12px 12px"
                      : "12px 2px 12px 12px",
                  background: m.from === "app" ? "#fff" : "#00C853",
                  color: m.from === "app" ? "#1E293B" : "#fff",
                  fontSize: 11,
                  lineHeight: 1.5,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-line",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#fff",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderTop: "1px solid #F0F0F0",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#F4F4F4",
              borderRadius: 20,
              padding: "6px 12px",
              fontSize: 11,
              color: "#aaa",
            }}
          >
            Type a message…
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#00C853",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Architecture diagram ── */
function ArchDiagram() {
  const layers = [
    {
      label: "CLIENT LAYER",
      color: "#3B82F6",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      items: [
        ["⚛️", "React 19 + Vite", "SPA with React Router v6"],
        ["🎨", "Tailwind CSS", "Responsive dashboard UI"],
        ["🗃️", "Zustand", "Global state management"],
        ["📡", "Axios", "HTTP client with interceptors"],
      ],
    },
    {
      label: "API LAYER — Node.js + Express 5",
      color: "#00C853",
      bg: "#E6F9EE",
      border: "#C8F0D8",
      items: [
        ["🟢", "Express Router", "10+ REST endpoints, modular routes"],
        ["🔐", "JWT Middleware", "Stateless auth on every protected route"],
        ["📋", "Swagger/OpenAPI", "Auto-docs served at /api-docs"],
        ["⏰", "node-cron", "Background job scheduler for campaigns"],
      ],
    },
    {
      label: "DATA & THIRD-PARTY SERVICES",
      color: "#7C3AED",
      bg: "#F5F3FF",
      border: "#DDD6FE",
      items: [
        ["🍃", "MongoDB Atlas", "Cloud NoSQL — contacts, campaigns, templates"],
        ["📲", "Twilio API", "WhatsApp message delivery"],
        ["📧", "Nodemailer", "Email delivery via SMTP"],
        ["🔒", "bcrypt + OTP", "Password hashing & email verification"],
      ],
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      {layers.map((layer, li) => (
        <React.Fragment key={layer.label}>
          <Reveal delay={li * 150}>
            <div
              style={{
                background: layer.bg,
                border: `1.5px solid ${layer.border}`,
                borderRadius: 16,
                padding: "1.25rem 1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: layer.color,
                  marginBottom: "0.875rem",
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {layer.items.map(([icon, name, sub]) => (
                  <div
                    key={name}
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "0.75rem 1rem",
                      border: `1px solid ${layer.border}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748B",
                          marginTop: 2,
                        }}
                      >
                        {sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          {li < layers.length - 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "3px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: "#CBD5E1",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "6px solid #CBD5E1",
                  }}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Skill block (used as component, not inside map) ── */
function SkillBlock({
  icon,
  color,
  bg,
  border,
  title,
  badge,
  points,
  delay = 0,
}) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "none" : "translateY(24px)",
        transition: `all 0.6s ease ${delay}ms`,
        background: "#fff",
        borderRadius: 16,
        padding: "1.5rem",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              background: bg,
              border: `1.5px solid ${border}`,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            {icon}
          </div>
          <div
            style={{ fontSize: "0.97rem", fontWeight: 800, color: "#1E293B" }}
          >
            {title}
          </div>
        </div>
        <span
          style={{
            background: bg,
            border: `1px solid ${border}`,
            color,
            fontSize: "0.62rem",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {points.map((p) => (
          <li
            key={p}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: "0.82rem",
              color: "#475569",
              lineHeight: 1.55,
            }}
          >
            <span
              style={{ color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}
            >
              ›
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Navbar ── */
function Nav() {
  const [sc, setSc] = useState(false);
  const [op, setOp] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    ["Overview", "#overview"],
    ["Architecture", "#arch"],
    ["Skills", "#skills"],
    ["API", "#api"],
  ];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 1.5rem",
        transition: "all 0.3s",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: sc
          ? "1px solid rgba(0,200,83,0.15)"
          : "1px solid #F1F5F9",
        boxShadow: sc ? "0 2px 20px rgba(0,0,0,0.07)" : "0 1px 0 #F1F5F9",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "#0F172A",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "#00C853",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,200,83,0.35)",
            }}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </div>
          SendHub
        </Link>
        <div className="lp-dlinks">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="lp-dlink">
              {l}
            </a>
          ))}
        </div>
        <div className="lp-dcta">
          <Link to="/login" className="lp-ghost">
            Login
          </Link>
          <Link to="/register" className="lp-primary-btn">
            Try Dashboard →
          </Link>
        </div>
        <button onClick={() => setOp(!op)} className="lp-ham" aria-label="menu">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#1E293B"
            viewBox="0 0 24 24"
          >
            {op ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {op && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #e5e7eb",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              onClick={() => setOp(false)}
              style={{
                textDecoration: "none",
                color: "#475569",
                padding: "0.65rem 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {l}
            </a>
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                textAlign: "center",
                border: "1.5px solid #e5e7eb",
                color: "#1E293B",
                padding: "0.7rem",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                textAlign: "center",
                background: "#00C853",
                color: "#fff",
                padding: "0.7rem",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════
   MAIN LANDING PAGE
════════════════════════════════════════ */
export default function LandingPage() {
  const features = [
    {
      icon: "🔐",
      title: "Auth System",
      desc: "Register → OTP verify → JWT login → forgot password — complete flow",
    },
    {
      icon: "👥",
      title: "Contact Manager",
      desc: "Add, tag, and filter contacts with flexible audience segmentation",
    },
    {
      icon: "📝",
      title: "Template Builder",
      desc: "Reusable messages with {{1}}, {{2}} dynamic variable substitution",
    },
    {
      icon: "📣",
      title: "Campaign Creator",
      desc: "Multi-channel campaigns targeting any tag combination",
    },
    {
      icon: "👁️",
      title: "Live Preview",
      desc: "Real-time WhatsApp bubble & email client preview before sending",
    },
    {
      icon: "⏰",
      title: "Cron Scheduler",
      desc: "Fully automated message delivery — fires even when user is offline",
    },
    {
      icon: "⚙️",
      title: "Sender Settings",
      desc: "SMTP config, Twilio number, profile image — all customisable",
    },
    {
      icon: "📊",
      title: "Dashboard",
      desc: "Campaign stats, message logs, and audience reach at a glance",
    },
    {
      icon: "📖",
      title: "Swagger API Docs",
      desc: "Interactive OpenAPI docs auto-generated at /api-docs",
    },
  ];

  const endpoints = [
    ["POST", "post", "/api/auth/register", "Create user account"],
    ["POST", "post", "/api/auth/login", "Authenticate & receive JWT cookie"],
    ["POST", "post", "/api/auth/verify-otp", "Email OTP verification"],
    ["POST", "post", "/api/auth/forgot-password", "Request password reset"],
    ["GET", "get", "/api/contact", "List & filter contacts by tags"],
    ["POST", "post", "/api/contact", "Add a new contact"],
    ["POST", "post", "/api/campaigns", "Create & schedule a campaign"],
    ["GET", "get", "/api/campaigns/:id", "Fetch campaign details"],
    ["GET", "get", "/api/templates", "List message templates"],
    ["GET", "get", "/api/dashboard", "Dashboard statistics"],
    ["PUT", "put", "/api/settings", "Update sender config"],
    ["POST", "post", "/api/webhooks", "Delivery status callback"],
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#FAFAF9;color:#1E293B;}
        code,pre{font-family:'Fira Code','Cascadia Code','Courier New',monospace;}
        @keyframes lp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes lp-pop{from{opacity:0;transform:scale(0.88) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes lp-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.6}}
        @keyframes lp-blobA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,30px) scale(1.1)}}
        @keyframes lp-blobB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,50px) scale(1.08)}}
        @keyframes lp-blobC{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.12)}}
        .lp-tw{background:linear-gradient(135deg,#00C853,#00897B,#0288D1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .lp-cur{-webkit-text-fill-color:#00C853;animation:lp-pulse 1s ease infinite;}
        /* nav */
        .lp-dlinks{display:flex;gap:2rem;}
        .lp-dlink{text-decoration:none;font-size:0.875rem;font-weight:500;color:#475569;transition:color 0.2s;}
        .lp-dlink:hover{color:#00C853;}
        .lp-dcta{display:flex;align-items:center;gap:0.75rem;}
        .lp-ghost{text-decoration:none;font-size:0.875rem;font-weight:600;color:#475569;padding:0.45rem 0.875rem;border-radius:8px;transition:color 0.2s;}
        .lp-ghost:hover{color:#00C853;}
        .lp-primary-btn{text-decoration:none;background:#00C853;color:#fff;font-size:0.875rem;font-weight:700;padding:0.5rem 1.125rem;border-radius:10px;box-shadow:0 4px 12px rgba(0,200,83,0.3);transition:all 0.2s;}
        .lp-primary-btn:hover{background:#009624;transform:translateY(-1px);}
        .lp-ham{display:none;background:none;border:none;cursor:pointer;padding:4px;}
        @media(max-width:800px){.lp-dlinks,.lp-dcta{display:none!important;}.lp-ham{display:block!important;}}
        /* hero grid */
        .lp-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;}
        @media(max-width:900px){.lp-hero-grid{grid-template-columns:1fr!important;}}
        /* 2 col */
        .lp-2col{display:grid;grid-template-columns:1fr 1fr;gap:2rem;}
        @media(max-width:700px){.lp-2col{grid-template-columns:1fr!important;}}
        /* skills grid */
        .lp-skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem;}
        /* feature grid */
        .lp-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:#F1F5F9;border-radius:16px;overflow:hidden;}
        @media(max-width:900px){.lp-feat-grid{grid-template-columns:1fr!important;}}
        /* api split */
        .lp-api-split{display:grid;grid-template-columns:1fr 1fr;gap:2rem;}
        @media(max-width:800px){.lp-api-split{grid-template-columns:1fr!important;}}
        /* stack grid */
        .lp-stack-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-bottom:2rem;}
        @media(max-width:700px){.lp-stack-grid{grid-template-columns:1fr!important;}}
        /* feature card hover */
        .lp-feat-cell{background:#fff;padding:1.5rem;cursor:default;transition:background 0.2s;}
        .lp-feat-cell:hover{background:#F9FFF9;}
        /* badge hover */
        .lp-badge{display:inline-flex;align-items:center;gap:6px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:100px;padding:6px 13px;font-size:0.8rem;font-weight:600;color:#475569;cursor:default;transition:all 0.25s;}
        .lp-badge:hover{border-color:#C8F0D8;color:#009624;background:#E6F9EE;}
        /* endpoint hover */
        .lp-ep{display:flex;align-items:flex-start;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:9px 14px;transition:border-color 0.2s;}
        .lp-ep:hover{border-color:rgba(0,200,83,0.3);}
        /* code block */
        .lp-code{background:#0F172A;border-radius:12px;padding:1.25rem 1.5rem;overflow-x:auto;}
        .lp-code pre{font-size:0.76rem;line-height:1.75;color:#E2E8F0;white-space:pre;}
        .kw{color:#93C5FD;} .str{color:#86EFAC;} .key{color:#FCA5A5;} .num{color:#FCD34D;} .cm{color:#64748B;}
      `}</style>

      <Nav />

      {/* ── PORTFOLIO BANNER ── */}
      <div
        style={{
          background: "linear-gradient(90deg,#00C853,#00897B)",
          padding: "9px 1.5rem",
          textAlign: "center",
          marginTop: 66,
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.02em",
          }}
        >
          📌 Portfolio Project — Full-Stack Developer · Node.js · React ·
          MongoDB · Twilio · Nodemailer · JWT
        </p>
      </div>

      {/* ════ HERO ════ */}
      <section
        id="overview"
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(160deg,#F0FFF6 0%,#FAFAF9 50%,#F0F4FF 100%)",
          padding: "4rem 1.5rem 4.5rem",
        }}
      >
        {/* blobs */}
        {[
          {
            w: 500,
            h: 500,
            g: "rgba(0,200,83,0.18)",
            t: -120,
            l: -80,
            a: "lp-blobA 18s ease-in-out infinite",
          },
          {
            w: 400,
            h: 400,
            g: "rgba(59,130,246,0.12)",
            t: 150,
            r: -80,
            a: "lp-blobB 22s ease-in-out infinite",
          },
          {
            w: 350,
            h: 350,
            g: "rgba(124,58,237,0.1)",
            b: 0,
            l: "40%",
            a: "lp-blobC 20s ease-in-out infinite",
          },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: b.w,
              height: b.h,
              borderRadius: "50%",
              background: `radial-gradient(circle,${b.g},transparent)`,
              ...(b.t !== undefined ? { top: b.t } : {}),
              ...(b.l !== undefined ? { left: b.l } : {}),
              ...(b.r !== undefined ? { right: b.r } : {}),
              ...(b.b !== undefined ? { bottom: b.b } : {}),
              filter: "blur(60px)",
              animation: b.a,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="lp-hero-grid">
            {/* Left */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(0,200,83,0.1)",
                  border: "1px solid rgba(0,200,83,0.25)",
                  borderRadius: 100,
                  padding: "6px 14px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#00C853",
                    animation: "lp-pulse 2s ease infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#009624",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Full-Stack Portfolio Project
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2rem,4.5vw,3.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.12,
                  color: "#0F172A",
                  marginBottom: "1rem",
                  letterSpacing: "-0.025em",
                }}
              >
                Multi-channel campaign
                <br />
                platform built{" "}
                <em style={{ fontStyle: "italic" }}>end-to-end.</em>
              </h1>
              <h2
                style={{
                  fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
                  fontWeight: 800,
                  marginBottom: "1.25rem",
                  color: "#1E293B",
                  letterSpacing: "-0.015em",
                }}
              >
                <TW
                  words={[
                    "WhatsApp broadcasting.",
                    "Automated email campaigns.",
                    "Contact segmentation.",
                    "Scheduled cron jobs.",
                  ]}
                />
              </h2>

              <p
                style={{
                  fontSize: "1rem",
                  color: "#475569",
                  lineHeight: 1.75,
                  maxWidth: 520,
                  marginBottom: "2rem",
                }}
              >
                <strong>SendHub</strong> is a production-grade messaging
                platform — users manage contacts, build reusable templates with
                dynamic variables, and launch personalised campaigns across
                WhatsApp and Email, all secured behind JWT authentication with a
                cron-powered scheduler.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.875rem",
                  marginBottom: "2.5rem",
                }}
              >
                <Link
                  to="/register"
                  id="hero-cta"
                  style={{
                    textDecoration: "none",
                    background: "#00C853",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    padding: "0.875rem 1.75rem",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 6px 20px rgba(0,200,83,0.35)",
                  }}
                >
                  Open Live Dashboard{" "}
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <a
                  href="#arch"
                  style={{
                    textDecoration: "none",
                    background: "#fff",
                    color: "#1E293B",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.875rem 1.75rem",
                    borderRadius: 12,
                    border: "1.5px solid #E2E8F0",
                  }}
                >
                  View Architecture ↓
                </a>
              </div>

              {/* Quick stats */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { to: 10, s: "+", l: "API Endpoints" },
                  { to: 5, s: "", l: "Dashboard Pages" },
                  { to: 2, s: "", l: "Channels (WA+Email)" },
                  { to: 9, s: "", l: "Core Features" },
                ].map((x) => (
                  <div key={x.l}>
                    <div
                      style={{
                        fontSize: "1.65rem",
                        fontWeight: 900,
                        color: "#0F172A",
                        lineHeight: 1,
                      }}
                    >
                      <Num to={x.to} suffix={x.s} />
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#64748B",
                        fontWeight: 600,
                        marginTop: 3,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {x.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ChatMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ════ PROBLEM → SOLUTION ════ */}
      <section
        style={{
          background: "#fff",
          padding: "4rem 1.5rem",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#E6F9EE",
                  border: "1px solid #C8F0D8",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#009624",
                  marginBottom: "0.875rem",
                }}
              >
                The Project
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                  fontWeight: 900,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                }}
              >
                Problem → Solution
              </h2>
            </div>
          </Reveal>
          <div className="lp-2col">
            <Reveal delay={0}>
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1.5px solid #FECACA",
                  borderRadius: 16,
                  padding: "1.75rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#DC2626",
                    marginBottom: "0.875rem",
                  }}
                >
                  ❌ The Problem
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1E293B",
                    marginBottom: "0.875rem",
                  }}
                >
                  Businesses juggle 5 tools to send a campaign
                </h3>
                {[
                  "Separate apps for WhatsApp, Email, and contact lists",
                  "No single place to schedule and automate outreach",
                  "Templates scattered across different platforms",
                  "No visibility on audience segments or delivery stats",
                ].map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: "0.84rem",
                      color: "#7F1D1D",
                      lineHeight: 1.55,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#EF4444", flexShrink: 0 }}>✕</span>
                    {t}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div
                style={{
                  background: "#E6F9EE",
                  border: "1.5px solid #C8F0D8",
                  borderRadius: 16,
                  padding: "1.75rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#009624",
                    marginBottom: "0.875rem",
                  }}
                >
                  ✅ The Solution
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1E293B",
                    marginBottom: "0.875rem",
                  }}
                >
                  One platform — contacts, templates, campaigns
                </h3>
                {[
                  "Unified dashboard: contacts with audience tags",
                  "WhatsApp via Twilio + Email via SMTP in one campaign",
                  "Reusable templates with {{dynamic}} variable substitution",
                  "node-cron scheduler for fully automated delivery",
                ].map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: "0.84rem",
                      color: "#14532D",
                      lineHeight: 1.55,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#00C853", flexShrink: 0 }}>✓</span>
                    {t}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ SYSTEM ARCHITECTURE ════ */}
      <section
        id="arch"
        style={{
          background: "#FAFAF9",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "#E6F9EE",
                border: "1px solid #C8F0D8",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#009624",
                marginBottom: "0.875rem",
              }}
            >
              System Design
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Three-layer architecture
            </h2>
            <p
              style={{
                color: "#64748B",
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.65,
                fontSize: "0.93rem",
              }}
            >
              Clear separation of concerns — client, API, and data/services —
              each independently scalable.
            </p>
          </Reveal>
          <ArchDiagram />

          {/* Request lifecycle */}
          <Reveal delay={300} style={{ marginTop: "2rem" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #F1F5F9",
                borderRadius: 16,
                padding: "1.5rem 2rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748B",
                  marginBottom: "1rem",
                }}
              >
                📨 Request Lifecycle — POST /api/campaigns
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0,
                  rowGap: "0.75rem",
                }}
              >
                {[
                  ["React Form", "User fills campaign"],
                  ["Axios POST", "→ /api/campaigns"],
                  ["JWT Middleware", "Verifies token"],
                  ["Controller", "Validates & saves DB"],
                  ["node-cron", "Schedules job"],
                  ["Twilio / SMTP", "Delivers on time"],
                ].map(([step, desc], i, arr) => (
                  <React.Fragment key={step}>
                    <div style={{ textAlign: "center", minWidth: 100 }}>
                      <div
                        style={{
                          background: "#E6F9EE",
                          border: "1px solid #C8F0D8",
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#009624",
                          marginBottom: 3,
                        }}
                      >
                        {step}
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "#94A3B8" }}>
                        {desc}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          color: "#CBD5E1",
                          fontSize: "1.1rem",
                          margin: "0 3px",
                          paddingBottom: 14,
                        }}
                      >
                        ›
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ SKILLS ════ */}
      <section
        id="skills"
        style={{
          background: "#fff",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "#F5F3FF",
                border: "1px solid #DDD6FE",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6D28D9",
                marginBottom: "0.875rem",
              }}
            >
              Skills Demonstrated
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              What this project actually shows
            </h2>
            <p
              style={{
                color: "#64748B",
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.65,
                fontSize: "0.93rem",
              }}
            >
              Not just libraries listed — real implementation decisions with
              production-level thinking.
            </p>
          </Reveal>
          <div className="lp-skills-grid">
            <SkillBlock
              delay={0}
              icon="🔐"
              color="#DC2626"
              bg="#FEF2F2"
              border="#FECACA"
              title="Auth & Security"
              badge="BACKEND"
              points={[
                "Stateless JWT in HTTP-only cookies — prevents XSS token theft",
                "bcrypt password hashing with configurable salt rounds",
                "6-digit OTP generation + Nodemailer for email verification",
                "Reusable auth middleware protecting all dashboard routes",
              ]}
            />
            <SkillBlock
              delay={80}
              icon="🍃"
              color="#059669"
              bg="#ECFDF5"
              border="#A7F3D0"
              title="Database Design (MongoDB)"
              badge="BACKEND"
              points={[
                "Mongoose schema design with validation, refs, and defaults",
                "Contact model with audienceTags[] for flexible segmentation",
                "Campaign model storing channels, template refs, and cron schedule",
                "Efficient tag filtering: GET /api/contact?audienceTags=vip,summer",
              ]}
            />
            <SkillBlock
              delay={160}
              icon="📡"
              color="#0284C7"
              bg="#F0F9FF"
              border="#BAE6FD"
              title="REST API Design"
              badge="BACKEND"
              points={[
                "10+ RESTful endpoints across 8 resource modules (auth, contacts, campaigns…)",
                "Consistent error handling with structured JSON responses",
                "Swagger/OpenAPI auto-docs at /api-docs — testable in browser",
                "Multer middleware for profile image file uploads",
              ]}
            />
            <SkillBlock
              delay={240}
              icon="📲"
              color="#00C853"
              bg="#E6F9EE"
              border="#C8F0D8"
              title="Third-Party Integrations"
              badge="INTEGRATION"
              points={[
                "Twilio SDK — WhatsApp message delivery with variable substitution",
                "Nodemailer — transactional + bulk email via SMTP configuration",
                "{{1}}, {{2}} variables replaced at send-time per contact",
                "Webhook endpoint to receive Twilio delivery status callbacks",
              ]}
            />
            <SkillBlock
              delay={320}
              icon="⚛️"
              color="#3B82F6"
              bg="#EFF6FF"
              border="#BFDBFE"
              title="React SPA (Frontend)"
              badge="FRONTEND"
              points={[
                "React 19 + Vite with fast HMR and optimised production builds",
                "React Router v6 with protected route HOC pattern",
                "Zustand for lightweight global state (auth, contacts, campaigns)",
                "Tailwind CSS for a consistent, responsive design system",
              ]}
            />
            <SkillBlock
              delay={400}
              icon="⏰"
              color="#D97706"
              bg="#FFFBEB"
              border="#FDE68A"
              title="Background Job Scheduling"
              badge="ADVANCED"
              points={[
                "node-cron schedules campaign delivery at user-specified datetime",
                "Jobs fire server-side — campaigns deliver even if user is offline",
                "initCronJobs() hook initialises all pending jobs on server start",
                "Async dispatch prevents blocking the Express event loop",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ════ 9 FEATURES ════ */}
      <section
        style={{
          background: "#FAFAF9",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "#E6F9EE",
                border: "1px solid #C8F0D8",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#009624",
                marginBottom: "0.875rem",
              }}
            >
              Platform Features
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              9 production-ready features
            </h2>
          </Reveal>
          <div className="lp-feat-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="lp-feat-cell"
                style={{
                  borderRight: i % 3 < 2 ? "1px solid #F1F5F9" : "none",
                  borderBottom: i < 6 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.625rem" }}>
                  {f.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: "0.375rem",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: "0.79rem",
                    color: "#64748B",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ API (dark section) ════ */}
      <section
        id="api"
        style={{ background: "#0F172A", padding: "5rem 1.5rem" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(0,200,83,0.12)",
                border: "1px solid rgba(0,200,83,0.25)",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#86EFAC",
                marginBottom: "0.875rem",
              }}
            >
              REST API
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 900,
                color: "#F1F5F9",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              10+ clean REST endpoints
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.93rem" }}>
              Documented at{" "}
              <code
                style={{
                  background: "rgba(0,200,83,0.12)",
                  color: "#86EFAC",
                  padding: "2px 7px",
                  borderRadius: 5,
                }}
              >
                /api-docs
              </code>{" "}
              via Swagger UI
            </p>
          </Reveal>

          <div className="lp-api-split">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {endpoints.map(([m, cls, path, desc]) => {
                const mc =
                  cls === "get"
                    ? "#93C5FD"
                    : cls === "post"
                      ? "#86EFAC"
                      : "#FCD34D";
                const mb =
                  cls === "get"
                    ? "rgba(59,130,246,0.1)"
                    : cls === "post"
                      ? "rgba(0,200,83,0.1)"
                      : "rgba(245,158,11,0.1)";
                return (
                  <div key={path} className="lp-ep">
                    <span
                      style={{
                        background: mb,
                        color: mc,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 5,
                        fontFamily: "monospace",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {m}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.79rem",
                          color: "#E2E8F0",
                        }}
                      >
                        {path}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748B",
                          marginTop: 2,
                        }}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#475569",
                }}
              >
                Response — GET /api/dashboard
              </div>
              <div className="lp-code">
                <pre
                  dangerouslySetInnerHTML={{
                    __html: `<span class="cm">// 200 OK</span>
{
  <span class="key">"stats"</span>: {
    <span class="key">"totalContacts"</span>: <span class="num">1248</span>,
    <span class="key">"totalCampaigns"</span>: <span class="num">34</span>,
    <span class="key">"sentToday"</span>: <span class="num">312</span>,
    <span class="key">"scheduledJobs"</span>: <span class="num">7</span>
  },
  <span class="key">"recent"</span>: [{
    <span class="key">"name"</span>: <span class="str">"Summer Sale"</span>,
    <span class="key">"status"</span>: <span class="str">"sent"</span>,
    <span class="key">"channel"</span>: [<span class="str">"SMS"</span>, <span class="str">"EMAIL"</span>],
    <span class="key">"audienceTags"</span>: [<span class="str">"vip"</span>, <span class="str">"summer"</span>]
  }]
}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#475569",
                }}
              >
                Request — POST /api/campaigns
              </div>
              <div className="lp-code">
                <pre
                  dangerouslySetInnerHTML={{
                    __html: `<span class="cm">// Request body</span>
{
  <span class="key">"name"</span>: <span class="str">"VIP Flash Sale"</span>,
  <span class="key">"channels"</span>: [<span class="str">"SMS"</span>, <span class="str">"EMAIL"</span>],
  <span class="key">"audienceTags"</span>: [<span class="str">"vip"</span>],
  <span class="key">"scheduledAt"</span>: <span class="str">"2026-10-01T10:00:00Z"</span>,
  <span class="key">"templates"</span>: {
    <span class="key">"SMS"</span>: <span class="str">"template_id_001"</span>,
    <span class="key">"EMAIL"</span>: <span class="str">"template_id_002"</span>
  }
}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TECH STACK ════ */}
      <section
        style={{
          background: "#fff",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#1D4ED8",
                marginBottom: "0.875rem",
              }}
            >
              Full Stack
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Technology breakdown
            </h2>
          </Reveal>
          <div className="lp-stack-grid">
            {[
              {
                label: "⚙️ Backend",
                c: "#009624",
                bg: "#E6F9EE",
                b: "#C8F0D8",
                items: [
                  "Node.js + Express 5",
                  "MongoDB + Mongoose",
                  "JWT + bcrypt + OTP",
                  "Twilio SDK (WhatsApp)",
                  "Nodemailer (SMTP)",
                  "node-cron (Scheduler)",
                  "Multer (File Uploads)",
                  "Swagger / OpenAPI",
                ],
              },
              {
                label: "🎨 Frontend",
                c: "#1D4ED8",
                bg: "#EFF6FF",
                b: "#BFDBFE",
                items: [
                  "React 19 + Vite",
                  "Tailwind CSS",
                  "React Router v6",
                  "Zustand (State)",
                  "Axios + Interceptors",
                  "Lucide + MD Icons",
                  "Protected Route HOC",
                ],
              },
              {
                label: "🚀 Infra",
                c: "#7C3AED",
                bg: "#F5F3FF",
                b: "#DDD6FE",
                items: [
                  "MongoDB Atlas (Cloud)",
                  "Vercel (Frontend)",
                  "Cookie-Parser",
                  "CORS Config",
                  "dotenv (Secrets)",
                  "nodemon (Dev)",
                ],
              },
            ].map((col, ci) => (
              <Reveal key={col.label} delay={ci * 80}>
                <div
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${col.b}`,
                    borderRadius: 16,
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: col.c,
                      marginBottom: "1rem",
                    }}
                  >
                    {col.label}
                  </div>
                  {col.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        fontSize: "0.82rem",
                        color: "#475569",
                        padding: "5px 0",
                        borderBottom: "1px solid #F8FAFC",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: col.c, fontWeight: 700 }}>›</span>
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
                justifyContent: "center",
              }}
            >
              {[
                ["🟢", "Node.js"],
                ["⚡", "Express"],
                ["🍃", "MongoDB"],
                ["⚛️", "React"],
                ["🔷", "Vite"],
                ["🎨", "Tailwind"],
                ["📲", "Twilio"],
                ["📧", "Nodemailer"],
                ["🔒", "JWT"],
                ["⏰", "node-cron"],
                ["📖", "Swagger"],
                ["☁️", "Atlas"],
                ["🗃️", "Zustand"],
                ["📡", "Axios"],
                ["🔑", "bcrypt"],
              ].map(([e, n]) => (
                <div key={n} className="lp-badge">
                  <span>{e}</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
          padding: "5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(0,200,83,0.07)",
            top: -200,
            left: -100,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.06)",
            bottom: -150,
            right: -80,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <Reveal
          style={{
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,200,83,0.12)",
              border: "1px solid rgba(0,200,83,0.25)",
              borderRadius: 100,
              padding: "6px 14px",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00C853",
                animation: "lp-pulse 2s ease infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#86EFAC",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Live & Deployed
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 900,
              color: "#F1F5F9",
              letterSpacing: "-0.025em",
              marginBottom: "1rem",
            }}
          >
            See the full project in action
          </h2>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            The dashboard is live — create an account to explore contact
            management, the template builder, campaign creation with live
            preview, cron scheduling, settings, and the complete auth flow.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <Link
              to="/register"
              id="cta-register"
              style={{
                textDecoration: "none",
                background: "#00C853",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "0.875rem 2rem",
                borderRadius: 12,
                boxShadow: "0 6px 24px rgba(0,200,83,0.35)",
              }}
            >
              Explore Live Dashboard →
            </Link>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                color: "#F1F5F9",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "0.875rem 2rem",
                borderRadius: 12,
              }}
            >
              Login
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {[
              "Node.js + Express",
              "React 19",
              "MongoDB Atlas",
              "JWT Auth",
              "Twilio WhatsApp",
              "Nodemailer",
              "node-cron",
              "Swagger",
            ].map((t) => (
              <span
                key={t}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 100,
                  padding: "4px 12px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#94A3B8",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ════ FOOTER ════ */}
      <footer
        style={{
          background: "#0F172A",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.875rem",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "1rem",
              color: "#F1F5F9",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "#00C853",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </div>
            SendHub
          </Link>
          <p
            style={{
              color: "#475569",
              fontSize: "0.78rem",
              textAlign: "center",
            }}
          >
            Full-Stack Multi-Channel Campaign Platform · Node.js · React ·
            MongoDB · Twilio · Nodemailer
          </p>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              ["Login", "/login", "link"],
              ["Dashboard", "/app", "link"],
              ["Register", "/register", "link"],
              ["About", "#about", "anchor"],
              ["Architecture", "#arch", "anchor"],
              ["API", "#api", "anchor"],
            ].map(([l, h, t]) =>
              t === "link" ? (
                <Link
                  key={l}
                  to={h}
                  style={{
                    textDecoration: "none",
                    color: "#475569",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#00C853")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  {l}
                </Link>
              ) : (
                <a
                  key={l}
                  href={h}
                  style={{
                    textDecoration: "none",
                    color: "#475569",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#00C853")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  {l}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
