// ===================================
// 1. PRODUCT DATA
// ===================================

const products = [
    {
        id: 1,
        name: "Premium Dog Food",
        category: "Dogs",
        description: "Healthy food for your dog",
        price: 899,
        oldPrice: 1199,
        rating: 4.9,
        emoji: "🐶",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Cat Food",
        category: "Cats",
        description: "Tasty nutrition for cats",
        price: 399,
        oldPrice: 499,
        rating: 4.8,
        emoji: "🐱",
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Bird Seed Mix",
        category: "Birds",
        description: "Daily food for pet birds",
        price: 249,
        oldPrice: 299,
        rating: 4.7,
        emoji: "🦜",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Fish Food",
        category: "Fish",
        description: "Nutrition for aquarium fish",
        price: 199,
        oldPrice: 249,
        rating: 4.6,
        emoji: "🐠",
        image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Dog Collar",
        category: "Accessories",
        description: "Comfortable adjustable collar",
        price: 349,
        oldPrice: 499,
        rating: 4.8,
        emoji: "🦴",
        image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Cat Toy",
        category: "Cats",
        description: "Fun toys for playful cats",
        price: 199,
        oldPrice: 299,
        rating: 4.7,
        emoji: "🧶",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Aquarium Tank",
        category: "Fish",
        description: "Create an underwater home",
        price: 1999,
        oldPrice: 2499,
        rating: 4.6,
        emoji: "🐟",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Pet Grooming Brush",
        category: "Accessories",
        description: "Keep your pet well-groomed",
        price: 299,
        oldPrice: 399,
        rating: 4.8,
        emoji: "🪮",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=80"
    }
];


// ===================================
// 2. SELECT HTML ELEMENTS
// ===================================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishCount = document.getElementById("wishCount");
const wishlistBtn = document.getElementById("wishlistBtn");

const toast = document.getElementById("toast");


// ===================================
// 3. WEBSITE STATE
// ===================================

let selectedCategory = "All";
let searchText = "";
let sortOption = "featured";

const cart = {};
const wishlist = new Set();

let toastTimer;


// ===================================
// 4. HELPER FUNCTIONS
// ===================================

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


// ===================================
// 5. DISPLAY PRODUCTS
// ===================================

function displayProducts() {

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchableText = (
            product.name + " " +
            product.category + " " +
            product.description
        ).toLowerCase();

        const matchesSearch =
            searchableText.includes(searchText.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Sort products by price
    if (sortOption === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Create product cards
    productGrid.innerHTML = filteredProducts.map(product => {

        const isWishlisted = wishlist.has(product.id);

        const discount = Math.round(
            (1 - product.price / product.oldPrice) * 100
        );

        return `
            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;font-size:65px;display:grid;place-items:center;height:100%&quot;>${product.emoji}</span>')"
                    >

                    <span class="product-badge">
                        ${discount}% OFF
                    </span>

                    <button
                        class="wishlist-product"
                        data-wishlist="${product.id}"
                        aria-label="Add ${product.name} to wishlist"
                    >
                        ${isWishlisted ? "♥" : "♡"}
                    </button>

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <div>
                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>

                        <span class="old-price">
                            ${formatPrice(product.oldPrice)}
                        </span>
                    </div>

                    <div class="rating">
                        ★★★★★
                        <span>${product.rating} / 5</span>
                    </div>

                    <button
                        class="add-cart"
                        data-add="${product.id}"
                    >
                        + Add to Cart
                    </button>

                </div>

            </div>
        `;

    }).join("");

    document.getElementById("emptyMessage").hidden =
        filteredProducts.length > 0;

    productGrid.hidden = filteredProducts.length === 0;

}


// ===================================
// 6. CATEGORY FILTER
// ===================================

function setCategory(category) {

    selectedCategory = category;

    // Update category buttons
    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === category
        );

    });

    // Update category cards
    document.querySelectorAll(".category-card").forEach(button => {

        button.classList.toggle(
            "selected",
            button.dataset.category === category
        );

    });

    displayProducts();

}


// Category cards
document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        setCategory(button.dataset.category);

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// Filter buttons
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {
        setCategory(button.dataset.category);
    });

});


// ===================================
// 7. PRODUCT SEARCH
// ===================================

searchInput.addEventListener("input", function () {

    searchText = this.value.trim();

    displayProducts();

});


// ===================================
// 8. PRODUCT SORTING
// ===================================

sortSelect.addEventListener("change", function () {

    sortOption = this.value;

    displayProducts();

});


// ===================================
// 9. ADD TO CART
// ===================================

function addToCart(productId) {

    if (cart[productId]) {
        cart[productId]++;
    } else {
        cart[productId] = 1;
    }

    updateCart();

    showToast("Product added to cart! 🐾");

}


// ===================================
// 10. PRODUCT AND WISHLIST CLICKS
// ===================================

productGrid.addEventListener("click", function (event) {

    const addButton = event.target.closest("[data-add]");

    const wishButton = event.target.closest("[data-wishlist]");

    // Add product to cart
    if (addButton) {

        const productId = Number(addButton.dataset.add);

        addToCart(productId);

    }

    // Add or remove from wishlist
    if (wishButton) {

        const productId = Number(wishButton.dataset.wishlist);

        if (wishlist.has(productId)) {

            wishlist.delete(productId);

            showToast("Removed from wishlist");

        } else {

            wishlist.add(productId);

            showToast("Added to wishlist! ♥");

        }

        wishCount.textContent = wishlist.size;

        displayProducts();

    }

});


// ===================================
// 11. UPDATE SHOPPING CART
// ===================================

function updateCart() {

    let totalQuantity = 0;
    let totalPrice = 0;

    const cartProductIds = Object.keys(cart);

    cartItems.innerHTML = "";

    if (cartProductIds.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>🛍️ Your cart is empty!</h3>
                <p>Add some lovely products for your pet.</p>
            </div>
        `;

    }

    cartProductIds.forEach(id => {

        const product = products.find(
            item => item.id === Number(id)
        );

        const quantity = cart[id];

        totalQuantity += quantity;
        totalPrice += product.price * quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${product.emoji} ${product.name}</h4>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            data-qty="${id}"
                            data-change="-1"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <strong>${quantity}</strong>

                        <button
                            data-qty="${id}"
                            data-change="1"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>
                </div>

                <button
                    class="remove-btn"
                    data-remove="${id}"
                >
                    Remove
                </button>

            </div>
        `;

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatPrice(totalPrice);

}


// ===================================
// 12. CHANGE QUANTITY / REMOVE ITEMS
// ===================================

cartItems.addEventListener("click", function (event) {

    const quantityButton = event.target.closest("[data-qty]");

    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {

        const productId = Number(quantityButton.dataset.qty);

        const change = Number(quantityButton.dataset.change);

        cart[productId] += change;

        if (cart[productId] <= 0) {
            delete cart[productId];
        }

        updateCart();

    }

    if (removeButton) {

        const productId = Number(removeButton.dataset.remove);

        delete cart[productId];

        updateCart();

        showToast("Product removed from cart");

    }

});


// ===================================
// 13. OPEN AND CLOSE CART
// ===================================

cartBtn.addEventListener("click", function () {

    cartModal.classList.add("show");

    cartModal.setAttribute("aria-hidden", "false");

});

function hideCart() {

    cartModal.classList.remove("show");

    cartModal.setAttribute("aria-hidden", "true");

}

closeCart.addEventListener("click", hideCart);


// Close when clicking outside the cart
cartModal.addEventListener("click", function (event) {

    if (event.target === cartModal) {
        hideCart();
    }

});


// Close with Escape key
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        hideCart();
    }

});


// ===================================
// 14. WISHLIST BUTTON
// ===================================

wishlistBtn.addEventListener("click", function () {

    if (wishlist.size === 0) {

        showToast("Your wishlist is empty! ♥");

        return;

    }

    selectedCategory = "All";
    searchText = "";

    searchInput.value = "";

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === "All"
        );

    });

    displayProducts();

    // Hide products that are not wishlisted
    document.querySelectorAll(".product-card").forEach(card => {

        const button = card.querySelector("[data-wishlist]");

        if (button) {

            const id = Number(button.dataset.wishlist);

            card.style.display = wishlist.has(id) ? "" : "none";

        }

    });

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

    showToast("Showing your favourite products ♥");

});


// ===================================
// 15. DEMO CHECKOUT
// ===================================


/* ==================================
   DEMO CHECKOUT + SAVE ORDER
================================== */

// ==========================================
// PET PARADISE - CHECKOUT PAGE (DEMO)
// Replace your old DEMO CHECKOUT section
// ==========================================

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const closeCheckout = document.getElementById("closeCheckout");

const demoOrdersKey = "petParadiseDemoOrders";

function renderCheckoutSummary() {
  if (!checkoutItems || !checkoutTotal) return;

  checkoutItems.innerHTML = "";

  let total = 0;
  let itemCount = 0;

  Object.entries(cart).forEach(([productId, quantity]) => {
    const product = products.find(
      (item) => String(item.id) === String(productId)
    );

    if (!product || quantity <= 0) return;

    const itemTotal = Number(product.price) * quantity;
    total += itemTotal;
    itemCount += quantity;

    const row = document.createElement("div");
    row.className = "checkout-summary-item";

    const name = document.createElement("span");
    name.textContent = `${product.name} × ${quantity}`;

    const price = document.createElement("strong");
    price.textContent = formatPrice(itemTotal);

    row.append(name, price);
    checkoutItems.appendChild(row);
  });

  if (itemCount === 0) {
    checkoutItems.textContent = "Your cart is empty.";
  }

  checkoutTotal.textContent = formatPrice(total);
}

function openCheckoutPage() {
  const hasItems = Object.values(cart).some(
    (quantity) => Number(quantity) > 0
  );

  if (!hasItems) {
    showToast("Please add a product to your cart first.");
    return;
  }

  renderCheckoutSummary();
  hideCart();
  checkoutModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Load saved customer details if available
  try {
    const savedProfile = JSON.parse(
      localStorage.getItem("petParadiseCustomerProfile") || "null"
    );

    if (savedProfile) {
      document.getElementById("checkoutName").value =
        savedProfile.name || "";

      document.getElementById("checkoutPhone").value =
        savedProfile.phone || "";
    }
  } catch (error) {
    console.warn("Could not load saved customer details.", error);
  }
}

function closeCheckoutPage() {
  checkoutModal.classList.remove("active");
  document.body.style.overflow = "";
}

if (closeCheckout) {
  closeCheckout.addEventListener("click", closeCheckoutPage);
}

if (checkoutModal) {
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckoutPage();
    }
  });
}

// Open checkout from the existing cart button
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openCheckoutPage();
  });
}

// Submit demo order
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("checkoutName").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const address = document.getElementById("checkoutAddress").value.trim();
    const paymentMethod =
      document.getElementById("checkoutPayment").value;

    if (!name || !phone || !address) {
      showToast("Please fill in all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }

    const orderItems = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find(
          (item) => String(item.id) === String(productId)
        );

        if (!product || Number(quantity) <= 0) return null;

        return {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: Number(quantity),
          image: product.image || "",
          emoji: product.emoji || ""
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      showToast("Your cart is empty.");
      closeCheckoutPage();
      return;
    }

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      id: "PP" + Date.now().toString().slice(-8),
      date: new Date().toLocaleString("en-IN"),
      customer: {
        name,
        phone,
        address
      },
      paymentMethod,
      items: orderItems,
      total,
      status: "Demo Order Placed"
    };

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem(demoOrdersKey) || "[]"
      );

      existingOrders.unshift(order);

      localStorage.setItem(
        demoOrdersKey,
        JSON.stringify(existingOrders)
      );

      // Clear the cart after the demo order is saved
     // Clear cart after saving the demo order
Object.keys(cart).forEach((key) => delete cart[key]);

updateCart();
closeCheckoutPage();
checkoutForm.reset();

// Show order success page
showOrderSuccess(order);
    } catch (error) {
      console.error("Could not save demo order:", error);
      showToast("Could not save the demo order. Please try again.");
    }
  });
}
// ===================================
// 17. MOBILE NAVIGATION
// ===================================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", function () {

    navbar.classList.toggle("open");

});

// Close mobile menu after clicking a link
navbar.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", function () {

        navbar.classList.remove("open");

    });

});


// ===================================
// 18. RESET SEARCH
// ===================================

document.getElementById("resetBtn").addEventListener("click", function () {

    searchInput.value = "";

    searchText = "";

    sortOption = "featured";

    sortSelect.value = "featured";

    setCategory("All");

});


// ===================================
// 19. CURRENT YEAR
// ===================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ===================================
// 20. INITIALIZE WEBSITE
// ===================================

displayProducts();

updateCart();

/* =====================================
   PET PARADISE LOGIN / SIGNUP SYSTEM
===================================== */

const authScreen = document.getElementById("authScreen");
const authForm = document.getElementById("authForm");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authSubmit = document.getElementById("authSubmit");

const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authConfirm = document.getElementById("authConfirm");

const nameField = document.getElementById("nameField");
const confirmField = document.getElementById("confirmField");

const authError = document.getElementById("authError");
const authSwitchPrompt = document.getElementById("authSwitchPrompt");
const authSwitchButton = document.getElementById("authSwitchButton");

let authMode = "login";


// Show login or signup form

function setAuthMode(mode) {

    authMode = mode;

    const isSignup = mode === "signup";

    loginTab.classList.toggle("active", !isSignup);
    signupTab.classList.toggle("active", isSignup);

    nameField.hidden = !isSignup;
    confirmField.hidden = !isSignup;

    authName.required = isSignup;
    authConfirm.required = isSignup;

    authPassword.autocomplete =
        isSignup ? "new-password" : "current-password";

    authTitle.textContent =
        isSignup ? "Create Account 🐾" : "Welcome Back! 👋";

    authSubtitle.textContent =
        isSignup
            ? "Join our happy family of pet lovers."
            : "Login to continue your pet shopping journey.";

    authSubmit.textContent =
        isSignup ? "Create My Account →" : "Login to Continue →";

    authSwitchPrompt.textContent =
        isSignup ? "Already have an account?" : "New to Pet Paradise?";

    authSwitchButton.textContent =
        isSignup ? "Login here" : "Create an account";

    authError.textContent = "";

    authPassword.value = "";
    authConfirm.value = "";
}


// Login / Signup tabs

loginTab.addEventListener("click", () => {
    setAuthMode("login");
});

signupTab.addEventListener("click", () => {
    setAuthMode("signup");
});

authSwitchButton.addEventListener("click", () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
});


// Show the homepage after demo login

function enterPetParadise() {

    sessionStorage.setItem("petParadiseDemoLogin", "true");

    authScreen.hidden = true;

    authError.textContent = "";

    showLogoutButton();
}


// Validate the form

authForm.addEventListener("submit", function(event) {

    event.preventDefault();

    authError.textContent = "";

    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!authForm.checkValidity()) {
        authForm.reportValidity();
        return;
    }

    if (authMode === "signup") {

        const name = authName.value.trim();
        const confirmPassword = authConfirm.value;

        if (name.length < 2) {
            authError.textContent =
                "Please enter your full name.";
            return;
        }

        if (password.length < 6) {
            authError.textContent =
                "Password must be at least 6 characters.";
            return;
        }

        if (password !== confirmPassword) {
            authError.textContent =
                "Passwords do not match. Please try again.";
            return;
        }

        // Frontend demo only; no real account is created.
        enterPetParadise();

        showToast("Welcome to Pet Paradise, " + name + "! 🐾");

    } else {

        if (password.length < 6) {
            authError.textContent =
                "Password must be at least 6 characters.";
            return;
        }

        // Demo login: accepts any valid email and password.
        // Real authentication requires a secure backend.
        enterPetParadise();

        showToast("Login successful! Welcome back 🐾");

    }

});


// Add Logout button to existing navbar


function showLogoutButton() {
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions) return;

    // Remove previously created account buttons
    document.getElementById("accountDropdown")?.remove();
    document.getElementById("profileBtn")?.remove();
    document.getElementById("myOrdersBtn")?.remove();
    document.getElementById("logoutBtn")?.remove();

    const dropdown = document.createElement("div");
    dropdown.id = "accountDropdown";
    dropdown.className = "account-dropdown";

    dropdown.innerHTML = `
        <button type="button" class="account-btn"
                id="accountBtn" aria-expanded="false">
            👤 My Account <span>⌄</span>
        </button>
        <div class="account-menu" id="accountMenu" hidden>
            <button type="button" id="myOrdersBtn">📦 My Orders</button>
            <button type="button" id="profileBtn">👤 My Profile</button>
            <button type="button" id="logoutBtn" class="account-logout">🚪 Logout</button>
        </div>
    `;

    headerActions.appendChild(dropdown);

    const accountBtn = dropdown.querySelector("#accountBtn");
    const accountMenu = dropdown.querySelector("#accountMenu");

    accountBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        accountMenu.hidden = !accountMenu.hidden;
        accountBtn.setAttribute("aria-expanded", String(!accountMenu.hidden));
    });

    dropdown.querySelector("#myOrdersBtn").addEventListener("click", function () {
        accountMenu.hidden = true;
        openOrdersModal();
    });

    dropdown.querySelector("#profileBtn").addEventListener("click", function () {
        accountMenu.hidden = true;
        openCustomerProfile();
    });

    dropdown.querySelector("#logoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("petParadiseDemoLogin");
        dropdown.remove();

        authScreen.hidden = false;
        authForm.reset();
        setAuthMode("login");
        window.scrollTo(0, 0);
    });

    document.addEventListener("click", function closeAccountMenu(event) {
        if (!dropdown.isConnected) {
            document.removeEventListener("click", closeAccountMenu);
            return;
        }

        if (!dropdown.contains(event.target)) {
            accountMenu.hidden = true;
            accountBtn.setAttribute("aria-expanded", "false");
        }
    });
}



// Restore demo session on page refresh

if (sessionStorage.getItem("petParadiseDemoLogin") === "true") {

    authScreen.hidden = true;

    showLogoutButton();

} else {

    authScreen.hidden = false;

    setAuthMode("login");

}

/* PRODUCT DETAILS FUNCTIONALITY */

const detailsModal = document.getElementById("productDetailsModal");
const closeDetails = document.getElementById("closeProductDetails");

const detailsImage = document.getElementById("detailsImage");
const detailsName = document.getElementById("detailsName");
const detailsCategory = document.getElementById("detailsCategory");
const detailsRating = document.getElementById("detailsRating");
const detailsDescription = document.getElementById("detailsDescription");
const detailsPrice = document.getElementById("detailsPrice");
const detailsOldPrice = document.getElementById("detailsOldPrice");
const detailsQuantity = document.getElementById("detailsQuantity");

let currentDetailsProduct = null;
let selectedDetailsQuantity = 1;


// Add a View Details button to each product card
const detailsStyle = document.createElement("style");

detailsStyle.textContent = `
    .view-details-btn {
        width: 100%;
        margin-top: 8px;
        padding: 9px;
        border: 1px solid #086548;
        border-radius: 8px;
        background: white;
        color: #086548;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
    }

    .view-details-btn:hover {
        background: #eaf5ed;
    }
`;

document.head.appendChild(detailsStyle);


// Add button whenever product cards are rendered
const originalDisplayProducts = displayProducts;

displayProducts = function() {

    originalDisplayProducts();

    document.querySelectorAll(".product-card").forEach(card => {

        if (card.querySelector(".view-details-btn")) return;

        const addButton = card.querySelector("[data-add]");
        if (!addButton) return;

        const productId = Number(addButton.dataset.add);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "view-details-btn";
        button.textContent = "View Details";

        button.addEventListener("click", () => {
            openProductDetails(productId);
        });

        addButton.insertAdjacentElement("afterend", button);

    });

};


// Open details for selected product
function openProductDetails(productId) {

    currentDetailsProduct = products.find(
        product => product.id === productId
    );

    if (!currentDetailsProduct) return;

    selectedDetailsQuantity = 1;

    const product = currentDetailsProduct;

    detailsImage.src = product.image;
    detailsImage.alt = product.name;
    detailsName.textContent = product.name;
    detailsCategory.textContent = product.category;
    detailsRating.textContent = product.rating + " / 5";
    detailsDescription.textContent = product.description;
    detailsPrice.textContent = formatPrice(product.price);
    detailsOldPrice.textContent = formatPrice(product.oldPrice);
    detailsQuantity.textContent = selectedDetailsQuantity;

    detailsModal.classList.add("show");
    detailsModal.setAttribute("aria-hidden", "false");

}


// Quantity minus
document.getElementById("detailsMinus").addEventListener("click", () => {

    if (selectedDetailsQuantity > 1) {
        selectedDetailsQuantity--;
        detailsQuantity.textContent = selectedDetailsQuantity;
    }

});


// Quantity plus
document.getElementById("detailsPlus").addEventListener("click", () => {

    if (selectedDetailsQuantity < 99) {
        selectedDetailsQuantity++;
        detailsQuantity.textContent = selectedDetailsQuantity;
    }

});


// Add selected quantity to existing cart
document.getElementById("detailsAddCart").addEventListener("click", () => {

    if (!currentDetailsProduct) return;

    const id = currentDetailsProduct.id;

    cart[id] = (cart[id] || 0) + selectedDetailsQuantity;

    updateCart();

    detailsModal.classList.remove("show");
    detailsModal.setAttribute("aria-hidden", "true");

    showToast("Added " + selectedDetailsQuantity + " item(s) to cart! 🐾");

});


// Close details
closeDetails.addEventListener("click", () => {

    detailsModal.classList.remove("show");
    detailsModal.setAttribute("aria-hidden", "true");

});

detailsModal.addEventListener("click", event => {

    if (event.target === detailsModal) {
        detailsModal.classList.remove("show");
        detailsModal.setAttribute("aria-hidden", "true");
    }

});


// Close details with Escape
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        detailsModal.classList.remove("show");
        detailsModal.setAttribute("aria-hidden", "true");
    }

});

/* ==================================
   CUSTOMER PROFILE - DEMO
================================== */

const profileModal = document.getElementById("profileModal");
const profileForm = document.getElementById("profileForm");
const closeProfile = document.getElementById("closeProfile");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileMessage = document.getElementById("profileMessage");

const PROFILE_KEY = "petParadiseCustomerProfile";

// Load profile from this browser
function loadCustomerProfile() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(PROFILE_KEY) || "{}"
        );

        profileName.value = saved.name || "";
        profileEmail.value = saved.email || "";
        profilePhone.value = saved.phone || "";
    } catch (error) {
        console.error("Could not load profile:", error);
    }
}

// Open profile
function openCustomerProfile() {
    loadCustomerProfile();

    profileMessage.textContent = "";
    profileModal.classList.add("show");
    profileModal.setAttribute("aria-hidden", "false");
}

// Close profile
function hideCustomerProfile() {
    profileModal.classList.remove("show");
    profileModal.setAttribute("aria-hidden", "true");
}

closeProfile.addEventListener("click", hideCustomerProfile);

profileModal.addEventListener("click", function (event) {
    if (event.target === profileModal) {
        hideCustomerProfile();
    }
});

// Add My Profile button to existing navbar
const headerActions = document.querySelector(".header-actions");

if (headerActions && !document.getElementById("profileBtn")) {
    const profileBtn = document.createElement("button");

    profileBtn.id = "profileBtn";
    profileBtn.type = "button";
    profileBtn.textContent = "👤 My Profile";
    profileBtn.title = "My Profile";

    profileBtn.addEventListener("click", openCustomerProfile);

    headerActions.prepend(profileBtn);
}

// Save profile
profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!profileForm.checkValidity()) {
        profileForm.reportValidity();
        return;
    }

    const profile = {
        name: profileName.value.trim(),
        email: profileEmail.value.trim(),
        phone: profilePhone.value.trim()
    };

    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

        profileMessage.textContent = "Profile saved successfully! 🐾";

        if (typeof showToast === "function") {
            showToast("Profile saved successfully!");
        }
    } catch (error) {
        profileMessage.textContent =
            "Could not save profile in this browser.";
        console.error(error);
    }
});

// Close profile with Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        hideCustomerProfile();
    }
});

/* ==================================
   MY ORDERS - DEMO
================================== */

const ordersModal = document.getElementById("ordersModal");
const closeOrders = document.getElementById("closeOrders");
const ordersList = document.getElementById("ordersList");

const ORDERS_KEY = "petParadiseDemoOrders";

function getDemoOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Unable to read orders:", error);
        return [];
    }
}

function renderDemoOrders() {
    const orders = getDemoOrders();

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="orders-empty">
                <div style="font-size:42px;">📦</div>
                <h3>No orders yet</h3>
                <p>Your demo orders will appear here after checkout.</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = orders.map(order => {
        const productsHTML = order.items.map(item => `
            <div>
                ${escapeOrderText(item.name)}
                × ${Number(item.quantity) || 1}
            </div>
        `).join("");

        return `
            <article class="order-card">
                <div class="order-card-top">
                    <h3>Order #${escapeOrderText(order.id)}</h3>
                    <span class="order-status">
                        ${escapeOrderText(order.status)}
                    </span>
                </div>

                <p class="order-date">
                    ${escapeOrderText(order.date)}
                </p>

                <div class="order-products">
                    ${productsHTML}
                </div>

                <div class="order-card-bottom">
                    <span>Total Amount</span>
                    <span class="order-total">
                        ₹${(Number(order.total) || 0).toLocaleString("en-IN")}
                    </span>
                </div>
                <button
  type="button"
  class="order-view-details"
  data-order-id="${escapeOrderText(order.id)}"
>
  View Details →
</button>
            </article>
        `;
    }).join("");
}

// Escape user-controlled text before adding it to HTML
function escapeOrderText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function openOrdersModal() {
    renderDemoOrders();
    ordersModal.classList.add("show");
    ordersModal.setAttribute("aria-hidden", "false");
}

function hideOrdersModal() {
    ordersModal.classList.remove("show");
    ordersModal.setAttribute("aria-hidden", "true");
}

/* =====================================
   ORDER DETAILS - DEMO
===================================== */

const orderDetailsModal = document.getElementById("orderDetailsModal");
const orderDetailsContent = document.getElementById("orderDetailsContent");
const closeOrderDetails = document.getElementById("closeOrderDetails");
const backToMyOrders = document.getElementById("backToMyOrders");

function renderOrderTimeline(order) {
  const stages = [
    "Demo Order Placed",
    "Processing",
    "Shipped",
    "Delivered"
  ];

  const currentStage = stages.indexOf(order.status);
  const activeStage = currentStage === -1 ? 0 : currentStage;

  return `
    <div class="order-detail-card">
      <h3>🚚 Order Progress</h3>

      <div class="demo-order-timeline">
        ${stages.map((stage, index) => `
          <div class="demo-timeline-step ${
            index <= activeStage ? "completed" : ""
          }">
            <div class="demo-timeline-marker">
              ${index < activeStage ? "✓" : index + 1}
            </div>
            <div>
              <strong>${escapeOrderText(stage)}</strong>
              <p>${
                index < activeStage
                  ? "Demo stage completed"
                  : index === activeStage
                    ? "Current demo stage"
                    : "Not reached yet"
              }</p>
            </div>
          </div>
        `).join("")}
      </div>

      ${
        activeStage < stages.length - 1
          ? `<button
               type="button"
               class="order-view-details"
               data-order-progress="${escapeOrderText(order.id)}"
             >
               Advance Demo Status →
             </button>`
          : `<p><strong>Demo delivery completed!</strong></p>`
      }

      <p class="demo-timeline-note">
        Demo only — this is not live courier tracking.
      </p>
    </div>
  `;
}

function openOrderDetails(orderId) {

  const orders = getDemoOrders();

  const order = orders.find(
    item => String(item.id) === String(orderId)
  );

  if (!order) {
    showToast("Order details not found.");
    return;
  }

  const safe = escapeOrderText;

  const itemsHTML = (Array.isArray(order.items) ? order.items : [])
    .map(item => {
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;

      return `
        <div class="order-detail-product">
          <div>
            <div class="order-detail-product-name">
              ${safe(item.name)}
            </div>
            <div class="order-detail-product-meta">
              ₹${price.toLocaleString("en-IN")} × ${quantity}
            </div>
          </div>
          <strong>
            ₹${(price * quantity).toLocaleString("en-IN")}
          </strong>
        </div>
      `;
    })
    .join("");

  const customer = order.customer || {};

  orderDetailsContent.innerHTML = `
    <div class="order-detail-card">
      <h3>Order Information</h3>

      <div class="order-detail-row">
        <span>Order ID</span>
        <strong>${safe(order.id)}</strong>
      </div>
${renderOrderTimeline(order)}
      <div class="order-detail-row">
        <span>Order Date</span>
        <strong>${safe(order.date)}</strong>
      </div>

      <div class="order-detail-row">
        <span>Status</span>
        <strong>${safe(order.status)}</strong>
      </div>

      <div class="order-detail-row">
        <span>Payment Method</span>
        <strong>${safe(order.paymentMethod)}</strong>
      </div>
    </div>

    <div class="order-detail-card">
      <h3>Products Ordered</h3>
      <div class="order-detail-products">
        ${itemsHTML || "<p>No product details available.</p>"}
      </div>

      <div class="order-detail-row">
        <strong>Total Amount</strong>
        <span class="order-detail-total">
          ₹${(Number(order.total) || 0).toLocaleString("en-IN")}
        </span>
      </div>
    </div>

    <div class="order-detail-card">
      <h3>Delivery Information</h3>

      <div class="order-detail-row">
        <span>Customer</span>
        <strong>${safe(customer.name || "Not available")}</strong>
      </div>

      <div class="order-detail-row">
        <span>Phone</span>
        <strong>${safe(customer.phone || "Not available")}</strong>
      </div>

      <div class="order-detail-row">
        <span>Address</span>
        <strong>${safe(customer.address || "Not available")}</strong>
      </div>
    </div>
  `;

  hideOrdersModal();

  orderDetailsModal.classList.add("show");
  orderDetailsModal.setAttribute("aria-hidden", "false");
}

function hideOrderDetails() {
  orderDetailsModal.classList.remove("show");
  orderDetailsModal.setAttribute("aria-hidden", "true");
}

// View Details button click
ordersList.addEventListener("click", function (event) {
  const button = event.target.closest(".order-view-details");

  if (!button) return;

  openOrderDetails(button.dataset.orderId);
});
orderDetailsContent.addEventListener("click", function (event) {
  const button = event.target.closest("[data-order-progress]");

  if (!button) return;

  const orderId = button.dataset.orderProgress;
  const stages = [
    "Demo Order Placed",
    "Processing",
    "Shipped",
    "Delivered"
  ];

  const orders = getDemoOrders();

  const order = orders.find(
    item => String(item.id) === String(orderId)
  );

  if (!order) {
    showToast("Order not found.");
    return;
  }

  const currentIndex = stages.indexOf(order.status);
  const nextIndex = Math.min(
    (currentIndex === -1 ? 0 : currentIndex) + 1,
    stages.length - 1
  );

  order.status = stages[nextIndex];

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    openOrderDetails(orderId);
    showToast("Demo order status updated!");
  } catch (error) {
    console.error("Could not update demo order:", error);
    showToast("Unable to update demo status.");
  }
});


// Close details
closeOrderDetails.addEventListener("click", hideOrderDetails);

// Back to My Orders
backToMyOrders.addEventListener("click", function () {
  hideOrderDetails();
  openOrdersModal();
});

// Close by clicking outside the details panel
orderDetailsModal.addEventListener("click", function (event) {
  if (event.target === orderDetailsModal) {
    hideOrderDetails();
  }
});

// Close with Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    hideOrderDetails();
  }
});

closeOrders.addEventListener("click", hideOrdersModal);

ordersModal.addEventListener("click", function (event) {
    if (event.target === ordersModal) {
        hideOrdersModal();
    }
});

// Add My Orders button to navbar
const ordersHeaderActions = document.querySelector(".header-actions");

if (
    ordersHeaderActions &&
    !document.getElementById("myOrdersBtn")
) {
    const myOrdersBtn = document.createElement("button");

    myOrdersBtn.id = "myOrdersBtn";
    myOrdersBtn.type = "button";
    myOrdersBtn.textContent = "📦 My Orders";

    myOrdersBtn.addEventListener("click", openOrdersModal);

    ordersHeaderActions.prepend(myOrdersBtn);
}

// ==========================================
// ORDER SUCCESS MODAL
// ==========================================

const orderSuccessModal = document.getElementById("orderSuccessModal");

function showOrderSuccess(order) {
  if (!orderSuccessModal || !order) return;

  document.getElementById("successOrderId").textContent = order.id;
  document.getElementById("successCustomerName").textContent =
    order.customer.name;

  document.getElementById("successOrderTotal").textContent =
    formatPrice(order.total);

  document.getElementById("successPaymentMethod").textContent =
    order.paymentMethod;

  document.getElementById("successDeliveryAddress").textContent =
    order.customer.address;

  orderSuccessModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function hideOrderSuccess() {
  if (!orderSuccessModal) return;

  orderSuccessModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Continue Shopping button
document
  .getElementById("successContinueShopping")
  ?.addEventListener("click", () => {
    hideOrderSuccess();

    // Scroll to the top of the shop page
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

// View My Orders button
document
  .getElementById("successViewOrders")
  ?.addEventListener("click", () => {
    hideOrderSuccess();

    if (typeof openOrdersModal === "function") {
      openOrdersModal();
    } else {
      showToast("Please add the My Orders feature first.");
    }
  });

// Close success modal when clicking its background
orderSuccessModal?.addEventListener("click", (event) => {
  if (event.target === orderSuccessModal) {
    hideOrderSuccess();
  }
});

/* =====================================
   ADMIN ORDER MANAGEMENT - DEMO ONLY
===================================== */

const adminOrdersPanel = document.getElementById("adminOrdersPanel");
const adminOrdersList = document.getElementById("adminOrdersList");

const adminStatusOptions = [
  "Demo Order Placed",
  "Processing",
  "Shipped",
  "Delivered"
];

function renderAdminOrders() {
  const orders = getDemoOrders();

  document.getElementById("adminTotalOrders").textContent =
    orders.length;

  document.getElementById("adminProcessingOrders").textContent =
    orders.filter(order => order.status === "Processing").length;

  document.getElementById("adminShippedOrders").textContent =
    orders.filter(order => order.status === "Shipped").length;

  document.getElementById("adminDeliveredOrders").textContent =
    orders.filter(order => order.status === "Delivered").length;

  const search = document
    .getElementById("adminOrderSearch")
    .value.trim()
    .toLowerCase();

  const filter = document.getElementById("adminOrderFilter").value;

  const filteredOrders = orders.filter(order => {
    const customer = order.customer || {};

    const matchesSearch = [
      order.id,
      customer.name,
      customer.phone
    ].some(value =>
      String(value || "").toLowerCase().includes(search)
    );

    return matchesSearch &&
      (filter === "all" || order.status === filter);
  });

  if (!filteredOrders.length) {
    adminOrdersList.innerHTML = `
      <div class="admin-empty">
        <h3>No orders found</h3>
        <p>Try another search or create a demo order.</p>
      </div>
    `;
    return;
  }

  adminOrdersList.innerHTML = filteredOrders.map(order => {
    const safe = escapeOrderText;
    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const itemsHTML = items.map(item => `
      <p>
        ${safe(item.name)} × ${Number(item.quantity) || 1}
      </p>
    `).join("");

    const statusOptions = adminStatusOptions.map(status => `
      <option value="${safe(status)}"
        ${order.status === status ? "selected" : ""}>
        ${safe(status)}
      </option>
    `).join("");

    return `
      <article class="admin-order-card">
        <div class="admin-order-card-header">
          <div>
            <h3>Order #${safe(order.id)}</h3>
            <span>${safe(order.date)}</span>
          </div>
          <strong>
            ₹${(Number(order.total) || 0).toLocaleString("en-IN")}
          </strong>
        </div>

        <p><strong>Customer:</strong> ${safe(customer.name || "N/A")}</p>
        <p><strong>Phone:</strong> ${safe(customer.phone || "N/A")}</p>
        <p><strong>Address:</strong> ${safe(customer.address || "N/A")}</p>
        <p><strong>Payment:</strong> ${safe(order.paymentMethod || "N/A")}</p>

        <div class="admin-order-items">
          <strong>Products</strong>
          ${itemsHTML || "<p>No items recorded.</p>"}
        </div>

        <div class="admin-order-card-footer">
          <label>
            Status:
            <select data-admin-status="${safe(order.id)}">
              ${statusOptions}
            </select>
          </label>

          <button type="button" data-admin-save="${safe(order.id)}">
            Save Status
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function openAdminOrders() {
  console.log("Admin Demo button clicked!");

  if (!adminOrdersPanel) {
    console.error('HTML element with id="adminOrdersPanel" not found.');
    alert("Admin panel HTML missing! Check index.html.");
    return;
  }

  const requiredIds = [
    "adminTotalOrders",
    "adminProcessingOrders",
    "adminShippedOrders",
    "adminDeliveredOrders",
    "adminOrderSearch",
    "adminOrderFilter",
    "adminOrdersList"
  ];

  const missingIds = requiredIds.filter(
    id => !document.getElementById(id)
  );

  if (missingIds.length > 0) {
    console.error("Missing HTML IDs:", missingIds);
    alert("Admin panel HTML IDs missing. Check Console (F12).");
    return;
  }

  try {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (header) header.hidden = true;
    if (footer) footer.hidden = true;

    adminOrdersPanel.hidden = false;
    adminOrdersPanel.style.display = "block";

    renderAdminOrders();

    window.scrollTo({ top: 0, behavior: "smooth" });

    console.log("Admin panel opened successfully!");
  } catch (error) {
    console.error("Admin panel opening error:", error);
    alert("Admin panel error! Press F12 and check Console.");
  }
}
function closeAdminOrdersPanel() {
  adminOrdersPanel.hidden = true;
  document.querySelector("header").hidden = false;
  document.querySelector("footer").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("closeAdminOrders")
  .addEventListener("click", closeAdminOrdersPanel);

document.getElementById("adminOrderSearch")
  .addEventListener("input", renderAdminOrders);

document.getElementById("adminOrderFilter")
  .addEventListener("change", renderAdminOrders);

adminOrdersList.addEventListener("click", function(event) {
  const button = event.target.closest("[data-admin-save]");

  if (!button) return;

  const orderId = button.dataset.adminSave;
  const select = adminOrdersList.querySelector(
    `[data-admin-status="${CSS.escape(orderId)}"]`
  );

  const orders = getDemoOrders();
  const order = orders.find(
    item => String(item.id) === String(orderId)
  );

  if (!order || !select) {
    showToast("Order not found.");
    return;
  }

  order.status = select.value;

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    renderAdminOrders();
    showToast("Demo order status updated!");
  } catch (error) {
    console.error(error);
    showToast("Could not save the status.");
  }
});

// Add demo admin access button to navbar
const adminHeaderActions = document.querySelector(".header-actions");

if (
  adminHeaderActions &&
  !document.getElementById("demoAdminBtn")
) {
  const adminButton = document.createElement("button");

  adminButton.id = "demoAdminBtn";
  adminButton.type = "button";
  adminButton.textContent = "⚙️ Admin Demo";

  adminButton.addEventListener("click", openAdminOrders);
  adminHeaderActions.appendChild(adminButton);
}
