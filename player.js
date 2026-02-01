const connection = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();

const parseMessage = (encodedMessage) => {
  const message = DECODER.decode(encodedMessage);
  console.log(message);
  const jsonVersion = JSON.parse(message);
  return jsonVersion;
};

while (true) {
  const BUF = new Uint8Array(4096);
  const n = await connection.read(BUF);
  const encodedMessage = new Uint8Array(BUF.slice(0, n));
  const message = parseMessage(encodedMessage);
  console.log(message);
  if (message.talk) {
    // console.clear();
    // console.log(message);
    // const playerInput = prompt("enter your answer ?");
    message.playerAnswer = prompt("enter your answer ?");
    message.talk = false
    await connection.write(ENCODER.encode(JSON.stringify(message)));
  }
}
