<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineApp - Administración</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Admin specific styles inline for now or move to css */
        .admin-container { display: flex; min-height: 100vh; }
        .sidebar { width: 250px; background: #222; padding: 20px; }
        .sidebar h2 { color: var(--primary); margin-bottom: 20px; }
        .nav-btn {
            display: block; width: 100%; padding: 10px; margin-bottom: 10px;
            background: #333; color: #fff; border: none; text-align: left; cursor: pointer;
        }
        .nav-btn.active { background: var(--primary); }
        .content { flex: 1; padding: 20px; background: #111; }
        .section { display: none; }
        .section.active { display: block; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; color: #fff; }
        th, td { padding: 10px; border-bottom: 1px solid #333; text-align: left; }
        th { color: var(--primary); }
        
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input, select, textarea { width: 100%; padding: 8px; background: #333; border: 1px solid #444; color: #fff; }
        button.btn-primary { background: var(--primary); color: #fff; border: none; padding: 10px 20px; cursor: pointer; }
        
        .modal { z-index: 2000; } /* Ensure above other things */
    </style>
</head>
<body>

    <div class="admin-container">
        <aside class="sidebar">
            <h2>Panel Admin</h2>
            <button class="nav-btn active" data-target="cinemas">Cines y Salas</button>
            <button class="nav-btn" data-target="movies">Películas</button>
            <button class="nav-btn" data-target="actors">Actores</button>
            <button class="nav-btn" data-target="showtimes">Sesiones</button>
            <a href="index.php" class="nav-btn" style="background:none; border:1px solid #333; text-align:center; margin-top:20px;">Volver a Web</a>
        </aside>

        <main class="content">
            <!-- CINEMAS SECTION -->
            <section id="cinemas" class="section active">
                <h2>Gestión de Cines</h2>
                <button class="btn-primary" onclick="openCreateModal('cinema')">Nuevo Cine</button>
                <div id="cinemas-list"></div>
                
                <h2 style="margin-top:40px">Salas (Selecciona un cine primero)</h2>
                <!-- Rooms management would typically be nested or selectable -->
            </section>

            <!-- MOVIES SECTION -->
            <section id="movies" class="section">
                <h2>Gestión de Películas</h2>
                <button class="btn-primary" onclick="openCreateModal('movie')">Nueva Película</button>
                <div id="movies-list"></div>
            </section>

            <!-- ACTORS SECTION -->
            <section id="actors" class="section">
                <h2>Gestión de Actores</h2>
                <button class="btn-primary" onclick="openCreateModal('actor')">Nuevo Actor</button>
                <div id="actors-list"></div>
            </section>

            <!-- SHOWTIMES SECTION -->
            <section id="showtimes" class="section">
                <h2>Programación de Sesiones</h2>
                <button class="btn-primary" onclick="openCreateModal('showtime')">Nueva Sesión</button>
                <div id="showtimes-list"></div>
            </section>
        </main>
    </div>

    <!-- Generic Admin Modal for Forms -->
    <div id="admin-modal" class="modal hidden">
        <div class="modal-content" style="width:500px">
            <span class="close-modal" onclick="closeAdminModal()">&times;</span>
            <h2 id="modal-title">Formulario</h2>
            <form id="admin-form" enctype="multipart/form-data">
                <!-- Form fields injected by JS -->
            </form>
        </div>
    </div>

    <script src="js/utils.js"></script>
    <script src="js/admin.js?v=2"></script>
</body>
</html>
