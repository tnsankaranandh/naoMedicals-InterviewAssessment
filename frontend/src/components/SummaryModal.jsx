import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";

const SummaryModal = ({ open, onClose, summary, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>AI Consultation Summary</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography>Generating summary...</Typography>
        ) : summary ? (
          <Box whiteSpace="pre-wrap">
            <Typography variant="body1">{summary}</Typography>
          </Box>
        ) : (
          <Typography>No summary available.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryModal;
