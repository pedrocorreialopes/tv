// Configuração dos vídeos do YouTube
const videos = [
    'bg5Djyh4gNs', // Vídeo 1
    'i8Iox78HK9E', // Vídeo 2
    'LB2YU6gcHtA', // Vídeo 3
    'RhnqF2L9dZQ', // Vídeo 4
    'wYM3cN-tMxw'  // Vídeo 5
];

let player;
let currentVideoIndex = 0;
let isPlaying = false;
let currentVolume = 50;

// Inicializar o player do YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videos[currentVideoIndex],
        playerVars: {
            'playsinline': 1,
            'controls': 0, // Ocultar controles do YouTube
            'rel': 0,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Player está pronto
function onPlayerReady(event) {
    player.setVolume(currentVolume);
    updateVolumeDisplay();
    updateChannelDisplay();
}

// Mudança de estado do player
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton();
    }
}

// Atualizar botão play/pause
function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('play-pause');
    const btnLabel = playPauseBtn.querySelector('.btn-label');
    btnLabel.textContent = isPlaying ? '⏸️' : '▶️';
}

// Atualizar display do canal
function updateChannelDisplay() {
    const channelDisplay = document.getElementById('channel-display');
    channelDisplay.textContent = String(currentVideoIndex + 1).padStart(2, '0');
}

// Atualizar display de volume
function updateVolumeDisplay() {
    const volumeFill = document.getElementById('volume-fill');
    const volumeText = document.getElementById('volume-text');
    
    volumeFill.style.width = currentVolume + '%';
    volumeText.textContent = currentVolume + '%';
}

// Mudar para próximo vídeo (canal)
function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    player.loadVideoById(videos[currentVideoIndex]);
    updateChannelDisplay();
    addChannelChangeEffect();
}

// Mudar para vídeo anterior (canal)
function previousVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    player.loadVideoById(videos[currentVideoIndex]);
    updateChannelDisplay();
    addChannelChangeEffect();
}

// Efeito visual ao mudar de canal
function addChannelChangeEffect() {
    const staticOverlay = document.querySelector('.static-overlay');
    staticOverlay.style.opacity = '0.8';
    setTimeout(() => {
        staticOverlay.style.opacity = '0.3';
    }, 200);
}

// Alternar play/pause
function togglePlayPause() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// Aumentar volume
function increaseVolume() {
    if (currentVolume < 100) {
        currentVolume = Math.min(100, currentVolume + 10);
        player.setVolume(currentVolume);
        updateVolumeDisplay();
    }
}

// Diminuir volume
function decreaseVolume() {
    if (currentVolume > 0) {
        currentVolume = Math.max(0, currentVolume - 10);
        player.setVolume(currentVolume);
        updateVolumeDisplay();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botão canal anterior
    document.getElementById('prev-channel').addEventListener('click', previousVideo);
    
    // Botão play/pause
    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    
    // Botão próximo canal
    document.getElementById('next-channel').addEventListener('click', nextVideo);
    
    // Botões de volume
    document.getElementById('volume-up').addEventListener('click', increaseVolume);
    document.getElementById('volume-down').addEventListener('click', decreaseVolume);
    
    // Controles de teclado
    document.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'ArrowLeft': // Seta esquerda - canal anterior
                previousVideo();
                break;
            case 'ArrowRight': // Seta direita - próximo canal
                nextVideo();
                break;
            case 'Space': // Espaço - play/pause
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowUp': // Seta cima - aumentar volume
                increaseVolume();
                break;
            case 'ArrowDown': // Seta baixo - diminuir volume
                decreaseVolume();
                break;
        }
    });
});

// Função para carregar API do YouTube (fallback)
if (typeof YT === 'undefined') {
    // Se a API do YouTube não estiver carregada, criar uma mensagem alternativa
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
}