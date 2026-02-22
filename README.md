# ProtoCol — Medical protocol chat (RAG + Docker)

Web app for symptom-based diagnosis suggestions using RAG over clinical protocols. Frontend (React + Vite) and backend (FastAPI + sentence-transformers + OpenAI) run together via Docker Compose.

---

## How to run this project (with model inside + Docker Compose)

### 1. Prerequisites

- **Docker** and **Docker Compose** installed.
- **OpenAI API key** (for the LLM used in diagnosis).

### 2. Clone or open the project

```bash
cd "path/to/Datasaur 2025"
```

(If you cloned from GitHub, use the folder you cloned into.)

### 3. Create `.env` in the project root

In the same folder as `docker-compose.yml`, create a file named `.env` with:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Do not commit `.env` (it is in `.gitignore`).

### 4. RAG index (model) inside the project

The backend needs a pre-built RAG index in `model/rag_store/`:

- **`index.faiss`** — FAISS index (built from protocols).
- **`chunks.jsonl`** — Chunk metadata (created by the same build).

**If you already have these files** in `model/rag_store/`, skip to step 5.

**If you need to build them** (e.g. after a fresh clone, or when `index.faiss` is missing):

```bash
cd model
pip install -r requirements.txt
python rag_med.py build --jsonl protocols_corpus.jsonl --out-dir rag_store --encoder ai-forever/sbert_large_nlu_ru
cd ..
```

This creates `model/rag_store/index.faiss` and `model/rag_store/chunks.jsonl`. The first run can take a while (encoding all chunks). The encoder must be `ai-forever/sbert_large_nlu_ru` to match the API.

### 5. Run with Docker Compose

From the **project root** (where `docker-compose.yml` is):

```bash
docker compose up -d --build
```

- First build can take **10–20 minutes** (ML models are downloaded into the image).
- The frontend waits for the backend to be healthy; then the app is available at **http://localhost** (port 80).
- To watch backend logs until it is ready:  
  `docker compose logs -f backend`  
  Wait until you see **`API ready.`**

### 6. Use the app

- Open **http://localhost** in your browser.
- Chats are stored by client IP in the backend (SQLite in a Docker volume).

### 7. Stop

```bash
docker compose down
```

---

## Summary of what lives where

| Item              | Location / note                                      |
|-------------------|------------------------------------------------------|
| Frontend          | `frontend/` (React, Vite)                            |
| Backend API       | `model/` (FastAPI, RAG, OpenAI)                     |
| RAG artifacts     | `model/rag_store/` — need `index.faiss` + `chunks.jsonl` |
| Env / secrets     | `.env` in project root (not in Git)                 |
| Docker            | `docker-compose.yml` in project root                 |

More detail: see **DOCKER.md** (ports, volumes, env vars, GPU).

---

## Push the whole project to GitHub

Run these in the **project root** (same folder as `docker-compose.yml`). Replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and repository name (e.g. `johndoe/datasaur-2025`).

**First time (no Git yet):**

```bash
git init
git add .
git commit -m "Initial commit: ProtoCol medical chat with RAG and Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

**If the folder is already a Git repo:**

```bash
git add .
git commit -m "Initial commit: ProtoCol medical chat with RAG and Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

**If the remote `origin` already exists and you only want to change the URL:**

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

**Before pushing:**

1. Create the repository on GitHub (New repository, no README/.gitignore).
2. Do **not** commit `.env` or `model/.env` (they are in `.gitignore`).
3. `model/rag_store/index.faiss` is ignored; anyone who clones the repo must build the RAG index (step 4 above) before running Docker.

**One-line copy-paste** (replace `YOUR_USERNAME/REPO_NAME`):

```bash
git init && git add . && git commit -m "Initial commit: ProtoCol medical chat with RAG and Docker" && git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git && git push -u origin main
```

(If the repo already exists, use `git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git` instead of `git remote add origin ...`.)
