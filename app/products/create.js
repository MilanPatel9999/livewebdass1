/* 
    Name: Milan Patel
    Filename: create.js
    Course: INFT 2202
    Date: February 1, 2025
    Description: This file contains the JavaScript code for the product creation page.
*/

import ProductService from "./product.service.js";

const productService = new ProductService();

// Handles the form submission event
async function handleProductSubmission(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateInputs(form)) return; // Stop if validation fails

    // Extract values from the form
    const product = {
        name: form.name.value.trim(),
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value, 10),
        description: form.description.value.trim(),
    };

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        try {
            const existingProduct = await productService.getProductById(productId);
            if (existingProduct) {
                Object.assign(existingProduct, product);
                await productService.updateProduct(productId, existingProduct);
                displayLoading();
                redirectAfterSuccess("Product updated successfully");
            } else {
                console.error("Product not found!");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    } else {
        try {
            product.id = crypto.randomUUID();
            await productService.addProduct(product);
            displayLoading();
            redirectAfterSuccess("Product added successfully");
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }
}

// Shows success message and redirects
function redirectAfterSuccess(message) {
    setTimeout(() => {
        showMessage("success-message", message, "green");
        setTimeout(() => window.location.href = "search.html", 2000);
    }, 500);
}

// Displays messages (success or error)
function showMessage(elementId, text, color) {
    const messageBox = document.getElementById(elementId);
    messageBox.textContent = text;
    messageBox.style.display = "block";
    messageBox.style.color = color;
    setTimeout(() => messageBox.style.display = "none", 10000);
}

// Validates form inputs
function validateInputs(form) {
    let valid = true;

    valid &= validateField(form.name, "Enter a valid product name!");
    valid &= validateField(form.price, "Enter a valid price!", value => !isNaN(value) && value > 0);
    valid &= validateField(form.stock, "Enter a valid stock quantity!", value => !isNaN(value) && value >= 0);
    valid &= validateField(form.description, "Enter a valid description!");

    return valid;
}

// Validates an individual field
function validateField(input, errorMessage, validator = value => value.trim() !== "") {
    if (!validator(input.value)) {
        showError(input, errorMessage);
        return false;
    }
    hideError(input);
    return true;
}

// Shows an error message for a field
function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
}

// Hides an error message for a field
function hideError(input) {
    input.nextElementSibling.classList.add("d-none");
}

// Displays a loading spinner
function displayLoading() {
    const spinnerBox = document.getElementById("spinner-box");
    spinnerBox.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';
    spinnerBox.classList.remove("d-none");
}

// Pre-fill form fields if editing an existing product
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        try {
            const product = await productService.getProductById(productId); // Wait for the response
            if (product) {
                document.getElementById("product-name").value = product.name;
                document.getElementById("product-price").value = product.price;
                document.getElementById("product-stock").value = product.stock;
                document.getElementById("product-description").value = product.description;
            } else {
                console.error("Product not found!");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }
});

// Attach event listener to the form
const formElement = document.getElementById("product-form");
if (formElement) {
    formElement.addEventListener("submit", handleProductSubmission);
}