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
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, Content-Type, Accept, Authorization",
      },
    },
  },
});
