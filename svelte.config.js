import adapter from '@sveltejs/adapter-node' // Changed from adapter-auto

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      // default options are fine for Render, but you can customize output directory etc. here
      // out: 'build' (default)
    }), // Changed to use adapter-node
  },
}

export default config
