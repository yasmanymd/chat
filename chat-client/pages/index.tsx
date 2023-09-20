import { useSession } from "next-auth/react";
import Lobby from "../components/lobby";
import { ToastContainer } from "react-toastify";
const { io } = require("socket.io-client");
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { data, status } = useSession();
  if (status === 'authenticated' && data) {
    const socket = io('http://localhost:3001/chat');
    socket.emit('auth', { email: data.user.email })

    return (
      <>
        <Lobby socket={socket}></Lobby>
        <ToastContainer />
      </>
    );
  }

  return null;
}