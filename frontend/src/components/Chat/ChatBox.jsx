import { useEffect, useState } from "react";
import api from "../../services/api";
import { socket } from "../../services/socket";
import MessageBubble from "./MessageBubble";
import AudioRecorder from "./AudioRecorder";
import { Button, TextField } from "@mui/material";

export default function ChatBox({ conversation, search }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/messages/${conversation._id}`).then(res => {
      setMessages(res.data);
      setLoading(false);
    });
    socket.emit("joinConversation", conversation._id);

    socket.on("receiveMessage", msg => {
      if (msg.conversationId === conversation._id) {
        setMessages(prev => [...prev, msg]);
      }
    });
    // Cleanup listener
    return () => socket.off("receiveMessage");
  }, [conversation]);

  useEffect(() => {
    setLoading(true);
    api.get(`/messages/${conversation._id}`).then(res => {
      setMessages(res.data);
      setLoading(false);
    });
  }, [conversation._id]);

  // useEffect(() => {
  //     setLoading(true);
  //     api.get(`/messages/search/${conversation._id}?q=${encodeURIComponent(search)}`)
  //       .then(res => setMessages(res.data))
  //       .finally(() => setLoading(false));
  // }, [search]);

  const sendText = async () => {
    const res = await api.post("/messages/text", {
      conversationId: conversation._id,
      text
    });
    socket.emit("sendMessage", res.data);
    setText("");
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        messages.map(m => <MessageBubble key={m._id} message={m} highlight={search}/>)
      )}
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" onClick={sendText}>Send</Button>
      <AudioRecorder conversationId={conversation._id} />
    </div>
  );
}
