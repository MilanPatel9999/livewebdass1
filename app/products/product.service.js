/* 
    Name: Milan Patel
    Filename: product.service.js
    Course: INFT 2202
    Date: February 1, 2025
    Description: This file defines the ProductService class, which provides methods for managing product data.
 */

// ProductService class definition
export default class ProductService {
    constructor() {
      this.host = 'https://inft2202.opentech.durhamcollege.org/api/products';
      this.apiKey = 'fbaf2acb-9175-45a1-8019-f26f2047c796'; // Your API key here
      this.headers = {
        'Content-Type': 'application/json',
        apikey: this.apiKey, // API key in headers
      };
    }
  
    // Fetch all products
// Fetch all products
// Fetch all products
async getAllProducts(page = 1, perPage = 3) {
  const response = await fetch(`${this.host}?page=${page}&perPage=${perPage}`, {
    method: 'GET',
    headers: this.headers,
  });

  if (!response.ok) throw new Error(`Error: ${response.statusText}`);

  const data = await response.json();

  // Log the full response data for debugging
  console.log('Fetched Data:', data);

  // Assuming the pagination data is inside the 'pagination' object
  const { records, pagination } = data;

  // Return the products, total records, and total pages from the 'pagination' object
  return {
    products: records,               // List of products
    totalRecords: pagination.count,   // Total number of products
    totalPages: pagination.pages,    // Total number of pages
  };
}


  
    // Fetch a specific product by ID
    async getProductById(productId) {
      const response = await fetch(`${this.host}/${productId}`, {
        method: 'GET',
        headers: this.headers,
      });
  
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
      const data = await response.json();
      return data; // Return the product data
    }
  
    // Add a new product
    async addProduct(product) {
      const response = await fetch(this.host, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(product), // Send the new product data as JSON
      });
  
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
      const data = await response.json();
      return data.record ? data.record : null; // Return the added product record
    }
  

  // Update a product through PUT method
  async updateProduct(productId, updatedProduct) {
    try {
      console.log('Product ID:', productId); // Check productId
      console.log('Updated Product:', updatedProduct); // Check updatedProduct
  
      // Ensure that productId is a valid string or number
      if (!productId || !updatedProduct) {
        throw new Error('Invalid productId or updatedProduct');
      }
  
      const response = await fetch(`${this.host}/${productId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(updatedProduct),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Updated Product Response:', data); // Check API response
  
      return data.record ? data.record : null;
    } catch (error) {
      console.error('Update Product Error:', error);
      throw error;
    }
  }
  

  // Delete a product through DELETE method
  async deleteProduct(productId) {
    try {
        const response = await fetch(`${this.host}/${productId}`, {
            method: 'DELETE',
            headers: this.headers,
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const message = errorBody.message || `Failed to delete product. Status: ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.details = errorBody; 
            throw error;
        }

        return { success: true }; 
    } catch (error) {
        console.error("Error during deletion:", error);
        throw error; 
    }
}


  }
  