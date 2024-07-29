let equipos = []; // Array para almacenar los equipos creados
const formularioEquipo = document.getElementById('formularioEquipo');
const listaEquipos = document.getElementById('listaEquipos');

// Función para mostrar la lista de equipos creados en la tabla de escogencia
function mostrarEquipos() {
    listaEquipos.innerHTML = ''; // Limpiar lista antes de volver a mostrar

    equipos.forEach((equipo, index) => {
        let equipoItem = document.createElement('div');
        equipoItem.classList.add('equipo-item');
        equipoItem.innerHTML = `
            <h3>${equipo.nombre}</h3>
            <p><strong>Pokémon:</strong> ${equipo.pokemon}</p>
            <p><strong>Fuerza:</strong> ${equipo.fuerza}</p>
            <p><strong>Velocidad:</strong> ${equipo.velocidad}</p>
            <p><strong>Edad:</strong> ${equipo.edad}</p>
            <button class="editar-equipo" data-index="${index}">Editar</button>
            <button class="eliminar-equipo" data-index="${index}">Eliminar</button>
            <button class="seleccionar-equipo" data-index="${index}">Seleccionar</button>
        `;
        listaEquipos.appendChild(equipoItem);
    });
}

// Evento delegado para editar, eliminar o seleccionar un equipo
listaEquipos.addEventListener('click', function(event) {
    if (event.target.classList.contains('editar-equipo')) {
        let index = parseInt(event.target.getAttribute('data-index'));
        editarEquipo(index);
    } else if (event.target.classList.contains('eliminar-equipo')) {
        let index = parseInt(event.target.getAttribute('data-index'));
        eliminarEquipo(index);
    } else if (event.target.classList.contains('seleccionar-equipo')) {
        let index = parseInt(event.target.getAttribute('data-index'));
        seleccionarEquipo(index);
    }
});

// Función para editar un equipo
function editarEquipo(index) {
    let equipo = equipos[index];
    document.getElementById("nombreEquipo").value = equipo.nombre;
    document.getElementById("pokemon").value = equipo.pokemon;
    document.getElementById("fuerza").value = equipo.fuerza;
    document.getElementById("velocidad").value = equipo.velocidad;
    document.getElementById("edad").value = equipo.edad;
    formularioEquipo.dataset.index = index;
}

// Función para eliminar un equipo
function eliminarEquipo(index) {
    if (confirm(`¿Estás seguro de que deseas eliminar el equipo "${equipos[index].nombre}"?`)) {
        equipos.splice(index, 1);
        mostrarEquipos();
    }
}

// Función para seleccionar un equipo
function seleccionarEquipo(index) {
    let equipo = equipos[index];
    
    // Verificar si ya se mostró el pop-up para este equipo
    if (!localStorage.getItem(`equipoSeleccionado_${index}`)) {
        alert(`Equipo seleccionado: ${equipo.nombre}`);
        
        // Marcar como mostrado en localStorage
        localStorage.setItem(`equipoSeleccionado_${index}`, 'true');
    } else {
        console.log(`El pop-up para ${equipo.nombre} ya se mostró anteriormente.`);
    }
}


// Función para agregar un equipo nuevo
formularioEquipo.addEventListener('submit', function(event) {
    event.preventDefault();

    let nuevoEquipo = {
        nombre: document.getElementById("nombreEquipo").value,
        pokemon: document.getElementById("pokemon").value,
        fuerza: document.getElementById("fuerza").value,
        velocidad: document.getElementById("velocidad").value,
        edad: document.getElementById("edad").value
    };

    if (formularioEquipo.dataset.index !== undefined) {
        let index = parseInt(formularioEquipo.dataset.index);
        equipos[index] = nuevoEquipo;
        delete formularioEquipo.dataset.index;
    } else {
        equipos.push(nuevoEquipo);
    }

    formularioEquipo.reset();
    mostrarEquipos();
});

// Evento para el botón "Crear Nuevo Grupo"
document.getElementById('crearGrupo').addEventListener('click', function() {
    formularioEquipo.reset();
    delete formularioEquipo.dataset.index;
});

// Llamada inicial para mostrar los equipos (vacío al inicio)
mostrarEquipos();
