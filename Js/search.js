import {
  getLocalStorage,
  getProductCardHtml,
  getWatches,
  setLocalStorage,
} from "../Js/main.js";

const searchQueryContainer = document.getElementById("search-query");
const productContainer = document.getElementById("product-cart-container");

// this function checks the relevancy fo the search query and finds the best match
function checkRelevancy(queryPool, searchQuery) {
  const searchQueryArr = searchQuery.split(" ");
  let result = [];
  for (let i = 0; i < searchQueryArr.length; i++) {
    for (let j = 0; j < queryPool.length; j++) {
      if (searchQueryArr[i].toLowerCase() === queryPool[j].toLowerCase()) {
        result.push(true);
      }
    }
  }
  return result.length > 0 ? true : false;
}

// this function filters the data from the data.json
async function getfilteredData(searchQuery) {
  const fullData = await getWatches();
  const fiteredData = fullData.filter((item) => {
    const filterArray = item.name.split(" ");
    filterArray.push(item.brand, item.tags);
    if (checkRelevancy(filterArray.flat(), searchQuery)) return item;
  });
  return fiteredData;
}

// this function shows the searched product 
async function showSearchProduct(data) {
    if (data.length > 0) {
       for (const item of data) {
         productContainer.innerHTML += await getProductCardHtml(item);
      };
      document.querySelectorAll(".product-info").forEach((card) => {
        card.onclick = () => {
          setLocalStorage("selectedWatchId", card.dataset.watchid);
          window.location.href = "./Html/view.html";
        }
      })
    }
    else {
        productContainer.innerHTML = `
            <div style="display:flex;flex-direction:column;grid-column-start:1;grid-column-end:-1;height:100%;justify-content:center;align-items:center;padding:1rem;">
                <img src="../assets/photos/undraw_not-found.svg" />
                <p style="font:1.5rem;font-weight:bold;">Opps Not Found</p>
            </div>
        `
    }
}

async function main() {
  const searchQuery = getLocalStorage("searchQuery");
  searchQueryContainer.innerHTML = searchQuery;
  const data = await getfilteredData(searchQuery);
  showSearchProduct(data);
}

main();