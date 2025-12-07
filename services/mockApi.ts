import { Product, User, ApiResponse, Review } from '../types';

/**
 * CONFIGURATION
 * Set USE_MOCK to false to connect to your local PHP backend.
 * Make sure the BASE_URL points to your PHP server (e.g., localhost/api).
 */
const USE_MOCK = false;
const BASE_URL = 'http://localhost/api';

// --- MOCK DATA (Fallback) ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    description: 'A sleek, modern desk lamp with adjustable brightness and warm temperature settings. Perfect for late-night study sessions.',
    price: 49.99,
    category: 'Lighting',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.5,
    stock: 12
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    description: 'Designed for comfort and support, this chair features lumbar support and breathable mesh material.',
    price: 249.00,
    category: 'Furniture',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.8,
    stock: 5
  },
  {
    id: '3',
    name: 'Wireless Mechanical Keyboard',
    description: 'Tactile mechanical switches with a compact 65% layout. Bluetooth 5.0 connectivity.',
    price: 129.50,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.7,
    stock: 20
  },
  {
    id: '4',
    name: 'Ceramic Coffee Set',
    description: 'Handcrafted ceramic set including 4 mugs and a pouring pot. Matte finish.',
    price: 85.00,
    category: 'Home',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.2,
    stock: 8
  },
  {
    id: '5',
    name: 'Noise Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.9,
    stock: 15
  },
  {
    id: '6',
    name: 'Bamboo Plant Stand',
    description: 'Eco-friendly bamboo stand for your indoor plants. Easy to assemble.',
    price: 34.99,
    category: 'Home',
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.3,
    stock: 30
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userId: 'u101',
    userName: 'Alice M.',
    rating: 5,
    comment: 'Absolutely love this lamp! It fits perfectly on my desk and the light is very soothing.',
    date: '2023-10-15'
  },
  {
    id: 'r2',
    productId: '1',
    userId: 'u102',
    userName: 'Bob D.',
    rating: 4,
    comment: 'Great light, but the switch is a bit finicky sometimes. Still worth the price.',
    date: '2023-11-02'
  }
];

// Helper for delays in Mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for Fetch
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: 'Connection Error' };
  }
}

export const ProductService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, data: MOCK_PRODUCTS };
    }
    return apiRequest<Product[]>('/products.php');
  },
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    if (USE_MOCK) {
      await delay(300);
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (product) return { success: true, data: product };
      return { success: false, message: 'Product not found' };
    }
    return apiRequest<Product>(`/products.php?id=${id}`);
  }
};

export const ReviewService = {
  getByProductId: async (productId: string): Promise<ApiResponse<Review[]>> => {
    if (USE_MOCK) {
      await delay(400);
      const reviews = MOCK_REVIEWS.filter(r => r.productId === productId);
      return { success: true, data: reviews };
    }
    return apiRequest<Review[]>(`/reviews.php?product_id=${productId}`);
  },
  addReview: async (reviewData: Omit<Review, 'id' | 'date'>): Promise<ApiResponse<Review>> => {
    if (USE_MOCK) {
      await delay(600);
      const newReview: Review = {
        ...reviewData,
        id: `r_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split('T')[0]
      };
      MOCK_REVIEWS.push(newReview);
      return { success: true, data: newReview };
    }
    return apiRequest<Review>('/reviews.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
  }
};

export const AuthService = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    if (USE_MOCK) {
      await delay(800);
      if (email.includes('@') && password.length > 5) {
        return {
          success: true,
          data: { id: 'u_123', name: 'Demo User', email: email, role: 'user' }
        };
      }
      return { success: false, message: 'Invalid credentials' };
    }
    return apiRequest<User>('/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },
  register: async (name: string, email: string, password?: string): Promise<ApiResponse<User>> => {
    if (USE_MOCK) {
      await delay(800);
      return {
        success: true,
        data: { id: `u_${Math.random().toString(36).substr(2, 9)}`, name, email, role: 'user' }
      };
    }
    return apiRequest<User>('/auth.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: password || 'defaultpass' })
    });
  }
};

export const WishlistService = {
  getUserWishlist: async (userId: string): Promise<ApiResponse<Product[]>> => {
    if (USE_MOCK) return { success: true, data: [] }; // Mock vuoto
    return apiRequest<Product[]>(`/wishlist.php?user_id=${userId}`);
  },

  toggleItem: async (userId: string, productId: string, action: 'add' | 'remove'): Promise<ApiResponse<any>> => {
    if (USE_MOCK) return { success: true };
    return apiRequest('/wishlist.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, action })
    });
  }
};