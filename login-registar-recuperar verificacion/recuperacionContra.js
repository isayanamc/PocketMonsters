document.addEventListener('DOMContentLoaded', ()=> {
    const button = document.getElementById('recuperar');
    button.addEventListener('click', () => {
        const emailTesteado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (emailTesteado){
            document.getElementById('failDiv').innerHTML = "";
            console.log(`${email} ${contra}`);
        }
        else {
            document.getElementById('failDiv').style = "height: 25px";
            document.getElementById('failDiv').innerHTML = `<span style="color: red;">Tu email no tiene un formato correcto</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
        }

    });
    
    
    //document.getElementById("failDiv");

});