document.addEventListener('DOMContentLoaded', () => {
    // ingresar boton event listener. 
    const button = document.getElementById('registar');
    button.addEventListener('click', () => {
        const email = document.getElementById('Email').value; 
        const contra1 = document.getElementById('contra1').value;
        const contra2 = document.getElementById('contra2').value;
        const userNombre = document.getElementById('userNombre').value;

        // ------------- Check por espacios en blanco -------------------------------------------------------
        if (email === "" || contra1 === "" || contra2 === "" || userNombre === "") {
            if (email === "") {
                document.getElementById('Email').style.border = "red 1px solid";
            } else {
                document.getElementById('Email').style.border = "";
            }
            
            if (contra1 === "") {
                document.getElementById('contra1').style.border = "red 1px solid";
            } else {
                document.getElementById('contra1').style.border = "";
            }
            if (contra2 === "") {
                document.getElementById('contra2').style.border = "red 1px solid";
            } else {
                document.getElementById('contra2').style.border = "";
            }
            if (userNombre === ""){
                document.getElementById('userNombre').style.border = "red 1px solid";
            } else {
                document.getElementById('userNombre').style.border = "";
            }
            document.getElementById('failDiv').style = "height: 25px";
            document.getElementById('failDiv').innerHTML = `<span style="color: red;">Debes llenar los espacios en rojo</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
        } else {
            document.getElementById('Email').style.border = "";
            document.getElementById('contra1').style.border = "";
            document.getElementById('contra2').style.border = "";
            document.getElementById('userNombre').style.border = "";
            document.getElementById('failDiv').style = "height: 0px";
            document.getElementById('failDiv').innerHTML = "";
            const emailTesteado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            // ------------- Check el nombre de usuario no este escogido -------------------------------------------------------







            // -----------check contrasena iguales 

            if (contra1 !== contra2){
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">Las contraseñas deben ser iguales</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }
            // ------------- check cantidad de caracteres y numeros --------------------------------------------------

            // const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            // regex.test(password);

            // ----------- Check para el formato del email -------------------------------------------------------

            else if (emailTesteado) {
                document.getElementById('failDiv').style = "height: 0px";
                document.getElementById('failDiv').innerHTML = "";
                console.log(`Email: ${email}, contrasena: ${contra1}, contrasena2: ${contra2}, nombre de usuario: ${userNombre}`);
            }
            else if (!emailTesteado) {
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">Tu email no tiene un formato correcto</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }

        }
    });
});
