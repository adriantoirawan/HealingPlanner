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

// // UI RENDERING FUNCTIONS
// function renderCards() {
//   const container = document.getElementById("activities-container");

//   // If we are not on the index page, stop the function
//   if (!container) return;

//   const activities = getActivities();

//   container.innerHTML = "";

//   if (activities.length === 0) {
//     container.innerHTML = `
//             <div class="col-12 d-flex justify-content-center align-items-center text-center w-100" style="height: 40vh;">
//                 <span class="text-secondary fs-5">Add your first healing activity!</span>
//             </div>
//         `;
//     return;
//   }

//   // Loop through the array and build a horizontal card for each item
//   for (let i = 0; i < activities.length; i++) {
//     const item = activities[i];

//     const formattedBudget = item.budget.toLocaleString("id-ID");
//     const imageSrc = item.image
//       ? item.image
//       : "https://via.placeholder.com/300x300?text=No+Image";

//     // The updated HTML template for the horizontal List View
//     const cardHTML = `
//             <div class="card shadow-sm w-100">
//                 <div class="row g-0">
//                     <div class="col-md-4 col-lg-3">
//                         <img src="${imageSrc}" class="img-fluid rounded-start h-100 w-100" style="object-fit: cover; min-height: 200px;" alt="${item.title}">
//                     </div>
                    
//                     <div class="col-md-8 col-lg-9">
//                         <div class="card-body d-flex flex-column h-100 py-4">
//                             <h4 class="card-title fw-bold mb-1">${item.title}</h4>
                            
//                             <p class="text-muted small mb-3">
//                                 <i class="bi bi-geo-alt-fill text-danger"></i> ${item.location} &nbsp;|&nbsp; <span class="fw-bold text-success">Rp ${formattedBudget}</span>
//                             </p>
                            
//                             <p class="card-text text-secondary mb-4 flex-grow-1">
//                                 ${item.description}
//                             </p>
                            
//                             <div class="d-flex gap-2 mt-auto">
//                                 <button class="btn btn-sm btn-light border text-secondary fw-semibold">View Detail</button>
//                                 <button class="btn btn-sm btn-dark px-3" onclick="editItem('${item.id}')">Edit</button>
//                                 <button  data-bs-toggle="modal"
//                     data-bs-target="#deleteModal" class="btn btn-sm btn-danger px-3" onclick="deleteItem('${item.id}')">Delete</button>
//                             </div>
//                             <!-- Modal Delete-->
//           <div class="modal fade" id="deleteModal" tabindex="-1">
//             <div class="modal-dialog modal-dialog-centered">
//               <div class="modal-content">
//                 <div class="modal-header">
//                   <h5 class="modal-title">Confirm Delete</h5>
//                   <button
//                     type="button"
//                     class="btn-close"
//                     data-bs-dismiss="modal"
//                   ></button>
//                 </div>

//                 <div class="modal-body">
//                   You’re going to delete the wishlist permanently. Are you sure?
//                 </div>

//                 <div class="modal-footer">
//                   <button class="btn btn-secondary" data-bs-dismiss="modal">
//                     Cancel
//                   </button>
//                   <button class="btn btn-danger">Delete</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;

//     container.innerHTML += cardHTML;
//   }
// }

// // Automatically run renderCards when the script loads
// renderCards();

// --- STATE VARIABLE FOR DELETION ---
let activityIdToDelete = null;

// UI RENDERING FUNCTIONS
function renderCards() {
  const container = document.getElementById("activities-container");
  if (!container) return;

  const activities = getActivities();
  container.innerHTML = "";

  if (activities.length === 0) {
    container.innerHTML = `
      <div class="col-12 d-flex flex-column justify-content-center align-items-center text-center w-100" style="height: 40vh;">
          <i class="bi bi-journal-x text-secondary" style="font-size: 3rem;"></i>
          <span class="text-secondary fs-5 mt-2">No activities found. Add your first healing activity!</span>
      </div>
    `;
    return;
  }

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

function showRandomResult() {
  // Logic to display a random activity
}