document.addEventListener("DOMContentLoaded", function () {
    // 1. Grab the ID from the URL (e.g., edit-healing-wishlist.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get("id");

    if (!activityId) {
      alert("No activity selected to edit!");
      window.location.href = "index.html"; 
      return;
    }

    // 2. Fetch the activity data
    const activities = getActivities();
    const activityToEdit = activities.find(item => item.id === activityId);

    if (!activityToEdit) {
      alert("Activity not found!");
      window.location.href = "index.html";
      return;
    }

    // 3. Populate the form fields with existing data
    document.getElementById("title").value = activityToEdit.title;
    document.getElementById("inputLocation").value = activityToEdit.location;
    document.getElementById("inputBudget").value = activityToEdit.budget;
    document.getElementById("inputDesc").value = activityToEdit.description;
    
    // We store the old image in case they don't upload a new one
    let currentImageBase64 = activityToEdit.image;

    const fileInput = document.getElementById("inputFile");
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentImageBase64 = e.target.result; 
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. Handle the Save
    const submitButton = document.querySelector("button[type='submit']");
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();

      const updatedData = {
        title: document.getElementById("title").value,
        location: document.getElementById("inputLocation").value,
        budget: Number(document.getElementById("inputBudget").value),
        description: document.getElementById("inputDesc").value,
        image: currentImageBase64 
      };

      const result = updateActivity(activityId, updatedData);

      if (result.success) {
        window.location.href = "index.html"; 
      } else {
        alert("Failed to update: " + result.message);
      }
    });
  });