let boss; // To store the current boss element
let isBossAlive = false; // To track if the boss is alive
let bossMonster; // To store the current boss stats
let bossSpawnedLocations = {}; // To track whether the boss has spawned in specific locations

// Function to create the boss based on location
function createBoss(location) {
    if (isPlayerDead) {
        return; // Do not spawn the boss if the player is dead
    }

    const gameContainer = document.querySelector('.game-container');
    boss = document.createElement('div');
    boss.className = 'boss';

    // Determine the boss based on the location
    if (bossSpawnedLocations[location]) {
        console.log(`Boss already spawned in ${location}`);
    }
    else if (location === 'Tutorial') {
        boss.classList.add('tutorial-titan'); // Add a specific class for the tutorial boss
        bossMonster = {
            name: 'Tutorial Titan',
            health: 300,
            maxHealth: 300,
            attack: 10
        };
    } else {
        console.error('Unknown location');
        return;
    }

    const randomEdge = Math.floor(Math.random() * 4);
    switch (randomEdge) {
        case 0: // Top edge
            boss.style.top = '0';
            boss.style.left = `${Math.random() * 100}%`;
            break;
        case 1: // Right edge
            boss.style.top = `${Math.random() * 100}%`;
            boss.style.left = '100%';
            break;
        case 2: // Bottom edge
            boss.style.top = '100%';
            boss.style.left = `${Math.random() * 100}%`;
            break;
        case 3: // Left edge
            boss.style.top = `${Math.random() * 100}%`;
            boss.style.left = '0';
            break;
    }

    gameContainer.appendChild(boss);

    // Mark the boss as spawned in the location
    bossSpawnedLocations[location] = true;
    isBossAlive = true;

    // Show the health bar when the boss spawns 
    const healthBar = document.querySelector('.boss-health-bar'); 
    if (healthBar) {
         healthBar.style.display = 'block'; 
    }

    // Start moving the boss towards the player
    moveBoss();
}

// Function to move the boss toward the player
function moveBoss() {
    if (!boss || isPlayerDead) return; // Prevent movement if no boss or player is dead

    const player = document.querySelector('.player');
    const playerRect = player.getBoundingClientRect();
    const bossRect = boss.getBoundingClientRect();

    const deltaX = playerRect.left - bossRect.left;
    const deltaY = playerRect.top - bossRect.top;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const duration = 3000; // Duration for the boss to reach the player

    // Move the boss smoothly towards the player using CSS transitions
    boss.style.transition = `transform ${duration}ms linear`;
    boss.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // After the boss reaches the player, trigger explosion and respawn
    setTimeout(() => {
        // Create chunks for explosion effect
        const chunks = createChunks(boss);

        // Remove the boss after it reaches the player
        boss.remove();

        // Remove chunks after explosion
        setTimeout(() => {
            chunks.forEach(chunk => chunk.remove()); // Remove chunks after explosion
        }, 1000); // Duration of explosion and fade-out effect

        // Apply damage to the player based on boss's attack stat
        applyDamage(bossMonster.attack);
        dealDamageToBoss(bossMonster.attack); // Deal damage to the boss if it's alive

        // Mark the boss as not alive
        isBossAlive = false;

        // Respawn the boss near the player
        respawnBossNearPlayer(getCurrentPlayerLocation());

    }, duration);
}


// Function to create chunks when the boss is destroyed (explosion effect)
function createChunks(boss) {
    const chunks = [];
    const gameContainer = document.querySelector('.game-container');
    const bossRect = boss.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    for (let i = 0; i < 10; i++) { // Create 10 chunks
        const chunk = document.createElement('div');
        chunk.className = 'chunk';
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50;
        chunk.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        chunk.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        chunk.style.left = `${bossRect.left - containerRect.left + bossRect.width / 2}px`;
        chunk.style.top = `${bossRect.top - containerRect.top + bossRect.height / 2}px`;
        chunks.push(chunk);
        gameContainer.appendChild(chunk);
    }
    return chunks;
}

function updateBossHealthBar() {
    const healthBarInner = document.querySelector('.boss-health-bar-inner');
    const healthText = document.querySelector('.boss-health-text');

    if (healthBarInner && healthText) {
        const healthPercentage = (bossMonster.health / bossMonster.maxHealth) * 100;
        healthBarInner.style.width = `${healthPercentage}%`;
        healthText.textContent = `${bossMonster.health}/${bossMonster.maxHealth}`;
    } else {
        console.error('Health bar elements not found in the DOM.');
    }
    
}


// Function to respawn the boss near the player after it is destroyed
function respawnBossNearPlayer(location) {
    if (isBossAlive) return; // Prevent respawning if boss is still alive

    // Retain the boss's current health upon respawn
    const currentHealth = bossMonster.health;

    // Call the original createBoss function to respawn the boss with the specified location
    createBoss(location);

    // Restore the boss's current health
    bossMonster.health = currentHealth;
    updateBossHealthBar();
}

// Example function in another JS file
function dealDamageToBoss(damage) {
    if (!isBossAlive) return; // Do not deal damage if boss is not alive

    bossMonster.health -= damage; // Reduce boss health by the damage amount
    if (bossMonster.health <= 0) {
        bossMonster.health = 0;
        isBossAlive = false; // Handle boss death logic
    }

    updateBossHealthBar(); // Update boss health bar display
}



