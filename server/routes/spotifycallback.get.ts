import { setSpotifyAccessToken } from "./lib/spotify";

const redirect_uri = "http://localhost:3000/spotifycallback";

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  //   var authOptions = {
  //     url: "https://accounts.spotify.com/api/token",
  //     form: {
  //       code: code,
  //       redirect_uri: redirect_uri,
  //       grant_type: "authorization_code",
  //     },
  //   };

  const body = await fetch("https://accounts.spotify.com/api/token", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          useRuntimeConfig().spotifyClientId +
            ":" +
            useRuntimeConfig().spotifySecret
        ).toString("base64"),
    },
    method: "POST",
    body: new URLSearchParams({
      code: code as string,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  });

  const res = await body.json();

  setSpotifyAccessToken(res.access_token);

  return { res };
});
