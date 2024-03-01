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
    db.createObjectStore("products", {
      keyPath: "productName",
      autoIncrement: true,
    });
  }

  const productNameInput = document.getElementById("productName");
  const stripInput = document.getElementById("strip");
  const tabstripInput = document.getElementById("tabstrip");
  const costPriceInput = document.getElementById("costPrice");
  const mrpInput = document.getElementById("mrp");
  const expiryInput = document.getElementById("expiry");

  const errorMessage = document.getElementById("errorMessage");

  // Handle form submission
  document
    .getElementById("addProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Validate form inputs
      if (
        !productNameInput.value ||
        !stripInput.value ||
        !tabstripInput.value ||
        !costPriceInput.value ||
        !mrpInput.value ||
        !expiryInput.value
      ) {
        errorMessage.textContent = "All fields are required";
        return;
      }

      const strip = parseInt(stripInput.value);
      const tabstrip = parseInt(tabstripInput.value);
      const costPrice = parseFloat(costPriceInput.value);
      const mrp = parseFloat(mrpInput.value);
      const expiry = parseFloat(expiryInput.value);

      // Validate numeric inputs
      if (
        isNaN(strip) ||
        isNaN(tabstrip) ||
        isNaN(costPrice) ||
        isNaN(mrp) ||
        strip <= 0 ||
        tabstrip <= 0 ||
        costPrice <= 0 ||
        mrp <= 0
      ) {
        errorMessage.textContent =
          "Invalid input. Strip, tab/strip, cost price, mrp, expiry, and tablet selling price must be positive numbers";
        return;
      }

      // Create product object
      const product = {
        productName: productNameInput.value,
        strip: strip,
        tabstrip: tabstrip,
        tablet: strip * tabstrip,
        costPrice: costPrice,
        mrp: mrp,
        expiry: expiry,
        tabletsellingPrice: mrp / tabstrip,
      };

      // Add product to IndexedDB
      addProduct(product);

      // Clear form fields
      productNameInput.value = "";
      stripInput.value = "";
      tabstripInput.value = "";
      costPriceInput.value = "";
      mrpInput.value = "";
      expiryInput.value = "";

      errorMessage.textContent = ""; // Clear error message
      alert("Product added successfully!");
    });
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("products", { keyPath: "productName", autoIncrement: true });
};
