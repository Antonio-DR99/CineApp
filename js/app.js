// Esperamos a que todo el HTML se cargue antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos del HTML
  const cinemaSelect = document.getElementById("cinema-select");
  const moviesGrid = document.getElementById("movies-grid");
  const movieModal = document.getElementById("movie-modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.querySelector(".close-modal");

  // 1. Cargar la lista de Cines al iniciar
  fetch("api/get_data.php?action=cinemas")
    .then((res) => res.json()) // Convertimos la respuesta a JSON
    .then((cinemas) => {
      // Por cada cine, creamos una opción en el desplegable
      cinemas.forEach((cinema) => {
        const option = document.createElement("option");
        option.value = cinema.id;
        option.textContent = cinema.name;
        cinemaSelect.appendChild(option);
      });

      // Si hay cines, seleccionamos el primero automáticamente
      if (cinemas.length > 0) {
        cinemaSelect.value = cinemas[0].id;
        loadMovies(cinemas[0].id); // Cargamos las películas del primer cine
      }
    });

  // 2. Evento: Cuando el usuario cambia de cine
  cinemaSelect.addEventListener("change", (e) => {
    loadMovies(e.target.value); // Cargamos las películas del cine seleccionado
  });

  // Función para cargar las películas de un cine específico
  function loadMovies(cinemaId) {
    moviesGrid.innerHTML = ""; // Limpiamos la cuadrícula antes de añadir nuevas
    if (!cinemaId) return;

    // Pedimos las películas al servidor
    fetch(`api/get_data.php?action=movies&cinema_id=${cinemaId}`)
      .then((res) => res.json())
      .then((movies) => {
        // Si no hay películas, mostramos un mensaje
        if (movies.length === 0) {
          moviesGrid.innerHTML =
            "<p>No hay películas disponibles en este cine.</p>";
        }

        // Creamos las tarjetas de las películas
        movies.forEach((movie) => {
          const card = document.createElement("div");
          card.className = "movie-card";
          // Usamos una imagen por defecto si no tiene póster
          const poster =
            movie.poster_path || "https://via.placeholder.com/200x300";

          card.innerHTML = `
                        <img src="${poster}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                    `;

          // Al hacer clic en la tarjeta, abrimos el modal con detalles
          card.addEventListener("click", () => openModal(movie.id));
          moviesGrid.appendChild(card);
        });
      });
  }

  // Función para abrir el modal con los detalles de la película
  function openModal(movieId) {
    modalBody.innerHTML = "<p>Cargando información...</p>";
    movieModal.classList.remove("hidden"); // Mostramos el modal

    // Pedimos los detalles completos de la película
    fetch(`api/get_data.php?action=movie_details&id=${movieId}`)
      .then((res) => res.json())
      .then((movie) => {
        // Preparamos el HTML de los actores
        const actorsHtml =
          movie.actors && movie.actors.length
            ? movie.actors
                .map(
                  (actor) => `
                    <div class="actor-item">
                        <img src="${actor.photo_path || "https://via.placeholder.com/60"}" alt="${actor.name}">
                        <div style="font-size:0.8em">${actor.name}</div>
                    </div>
                `,
                )
                .join("")
            : "<p>No hay información de actores.</p>";

        // Preparamos el HTML de los horarios
        const showtimesHtml =
          movie.showtimes && movie.showtimes.length
            ? movie.showtimes
                .map(
                  (st) => `
                    <div class="showtime-badge">
                        ${st.room_name} - ${new Date(st.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                `,
                )
                .join("")
            : "<p>No hay sesiones programadas.</p>";

        // Insertamos toda la información en el modal
        modalBody.innerHTML = `
                    <div class="modal-detail-layout">
                        <img src="${movie.poster_path || "https://via.placeholder.com/300x450"}" class="modal-poster" alt="${movie.title}">
                        <div class="modal-info">
                            <h2>${movie.title}</h2>
                            <p><strong>Sinopsis:</strong> ${movie.synopsis}</p>
                            <p><strong>Género:</strong> ${movie.genre} | <strong>Duración:</strong> ${movie.duration_min} min</p>
                            <p><strong>Estreno:</strong> ${movie.release_date} | <strong>País:</strong> ${movie.country}</p>
                            
                            <strong>Reparto:</strong>
                            <div class="actor-list">${actorsHtml}</div>
                            
                            <div class="showtimes-list">
                                <h4>Horarios</h4>
                                ${showtimesHtml}
                            </div>
                        </div>
                    </div>
                `;
      });
  }

  // Evento: Cerrar el modal al hacer clic en la X
  closeModal.addEventListener("click", () => {
    movieModal.classList.add("hidden");
  });

  // Evento: Cerrar el modal al hacer clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === movieModal) {
      movieModal.classList.add("hidden");
    }
  });
});
