/* 
    Name: Milan Patel
    Filename: product.mock.service.js
    Course: INFT 2202
    Date: February 1, 2025
    Description: This file defines the ProductService class, which provides methods for managing product data.
 */

// ProductService class definition
class ProductService {
    constructor() {
        this.products = this._loadProducts();
    }

    // Adds a new product to the list and saves to localStorage
    addProduct(newProduct) {
        this.products.push(newProduct);
        this._updateLocalStorage();
    }

    // Removes a product by its ID and updates localStorage
    deleteProduct(productId) {
        this.products = this.products.filter(({ id }) => id !== productId);
        this._updateLocalStorage();
    }

    // Fetches all products
    getAllProducts() {
        return [...this.products];
    }

    // Finds a product by its ID
    getProductById(productId) {
        return this.products.find(({ id }) => id === productId);
    }

    // Updates a product and saves changes to localStorage
    updateProduct(updatedProduct) {
        const productIndex = this.products.findIndex(({ id }) => id === updatedProduct.id);

        if (productIndex !== -1) {
            this.products[productIndex] = updatedProduct;
            this._updateLocalStorage();
        } else {
            throw new Error("Product not found for update.");
        }
    }

    // Private method to update the localStorage with the latest product data
    _updateLocalStorage() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    // Private method to load products from localStorage
    _loadProducts() {
        const productsData = localStorage.getItem("products");
        if (productsData) {
            try {
                return JSON.parse(productsData);
            } catch (error) {
                console.error("Error parsing products from localStorage:", error);
                return [];
            }
        }
        return [];
    }
}

// Exporting the ProductService class as default
export default ProductService;
