let playerLevel = 1;
let currentExp = 0;
let requiredExp = 10; // Initial required experience for level 1

// Define global variables for other scripts
let hitsReceived = 0;

// Initial resource setup
let gold = 0;
let experience = 0;

let playerStats = {
    vit: 1,
    int: 1,
    str: 1,
    agi: 1,
    luck: 1,
    maxHealth: 10, // Starting max health
    maxMana: 10, // Starting max mana
    damageReduction: 0,
    dodgeChance: 0,
    resourceGain: 0,
    availableStatPoints: 0 // Initialize available stat points
};

document.getElementById('start-game').addEventListener('click', function() {
    const mainMenu = document.getElementById('main-menu');
    const welcomeModal = document.getElementById('welcome-modal');
    mainMenu.classList.add('expand-animation');
    setTimeout(() => {
        mainMenu.innerHTML = ''; // Clear the entire interface after the animation
        welcomeModal.style.display = 'block'; // Show the welcome modal
    }, 1000); // Adjusted delay to match animation duration
});

document.getElementById('player-yes').addEventListener('click', function() {
    const nameInputContainer = document.getElementById('name-input-container');
    const danger = document.getElementById('danger');
    nameInputContainer.style.display = 'block'; // Show the name input and OK button
    danger.style.display = 'block'; // Show the danger warning
});

document.getElementById('player-no').addEventListener('click', function() {
    alert('Alright! Feel free to explore the tower as a visitor.');
    // Optionally, hide the welcome modal or add other logic here
});

document.getElementById('ok-button').addEventListener('click', function() {
    const welcomeModal = document.getElementById('welcome-modal');
    const hud = document.getElementById('hud'); // Reference the HUD element
    const notifications = document.getElementById('notifications');
    const playerStats = document.getElementById('stats-box');
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
    document.getElementById('health-counter').textContent = "10/10"; // Set initial health counter
    document.getElementById('mana-counter').textContent = "10/10"; // Set initial mana counter
    document.getElementById('exp-counter').textContent = "0/10"; // Set initial exp counter

    welcomeModal.style.display = 'none'; // Hide the welcome modal
    hud.style.display = 'block'; // Display the HUD with player name, level, health, mana, and exp bars
    notifications.style.display = 'block'; // Display the notifications box
    playerStats.style.display = 'block'; // Display the notifications box
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
        expandButton.textContent = '▼ Inbox'; // Change to downwards arrow
        // Show all stacked notifications
        const stackedNotifications = document.querySelectorAll('.notification.stacked');
        stackedNotifications.forEach(notification => {
            notification.style.display = 'block';
        });
        // Reset the notification counter to 0
        notificationCounter.textContent = '0';
    } else {
        notificationsContent.style.maxHeight = '150px';
        expandButton.textContent = '▲ Inbox'; // Change to upwards arrow
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
        notification.innerHTML = `${message}  <button class="close-notification">✖</button>`;
        notification.querySelector('.yes-button').addEventListener('click', function() {
            showNotification('Tutorial started!');
            notification.remove(); // Remove the message when "YES" is clicked
            startEnemySpawn(); // Start enemy spawn after tutorial
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

    return notification; // Return the notification element
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
    let [currentHealth, maxHealth] = healthCounter.textContent.split('/').map(Number);
    currentHealth = Math.max(0, currentHealth - damage); // Ensure health doesn't go below 0
    healthCounter.textContent = `${currentHealth}/${maxHealth}`;
    
    // Update health bar width
    const healthBar = document.getElementById('health-bar');
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;
    
    // Flash effect
    const playerElement = document.querySelector('.player');
    playerElement.classList.add('flash');
    setTimeout(() => {
        playerElement.classList.remove('flash');
    }, 500); // Duration of the flash effect

    // Check for player death
    if (currentHealth === 0) {
        handlePlayerDeath();
    }
}



let isPlayerDead = false; // Flag to track player's death status
let retryNotificationShown = false; // Flag to track if retry notification has been shown

function handlePlayerDeath() {
    if (retryNotificationShown) {
        return; // Do nothing if the retry notification has already been shown
    }

    isPlayerDead = true; // Set the player death flag
    retryNotificationShown = true; // Set the retry notification flag
    stopEnemySpawn(); // Stop enemy spawn
    stopEnemyMovement(); // Stop enemies from moving
    showNotification(`You died! Do you want to retry? <button class="retry-button">YES</button>`);
    
    // Event listener for retry button
    document.querySelector('.retry-button').addEventListener('click', function() {
        respawnPlayer();
    });
}

function respawnPlayer() {
    isPlayerDead = false; // Reset the player death flag
    retryNotificationShown = false; // Reset the retry notification flag

    // Remove the retry notification
    const retryNotification = document.querySelector('.retry-button').parentElement;
    retryNotification.remove();

    updateHealthBar(true); // Restore health to max
    updateManaBar(true); // Restore mana to max
    
    // Remove existing enemies
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => enemy.remove());
    
    showNotification(`Player respawned successfully!`);
    startEnemySpawn(); // Restart enemy spawn
}




function earnResources() {
    if (isPlayerDead) {
        return; // Do not earn resources if the player is dead
    }

    gold += 10; // Amount of gold earned per enemy
    currentExp += 5; // Amount of experience earned per enemy
    updateResources();
    updateExpBar(); // Update EXP bar after earning resources
}

function updateResources() {
    document.getElementById('gold-counter').textContent = `Gold: ${gold}`;
    if (!document.getElementById('exp-counter').textContent.includes('/')) {
        document.getElementById('exp-counter').textContent = `${currentExp}/${requiredExp}`;
    }
    updateExpBar();
}

function updateExpBar() {
    const expCounter = document.getElementById('exp-counter');
    const expBar = document.getElementById('exp-bar');
    
    // Level up logic
    while (currentExp >= requiredExp) {
        currentExp -= requiredExp;
        levelUp();
    }
    
    expCounter.textContent = `${currentExp}/${requiredExp}`;
    
    // Update exp bar width
    const expPercentage = (currentExp / requiredExp) * 100;
    expBar.style.width = `${expPercentage}%`;
}

function levelUp() {
    playerLevel++;
    document.getElementById('player-level').textContent = playerLevel; // Update player level display
    playerStats.availableStatPoints++; // Grant 1 stat point per level up
    requiredExp *= 2; // Double the required experience for next level
    
    // Increase max health and mana by 10
    playerStats.maxHealth += 10;
    playerStats.maxMana += 10;
    
    updateHealthBar(true); // Update the health bar to reflect new max health and restore health
    updateManaBar(true); // Update the mana bar to reflect new max mana and restore mana

    showNotification(`Congratulations! You've reached level ${playerLevel}.`);
    showNotification(`You've gained 1 stat point.`);
    updateStats(); // Update stats display to reflect available stat points
}


// Call updateResources initially to set the counters
updateResources();


// Debugging: Log resource updates
function debugEarnResources() {
    console.log('Earned resources:', { gold, currentExp });
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


let enemySpawnInterval; // Variable to store the enemy spawn interval

function startEnemySpawn() {
    enemySpawnInterval = setInterval(createEnemy, 2000); // Adjust spawn interval as needed
}

function stopEnemySpawn() {
    clearInterval(enemySpawnInterval);
}

function stopEnemyMovement() {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.style.transform = 'none';
    });
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

// Update stats display
function updateStats() {
    document.getElementById('vit-value').textContent = playerStats.vit;
    document.getElementById('int-value').textContent = playerStats.int;
    document.getElementById('str-value').textContent = playerStats.str;
    document.getElementById('agi-value').textContent = playerStats.agi;
    document.getElementById('luck-value').textContent = playerStats.luck;
    document.getElementById('available-stat-points').textContent = `(${playerStats.availableStatPoints})`; // Update available stat points display
}


document.getElementById('vit-plus').addEventListener('click', function() {
    if (playerStats.availableStatPoints > 0) {
        playerStats.vit++;
        playerStats.maxHealth += 10;
        playerStats.availableStatPoints--;
        updateStats();
        updateHealthBar(true); // Update the health bar
    } else {
        showNotification(`No stat points available to increase Vit.`);
    }
});

document.getElementById('int-plus').addEventListener('click', function() {
    if (playerStats.availableStatPoints > 0) {
        playerStats.int++;
        playerStats.maxMana += 10;
        playerStats.availableStatPoints--;
        updateStats();
        updateManaBar(true); // Update the mana bar
    } else {
        showNotification(`No stat points available to increase Int.`);
    }
});

document.getElementById('str-plus').addEventListener('click', function() {
    if (playerStats.availableStatPoints > 0) {
        playerStats.str++;
        playerStats.damageReduction = playerStats.str; // 1% damage reduction per STR
        playerStats.availableStatPoints--;
        updateStats();
    } else {
        showNotification(`No stat points available to increase Str.`);
    }
});

document.getElementById('agi-plus').addEventListener('click', function() {
    if (playerStats.availableStatPoints > 0) {
        playerStats.agi++;
        playerStats.dodgeChance = playerStats.agi; // 1% dodge chance per AGI
        playerStats.availableStatPoints--;
        updateStats();
    } else {
        showNotification(`No stat points available to increase Agi.`);
    }
});

document.getElementById('luck-plus').addEventListener('click', function() {
    if (playerStats.availableStatPoints > 0) {
        playerStats.luck++;
        playerStats.resourceGain = playerStats.luck; // 1% resource gain per LUCK
        playerStats.availableStatPoints--;
        updateStats();
    } else {
        showNotification(`No stat points available to increase Luck.`);
    }
});


// Update health bar when max health changes
function updateHealthBar(restore = false) {
    const healthCounter = document.getElementById('health-counter');
    let [currentHealth, ] = healthCounter.textContent.split('/').map(Number);
    
    // If restore is true, set current health to max health
    if (restore) {
        currentHealth = playerStats.maxHealth;
    }
    

    healthCounter.textContent = `${currentHealth}/${playerStats.maxHealth}`;

    const healthBar = document.getElementById('health-bar');
    const healthPercentage = (currentHealth / playerStats.maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;
}

function updateManaBar(restore = false) {
    const manaCounter = document.getElementById('mana-counter');
    let [currentMana, ] = manaCounter.textContent.split('/').map(Number);
    
    // If restore is true, set current mana to max mana
    if (restore) {
        currentMana = playerStats.maxMana;
    }
   
    manaCounter.textContent = `${currentMana}/${playerStats.maxMana}`;

    const manaBar = document.getElementById('mana-bar');
    const manaPercentage = (currentMana / playerStats.maxMana) * 100;
    manaBar.style.width = `${manaPercentage}%`;
}


// Initial update of stats display
updateStats();
