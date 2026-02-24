<?php
// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'cine_app');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    // Conexión directa usando PDO (Basic PHP)
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    
    // Configurar el modo de error para que nos avise si algo falla
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar para que los datos vengan como un array asociativo (más fácil de usar)
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    // Si falla, mostramos el error y paramos
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>
