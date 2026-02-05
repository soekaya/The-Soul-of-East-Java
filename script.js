// --- 1. LOGIKA KURSOR & GLOW ---
const cursor = document.querySelector('.cursor-follower');
const glow = document.getElementById('glow');

// Update posisi kursor
document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Glow effect background
        if (glow) {
            glow.style.setProperty('--x', `${e.clientX}px`);
            glow.style.setProperty('--y', `${e.clientY}px`);
        }
    });
});

// Pilih semua elemen yang bisa di-interaksi
const interactiveElements = document.querySelectorAll('.gallery-item, .scroll-btn, .hero-title, .img-wrapper a, .btn-menu-toggle, .menu-link, .btn-yellow-action, .lando-logo');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-active'));
});


// --- 2. LOGIKA SCROLL ANIMATION (OBSERVER) ---
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);

document.querySelectorAll('.gallery-item').forEach(item => {
    observer.observe(item);
});


// --- 3. TRANSISI ZOOM OUT / ZOOM IN (EFFECT) ---
const section2 = document.getElementById('gallery');
const section3 = document.getElementById('parallax-section');

if (section2 && section3) { 
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const rect3 = section3.getBoundingClientRect();
        
        if (rect3.top < windowHeight + 100) {
            let progress = 1 - (rect3.top / windowHeight);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            const scale3 = 0.8 + (progress * 0.2); 
            section3.style.transform = `scale(${scale3})`;
            section3.style.opacity = progress; 

            const scale2 = 1 - (progress * 0.2); 
            const opacity2 = 1 - (progress * 1.5); 
            
            section2.style.transform = `scale(${scale2})`;
            section2.style.opacity = opacity2;
            
        } else {
            section3.style.opacity = 0;
            section3.style.transform = `scale(0.8)`;
            section2.style.transform = `scale(1)`;
            section2.style.opacity = 1;
        }
    });
}


// --- 4. LOGIKA FULLSCREEN MENU ---
const menuButton = document.querySelector('.btn-menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
    if(menuButton && menuOverlay) {
        menuButton.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }
}

if (menuButton) {
    menuButton.addEventListener('click', toggleMenu);
}

menuLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});


// ==================================================
// --- 5. LOGIKA PARALLAX MENU (SMOOTH LERP) ---
// ==================================================
// Ini versi yang LEBIH HALUS dan "LAMBAT" (Delay Effect)
const menuVisualContainer = document.getElementById('menuVisual');
const parallaxImages = document.querySelectorAll('.parallax-img');

if (menuVisualContainer && parallaxImages.length > 0) {
    
    let currentY = 0; // Posisi saat ini (animasi)
    let targetY = 0;  // Posisi mouse (tujuan)

    // 1. Tangkap posisi mouse, tapi jangan langsung gerakkan gambar
    menuVisualContainer.addEventListener('mousemove', (e) => {
        const rect = menuVisualContainer.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        targetY = e.clientY - centerY;
    });

    // 2. Reset saat mouse keluar
    menuVisualContainer.addEventListener('mouseleave', () => {
        targetY = 0;
    });

    // 3. Loop Animasi (RequestAnimationFrame) untuk efek "Delay"
    function animateMenuParallax() {
        // Rumus Linear Interpolation (LERP):
        // current = current + (target - current) * faktor_lambat
        // 0.08 = Cukup lambat dan smooth. Ubah ke 0.05 kalau mau lebih lambat lagi.
        currentY += (targetY - currentY) * 0.08;

        parallaxImages.forEach(imgWrapper => {
            const speed = parseFloat(imgWrapper.getAttribute('data-speed')) || 0.05;
            // Gerakkan berdasarkan 'currentY' yang bergerak perlahan mengejar mouse
            const move = currentY * speed * -1;
            
            imgWrapper.style.transform = `translateY(${move}px) translateZ(0)`;
        });

        requestAnimationFrame(animateMenuParallax);
    }

    // Jalankan loop animasi
    animateMenuParallax();
}


// ==========================================
// --- 6. ANIMASI SECTION CATUR (ON SCROLL) ---
// ==========================================
const chessSection = document.getElementById('chess-section');

const chessObserverOptions = {
    threshold: 0.4 
};

const chessObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            section.classList.add('active');
            
            setTimeout(() => {
                section.classList.add('impact');
            }, 900); 
        } else {
            entry.target.classList.remove('active', 'impact');
        }
    });
}, chessObserverOptions);

if (chessSection) {
    chessObserver.observe(chessSection);
}

// ==========================================
// --- 7. ANIMASI HIGHLIGHT TEXT (GSAP) ---
// ==========================================

document.addEventListener("DOMContentLoaded", (event) => {
    // Pastikan GSAP sudah terload
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- A. Animasi Header Sejarah (Judul & Chapter) ---
        const historyTitle = document.querySelector('.history-hero-title');
        const chapterMark = document.querySelector('.chapter-mark');
        
        if (historyTitle) {
            ScrollTrigger.create({
                trigger: historyTitle,
                start: "top 85%", // Mulai saat bagian atas judul masuk 85% viewport
                onEnter: () => {
                    // 1. Munculkan Judul (Trigger CSS Class)
                    historyTitle.classList.add('visible');

                    // 2. Munculkan Chapter Mark (Animasi GSAP Langsung)
                    if (chapterMark) {
                        gsap.to(chapterMark, { 
                            opacity: 1, 
                            y: 0, 
                            duration: 1, 
                            ease: "power2.out" 
                        });
                    }
                }
            });
        }

        // --- B. Animasi Highlight Text (Per Kata/Kalimat) ---
        const highlights = document.querySelectorAll('.text-highlight');
        
        highlights.forEach((highlight) => {
            ScrollTrigger.create({
                trigger: highlight,
                start: "top 85%", // Highlight nyala saat teks masuk dari bawah layar
                end: "bottom top", // (Opsional) Batas akhir
                
                // Play saat masuk, Reverse saat scroll balik ke atas (biar interaktif)
                onEnter: () => highlight.classList.add('active'),
                onLeaveBack: () => highlight.classList.remove('active') 
            });
        });

        // ... (Kode Reog sebelumnya) ...

        // --- C. Animasi Header Wayang (Judul & Chapter) ---
        const wayangTitle = document.querySelector('.wayang-title');
        const wayangMark = document.querySelector('.wayang-mark');
        
        if (wayangTitle) {
            ScrollTrigger.create({
                trigger: wayangTitle,
                start: "top 85%", 
                onEnter: () => {
                    wayangTitle.classList.add('visible');
                    if(wayangMark) {
                        gsap.to(wayangMark, { 
                            opacity: 1, y: 0, duration: 1, ease: "power2.out" 
                        });
                    }
                }
            });
        }
        // ... (Kode Wayang sebelumnya) ...

        // --- D. Animasi Header Remo (Judul & Chapter) ---
        const remoTitle = document.querySelector('.remo-title');
        const remoMark = document.querySelector('.remo-mark');
        
        if (remoTitle) {
            ScrollTrigger.create({
                trigger: remoTitle,
                start: "top 85%", 
                onEnter: () => {
                    remoTitle.classList.add('visible');
                    if(remoMark) {
                        gsap.to(remoMark, { 
                            opacity: 1, y: 0, duration: 1, ease: "power2.out" 
                        });
                    }
                }
            });
        }
        
// ... (Tutup kurawal DOMContentLoaded) ...
        
// ... (Logic text-highlight sudah otomatis jalan untuk Wayang karena class-nya sama) ...

    } else {
        console.warn("GSAP belum dimuat. Pastikan CDN GSAP ada di index.html");
    }
});

