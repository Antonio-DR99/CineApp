<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Usamos la conexión $conn que viene del archivo config/db.php
// $conn = Database::getInstance()->getConnection(); // ELIMINADO: Forma compleja

// Debug Log
file_put_contents('../logs/api_debug.log', date('[Y-m-d H:i:s] ') . "Method: $method Action: $action POST: " . print_r($_POST, true) . " FILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

// Helper to get JSON input
function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    file_put_contents('../logs/api_debug.log', "JSON Input: " . print_r($input, true) . "\n", FILE_APPEND);
    return $input;
}

try {
    if ($method === 'POST') {
        $data = $_POST; // For form data including files
        // If JSON input is sent
        if (empty($data)) $data = getJsonInput();

        // Fallback for action
        if (empty($action) && isset($data['action'])) {
            $action = $data['action'];
        }

        switch ($action) {
            case 'create_cinema':
                if (empty($data['name']) || empty($data['address'])) throw new Exception("Datos incompletos");
                $stmt = $conn->prepare("INSERT INTO cinemas (name, address) VALUES (?, ?)");
                $stmt->execute([$data['name'], $data['address']]);
                echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
                break;
            
            case 'create_movie':
                // Handle File Upload for Poster
                $posterPath = '';
                if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../assets/posters/';
                    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                    $fileName = uniqid() . '_' . basename($_FILES['poster']['name']);
                    move_uploaded_file($_FILES['poster']['tmp_name'], $uploadDir . $fileName);
                    $posterPath = 'assets/posters/' . $fileName;
                }

                $stmt = $conn->prepare("INSERT INTO movies (title, synopsis, duration_min, genre, release_date, country, poster_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['title'], 
                    $data['synopsis'] ?? '', 
                    $data['duration_min'] ?? 0, 
                    $data['genre'] ?? '', 
                    $data['release_date'] ?? null, 
                    $data['country'] ?? '', 
                    $posterPath
                ]);
                echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
                break;

            case 'create_actor':
                // Handle File Upload for Photo
                $photoPath = '';
                if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../assets/actors/';
                    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                    $fileName = uniqid() . '_' . basename($_FILES['photo']['name']);
                    move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $fileName);
                    $photoPath = 'assets/actors/' . $fileName;
                }
                
                $stmt = $conn->prepare("INSERT INTO actors (name, photo_path) VALUES (?, ?)");
                $stmt->execute([$data['name'], $photoPath]);
                echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
                break;

            case 'create_room':
                if (empty($data['cinema_id']) || empty($data['name'])) throw new Exception("Datos incompletos");
                $stmt = $conn->prepare("INSERT INTO rooms (cinema_id, name, capacity) VALUES (?, ?, ?)");
                $stmt->execute([$data['cinema_id'], $data['name'], $data['capacity'] ?? 100]);
                echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
                break;

            case 'create_showtime':
                $stmt = $conn->prepare("INSERT INTO showtimes (room_id, movie_id, start_time, price) VALUES (?, ?, ?, ?)");
                $stmt->execute([$data['room_id'], $data['movie_id'], $data['start_time'], $data['price']]);
                echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
                break;

            // ... Add Update/Delete logic here similarly
            
            default:
                 // Check for generic delete
                if ($action === 'delete') {
                    $table = $data['table']; // specific table
                    $id = $data['id'];
                    // Whitelist tables
                    $allowed = ['cinemas', 'rooms', 'movies', 'actors', 'showtimes'];
                    if (in_array($table, $allowed)) {
                        $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
                        $stmt->execute([$id]);
                        echo json_encode(['success' => true]);
                    } else {
                        throw new Exception("Tabla no permitida");
                    }
                } else {
                    throw new Exception("Acción no válida");
                }
                break;

            case 'update_movie_cast':
                if (empty($data['movie_id'])) throw new Exception("ID de película requerido");
                
                $movie_id = $data['movie_id'];
                // Con FormData y múltiples checkboxes con el mismo nombre 'actors[]',
                // PHP lo recibe directamente en $_POST['actors'] como un array.
                $actor_ids = $_POST['actors'] ?? $data['actors'] ?? []; 

                file_put_contents('../logs/api_debug.log', "Updating cast for movie $movie_id. Actors: " . print_r($actor_ids, true) . "\n", FILE_APPEND);

                $conn->beginTransaction();
                try {
                    // 1. Remove existing relationships
                    $stmt = $conn->prepare("DELETE FROM movie_actors WHERE movie_id = ?");
                    $stmt->execute([$movie_id]);

                    // 2. Insert new relationships
                    if (!empty($actor_ids)) {
                        $insertStmt = $conn->prepare("INSERT INTO movie_actors (movie_id, actor_id) VALUES (?, ?)");
                        foreach ($actor_ids as $actor_id) {
                            $insertStmt->execute([$movie_id, $actor_id]);
                        }
                    }
                    $conn->commit();
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    $conn->rollBack();
                    throw $e;
                }
                break;
        }
    } elseif ($method === 'GET') {
        // reuse generic get_data or add admin specific fetches here
        // For admin we usually want raw lists
         switch ($action) {
            case 'list_all':
                $table = $_GET['table'];
                $allowed = ['cinemas', 'rooms', 'movies', 'actors', 'showtimes'];
                if (in_array($table, $allowed)) {
                    $stmt = $conn->query("SELECT * FROM $table");
                    echo json_encode($stmt->fetchAll());
                }
                break;

            case 'get_movie_cast':
                $movie_id = $_GET['movie_id'] ?? 0;
                $stmt = $conn->prepare("SELECT actor_id FROM movie_actors WHERE movie_id = ?");
                $stmt->execute([$movie_id]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_COLUMN));
                break;
            default: 
                echo json_encode([]);
         }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
