- make a simple game

# get the connection
- need player and server
- only 4 players should be able to join

# read from one and broadcast to others

## plan
- by default all players will listen
- server decides who will talk
- After that player sends their input it will again be sent to all
- then iteratively game goes on

### make a protocol for the server to speak with the players
sent a json which will contain instruction for player to talk or not, others messages

server side contract:
{
  talk: <t/f>
  message:{
    instruction: "wait for your turn" : "Enter the input"
    previousAnswer: "big string"
  }
}

player:
{
  answer:"big string + player answer"
}

[ ] first broadcast to all about game