// Define the key used for Local Storage
const storageKey = 'healing_activities';

// 1. Initialization Function
function initializeStorage() {
    if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify([]));
    }
}

function saveActivity(activityData) {
// Write logic to assign a unique ID using Date.now() upon object creation.

// Implement an error-handling block that rejects the save if the "Title" field is empty.

// Enforce a strict 50-character limit on the title string.

// Reject the entry if the cost is a negative number.

// Stringify and push the object into the Local Storage array.
}

function getActivities(filterCriteria) {
// Write a function to fetch and parse the data from Local Storage.

// Include a fallback to return an empty array [] if Local Storage is currently empty.
}

function updateActivity(id, updatedData) {
// Create a function that finds an object by its unique ID.

// Overwrite the existing properties with the newly submitted edits and 
// save the updated array back to Local Storage.
}

function deleteActivity(id) {
// Write a function that filters out a specific object by its ID and saves the modified array.
}


// Run initialization immediately when the file loads
initializeStorage();