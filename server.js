const listener = await Deno.listen({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

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
  return players;
};

const main = async () => {
  const players = await getPlayers(listener);
  const buf = new Uint8Array(100);
  let nowPlaying = 0;

  console.log("in the loop");
  while (true) {
    // get one player input
    await players[nowPlaying].read(buf);
    console.log("read player", nowPlaying);

    // write to other players
    for (let index = 1; index < players.length; index++) {
      const playerToWrtie = (nowPlaying + index) % players.length;
      await players[playerToWrtie].write(buf);
      console.log("written to ", playerToWrtie);
    }

    nowPlaying = ++nowPlaying % players.length;
  }
};

await main();
