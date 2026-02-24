-- Database Creation
CREATE DATABASE IF NOT EXISTS cine_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine_app;

-- Table: Cinemas (Cines)
CREATE TABLE IF NOT EXISTS cinemas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Rooms (Salas)
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 100,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

-- Table: Movies (Películas)
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    duration_min INT,
    genre VARCHAR(100),
    release_date DATE,
    country VARCHAR(100),
    poster_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Actors (Actores)
CREATE TABLE IF NOT EXISTS actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo_path VARCHAR(255)
);

-- Table: Movie Actors Relation
CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

-- Table: Showtimes (Sesiones)
CREATE TABLE IF NOT EXISTS showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    price DECIMAL(5,2) DEFAULT 9.00,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Table: Revenue (Ingresos - for simulation)
CREATE TABLE IF NOT EXISTS revenue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50), -- standard, spectator_day, elderly, etc.
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

-- Table: Expenses (Gastos - for simulation)
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50), -- rental, staff, cleaning, food_cost, etc.
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

-- Insert Dummy Data
INSERT INTO cinemas (name, address) VALUES 
('Cinema Central', 'Calle Mayor 1'), 
('Cinesa Luxury', 'Avenida del Norte 25');

INSERT INTO rooms (cinema_id, name, capacity) VALUES 
(1, 'Sala 1', 150), (1, 'Sala 2', 100),
(2, 'Sala VIP', 50), (2, 'Sala 3D', 200);

-- Insert dummy movies and actors if needed later
