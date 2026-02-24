<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineApp - Cartelera</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>

    <header class="main-header">
        <div class="container">
            <h1>🎬 CineApp</h1>
            <select id="cinema-select">
                <option value="">Selecciona un Cine</option>
                <!-- Opciones cargadas vía JS -->
            </select>
            <a href="admin.php" class="admin-link">Panel Admin</a>
        </div>
    </header>

    <main class="container">
        <div id="movies-grid" class="movies-grid">
            <!-- Películas cargadas vía JS -->
        </div>
        <p id="loading" class="hidden">Cargando...</p>
    </main>

    <!-- Modal Detalle Película -->
    <div id="movie-modal" class="modal hidden">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="modal-body">
                <!-- Detalle cargado dinámicamente -->
            </div>
        </div>
    </div>

    <script src="js/utils.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
