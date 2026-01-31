const connection = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8000,
  transport: "tcp",
});

const buf = new Uint8Array(100);
const bytesRead = await connection.read(buf);

console.log(new TextDecoder().decode(buf));

while (true) {
  await connection.write(new TextEncoder().encode(prompt("enter something")));
  await connection.read(buf);
  Deno.stdout.write(buf);
}
