/*  
    Name: Milan Patel  
    Filename: Product.js  
    Course: INFT 2202  
    Date: February 1, 2025  
    Description: This file contains the JavaScript code for the Product class. 
*/  

// Constructor function for creating Product objects  
function Product(name, description, price, stock) {  
    this.id = crypto.randomUUID(); // Generate a unique ID  
    this.name = name;  
    this.description = description; // Store product description  
    this.price = price;  
    this.stock = stock;  
}  

// Prototype method to return a formatted product summary  
Product.prototype.getDetails = function() {  
    return `Product Name: ${this.name}, Description: ${this.description}, Price: $${this.price}, Stock: ${this.stock}`;  
};  

// Function to retrieve stored products from local storage  
function loadProductsFromLocalStorage() {  
    const savedProducts = localStorage.getItem("products");  
    return savedProducts ? JSON.parse(savedProducts) : [];  
}  

export default Product;  
