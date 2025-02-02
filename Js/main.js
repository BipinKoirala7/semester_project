const searchBoxContainer = document.getElementById("search-box-container");
const cartBoxWrapper = document.getElementById("cart-box-wrapper");
const navigationOptions = document.getElementById("navigation-options");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const userInfoDialogBox = document.getElementById("user-info");

// this function is used to get watch by id from data.json where the watch data is stored
export async function getWatchById(watchId) {
  const response = await fetch("../data.json");
  const data = await response.json();
  return data.watch.filter((watch) => watch.watchId === watchId)[0];
}

// this function is used to set local storage with a certain key
export function setLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

// this function is used to get the value stored in local storage with a certain key
export function getLocalStorage(name) {
  return localStorage.getItem(name);
}

// this function is used to remove cart product from the cart collection
export function removeCartProduct(productId) {
  const prevData = JSON.parse(getLocalStorage("cartProducts"));
  const newData = prevData.filter((item) => item != productId);
  console.log(newData);
  setLocalStorage("cartProducts", JSON.stringify(newData));
  showCartBox();
  loadProductOptions();
}

// this function is used to add product to cart
export function addtoCartProduct(productId) {
  const data = JSON.parse(getLocalStorage("cartProducts"));
  data.push(productId);
  console.log(data, productId);
  setLocalStorage("cartProducts", JSON.stringify(data));
  loadProductOptions();
}

// this function is used to show cart box
async function showCartBox() {
  const data = JSON.parse(getLocalStorage("cartProducts") || "[]");
  if (data.length === 0) {
    document.getElementById("cart-box-container").innerHTML = `
    <p class="dark-description">Sorry no product is in the cart</p>
    `;
    return;
  } else {
    let cartProductHtml = ``;
    let totalPrice = 0;
    for (const cart_watchId of data) {
      const watch = await getWatchById(cart_watchId);
      const { watchId, name, price, images } = watch;
      const result = await checkImageAvailability(images[0].url);
      totalPrice += price; // Accumulate total price
      cartProductHtml += `
      <div class="cart-item">
        <div id="cart-img-container" class="flex-column flex-center">
         ${
           result === true
             ? `
        <img class="cart-product-img"
        src=${images[0].url}
        alt="" />
      `
             : `
        <img class="cart-product-img"
        src="../assets/photos/alternate-watch.svg"
        alt="" />
        `
         }
        </div>
        <div class="cart-item-info" class="flex-column flex-center">
            <p class="cart-product-title text-ellipsis">${name}</p>
            <p>Price:- रु ${price}</p>
        </div>
        <button class="close img-svg-btn cart-product-remove-btn" id="cart-product-remove-btn" data-cartId=${watchId}>
            <img src="https://s2.svgbox.net/hero-outline.svg?ic=x&&color=black" alt="">
        </button>
      </div>  
    `;
    }
    document.getElementById("cart-box-container").innerHTML = `
    <div class="product-cart-container" id="cart-product-container">
      ${cartProductHtml}
    </div>
    <div id="cart-total">
        <p style="color: var(--backgroundColor);">Total:- रु ${totalPrice}</p>
        <button class="button" id="cart-checkout-btn">Checkout</button>
    </div>
  `;
    const removeCartProductBtn = document.querySelectorAll(
      ".cart-product-remove-btn"
    );
    removeCartProductBtn.forEach((btn) => {
      btn.onclick = () => {
        console.log(
          "this button is clicked and now the cart product should be deleted"
        );
        removeCartProduct(btn.dataset.cartid);
      };
    });
  }
}

// this function is used to show nav options
function showNavOptions() {
  navigationOptions.classList.remove("animate-nav-out");
  navigationOptions.classList.add("animate-nav-in");
}

// this function is used to hide nav options
function hideNavOptions() {
  navigationOptions.classList.add("animate-nav-out");
  navigationOptions.classList.remove("animate-nav-in");
}

// this function is used open search box
function openSearchBox() {
  document.getElementById("search-box").focus();
  searchBoxContainer.classList.add("animate-in-search-box");
  searchBoxContainer.classList.remove("animate-out-search-box");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearchBox();
    } else if (e.key === "Enter") {
      search();
    }
  });
}

// this function is used to close search box
function closeSearchBox() {
  searchBoxContainer.classList.add("animate-out-search-box");
  searchBoxContainer.classList.remove("animate-in-search-box");
}

// this function is used to open cart box and then show the cart contents
async function openCartBox() {
  cartBoxWrapper.showModal();
  cartBoxWrapper.classList.remove("animate-out-cart-box");
  await showCartBox();
  cartBoxWrapper.classList.add("animate-in-cart-box");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartBox();
    }
  });
}

// this function is used to close the cart box in header
function closeCartBox() {
  cartBoxWrapper.classList.add("animate-out-cart-box");
  cartBoxWrapper.classList.remove("animate-in-cart-box");
  cartBoxWrapper.close();
}

// this function is used to open user box which either shown user info or a dialog to log In.
function openUserBox() {
  userInfoDialogBox.showModal();
  showUserOrLogin();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartBox();
    }
    if (e.key === "Enter") {
      Login();
    }
  });
}

// this function is used to close user dialog box
function closeUserBox() {
  userInfoDialogBox.close();
}

// this function used inforamation from local storage to decide what to show in the user dialog box and shows what is needed to show
function showUserOrLogin() {
  const data = JSON.parse(getLocalStorage("userInfo"));
  if (data.length == 0 || data == null) {
    document.getElementById("user-info-container").innerHTML = `
      <div id="logIn-container">
      <div id="main-wrapper" class="flex-column">
        <div id="credentials-header-container" class="flex-column flex-center">
          <p class="big-title header-font-family">Hi There!</p>
          <p class="title">Welcome to the world's biggest watch store</p>
        </div>
        <div id="credentials-wrapper" class="flex-column flex-center">
          <div id="provider-container" class="flex-column">
            <div id="google-provider" class="provider-btn flex-center">
                <img src="../assets/photos/google-color-svgrepo-com.svg" class="icon" alt="">
                <p id="title">Log in with Google</p>
            </div>
            <div id="facebook-provider" class="provider-btn flex-center">
                <img src="../assets/photos/facebook-svgrepo-com.svg" class="icon" alt="">
                <p id="title">Log in with Facebook</p>
            </div>
          </div>
          <div id="breaker" class="flex-center">
            <hr class="breaker-line">
            <p>or</p>
            <hr class="breaker-line">
          </div>
          <form onsubmit="Login()"  id="credentials-container" class="flex-column">
            <div id="username-container" class="input-container">
              <input
                type="text"
                id="username"
                class="input-box"
                required
                placeholder=" "
                min="5"
              />
              <label for="username" class="login-label" id="username-label"
                >Username
              </label>
            </div>
            <div id="email-container" class="input-container">
              <input
                type="email"
                id="email"
                class="input-box"
                required
                placeholder=" "
              />
              <label for="email" class="login-label" id="email-label"
                >Email </label
              >
            </div>
            <div id="password-container" class="input-container">
              <input
                type="password"
                id="password"
                class="input-box"
                placeholder=" "
                required
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" 
              />
              <label for="password" class="login-label" id="password-label"
                >Password</label
              >
              </div>
              <button type="submit" class="button" id="signUp-btn">Sign Up</button>
          </form>
        </div>
      </div>
      </div>
    `;
  } else {
    console.log(data);
    const { email, username } = data;
    document.getElementById("user-info-container").innerHTML = `
      <div class="user-credentials-container flex-column flex-center">
        <div class="show-credentials">
          <img src="https://s2.svgbox.net/hero-solid.svg?ic=user&&color=white" class="user-info-img" />
          <p class=" ">${username}</p>
        </div>
        <div class="show-credentials">
          <img src="https://s2.svgbox.net/hero-solid.svg?ic=mail&&color=white" class="user-info-img" />
          <p class=" ">${email}</p>
        </div>
        <button class="red-btn title" id="log-out-btn" onclick="LogOut()">Log Out</button>
      </div>
    `;
  }
}

// this function is used to login to the site
async function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const userInfo = {
    email,
    password,
    username,
  };
  setLocalStorage("userInfo", JSON.stringify(userInfo));
  window.location.reload();
}

// this function is used to log out form the site
async function LogOut() {
  setLocalStorage("userInfo", JSON.stringify([]));
  window.location.reload();
}

// this function is used to search with query for watch in site
async function search() {
  const searchQuery = document.getElementById("search-box").value;
  setLocalStorage("searchQuery", searchQuery);
  window.location.pathname = "./Html/search.html";
}

// this function extracts the watch data from data.json
export async function getWatches() {
  const response = await fetch("../data.json");
  const data = await response.json();
  return data.watch;
}

// this function is used to get certain number of products from the watches list.
export async function getCertainProduct(number) {
  const data = await getWatches();
  let certainWatches = [];
  for (let i = 0; i < number; i++) {
    certainWatches.push(data[Math.floor(Math.random() * data.length)]);
  }
  return certainWatches.splice(0, number);
}

// this function gives the ratings star a svg element according to the ratings
export function getReviewsStarForProduct(reviews) {
  let reviesHtml = ``;
  for (let i = 0; i < reviews; i++) {
    reviesHtml += `<img class="icon" src="https://s2.svgbox.net/hero-solid.svg?ic=star&&color=edc531" alt="">`;
  }
  return reviesHtml;
}

// this function alerts the user withe a message of Message Recieved
async function AlertMessage() {
  alert("Message recieved");
}

// this function uses promise to check wheather the image link actually contains image or not and returns a boolean value
export async function checkImageAvailability(url) {
  const img = new Image();
  img.src = url;
  const loadImage = () => {
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(true); // Resolve with true if loaded
      img.onerror = () => resolve(false); // Resolve with false if not loaded
    });
  };

  return await loadImage();
}

// this function is used to get the HTML for a product card with the given inforamtion
export async function getProductCardHtml(data) {
  const { watchId, name, price, images, reviews } = data;
  const result = await checkImageAvailability(images[0].url);
  console.log(result);
  return `
  <div class="product-card flex-column flex-center"  id="product-card" data-watchId="${watchId}">
    <div id="image-container" class="flex-column flex-center" style="background-color:#edede9">
      ${
        result === true
          ? `
        <img class="watch-img"
        src=${images[0].url}
        alt="" />
      `
          : `
          <img class="watch-img"
        src="../assets/photos/alternate-watch.svg"
        alt="" />
        `
      }
    </div>
    <div class="product-info flex-column flex-center" id="product-info" data-watchId="${watchId}">
      <p class="product-title text-ellipsis ">${name}</p>
      <div class="product-price-reviews">
        <p style="font-size: .8rem">Price:-<span style="font-weight:bold">रु</span> ${price}</p>
        <div style="
              display: flex;
              justify-content: center;
              align-items: center;
            ">
          ${getReviewsStarForProduct(reviews)}
        </div>
      </div>
      </div>
      <button class="button add-to-cart" id="add-to-cart" data-watchId="${watchId}">
          <img class="" src="https://s2.svgbox.net/materialui.svg?ic=add_shopping_cart&&color=black" />
      </button>
  </div>
  `;
}

// this fuunction loads the products options in the header likes of cart, search and also another user Box
async function loadProductOptions() {
  const userInfo = JSON.parse(getLocalStorage("userInfo"));
  const totalCartProducts = JSON.parse(getLocalStorage("cartProducts")).length;
  document.getElementById("options").innerHTML = `
    <button class="img-svg-btn" id="search-box-icon">
        <img src="https://s2.svgbox.net/octicons.svg?ic=search-bold&&color=white" alt="search-button" />
    </button>
    <button class="img-svg-btn" id="cart-box-icon">
        ${
          totalCartProducts
            ? `<p id="total-cart-products-num">${totalCartProducts}</p>`
            : ""
        }
        <img src="https://s2.svgbox.net/materialui.svg?ic=shopping_cart&&color=white" alt="cart" />
    </button>
    <button class="svg-p-btn" id="img-box-icon">
        <p class="text-ellipsis" style="-webkit-line-clamp:1; line-clamp:1;width:fit-content;">${
          userInfo.length == 0 ? "Log In" : userInfo.username
        }</p>
        <img class="icon" src="https://s2.svgbox.net/hero-solid.svg?ic=user&&color=white" alt="user" />
    </button>
  `;
  document.getElementById("search-box-icon").onclick = () => openSearchBox();
  document.getElementById("cart-box-icon").onclick = () => openCartBox();
  document.getElementById("img-box-icon").onclick = () => openUserBox();
}

// this function loads the footer and header in all the pages in the site
async function loadFooterAndHeader() {
  header.innerHTML = `
  <div id="main-logo-container" class="flex-center">
    <img class="img-svg-btn"
        id="open-nav-options-btn"
        src="https://s2.svgbox.net/hero-outline.svg?ic=menu&&color=white"
        alt=""
        
        />
    <img id="main-logo"
        src="https://s2.svgbox.net/illlustrations.svg?ic=apple-watch"
        alt=""
        onclick="window.location.pathname='./Html/home.html'"
        />
    <h4 onclick="window.location.pathname='./Html/home.html'" style="font-family:'Noto Serif Display'">Samayeko Sansar</h4>
  </div>
    <nav id="main-navigation">
        <a class="navigation-link" href="./home.html" style="font-size:0.9rem">Home</a>
        <a class="navigation-link" href="./product.html" style="font-size:0.9rem">Product</a>
        <a class="navigation-link" href="./research.html" style="font-size:0.9rem">Research</a>
        <a class="navigation-link" href="./blog.html" style="font-size:0.9rem">Blog</a>
        <a class="navigation-link" href="./aboutus.html" style="font-size:0.9rem">About Us</a>
        <a class="navigation-link" href="./contactus.html" style="font-size:0.9rem">Contact Us</a>
    </nav>
  <div id="options"></div>
`;

  footer.innerHTML = `
          <div id="footer-main-container">
            <div id="footer-main" class="flex-column">
                <img id="footer-logo" src="../assets/photos/footerLogo.png" alt="compnay logo" />
                <div id="footer-info" class="flex-column">
                    <div id="footer-address" class="flex-column">
                        <div style="display: flex; align-items: center;gap: .5rem;">
                            <img src="https://s2.svgbox.net/materialui.svg?ic=location_on&&color=white" alt="">
                            <p>Address:- Pokhara,Nepal</p>
                        </div>
                        <div style="display: flex; align-items: center;gap: .5rem;">
                            <img src="https://s2.svgbox.net/materialui.svg?ic=email&&color=white" alt="">
                            <p>Email:- info.samayekosansar@gmail.com</p>
                        </div>
                        <div style="display: flex; align-items: center;gap: .75rem;">
                            <img style="width: 1.25rem;"
                                src="https://s2.svgbox.net/hero-solid.svg?ic=phone&&color=white" alt="">
                            <p>Phone no:- +9771234567890</p>
                        </div>
                      </div>
                    </div>
                </div>
            <div id="footer-links-container">
                <div class="footer-links flex-column">
                  <h2>Watch</h2>
                  <p href="" class="flex-column" onclick="search('men')" style="cursor:pointer;">Men</p>
                  <p href="" class="flex-column" onclick="search('women')" style="cursor:pointer;"> Women</p>
                  <p href="" class="flex-column" onclick="search('rolex')" style="cursor:pointer;">Rolex</p>
                  <p href="" class="flex-column" onclick="search('omega')" style="cursor:pointer;">Omega</p>
                  <p href="" class="flex-column" onclick="search('patik pilliphe')" style="cursor:pointer;">Patik Pilliphe</p>
              </div>
              <div class="footer-links flex-column">
                  <h2>Explore</h2>
                  <a href=".//home.html" class="flex-column">Home</a>
                  <a href="./product.html" class="flex-column">Product</a>
                  <a href="./research.html" class="flex-column">Research</a>
                  <a href="./blog.html" class="flex-column">Blog</a>
                  <a href="./aboutus.html" class="flex-column">About Us</a>
                  <a href="./contactus.html" class="flex-column">Contact Us</a>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <h2>Connect With Us On Social Media</h2>
                <div class="media-icons">
                    <button class="img-svg-btn"
                        onclick="window.location.href='https://www.instagram.com/samayekosansar'">
                        <img src="https://s2.svgbox.net/social.svg?ic=instagram&&color=white" alt="instagram" />
                    </button>
                    <button class="img-svg-btn" onclick="window.location.href='https://www.twitter.com/samayekosansar'">
                        <img src="../assets/photos/twitter.svg" alt="">
                    </button>
                    <button class="img-svg-btn" onclick="window.location.href='https://www.youtube.com/samayekosansar'">
                        <img src="https://s2.svgbox.net/social.svg?ic=youtube&&color=white" alt="youtube" />
                    </button>
                    <button class="img-svg-btn"
                        onclick="window.location.href='https://www.facebook.com/samayekosansar'">
                        <img src="https://s2.svgbox.net/materialui.svg?ic=facebook&&color=white" alt="facebook" />
                    </button>
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid white; width: 100%;display: flex; justify-content: center; padding: 1rem;">
            <p>Samayeko Sansar Ltd. © Copyrights 2025 All Rights Reserved</p>
        </div>
`;
  loadProductOptions();
}

// this function loads dialog element for navbar, cart, search box and many other 
async function loadDialogElements() {
  searchBoxContainer.innerHTML = `
    <div id="search-box-main" class="flex-column">
        <p
          style="color: var(--secondary); font-weight: bold; padding-left: 1rem"
        >
          What you're looking for?
        </p>
        <div style="display: flex">
          <input
            id="search-box"
            type="text"
            placeholder="Enter Your Keywords......"
          />
          <button
            type="button"
            id="search-button"
            class="img-svg-btn flex-center"
            onclick="search()"
          >
            <img
              src="https://s2.svgbox.net/octicons.svg?ic=search-bold&&color=white"
              alt="search-button"
            />
          </button>
        </div>
        <button
          class="close img-svg-btn"
          id="close-search-box"
          onclick="closeSearchBox()"
        >
          <img
            src="https://s2.svgbox.net/hero-outline.svg?ic=x&&color=white"
            alt=""
          />
        </button>
      </div>
  `;
  document.getElementById("search-button").addEventListener("click", search);
  cartBoxWrapper.innerHTML = `
    <div id="cart-box-container" class=""></div>
      <button
        class="close img-svg-btn"
        id="close-cart-box"
      >
        <img
          src="https://s2.svgbox.net/hero-outline.svg?ic=x&&color=white"
          alt=""
        />
      </button
  `;
  document.getElementById("close-cart-box").onclick = () => closeCartBox();
  userInfoDialogBox.innerHTML = `
    <div id="user-info-container" class="flex-column flex-center"></div>
      <button
        class="close img-svg-btn"
        id="close-user-box"
      >
        <img
          src="https://s2.svgbox.net/hero-outline.svg?ic=x&&color=white"
          alt=""
        />
      </button>
  `;
  document.getElementById("close-user-box").onclick = () => closeUserBox();
  navigationOptions.innerHTML = `
  <div id="navigation-options-wrapper">
        <a href="./home.html " id="home" class="link navigation-link" style="width: fit-content;">Home</a>
        <a href="./product.html" id="product" class="link navigation-link" style="width: fit-content;">Product</a>
        <a href="./blog.html " id="blog" class="link navigation-link" style="width: fit-content;">Blog</a>
        <a href="./research.html" id="research" class="link navigation-link" style="width: fit-content;">Research</a>
        <a href="./aboutus.html" id="aboutus" class="link navigation-link" style="width: fit-content;">About Us</a>
        <a href="./contactus.html" id="contactus" class="link navigation-link" style="width: fit-content;">Contact Us</a>
        <img id="close-nav-options-btn" src="https://s2.svgbox.net/materialui.svg?ic=close&&color=white" alt="" class="img-svg-btn">
      </div>
  `;
  document.getElementById("open-nav-options-btn").onclick = () =>
    showNavOptions();
  document.getElementById("close-nav-options-btn").onclick = () =>
    hideNavOptions();
}

setInterval(async () => {
  const addToCart = document.querySelectorAll(".add-to-cart");
  addToCart.forEach((btn) => {
    btn.onclick = () => {
      addtoCartProduct(btn.dataset.watchid);
    };
  });
}, 1000);

// this function setdCredentials in the local storage so that the program runs without bugs related to local storage
function setCredentials() {
  const userInfo = getLocalStorage("userInfo");
  const cartProducts = getLocalStorage("cartProducts");
  const searchQuery = getLocalStorage("searchQuery");
  const selectedBlogId = getLocalStorage("selectedBlogId");
  const selectedWatchId = getLocalStorage("selectedWatchId");
  if (userInfo === null) setLocalStorage("userInfo", JSON.stringify([]));
  if (cartProducts === null)
    setLocalStorage("cartProducts", JSON.stringify([]));
  if (searchQuery === null) setLocalStorage("searchQuery", JSON.stringify(""));
  if (selectedBlogId === null)
    setLocalStorage("selectedBlogId", JSON.stringify(""));
  if (selectedWatchId === null)
    setLocalStorage("selectedWatchId", JSON.stringify(""));
}

setCredentials();
loadFooterAndHeader();
loadDialogElements();


// this is done to make the function global
window.openSearchBox = openSearchBox;
window.closeSearchBox = closeSearchBox;
window.openCartBox = openCartBox;
window.closeCartBox = closeCartBox;
window.search = search;
window.removeCartProduct = removeCartProduct;
window.addtoCartProduct = addtoCartProduct;
window.closeUserBox = closeUserBox;
window.Login = Login;
window.LogOut = LogOut;
window.getWatchById = getWatchById;
window.AlertMessage = AlertMessage;
window.showNavOptions = showNavOptions;
window.hideNavOptions = hideNavOptions;
