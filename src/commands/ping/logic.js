export async function pingLogic() {
  const timestamp = Date.now();
  return {
    ok: true,
    message: `Pong! 🏓\nLatency: ${Date.now() - timestamp}ms`
  };
}
