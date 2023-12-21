import React, { useState } from "react";
import { Button, Box, List, ListItem, Chip, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add"; // Make sure to import AddIcon

function TabDisplay({ groupName, color, urls, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState(groupName);
  const [editedUrls, setEditedUrls] = useState(urls);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(
        editedGroupName,
        editedUrls.filter((url) => url.trim() !== "")
      );
    }
    setIsEditing(false);
  };

  const handleUrlChange = (index, newUrl) => {
    const updatedUrls = [...editedUrls];
    updatedUrls[index] = newUrl;
    setEditedUrls(updatedUrls);
  };

  const handleAddUrl = () => {
    setEditedUrls([...editedUrls, ""]);
  };

  const handleDeleteUrl = (index) => {
    const updatedUrls = editedUrls.filter((_, i) => i !== index);
    setEditedUrls(updatedUrls);
  };

  const handleOpenTabs = () => {
    let tabIds = [];
    const nonEmptyUrls = urls.filter((url) => url.trim() !== "");
    nonEmptyUrls.forEach((url, index) => {
      chrome.tabs.create({ url: url, active: false }, (tab) => {
        tabIds.push(tab.id);
        if (index === urls.length - 1) {
          createTabGroup(tabIds, editedGroupName, color);
        }
      });
    });
  };

  function createTabGroup(tabIds, groupName, groupColor) {
    chrome.tabs.group({ tabIds: tabIds }, function (groupId) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        chrome.tabGroups.update(groupId, {
          title: groupName,
          color: groupColor,
        });
      }
    });
  }

  return (
    <Box className="TabDisplay" padding={1} border="1px solid #ddd" marginBottom={"5px"} borderRadius={4} boxShadow={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
        <Box display="flex" alignItems="center" gap={1}>
          {isEditing ? (
            <TextField
              value={editedGroupName}
              onChange={(e) => setEditedGroupName(e.target.value)}
              variant="outlined"
              size="small"
            />
          ) : (
            <Chip
              label={groupName}
              style={{ 
                backgroundColor: color, 
                color: "white", 
                fontWeight: "bold",
                textShadow: `
                  -1px -1px 0 #000,  
                  1px -1px 0 #000,
                  -1px  1px 0 #000,
                  1px  1px 0 #000`
              }}
              size="large"
            />
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<OpenInBrowserIcon />}
            onClick={handleOpenTabs}
            disabled={isEditing}
          >
            Open
          </Button>
          {isEditing ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              style={{ marginLeft: "8px" }}
              color="primary"
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              style={{ marginLeft: "8px" }}
            >
              Edit
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            style={{ marginLeft: "8px" }}
            disabled={isEditing}
          >
            Delete
          </Button>
        </Box>
      </Box>
      {isEditing && (
        <List>
          {editedUrls.map((url, index) => (
            <ListItem key={index} dense>
              <TextField
                fullWidth
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button onClick={() => handleDeleteUrl(index)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
          <ListItem>
            <Button onClick={handleAddUrl}>
              <AddIcon /> Add URL
            </Button>
          </ListItem>
        </List>
      )}
    </Box>
  );
}

export default TabDisplay;
