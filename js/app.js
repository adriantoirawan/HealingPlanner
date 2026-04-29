// --- 1. SAVE FUNCTION ---
function executeSave(title, imageBase64, location, budget, description, tags) {
  const activityData = {
    title: title,
    image: imageBase64,
    location: location,
    budget: Number(budget),
    description: description,
    tags: tags || [],
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

// --- 2. DYNAMIC TAGS INPUT LOGIC (Create Page) ---
let currentFormTags = [];
const tagInput = document.getElementById("tag-input");
const addTagBtn = document.getElementById("add-tag-btn");
const tagsContainer = document.getElementById("tags-container");

function renderFormTags() {
  if (!tagsContainer) return;
  tagsContainer.innerHTML = "";
  currentFormTags.forEach((tag, index) => {
    tagsContainer.innerHTML += `
      <span class="badge bg-dark d-flex align-items-center fs-6 fw-normal">
          ${tag} <i class="bi bi-x ms-2" style="cursor:pointer;" onclick="removeFormTag(${index})"></i>
      </span>
    `;
  });
}

// Attach to window so the inline onclick works
window.removeFormTag = function(index) {
  currentFormTags.splice(index, 1);
  renderFormTags();
};

if (tagInput && addTagBtn) {
  // Add tag on button click
  addTagBtn.addEventListener("click", () => {
    const val = tagInput.value.trim();
    if (val && !currentFormTags.includes(val)) {
      currentFormTags.push(val);
      tagInput.value = "";
      renderFormTags();
    }
  });

  // Add tag on pressing "Enter" (and prevent form submission)
  tagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagBtn.click();
    }
  });
}

// --- 3. ADD BUTTON EVENT LISTENER ---
const addNewWishlistButton = document.getElementById("add-wishlist-button");

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
      // Clear dynamic tags
      currentFormTags = [];
      renderFormTags();
    }

    if (!imageFile) {
      // Pass the dynamic currentFormTags array
      const isSuccess = executeSave(titleVal, "", locationVal, budgetVal, descriptionVal, currentFormTags);
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
      // Pass the dynamic currentFormTags array
      const isSuccess = executeSave(titleVal, base64String, locationVal, budgetVal, descriptionVal, currentFormTags);
      if (isSuccess) clearForm();
    };
    reader.readAsDataURL(imageFile);
  });
}

// --- 4. "PICK FOR ME" FEATURE LOGIC ---
const pickForMeBtn = document.getElementById("pick-for-me-btn");

if (pickForMeBtn) {
  pickForMeBtn.addEventListener("click", showRandomResult);
}

function showRandomResult() {
  const allActivities = getActivities();
  const randomActivity = getRandomActivity(allActivities);

  const modalTitle = document.getElementById("random-activity-title");
  const modalLocation = document.getElementById("random-activity-location");
  const modalBudget = document.getElementById("random-activity-budget");
  const modalDesc = document.getElementById("random-activity-desc");
  const modalImg = document.getElementById("random-activity-image");

  if (!randomActivity) {
    modalTitle.textContent = "No Activities Found";
    modalLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Unknown`;
    modalBudget.textContent = "Rp0";
    modalDesc.textContent = "You need to add some activities to your wishlist before we can pick one for you!";
    modalImg.src = "";
    return;
  }

  modalTitle.textContent = randomActivity.title;
  modalLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${randomActivity.location}`;
  modalBudget.textContent = `Rp ${randomActivity.budget.toLocaleString("id-ID")}`;
  modalDesc.textContent = randomActivity.description;
  modalImg.src = randomActivity.image;
}

// --- 5. GLOBAL STATE VARIABLES ---
let activityIdToDelete = null;
let currentSearchTerm = "";
let currentSortOrder = "";
let currentFilterTags = [];
let currentMinBudget = null;
let currentMaxBudget = null;

// --- 6. DYNAMIC SIDEBAR FILTER GENERATOR (Index Page) ---
function renderFilterSidebar() {
  const container = document.getElementById("dynamic-filter-tags");
  if (!container) return;

  const activities = getActivities();
  const uniqueTags = new Set();

  activities.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => uniqueTags.add(tag));
    }
  });

  container.innerHTML = "";

  if (uniqueTags.size === 0) {
    container.innerHTML = '<span class="text-secondary small">No tags available</span>';
    return;
  }

  // Generate Bootstrap btn-check pills instead of standard checkboxes
  uniqueTags.forEach(tag => {
    const isChecked = currentFilterTags.includes(tag) ? "checked" : "";
    container.innerHTML += `
      <div>
        <input type="checkbox" class="btn-check filter-tag-checkbox" id="filter-${tag}" value="${tag}" autocomplete="off" ${isChecked}>
        <label class="btn btn-outline-dark btn-sm rounded-pill" for="filter-${tag}">${tag}</label>
      </div>
    `;
  });

  // Re-attach listeners to the new toggle pills
  document.querySelectorAll(".filter-tag-checkbox").forEach(cb => {
    cb.addEventListener("change", function() {
      if (this.checked) {
        currentFilterTags.push(this.value);
      } else {
        currentFilterTags = currentFilterTags.filter(t => t !== this.value);
      }
      renderCards();
    });
  });
}

// --- 7. UI RENDERING FUNCTIONS ---
function renderCards() {
  const container = document.getElementById("activities-container");
  if (!container) return;

  let activities = getActivities();

  // Search Filter
  if (currentSearchTerm.trim() !== "") {
    const lowerCaseTerm = currentSearchTerm.toLowerCase();
    activities = activities.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerCaseTerm);
      const matchLocation = item.location.toLowerCase().includes(lowerCaseTerm);
      return matchTitle || matchLocation;
    });
  }

  // Tags Filter
  if (currentFilterTags.length > 0) {
    activities = activities.filter(item => {
      if (!item.tags || item.tags.length === 0) return false;

      return currentFilterTags.some(tag => item.tags.includes(tag));
    });
  }

  // Budget Filter
  if (currentMinBudget !== null) {
    activities = activities.filter(item => item.budget >= currentMinBudget);
  }
  if (currentMaxBudget !== null) {
    activities = activities.filter(item => item.budget <= currentMaxBudget);
  }

  // Sorting
  if (currentSortOrder === "asc") {
    activities.sort((a, b) => a.budget - b.budget);
  } else if (currentSortOrder === "desc") {
    activities.sort((a, b) => b.budget - a.budget);
  }

  container.innerHTML = "";

  if (activities.length === 0) {
    container.innerHTML = `
      <div class="col-12 d-flex flex-column justify-content-center align-items-center text-center w-100" style="height: 40vh;">
          <i class="bi bi-pencil-square text-secondary" style="font-size: 3rem;"></i>
          <span class="text-secondary fs-5 mt-2">Add your first healing activity!</span>
      </div>
    `;
    return;
  }

  for (let i = 0; i < activities.length; i++) {
    const item = activities[i];
    const formattedBudget = item.budget.toLocaleString("id-ID");
    const imageSrc = item.image ? item.image : "https://via.placeholder.com/300x300?text=No+Image";

    let tagsHTML = "";
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach(tag => {
        tagsHTML += `<span class="badge bg-secondary me-1 fw-normal">${tag}</span>`;
      });
    }

    const cardHTML = `
      <div class="card shadow-sm w-100">
          <div class="row g-0">
              <div class="col-md-4 col-lg-3">
                  <img src="${imageSrc}" class="img-fluid rounded-start h-100 w-100" style="object-fit: cover; min-height: 200px;" alt="${item.title}">
              </div>
              
              <div class="col-md-8 col-lg-9">
                  <div class="card-body d-flex flex-column h-100 py-4">
                      <div class="d-flex justify-content-between align-items-start">
                         <h4 class="card-title fw-bold mb-1">${item.title}</h4>
                         <div>${tagsHTML}</div>
                      </div>
                      <p class="text-muted small mb-3">
                          <i class="bi bi-geo-alt-fill text-danger"></i> ${item.location} &nbsp;|&nbsp; <span class="fw-bold text-success">Rp ${formattedBudget}</span>
                      </p>
                      <p class="card-text text-secondary mb-4 flex-grow-1">${item.description}</p>
                      
                      <div class="d-flex gap-2 mt-auto">
                          <button class="btn btn-sm btn-light border text-secondary fw-semibold" onclick="viewItem('${item.id}')">View Detail</button>
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

// --- 8. OTHER EVENT LISTENERS ---

// Search
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    currentSearchTerm = searchInput.value;
    renderCards();
  });
  searchInput.addEventListener("input", function(e) {
    currentSearchTerm = e.target.value;
    renderCards();
  });
}

// Sort
const sortAscBtn = document.getElementById("sort-asc-btn");
const sortDescBtn = document.getElementById("sort-desc-btn");
if (sortAscBtn && sortDescBtn) {
  sortAscBtn.addEventListener("click", function() {
    currentSortOrder = "asc";
    sortAscBtn.className = "btn btn-dark";
    sortDescBtn.className = "btn btn-light border";
    renderCards();
  });
  sortDescBtn.addEventListener("click", function() {
    currentSortOrder = "desc";
    sortDescBtn.className = "btn btn-dark";
    sortAscBtn.className = "btn btn-light border";
    renderCards();
  });
}

// Budget Filters
const minBudgetInput = document.getElementById("filter-min-budget");
const maxBudgetInput = document.getElementById("filter-max-budget");

if (minBudgetInput) {
  minBudgetInput.addEventListener("input", function() {
    currentMinBudget = this.value === "" ? null : Number(this.value);
    renderCards();
  });
}

if (maxBudgetInput) {
  maxBudgetInput.addEventListener("input", function() {
    currentMaxBudget = this.value === "" ? null : Number(this.value);
    renderCards();
  });
}

// --- 9. ACTION LOGIC ---
function editItem(id) {
  window.location.href = `edit-healing-wishlist.html?id=${id}`;
}

function viewItem(id) {
  window.location.href = `view-healing-wishlist.html?id=${id}`;
}

function triggerDeleteModal(id) {
  activityIdToDelete = id;
  const deleteModal = new bootstrap.Modal(document.getElementById('globalDeleteModal'));
  deleteModal.show();
}

const executeDeleteBtn = document.getElementById("execute-delete-btn");
if (executeDeleteBtn) {
  executeDeleteBtn.addEventListener("click", function() {
    if (activityIdToDelete) {
      const response = deleteActivity(activityIdToDelete);
      if (response.success) {
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('globalDeleteModal'));
        modalInstance.hide();

        // Refresh the list and sidebar!
        renderFilterSidebar();
        renderCards();
      } else {
        alert("Failed to delete: " + response.message);
      }
    }
  });
}

// Boot the app
renderFilterSidebar();
renderCards();
