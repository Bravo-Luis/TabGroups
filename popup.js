document.getElementById('addGroup').addEventListener('click', function() {
    var newGroup = document.createElement('div');
    newGroup.className = 'group';
    newGroup.innerHTML = `
        <input type="text" class="group-name" placeholder="Enter Group Name">
        <input type="color" class="group-color" value="#0000FF">
        <input type="text" class="url-input" placeholder="Enter URL">
        <button class="add-url">Add URL</button>
        <div class="urls"></div>
    `;
    document.getElementById('groups').appendChild(newGroup);
    setupUrlAddButtons();
    setupRemoveButtons();  // Add this line
});

function setupRemoveButtons() {
    var removeButtons = document.querySelectorAll('.remove-url');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var urlDiv = button.parentElement;
            if(urlDiv && urlDiv.parentElement) {  // Check if urlDiv and its parent exist
                urlDiv.parentElement.removeChild(urlDiv);
                saveGroups();
            }
        });
    });
}

function createTabGroup(tabIds, groupName, groupColor) {
    chrome.tabs.group({tabIds: tabIds}, function(groupId) {  // Group all tabs at once
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            chrome.tabGroups.update(groupId, {title: groupName, color: mapColor(groupColor)});
        }
    });
}


function setupUrlAddButtons() {
    var addUrlButtons = document.querySelectorAll('.add-url');
    addUrlButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var urlInput = button.previousElementSibling;
            var urlValue = urlInput.value.trim();  // Trim whitespace
            var urlsDiv = button.nextElementSibling;
            if (urlValue && (urlValue.startsWith('http://') || urlValue.startsWith('https://'))) {  // Validate URL
                var newUrl = document.createElement('div');
                newUrl.innerHTML = `
                    <span class="url-text">${urlValue}</span> <button class="remove-url">Remove</button>
                `;
                urlsDiv.appendChild(newUrl);
                urlInput.value = '';
                saveGroups();
                setupRemoveButtons();  // Ensure remove buttons are functional
            } else if (urlValue.startsWith('chrome://')) {
                alert('chrome:// URLs cannot be grouped.');
            } else {
                alert('Please enter a valid URL.');
            }
            setupRemoveButtons();  // Ensure remove buttons are functional
        });
    });
}

function colorDistance(color1, color2) {
    return Math.abs(color1.r - color2.r) + Math.abs(color1.g - color2.g) + Math.abs(color1.b - color2.b);
}

function mapColor(color) {
    const hexToRgb = (hex) => ({
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    });

    const colorList = {
        "blue": "#0000FF",
        "cyan": "#00FFFF",
        "green": "#008000",
        "grey": "#808080",
        "orange": "#FFA500",
        "pink": "#FFC0CB",
        "purple": "#800080",
        "red": "#FF0000",
        "yellow": "#FFFF00",
    };

    const inputColorRgb = hexToRgb(color);
    let closestColorName = "grey";
    let closestDistance = Infinity;

    for (const [colorName, colorHex] of Object.entries(colorList)) {
        const distance = colorDistance(inputColorRgb, hexToRgb(colorHex));
        if (distance < closestDistance) {
            closestDistance = distance;
            closestColorName = colorName;
        }
    }

    return closestColorName;
}



function setupRemoveButtons() {
    var removeButtons = document.querySelectorAll('.remove-url');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var urlDiv = button.parentElement;
            if(urlDiv && urlDiv.parentElement) {  // Check if urlDiv and its parent exist
                urlDiv.parentElement.removeChild(urlDiv);
                saveGroups();
            }
        });
    });
}

document.getElementById('groupTabs').addEventListener('click', function() {
    var groups = document.querySelectorAll('.group');
    var tabGroups = Array.from(groups).map(groupDiv => ({
        name: groupDiv.querySelector('.group-name').value,
        color: groupDiv.querySelector('.group-color').value,
        urls: Array.from(groupDiv.querySelector('.urls').children).map(urlDiv => {
            const urlTextElement = urlDiv.querySelector('.url-text');
            return urlTextElement ? urlTextElement.textContent : null;
        })
        
    }));
    processGroups(tabGroups);  // Call processGroups directly
});

function processGroups(tabGroups) {
    tabGroups.forEach(function(group, index) {
        if (group.urls.length === 0) return;
        // Create an array to hold the promises for tab creation
        var createTabPromises = group.urls.map(url => {
            return new Promise((resolve, reject) => {
                chrome.tabs.create({ url: url, active: false }, function(tab) {
                    resolve(tab.id);
                });
            });
        });

        // Wait for all tab creation promises to resolve
        Promise.all(createTabPromises).then(tabIds => {
            // Now create a tab group with the resolved tab IDs
            createTabGroup(tabIds, group.name, group.color);
        });
    });
}




function saveGroups() {
    var groups = document.querySelectorAll('.group');
    var tabGroups = Array.from(groups).map(groupDiv => {
        const urls = Array.from(groupDiv.querySelector('.urls').children).map(urlDiv => {
            const urlTextElement = urlDiv.querySelector('.url-text');
            return urlTextElement ? urlTextElement.textContent : null;
        });
        return {
            name: groupDiv.querySelector('.group-name').value,
            color: groupDiv.querySelector('.group-color').value,
            urls: urls.filter(url => url !== null)  // Ensure no null values are saved
        };
    });
    console.log('Saving groups:', tabGroups);
    chrome.storage.local.set({ tabGroups: tabGroups }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });
}


function loadGroups() {
    chrome.storage.local.get('tabGroups', function(data) {
        console.log('Loading groups:', data.tabGroups);
        var groupsDiv = document.getElementById('groups');
        groupsDiv.innerHTML = '';
        var tabGroups = data.tabGroups || [];
        tabGroups.forEach(function(group) {
            var newGroup = document.createElement('div');
            newGroup.className = 'group';
            newGroup.innerHTML = `
                <input type="text" class="group-name" placeholder="Enter Group Name" value="${group.name}">
                <input type="color" class="group-color" value="${group.color}">
                <input type="text" class="url-input" placeholder="Enter URL">
                <button class="add-url">Add URL</button>
                <div class="urls">${group.urls.map(url => `<div><span class="url-text">${url}</span> <button class="remove-url">Remove</button></div>`).join('')}</div>
            `;
            groupsDiv.appendChild(newGroup);
        });
        setupUrlAddButtons();
        setupRemoveButtons();
    });
}


loadGroups();
