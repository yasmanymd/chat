import { Avatar, Box, Checkbox, Container, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import ChatRooms from "./chatrooms";
import Chat from "./chat";
import Header from "./header";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRooms } from "../queries/rooms";

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto'
};

export type IRoom = {
  name: string
};

export type ILobbyProps = {
  socket: any
};

const Lobby: FC<ILobbyProps> = ({ socket }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getRooms();
      if (result.status === 200) {
        setRooms(result.data);
      } else {
        toast.error('Error getting rooms.');
      }
    })();
  }, []);

  const handleSetSelectedRoom = (room: string) => {
    setSelectedRoom(room);
    socket.emit('move', { leaving: selectedRoom, joining: room });
  }

  return (
    <Box>
      <Header />
      <Grid container sx={{ paddingTop: '64px' }}>
        <Grid item xs={2} sx={containerStyle}>
          <ChatRooms
            socket={socket}
            rooms={rooms}
            setRooms={setRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={handleSetSelectedRoom} />
        </Grid>
        <Grid item xs={10} padding={2} sx={{ height: 'calc(100vh - 70px)' }}>
          <Chat
            socket={socket}
            selectedRoom={selectedRoom}
            setSelectedRoom={handleSetSelectedRoom} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Lobby;