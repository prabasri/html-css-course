
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  let arr = search.split("=");
  return arr[1];  
}

//Implementation of fetch call with a parameterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    const AdventureAPI = await fetch(`${config.backendEndpoint}/adventures?city=${city}`);
    const AdventureCityAPI = await AdventureAPI.json();
    return AdventureCityAPI;
  } catch {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  if(adventures) {
    adventures.forEach(function(key) {
      addAdventureCityToDOM(key.id, key.name, key.costPerHead, key.currency, key.image, key.duration, key.category)
    });
  }
  
  function addAdventureCityToDOM(id, name, costPerHead, currency, image, duration, category) {
    // TODO: MODULE_CITIES
    // 1. Populate the City details and insert those details into the DOM
    const dataDiv = document.getElementById("data");
  
    const colDiv = document.createElement("div");
    colDiv.setAttribute("class", "col-sm-12 col-lg-3 col-md-6 mb-4");
    
    const aLink = document.createElement("a");
    aLink.href = `detail/?adventure=${id}`;
    aLink.setAttribute("id", id);
    
    const activityCardDiv = document.createElement("div");
    activityCardDiv.setAttribute("class", "activity-card");
  
    const imgCreate = document.createElement("img");
    imgCreate.setAttribute("class", "card-img-top");
    imgCreate.src = image;
    imgCreate.alt = name;

    const activityText = document.createElement("div")
    activityText.setAttribute("class", "card-body");

    const TextLine1 = document.createElement("div")
    TextLine1.setAttribute("class", "d-flex align-items-center justify-content-between");
  
    const adventureName = document.createElement("h5");
    adventureName.innerText = name;
    const amount1 = document.createElement("p");
    amount1.setAttribute("class", "card-text");
    amount1.innerText = `${currency} ${costPerHead}`;

    const TextLine2 = document.createElement("div")
    TextLine2.setAttribute("class", "d-flex align-items-center justify-content-between"); 

    const durationText = document.createElement("h5");
    durationText.innerText = "Duration";
    const time = document.createElement("p");
    time.setAttribute("class", "card-text");
    time.innerText = `${duration} Hours`;

    const categoryBanner = document.createElement("div");
    categoryBanner.setAttribute("class", "category-banner")
    categoryBanner.innerText = category;
    
    TextLine1.append(adventureName, amount1);
    TextLine2.append(durationText, time);
    activityText.append(TextLine1, TextLine2);
    activityCardDiv.append(imgCreate, activityText, categoryBanner);
    aLink.append(activityCardDiv);
    colDiv.append(aLink);
    dataDiv.append(colDiv);
  
  }
}
/* async function addNewAdventure(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    const newAdventures = await fetch(`http://52.66.231.47:8082/adventures/new`,{
      method: "POST",
      body: JSON.stringify({
        city: city
      }),
    });

    const AdventureCities = await newAdventures.json();
    return AdventureCities;
  } catch {
    return null;
  }
}*/
//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let filteredList = list.filter((element) => {
    return (element.duration >= low ) && (element.duration <= high);
  });
  return filteredList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  let filteredList = list.filter((element) => {
    return categoryList.includes(element.category);
  });
  return filteredList;
}
// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  
  if(filters.duration.length && filters.category.length) {  // for both duration and category filter
    const splittedDuration = filters.duration.split("-");
    let filterByCateg = filterByCategory(list, filters.category);
    return filterByDuration(filterByCateg, Number(splittedDuration[0]), Number(splittedDuration[1]));
  }
  else if(filters.duration.length) {    // for duration filter only 
    const splittedDuration = filters.duration.split("-");
    return filterByDuration(list, Number(splittedDuration[0]), Number(splittedDuration[1]));
  }
  else if(filters.category.length) {   // for category filter only 
    return filterByCategory(list, filters.category);
  }

 // (OR)
  if(filters.duration.length && !filters.category.length) {   // for duration filter only 
    const splittedDuration = filters.duration.split("-");
    console.log(splittedDuration);
    return filterByDuration(list, parseInt(splittedDuration[0]), parseInt(splittedDuration[1])); //parseInt() converts a string into number
  }
  else if(filters.category.length && !filters.duration.length) {   // for category filter only
    return filterByCategory(list, filters.category);
  }

  else if(filters.duration.length && filters.category.length) {   // for both duration and category filter
    const splittedDuration = filters.duration.split("-");
    let filterByCateg = filterByCategory(list, filters.category);
    return filterByDuration(filterByCateg, parseInt(splittedDuration[0]), parseInt(splittedDuration[1]));
  } 

  // Place holder for functionality to work in the Stubs
    return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem("filters", JSON.stringify(filters));  // because localStorage only stores strings
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  return JSON.parse(localStorage.getItem("filters"));
  // Place holder for functionality to work in the Stubs
  return null;
}

// Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  //Check the input filters passed and for every category filter, insert an element into the DOM. Insert them within the class with id category-list in the html file
  const durationOptions = document.getElementById("duration-select");
  durationOptions.value = filters.duration; // it shows the selected duration in the box even after refreshing the page

  const pillsDivSec = document.getElementById("category-section");
  const pillsDiv = document.getElementById("category-list");
  //pillsDiv.innerHTML =``;
  for (let i = 0; i < filters.category.length; i++) {

    const singlePill = document.createElement("span");
    singlePill.innerHTML = `${filters.category[i]}`;   
    singlePill.setAttribute("class", "category-filter");
    pillsDiv.append(singlePill);
    //pillsDiv.innerHTML += singlePill;  be carefull in this pllace , don't add pilsDiv.innerHTML. Because append will add the pills implicitly.
    pillsDivSec.append(pillsDiv); 
  }  
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
