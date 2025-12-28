-- Staging database schema for De Zaanse Plankjes Maffia
-- Run this script to create staging database tables

-- Create staging database (if not exists)
CREATE DATABASE IF NOT EXISTS staging_plankjes_maffia;
USE staging_plankjes_maffia;

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category ENUM('grafische-kunst', 'gedichten', 'tekst', 'combinatie') NOT NULL,
  description TEXT,
  available BOOLEAN DEFAULT TRUE,
  rotation INT DEFAULT 0,
  available_products JSON,
  digital_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  artwork_id VARCHAR(255),
  order_type VARCHAR(50) NOT NULL,
  options JSON,
  inspiration TEXT,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_artwork_id (artwork_id),
  INDEX idx_order_type (order_type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  status ENUM('active', 'unsubscribed') DEFAULT 'active',
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert seed data for testing
INSERT INTO artworks (id, title, image, category, description, available, rotation) VALUES
('test-1', 'Test Kunstwerk 1', 'test-image.jpg', 'grafische-kunst', 'Dit is een test kunstwerk voor staging', TRUE, 0),
('test-2', 'Test Kunstwerk 2', 'test-image-2.jpg', 'gedichten', 'Nog een test kunstwerk', TRUE, -90)
ON DUPLICATE KEY UPDATE title=title;

