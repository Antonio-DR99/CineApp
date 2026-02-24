// Función para mostrar alertas personalizadas
function showCustomAlert(message, type = 'info') {
    let modal = document.getElementById('custom-alert-modal');
    
    // Si no existe el modal en el DOM, lo creamos dinámicamente
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-alert-modal';
        modal.className = 'modal hidden'; // Usamos las mismas clases que los otros modales
        modal.innerHTML = `
            <div class="modal-content alert-content">
                <span class="close-alert">&times;</span>
                <h3 id="alert-title" style="margin-bottom:15px;">Mensaje</h3>
                <p id="alert-message" style="color:#ddd; font-size:1.1em;"></p>
                <div style="text-align:center; margin-top:25px;">
                    <button id="alert-ok-btn" class="btn-primary" style="padding: 8px 30px;">Aceptar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Eventos para cerrar
        const closeFunc = () => modal.classList.add('hidden');
        modal.querySelector('.close-alert').addEventListener('click', closeFunc);
        modal.querySelector('#alert-ok-btn').addEventListener('click', closeFunc);
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeFunc();
        });
    }
    
    const title = modal.querySelector('#alert-title');
    const msg = modal.querySelector('#alert-message');
    
    // Determinamos el tipo de alerta para darle color/título (simple heurística si no se pasa tipo)
    if (type === 'info' && (message.toLowerCase().includes('error') || message.toLowerCase().includes('fallo'))) {
        type = 'error';
    } else if (type === 'info' && (message.toLowerCase().includes('éxito') || message.toLowerCase().includes('correctamente'))) {
        type = 'success';
    }

    msg.textContent = message;
    
    if (type === 'error') {
        title.textContent = '¡Ups!';
        title.style.color = '#e50914'; // Rojo
    } else if (type === 'success') {
        title.textContent = '¡Genial!';
        title.style.color = '#46d369'; // Verde
    } else {
        title.textContent = 'Información';
        title.style.color = '#fff';
    }

    modal.classList.remove('hidden');
}

// Sobrescribimos la función nativa alert del navegador
// Así, cualquier `alert()` que ya exista en el código usará este nuevo diseño automáticamente
window.alert = function(message) {
    showCustomAlert(message);
};
