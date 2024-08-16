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
            console.log(response); // Log the entire response object
            return response.json();
        })
        .then(data => {
            console.log(data['HP']); // Log the parsed JSON data
            console.log(data['Attack']);
            document.getElementById('HP').innerHTML = `HP: ${data['HP']}`;
            document.getElementById('Ataque').innerHTML = `Ataque: ${data['Attack']}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    });

    const button = document.getElementById('agregarPokemon');
    button.addEventListener('click', function() {
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
            if (listaPokemons.length == 6){
                const newButton = document.createElement('button');
                newButton.innerText = 'Agregar equipo';
                newButton.id = 'AgregarEquipo';
                document.getElementById('Equipo').appendChild(newButton);
            }
        }

    });
});