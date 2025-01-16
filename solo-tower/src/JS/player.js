let playerLevel = 1;
let isPlayerDead = false; // Flag to track player's death status
let retryNotificationShown = false; // Flag to track if retry notification has been shown
let currentExp = 0;
let requiredExp = 10; // Initial required experience for level 1

// Define global variables for other scripts
let hitsReceived = 0;
let firstDeathMessageShown = false; // Flag to track if the first death message has been shown


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
    availableStatPoints: 1 // Initialize available stat points
};


function applyDamage(damage) {
    if (isPlayerDead) {
        return; // Do not apply damage if the player is dead
    }

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

function handlePlayerDeath() {
    if (retryNotificationShown) {
        return; // Do nothing if the retry notification has already been shown
    }

    isPlayerDead = true; // Set the player death flag
    retryNotificationShown = true; // Set the retry notification flag
    stopEnemySpawn(); // Stop enemy spawn
    stopBossSpawn(); // Stop boss spawn
    stopEnemyMovement(); // Stop enemies from moving

    // Show the respawn button
    const respawnButton = document.getElementById('respawn-button');
    respawnButton.style.display = 'block';

    // Show the "DEAD" text
    const deadText = document.getElementById('dead-text');
    deadText.style.display = 'block';

    // Change player color to grey
    const playerElement = document.querySelector('.player');
    playerElement.classList.add('dead');

    // Show first death message if it hasn't been shown yet
    if (!firstDeathMessageShown) {
        showNotification(`You died, it looks like you can't even take a single hit from a single monster. Now that I take a look at your stats, you are the weakest player I've ever seen so far...you have 1 stat available. How about investing it into vitality?`);
        firstDeathMessageShown = true; // Set the flag to true
    }

    // Only add event listener once
    respawnButton.removeEventListener('click', respawnPlayer);
    respawnButton.addEventListener('click', respawnPlayer);
}





function respawnPlayer() {
    isPlayerDead = false; // Reset the player death flag
    retryNotificationShown = false; // Reset the retry notification flag

    // Hide the respawn button
    const respawnButton = document.getElementById('respawn-button');
    respawnButton.style.display = 'none';

    // Hide the "DEAD" text
    const deadText = document.getElementById('dead-text');
    deadText.style.display = 'none';

    // Revert player color
    const playerElement = document.querySelector('.player');
    playerElement.classList.remove('dead');

    // Reset player's health and mana to max values
    updateHealthBar(true); // Restore health to max
    updateManaBar(true); // Restore mana to max
    
    // Remove existing enemies
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => enemy.remove());
    
    showNotification(`Player respawned successfully!`);
    startEnemySpawn(); // Restart enemy spawn
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
