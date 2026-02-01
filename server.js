const ENCODER = new TextEncoder();

const broadcastToOtherPlayers = async (players, ignorePlayer, buffer) => {
  for (let index = 0; index < players.length; index++) {
    if (index === ignorePlayer) continue;
    await players[index].write(buffer);
    console.log("written to ", index);
  }
};

const broadcastToAllPlayers = async (players, announcement) => {
  const message = ENCODER.encode(announcement);
  for (const player of players) {
    await player.write(message);
  }
};

const getPlayers = async (listener, playerCount = 4) => {
  const players = [];
  for (let index = 0; index < playerCount; index++) {
    const player = await listener.accept();
    player.write(
      new TextEncoder().encode(
        `Welcome to the game, your Id ${index}, wait for others\n`,
      ),
    );
    players.push(player);
  }
  listener.close();
  return players;
};

const listener = await Deno.listen({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const main = async () => {
  const players = await getPlayers(listener, 2);
  const buf = new Uint8Array(100);
  let nowPlaying = 0;

  await broadcastToAllPlayers(players, "Game starts now\n");
  console.log("game start");

  while (true) {
    // get one player input
    await broadcastToAllPlayers(players, `wait for player ${nowPlaying} input\n`);
    console.log("waiting to read player", nowPlaying);

    // read from this player
    await players[nowPlaying].write(ENCODER.encode("YOUTURN"));
    const n = await players[nowPlaying].read(buf);

    // write to other players
    const messageToWrite = new Uint8Array(buf.slice(0, n));
    await broadcastToOtherPlayers(players, nowPlaying, messageToWrite);

    // for (let index = 1; index < players.length; index++) {
    //   const playerToWrtie = (nowPlaying + index) % players.length;
    //   await players[playerToWrtie].write(buf);
    //   console.log("written to ", playerToWrtie);
    // }

    nowPlaying = ++nowPlaying % players.length;
  }
};

await main();
