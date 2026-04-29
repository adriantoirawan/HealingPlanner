document.addEventListener("DOMContentLoaded", function () {
  // Grab the ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get("id");

  if (!activityId) {
    alert("No activity selected!");
    window.location.href = "index.html"; 
    return;
  }

  // Fetch the activity data
  const activities = getActivities();
  const activityToView = activities.find(item => item.id === activityId);

  if (!activityToView) {
    alert("Activity not found!");
    window.location.href = "index.html";
    return;
  }

  // Populate the DOM elements
  document.getElementById("view-title").textContent = activityToView.title;
  document.getElementById("view-location").innerHTML = `📍 ${activityToView.location}`;
  document.getElementById("view-budget").textContent = `Rp ${activityToView.budget.toLocaleString("id-ID")}`;
  document.getElementById("view-description").textContent = activityToView.description;
  
  const imgElement = document.getElementById("view-image");
  imgElement.src = activityToView.image ? activityToView.image : "https://via.placeholder.com/1200x400?text=No+Image";

  // Wire up the Edit button
  const editBtn = document.getElementById("view-edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", function() {
      window.location.href = `edit-healing-wishlist.html?id=${activityId}`;
    });
  }

  // Wire up the Delete button
  const deleteBtn = document.getElementById("view-delete-btn");
  let deleteModalInstance = null; // Store the modal instance

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function() {
      // Initialize and show the Bootstrap modal
      deleteModalInstance = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
      deleteModalInstance.show();
    });
  }

  // 6. Execute the actual deletion from inside the modal
  const executeDeleteBtn = document.getElementById("execute-delete-btn");
  if (executeDeleteBtn) {
    executeDeleteBtn.addEventListener("click", function() {
      const response = deleteActivity(activityId);
      
      if (response.success) {
        // Hide the modal and redirect to home
        if (deleteModalInstance) {
            deleteModalInstance.hide();
        }
        window.location.href = "index.html"; 
      } else {
        alert("Failed to delete: " + response.message);
      }
    });
  }
});