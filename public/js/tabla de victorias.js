document.addEventListener('DOMContentLoaded', () => {
    console.log(documents);
    
    
    const ul = document.getElementById('leaderboard');

    
    documents
        .sort((a, b) => b.victorias - a.victorias)
        .forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="username">${user.nombreusuario}</span><span class="victorias">${user.victorias}</span>`;
            ul.appendChild(li);
        })
});
