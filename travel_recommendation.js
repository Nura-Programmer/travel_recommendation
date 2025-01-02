// Reset search input to empty string
document.getElementById("clear-btn").addEventListener("click", clearSearch);
function clearSearch() {
  document.getElementById("search-input").value = "";
  resetSearchPanel();
}

// Reset search result on the search panel
function resetSearchPanel() {
  document.getElementById("error-panel").innerText = "";
  document.getElementById("error-panel").style.display = "none";
  document.getElementById(
    "result-panel"
  ).innerHTML = `<p id="error-panel"></p>`;
}

// the search logic
document
  .querySelectorAll(".search-btns")
  .forEach((btn) => btn.addEventListener("click", search));
function search() {
  const searchText = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

  // Reset previous search if available
  resetSearchPanel();

  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((result) => {
      if (searchText == "" || searchText == null)
        renderSearch("Error: please enter keyword to search");
      else if (/^countr(y|ies)?$/.test(searchText))
        result["countries"].forEach(({ cities }) => renderSearch(cities));
      else if (/^templ(e|es)?$/.test(searchText))
        renderSearch(result["temples"]);
      else if (/^beac(h|he|hes)?$/.test(searchText))
        renderSearch(result["beaches"]);
      else renderSearch(`Error: No place found for "${searchText}"`);
    })
    .catch((error) => {
      console.log("Error:", error);
      renderSearch("An error occurred while fetching data.");
    });
}

function renderSearch(searchResult) {
  // Check if its a valid expected result
  if (typeof searchResult === "object")
    return searchResult.map(
      ({ name, imageUrl, description }) =>
        (document.getElementById(
          "result-panel"
        ).innerHTML += `<div class="results">
                <img src="${imageUrl}" alt="${name}" />
                <div class="result-description">
                    <h3 class="result-title">${name}</h3>
                    <p>${description}</p>
                    <button>Visit</button>
                </div>
            </div>`)
    );

  //   Display error message
  document.getElementById("error-panel").style.display = "block";
  document.getElementById("error-panel").innerText = searchResult;
}
