const redirect_uri = "http://localhost:3000/spotifycallback";

export default defineEventHandler(async (event) => {
  const scope = "user-read-playback-state";

  const url = `https://accounts.spotify.com/authorize?client_id=${
    useRuntimeConfig().spotifyClientId
  }&response_type=code&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&scope=${encodeURIComponent(scope)}`;

  return sendRedirect(event, url);
});
