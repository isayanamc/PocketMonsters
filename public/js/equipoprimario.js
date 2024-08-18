document.addEventListener('DOMContentLoaded', () => {
    // selecciona el select para agregar equipos
    const EquipoUsuario = document.getElementById('EquipoUsuario'); 
    let info;

    // obtine la info del user
    fetch(`http://localhost:8080/userinfo?usuario=${localStorage.getItem('pocketMonstersUsuario')}`)
    .then(respuesta => respuesta.json())
    .then(data => {
        info = data;
        if (info['equipos'].length === 0) {
            document.getElementById('mensaje').innerHTML = 'No tienes equipos registrados.<a href="/crearequipo" id="linkCrear">Crear equipos</a>';
            const boton = document.getElementById('agregarPokemon');
            boton.disabled = true;
        }
        else {
            info['equipos'].forEach(elemento => {
                const equiponuevo = document.createElement('option');
                equiponuevo.value = elemento['nombre'];
                equiponuevo.text = elemento['nombre'];
                EquipoUsuario.appendChild(equiponuevo);
            });
            document.getElementById('nombreEquipo').innerHTML = EquipoUsuario.value;

            const selectedTeam = info['equipos'].find(elemento => elemento['nombre'] === EquipoUsuario.value);
            for (let i = 0; i < selectedTeam['equipo'].length; i++) {
                document.getElementById(i.toString()).innerHTML = selectedTeam['equipo'][i];
            }
        }
    });


    EquipoUsuario.addEventListener("change", () => {
        document.getElementById('nombreEquipo').innerHTML = EquipoUsuario.value;

        const selectedTeam = info['equipos'].find(elemento => elemento['nombre'] === EquipoUsuario.value);
        for (let i = 0; i < selectedTeam['equipo'].length; i++) {
            document.getElementById(i.toString()).innerHTML = selectedTeam['equipo'][i];
        }
    });

    document.getElementById('agregarPokemon').addEventListener("click", () => {
        const equiposeleccionado = document.getElementById('EquipoUsuario').value;
        const usuario = localStorage.getItem('pocketMonstersUsuario');
        fetch(`http://localhost:8080/seleccionarequipoprimario?usuario=${usuario}&equiposeleccionado=${equiposeleccionado}`,{ method: 'POST'})
        .then(resultado => resultado.json())
        .then(resultado =>{
            document.getElementById('mensaje').innerHTML = resultado['mensaje'];
             
        })
    });
});
