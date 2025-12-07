CREATE DATABASE IF NOT EXISTS lumina_ecommerce;
USE lumina_ecommerce;

-- Tabella Utenti
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('user', 'admin') DEFAULT 'user',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prodotti
CREATE TABLE products (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DECIMAL(10, 2) NOT NULL,
                          category VARCHAR(50),
                          image VARCHAR(255),
                          rating DECIMAL(3, 1) DEFAULT 0,
                          stock INT DEFAULT 0
);

-- Tabella Recensioni
CREATE TABLE reviews (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         product_id INT NOT NULL,
                         user_id INT NOT NULL,
                         user_name VARCHAR(100),
                         rating INT,
                         comment TEXT,
                         date DATE,
                         FOREIGN KEY (product_id) REFERENCES products(id),
                         FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dati di prova per i prodotti (basati sul tuo mockApi.ts)
INSERT INTO products (name, description, price, category, image, rating, stock) VALUES
                                                                                    ('Minimalist Desk Lamp', 'A sleek, modern desk lamp with adjustable brightness.', 49.99, 'Lighting', 'https://picsum.photos/400/400?random=1', 4.5, 12),
                                                                                    ('Ergonomic Office Chair', 'Designed for comfort and support.', 249.00, 'Furniture', 'https://picsum.photos/400/400?random=2', 4.8, 5),
                                                                                    ('Wireless Mechanical Keyboard', 'Tactile mechanical switches with a compact layout.', 129.50, 'Electronics', 'https://picsum.photos/400/400?random=3', 4.7, 20),
                                                                                    ('Ceramic Coffee Set', 'Handcrafted ceramic set including 4 mugs.', 85.00, 'Home', 'https://picsum.photos/400/400?random=4', 4.2, 8),
                                                                                    ('Noise Cancelling Headphones', 'Premium over-ear headphones.', 299.99, 'Electronics', 'https://picsum.photos/400/400?random=5', 4.9, 15),
                                                                                    ('Bamboo Plant Stand', 'Eco-friendly bamboo stand for your indoor plants.', 34.99, 'Home', 'https://picsum.photos/400/400?random=6', 4.3, 30);