document.addEventListener("DOMContentLoaded", () => {
    const TOTAL_IMAGES = 300;
    const IMAGE_PATH_PREFIX = 'img300/ZS_'; 
    const IMAGE_EXTENSION = '.jpg';
    let currentIndex = 1;
    let isHighContrast = localStorage.getItem('highContrast') === 'true';

    const viewWelcome = document.getElementById('view-welcome');
    const viewGallery = document.getElementById('view-gallery');
    const viewFarewell = document.getElementById('view-farewell');
    const viewGrid = document.getElementById('view-grid');
    const gridContainer = document.getElementById('grid-container');
    
    const btnStart = document.getElementById('btn-start');
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const galleryImage = document.getElementById('gallery-image');
    const zoomableFrame = document.getElementById('zoomable-frame');
    const zoomOverlay = document.querySelector('.zoom-overlay');
    
    const imageCounterNum = document.getElementById('current-image-num');
    const landscapeCounterNum = document.getElementById('landscape-current-num');
    const allLogos = document.querySelectorAll('.clickable-logo');
    
    const btnShowGrid = document.getElementById('btn-show-grid');
    const btnShowGridLandscape = document.getElementById('btn-show-grid-landscape');
    const btnSkip = document.getElementById('btn-skip'); 
    const btnSkipLandscape = document.getElementById('btn-skip-landscape'); 
    const btnSkipToEnd = document.getElementById('btn-skip-to-end'); 
    const btnRestart = document.getElementById('btn-restart'); 
    const btnContrast = document.getElementById('btn-contrast');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        let now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) { event.preventDefault(); }
        lastTouchEnd = now;
    }, false);


    const applyContrast = () => {
        if (isHighContrast) document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');
    };
    applyContrast(); 

    btnContrast.addEventListener('click', () => {
        isHighContrast = !isHighContrast;
        localStorage.setItem('highContrast', isHighContrast);
        applyContrast();
    });


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
        zoomOverlay.classList.remove('active-touch'); 

        if (hash === '' || hash === '#welcome') {
            switchView(viewWelcome);
        } 
        else if (hash === '#grid') {
            switchView(viewGrid);
            generateGrid(); 
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
        
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_path: window.location.pathname + window.location.hash
            });
        }
    };

    window.addEventListener('hashchange', handleRouting);


    let gridGenerated = false;
    const generateGrid = () => {
        if (gridGenerated) return; 
        gridContainer.innerHTML = ''; 
        
        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            const formatted = i.toString().padStart(3, '0');
            const img = document.createElement('img');
            img.src = `${IMAGE_PATH_PREFIX}${formatted}${IMAGE_EXTENSION}`;
            img.alt = `Zdjęcie nr ${i}`;
            img.className = 'grid-item';
            img.loading = 'lazy'; 
            
            img.addEventListener('click', () => {
                window.location.hash = `#gallery/${i}`;
            });
            gridContainer.appendChild(img);
        }
        gridGenerated = true;
    };


    btnStart.addEventListener('click', () => { window.location.hash = '#gallery/1'; });
    
    [btnShowGrid, btnShowGridLandscape].forEach(btn => {
        if(btn) btn.addEventListener('click', () => { window.location.hash = '#grid'; });
    });
    
    if (btnSkip) btnSkip.addEventListener('click', () => { window.location.hash = '#farewell'; });
    if (btnSkipLandscape) btnSkipLandscape.addEventListener('click', () => { window.location.hash = '#farewell'; });
    if (btnSkipToEnd) btnSkipToEnd.addEventListener('click', () => { window.location.hash = '#farewell'; });
    
    if (btnRestart) btnRestart.addEventListener('click', () => { window.location.hash = '#welcome'; });

    allLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            if (window.location.hash !== '#welcome' && window.location.hash !== '') {
                window.location.hash = '#welcome';
            }
        });
    });

    navNext.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (currentIndex < TOTAL_IMAGES) {
            window.location.hash = `#gallery/${currentIndex + 1}`;
        } else if (currentIndex === TOTAL_IMAGES) {
            window.location.hash = '#farewell';
        }
    });

    navPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 1) {
            window.location.hash = `#gallery/${currentIndex - 1}`;
        }
    });


    document.addEventListener('keydown', (e) => {
        const activeView = document.querySelector('.view.active');
        const isGallery = activeView === viewGallery;
        const isLightboxOpen = !lightbox.classList.contains('hidden');

        if (isGallery || isLightboxOpen) {
            if (e.key === 'ArrowRight') {
                if (currentIndex < TOTAL_IMAGES) {
                    window.location.hash = `#gallery/${currentIndex + 1}`;
                } else if (currentIndex === TOTAL_IMAGES) {
                    window.location.hash = '#farewell';
                    if (isLightboxOpen) closeLightbox();
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex > 1) {
                    window.location.hash = `#gallery/${currentIndex - 1}`;
                }
            } else if (e.key === 'Escape' && isLightboxOpen) {
                closeLightbox();
            }
        }
    });


    const updateGallery = () => {
        const formattedIndex = currentIndex.toString().padStart(3, '0');
        
        galleryImage.src = `${IMAGE_PATH_PREFIX}${formattedIndex}${IMAGE_EXTENSION}`;
        galleryImage.style.animation = 'none';
        galleryImage.offsetHeight; 
        galleryImage.style.animation = null;

        imageCounterNum.textContent = currentIndex;
        landscapeCounterNum.textContent = currentIndex;

        if (!lightbox.classList.contains('hidden')) {
            lightboxImg.src = galleryImage.src;
        }

        if (currentIndex < TOTAL_IMAGES) {
            const nextIndex = (currentIndex + 1).toString().padStart(3, '0');
            const imgPreload = new Image();
            imgPreload.src = `${IMAGE_PATH_PREFIX}${nextIndex}${IMAGE_EXTENSION}`;
        }

        if (currentIndex === 1) navPrev.classList.add('invisible'); 
        else navPrev.classList.remove('invisible'); 
    };


    let isTouchDevice = false;
    
    zoomableFrame.addEventListener('touchstart', (e) => {
        isTouchDevice = true;
        if(e.target.closest('.nav-btn')) return;

        if (!zoomOverlay.classList.contains('active-touch')) {
            e.preventDefault(); 
            zoomOverlay.classList.add('active-touch');
        } else {
            openLightbox();
        }
    });

    zoomableFrame.addEventListener('click', (e) => {
        if (isTouchDevice) return; 
        if (e.target.closest('.nav-btn')) return;
        openLightbox();
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.image-frame')) {
            zoomOverlay.classList.remove('active-touch');
        }
    });

    const openLightbox = () => {
        lightboxImg.src = galleryImage.src;
        lightbox.classList.remove('hidden');
    };

    const closeLightbox = () => {
        lightbox.classList.add('hidden');
        zoomOverlay.classList.remove('active-touch');
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });


    if (window.location.hash && window.location.hash !== '#welcome') {
        viewWelcome.classList.remove('active');
        viewWelcome.classList.add('hidden');
        handleRouting(); 
    } else {
        history.replaceState(null, null, '#welcome');
    }
});
