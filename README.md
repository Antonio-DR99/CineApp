# 🎬 CineApp - Gestión Integral de Cines 🎬

**CineApp** es una aplicación web robusta diseñada para la gestión de carteleras cinematográficas, administración de salas y control de sesiones. Combina un frontend dinámico basado en AJAX con un backend sólido en PHP y una base de datos relacional MySQL.

![Estado](https://img.shields.io/badge/Status-Desarrollo_Completo-success)
![PHP](https://img.shields.io/badge/Backend-PHP_7.4+-777bb4)
![MySQL](https://img.shields.io/badge/Database-MySQL-00758f)
![JS](https://img.shields.io/badge/Frontend-AJAX/JS-f7df1e)

---

## 🌟 Funcionalidades Principales

### 🍿 Lado del Usuario (Cartelera)

- **Visualización Dinámica:** Listado de películas cargado dinámicamente mediante AJAX según el cine seleccionado.
- **Detalles en Tiempo Real:** Modal interactivo que muestra sinopsis, reparto (actores), género, duración y horarios de las sesiones.
- **Filtro por Cine:** Selector rápido para cambiar entre los diferentes complejos cinematográficos disponibles.

### 🛠️ Panel de Administración

- **Gestión de Entidades:** CRUD completo para Cines, Salas, Películas y Actores.
- **Programación de Sesiones:** Asignación de películas a salas específicas con control de horarios y precios.
- **Interfaz Multi-Panel:** Panel administrativo tipo "Dashboard" con navegación fluida entre secciones.
- **Subida de Archivos:** Soporte para la carga de pósters de películas y fotos de actores directamente desde el panel.

---

## 🚀 Tecnologías y Arquitectura

- **Backend:** PHP orientado a servicios (API).
- **Base de Datos:** MySQL con integridad referencial (claves foráneas) y borrado en cascada.
- **Frontend:** HTML5 semántico, CSS3 moderno (Flexbox/Grid) y JavaScript (Fetch API).
- **Comunicación:** Arquitectura desacoplada donde el frontend consume una API interna que devuelve datos en formato **JSON**.

---

## 📂 Estructura del Directorio

```text
07-practica/
├── api/                # Endpoints de la API (get_data.php, admin_api.php)
├── assets/             # Imágenes, pósters y recursos estáticos
├── config/             # Configuración de base de datos y constantes
├── css/                # Estilos generales y del panel admin
├── js/                 # Lógica de cliente (app.js, admin.js, utils.js)
├── logs/               # Registros de errores y actividad
├── index.php           # Página principal (Cartelera pública)
├── admin.php           # Portal de administración
└── install.sql         # Script de creación de base de datos y datos dummy
```

---

## ⚙️ Instalación

1.  **Base de Datos:**
    - Importa el archivo `install.sql` en tu servidor MySQL (vía phpMyAdmin o terminal). Esto creará la base de datos `cine_app` y las tablas necesarias.
2.  **Configuración:**
    - Ajusta las credenciales de conexión en el archivo dentro de la carpeta `config/` (normalmente `db.php` o similar).
3.  **Servidor:**
    - Despliega el proyecto en un entorno local (XAMPP/WAMP) y accede a través de `http://localhost/07-practica/`.

---

_Este proyecto demuestra habilidades avanzadas en integración de bases de datos, desarrollo de APIs internas y manejo asíncrono con JavaScript._
