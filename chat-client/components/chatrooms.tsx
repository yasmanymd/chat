import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IRoom } from "./lobby";
import { GroupAdd } from "@mui/icons-material";
import { toast } from "react-toastify";
import { createRoom } from "../queries/rooms";

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto'
};

type IChatRoomsProps = {
  socket: any,
  rooms: IRoom[],
  setRooms: Dispatch<SetStateAction<IRoom[]>>,
  selectedRoom: string | null,
  setSelectedRoom: Dispatch<SetStateAction<string>>
};

const ChatRooms: FC<IChatRoomsProps> = ({ socket, selectedRoom, setSelectedRoom, rooms, setRooms }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [unread, setUnread] = useState<Set<string>>(new Set());

  socket.off("unread");
  socket.on('unread', (msg: { room: string }) => {
    if (selectedRoom != msg.room) {
      unread.add(msg.room);
      setUnread(new Set(unread));
    }
  });

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddRoom = async (name: string) => {
    if (name && rooms.findIndex(room => room.name === name) < 0) {
      const result = await createRoom({ name });

      if (result?.errors) {
        toast.error('Error creating room.');
      } else {
        toast.success('Room created.');
        let list = [...rooms];
        list.push({ name });
        setRooms(list);
        setSelectedRoom(name);
        setRoomName('');
        handleCloseDialog();
      }
    }
  };

  const handleSelectedRoom = (selectedRoom: string) => {
    unread.delete(selectedRoom);
    setUnread(new Set(unread));
    setSelectedRoom(selectedRoom);
  }

  const onChangeRoomName = (e) => {
    setRoomName(e.currentTarget.value);
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <List sx={containerStyle}>
        <ListItem key={0}>
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={6}><Typography>Rooms</Typography></Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleClickOpen}>
                <GroupAdd />
              </IconButton>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', alignContent: 'space-around' }}>
          </Box>
        </ListItem>
        <Divider />
        {rooms?.map((room, index) => (
          <ListItemButton key={index + 1} selected={selectedRoom === room.name}>
            <Badge color="primary" variant="dot" invisible={!unread?.has(room.name)} anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
              <ListItemText id={`${index}`} primary={`${room.name}`} onClick={() => handleSelectedRoom(room.name)} />
            </Badge>
          </ListItemButton>
        ))}
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can add a new room to the chat. Please make sure the room name is unique. Other case, it will be ignored.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room name"
            fullWidth
            variant="standard"
            value={roomName}
            onChange={onChangeRoomName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleAddRoom(roomName) }}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChatRooms;