import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// creating global var so that whenever create offer comes,
//  it will send it to reciever's socket
// whenever create ans comes, it will send it to sender's socket.

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);

    // caching 

    if(message.type === "identify-as-sender") {
        senderSocket = ws;
    }
    else if(message.type === "identify-as-receiver") {
        receiverSocket = ws;
    }
    else if(message.type === "create-offer") {
        receiverSocket?.send(JSON.stringify({type: "offer", offer: message.offer}));
    }
    else if(message.type === "create-answer") {
        senderSocket?.send(JSON.stringify({type: "offer", offer: message.offer}));
    }
    // we will be using 5 operations on support.
    // identify-as-sender
    // identify-as-receiver
    // create offer
    // create ans
    // add ice candidate
  });
});