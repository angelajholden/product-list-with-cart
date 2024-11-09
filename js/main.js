function copyright() {
	const date = document.getElementById("date");
	const year = new Date().getFullYear();
	if (date) {
		date.innerHTML = year;
	}
}

async function loadJson(filePath) {
	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error(`Error loading JSON: ${error.message}`);
	}
}

/**
 * When I click on the Add to Cart button,
 * I want to add an active class to the plus/minus div
 * and remove the active class from the add to cart button.
 */
function toggleButton() {
	const gridWrap = document.querySelector(".grid-wrap");

	// Use event delegation to handle clicks on .cart-button
	gridWrap.addEventListener("click", (e) => {
		// Look for the closest element with the class "cart-button"
		const cartButton = e.target.closest(".cart-button");

		if (cartButton) {
			// Use nextElementSibling to get the cart-plus-minus directly after the button
			const cartPlusMinus = cartButton.nextElementSibling;

			// const cartSidebar = document.querySelector(".side-wrap");
			// console.log(cartSidebar, "the sidebar is available");

			if (cartPlusMinus) {
				if (cartButton.classList.contains("active")) {
					// Remove active from the button, add it to cart-plus-minus
					cartButton.classList.remove("active");
					cartPlusMinus.classList.add("active");

					// Add item to the cart
					const gridItem = cartButton.closest(".grid-item");
					addToCart(gridItem);
				}
			}
		}
	});
}

/**
 * When I click the add to cart button,
 * I want to add the item data to the cart/sidebar.
 */
function addToCart(gridItem) {
	// Get item details from gridItem
	const itemName = gridItem.querySelector(".tertiary-header").innerText;
	const itemPrice = gridItem.querySelector(".item-price").innerText;

	// Create the new cart item markup
	const cartItem = document.createElement("article");
	cartItem.classList.add("cart-item");
	cartItem.innerHTML = `
    <div class="cart-quantity">
      <p class="cart-heading">${itemName}</p>
      <div class="quantity-wrap">
        <span class="quantity">1x</span>
        <span class="each-item">@$${itemPrice}</span>
        <span class="item-total">$${itemPrice}</span>
      </div>
    </div>
    <button class="remove-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
        <path fill="" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
      </svg>
    </button>
  `;

	// Append the new cart item to the sidebar
	const cartSidebar = document.querySelector(".side-wrap");
	if (cartSidebar) {
		console.log("cart item");
		cartSidebar.appendChild(cartItem);
	}

	// Add functionality to remove the item from the cart
	const removeButton = cartItem.querySelector(".remove-item");
	removeButton.addEventListener("click", () => {
		cartSidebar.removeChild(cartItem);
	});
}

// DON'T FORGET ABOUT PERSISTENT STORAGE

document.addEventListener("DOMContentLoaded", () => {
	copyright();
	loadJson("json/data.json")
		.then((data) => {
			const gridWrap = document.querySelector(".grid-wrap");
			data.forEach((item) => {
				const article = document.createElement("article");
				article.classList.add("grid-item");
				article.innerHTML = `
					<div class="button-container">
						<figure class="image-container">
							<img src="${item.image.desktop}" alt="${item.name}" />
						</figure>
						<button class="cart-button active">
							<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
								<g fill="#C73B0F" clip-path="url(#a)">
									<path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z" />
									<path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z" />
								</g>
								<defs>
									<clipPath id="a">
										<path fill="#fff" d="M.333 0h20v20h-20z" />
									</clipPath>
								</defs>
							</svg>
							Add to Cart
						</button>
						<div class="cart-plus-minus">
							<span class="access-hidden">Cart Quantity</span>
							<button class="more-less">
								<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
									<path fill="" d="M0 .375h10v1.25H0V.375Z" />
								</svg>
							</button>
							<span class="item-quantity">1</span>
							<button class="more-less">
								<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
									<path fill="" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
								</svg>
							</button>
						</div>
					</div>
					<div class="item-category">${item.category}</div>
					<h3 class="tertiary-header">${item.name}</h3>
					<div class="item-price">$${item.price}</div>
				`;
				gridWrap.appendChild(article);
			});
			toggleButton();
		})
		.catch((error) => {
			console.error("Error loading JSON data: ", error);
		});
});

/**
 * <div class="full-cart">
	<h2 class="secondary-header">Your Cart (7)</h2>
	<div class="cart-container">
		
	</div>
	<p class="order-total">
		<span>Order Total</span>
		<span class="total-amount">$46.50</span>
	</p>
	<div class="carbon-neutral">
		<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
			<path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z" />
			<path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z" />
		</svg>
		<p>
			This is a
			<strong>&nbsp;carbon-neutral&nbsp;</strong>
			delivery
		</p>
	</div>
	<button class="confirm-order">Confirm Order</button>
</div>
 */