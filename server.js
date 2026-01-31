const listener = await Deno.listen({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

// listener.accept();
// listener.

const getPlayers = async (listener, playerCount = 4) => {
  const players = [];

  for (let index = 0; index < playerCount; index++) {
    const player = await listener.accept();
    player.write(
      new TextEncoder().encode(`Welcome to the game, your Id ${index}`),
    );
    players.push(player);
  }
  listener.close();
};

await getPlayers(listener);
