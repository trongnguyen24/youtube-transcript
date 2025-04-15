import { json } from '@sveltejs/kit';
import { YoutubeTranscript } from 'youtube-transcript';
import { env } from '$env/dynamic/private'; // Use dynamic for server-side env vars

// Load the API key from environment variables
const SECRET_API_KEY = env.API_KEY;

if (!SECRET_API_KEY) {
  console.error("API_KEY environment variable is not set!");
  // Optionally throw an error during startup if the key is essential
  // throw new Error("API_KEY environment variable is not set!");
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  // 1. Check API Key
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${SECRET_API_KEY}`) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get YouTube URL from request body
  let url;
  try {
    const body = await request.json();
    url = body.url;
    if (!url || typeof url !== 'string') {
      throw new Error('Missing or invalid "url" in request body');
    }
    // Improved URL validation using Regex
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
    if (!youtubeRegex.test(url)) {
      throw new Error('Invalid YouTube URL format');
    }
  } catch (error) {
    return json({ error: 'Bad Request: ' + (error instanceof Error ? error.message : 'Invalid JSON') }, { status: 400 });
  }

  // 3. Fetch Transcript
  try {
    console.log(`Fetching transcript for URL: ${url}`);
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    console.log(`Successfully fetched transcript with ${transcript.length} segments.`);
    return json({ transcript });
  } catch (error) {
    console.error(`Error fetching transcript for ${url}:`, error);
    // Provide more specific error messages if possible
    let errorMessage = 'Failed to fetch transcript.';
    let statusCode = 500;

    if (error instanceof Error) {
        if (error.message.includes('disabled transcript') || error.message.includes('No transcript found')) {
            errorMessage = 'Transcript is disabled or unavailable for this video.';
            statusCode = 404; // Not Found might be appropriate
        } else if (error.message.includes('Invalid video ID') || error.message.includes('Video not found')) {
            errorMessage = 'Invalid or non-existent YouTube video URL.';
            statusCode = 400; // Bad Request
        }
    }

    return json({ error: errorMessage, details: error instanceof Error ? error.message : String(error) }, { status: statusCode });
  }
}
