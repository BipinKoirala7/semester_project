import {
  addtoCartProduct,
  checkImageAvailability,
  getLocalStorage,
  getReviewsStarForProduct,
  getWatchById,
} from "../Js/main.js";

const viewWrapper = document.getElementById("view-wrapper");

async function main() {
  const watchId = getLocalStorage("selectedWatchId");
  const data = await getWatchById(watchId);
  console.log(data);
  const { images, name, brand, price, description, reviews } = data;
  const result = await checkImageAvailability(images[0].url);
  viewWrapper.innerHTML = `
         <div id="product-wrapper" class="">
          <div id="view-product-img-container" class="flex-center">
             ${
               result === true
                 ? `
                <img class="view-watch-img"
                src=${images[0].url}
                alt="" />
                  `
                 : `
                  <img class="view-watch-img"
                src="../assets/photos/alternate-watch.svg"
                alt="" />
            `
             }
          </div>
          <div id="view-product-info-container" class="flex-column">
            <div id="main-info" class="flex-column">
              <p id="brand-name">${brand}</p>
              <p class="big-title">${name}</p>
              <div id="customer-review">${getReviewsStarForProduct(
                reviews
              )}</div>
            </div>
            <p id="price" class="title"><span style="font-weight:bold">रु</span> ${price}</p>
            <div id="size-option-container" class="">
              <p>Size:</p>
              <div class="flex-column flex-center select-container">
                <select
                  name="size"
                  id="size-option-select"
                  class="option-select"
                >
                  <option class="option-value" value="small">Small (20mm - 29mm)</option>
                  <option class="option-value" value="medium">Medium (30mm - 35mm)</option>
                  <option class="option-value" value="large">Large (36mm - 46mm)</option>
                  <option class="option-value" value="oversized">Oversized (>46mm)</option>
                </select>
              </div>
            </div>
            <div id="color-option-container" class="">
              <p>Color :</p>
              <div
                id=""
                class="flex-column flex-center select-container"
              >
                <select
                  name="color"
                  id="color-option-select"
                  class="option-select"
                  
                >
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="grey">Grey</option>
                </select>
              </div>
            </div>
            <div id="view-product-btn-container" class="flex-column">
              <button type="button" id="view-add-to-cart" class="title">Add To Cart</button>
              <div id="delivery-info-container">
                <img
                  src="https://s2.svgbox.net/materialui.svg?ic=delivery_dining"
                  alt=""
                  class="icon"
                />
                <p id="delivery-info">NPR 500 is charged for delivery</p>
              </div>
            </div>
            <div id="view-description-container" class="flex-column">
              <p class="title">Description</p>
              <p id="description">
                ${description}
              </p>
            </div>
          </div>
        </div>
    `;
  document.querySelector("#view-add-to-cart").addEventListener("click", () => {
    addtoCartProduct(watchId);
  });
}

await main();
