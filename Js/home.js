import {
  getCertainProduct,
  getProductCardHtml,
  getReviewsStarForProduct,
  setLocalStorage
} from "../Js/main.js";

const featuredProductContainer = document.getElementById(
  "featured-product-container"
);
const customerReviewContainer = document.getElementById(
  "customer-review-container"
);

// this function extracts the customer reviews from data.json
async function getCustomerReview() {
  const response = await fetch("../data.json");
  const data = await response.json();
  return data.reviews;
}

// this function shows the featured products in the home page
async function showFeaturedProducts() {
  const data = await getCertainProduct(5);
  for (const item of data) {
    featuredProductContainer.innerHTML += await getProductCardHtml(item);
  }
  const productCardInfo = document.querySelectorAll(".product-info");
  productCardInfo.forEach((card) => {
    card.onclick = () => {
      setLocalStorage("selectedWatchId", card.dataset.watchid);
      window.location.href = "./view.html";
    };
  });
}

// this function moves the customer comment
async function moveCustomerComment() {
  if (
    customerReviewContainer.scrollLeft + customerReviewContainer.clientWidth >=
    customerReviewContainer.scrollWidth
  ) {
    customerReviewContainer.scrollLeft = 0;
  } else {
    const length = customerReviewContainer.offsetWidth;
    customerReviewContainer.scrollTo({
      left: customerReviewContainer.scrollLeft + length / 2,
      behavior: "smooth",
    });
  }
}

// this function shoes customer review
async function showCustomerReviews() {
  const data = await getCustomerReview();
  data.forEach((item) => {
    const { name, review, image, comment } = item;
    customerReviewContainer.innerHTML += `
            <div class="customer-card" class="flex-column">
                <div id="customer-info-container" class="flex-column">
                    <img src="${image.url}" id="customer-img" >    
                    <p class="title">${name}</p>
                </div>
                <div id="customer-comment-container" class="flex-column">
                    <p class="dark-description text-ellipsis" id="customer-comment">${comment}</p>
                    <div style="display:flex;">
                         ${getReviewsStarForProduct(review)}
                    </div>
                </div>
            </div>
        `;
  });
}

async function main() {
  showFeaturedProducts();
  showCustomerReviews();
}

main();
setInterval(() => {
  moveCustomerComment();
}, 5000);
