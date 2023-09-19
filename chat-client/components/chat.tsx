import { Close, GroupRounded, Send } from "@mui/icons-material";
import { Avatar, Box, CardHeader, Grid, IconButton, Paper, useTheme } from "@mui/material";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { grey } from '@mui/material/colors';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import MessagesViewer from "./messages-viewer";

type IChatProps = {
  selectedRoom: string | null,
  setSelectedRoom: Dispatch<SetStateAction<string>>,
  socket: any
}

const Chat: FC<IChatProps> = ({ selectedRoom, setSelectedRoom, socket }) => {
  if (!selectedRoom) {
    return null;
  }

  const [participants, setParticipants] = useState<string[]>([]);
  const rteRef = useRef<RichTextEditorRef>(null);

  socket.off("participants");
  socket.on('participants', (msg: { participants: string[] }) => {
    setParticipants(msg.participants);
  });

  socket.off("userin");
  socket.on('userin', (msg: { email: string }) => {
    let list = [...participants];
    if (list.findIndex(item => item === msg.email) == -1) {
      list.push(msg.email);
      setParticipants(list);
    }
  });

  socket.off("userout");
  socket.on('userout', (msg: { email: string }) => {
    let list = participants.filter(item => item != msg.email);
    if (list.length != participants.length) {
      setParticipants(list);
    }
  });

  const participantsHeader = () => {
    if (!participants || participants.length == 0) {
      return null;
    }
    let text = "";
    if (participants.length == 1) {
      text = `${participants[0]} is online.`;
    } else {
      text = participants[0];
      for (let i = 1; i < participants.length - 1; i++) {
        text += `, ${participants[i]}`
      }
      text += ` and ${participants[participants.length - 1]} are online.`
    }
    return <div style={{ fontSize: '12px' }}>{text}</div>
  }

  const handleSend = () => {
    const value = rteRef.current?.editor?.getHTML();
    if (value && value != '<p></p>') {
      rteRef.current?.editor?.commands.clearContent();
      socket.emit('msg', { room: selectedRoom, message: value });
    }
  }

  const handleClose = () => {
    setSelectedRoom(null);
  }

  return (
    <Paper elevation={24} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: grey[700] }} aria-label="recipe">
            <GroupRounded />
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={handleClose}>
            <Close />
          </IconButton>
        }
        title={selectedRoom}
        subheader={participantsHeader()}
        sx={{ backgroundColor: grey[300] }}
      />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 1 }}>
        <MessagesViewer socket={socket} />
      </Box>
      <Grid container sx={{ alignItems: 'center', resize: 'vertical', padding: 1 }}>
        <Grid item xs={11.5}>
          <RichTextEditor
            ref={rteRef}
            editorProps={{
              handleDOMEvents: {
                keydown: (view, event) => {
                  if (event.key === "Enter") {
                    handleSend();
                    event.preventDefault();
                  }
                  return false;
                }
              }
            }}
            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
            // Optionally include `renderControls` for a menu-bar atop the editor:
            renderControls={() => (
              <MenuControlsContainer>
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonStrikethrough />
              </MenuControlsContainer>
            )}
          />
        </Grid>
        <Grid item xs={0.5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handleSend}>
            <Send />
          </IconButton>
        </Grid>
      </Grid>
    </Paper >
  );
}

export default Chat;