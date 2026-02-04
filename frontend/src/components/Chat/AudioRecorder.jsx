
import api from "../../services/api";
import { socket } from "../../services/socket";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";

export default function AudioRecorder({ conversationId }) {
  const { user } = useContext(AuthContext);
  let recorder;
  let chunks = [];

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    recorder.start();
    recorder.ondataavailable = e => chunks.push(e.data);
  };

  const stop = async () => {
    recorder.stop();
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const form = new FormData();
      form.append("audio", blob);
      form.append("conversationId", conversationId);
      try {
        const res = await api.post("/messages/audio", form);
        // Emit the audio message on socket for real-time update
        socket.emit("sendMessage", {
          ...res.data,
          senderRole: user.role,
          senderId: user.id
        });
      } catch (err) {
        // Optionally handle error
      }
    };
  };

  return (
    <>
      <Button  variant="contained" onClick={start}> 🎙 Start Recording</Button>
      <Button  variant="contained" onClick={stop}> ⏹ Stop Recording</Button>
    </>
  );
}
