const ICON_PATHS = {
    spotify: 'icons/spotify.svg',
    yandex: 'icons/yandex.svg',
    vk: 'icons/vk.svg',
    apple: 'icons/apple.svg',
    youtube: 'icons/youtube.svg'
};

const PLATFORM_LABELS = {
    spotify: 'Spotify',
    yandex: 'Yandex Music',
    vk: 'VK Music',
    apple: 'Apple Music',
    youtube: 'YouTube Music'
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    fetch('releases.json')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(data => {
            let releases;
            if (Array.isArray(data)) releases = data;
            else if (data.releases && Array.isArray(data.releases)) releases = data.releases;
            else releases = [data];

            const release = releases.find(r => r.id === id || r.title === id);

            if (!release) {
                document.querySelector('.release-page').innerHTML =
                    '<p style="color:#ff3b3b;text-align:center;padding:100px 20px;">Релиз не найден</p>';
                return;
            }

            document.title = `${release.title} — ${release.artist} | GOIDA RECORDS`;

            const cover = (release.cover || '').replace(/^\//, '');
            const coverImg = document.getElementById('release-cover');
            coverImg.src = cover;
            coverImg.alt = release.title;

            document.getElementById('release-title').textContent = release.title;
            document.getElementById('release-artist').textContent = release.artist || '';
            document.getElementById('release-description').textContent = release.description || '';
            document.getElementById('release-type').textContent = release.date || 'Сингл';
            document.getElementById('release-lyrics').textContent = release.lyrics || '';

            const container = document.getElementById('release-platforms');
            container.innerHTML = '';

            if (release.links) {
                Object.keys(PLATFORM_LABELS).forEach(key => {
                    const url = release.links[key];
                    if (!url || url === 'Пока нет' || url.trim() === '') return;

                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'platform-btn';
                    
                    // Вставляем тег <img> вместо длинного SVG
                    a.innerHTML = `
                        <img src="${ICON_PATHS[key]}" alt="${PLATFORM_LABELS[key]} icon" class="platform-icon">
                        ${PLATFORM_LABELS[key]}
                    `;
                    container.appendChild(a);
                });
            }

            if (container.children.length === 0) {
                container.innerHTML = '<p style="color:#888;">Ссылки на площадки скоро появятся</p>';
            }
        })
        .catch(err => {
            console.error('Ошибка загрузки релиза:', err);
            document.querySelector('.release-page').innerHTML =
                '<p style="color:#ff3b3b;text-align:center;padding:100px 20px;">Не удалось загрузить релиз</p>';
        });
});