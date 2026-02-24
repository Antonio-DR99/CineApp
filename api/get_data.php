<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$action = $_GET['action'] ?? '';

// Al incluir db.php, ya tenemos la variable $conn disponible
// No necesitamos clases ni métodos complejos

try {
    switch ($action) {
        case 'cinemas':
            // Fetch all cinemas
            $stmt = $conn->query("SELECT * FROM cinemas");
            echo json_encode($stmt->fetchAll());
            break;

        case 'movies':
            // Fetch movies for a specific cinema (showing distinct movies)
            // or all movies if no cinema_id provided
            $cinema_id = $_GET['cinema_id'] ?? null;
            if ($cinema_id) {
                // Get movies that have showtimes in this cinema
                $stmt = $conn->prepare("
                    SELECT DISTINCT m.* 
                    FROM movies m
                    JOIN showtimes s ON m.id = s.movie_id
                    JOIN rooms r ON s.room_id = r.id
                    WHERE r.cinema_id = ?
                ");
                $stmt->execute([$cinema_id]);
            } else {
                $stmt = $conn->query("SELECT * FROM movies");
            }
            echo json_encode($stmt->fetchAll());
            break;

        case 'movie_details':
            $movie_id = $_GET['id'] ?? null;
            if (!$movie_id) throw new Exception("ID de película requerido");

            // Movie info
            $stmt = $conn->prepare("SELECT * FROM movies WHERE id = ?");
            $stmt->execute([$movie_id]);
            $movie = $stmt->fetch();

            if (!$movie) throw new Exception("Película no encontrada");

            // Actors
            $stmt = $conn->prepare("
                SELECT a.* 
                FROM actors a
                JOIN movie_actors ma ON a.id = ma.actor_id
                WHERE ma.movie_id = ?
            ");
            $stmt->execute([$movie_id]);
            $movie['actors'] = $stmt->fetchAll();

            // Showtimes (grouped by cinema -> room)
            // We want to see where this movie is playing
            $stmt = $conn->prepare("
                SELECT s.id, s.start_time, s.price, r.name as room_name, c.name as cinema_name
                FROM showtimes s
                JOIN rooms r ON s.room_id = r.id
                JOIN cinemas c ON r.cinema_id = c.id
                WHERE s.movie_id = ?
                ORDER BY s.start_time
            ");
            $stmt->execute([$movie_id]);
            $movie['showtimes'] = $stmt->fetchAll();

            echo json_encode($movie);
            break;

        default:
            throw new Exception("Acción no válida");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
