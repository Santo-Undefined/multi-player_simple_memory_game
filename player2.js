import { decodeData, encodeData } from "./server_messages.js";

// const DECODER = new TextDecoder();
// const ENCODER = new TextEncoder();

const CONNECTION = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const readFromServer = async (connection) => {
  const buffer = new Uint8Array(1024);
  const n = await connection.read(buffer);
  // console.log(DECODER.decode(new Uint8Array(buffer.slice(0, n))));
  // const message = DECODER.decode(new Uint8Array(buffer.slice(0, n)));
  const message = decodeData(buffer.slice(0, n));
  return message;
};

const writeToServer = async (connection, input) => {
  const message = {
    answer: input,
  };
  await connection.write(encodeData(message));
};

const main = async () => {
  console.log("waiting to connect to server");

  while (true) {
    const message = await readFromServer(CONNECTION);
    console.log(message);
    if (message.talk) {
      const input = prompt("Enter your answer");
      await writeToServer(CONNECTION, input);
    }
  }
};

await main();
