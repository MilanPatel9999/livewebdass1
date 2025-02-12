/* 
    Name: Milan Patel
    Filename: search.js
    Course: INFT 2202
    Date: February 1, 2025
    Description: This file contains the JavaScript code for the product search page.
 */

// Importing the product service class
import ProductService from "./product.mock.service.js";

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const errorMessage = document.getElementById('error-message');
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  const paginationNav = document.getElementById('pagination');
  const previousPageButton = document.getElementById('previous-page');
  const nextPageButton = document.getElementById('next-page');
  
  let productToDelete = null;
  let currentPage = 1;
  const perPage = 3; // Number of products per page
  const productService = new ProductService();
  const products = productService.getAllProducts();

  // Renders the products for the current page
  const renderProductsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentProducts = products.slice(startIndex, endIndex);
    
    productList.innerHTML = ''; // Clear previous content

    currentProducts.forEach(product => {
      const card = createProductCard(product);
      productList.innerHTML += card;
    });

    setupPagination();
  };

  // Creates an HTML card for the product
  const createProductCard = (product) => {
    return `
      <div class="col-md-4 mb-4">
          <div class="card shadow-lg border-0 rounded-3 overflow-hidden">
              <!-- Product Image -->
              <img src="${product.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}" class="card-img-top img-fluid" alt="Product Image">

              <div class="card-body text-center">
                  <h3 class="card-title">${product.name}</h3>
                  <p class="card-text"><strong>Description: </strong>${product.description}</p>
                  <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                  <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>

                  <div class="d-flex justify-content-center gap-3">
                      <!-- Add to Cart Button -->
                      <button class="btn btn-outline-success add-to-cart-btn" data-id="${product.id}" data-bs-toggle="tooltip" title="Add Product to Cart">
                          <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                      </button>

                      <!-- Edit Button -->
                      <button class="btn btn-outline-warning edit-btn" data-id="${product.id}" data-bs-toggle="tooltip" title="Edit Product">
                          <i class="fa-solid fa-pen"></i> Edit
                      </button>

                      <!-- Delete Button -->
                      <button class="btn btn-outline-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${product.id}" data-bs-toggle="tooltip" title="Delete Product">
                          <i class="fa-solid fa-trash"></i> Delete
                      </button>
                  </div>
              </div>
          </div>
      </div>
    `;
  };

  // Sets up pagination controls based on current page and total pages
  const setupPagination = () => {
    const totalPages = Math.ceil(products.length / perPage);
    paginationNav.classList.toggle('d-none', totalPages <= 1);

    previousPageButton.classList.toggle('disabled', currentPage === 1);
    nextPageButton.classList.toggle('disabled', currentPage === totalPages);
  };

  // Event listener for previous page
  previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProductsForCurrentPage();
    }
  });

  // Event listener for next page
  nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(products.length / perPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProductsForCurrentPage();
    }
  });

  // Event listener for delete button click
  productList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-btn');
    if (deleteButton) {
      const productId = deleteButton.getAttribute('data-id');
      productToDelete = productService.getProductById(productId);
    }
  });

  // Event listener for confirm delete action
  document.getElementById('confirm-delete').addEventListener('click', () => {
    if (productToDelete) {
      productService.deleteProduct(productToDelete.id);
      renderProductsForCurrentPage();
      deleteModal.hide();
      window.location.href = "search.html"; // Redirect to the search page
    }
  });

  // Event listener for edit button click
  productList.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-btn');
    if (editButton) {
      const productId = editButton.getAttribute('data-id');
      window.location.href = `create.html?id=${productId}`;
    }
  });

  // Initial product rendering or error message display
  if (products.length === 0) {
    errorMessage.classList.remove('d-none');
  } else {
    renderProductsForCurrentPage();
  }

  // Initialize Bootstrap tooltips
  const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipElements.forEach(el => new bootstrap.Tooltip(el));

});
