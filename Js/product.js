import {
  setLocalStorage,
  getProductCardHtml,
  getReviewsStarForProduct,
  getWatches,
  getCertainProduct,
  checkImageAvailability,
} from "../Js/main.js";

const productSliderContainer = document.getElementById(
  "product-slider-container"
);
const newProductContainer = document.getElementById("new-product-container");
const popularProductContainer = document.getElementById(
  "popular-product-container"
);

// this function puts the product in slider in the product page
async function  putProductInSlider(product) {
  const { watchId, name, price, description, images, reviews } = product;
  const result = await checkImageAvailability(images[0].url);
  console.log(result)
  productSliderContainer.innerHTML += `
  <div class="product-slider-item" id="product-slider-item"  key=${watchId} data-watchid=${watchId}> 
      ${
        result === true
          ? `
        <img class="slider-watch-img"
        src=${images[0].url}
        alt="" />
      `
          : `
          <img class="slider-watch-img"
        src="../assets/photos/alternate-watch.svg"
        alt="" />
        `
      }
      <div id="product-slider-info" class="flex-column">
        <div id="watch-info" class="flex-column">
          <p class="product-title" id="slider-product-title">${name}</p>
          <p class="product-description text-ellipsis" id="slider-product-description">
            ${description}
          </p>
        </div>
        <div id="watch-priceInfo">
        <button class="button">Shop Now</button>
          <p style="font-weight:bold">Price:- रु ${price}</p>
        </div>
        <div id="product-customer-reviews" class="flex-center">
        <p>Customer Reviews:-</p> 
          <div style="
              display: flex;
              justify-content: center;
              align-items: center;
            ">
          ${getReviewsStarForProduct(reviews)}
        </div>
        </div>
      </div>
    </div>
  `;
  document.querySelectorAll(".product-slider-item #product-slider-info button").forEach((item) => {
    item.onclick = () => {
      setLocalStorage("selectedWatchId", item.parentElement.parentElement.parentElement.dataset.watchid);
      window.location.href = "./view.html";
    };
  })
}

// this function moves the slider forward
function sliderMoveForward() {
  const length = productSliderContainer.offsetWidth;
  productSliderContainer.scrollTo({
    left: productSliderContainer.scrollLeft + length,
    behavior: "smooth",
  });
}

// this method runs the function every 3s
setInterval(sliderMoveForward, 3000);

// this function moves slider backward
function sliderMoveBack() {
  const length = productSliderContainer.offsetWidth;
  productSliderContainer.scrollTo({
    left: productSliderContainer.scrollLeft - length,
    behavior: "smooth",
  });
}

// declaring globally so that it can be used in html file while the js type is module
window.sliderMoveBack = sliderMoveBack;
window.sliderMoveForward = sliderMoveForward;

// this function shows the newest added product
async function showNewProduct() {
  const data = await getCertainProduct(5);
   for (const item of data) {
     newProductContainer.innerHTML += await getProductCardHtml(item);
   }
}

// this function shows popular product
async function showPopularProduct(number) {
  const data = await getWatches();
  let selectedData = [];
  for (let i = 0; i < number; i++) {
    const randomNumbers = Math.floor(Math.random() * data.length);
    selectedData.push(data[randomNumbers]);
  }
   for (const item of selectedData) {
     popularProductContainer.innerHTML += await getProductCardHtml(item);
   }
}

async function main() {
  const watchData = await getWatches();
  watchData.forEach(async (product) => await putProductInSlider(product));
  await showNewProduct();
  await showPopularProduct(5);
  const productCardInfo = document.querySelectorAll(".product-info");
  productCardInfo.forEach((card) => {
    card.onclick = () => {
      setLocalStorage("selectedWatchId", card.dataset.watchid);
      window.location.href = "./view.html";
    };
  });
}

await main();

document.getElementById("slide-back").addEventListener("click", sliderMoveBack);
document
  .getElementById("slide-forward")
  .addEventListener("click", sliderMoveForward);
