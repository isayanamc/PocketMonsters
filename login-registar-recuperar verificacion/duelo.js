document.addEventListener('DOMContentLoaded', ()=> {
    console.log(resultado.infoduelo);


    /*
    fetch("http://localhost:3000/duelo/0")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });
    */

    //-----------------------------------------------------------------------------------------------------------
    
    
    const botonAtacar = document.getElementById("botonAtacar");
    botonAtacar.addEventListener("click", () => {
        const pokemonJugador1 = document.querySelector('input[name="team1"]:checked');
        const pokemonJugador2 = document.querySelector('input[name="team2"]:checked');

        if (pokemonJugador1 && pokemonJugador2) {
            console.log(pokemonJugador1.value);
            console.log("Jugador 2:", pokemonJugador2.value);
        } else {
            console.log("No selecciono los 2 opciones");
        }
    });

    

});