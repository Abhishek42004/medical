document.addEventListener('DOMContentLoaded', function() {
    displayProductList();
});

function displayProductList() {
    // Open a connection to IndexedDB
    const request = indexedDB.open('inventory', 1);

    request.onerror = function(event) {
        console.error('Error opening database:', event.target.error);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Open a transaction on the 'products' object store with readonly access
        const transaction = db.transaction(['products'], 'readonly');
        const objectStore = transaction.objectStore('products');

        // Get all products from the object store
        const getRequest = objectStore.getAll();

        getRequest.onsuccess = function(event) {
            const products = event.target.result;

            // Display product list
            const productListContainer = document.getElementById('productList');
            productListContainer.innerHTML = ''; // Clear previous content

            if (products && products.length > 0) {
                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Product Title</th>
                            <th>Quantity</th>
                            <th>Cost Price</th>
                            <th>Selling Price</th>
                        </tr>
                    </thead>
                    <tbody id="productListBody"></tbody>
                `;
                productListContainer.appendChild(table);

                const tbody = document.getElementById('productListBody');
                products.forEach(product => {
                    const row = createProductRow(product);
                    tbody.appendChild(row);
                });
            } else {
                productListContainer.textContent = 'No products found';
            }
        };

        getRequest.onerror = function(event) {
            console.error('Error retrieving products:', event.target.error);
        };
    };

    request.onupgradeneeded = function(event) {
        // Create 'products' object store if it doesn't exist
        const db = event.target.result;
        const objectStore = db.createObjectStore('products', { keyPath: 'name' });
        objectStore.createIndex('name', 'name', { unique: true });
    };
}

function createProductRow(product) {
    const row = document.createElement('tr');

    const productNameCell = document.createElement('td');
    productNameCell.textContent = product.name;
    row.appendChild(productNameCell);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity;
    row.appendChild(quantityCell);

    const costPriceCell = document.createElement('td');
    costPriceCell.textContent = product.costPrice.toFixed(2);
    row.appendChild(costPriceCell);

    const sellingPriceCell = document.createElement('td');
    sellingPriceCell.textContent = product.sellingPrice.toFixed(2);
    row.appendChild(sellingPriceCell);

    return row;
}
