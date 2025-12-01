// 🎬 Cine Gama - Integração entre Webchat e Cards de Filmes
(function () {
    const HIGHLIGHT_CLASS = 'movie-card--spotlight';
    const AUTO_HIGHLIGHT_TIMEOUT = 6500;
    const TRUSTED_ORIGINS = [
        'https://dl.watson-orchestrate.ibm.com',
        window.location.origin
    ];

    let movieIndex = new Map();
    let lastHighlightedCard = null;
    let highlightTimeout = null;

    const removeDiacritics = (text) =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

    const ensureMovieIndex = () => {
        if (!movieIndex.size) {
            buildMovieIndex();
        }
    };

    const buildMovieIndex = () => {
        movieIndex = new Map();

        const cards = document.querySelectorAll('.movie-card');
        cards.forEach((card) => {
            const title = card.dataset.filmeTitle || card.querySelector('.movie-title')?.textContent;
            if (!title) {
                return;
            }

            const normalizedTitle = removeDiacritics(title);
            movieIndex.set(normalizedTitle, {
                card,
                title
            });
        });

        if (movieIndex.size) {
            console.debug('🎯 Índice de filmes disponível para integração com o chat', [...movieIndex.keys()]);
        }
    };

    const focusMoviesSection = (notify = true) => {
        const moviesSection = document.getElementById('filmes');
        if (!moviesSection) {
            return false;
        }

        moviesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (notify && window.CineGamaApp?.showNotification) {
            window.CineGamaApp.showNotification(
                'Filmes em destaque',
                'Posicionando nos filmes em cartaz.',
                'info'
            );
        }

        return true;
    };

    const focusMovieByTitle = (rawTitle, options = {}) => {
        if (!rawTitle) {
            return false;
        }

        ensureMovieIndex();

        const normalizedTitle = removeDiacritics(rawTitle);
        let entry = movieIndex.get(normalizedTitle);

        if (!entry) {
            // Tentativa de correspondência parcial
            for (const [key, value] of movieIndex.entries()) {
                if (key.includes(normalizedTitle)) {
                    entry = value;
                    break;
                }
            }
        }

        if (!entry) {
            console.debug(`🎬 Não foi possível localizar o filme solicitado: "${rawTitle}"`);
            return false;
        }

        highlightMovieCard(entry.card, entry.title, options.notify);
        return true;
    };

    const highlightMovieCard = (card, title, notify = true) => {
        if (!card) {
            return;
        }

        if (lastHighlightedCard && lastHighlightedCard !== card) {
            lastHighlightedCard.classList.remove(HIGHLIGHT_CLASS);
        }

        card.classList.add(HIGHLIGHT_CLASS);
        lastHighlightedCard = card;

        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '-1');
        }

        card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        card.focus({ preventScroll: true });

        if (notify && window.CineGamaApp?.showNotification) {
            window.CineGamaApp.showNotification(
                'Filme localizado',
                `Destacando "${title}" na vitrine.`,
                'info'
            );
        }

        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }

        highlightTimeout = setTimeout(() => {
            card.classList.remove(HIGHLIGHT_CLASS);
            highlightTimeout = null;
            lastHighlightedCard = null;
        }, AUTO_HIGHLIGHT_TIMEOUT);
    };

    const handleIncomingMessage = (event) => {
        const { origin, data } = event;

        if (!data) {
            return;
        }

        if (origin && !TRUSTED_ORIGINS.includes(origin)) {
            return;
        }

        const parsed = parseMessageData(data);
        if (!parsed) {
            return;
        }

        if (parsed.type === 'cine-gama.focusMovie') {
            const title = parsed.payload?.title || parsed.title;
            focusMovieByTitle(title, { notify: parsed.payload?.notify !== false });
            return;
        }

        if (parsed.type === 'cine-gama.focusMoviesSection') {
            focusMoviesSection(parsed.payload?.notify !== false);
            return;
        }

        if (shouldAutoDetect(parsed)) {
            autoHighlightFromPayload(parsed);
        }
    };

    const parseMessageData = (data) => {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (error) {
                return { raw: data };
            }
        }

        if (typeof data === 'object') {
            return data;
        }

        return null;
    };

    const shouldAutoDetect = (payload) => {
        if (!payload) {
            return false;
        }

        const messageType = typeof payload.type === 'string' ? payload.type.toLowerCase() : '';
        const eventType = typeof payload.event === 'string' ? payload.event.toLowerCase() : '';

        if (messageType.includes('conversation') || messageType.includes('message')) {
            return true;
        }

        if (eventType.includes('message')) {
            return true;
        }

        if (payload.payload?.role === 'assistant' || payload.payload?.role === 'user') {
            return true;
        }

        return false;
    };

    const autoHighlightFromPayload = (payload) => {
        ensureMovieIndex();

        if (!movieIndex.size) {
            return;
        }

        const serialized = JSON.stringify(payload);
        if (!serialized) {
            return;
        }

        const normalizedSerialized = removeDiacritics(serialized);

        for (const [normalizedTitle, info] of movieIndex.entries()) {
            if (normalizedSerialized.includes(normalizedTitle)) {
                focusMovieByTitle(info.title, { notify: false });
                break;
            }
        }
    };

    document.addEventListener('cine-gama:movies-rendered', buildMovieIndex);
    window.addEventListener('message', handleIncomingMessage, false);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        buildMovieIndex();
    } else {
        document.addEventListener('DOMContentLoaded', buildMovieIndex, { once: true });
    }

    window.CineGamaIntegrations = {
        focusMovieByTitle,
        focusMoviesSection,
        buildMovieIndex
    };
})();
