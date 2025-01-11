document.getElementById('start-game').addEventListener('click', function() {
    const mainMenu = document.getElementById('main-menu');
    const welcomeModal = document.getElementById('welcome-modal');
    mainMenu.classList.add('expand-animation');
    setTimeout(() => {
        mainMenu.innerHTML = ''; // Clear the entire interface after the animation
        welcomeModal.style.display = 'block'; // Show the welcome modal
    }, 1000); // Adjusted delay to match animation duration
});

document.getElementById('ok-button').addEventListener('click', function() {
    const welcomeModal = document.getElementById('welcome-modal');
    const hud = document.getElementById('hud'); // Reference the HUD element
    const notifications = document.getElementById('notifications');
    const buffsDebuffsBox = document.getElementById('buffs-debuffs-box'); // Reference the buffs/debuffs box element
    const centralizedControl = document.getElementById('centralized-control'); // Reference the centralized control element
    const locationBox = document.getElementById('location-box'); // Reference the location box element
    const goldBox = document.getElementById('gold-box'); // Reference the gold box element
    const gameContainer = document.getElementById('game-container'); // Reference the game container element
    const upgradeTree = document.getElementById('upgrade-tree'); // Reference the upgrade tree element
    const playerNameInput = document.getElementById('player-name-input').value.trim();

    if (playerNameInput === "") {
        alert("Please enter your name!");
        return;
    }

    document.getElementById('player-name').textContent = playerNameInput;
    document.getElementById('player-level').textContent = "1"; // Set initial player level
    document.getElementById('health-counter').textContent = "100/100"; // Set initial health counter
    document.getElementById('mana-counter').textContent = "100/100"; // Set initial mana counter
    document.getElementById('exp-counter').textContent = "0/100"; // Set initial exp counter

    welcomeModal.style.display = 'none'; // Hide the welcome modal
    hud.style.display = 'block'; // Display the HUD with player name, level, health, mana, and exp bars
    notifications.style.display = 'block'; // Display the notifications box
    buffsDebuffsBox.style.display = 'block'; // Show the box
    centralizedControl.style.display = 'flex'; // Show the centralized controls
    goldBox.style.display = 'block'; // Show the gold box
    locationBox.style.display = 'block'; // Display the location box
    gameContainer.style.display = 'block'; // Show the game container
    upgradeTree.style.display = 'block'; // Show the upgrade tree
    showNotification(`Welcome to the tower, ${playerNameInput}!`);
    showNotification(`Do you wish to start the tutorial? <button class="yes-button">YES</button>`);
});


document.getElementById('expand-notifications').addEventListener('click', function() {
    const notificationsContent = document.getElementById('notifications-content');
    const expandButton = document.getElementById('expand-notifications');
    const notificationCounter = document.getElementById('notification-counter');
    if (notificationsContent.style.maxHeight === '150px' || notificationsContent.style.maxHeight === '') {
        notificationsContent.style.maxHeight = '300px';
        expandButton.textContent = '▼'; // Change to downwards arrow
        // Show all stacked notifications
        const stackedNotifications = document.querySelectorAll('.notification.stacked');
        stackedNotifications.forEach(notification => {
            notification.style.display = 'block';
        });
        // Reset the notification counter to 0
        notificationCounter.textContent = '0';
    } else {
        notificationsContent.style.maxHeight = '150px';
        expandButton.textContent = '▲'; // Change to upwards arrow
        // Hide all stacked notifications
        const stackedNotifications = document.querySelectorAll('.notification.stacked');
        stackedNotifications.forEach(notification => {
            notification.style.display = 'none';
        });
    }
});

function showNotification(message) {
    const notificationsContent = document.getElementById('notifications-content');
    const notificationCounter = document.getElementById('notification-counter');
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Conditionally include the "YES" button for the tutorial notification
    if (message.includes('Do you wish to start the tutorial?')) {
        notification.innerHTML = `${message}<button class="close-notification">✖</button>`;
        notification.querySelector('.yes-button').addEventListener('click', function() {
            showNotification('Tutorial started!');
            notification.remove(); // Remove the message when "YES" is clicked
            spawnEnemies(); // Start spawning enemies when "YES" is clicked
        });
    } else {
        notification.innerHTML = `${message} <button class="close-notification">✖</button>`;
    }

    notificationsContent.appendChild(notification);

    // Update the notification counter
    const currentCount = parseInt(notificationCounter.textContent, 10);
    notificationCounter.textContent = currentCount + 1;

    // Add event listener to the close button without modifying the counter
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.remove();
        // Do not update the notification counter here
    });

    setTimeout(() => {
        notification.style.display = 'none'; // Hide the notification after 5 seconds
        notification.classList.add('stacked'); // Mark it as stacked
    }, 5000);
}



// Function to show buffs/debuffs
function showBuffsDebuffs(buffs, debuffs) {
    const buffsDebuffsBox = document.getElementById('buffs-debuffs-box');
    const buffsList = document.getElementById('buffs-list');
    const debuffsList = document.getElementById('debuffs-list');
    
    // Clear current buffs and debuffs
    buffsList.innerHTML = '';
    debuffsList.innerHTML = '';

    // Add new buffs
    buffs.forEach(buff => {
        const buffElement = document.createElement('div');
        buffElement.className = 'buff';
        buffElement.textContent = buff;
        buffsList.appendChild(buffElement);
    });

    // Add new debuffs
    debuffs.forEach(debuff => {
        const debuffElement = document.createElement('div');
        debuffElement.className = 'debuff';
        debuffElement.textContent = debuff;
        debuffsList.appendChild(debuffElement);
    });

}
// Call this function whenever the player gets a buff or debuff
// updateBuffsDebuffs(); // Uncomment this line to test the function

function createEnemy() {
    const gameContainer = document.querySelector('.game-container');
    const enemy = document.createElement('div');
    enemy.className = 'enemy';

    const randomEdge = Math.floor(Math.random() * 4);
    switch(randomEdge) {
        case 0: // Top edge
            enemy.style.top = '0';
            enemy.style.left = `${Math.random() * 100}%`;
            break;
        case 1: // Right edge
            enemy.style.top = `${Math.random() * 100}%`;
            enemy.style.left = '100%';
            break;
        case 2: // Bottom edge
            enemy.style.top = '100%';
            enemy.style.left = `${Math.random() * 100}%`;
            break;
        case 3: // Left edge
            enemy.style.top = `${Math.random() * 100}%`;
            enemy.style.left = '0';
            break;
    }

    gameContainer.appendChild(enemy);

    // Move the enemy toward the player
    moveEnemy(enemy);
}

function createChunks(enemy) {
    const chunks = [];
    const gameContainer = document.querySelector('.game-container');
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = document.querySelector('.player').getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    for (let i = 0; i < 10; i++) { // Create 10 chunks
        const chunk = document.createElement('div');
        chunk.className = 'chunk';
        // Random direction and distance for each chunk
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50;
        chunk.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        chunk.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        // Position chunks at enemy's location
        chunk.style.left = `${enemyRect.left - containerRect.left + enemyRect.width / 2}px`;
        chunk.style.top = `${enemyRect.top - containerRect.top + enemyRect.height / 2}px`;
        chunks.push(chunk);
        gameContainer.appendChild(chunk);

    }
    return chunks;
}

function applyDamage(damage) {
    // Update player's health
    const healthCounter = document.getElementById('health-counter');
    const healthBar = document.getElementById('health-bar'); // Assuming there is a health bar element
    let [currentHealth, maxHealth] = healthCounter.textContent.split('/').map(Number);
    currentHealth = Math.max(0, currentHealth - damage); // Ensure health doesn't go below 0
    healthCounter.textContent = `${currentHealth}/${maxHealth}`;
    
    // Update health bar width
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;
    
    // Flash effect
    const playerElement = document.querySelector('.player');
    playerElement.classList.add('flash');
    setTimeout(() => {
        playerElement.classList.remove('flash');
    }, 500); // Duration of the flash effect

}



function earnResources() {
    gold += 10; // Amount of gold earned per enemy
    experience += 5; // Amount of experience earned per enemy
    updateResources();
    updateExpBar(); // Update EXP bar after earning resources
}

function updateResources() {
    document.getElementById('gold-counter').textContent = `Gold: ${gold}`;
    // Ensure that EXP counter text is correctly initialized if it doesn't exist
    if (!document.getElementById('exp-counter').textContent.includes('/')) {
        document.getElementById('exp-counter').textContent = '0/100';
    }
    updateExpBar();
}

function updateExpBar() {
    const expCounter = document.getElementById('exp-counter');
    let [currentExp, maxExp] = expCounter.textContent.split('/').map(Number);
    currentExp += 5; // Add the earned experience points
    // If currentExp exceeds maxExp, handle level-up logic here (optional)
    if (currentExp >= maxExp) {
        currentExp = currentExp % maxExp; // Reset currentExp if it exceeds maxExp
    }
    expCounter.textContent = `${currentExp}/${maxExp}`;
    
    // Update exp bar width
    const expPercentage = (currentExp / maxExp) * 100;
    const expBar = document.getElementById('exp-bar');
    expBar.style.width = `${expPercentage}%`;
}

// Initial resource setup
let gold = 0;
let experience = 0;

// Call updateResources initially to set the counters
updateResources();


// Debugging: Log resource updates
function debugEarnResources() {
    console.log('Earned resources:', { gold, experience });
}

// Update the moveEnemy function to debug earnResources
function moveEnemy(enemy) {
    const player = document.querySelector('.player');
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const deltaX = playerRect.left - enemyRect.left;
    const deltaY = playerRect.top - enemyRect.top;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const duration = 2000; // Duration for the enemy to reach the player

    enemy.style.transition = `transform ${duration}ms linear`;
    enemy.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Apply damage and create explosion effect when enemy reaches the player
    setTimeout(() => {
        const chunks = createChunks(enemy); // Create chunks for explosion
        enemy.remove(); // Remove the enemy
        setTimeout(() => {
            chunks.forEach(chunk => chunk.remove()); // Remove chunks after explosion
        }, 1000); // Duration of the explosion and fade-out effect
        applyDamage(10); // Apply damage to the player
        earnResources(); // Earn resources when enemy is removed
        debugEarnResources(); // Log resource updates
    }, duration);
}


function spawnEnemies() {
    setInterval(createEnemy, 1000); // Spawn a new enemy every second
}

// Function to unlock upgrades based on player level or points
function checkForUpgrades() {
    const playerLevel = parseInt(document.getElementById('player-level').textContent, 10);

    if (playerLevel >= 2) {
        unlockUpgrade('upgrade-1');
    }
    if (playerLevel >= 3) {
        unlockUpgrade('upgrade-2');
    }
    if (playerLevel >= 4) {
        unlockUpgrade('upgrade-3');
    }
    // Add more conditions for additional upgrades
}

function unlockUpgrade(upgradeId) {
    const upgrade = document.getElementById(upgradeId);
    upgrade.classList.remove('locked');
    upgrade.classList.add('unlocked');
}

// Call checkForUpgrades whenever the player levels up or earns points
// Example: checkForUpgrades(); // Call this function at appropriate times
