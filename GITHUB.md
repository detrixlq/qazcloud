# Deploy this project to GitHub

Follow these steps to put the project on GitHub and keep it in sync.

---

## 1. Prepare the repo (first time only)

### 1.1 Initialize Git (if the folder is not yet a repo)

Open a terminal in the project root (e.g. `Datasaur 2025`):

```bash
cd "c:\Users\detrix\Documents\Datasaur 2025"
git init
```

### 1.2 Check what will be committed

The repo uses a `.gitignore` so these are **not** committed:

- `.env` and `model/.env` (secrets)
- `node_modules/`
- `model/rag_store/index.faiss` (build it locally; see DOCKER.md)
- `frontend/dist/`, `__pycache__/`, `.venv/`, etc.

To see which files Git will add:

```bash
git status
```

If anything secret or huge appears (e.g. `.env`, `index.faiss`), add it to `.gitignore` and run `git status` again.

---

## 2. Create the repository on GitHub

1. Open [github.com](https://github.com) and sign in.
2. Click **“+”** (top right) → **“New repository”**.
3. Set:
   - **Repository name:** e.g. `datasaur-2025` or `protocol-medical-chat`.
   - **Visibility:** Private or Public.
   - **Do not** add a README, .gitignore, or license (you already have a local repo).
4. Click **“Create repository”**.

---

## 3. Connect the local repo and push

GitHub will show “Quick setup” with commands. You can use these (replace `YOUR_USERNAME` and `REPO_NAME` with your repo):

```bash
# Add all files (respecting .gitignore)
git add .
git commit -m "Initial commit: medical protocol chat with RAG and Docker"

# Rename branch to main if needed (GitHub default)
git branch -M main

# Add GitHub as remote (use the URL from your new repo)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

## 4. After the first push

- **Clone on another machine:**  
  `git clone https://github.com/YOUR_USERNAME/REPO_NAME.git`  
  Then create `.env` (see DOCKER.md), build the RAG index, and run `docker compose up -d --build`.

- **Daily workflow:**
  ```bash
  git add .
  git commit -m "Short description of changes"
  git push
  ```

- **Secrets:**  
  Never commit `.env`. Set `OPENAI_API_KEY` in the server’s environment or in a CI secret when deploying.

---

## 5. Optional: add a README

If the repo has no README yet, create `README.md` in the project root with a short description, how to run locally (e.g. Docker from DOCKER.md), and that `OPENAI_API_KEY` and the RAG index build are required.

---

## Quick copy-paste (after creating the repo on GitHub)

Replace `YOUR_USERNAME/REPO_NAME` with your GitHub repo (e.g. `johndoe/datasaur-2025`):

```bash
cd "c:\Users\detrix\Documents\Datasaur 2025"
git init
git add .
git commit -m "Initial commit: medical protocol chat with RAG and Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

If the folder is already a Git repo, skip `git init` and run only the other lines (and fix the remote if it already exists: `git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git`).
