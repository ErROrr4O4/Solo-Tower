document.getElementById('start-game').addEventListener('click', function() {
    const mainMenu = document.getElementById('main-menu');
    const welcomeModal = document.getElementById('welcome-modal');
    mainMenu.classList.add('expand-animation');
    setTimeout(() => {
        mainMenu.innerHTML = ''; // Clear the entire interface after the animation
        welcomeModal.style.display = 'block'; // Show the welcome modal
    }, 0); // Set the duration to 0
});

document.getElementById('ok-button').addEventListener('click', function() {
    const welcomeModal = document.getElementById('welcome-modal');
    const playerInfo = document.getElementById('player-info');
    const notifications = document.getElementById('notifications');
    welcomeModal.style.display = 'none'; // Hide the welcome modal
    playerInfo.style.display = 'block'; // Display the player's name, class, and stats
    notifications.style.display = 'block'; // Display the notifications box
    showNotification('Welcome to the game, Player!');
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
