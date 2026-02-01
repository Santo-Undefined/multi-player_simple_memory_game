const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export const encodeData = (data) =>
  // data accpected as an object
  ENCODER.encode(JSON.stringify(data)); // retuns a Uint8Array

export const decodeData = (data) =>
  // data accpected as an Uint8Array
  JSON.parse(DECODER.decode(data)); // returns an object

export const welcomeMsg = (playerId) => {
  const message = {
    message: `Welcome, your iD ${playerId}`,
    talk: false,
  };
  return encodeData(message);
};

export const whoseTurn = (playerId) => {
  const message = {
    message: `Waiting for player ${playerId} to respond`,
    talk: false,
  };
  return encodeData(message);
};

export const askPlayerInputMsg = () =>
  encodeData({
    message: "Its your turn, enter the answer",
    talk: true,
  });
