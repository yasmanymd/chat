import { Avatar, Box, Checkbox, Container, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import ChatRooms from "./chatrooms";
import Chat from "./chat";
import Header from "./header";
import { useEffect, useState } from "react";
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

export default function Lobby() {
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

  return (
    <Box>
      <Header />
      <Grid container sx={{ paddingTop: '64px' }}>
        <Grid item xs={2} sx={containerStyle}>
          <ChatRooms rooms={rooms} setRooms={setRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        </Grid>
        <Grid item xs={10} padding={2} sx={{ height: 'calc(100vh - 70px)' }}>
          <Chat participants={["yasmany", "marien", "jason", "alex", "user1", "user2", "user3"]} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}></Chat>
        </Grid>
      </Grid>
    </Box>
  );
}