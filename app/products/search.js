/* 
    Name: Milan Patel
    Filename: search.js
    Course: INFT 2202
    Date: February 1, 2025
    Description: This file contains the JavaScript code for the product search page.
 */

// Importing the product service class
import ProductService from "./product.service.js"; // Import ProductService

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const errorMessage = document.getElementById('error-message');
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  const paginationNav = document.getElementById('pagination');
  const previousPageButton = document.getElementById('previous-page');
  const nextPageButton = document.getElementById('next-page');

  let productToDelete = null;
  let currentPage = 1;
  const perPage = 6; // Number of products per page
  let totalPages = 1; // Dynamically calculated based on the total number of products
  const productService = new ProductService(); // Create an instance of ProductService
// Renders the products for the current page
const renderProductsForCurrentPage = async () => {
  try {
    // Fetch products and pagination data
    const { products, totalRecords } = await productService.getAllProducts(currentPage, perPage);

    console.log('Products:', products);           // Log products
    console.log('Total Records:', totalRecords);  // Log totalRecords

    // Dynamically calculate totalPages based on totalRecords and perPage
    totalPages = Math.ceil(totalRecords / perPage);

    console.log('Total Pages:', totalPages);      // Log totalPages

    if (totalRecords > 0) {
      productList.innerHTML = ''; // Clear previous content

      // Iterate over products to create product cards
      products.forEach(product => {
        const card = createProductCard(product);
        productList.innerHTML += card;
      });

      // Adjust pagination based on the total number of pages
      setupPagination(totalPages);
    } else {
      errorMessage.classList.remove('d-none');
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage.classList.remove('d-none');
  }
};

// Call renderProductsForCurrentPage after updating a product to refresh the page
document.getElementById('confirm-delete').addEventListener('click', async function () {
  if (productToDelete) {
    try {
      await productService.deleteProduct(productToDelete.productId);

      // Show Bootstrap toast for success
      const successToast = new bootstrap.Toast(document.getElementById('delete-success-toast'));
      successToast.show();

      // Refresh product list after deletion
      renderProductsForCurrentPage(); // Refresh product list
      deleteModal.hide();
    } catch (error) {
      console.error("Error deleting product:", error);

      // Show Bootstrap toast for error
      const errorToast = new bootstrap.Toast(document.getElementById('delete-error-toast'));
      errorToast.show();
    }
  }
});
  // Creates a product card element for displaying product details
  const createProductCard = (product) => {
    console.log("Product object:", product);  // Debugging log to check product data
  
    const isOwner = product.owner.githubId === 'MilanPatel9999';
  
    return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
        <div class="card shadow-lg border-0 rounded-10 overflow-hidden">
          <!-- Product Image -->
          <img src="${product.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D'}" class="card-img-top img-fluid" alt="Product Image">
  
          <div class="card-body text-center">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-text"><strong>Description: </strong>${product.description}</p>
            <p class="card-text"><strong>Price:</strong> $${product.price}</p>
            <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
            <p class="card-text"><strong>Owner:</strong> ${product.owner.name}</p>
  
            <div class="d-flex justify-content-center gap-3">
              <!-- Add to Cart Button -->
              <button class="btn btn-outline-success add-to-cart-btn" data-id="${product.productId}" data-bs-toggle="tooltip" title="Add Product to Cart">
                <i class="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
  
              ${isOwner ? `
              <!-- Edit Button -->
              <button class="btn btn-outline-warning edit-btn" data-id="${product.productId}" data-bs-toggle="tooltip" title="Edit Product">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
  
              <!-- Delete Button -->
              <button class="btn btn-outline-danger delete-btn" data-id="${product.productId}" data-bs-toggle="modal" data-bs-target="#deleteModal" title="Delete Product">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  

  // Setup pagination buttons and logic
  const setupPagination = (totalPages) => {
    paginationNav.classList.remove('d-none'); // Ensure pagination nav is visible

    // Enable or disable the pagination buttons
    previousPageButton.classList.toggle('disabled', currentPage === 1);
    nextPageButton.classList.toggle('disabled', currentPage === totalPages);

    // Hide pagination if there's only 1 page and 1 product is being shown
    if (totalPages <= 1) {
      paginationNav.classList.add('d-none');
    } else {
      paginationNav.classList.remove('d-none');
    }
  };

  // Event listener for previous page
  previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProductsForCurrentPage();
      console.log(`Current Page: ${currentPage}`); // Debug line
    }
  });

  // Event listener for next page
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProductsForCurrentPage();
      console.log(`Current Page: ${currentPage}`); // Debug line
    }
  });

  
  
// Event listener for delete button click
productList.addEventListener('click', async function (event) {
  if (event.target.closest('.delete-btn')) {
    const productId = event.target.closest('.delete-btn').getAttribute('data-id');
    productToDelete = await productService.getProductById(productId);
  }
});

document.getElementById('confirm-delete').addEventListener('click', async function () {
  if (productToDelete) {
      try {
          await productService.deleteProduct(productToDelete.productId);

          // Show Bootstrap toast for success
          const successToast = new bootstrap.Toast(document.getElementById('delete-success-toast'));
          successToast.show();

          // Refresh product list after deletion
          renderProductsForCurrentPage();
          deleteModal.hide();
      } catch (error) {
          console.error("Error deleting product:", error);

          // Show Bootstrap toast for error
          const errorToast = new bootstrap.Toast(document.getElementById('delete-error-toast'));
          errorToast.show();
      }
  }
});

document.getElementById('confirm-delete').addEventListener('click', async function () {
  if (productToDelete) {
      try {
          await productService.deleteProduct(productToDelete.productId);

          // Refresh product list after deletion
          renderProductsForCurrentPage();
          deleteModal.hide();
      } catch (error) {
          console.error("Error deleting product:", error);
      }
  }
});





  productList.addEventListener('click', function (event) {
    const editButton = event.target.closest('.edit-btn');
    if (editButton) {
      const productId = editButton.getAttribute('data-id');
      if (productId) {
        window.location.href = `create.html?id=${productId}`;
      }
    }
  });

  // Initial product rendering
  renderProductsForCurrentPage();

  // Initialize Bootstrap tooltips
  const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipElements.forEach(el => new bootstrap.Tooltip(el));
});