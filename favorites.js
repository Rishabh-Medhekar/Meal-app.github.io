// Wait for the DOM to be loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
  // Get reference to the container for favorite meals and define items per page and current page
  const favoriteMealsContainer = document.getElementById("favoriteMeals");
  const itemsPerPage = 6;
  let currentPage = 1;

  // Show favorite meals on page load
  showFavoriteMeals();

  // Function to display favorite meals
  function showFavoriteMeals() {
    // Get the list of favorite meals from local storage or initialize an empty array
    const favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    const totalPages = Math.ceil(favoritesList.length / itemsPerPage);

    // If there are no favorite meals, display a message; otherwise, display the meals on the current page
    if (favoritesList.length === 0) {
      favoriteMealsContainer.innerHTML = "<p>You have no favorite meals.</p>";
    } else {
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const favoriteMealsOnPage = favoritesList.slice(startIdx, endIdx);
      const favoriteMealsHTML = favoriteMealsOnPage
        .map((meal) => createFavoriteMealCard(meal))
        .join("");
      favoriteMealsContainer.innerHTML = favoriteMealsHTML;
    }

    // Create pagination buttons
    createPaginationButtons(totalPages);
  }

  // Function to create the HTML for a favorite meal card
  function createFavoriteMealCard(meal) {
    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body d-flex justify-content-between">
            <h5 class="card-title">${meal.strMeal}</h5>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <a href="#" class="remove-from-favorites-btn" data-meal-id="${meal.idMeal}" data-meal-name="${meal.strMeal}" data-toggle="tooltip" title="Remove from Favorites">
              <i class="fas fa-trash"></i>
            </a>
            <a href="meal.html?id=${meal.idMeal}" class="btn-primary view-details" data-meal-id="${meal.idMeal}" data-toggle="tooltip" title="View Details">
              <i class="fas fa-eye"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Event listener to handle removing a meal from favorites
  favoriteMealsContainer.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".remove-from-favorites-btn");
    if (removeBtn) {
      const mealId = removeBtn.getAttribute("data-meal-id");
      const mealName = removeBtn.getAttribute("data-meal-name");
      const isConfirmed = confirm(
        `Are you sure you want to remove ${mealName} from your favorites?`
      );

      if (isConfirmed) {
        removeFromFavorites(mealId, mealName);
      }
    }
  });

  // Function to remove a meal from favorites
  function removeFromFavorites(mealId, mealName) {
    let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favoritesList.findIndex((meal) => meal.idMeal === mealId);

    if (index !== -1) {
      favoritesList.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favoritesList));
      showFavoriteMeals(); // Refresh the list after removing the meal

      alert(`${mealName} has been removed from your favorites.`);
    }
  }

  // Function to create pagination buttons
  function createPaginationButtons(totalPages) {
    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // Create previous page button if applicable
    if (currentPage > 1) {
      const prevPageBtn = document.createElement("button");
      prevPageBtn.classList.add("btn", "btn-primary", "mr-2");
      prevPageBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevPageBtn.addEventListener("click", () => {
        currentPage--;
        showFavoriteMeals();
      });
      paginationContainer.appendChild(prevPageBtn);
    }

    // Create page buttons for the current range
    for (let page = startPage; page <= endPage; page++) {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "mr-2");
      button.textContent = page;
      button.addEventListener("click", () => {
        currentPage = page;
        showFavoriteMeals();
      });
      paginationContainer.appendChild(button);
    }

    // Create next page button if applicable
    if (currentPage < totalPages) {
      const nextPageBtn = document.createElement("button");
      nextPageBtn.classList.add("btn", "btn-primary", "mr-2");
      nextPageBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextPageBtn.addEventListener("click", () => {
        currentPage++;
        showFavoriteMeals();
      });
      paginationContainer.appendChild(nextPageBtn);
    }
  }
});
