import { Close, Favorite, GroupRounded, MoreVertRounded, Send, Share } from "@mui/icons-material";
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Paper, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { grey } from '@mui/material/colors';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontFamily,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import MessagesViewer from "./messages-viewer";

type IChatProps = {
  selectedRoom: string | null,
  participants: string[] | null,
  setSelectedRoom: Dispatch<SetStateAction<string>>
}

const Chat: FC<IChatProps> = ({ selectedRoom, setSelectedRoom, participants }) => {
  if (!selectedRoom) {
    return null;
  }

  const theme = useTheme();
  const rteRef = useRef<RichTextEditorRef>(null);

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
      console.log(value);
      rteRef.current?.editor?.commands.clearContent();
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
        <MessagesViewer messages={Array(40).fill(1).map((v, i) => ({ message: `<p>Charlie ${i}, otro de los tuyos 🤣🤣🤣</p>`, author: 'Yasmany', email: 'yasmany@gmail.com', time: new Date() }))} />
      </Box>
      <Grid container sx={{ alignItems: 'center', resize: 'vertical', padding: 1 }}>
        <Grid item xs={11.5}>
          <RichTextEditor
            ref={rteRef}
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