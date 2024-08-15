function agregarAmigo() {
    const emailOrUsername = document.getElementById('emailOrUsername').value;

    // Aquí debes implementar la lógica para enviar una solicitud de amistad
    // Esto podría involucrar una llamada a una API, una base de datos, etc.
    // Por ejemplo, podrías simular la adición del amigo así:
    const li = document.createElement('li');
    li.textContent = emailOrUsername;
    document.getElementById('listaAmigos').appendChild(li);

      // Mostrar alerta de éxito
      alert('Solicitud de amistad enviada con exito');

    // Limpiar el campo de entrada
    document.getElementById('emailOrUsername').value = '';
}
