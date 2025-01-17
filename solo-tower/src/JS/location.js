function updateLocationName(newLocation) {
    const locationNameElement = document.getElementById('location-name');
    locationNameElement.textContent = newLocation;
}

// Example function to change player's location
function changePlayerLocation(newLocation) {
    // Update the location name display
    updateLocationName(newLocation);

    // Additional logic for changing location, if any
    console.log(`Player has moved to ${newLocation}`);
}

function getCurrentPlayerLocation() {
    const locationNameElement = document.getElementById('location-name');
    return locationNameElement.textContent;
}