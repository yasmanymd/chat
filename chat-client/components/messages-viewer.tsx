import { Box, List, ListItem, Paper } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import StarterKit from "@tiptap/starter-kit";
import { RichTextReadOnly } from "mui-tiptap";
import { useSession } from "next-auth/react";
import { FC, useRef } from "react";
import moment from "moment";

type IMessage = {
  message: string;
  author: string;
  email: string;
  time: Date;
};

type IMessagesViewerProps = { messages: IMessage[] };

const MessagesViewer: FC<IMessagesViewerProps> = ({ messages }) => {
  const session = useSession();
  const email = session.data?.user?.email;

  return (
    <List sx={{
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: 1
    }}>
      {messages?.map((msg, index) => (
        <Paper key={index} elevation={1} sx={{
          padding: 1,
          paddingBottom: 2,
          margin: 1,
          backgroundColor: msg.email === email ? green[100] : grey[100],
          width: 'fit-content',
          alignSelf: msg.email === email ? 'flex-end' : 'flex-start',
          position: 'relative'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{msg.author}</div>
          <div>
            <RichTextReadOnly
              content={msg.message}
              extensions={[StarterKit]}
            />
          </div>
          <div style={{ position: 'absolute', bottom: '1px', right: '5px', fontSize: '11px' }}>{moment(msg.time).calendar()}</div>
        </Paper>
      ))}
    </List>
  );
}

export default MessagesViewer;