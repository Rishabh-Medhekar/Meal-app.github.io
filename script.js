// Wait for the DOM to be loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
  // Get references to the necessary elements from the DOM
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchForm = document.getElementById("searchForm");
  const searchResults = document.getElementById("searchResults");

  // API URL for fetching meal data based on search term
  const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  // Define the number of items per page and current page
  const itemsPerPage = 6;
  let currentPage = 1;

  // Prevent the form from submitting when the Enter key is pressed
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
    });

  // Add event listener to the search form to handle search
  searchForm.addEventListener("submit", handleSearch);

  // Function to handle the search when the form is submitted
  function handleSearch(event) {
    event.preventDefault();

    // Get the search term from the input field and trim whitespace
    const searchTerm = searchInput.value.trim();

    // If the search term is empty, clear the search results and return
    if (searchTerm.length === 0) {
      searchResults.innerHTML = "";
      return;
    }

    // Fetch meal data from the API based on the search term
    fetch(apiUrl + searchTerm)
      .then((response) => response.json())
      .then((data) => {
        const meals = data.meals;

        // If no meals are found, display a message and return
        if (!meals) {
          searchResults.innerHTML = `
              <div style="background-color: #fdf5e6; width: 300px; border-radius: 10px; margin: 0 auto;">
                    <h1 class="text-center mb-4" style="font-family: 'Lobster', cursive; color:red;">No results found.</h1>
              </div'`;
          return;
        }

        // Store the fetched meals for pagination
        lastSearchedMeals = meals;

        // Calculate the total number of pages based on the number of meals and items per page
        const totalPages = Math.ceil(meals.length / itemsPerPage);

        // Display the meals on the current page and create pagination buttons
        displayMealsOnPage(meals, currentPage);
        createPaginationButtons(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        searchResults.innerHTML = "<p>Oops! Something went wrong.</p>";
      });
  }

  // Function to display the meals on the current page
  function displayMealsOnPage(meals, page) {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const mealsOnPage = meals.slice(startIdx, endIdx);

    const html = mealsOnPage.map((meal) => createMealCard(meal)).join("");
    searchResults.innerHTML = html;
  }

  // Function to create a meal card HTML element
  function createMealCard(meal) {
    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <a href="#" class="addToFavorites" onclick="addToFavorites('${meal.idMeal}')" data-toggle="tooltip" title="Add to Favorites">
              <i class="fas fa-heart"></i>
            </a>
            <a href="meal.html?id=${meal.idMeal}" class="btn-primary view-details" data-meal-id="${meal.idMeal}" data-toggle="tooltip" title="View Details">
              <i class="fas fa-eye"></i>
            </a>
          </div>
        </div>
      </div>
    `;
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
        createPaginationButtons(totalPages);
        displayMealsOnPage(lastSearchedMeals, currentPage);
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
        createPaginationButtons(totalPages);
        displayMealsOnPage(lastSearchedMeals, currentPage);
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
        createPaginationButtons(totalPages);
        displayMealsOnPage(lastSearchedMeals, currentPage);
      });
      paginationContainer.appendChild(nextPageBtn);
    }
  }
});
