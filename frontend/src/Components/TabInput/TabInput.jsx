import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ColorPicker from "../ColorPicker/ColorPicker";
import DeleteIcon from "@mui/icons-material/Delete";

function TabInput({ onAddTabGroup }) {
  const [urls, setUrls] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [color, setColor] = useState("#000000"); // default color

  const handleAddUrl = () => {
    if (currentUrl) {
      setUrls([...urls, currentUrl]);
      setCurrentUrl("");
    }
  };

  const handleRemoveUrl = (indexToRemove) => {
    setUrls(urls.filter((_, index) => index !== indexToRemove));
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
  };

  const handleSave = () => {
    if (groupName && urls.length > 0) {
      onAddTabGroup({ groupName, urls, color });
      setUrls([]);
      setGroupName("");
      setCurrentUrl("");
      setColor("#000000"); 
    }
  };

  return (
    <Box
      className="TabInput"
      padding={2}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" gap={2} alignItems="center">
        <TextField
          fullWidth
          id="group-name"
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <ColorPicker onColorChange={handleColorChange} />
      </Box>
      <Box display="flex" gap={2} alignItems="center">
        <TextField
          fullWidth
          id="url"
          label="URL"
          variant="outlined"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddUrl}>
          Add
        </Button>
      </Box>
      <List>
        {urls.map((url, index) => (
          <ListItem key={index}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <ListItemText primary={url} />
              <Button
                variant="text"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveUrl(index)}
              >
                Remove
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}

export default TabInput;
