export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { redis } = await import("@/lib/redis");

    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}: cleaning up`);

      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down",
        );
        process.exit(1);
      }, 10000);

      try {
        await redis.quit();
        console.log("Redis connection closed.");
      } catch (err) {
        console.error("Error during Redis shutdown:", err);
        process.exit(1);
      }
      process.exit(0);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  }
};
