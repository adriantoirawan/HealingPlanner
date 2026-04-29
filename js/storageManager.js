// Define the key used for Local Storage
const storageKey = "healing_activities";

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
    if (activityData.location.length > 50) {
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
      tags: JSON.stringify(activityData.tags),
    };

    // Stringify and push the object into the Local Storage array.
    var activities = getActivities();
    activities.push(newActivity);
    localStorage.setItem(storageKey, JSON.stringify(activities));

    return { success: true, data: newActivity };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function getActivities(filterCriteria) {
  try {
    var data = localStorage.getItem(storageKey);

    if (!data) {
      return [];
    }

    var activities = JSON.parse(data);

    // SAFE TAG PARSING: Prevent crashes from old or corrupted data
    for (let i = 0; i < activities.length; i++) {
      try {
        // Only try to parse if it's actually a string
        if (typeof activities[i].tags === "string") {
          activities[i].tags = JSON.parse(activities[i].tags);
        } else if (!activities[i].tags) {
          activities[i].tags = []; // Fallback if tags are missing entirely
        }
      } catch (tagError) {
        // If parsing fails, just default to an empty array instead of crashing everything
        activities[i].tags = [];
      }
    }

    // Jika filterCriteria tidak ada, return semua data
    if (!filterCriteria) {
      return activities;
    }

    // Jika filterCriteria ada ambil datanya
    var filtered = [];

    for (let i = 0; i < activities.length; i++) {
      var activity = activities[i];
      var match = true;

      // Filter dari budget
      if (
        filterCriteria.budget !== undefined &&
        activity.budget > filterCriteria.budget
      ) {
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
    // I uncommented this so you can see if something else breaks!
    console.error("Gagal mengambil data:", error.message);
    return [];
  }
}

function updateActivity(id, updatedData) {
  // Create a function that finds an object by its unique ID.

  // Overwrite the existing properties with the newly submitted edits and
  // save the updated array back to Local Storage.
  try {
    // memanggil funcition getActivities

    const activities = getActivities();
    let found = false;
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].id === id) {
        if (updatedData.title !== undefined) {
          if (!updatedData.title) {
            throw new Error("Title tidak boleh kosong!");
          }
          if (updatedData.title.length > 50) {
            throw new Error("Title maksimal 50 karakter");
          }
          activities[i].title = updatedData.title;
        }
        if (updatedData.location !== undefined) {
          if (updatedData.location.length > 50) {
            throw new Error("Location maksimal 50 karakter");
          }
          activities[i].location = updatedData.location;
        }
        if (updatedData.budget !== undefined) {
          if (updatedData.budget < 0) {
            throw new Error("Budget tidak boleh negatif");
          }
          activities[i].budget = updatedData.budget;
        }
        if (updatedData.description !== undefined) {
          if (updatedData.description.length > 500) {
            throw new Error("Description maksimal 500 karakter");
          }
          activities[i].description = updatedData.description;
        }
        if (updatedData.image !== undefined) {
          activities[i].image = updatedData.image;
        }
        if (updatedData.tags !== undefined) {
          activities[i].tags = updatedData.tags;
        }
        found = true;
        break;
      }
    }
    if (!found) {
      return { success: false, message: "Data tidak ditemukan" };
    }
    localStorage.setItem(storageKey, JSON.stringify(activities));
    return { success: true, data: activities };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function deleteActivity(id) {
  // Write a function that filters out a specific object by its ID and saves the modified array.

  try {
    const activities = getActivities();
    let result = [];
    let found = false;
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].id !== id) {
        result.push(activities[i]);
      } else {
        found = true;
      }
    }
    if (!found) {
      return { success: false, message: "Data tidak ditemukan" };
    }
    localStorage.setItem(storageKey, JSON.stringify(result));
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// --- DEMO DATA INITIALIZATION ---
function initializeDemoData() {
  const existingData = localStorage.getItem(storageKey);
  
  // Check if there is already data in local storage. 
  // If there is, we don't want to overwrite the user's actual saved items!
  if (existingData) {
    const parsedData = JSON.parse(existingData);
    if (parsedData.length > 0) {
      console.log("Storage already has data. Skipping demo data initialization.");
      return;
    }
  }

  // Generate a diverse set of demo activities
  const demoActivities = [
    {
      id: "demo_1" + Date.now(),
      title: "Weekend Retreat in Lembang",
      image: "img/lembang.jpg", // Nature/Cabin vibe
      location: "Bandung",
      budget: 1200000,
      description: "Taking a road trip to the mountains for a quiet weekend in a pine forest cabin to reset and enjoy the cool air.",
      tags: ["Nature", "Roadtrip", "Outdoor"]
    },
    {
      id: "demo_2" + Date.now(),
      title: "Culinary Train Trip to Kota Lama",
      image: "img/traintrip.jpg", // Train/City vibe
      location: "Semarang",
      budget: 850000,
      description: "Taking the morning train to explore the historical buildings in Kota Lama and hunting for the best local street food.",
      tags: ["Solo", "Outdoor", "Cheap"]
    },
    {
      id: "demo_3" + Date.now(),
      title: "Luxury Staycation",
      image: "img/luxurystaycation.jpg", // Fancy hotel bed
      location: "Jakarta",
      budget: 3500000,
      description: "Booking a high-end hotel room in the city center just to order room service, use the spa, and sleep in.",
      tags: ["Indoor", "Dating"]
    },
    {
      id: "demo_4" + Date.now(),
      title: "Quick Coffee Shop Hopping",
      image: "img/coffee.jpg", // Cafe vibe
      location: "Depok",
      budget: 150000,
      description: "Spending the afternoon reading a book and trying out two new local artisan coffee shops.",
      tags: ["Indoor", "Cheap", "Solo"]
    },
    {
      id: "demo_5" + Date.now(),
      title: "Beachfront Resort Getaway",
      image: "img/beachresort.jpg", // Beautiful beach
      location: "Bali",
      budget: 4500000,
      description: "A proper long-weekend vacation staying right on the beach, with surfing lessons in the morning and seafood dinners at night.",
      tags: ["Outdoor", "Beach", "Dating"]
    },
    {
      id: "demo_6" + Date.now(),
      title: "Business Trip Extension",
      image: "img/businessextension.jpg", // Restaurant/City
      location: "Surabaya",
      budget: 600000,
      description: "Extending a work trip through the weekend to finally explore the local culinary scene without rushing.",
      tags: ["Solo", "Indoor"]
    }
  ];

  // Save to local storage
  localStorage.setItem(storageKey, JSON.stringify(demoActivities));
  console.log("Successfully injected demo data!");
}

// --- CLEAR STORAGE LOGIC ---
function clearLocalStorage() {
  // Remove the specific key used by this app
  localStorage.removeItem(storageKey);
  
  // Immediately re-initialize an empty array so the app doesn't crash 
  // when it tries to read the data on the next page load
  initializeStorage();
  
  console.log("Local storage has been completely cleared!");
}

// Run initialization immediately when the file loads
initializeStorage();
