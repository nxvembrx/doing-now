//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  runtimeConfig: {
    togglToken: "token",
    spotifyClientId: "client-id",
    spotifySecret: "secret",
    spotifyRefreshToken: "token",
  },
  esbuild: {
    options: {
      target: "esnext",
    },
  },
});
