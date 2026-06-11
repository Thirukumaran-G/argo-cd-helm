import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api";


const StageCard = ({ stage }) => {
  const color =
    stage.status === "synced" ? "#22c55e" :
    stage.status === "done"   ? "#3b82f6" : "#f59e0b";
  return (
    <div style={{
      background: "#1e1e2e",
      border: `1px solid ${color}`,
      borderRadius: 8,
      padding: "10px 16px",
      marginBottom: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <span style={{ color: "#cdd6f4" }}>{stage.name}</span>
      <span style={{
        color,
        fontWeight: 700,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}>
        {stage.status}
      </span>
    </div>
  );
};

export default function App() {
  const [health,  setHealth]  = useState(null);
  const [info,    setInfo]    = useState(null);
  const [gitops,  setGitops]  = useState(null);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [h, i, g] = await Promise.all([
          fetch(`${API_URL}/health`).then(r => r.json()),
          fetch(`${API_URL}/info`).then(r => r.json()),
          fetch(`${API_URL}/gitops-status`).then(r => r.json()),
        ]);
        setHealth(h);
        setInfo(i);
        setGitops(g);
      } catch {
        setError("Cannot reach API — is the backend running?");
      }
    };
    fetchAll();
    const t = setInterval(fetchAll, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#11111b",
      color: "#cdd6f4",
      fontFamily: "'Inter', sans-serif",
      padding: "40px 24px",
      maxWidth: 800,
      margin: "0 auto",
    }}>
      <h1 style={{ color: "#cba6f7", fontSize: 28, marginBottom: 4 }}>
        🚀 GitOps Dashboard
      </h1>
      <p style={{ color: "#6c7086", marginBottom: 32 }}>
        Minikube · ArgoCD · Helm · GitHub Actions Artifact
      </p>

      {error && (
        <div style={{
          background: "#45162a",
          border: "1px solid #f38ba8",
          borderRadius: 8,
          padding: 16,
          color: "#f38ba8",
          marginBottom: 24,
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        background: "#1e1e2e", borderRadius: 10,
        padding: 20, marginBottom: 20, border: "1px solid #313244",
      }}>
        <h2 style={{ color: "#a6e3a1", fontSize: 16, marginBottom: 12 }}>✅ Health</h2>
        {health ? (
          <>
            <div>Status: <strong style={{ color: "#a6e3a1" }}>{health.status}</strong></div>
            <div style={{ color: "#6c7086", fontSize: 13, marginTop: 4 }}>
              {health.timestamp}
            </div>
          </>
        ) : <span style={{ color: "#6c7086" }}>Loading...</span>}
      </div>

      <div style={{
        background: "#1e1e2e", borderRadius: 10,
        padding: 20, marginBottom: 20, border: "1px solid #313244",
      }}>
        <h2 style={{ color: "#89b4fa", fontSize: 16, marginBottom: 12 }}>📦 App Info</h2>
        {info ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 14 }}>
            {Object.entries(info).map(([k, v]) => (
              <div key={k}>
                <span style={{ color: "#6c7086" }}>{k}: </span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        ) : <span style={{ color: "#6c7086" }}>Loading...</span>}
      </div>

      <div style={{
        background: "#1e1e2e", borderRadius: 10,
        padding: 20, marginBottom: 20, border: "1px solid #313244",
      }}>
        <h2 style={{ color: "#f9e2af", fontSize: 16, marginBottom: 12 }}>🔄 Pipeline Stages</h2>
        {gitops ? (
          <>
            {gitops.stages.map(s => <StageCard key={s.name} stage={s} />)}
            <div style={{
              marginTop: 16, padding: "10px 16px",
              background: "#181825", borderRadius: 8,
              fontSize: 13, color: "#6c7086",
            }}>
              ArgoCD: <strong style={{ color: "#a6e3a1" }}>{gitops.argocd.sync_status}</strong>
              {" · "}
              Health: <strong style={{ color: "#a6e3a1" }}>{gitops.argocd.health_status}</strong>
              {" · "}
              Repo: <strong style={{ color: "#cba6f7" }}>{gitops.argocd.repo}</strong>
            </div>
          </>
        ) : <span style={{ color: "#6c7086" }}>Loading...</span>}
      </div>
    </div>
  );
}