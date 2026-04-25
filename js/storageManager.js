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

function getRandomActivity(activityArray) {
// Write an algorithm using Math.random() to select a single activity.

// Crucial Rule: The randomization must run against the currently filtered list 
// provided by the getActivities function, not the master Local Storage list.

// Include a safety check that prevents the function from running if the provided array length is 0.
}