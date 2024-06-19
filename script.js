"use strict";

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const checkoutButton = document.getElementById("checkout-button");
  const cartIcon = document.getElementById("cart-icon");

  
  cartIcon.addEventListener("click", function () {
    cartItemsContainer.style.display = cartItemsContainer.style.display === "block" ? "none" : "block";
  });

  const addToCartButtonsDOM = document.querySelectorAll('[data-action="add-to-cart"]');
  const cartDOM = document.querySelector(".cart-items");

  if (cart.length > 0) {
    cart.forEach(cartItem => {
      const product = cartItem;
      insertItemToDOM(product);
      countCartTotal();

      addToCartButtonsDOM.forEach(addToCartButtonDOM => {
        const productDOM = addToCartButtonDOM.parentNode;

        if (productDOM.querySelector("h3").innerText === product.name) {
          handleActionButtons(addToCartButtonDOM, product);
        }
      });
    });
  }

  addToCartButtonsDOM.forEach(addToCartButtonDOM => {
    addToCartButtonDOM.addEventListener("click", () => {
      const productDOM = addToCartButtonDOM.parentNode;
      const product = {
        image: productDOM.querySelector("img").getAttribute("src"),
        name: productDOM.querySelector("h3").innerText,
        price: parseFloat(productDOM.querySelector("p").innerText.replace('R', '').replace('per kg', '').trim()),
        quantity: 1
      };

      const isInCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;

      if (!isInCart) {
        insertItemToDOM(product);
        cart.push(product);
        saveCart();
        handleActionButtons(addToCartButtonDOM, product);
      }
    });
  });

  function insertItemToDOM(product) {
    const cartItemHTML = `
      <li class="cart-item">
        <img class="cart-item-image" src="R{product.image}" alt="${product.name}" />
        <h2 class="cart-item-name">${product.name}</h2>
        <h3 class="cart-item-price">R${product.price.toFixed(2)}</h3>
        <button class="btn btn-primary btn-small" data-action="decrease-item">&minus;</button>
        <h3 class="cart-item-quantity">${product.quantity}</h3>
        <button class="btn btn-primary btn-small" data-action="increase-item">&plus;</button>
        <button class="btn btn-primary btn-small" data-action="remove-item">&times;</button>
      </li>
    `;
    cartDOM.querySelector("ul").insertAdjacentHTML("beforeend", cartItemHTML);
    addCartFooter();
  }

  function handleActionButtons(addToCartButtonDOM, product) {
    addToCartButtonDOM.innerText = "In Cart";
    addToCartButtonDOM.disabled = true;

    const cartItemsDOM = cartDOM.querySelectorAll(".cart-item");
    cartItemsDOM.forEach(cartItemDOM => {
      if (cartItemDOM.querySelector(".cart-item-name").innerText === product.name) {
        cartItemDOM.querySelector('[data-action="increase-item"]').addEventListener("click", () => increaseItem(product, cartItemDOM));
        cartItemDOM.querySelector('[data-action="decrease-item"]').addEventListener("click", () => decreaseItem(product, cartItemDOM, addToCartButtonDOM));
        cartItemDOM.querySelector('[data-action="remove-item"]').addEventListener("click", () => removeItem(product, cartItemDOM, addToCartButtonDOM));
      }
    });
  }

  function increaseItem(product, cartItemDOM) {
    cart.forEach(cartItem => {
      if (cartItem.name === product.name) {
        cartItemDOM.querySelector(".cart-item-quantity").innerText = ++cartItem.quantity;
        saveCart();
      }
    });
  }

  function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
    cart.forEach(cartItem => {
      if (cartItem.name === product.name) {
        if (cartItem.quantity > 1) {
          cartItemDOM.querySelector(".cart-item-quantity").innerText = --cartItem.quantity;
          saveCart();
        } else {
          removeItem(product, cartItemDOM, addToCartButtonDOM);
        }
      }
    });
  }

  function removeItem(product, cartItemDOM, addToCartButtonDOM) {
    cartItemDOM.remove();
    cart = cart.filter(cartItem => cartItem.name !== product.name);
    saveCart();
    addToCartButtonDOM.innerText = "Add to Cart";
    addToCartButtonDOM.disabled = false;

    if (cart.length < 1) {
      document.querySelector(".cart-footer").remove();
    }
  }

  function addCartFooter() {
    if (document.querySelector(".cart-footer") === null) {
      cartDOM.insertAdjacentHTML(
        "afterend",
        `
          <div class="cart-footer">
            <h2 class="cart-footer-total" data-action="total-price">0</h2>
            <button class="btn btn-primary btn-small btn-danger" data-action="clear-cart">Clear Cart</button>
            <button class="btn btn-primary btn-small btn-danger" data-action="checkout">Checkout</button>
          </div>
        `
      );

      document.querySelector('[data-action="clear-cart"]').addEventListener("click", () => clearCart());
      document.querySelector('[data-action="checkout"]').addEventListener("click", () => checkout());
    }
  }

  function clearCart() {
    cartDOM.querySelectorAll(".cart-item").forEach(cartItemDOM => {
      cartItemDOM.remove();
    });

    cart = [];
    localStorage.removeItem("cart");
    document.querySelector(".cart-footer").remove();
    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      addToCartButtonDOM.innerText = "Add To Cart";
      addToCartButtonDOM.disabled = false;
    });
  }

  function checkout() {
    window.location.href = "checkout.html"; // Navigate to checkout page
  }

  function countCartTotal() {
    let cartTotal = 0;
    cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
    document.querySelector('[data-action="total-price"]').innerText = `R${cartTotal.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    countCartTotal();
  }

});

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;


        var storedUsers = JSON.parse(localStorage.getItem('reg')) || [];


        var user = storedUsers.find(user => user.email === email && user.password === password);


        if (user) {
            window.location.href = 'home.html';
        } else {
            alert('Invalid login credentials');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Sign-up form submission
    document.getElementById('signupForm').addEventListener('submit', function (event) {
        event.preventDefault();
        var email = document.getElementById('signup-username').value;
        var email = document.getElementById('signup-email').value;
        var password = document.getElementById('signup-password').value;
        var confirmPassword = document.getElementById('signup-confirm-password').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Check if the password is strong
        if (!isPasswordStrong(password)) {
            alert('Password must be at least 8 characters long and contain at least one uppercase letter, and a special character.');
            return;
        }


        var storedUsers = JSON.parse(localStorage.getItem('reg')) || [];


        var userExists = storedUsers.some(user => user.email === email);


        if (userExists) {
            alert('User already exists. Please log in.');
            return;
        } else {
            storedUsers.push({ email: email, password: password });
            localStorage.setItem('reg', JSON.stringify(storedUsers));
            alert('Registration successful! Redirecting to sign up page...');
            window.location.href = 'register.html';
        }
    });
});
