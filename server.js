const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();
// const

const broadcastToOtherPlayers = async (players, ignorePlayer, buffer) => {
  for (let index = 0; index < players.length; index++) {
    if (index === ignorePlayer) continue;
    await players[index].write(buffer);
    console.log("written to ", index);
  }
};

const broadcastToAllPlayers = async (players, announcement) => {
  for (const player of players) {
    await player.write(announcement);
  }
};

const encodeMessage = (message) => {
  const toBeEncoded = {
    talk: false,
    previousAnswer: "",
    message: message,
  };

  const messageJson = JSON.stringify(toBeEncoded);
  return ENCODER.encode(messageJson);
};

const getPlayers = async (listener, playerCount = 4) => {
  const players = [];
  for (let index = 0; index < playerCount; index++) {
    const player = await listener.accept();
    await player.write(
      encodeMessage(`Welcome to the game, your Id ${index}\n`),
    );
    players.push(player);
  }
  listener.close();
  return players;
};

const readPlayer = async (player, previousAnswer = "") => {
  const message = {
    talk: true,
    previousAnswer: previousAnswer,
  };
  const encodedMessage = ENCODER.encode(JSON.stringify(message));
  await player.write(encodedMessage);
  const buffer = new Uint8Array(4096);
  const n = await player.read(buffer);

  const decodeMessage = DECODER.decode(new Uint8Array(buffer.slice(0, n)));
  const jsonFormat = JSON.parse(decodeMessage);
  // console.log(jsonFormat);
  return buffer.slice(0, n);
};

const listener = await Deno.listen({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const main = async () => {
  const players = await getPlayers(listener, 2);
  // const buf = new Uint8Array(100);
  let nowPlaying = 0;

  // await broadcastToAllPlayers(players, "Game starts now\n");
  console.log("game start");
  // prompt();
  while (true) {
    // get one player input
    await broadcastToAllPlayers(
      players,
      encodeMessage(`wait for player ${nowPlaying} input\n`),
    );
    console.log("waiting to read player", nowPlaying);

    // read from this player
    const buf = await readPlayer(players[nowPlaying]);
    console.log("data from player", nowPlaying, DECODER.decode(buf));
    // write to other players
    const messageToWrite = new Uint8Array(buf);
    console.log("message getting broadcasted", DECODER.decode(buf));
    await broadcastToOtherPlayers(players, nowPlaying, messageToWrite);

    nowPlaying = ++nowPlaying % players.length;
  }
};

await main();
