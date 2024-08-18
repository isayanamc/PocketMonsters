document.addEventListener('DOMContentLoaded', ()=> {
    let listaPokemons = [];
    let numeroPokemon = 0;
    console.log(documents[0]['Name']);
    let HP = document.getElementById('HP');
    let ataque = document.getElementById('ataque');
    document.getElementById("pokemon").addEventListener("change", ()=> {
        const nombre = document.getElementById('pokemon').value;
        fetch(`http://localhost:8080/datopokemon?nombre=${nombre}`)
        .then(response => {
            console.log(response); 
            return response.json();
        })
        .then(data => {
            console.log(data['HP']);
            console.log(data['Attack']);
            document.getElementById('HP').innerHTML = `HP: ${data['HP']}`;
            document.getElementById('Ataque').innerHTML = `Ataque: ${data['Attack']}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    });

    const button = document.getElementById('agregarPokemon');
    button.addEventListener('click', async ()=> {
        const pokemon = document.getElementById('pokemon').value;
        if (listaPokemons.includes(pokemon)){
            alert('No puedes repetir Pokemons');
        }
        else if (listaPokemons.length >= 6){
            alert('solo puedes tener 6 Pokemons por equipo');
        }
        else {
            document.getElementById(`${numeroPokemon.toString()}`).innerHTML = pokemon;
            listaPokemons.push(pokemon);
            numeroPokemon++;
        }

    });

    let boton = document.getElementById('AgregarEquipo');
    boton.addEventListener('click', async () =>{
        const pokemon = document.getElementById('pokemon').value;
        // enviar info a la base de datos
        let nombreEquipo = document.getElementById('nombreEquipo').value;
        if (nombreEquipo.length > 0){
            console.log(listaPokemons.length);
            if (listaPokemons.length < 5){
                alert('Debes seleccionar al 6 Pokemons');
            }
            else if (listaPokemons.length == 6) {
                const nuevoEquipo = {
                    "primario": false,
                    "nombre": nombreEquipo,
                    'equipo' : listaPokemons
                };
                fetch(`http://localhost:8080/agregarequipobasededatos?nombre=${localStorage.getItem('pocketMonstersUsuario')}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoEquipo), 
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('mensaje').innerHTML = 'Equipo agregado correctamente';
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            
        
        }
        else {
            alert('El nombre del equipo no puede estar en blanco');
        }

    });
});