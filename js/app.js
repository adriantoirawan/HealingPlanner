// 1. SAVE FUNCTION
function executeSave(title, imageBase64, location, budget, description) {
  const activityData = {
    title: title,
    image: imageBase64,
    location: location,
    budget: Number(budget),
    description: description,
    tags: [],
  };

  const result = saveActivity(activityData);

  if (result.success) {
    alert("Activity berhasil disimpan!");
    return true;
  } else {
    alert("Gagal menyimpan: " + result.message);
    return false;
  }
}

// ADD BUTTON EVENT LISTENER
const addNewWishlistButton = document.getElementById("add-wishlist-button");

// We check IF the button exists before adding the listener
// This prevents errors on index.html where this button doesn't exist
if (addNewWishlistButton) {
  addNewWishlistButton.addEventListener("click", function (e) {
    e.preventDefault();

    const titleVal = document.getElementById("healing-title").value;
    const locationVal = document.getElementById("healing-location").value;
    const budgetVal = document.getElementById("healing-budget").value;
    const descriptionVal = document.getElementById("healing-description").value;
    const imageInput = document.getElementById("healing-image");

    if (!imageInput) {
      alert("Mohon maaf, terjadi kesalahan pada sistem form.");
      return;
    }

    const imageFile = imageInput.files[0];

    function clearForm() {
      document.getElementById("healing-title").value = "";
      document.getElementById("healing-location").value = "";
      document.getElementById("healing-budget").value = "";
      document.getElementById("healing-description").value = "";
      imageInput.value = "";
    }

    if (!imageFile) {
      const isSuccess = executeSave(
        titleVal,
        "",
        locationVal,
        budgetVal,
        descriptionVal,
      );
      if (isSuccess) clearForm();
      return;
    }

    if (imageFile.size > 1048576) {
      alert("Ukuran gambar terlalu besar! Maksimal 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const base64String = event.target.result;
      const isSuccess = executeSave(
        titleVal,
        base64String,
        locationVal,
        budgetVal,
        descriptionVal,
      );
      if (isSuccess) clearForm();
    };
    reader.readAsDataURL(imageFile);
  });
}

// --- "PICK FOR ME" FEATURE LOGIC ---

// Ensure the function is only attached if the button exists on the current page
const pickForMeBtn = document.getElementById("pick-for-me-btn");

if (pickForMeBtn) {
  pickForMeBtn.addEventListener("click", showRandomResult);
}

function showRandomResult() {
  // 1. Get all activities from local storage
  const allActivities = getActivities();

  // 2. Pass the array to our randomizer function
  const randomActivity = getRandomActivity(allActivities);

  // 3. Grab the DOM elements inside the modal
  const modalTitle = document.getElementById("random-activity-title");
  const modalLocation = document.getElementById("random-activity-location");
  const modalBudget = document.getElementById("random-activity-budget");
  const modalDesc = document.getElementById("random-activity-desc");
  const modalImg = document.getElementById("random-activity-image");

  if (!randomActivity) {
    // If there are no activities saved yet, show a fallback state
    modalTitle.textContent = "No Activities Found";
    modalLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Unknown`;
    modalBudget.textContent = "Rp0";
    modalDesc.textContent = "You need to add some activities to your wishlist before we can pick one for you!";
    modalImg.src = "https://via.placeholder.com/300x200?text=Add+Activities";
    return;
  }

  // 4. Populate the modal with the random activity's data
  modalTitle.textContent = randomActivity.title;
  modalLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${randomActivity.location}`;
  modalBudget.textContent = `Rp ${randomActivity.budget.toLocaleString("id-ID")}`;
  modalDesc.textContent = randomActivity.description;
  
  // Use the uploaded image, or a placeholder if none exists
  modalImg.src = randomActivity.image ? randomActivity.image : "https://via.placeholder.com/300x200?text=No+Image";
}

// --- STATE VARIABLE FOR DELETION ---
let activityIdToDelete = null;

// UI RENDERING FUNCTIONS
function renderCards(searchTerm = "") {
  const container = document.getElementById("activities-container");
  if (!container) return;

  // 1. Get all activities
  let activities = getActivities();

  // 2. Filter activities if a search term exists
  if (searchTerm.trim() !== "") {
    const lowerCaseTerm = searchTerm.toLowerCase();
    activities = activities.filter(item => {
      // Check if the title or the location includes the search term
      const matchTitle = item.title.toLowerCase().includes(lowerCaseTerm);
      const matchLocation = item.location.toLowerCase().includes(lowerCaseTerm);
      return matchTitle || matchLocation;
    });
  }

  container.innerHTML = "";

  // 3. Handle Empty State
  if (activities.length === 0) {
    container.innerHTML = `
      <div class="col-12 d-flex flex-column justify-content-center align-items-center text-center w-100" style="height: 40vh;">
          <i class="bi bi-journal-x text-secondary" style="font-size: 3rem;"></i>
          <span class="text-secondary fs-5 mt-2">No activities found.</span>
      </div>
    `;
    return;
  }

  // 4. Render Cards
  for (let i = 0; i < activities.length; i++) {
    const item = activities[i];
    const formattedBudget = item.budget.toLocaleString("id-ID");
    const imageSrc = item.image ? item.image : "https://via.placeholder.com/300x300?text=No+Image";

    const cardHTML = `
      <div class="card shadow-sm w-100">
          <div class="row g-0">
              <div class="col-md-4 col-lg-3">
                  <img src="${imageSrc}" class="img-fluid rounded-start h-100 w-100" style="object-fit: cover; min-height: 200px;" alt="${item.title}">
              </div>
              
              <div class="col-md-8 col-lg-9">
                  <div class="card-body d-flex flex-column h-100 py-4">
                      <h4 class="card-title fw-bold mb-1">${item.title}</h4>
                      <p class="text-muted small mb-3">
                          <i class="bi bi-geo-alt-fill text-danger"></i> ${item.location} &nbsp;|&nbsp; <span class="fw-bold text-success">Rp ${formattedBudget}</span>
                      </p>
                      <p class="card-text text-secondary mb-4 flex-grow-1">${item.description}</p>
                      
                      <div class="d-flex gap-2 mt-auto">
                          <button class="btn btn-sm btn-light border text-secondary fw-semibold">View Detail</button>
                          <button class="btn btn-sm btn-dark px-3" onclick="editItem('${item.id}')">Edit</button>
                          <button class="btn btn-sm btn-danger px-3" onclick="triggerDeleteModal('${item.id}')">Delete</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  }
}

// --- SEARCH FEATURE LOGIC ---
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

if (searchForm && searchInput) {
  // Option 1: Search when the user clicks the "Search" button or hits Enter
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the page from reloading
    renderCards(searchInput.value);
  });

  // Option 2: Live search (filters instantly as the user types)
  searchInput.addEventListener("input", function(e) {
    renderCards(e.target.value);
  });
}

// --- ACTION LOGIC ---

// 1. EDIT: Redirect to the edit page with the ID in the URL
function editItem(id) {
  window.location.href = `edit-healing-wishlist.html?id=${id}`;
}

// 2. DELETE: Open Bootstrap Modal and store the ID
function triggerDeleteModal(id) {
  activityIdToDelete = id; // Save the ID to our global variable
  const deleteModal = new bootstrap.Modal(document.getElementById('globalDeleteModal'));
  deleteModal.show();
}

// Listen for the final confirmation inside the modal
const executeDeleteBtn = document.getElementById("execute-delete-btn");
if (executeDeleteBtn) {
  executeDeleteBtn.addEventListener("click", function() {
    if (activityIdToDelete) {
      const response = deleteActivity(activityIdToDelete);
      
      if (response.success) {
        // Hide the modal properly using Bootstrap's API
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('globalDeleteModal'));
        modalInstance.hide();
        
        // Refresh the list visually
        renderCards(); 
      } else {
        alert("Failed to delete: " + response.message);
      }
    }
  });
}

// Automatically run renderCards when the script loads
renderCards();