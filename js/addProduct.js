// Open a connection to IndexedDB
const request = indexedDB.open("inventory", 1);

request.onerror = function (event) {
  console.error("Error opening database:", event.target.error);
};

request.onsuccess = function (event) {
  const db = event.target.result;

  // Add product function
  function addProduct(product) {
    // Create a transaction on the 'products' object store with readwrite access
    const transaction = db.transaction(["products"], "readwrite");

    // Access the object store
    const objectStore = transaction.objectStore("products");

    // Add the product to the object store
    const request = objectStore.add(product);

    request.onsuccess = function (event) {
      console.log("Product added successfully!");
    };

    request.onerror = function (event) {
      console.error("Error adding product:", event.target.error);
    };
  }

  // Create object store if it doesn't exist
  if (!db.objectStoreNames.contains("products")) {
    db.createObjectStore("products", { keyPath: "name", autoIncrement: true });
  }

  const productNameInput = document.getElementById("productName");
  const quantityInput = document.getElementById("quantity");
  const costPriceInput = document.getElementById("costPrice");
  const sellingPriceInput = document.getElementById("sellingPrice");
  const errorMessage = document.getElementById("errorMessage");

  // Handle form submission
  document
    .getElementById("addProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Validate form inputs
      if (
        !productNameInput.value ||
        !quantityInput.value ||
        !costPriceInput.value ||
        !sellingPriceInput.value
      ) {
        errorMessage.textContent = "All fields are required";
        return;
      }

      const quantity = parseInt(quantityInput.value);
      const costPrice = parseFloat(costPriceInput.value);
      const sellingPrice = parseFloat(sellingPriceInput.value);

      // Validate numeric inputs
      if (
        isNaN(quantity) ||
        isNaN(costPrice) ||
        isNaN(sellingPrice) ||
        quantity <= 0 ||
        costPrice <= 0 ||
        sellingPrice <= 0
      ) {
        errorMessage.textContent =
          "Invalid input. Quantity, cost price, and selling price must be positive numbers";
        return;
      }

      // Create product object
      const product = {
        name: productNameInput.value,
        quantity: quantity,
        costPrice: costPrice,
        sellingPrice: sellingPrice,
      };

      // Add product to IndexedDB
      addProduct(product);

      // Clear form fields
      productNameInput.value = "";
      quantityInput.value = "";
      costPriceInput.value = "";
      sellingPriceInput.value = "";

      errorMessage.textContent = ""; // Clear error message
      alert("Product added successfully!");
    });
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("products", { keyPath: "name", autoIncrement: true });
};
