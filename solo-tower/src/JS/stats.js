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

function earnResources() {
    const locationNameElement = document.getElementById('location-name');
    const currentLocation = locationNameElement.textContent;

    if (isPlayerDead) {
        return; // Do not earn resources if the player is dead
    }

    if (currentLocation === 'Tutorial') {
        // Only earn experience in the tutorial location
        currentExp += 5; // Amount of experience earned per enemy
    } else {
        // Earn both gold and experience in other locations
        gold += 10; // Amount of gold earned per enemy
        currentExp += 5; // Amount of experience earned per enemy
    }

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

updateResources();

function debugEarnResources() {
    console.log('Earned resources:', { gold, currentExp });
}

// Initial update of stats display
updateStats();
