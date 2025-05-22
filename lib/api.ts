// API configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const ENDPOINTS = {
    // Admin endpoints
    ADMIN_PRODUCTS: `${API_BASE_URL}/admin/products`,
    ADMIN_ORDERS: `${API_BASE_URL}/admin/orders`,
    ADMIN_STATS: `${API_BASE_URL}/admin/sales-stats`,

    // Product endpoints
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT_DETAILS: (id: string) => `${API_BASE_URL}/products/${id}`,
    PRODUCT_REVIEWS: (id: string) => `${API_BASE_URL}/products/${id}/reviews`,

    // User endpoints
    USER_CART: (userId: string) => `${API_BASE_URL}/users/cart/${userId}`,
    ADD_TO_CART: `${API_BASE_URL}/users/cart`,
};

// API helper functions
export const api = {
    // Generic GET request
    get: async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch data');
        }
        return response.json();
    },

    // Generic POST request
    post: async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to post data');
        }
        return response.json();
    },

    // Generic PUT request
    put: async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update data');
        }
        return response.json();
    },

    // Generic DELETE request
    delete: async (url: string) => {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete data');
        }
        return response.json();
    },
}; 