const addNewWishlistButton = document.getElementById("add-wishlist-button");

addNewWishlistButton.addEventListener("click", (e) => {
    // 1. Prevent the page from reloading when the button is clicked
    e.preventDefault(); 

    // 2. Safely grab the HTML elements using the EXACT IDs from your HTML file
    const titleInput = document.getElementById("healing-title");
    const imageInput = document.getElementById("healing-image");
    const locationInput = document.getElementById("healing-location");
    const budgetInput = document.getElementById("healing-budget");
    const descriptionInput = document.getElementById("healing-description");

    // 3. Prevent crash if IDs are changed in the future
    if (!titleInput || !imageInput || !locationInput || !budgetInput || !descriptionInput) {
        console.error("Developer Error: HTML IDs do not match JavaScript.");
        alert("Mohon maaf, terjadi kesalahan pada sistem form. Silakan refresh halaman.");
        return; 
    }

    // 4. Since there is no text input for tags in the HTML yet, we will pass an empty array 
    // to prevent errors in storageManager.js
    const tagsArray = [];

    // 5. Package the data
    const activityData = {
        title: titleInput.value,
        image: imageInput.value, // Note: This will capture a fake path like "C:\fakepath\image.png"
        location: locationInput.value,
        budget: Number(budgetInput.value),
        description: descriptionInput.value,
        tags: tagsArray
    };

    // 6. Save using your storage manager
    const result = saveActivity(activityData);

    // 7. Notify the user
    if (result.success) {
        alert("Activity berhasil ditambahkan!");
        
        // Optional: clear the form so they can add another one
        titleInput.value = '';
        imageInput.value = '';
        locationInput.value = '';
        budgetInput.value = '';
        descriptionInput.value = '';

        // renderCards(); 
    } else {
        alert("Gagal menyimpan: " + result.message); 
    }
});

function renderCards() {
    // Logic to display cards will go here
}

function showRandomResult() {
    // Logic for random result will go here
}