document.addEventListener('DOMContentLoaded', ()=> { 
    document.getElementById('botonRetar').addEventListener('click', ()=>{
        let usuarioARetar = document.getElementById('usuarioARetar').value;
        let retador = localStorage.getItem('pocketMonstersUsuario');
        if (usuarioARetar.toLowerCase() === retador.toLowerCase()){
            alert('No te pueder retar a ti mismo');
        }
        else{
            console.log(document.getElementById('usuarioARetar').value);
            //fetchal server
            fetch(`http://localhost:8080/enviarinvitacion?retador=${retador}&retado=${usuarioARetar}`,{ method: 'POST' })
            .then(resultado => resultado.json())
            .then(resultado =>{
                document.getElementById('mensaje').innerHTML = resultado['mensaje'];
            })
        }
    });
    
});
