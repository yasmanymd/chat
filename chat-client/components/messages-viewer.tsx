import { Box, List, ListItem, Paper } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import StarterKit from "@tiptap/starter-kit";
import { RichTextReadOnly } from "mui-tiptap";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef, useState } from "react";
import moment from "moment";

type IMessage = {
  message: string;
  email: string;
  time: Date;
};

type IMessagesViewerProps = {
  socket: any
};

const MessagesViewer: FC<IMessagesViewerProps> = ({ socket }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const session = useSession();
  const email = session.data?.user?.email;
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  socket.off("msgToRoom");
  socket.on('msgToRoom', (msg: IMessage) => {
    console.log(msg)
    setMessages([...messages, msg]);
  });

  return (
    <List sx={{
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: 1
    }}
      ref={listRef}>
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
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{msg.email}</div>
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