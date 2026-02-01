const connection = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const BUF = new Uint8Array(100);
const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();

while (true) {
  const n = await connection.read(BUF);
  const encodedMessage = new Uint8Array(BUF.slice(0, n));
  Deno.stdout.write(encodedMessage);
  if (DECODER.decode(encodedMessage).includes("YOUTURN")) {
    console.clear();
    const playerInput = prompt("enter your answer ?");
    await connection.write(ENCODER.encode(playerInput));
  }
}
