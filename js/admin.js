document.addEventListener("DOMContentLoaded", () => {
  // Referencias a botones de navegación y secciones
  const navBtns = document.querySelectorAll(".nav-btn[data-target]");
  const sections = document.querySelectorAll(".section");

  // Manejo de la navegación (pestañas)
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Quitamos la clase 'active' de todos
      navBtns.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      // Activamos el pulsado
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");

      // Cargamos los datos de la sección correspondiente
      loadSectionData(btn.dataset.target);
    });
  });

  // Cargar datos iniciales (Cines)
  loadCinemas();

  // Manejo del formulario (Crear/Guardar)
  const adminForm = document.getElementById("admin-form");
  adminForm.addEventListener("submit", handleFormSubmit);

  // Variable para el gráfico de estadísticas
});

// Función centralizada para cargar datos según la sección
function loadSectionData(target) {
  if (target === "cinemas") loadCinemas();
  if (target === "movies") loadMovies();
  if (target === "actors") loadActors();
  if (target === "showtimes") loadShowtimes();
}

// Funciones específicas para cargar cada tipo de dato desde la API
function loadCinemas() {
  fetch("api/admin_api.php?action=list_all&table=cinemas")
    .then((res) => res.json())
    .then((data) =>
      renderTable("cinemas-list", data, ["id", "name", "address"]),
    );
}

function loadMovies() {
  fetch("api/admin_api.php?action=list_all&table=movies")
    .then((res) => res.json())
    .then((data) =>
      renderTable("movies-list", data, [
        "id",
        "title",
        "genre",
        "duration_min",
      ]),
    );
}

function loadActors() {
  fetch("api/admin_api.php?action=list_all&table=actors")
    .then((res) => res.json())
    .then((data) => renderTable("actors-list", data, ["id", "name"]));
}

function loadShowtimes() {
  fetch("api/admin_api.php?action=list_all&table=showtimes")
    .then((res) => res.json())
    .then((data) =>
      renderTable("showtimes-list", data, [
        "id",
        "movie_id",
        "room_id",
        "start_time",
      ]),
    );
}

// Función genérica para pintar una tabla con datos
function renderTable(containerId, data, columns) {
  const container = document.getElementById(containerId);
  if (!data.length) {
    container.innerHTML = "<p>No hay datos.</p>";
    return;
  }

  let html = "<table><thead><tr>";
  columns.forEach((col) => (html += `<th>${col}</th>`));
  html += "<th>Acciones</th></tr></thead><tbody>";

  data.forEach((row) => {
    html += "<tr>";
    columns.forEach((col) => (html += `<td>${row[col]}</td>`));
    // Botón de borrar y botón extra para cines (Ver salas)
    html += `<td>
            <button onclick="deleteItem('${containerId.split("-")[0]}', ${row.id})">Borrar</button>
            ${containerId === "cinemas-list" ? `<button onclick="manageRooms(${row.id}, '${row.name}')" style="margin-left:5px;background:#555;color:#fff">Ver Salas</button>` : ""}
            ${containerId === "movies-list" ? `<button onclick="manageCast(${row.id}, '${row.title}')" style="margin-left:5px;background:#007bff;color:#fff">Reparto</button>` : ""}
        </td></tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

// Gestión de Salas (se muestran debajo de los cines)
window.manageRooms = function (cinemaId, cinemaName) {
  const section = document.getElementById("cinemas");
  let roomsContainer = document.getElementById("rooms-container");
  if (!roomsContainer) {
    roomsContainer = document.createElement("div");
    roomsContainer.id = "rooms-container";
    roomsContainer.style.marginTop = "40px";
    section.appendChild(roomsContainer);
  }

  roomsContainer.innerHTML = `
        <h3>Salas de: ${cinemaName}</h3>
        <button class="btn-primary" onclick="openCreateRoomModal(${cinemaId})">Nueva Sala</button>
        <div id="rooms-list-dynamic" style="margin-top:10px">Cargando...</div>
    `;

  fetch("api/admin_api.php?action=list_all&table=rooms")
    .then((r) => r.json())
    .then((data) => {
      const filtered = data.filter((r) => r.cinema_id == cinemaId);
      renderTable("rooms-list-dynamic", filtered, ["id", "name", "capacity"]);
    });
};

window.openCreateRoomModal = function (cinemaId) {
  window.openCreateModal("room", cinemaId);
};

// Modal y Formularios dinámicos
const modal = document.getElementById("admin-modal");
const form = document.getElementById("admin-form");
let currentEntity = "";

// Abrir modal y generar campos según qué estemos creando
window.openCreateModal = function (entity, ...args) {
  currentEntity = entity;
  modal.classList.remove("hidden");
  form.innerHTML = generateFormFields(entity, ...args);
  form.innerHTML += `<button type="submit" class="btn-primary">Guardar</button>`;
};

window.closeAdminModal = function () {
  modal.classList.add("hidden");
};

// Generador de campos HTML para el formulario
// Generador de campos HTML para el formulario
function generateFormFields(entity, extraData) {
  if (entity === "cinema") {
    return `
            <input type="hidden" name="action" value="create_cinema">
            <div class="form-group"><label>Nombre</label><input name="name" required></div>
            <div class="form-group"><label>Dirección</label><input name="address" required></div>
        `;
  }
  if (entity === "movie") {
    return `
            <input type="hidden" name="action" value="create_movie">
            <div class="form-group"><label>Título</label><input name="title" required></div>
            <div class="form-group"><label>Sinopsis</label><textarea name="synopsis"></textarea></div>
            <div class="form-group"><label>Duración (min)</label><input type="number" name="duration_min"></div>
            <div class="form-group"><label>Género</label><input name="genre"></div>
            <div class="form-group"><label>Estreno</label><input type="date" name="release_date"></div>
            <div class="form-group"><label>País</label><input name="country"></div>
            <div class="form-group"><label>Cartel</label><input type="file" name="poster"></div>
        `;
  }
  if (entity === "actor") {
    return `
            <input type="hidden" name="action" value="create_actor">
            <div class="form-group"><label>Nombre</label><input name="name" required></div>
            <div class="form-group"><label>Foto</label><input type="file" name="photo"></div>
        `;
  }
  if (entity === "room") {
    // Obtenemos el ID del cine que se pasó como argumento explícito
    const cinemaId = extraData;
    return `
            <input type="hidden" name="action" value="create_room">
            <input type="hidden" name="cinema_id" value="${cinemaId}">
            <div class="form-group"><label>Nombre de la Sala</label><input name="name" required></div>
            <div class="form-group"><label>Capacidad</label><input type="number" name="capacity" value="100"></div>
        `;
  }
  if (entity === "showtime") {
    // Cargar listas de cines y películas para el select
    setTimeout(populateShowtimeSelects, 0);
    return `
            <input type="hidden" name="action" value="create_showtime">
            <div class="form-group"><label>Cine (Filtro Salas)</label><select id="st_cinema" onchange="loadRooms(this.value)"></select></div>
            <div class="form-group"><label>Sala</label><select name="room_id" id="st_room" required></select></div>
            <div class="form-group"><label>Película</label><select name="movie_id" id="st_movie" required></select></div>
            <div class="form-group"><label>Inicio</label><input type="datetime-local" name="start_time" required></div>
            <div class="form-group"><label>Precio</label><input type="number" step="0.01" name="price" value="9.00"></div>
        `;
  }
}

// Cargar opciones para el formulario de sesiones
function populateShowtimeSelects() {
  // Cargar Cines
  fetch("api/get_data.php?action=cinemas")
    .then((r) => r.json())
    .then((d) => {
      const cid = document.getElementById("st_cinema");
      if (!cid) return;
      d.forEach((c) => {
        cid.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      });
      if (d.length) loadRooms(d[0].id); // Cargar salas del primero por defecto
    });
  // Cargar Películas
  fetch("api/get_data.php?action=movies")
    .then((r) => r.json())
    .then((d) => {
      const mid = document.getElementById("st_movie");
      if (!mid) return;
      d.forEach((m) => {
        mid.innerHTML += `<option value="${m.id}">${m.title}</option>`;
      });
    });
}

// Cargar salas cuando se elige un cine
window.loadRooms = function (cinemaId) {
  if (!cinemaId) return;

  fetch("api/admin_api.php?action=list_all&table=rooms")
    .then((r) => r.json())
    .then((d) => {
      const rid = document.getElementById("st_room");
      if (!rid) return;
      rid.innerHTML = "";
      const filtered = d.filter((r) => r.cinema_id == cinemaId);

      if (filtered.length === 0) {
        rid.innerHTML = '<option value="">No hay salas</option>';
      }

      filtered.forEach((r) => {
        rid.innerHTML += `<option value="${r.id}">${r.name}</option>`;
      });
    });
};

// Manejar el envío del formulario
function handleFormSubmit(e) {
  e.preventDefault(); // Evitar recarga de página
  const formData = new FormData(e.target);
  const action = formData.get("action");

  fetch("api/admin_api.php?action=" + action, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Guardado correctamente");
        closeAdminModal();
        loadSectionData(currentEntity + "s"); // Recargar la lista
      } else {
        alert("Error del servidor: " + (data.error || "Desconocido"));
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Error de conexión");
    });
}

// Borrar elemento
window.deleteItem = function (table, id) {
  if (!confirm("¿Seguro que quieres borrar esto?")) return;

  fetch("api/admin_api.php?action=delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: table, id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadSectionData(table === "movie" ? "movies" : table); // Recargar
      } else {
        alert("Error al borrar");
      }
    });
};

// Gestión del Reparto (Cast)
window.manageCast = function (movieId, movieTitle) {
  const modal = document.getElementById("admin-modal");
  const form = document.getElementById("admin-form");

  // Configurar modal
  modal.classList.remove("hidden");
  form.innerHTML = `<h3>Cargando actores...</h3>`;

  // Traer todos los actores y los ya asignados
  Promise.all([
    fetch("api/admin_api.php?action=list_all&table=actors").then((r) =>
      r.json(),
    ),
    fetch(
      `api/admin_api.php?action=get_movie_cast&movie_id=${movieId}`,
    ).then((r) => r.json()),
  ])
    .then(([allActors, currentCastIds]) => {
      // Generar HTML del formulario
      let html = `
            <h3>Reparto: ${movieTitle}</h3>
            <input type="hidden" name="action" value="update_movie_cast">
            <input type="hidden" name="movie_id" value="${movieId}">
            <div style="max-height: 300px; overflow-y: auto; text-align: left; border: 1px solid #444; padding: 10px; margin-bottom: 15px;">
        `;

      if (allActors.length === 0) {
        html += `<p>No hay actores registrados. <a href="#" onclick="document.querySelector('[data-target=actors]').click(); closeAdminModal();">Crea uno primero</a>.</p>`;
      } else {
        allActors.forEach((actor) => {
          const isChecked = currentCastIds.includes(actor.id) ? "checked" : "";
          html += `
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" name="actors[]" value="${actor.id}" id="actor_${actor.id}" ${isChecked}>
                        <label for="actor_${actor.id}" style="display:inline; margin-left:5px; cursor:pointer">${actor.name}</label>
                    </div>
                `;
        });
      }

      html += `</div>
            <button type="submit" class="btn-primary">Guardar Reparto</button>
        `;

      form.innerHTML = html;
      currentEntity = "movie"; // Para recargar lista de pelis si hiciera falta, aunque aquí no afecta visualmente al listado principal
    })
    .catch((err) => {
      console.error(err);
      form.innerHTML = `<p style="color:red">Error al cargar datos.</p>`;
    });
};


