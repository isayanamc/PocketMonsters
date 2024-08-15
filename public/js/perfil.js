document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Nombre de Usuario';
    const fotoPerfil = localStorage.getItem('fotoPerfil') || 'default-profile.jpg';
    
    document.getElementById('nombre-usuario').innerText = nombreUsuario;
    document.getElementById('foto-perfil').src = fotoPerfil;
});
