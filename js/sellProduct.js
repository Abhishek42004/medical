document.addEventListener("DOMContentLoaded", function () {
  const productNameInput = document.getElementById("productName");
  const quantityInput = document.getElementById("quantity");
  const sellingPriceInput = document.getElementById("sellingPrice");
  const totalAmountInput = document.getElementById("totalAmount");
  const errorMessage = document.getElementById("errorMessage");

  quantityInput.addEventListener("input", updateTotalAmount);
  sellingPriceInput.addEventListener("input", updateTotalAmount);

  document
    .getElementById("sellProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Validate form inputs
      if (
        !productNameInput.value ||
        !quantityInput.value ||
        !sellingPriceInput.value
      ) {
        errorMessage.textContent = "All fields are required";
        return;
      }

      const quantity = parseInt(quantityInput.value);
      const sellingPrice = parseFloat(sellingPriceInput.value);

      // Validate numeric inputs
      if (
        isNaN(quantity) ||
        isNaN(sellingPrice) ||
        quantity <= 0 ||
        sellingPrice <= 0
      ) {
        errorMessage.textContent =
          "Invalid input. Quantity and selling price must be positive numbers";
        return;
      }

      // Calculate total amount
      const totalAmount = quantity * sellingPrice;
      totalAmountInput.value = totalAmount.toFixed(2);

      // Retrieve product from IndexedDB and deduct stock
      const productName = productNameInput.value;
      const soldQuantity = parseInt(quantityInput.value);
      updateInventory(productName, soldQuantity);

      // Clear form fields
      productNameInput.value = "";
      quantityInput.value = "";
      sellingPriceInput.value = "";

      errorMessage.textContent = ""; // Clear error message
      alert("Product sold successfully!");
    });
});

function updateTotalAmount() {
  const quantity = parseInt(document.getElementById("quantity").value);
  const sellingPrice = parseFloat(
    document.getElementById("sellingPrice").value
  );

  if (
    !isNaN(quantity) &&
    !isNaN(sellingPrice) &&
    quantity > 0 &&
    sellingPrice > 0
  ) {
    const totalAmount = quantity * sellingPrice;
    document.getElementById("totalAmount").value = totalAmount.toFixed(2);
  } else {
    document.getElementById("totalAmount").value = "";
  }
}
