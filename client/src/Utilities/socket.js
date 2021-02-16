import { io } from "socket.io-client";
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};
const socket = io.connect('http://localhost:4000',connectionOptions)

export { socket };