import { useSession } from "next-auth/react";
import Lobby from "../components/lobby";
const { io } = require("socket.io-client");

export default function Home() {
  const { data, status } = useSession();
  if (status === 'authenticated' && data) {
    const socket = io('http://localhost:3001/chat');
    socket.emit('auth', { email: data.user.email })

    return (
      <Lobby socket={socket}></Lobby>
    );
  }

  return null;
}