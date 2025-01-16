let bossSpawned = false; // Variable to check if the boss is already spawned

let bossMonster = { 
    name: 'Regeneron',
    health: 500, 
    maxHealth: 500, 
    attack: 25, 
    regenRate: 10, // Health regen rate per second 
    speed: 2, // Boss movement speed 
    };

function createBoss() {
    if (!bossSpawned) {
        const gameContainer = document.querySelector('.game-container');
        const boss = document.createElement('div');
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

        // Move the boss toward the player
        moveBoss(boss);

        // Set bossSpawned to true
        bossSpawned = true;
    }
}

function createBossChunks(boss) {
    const chunks = [];
    const gameContainer = document.querySelector('.game-container');
    const bossRect = boss.getBoundingClientRect();
    const playerRect = document.querySelector('.player').getBoundingClientRect();
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

function moveBoss(boss) {
    const player = document.querySelector('.player');
    const playerRect = player.getBoundingClientRect();
    const bossRect = boss.getBoundingClientRect();

    const deltaX = playerRect.left - bossRect.left;
    const deltaY = playerRect.top - bossRect.top;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const duration = 2000; // Duration for the boss to reach the player

    boss.style.transition = `transform ${duration}ms linear`;
    boss.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Apply damage and create explosion effect when boss reaches the player
    setTimeout(() => {
        const chunks = createBossChunks(boss); // Create chunks for explosion
        setTimeout(() => {
            chunks.forEach(chunk => chunk.remove()); // Remove chunks after explosion
        }, 1000); // Duration of the explosion and fade-out effect
        applyDamage(10); // Apply damage to the player

        if (bossMonster.health <= 0) {
            console.log(`${bossMonster.name} has been defeated.`);
            bossSpawned = false;
        } else {
            respawnBossNearPlayer(); // Respawn boss near the player
        }
    }, duration);
}


function respawnBossNearPlayer() {
    const bossElement = document.querySelector('.boss');

    if (bossElement) {
        const playerElement = document.querySelector('.player');
        const gameContainer = document.querySelector('.game-container');
        const gameRect = gameContainer.getBoundingClientRect();
        const playerRect = playerElement.getBoundingClientRect();

        // Set the radius within which the boss should respawn
        const radius = 150;

        // Generate random angle and distance
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;

        // Calculate new position for the boss
        let spawnX = playerRect.left + distance * Math.cos(angle);
        let spawnY = playerRect.top + distance * Math.sin(angle);

        // Ensure the boss stays within the game container
        spawnX = Math.max(gameRect.left, Math.min(spawnX, gameRect.right - bossElement.clientWidth));
        spawnY = Math.max(gameRect.top, Math.min(spawnY, gameRect.bottom - bossElement.clientHeight));

        // Apply transition
        bossElement.style.transition = 'left 1s ease, top 1s ease';

        // Position the boss at the calculated coordinates
        bossElement.style.left = `${spawnX}px`;
        bossElement.style.top = `${spawnY}px`;

        console.log(`${bossMonster.name} respawned near the player with ${bossMonster.health} health.`);
    } else {
        console.error("Boss element not found in the DOM.");
    }
}


function startBossSpawn() {
    if (!bossSpawned) {
        createBoss(); // Create and spawn the boss
    }
}

function stopBossSpawn() {
    bossSpawned = false;
}

function stopBossMovement() {
    const boss = document.querySelector('.boss');
    boss.style.transition = 'none';
}
