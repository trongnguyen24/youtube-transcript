# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

---

## YouTube Transcript API

This project includes a simple API endpoint to fetch transcripts from YouTube videos.

### Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create Environment File:**
    Create a `.env` file in the root directory of the project and add your secret API key:
    ```dotenv
    # .env
    API_KEY="YOUR_SECRET_API_KEY_HERE"
    ```
    Replace `"YOUR_SECRET_API_KEY_HERE"` with a strong, unique secret key. This key is required to authenticate requests to the API.

### Running the API

Start the SvelteKit development server:

```bash
npm run dev
```

The server will typically run on `http://localhost:5173`.

### Using the API Endpoint

Send a `POST` request to the `/api/transcript` endpoint.

- **URL:** `http://localhost:5173/api/transcript` (adjust port if necessary)
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer YOUR_SECRET_API_KEY_HERE` (Replace with your actual API key from `.env`)
  - `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "url": "YOUTUBE_VIDEO_URL_HERE"
  }
  ```
  Replace `"YOUTUBE_VIDEO_URL_HERE"` with the URL of the YouTube video you want the transcript for (e.g., `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`).

**Example using `curl`:**

```bash
curl -X POST http://localhost:5173/api/transcript \
-H "Authorization: Bearer YOUR_SECRET_API_KEY_HERE" \
-H "Content-Type: application/json" \
-d '{ "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }'
```

**Responses:**

- **Success (200 OK):** Returns a JSON object containing the transcript:
  ```json
  {
    "transcript": [
      { "text": "Never gonna give you up", "duration": 4000, "offset": 1000 },
      { "text": "Never gonna let you down", "duration": 3500, "offset": 5000 }
      // ... more transcript segments
    ]
  }
  ```
- **Unauthorized (401 Unauthorized):** Incorrect or missing API key in the `Authorization` header.
- **Bad Request (400 Bad Request):** Invalid JSON body or invalid/missing YouTube URL.
- **Not Found (404 Not Found):** Transcript is disabled or unavailable for the video.
- **Internal Server Error (500 Internal Server Error):** Failed to fetch the transcript for other reasons.
