
import { Box, Paper, Typography } from "@mui/material";
import { API_BASE } from "../../utils/constants";

export default function MessageBubble({ message, isOwn, highlight}) {
  const getHighlightedText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ backgroundColor: 'yellow', fontWeight: 600 }}>{part}</span>
      ) : (
        part
      )
    );
  };
  return (
    <Box
      display="flex"
      justifyContent={isOwn ? "flex-end" : "flex-start"}
      mb={1}
    >
      <Paper
        sx={{
          p: 1.5,
          maxWidth: "70%",
          backgroundColor: isOwn ? "#e3f2fd" : "#ffffff"
        }}
      >
        {message.type === "text" && (
          <Typography>{getHighlightedText(message.textContent, highlight)}</Typography>
        )}
        {message.type === "audio" && message.audioUrl && (
          <audio controls src={message.audioUrl.startsWith('http') ? message.audioUrl : `${API_BASE.replace('/api','')}${message.audioUrl}`} />
        )}
        <Typography variant="caption" color="text.secondary">
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
}
