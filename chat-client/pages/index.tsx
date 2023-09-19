import { useSession } from "next-auth/react";
import Lobby from "../components/lobby";
const { io } = require("socket.io-client");

export default function Home() {
  const { data, status } = useSession();
  if (status === 'authenticated' && data) {
    const socket = io('http://localhost:3001/chat');
    socket.emit('auth', { email: data.user.email })

    socket.on('msgToClient', (message) => {
      console.log(message);
      //this.receivedMessage(message)
    });

    socket.on('connect', () => {
      console.log('connect ', data)
      //this.check();
    });

    socket.on('joinedRoom', (room) => {
      console.log('joinedroom')
      //this.rooms[room] = true;
    });

    socket.on('leftRoom', (room) => {
      console.log('leftroom')
      //this.rooms[room] = false;
    });

    return (
      <Lobby socket={socket}></Lobby>
    );
  }

  return null;
}