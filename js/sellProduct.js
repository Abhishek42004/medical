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

function updateInventory(productName, soldQuantity) {
  // Open a connection to IndexedDB
  const request = indexedDB.open("inventory", 1);

  request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    // Create a transaction on the 'products' object store with readwrite access
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");

    // Retrieve the product by productName
    const getRequest = objectStore.get(productName);

    getRequest.onsuccess = function (event) {
      // Update product quantity
      const product = event.target.result;
      if (product) {
        product.quantity -= soldQuantity;
        // Update the product in the database
        const updateRequest = objectStore.put(product);
        updateRequest.onerror = function (event) {
          console.error("Error updating product:", event.target.error);
        };
      } else {
        console.error("Product not found:", productName);
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving product:", event.target.error);
    };
  };

  request.onupgradeneeded = function (event) {
    // Create 'products' object store if it doesn't exist
    const db = event.target.result;
    const objectStore = db.createObjectStore("products", { keyPath: "name" });
    objectStore.createIndex("name", "name", { unique: true });
  };
}
