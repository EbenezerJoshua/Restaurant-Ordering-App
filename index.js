const menuContainer = document.getElementById("menu-container");
const orderSummary = document.getElementById("order-summary");
const orderItems = document.getElementById("order-items");
const totalPrice = document.getElementById("total-price");
const completeOrderBtn = document.getElementById("complete-order-btn");
const orderModal = document.getElementById("order-modal");
const paymentForm = document.getElementById("payment-form");
const editOrderBtn = document.getElementById("edit-order-btn");
const payBtn = document.getElementById("pay-btn");
const cardNumberInput = document.getElementById("card-number");
const cvvInput = document.getElementById("cvv");
const ratingCard = document.getElementById("rating-card");
const starRating = document.getElementById("star-rating");
const submitRatingBtn = document.getElementById("submit-rating");
const orderConfirmation = document.getElementById("order-confirmation");
const ratingPopup = document.getElementById("rating-popup");

let order = {};

function renderMenu() {
  menuContainer.innerHTML = "";
  menuArray.forEach(item => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `
            <span class="item-emoji">${item.emoji}</span>
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-ingredients">${item.ingredients.join(", ")}</p>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-controls">
                <button class="remove-btn" data-id="${item.id}" ${!order[
      item.id
    ] || order[item.id] === 0
      ? "disabled"
      : ""}>-</button>
                <span class="item-count">${order[item.id] || 0}</span>
                <button class="add-btn" data-id="${item.id}">+</button>
            </div>
        `;
    menuContainer.appendChild(menuItem);
  });
}

function updateOrder(id, increment) {
  if (!order[id]) {
    order[id] = 0;
  }
  order[id] += increment;
  if (order[id] < 0) {
    order[id] = 0;
  }
  updateOrderSummary();
  renderMenu();
}

function updateOrderSummary() {
  orderItems.innerHTML = "";
  let total = 0;
  let totalItems = 0;
  let hasItems = false;

  for (const [id, count] of Object.entries(order)) {
    if (count > 0) {
      hasItems = true;
      const item = menuArray.find(item => item.id === parseInt(id));
      const orderItem = document.createElement("div");
      orderItem.classList.add("order-item");
      orderItem.innerHTML = `
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-details">
                    <span class="quantity">${count}</span>
                    <span class="amount">$${(item.price * count).toFixed(
                      2
                    )}</span>
                </span>
            `;
      orderItems.appendChild(orderItem);
      total += item.price * count;
      totalItems += count;
    }
  }

  totalPrice.innerHTML = `
        <span>Total price:</span>
        <span class="total-label">
            <span class="total-items">(${totalItems})</span>
            <span>$${total.toFixed(2)}</span>
        </span>
    `;

  orderSummary.classList.toggle("hidden", !hasItems);
  payBtn.textContent = `Pay $${total.toFixed(2)}`;
}

function handlePayment(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  orderModal.style.display = "none";
  menuContainer.classList.add("hidden");
  orderSummary.classList.add("hidden");
  orderConfirmation.classList.remove("hidden");
  orderConfirmation.innerHTML = `<h2>Thanks, ${name}! Your order is on the way!</h2>`;
  order = {};
  showRatingCard();
}

function showRatingCard() {
  ratingCard.classList.remove("hidden");
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, "");
  let formattedValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += " ";
    }
    formattedValue += value[i];
  }
  input.value = formattedValue;
}

menuContainer.addEventListener("click", e => {
  if (e.target.classList.contains("add-btn")) {
    const id = parseInt(e.target.dataset.id);
    updateOrder(id, 1);
  } else if (e.target.classList.contains("remove-btn")) {
    const id = parseInt(e.target.dataset.id);
    updateOrder(id, -1);
  }
});

completeOrderBtn.addEventListener("click", () => {
  orderModal.style.display = "block";
});

editOrderBtn.addEventListener("click", () => {
  orderModal.style.display = "none";
});

paymentForm.addEventListener("submit", handlePayment);

cardNumberInput.addEventListener("input", e => {
  formatCardNumber(e.target);
});

cvvInput.addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

starRating.addEventListener("click", e => {
  if (e.target.classList.contains("star")) {
    const rating = parseInt(e.target.dataset.rating);
    const stars = starRating.querySelectorAll(".star");
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < rating);
    });
  }
});

submitRatingBtn.addEventListener("click", () => {
  const stars = starRating.querySelectorAll(".star.active");
  const rating = stars.length;
  const comment = document.getElementById("rating-comment").value;

  // Here you would typically send the rating data to a server
  console.log(`Rating: ${rating}, Comment: ${comment}`);

  // Show the popup
  ratingPopup.classList.remove("hidden");
  ratingPopup.classList.add("show");

  // Hide the popup after 5 seconds
  setTimeout(() => {
    ratingPopup.classList.remove("show");
    setTimeout(() => {
      ratingPopup.classList.add("hidden");
    }, 500); // Wait for the transition to complete before hiding
  }, 3000);

  // Hide the rating card
  ratingCard.classList.add("hidden");

  // Reset the rating form
  stars.forEach(star => star.classList.remove("active"));
  document.getElementById("rating-comment").value = "";
});

renderMenu();
