const connection = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const buf = new Uint8Array(40);
const bytesRead = await connection.read(buf);

console.log(new TextDecoder().decode(buf));
