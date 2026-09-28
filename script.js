document.addEventListener("DOMContentLoaded", () => {
    const TOTAL_IMAGES = 100;
    const IMAGE_PATH_PREFIX = 'img/ZS_'; 
    const IMAGE_EXTENSION = '.jpg';
    let currentIndex = 1;

    const viewWelcome = document.getElementById('view-welcome');
    const viewGallery = document.getElementById('view-gallery');
    const viewFarewell = document.getElementById('view-farewell');
    
    const btnStart = document.getElementById('btn-start');
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const galleryImage = document.getElementById('gallery-image');
    
    const imageCounterNum = document.getElementById('current-image-num');
    const allLogos = document.querySelectorAll('.clickable-logo');
    const btnSkip = document.getElementById('btn-skip'); 
    const btnRestart = document.getElementById('btn-restart'); 

    const switchView = (targetView) => {
        const currentActive = document.querySelector('.view.active');
        if (currentActive === targetView) return; 

        if (currentActive) {
            currentActive.classList.remove('active');
            setTimeout(() => {
                currentActive.classList.add('hidden');
                targetView.classList.remove('hidden');
                setTimeout(() => targetView.classList.add('active'), 50);
            }, 500); 
        } else {
            targetView.classList.remove('hidden');
            setTimeout(() => targetView.classList.add('active'), 50);
        }
    };

    const handleRouting = () => {
        const hash = window.location.hash;

        if (hash === '' || hash === '#welcome') {
            switchView(viewWelcome);
        } 
        else if (hash.startsWith('#gallery')) {
            const match = hash.match(/#gallery\/(\d+)/);
            if (match) {
                let newIndex = parseInt(match[1], 10);
                if (newIndex >= 1 && newIndex <= TOTAL_IMAGES) {
                    currentIndex = newIndex;
                }
            }
            switchView(viewGallery);
            updateGallery();
        } 
        else if (hash === '#farewell') {
            switchView(viewFarewell);
        }
    };

    window.addEventListener('hashchange', handleRouting);
    
    btnStart.addEventListener('click', () => {
        window.location.hash = '#gallery/1';
    });

    allLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            if (window.location.hash !== '#welcome' && window.location.hash !== '') {
                window.location.hash = '#welcome';
            }
        });
    });

    if (btnSkip) {
        btnSkip.addEventListener('click', () => {
            window.location.hash = '#farewell';
        });
    }

    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            window.location.hash = '#welcome';
        });
    }

    navNext.addEventListener('click', () => {
        if (currentIndex < TOTAL_IMAGES) {
            window.location.hash = `#gallery/${currentIndex + 1}`;
        } else if (currentIndex === TOTAL_IMAGES) {
            window.location.hash = '#farewell';
        }
    });

    navPrev.addEventListener('click', () => {
        if (currentIndex > 1) {
            window.location.hash = `#gallery/${currentIndex - 1}`;
        }
    });

    const updateGallery = () => {
        const formattedIndex = currentIndex.toString().padStart(3, '0');
        
        galleryImage.src = `${IMAGE_PATH_PREFIX}${formattedIndex}${IMAGE_EXTENSION}`;
        galleryImage.style.animation = 'none';
        galleryImage.offsetHeight; 
        galleryImage.style.animation = null;

        imageCounterNum.textContent = currentIndex;

        if (currentIndex < TOTAL_IMAGES) {
            const nextIndex = (currentIndex + 1).toString().padStart(3, '0');
            const imgPreload = new Image();
            imgPreload.src = `${IMAGE_PATH_PREFIX}${nextIndex}${IMAGE_EXTENSION}`;
        }

        if (currentIndex === 1) {
            navPrev.classList.add('invisible'); 
        } else {
            navPrev.classList.remove('invisible'); 
        }
    };

    if (window.location.hash && window.location.hash !== '#welcome') {
        viewWelcome.classList.remove('active');
        viewWelcome.classList.add('hidden');
        handleRouting(); 
    } else {
        history.replaceState(null, null, '#welcome');
    }
});