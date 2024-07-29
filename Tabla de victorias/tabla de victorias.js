document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = [
        { username: 'Usuario1', victories: 15 },
        { username: 'Usuario2', victories: 12 },
        { username: 'Usuario3', victories: 10 },
        { username: 'Usuario4', victories: 8 },
        { username: 'Usuario5', victories: 5 }
    ];

    const ul = document.getElementById('leaderboard');

    leaderboard
        .sort((a, b) => b.victories - a.victories) // Ordenar por número de victorias
        .forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="username">${user.username}</span><span class="victories">${user.victories}</span>`;
            ul.appendChild(li);
        });
});
