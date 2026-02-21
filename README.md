# Datasaur — Medical Symptom Chat

One-page frontend for an AI-powered symptom checker. Chat-style UI to describe symptoms and receive possible diagnosis suggestions (for informational use only).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Backend

The app sends `POST /api/chat` with body:

```json
{
  "messages": [{ "role": "user" | "assistant", "content": "..." }]
}
```

Respond with JSON:

```json
{
  "message": "Assistant reply text..."
}
```

Point your backend at port 3000 and set the proxy in `vite.config.ts`, or build and serve the app from your backend’s origin.

## Build

```bash
npm run build
npm run preview
```

## Disclaimer

This tool is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always seek qualified healthcare when needed.
