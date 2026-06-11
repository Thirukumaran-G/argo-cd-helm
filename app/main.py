from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime
import platform

app = FastAPI(title="GitOps Demo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "GitOps Demo API is running"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/info")
def info():
    return {
        "app": "gitops-demo",
        "version": "1.0.0",
        "environment": "dev",
        "hostname": platform.node(),
        "python": platform.python_version(),
    }

@app.get("/gitops-status")
def gitops_status():
    return {
        "pipeline": "Application Repo Pipeline",
        "stages": [
            {"name": "Developer Change",          "status": "done"},
            {"name": "CI Pipeline Build+Test",    "status": "done"},
            {"name": "Save Docker Artifact",      "status": "done"},
            {"name": "Update Helm values.yaml",   "status": "done"},
            {"name": "ArgoCD Reconcile",          "status": "synced"},
        ],
        "argocd": {
            "sync_status": "Synced",
            "health_status": "Healthy",
            "repo": "private-git-repo",
        }
    }