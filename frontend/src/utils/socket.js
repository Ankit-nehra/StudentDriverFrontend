import { io } from "socket.io-client";

const socket = io("https://studentdriverbackend-3.onrender.com", {
  autoConnect: false,
});

export default socket;

