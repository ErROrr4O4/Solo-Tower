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
            showNotification('tutorial started! in the tutorial you get attacked by waves of monsters and you can die as many times as you need, Note: you only gain experience here.');
            notification.remove(); // Remove the message when "YES" is clicked
            updateLocationName('Tutorial'); // Update location name
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