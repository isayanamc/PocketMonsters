document.addEventListener('DOMContentLoaded', ()=> {
    // ingresar boton event listener. 
    const button = document.getElementById('ingresar');
    button.addEventListener('click', function() {
        const email = document.getElementById('Email').value; 
        const contra = document.getElementById('contra').value;

        // ------------- Check por espacios en blanco -------------------------------------------------------
        if (email == "" || contra == "") {
            if (email == "") {
                document.getElementById('Email').style.border = "red 1px solid";
            } else {
                document.getElementById('Email').style.border = "";
            }
            
            if (contra == "") {
                document.getElementById('contra').style.border = "red 1px solid";
            } else {
                document.getElementById('contra').style.border = "";
            }
        } else {
            document.getElementById('Email').style.border = "";
            document.getElementById('contra').style.border = "";

            // ----------- Check para el formato del email -------------------------------------------------------
            const emailTesteado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (emailTesteado){
                document.getElementById('failDiv').innerHTML = "";
                console.log(`${email} ${contra}`);
            }
            else {
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">Usuario o contrasena incorrecta</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }
        }
    });
});