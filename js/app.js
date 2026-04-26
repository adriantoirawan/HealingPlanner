// Global save function
function executeSave(title, imageBase64, location, budget, description) {
    const activityData = {
        title: title,
        image: imageBase64, 
        location: location,
        budget: Number(budget),
        description: description,
        tags: []
    };

    const result = saveActivity(activityData);

    if (result.success) {
        alert("Activity berhasil disimpan!");
        return true; // Let the caller know it succeeded
    } else {
        alert("Gagal menyimpan: " + result.message);
        return false; // Let the caller know it failed
    }
}

// Add button event listener
const addNewWishlistButton = document.getElementById("add-wishlist-button");
addNewWishlistButton.addEventListener("click", function(e) {
    e.preventDefault(); 

    // 1. Grab all the input values right now
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

    // Helper function to clear this specific form
    function clearForm() {
        document.getElementById("healing-title").value = '';
        document.getElementById("healing-location").value = '';
        document.getElementById("healing-budget").value = '';
        document.getElementById("healing-description").value = '';
        imageInput.value = '';
    }

    // 2. If NO image, pass the values to executeSave immediately
    if (!imageFile) {
        const isSuccess = executeSave(titleVal, "", locationVal, budgetVal, descriptionVal);
        if (isSuccess) {
            clearForm();
        }
        return;
    }

    // 3. If image EXISTS, check size, read it, then pass values to executeSave
    if (imageFile.size > 1048576) { 
        alert("Ukuran gambar terlalu besar! Maksimal 1MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        
        // Pass the grabbed values + the new base64 string
        const isSuccess = executeSave(titleVal, base64String, locationVal, budgetVal, descriptionVal);
        if (isSuccess) {
            clearForm(); 
        }
    };
    reader.readAsDataURL(imageFile);
});


// --- UI Rendering Functions ---

function renderCards() {
    // Logic to display cards
}

function showRandomResult() {
    // Logic to display a random activity
}