let currentProductName;

document.addEventListener("DOMContentLoaded", function () {
  displayProductList();
  setupModal();
});

function displayProductList() {
  const request = indexedDB.open("inventory", 1);

  request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["products"], "readonly");
    const objectStore = transaction.objectStore("products");
    const getRequest = objectStore.getAll();

    getRequest.onsuccess = function (event) {
      const products = event.target.result;
      console.log(products);

      const productListContainer = document.getElementById("productList");
      productListContainer.innerHTML = ""; // Clear previous content

      if (products && products.length > 0) {
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Product Title</th>
                    <th>Tab</th>
                    <th>Cost Price</th>
                    <th>MRP</th>
                    <th>Expiry</th>
                    <th>Price</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody id="productListBody"></tbody>
        `;
        productListContainer.appendChild(table);

        const tbody = document.getElementById("productListBody");
        products.forEach((product) => {
          const row = createProductRow(product);
          tbody.appendChild(row);
        });
      } else {
        productListContainer.textContent = "No products found";
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving products:", event.target.error);
    };
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("products", {
      keyPath: "productName",
    });
    objectStore.createIndex("name", "name", { unique: true });
  };
}

function createProductRow(product) {
  const row = document.createElement("tr");

  const productNameCell = document.createElement("td");
  productNameCell.textContent = product.productName;
  row.appendChild(productNameCell);

  const stripCell = document.createElement("td");
  stripCell.textContent = product.tablet;
  row.appendChild(stripCell);

  const costPriceCell = document.createElement("td");
  costPriceCell.textContent = product.costPrice.toFixed(2);
  row.appendChild(costPriceCell);

  const mrpCell = document.createElement("td");
  mrpCell.textContent = product.mrp.toFixed(2);
  row.appendChild(mrpCell);

  const expiryCell = document.createElement("td");
  expiryCell.textContent = product.expiry;
  row.appendChild(expiryCell);

  const tabletSellingPriceCell = document.createElement("td");
  tabletSellingPriceCell.textContent = product.tabletsellingPrice.toFixed(2);
  row.appendChild(tabletSellingPriceCell);

  const editCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    showEditModal(product);
  });
  editCell.appendChild(editButton);
  row.appendChild(editCell);

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteProduct(product.productName);
  });
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  return row;
}

function showEditModal(product) {
  const modal = document.getElementById("editProductModal");
  const form = document.getElementById("editProductForm");

  // Populate the form with the current product details
  document.getElementById("productName").value = product.productName;
  document.getElementById("tablet").value = product.tablet;
  document.getElementById("costPrice").value = product.costPrice;
  document.getElementById("mrp").value = product.mrp;
  document.getElementById("expiry").value = product.expiry;
  document.getElementById("originalProductName").value = product.productName;

  modal.style.display = "block";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    saveProductChanges();
  });

  const closeButton = document.querySelector("#editProductModal .close");
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

function saveProductChanges() {
  const request = indexedDB.open("inventory", 1);

  request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");

    // Get updated values from the form
    const productName = document.getElementById("productName").value;
    const tablet = parseInt(document.getElementById("tablet").value, 10);
    const costPrice = parseFloat(document.getElementById("costPrice").value);
    const mrp = parseFloat(document.getElementById("mrp").value);
    const expiry = document.getElementById("expiry").value;
    const originalProductName = document.getElementById("originalProductName").value;

    // Create updated product object
    const updatedProduct = {
      productName: productName,
      tablet: tablet,
      costPrice: costPrice,
      mrp: mrp,
      expiry: expiry,
      tabletsellingPrice: mrp / tablet, // Auto-calculated selling price
    };

    const putRequest = objectStore.put(updatedProduct);

    putRequest.onsuccess = function () {
      console.log("Product updated successfully:", updatedProduct);
      document.getElementById("editProductModal").style.display = "none";
      displayProductList(); // Refresh the product list
    };

    putRequest.onerror = function (event) {
      console.error("Error updating product:", event.target.error);
    };
  };
}


function saveProductChanges() {
  const request = indexedDB.open("inventory", 1);

  request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");

    const productName = document.getElementById("productName").value;
    const tablet = document.getElementById("tablet").value;
    const costPrice = parseFloat(document.getElementById("costPrice").value);
    const mrp = parseFloat(document.getElementById("mrp").value);
    const expiry = document.getElementById("expiry").value;
    const tabletSellingPrice = parseFloat(document.getElementById("tabletSellingPrice").value);
    const originalProductName = document.getElementById("originalProductName").value;

    const updatedProduct = {
      productName,
      tablet,
      costPrice,
      mrp,
      expiry,
      tabletSellingPrice,
    };

    const putRequest = objectStore.put(updatedProduct);

    putRequest.onsuccess = function () {
      console.log("Product updated:", updatedProduct);
      document.getElementById("editProductModal").style.display = "none";
      displayProductList(); // Refresh the list
    };

    putRequest.onerror = function (event) {
      console.error("Error updating product:", event.target.error);
    };
  };
}

function deleteProduct(productName) {
  const request = indexedDB.open("inventory", 1);

  request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");
    const deleteRequest = objectStore.delete(productName);

    deleteRequest.onsuccess = function () {
      console.log("Product deleted:", productName);
      displayProductList(); // Refresh the list
    };

    deleteRequest.onerror = function (event) {
      console.error("Error deleting product:", event.target.error);
    };
  };
}

function setupModal() {
  const modal = document.getElementById("editProductModal");
  const closeButton = document.querySelector("#editProductModal .close");

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}
