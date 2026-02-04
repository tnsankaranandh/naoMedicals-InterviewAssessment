import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={1}
      borderBottom="1px solid #e0e0e0"
      bgcolor="#fafafa"
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search messages"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <IconButton onClick={onClear}>
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchBar;
