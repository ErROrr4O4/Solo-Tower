let enemySpawnInterval; // Variable to store the enemy spawn interval

function createEnemy() {
    if (isPlayerDead) {
         return; // Do not spawn enemies if the player is dead 
         }
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


function startEnemySpawn() {
    if (!enemySpawnInterval) {
        enemySpawnInterval = setInterval(createEnemy, 2000); // Adjust spawn interval as needed
    }
}

function stopEnemySpawn() {
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = null; // Reset the interval variable
}

function stopEnemyMovement() {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.style.transform = 'none';
    });
}
