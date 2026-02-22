# Docker (production)

## Prerequisites

- **Backend**: The `model/rag_store/` directory must contain pre-built RAG artifacts. If either is missing, the backend crashes on startup and you get **502 Bad Gateway**.

  Build the index **before** building the Docker image (from the project root):

  ```bash
  cd model
  pip install -r requirements.txt
  python rag_med.py build --jsonl protocols_corpus.jsonl --out-dir rag_store --encoder ai-forever/sbert_large_nlu_ru
  cd ..
  ```

  This creates `rag_store/index.faiss` and `rag_store/chunks.jsonl`. The encoder must match the one used by the API (`ai-forever/sbert_large_nlu_ru`). Then run `docker compose build` (or `up --build`).

## Build and run

From the project root:

```bash
docker compose up -d --build
```

**First run:** ML models are pre-downloaded during `docker compose build`, so the first build can take 10–20 minutes (one-time). After that, container startup is typically under 1–2 minutes. The frontend waits for the backend to become healthy before starting; once you see `API ready.` in `docker compose logs backend`, http://localhost is ready.

To watch backend startup progress:

```bash
docker compose logs -f backend
```

Wait until you see `API ready.` If the backend crashes (e.g. missing `index.faiss`), fix the cause and restart.

- **Frontend**: http://localhost (port 80)
- **API**: Proxied at http://localhost/api (no direct backend port exposed by default)

## Persistence

- Chat database is stored in the `backend_data` volume at `/app/data/chats.db` inside the backend container.

## Optional: expose backend port

To call the API directly (e.g. from another service), add to `backend` in `docker-compose.yml`:

```yaml
ports:
  - "8000:8000"
```

## Environment

- **Backend**
  - **`OPENAI_API_KEY`** (required for diagnosis): Set in a `.env` file in the project root or pass when running:
    ```bash
    export OPENAI_API_KEY=sk-your-key
    docker compose up -d
    ```
    If `OPENAI_API_KEY` is missing, the app starts but `/diagnose` will fail with a clear error.
  - `CORS_ORIGINS`: Comma-separated origins (default includes localhost).
  - `CHATS_DB_PATH`: SQLite path (default in container: `/app/data/chats.db` when using the volume).
- **Frontend**
  - Build-time: `VITE_API_BASE=/api` so the app uses the same-origin `/api` path.

## GPU (CUDA)

For GPU-backed inference, use a CUDA base image and `faiss-gpu` in `model/requirements.txt`, and add `runtime: nvidia` (or your runtime) to the `backend` service in `docker-compose.yml`.
