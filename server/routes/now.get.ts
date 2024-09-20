import { SpotifyApi, Track, TrackItem } from "@spotify/web-api-ts-sdk";
import { Toggl } from "toggl-track";
import { refreshAccessToken, spotifyAccessToken } from "./lib/spotify";
import { getRandomActivity } from "./lib/activities";

const toggl = new Toggl({
  auth: {
    token: useRuntimeConfig().togglToken,
  },
});

let spotify: SpotifyApi;

if (spotifyAccessToken) {
  if (spotifyAccessToken.expires - Date.now() <= 0) {
    await refreshAccessToken(useRuntimeConfig().spotifyRefreshToken);
  }

  spotify = SpotifyApi.withAccessToken(
    useRuntimeConfig().spotifyClientId,
    spotifyAccessToken
  );
} else {
  await refreshAccessToken(useRuntimeConfig().spotifyRefreshToken);
  spotify = SpotifyApi.withAccessToken(
    useRuntimeConfig().spotifyClientId,
    spotifyAccessToken
  );
}

function friendlyDuration(duration: number) {
  const ONE_SECOND = 1000;
  const ONE_MINUTE = ONE_SECOND * 60;
  const ONE_HOUR = ONE_MINUTE * 60;

  if (duration < ONE_MINUTE) {
    return `${Math.ceil(duration / ONE_SECOND)} seconds`;
  }

  if (duration < ONE_HOUR) {
    return `${Math.ceil(duration / ONE_MINUTE)} minutes`;
  }

  return `${Math.ceil(duration / ONE_HOUR)} hours`;
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
  });
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = "No Content.";
    return "OK";
  }

  const entry = await toggl.timeEntry.current();

  const activity = entry
    ? `${entry.tags[0] ?? getRandomActivity()}`
    : "doing something in secret";

  const duration = entry
    ? `, and I've been at it for about ${friendlyDuration(
        Math.round(Date.now() - Date.parse(entry.start))
      )} now`
    : "";

  const currentPlaying = await spotify.player.getPlaybackState();

  const song = currentPlaying
    ? ` while listening to "${currentPlaying.item.name}" by ${
        (currentPlaying.item as Track).artists[0].name
      }`
    : "";

  return {
    line: `Right now, I am ${activity}${song}${duration}.`,
  };
});
