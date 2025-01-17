let boss; // To store the current boss element
let isBossAlive = false; // To track if the boss is alive

// Function to create the boss at a random edge
function createBoss() {
    if (isPlayerDead) {
        return; // Do not spawn the boss if the player is dead
    }

    const gameContainer = document.querySelector('.game-container');
    boss = document.createElement('div');
    boss.className = 'boss';

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

            // Apply damage to the player when touched by the boss
            applyDamage(10);

            // Mark the boss as not alive
            isBossAlive = false;

            // Respawn the boss near the player
            respawnBossNearPlayer();
        
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

// Function to respawn the boss near the player after it is destroyed
function respawnBossNearPlayer() {
    if (isBossAlive) return; // Prevent respawning if boss is still alive

    // Call the original createBoss function to respawn the boss
    createBoss();
}
