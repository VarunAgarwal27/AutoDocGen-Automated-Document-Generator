// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.products button');

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id');
    const productTitle = button.closest('li').querySelector('h3').textContent;
    console.log(`Added ${productTitle} to cart`);
    alert(`You have added ${productTitle} to your cart!`);
  });
});

// Special chars not allowed
function checkInput() {
	const inputField = document.getElementById("myInput");
	const inputValue = inputField.value;
	const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

	if (specialChars.test(inputValue)) {
		alert("Special characters are not allowed.");
	} else {
		alert("Searching");
	}
}

// Time in website
function updateTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");
	const seconds = now.getSeconds().toString().padStart(2, "0");
	const time = `${hours}:${minutes}:${seconds}`;
	document.getElementById("clock").innerText = time;
	document.getElementById("clock").textContent = time;
  }
  
  // Update the time every second
  setInterval(updateTime, 1000);