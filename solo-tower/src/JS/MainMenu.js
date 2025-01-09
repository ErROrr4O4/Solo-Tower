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
    const centralizedControl = document.getElementById('centralized-control'); // Reference the centralized control element
    const locationBox = document.getElementById('location-box'); // Reference the location box element
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
    centralizedControl.style.display = 'flex'; // Show the centralized controls
    locationBox.style.display = 'block'; // Display the location box
    showNotification(`Welcome to the tower, ${playerNameInput}!`);
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
    notification.innerHTML = `${message} <button class="close-notification">✖</button>`;
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

    buffsDebuffsBox.style.display = 'block'; // Show the box
}
// Call this function whenever the player gets a buff or debuff
// updateBuffsDebuffs(); // Uncomment this line to test the function

