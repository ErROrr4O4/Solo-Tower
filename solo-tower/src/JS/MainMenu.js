document.getElementById('start-game').addEventListener('click', function() {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.classList.add('expand-animation');
    setTimeout(() => {
        mainMenu.innerHTML = ''; // Clear the entire interface after the animation
    }, 0); // Set the duration to 0
});