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

try {
    // Implement an error-handling block that rejects the save if the "Title" field is empty.
    if (!activityData.title) {
        throw new Error("Title tidak boleh kosong!"); 
    }

    // Enforce a strict 50-character limit on the title string.
    if (activityData.title.length > 50) {
        throw new Error("Title maksimal 50 karakter");
    }

    // Enforce a strict 50-character limit on the location string.
    if (activityData.location.length > 50 ) {
        throw new Error("Location maksimal 50 karakter");
    }

    // Reject the entry if the cost is a negative number.
    if (activityData.budget < 0) {
        throw new Error("Budget tidak boleh negatif");
    }

    // Enforce a strict 500-character limit on the description string.
    if (activityData.description.length > 500) {
        throw new Error("Description maksimal 500 karakter");
    }

    var newActivity = {
        id: String(Date.now()),
        title: activityData.title,
        image: activityData.image,
        location: activityData.location,
        budget: activityData.budget,
        description: activityData.description,
        tags: JSON.stringify(activityData.tags)
    };

    // Stringify and push the object into the Local Storage array.
    var activities = getActivities();
    activities.push(newActivity);
    localStorage.setItem(storageKey, JSON.stringify(activities));

    console.log('Activity berhasil disimpan:', newActivity);
    
    } catch (error) {
        console.log('Gagal menyimpan activity:', error.message);   
    }
}



function getActivities(filterCriteria) {
// Write a function to fetch and parse the data from Local Storage.
try {
    var data = localStorage.getItem(storageKey)
    
    // Include a fallback to return an empty array [] if Local Storage is currently empty.
    if (!data) {
        return [];
    }

    var activities = JSON.parse(data);

    // parse tags dari string diubah kembali jadi array
    for (let i = 0; i < activities.length; i++) {
        activities[i].tags = JSON.parse(activities[i].tags);
    }

    // Jika filtercreteria tidak ada, return semua data
    if (!filterCriteria) {
        return activities;
    }
    
    // Jika filtercriteria ada ambil datanya
    var filtered = [];

    for (let i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var match = true;

        // Filter dari budget
        // Tampilkan activity yang budgetnya lebih besar / sama dengan budget user
        if (filterCriteria.budget && activity.budget > filterCriteria.budget) {
            match = false;
        }

        // Filter dari tags
        if (filterCriteria.tag) {
            var tagFound = false;

            for (let j = 0; j < activity.tags.length; j++) {
                if (activity.tags[j] === filterCriteria.tag) {
                    tagFound = true;
                    break;
                }
            }
            if (!tagFound) {
                match = false;
            }
        }
        if (match) {
            filtered.push(activity);
        } 
    }
    return filtered;

} catch (error) {
    console.log('Gagal mengambil data:', error.message);
    return [];
}

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