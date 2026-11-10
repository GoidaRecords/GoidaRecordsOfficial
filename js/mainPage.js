const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

function loadReleases() {
    const grid = document.getElementById('releases-grid');
    if (!grid) return;

    grid.innerHTML = '<p class="releases-status">Загрузка релизов...</p>';

    fetch('releases.json?t=' + Date.now()) 
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(data => {
            let releases;
            if (Array.isArray(data)) releases = data;
            else if (data.releases && Array.isArray(data.releases)) releases = data.releases;
            else releases = [data];

            grid.innerHTML = '';

            if (releases.length === 0) {
                grid.innerHTML = '<p class="releases-status">Пока нет релизов</p>';
                return;
            }

            releases.forEach(release => {
                const card = document.createElement('a');
                card.href = `release.html?id=${encodeURIComponent(release.id || release.title)}`;
                card.className = 'release-card fade-in';
                card.innerHTML = `
                    <img src="${(release.cover || '').replace(/^\//, '')}" alt="${release.title}">
                    <div class="release-info">
                        <h3>${release.title}</h3>
                        <p>${release.artist || ''}</p>
                        <div class="date">${release.date || ''}</div>
                    </div>
                `;
                grid.appendChild(card);
                observer.observe(card);
            });

        })
        .catch(err => {
            console.error('Ошибка загрузки релизов:', err);
            grid.innerHTML = `<p class="releases-status" style="color:#ff3b3b;">Не удалось загрузить релизы: ${err.message}</p>`;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadReleases();

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadReleases);
    }
});
