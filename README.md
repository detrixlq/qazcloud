# ProtoCol — Medical protocol chat

A web app that suggests possible diagnoses from symptom descriptions using RAG over clinical protocols. Built with React (frontend), FastAPI + sentence-transformers + OpenAI (backend), and Docker Compose.

---

## Requirements

- **Docker** and **Docker Compose** installed on your machine
- **OpenAI API key** (used by the backend for the diagnosis LLM)
- Enough disk space and RAM for the backend (ML models and FAISS index)

---

## How to run it on your computer

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

Replace `YOUR_USERNAME/REPO_NAME` with the actual repo URL (e.g. `johndoe/protocol-medical-chat`).

### 2. Add your OpenAI API key

In the project root (the folder that contains `docker-compose.yml`), create a file named `.env` with:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Use your own key from [OpenAI](https://platform.openai.com/api-keys). Do not share or commit this file.

### 3. Build the RAG index

The backend needs a pre-built search index. It is not included in the repo, so you must build it once.

From the project root:

```bash
cd model
pip install -r requirements.txt
python rag_med.py build --jsonl protocols_corpus.jsonl --out-dir rag_store --encoder ai-forever/sbert_large_nlu_ru
cd ..
```

This creates `model/rag_store/index.faiss` and updates `model/rag_store/chunks.jsonl`. The first run can take 10–30 minutes depending on your machine. The encoder name must stay as above to match the API.

### 4. Start the app with Docker Compose

From the project root:

```bash
docker compose up -d --build
```

- The **first build** may take 10–20 minutes while ML models are downloaded into the image.
- The frontend container waits for the backend to be healthy. When the backend is ready, the app is served at **http://localhost** (port 80).

To see when the backend is ready:

```bash
docker compose logs -f backend
```

Wait until you see **`API ready.`** in the logs. Then open **http://localhost** in your browser.

### 5. Use the app

- Open **http://localhost** in your browser.
- Enter symptoms; the app returns possible diagnoses and protocol-based details.
- Chats are stored per client (by IP) in a SQLite database inside the backend container.

### 6. Stop the app

```bash
docker compose down
```

---

## Project layout

| Part        | Location              | Description                          |
|------------|------------------------|--------------------------------------|
| Frontend   | `frontend/`            | React + Vite UI                      |
| Backend    | `model/`               | FastAPI, RAG, sentence-transformers   |
| RAG data   | `model/rag_store/`     | FAISS index + chunks (you build these) |
| Docker     | `docker-compose.yml`   | Runs frontend + backend together     |

For more (ports, volumes, env vars, GPU): see **DOCKER.md**.

---

## Troubleshooting

- **502 Bad Gateway** — Backend is still starting or failed. Check `docker compose logs backend`. Ensure `model/rag_store/index.faiss` exists (step 3) and `.env` has a valid `OPENAI_API_KEY`.
- **Missing index.faiss** — Run step 3 from the project root. The build script creates the index and chunks.
- **Slow first request** — The first diagnosis can be slow while models run; later requests are faster.
