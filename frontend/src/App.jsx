import React, { useState, useEffect } from "react";
import "./App.css";
import TabDisplay from "./Components/TabDisplay/TabDisplay";
import TabInput from "./Components/TabInput/TabInput";
import { Button } from "@mui/material";

function App() {
  const [tabGroups, setTabGroups] = useState([]);
  const [creationMode, setCreationMode] = useState(false);


  useEffect(() => {
    const tempTabGroups = JSON.parse(localStorage.getItem("tabGroups"));
    if (tempTabGroups) {
      setTabGroups(tempTabGroups);
    }
  },[])
  

  const handleAddTabGroup = (newGroup) => {
    setTabGroups([...tabGroups, newGroup]);
    localStorage.setItem("tabGroups", JSON.stringify([...tabGroups, newGroup]));
  };

  const handleDelete = (indexToDelete) => {
    const tempTabGroups = tabGroups.filter((_, index) => index !== indexToDelete);
    setTabGroups(tempTabGroups);
    localStorage.setItem("tabGroups", JSON.stringify(tempTabGroups));
};

const handleUpdate = (indexToUpdate, updatedGroupName, updatedUrls) => {
  const updatedTabGroups = tabGroups.map((group, index) => {
    if (index === indexToUpdate) {
      return { ...group, groupName: updatedGroupName, urls: updatedUrls };
    }
    return group;
  });
  setTabGroups(updatedTabGroups);
  localStorage.setItem("tabGroups", JSON.stringify(updatedTabGroups));
};


  const toggleCreationMode = () => {
    setCreationMode(!creationMode);
  };

  return (
    <div className="app">
      <Button onClick={toggleCreationMode}>
        {creationMode ? "Switch to Display Mode" : "Switch to Creation Mode"}
      </Button>
      {creationMode ? (
        <TabInput onAddTabGroup={handleAddTabGroup} />
      ) : (
        tabGroups.map((group, index) => (
          <TabDisplay
            key={index}
            groupName={group.groupName}
            color={group.color}
            urls={group.urls}
            onDelete={() => handleDelete(index)}
            onUpdate={(updatedGroupName, updatedUrls) => handleUpdate(index, updatedGroupName, updatedUrls)}
          />
        ))
      )}
    </div>
  );
}

export default App;
