import React, { useState } from 'react';
import { Select, MenuItem, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import './ColorPicker.css';

function ColorPicker({ onColorChange }) {
    const colorNames = ["grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"];
    const [selectedColor, setSelectedColor] = useState('');

    const handleChange = (event) => {
        const newColor = event.target.value;
        setSelectedColor(newColor);

        // Call the onColorChange prop with the new color
        if (onColorChange) {
            onColorChange(newColor);
        }
    };

    return (
        <Select
            value={selectedColor}
            onChange={handleChange}
            renderValue={(value) => <div style={{ backgroundColor: value, width: '24px', height: '24px', borderRadius: '50%'}}></div>}
        >
            {colorNames.map((colorName) => (
                <MenuItem key={colorName} value={colorName}>
                    <ListItemIcon>
                        <div style={{ backgroundColor: colorName, width: '24px', height: '24px', borderRadius: '50%'}}>
                            {colorName === selectedColor && <CheckIcon style={{ color: 'white' }} />}
                        </div>
                    </ListItemIcon>
                </MenuItem>
            ))}
        </Select>
    );
}

export default ColorPicker;
