// Open a connection to IndexedDB
const request = indexedDB.open("inventory", 1);

request.onerror = function (event) {
  console.error("Error opening database:", event.target.error);
};

request.onsuccess = function (event) {
  const db = event.target.result;


  // Add product function
  function addProduct(product) {
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");

    // Check if product already exists
    const request = objectStore.get(product.productName);

    request.onsuccess = function (event) {
      const existingProduct = event.target.result;

      if (existingProduct) {
        // If product exists, update quantity
        existingProduct.strip += product.strip;
        // existingProduct.tabstrip += product.tabstrip;
        existingProduct.tablet += product.strip * product.tabstrip;

        const updateRequest = objectStore.put(existingProduct);
        updateRequest.onsuccess = function () {
          console.log("Product quantity updated successfully!");
        };
        updateRequest.onerror = function (event) {
          console.error("Error updating product quantity:", event.target.error);
        };
      } else {
        // If product doesn't exist, add new product
        const addRequest = objectStore.add(product);
        addRequest.onsuccess = function () {
          console.log("Product added successfully!");
        };
        addRequest.onerror = function (event) {
          console.error("Error adding product:", event.target.error);
        };
      }
    };

    request.onerror = function (event) {
      console.error("Error checking existing product:", event.target.error);
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
      const expiry = expiryInput.value

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
  db.createObjectStore("products", {
    keyPath: "productName",
    autoIncrement: true,
  });
};
