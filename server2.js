import {
  askPlayerInputMsg,
  decodeData,
  welcomeMsg,
  whoseTurn,
} from "./server_messages.js";

const LISTENER = await Deno.listen({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
};

const gatherPlayers = async (listener, playerCount = 4) => {
  const players = [];
  for (let index = 0; index < playerCount; index++) {
    const player = await listener.accept();
    await player.write(welcomeMsg(index));
    players.push(player);
  }
  listener.close();
  return players;
};

const broadcastToAll = async (players, data) => {
  // data as Uint8Array
  for (const player of players) {
    await player.write(data);
  }
};

const readFromPlayer = async (player) => {
  const buffer = new Uint8Array(1024);
  await player.write(askPlayerInputMsg());

  const n = await player.read(buffer);
  const playerInput = decodeData(buffer.slice(0, n));
  // console.log(playerInput);
  return playerInput;
};

const main = async () => {
  const players = await gatherPlayers(LISTENER, 3);
  let currentPlayer = 0;

  console.log("game start");
  await sleep(100);

  while (true) {
    await broadcastToAll(players, whoseTurn(currentPlayer));
    await sleep(100);
    const playerInput = await readFromPlayer(players[currentPlayer]);
    await sleep(100);
    console.log("Player", currentPlayer, " input", playerInput);
    currentPlayer = (currentPlayer + 1) % players.length;
  }
};

await main();
