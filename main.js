document.addEventListener('DOMContentLoaded', () => {
    // 1. Cambio de estilo en el Header al hacer scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth scrolling para los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignorar enlaces externos o mailto
            if(targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Restar la altura del header fijo (aprox 80px)
                    const headerHeight = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight;
    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Inicializar AOS (Animaciones)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
    
    // 4. Lógica del Catálogo: Filtros y Modal (Lightbox)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    // Filtros
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase active de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                // Añadir clase active al clickeado
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                catalogItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => { item.classList.add('hidden'); item.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // Modal (Lightbox)
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        const modalImg = document.getElementById('lightboxImg');
        const modalTitle = document.getElementById('lightboxTitle');
        const modalDesc = document.getElementById('lightboxDesc');
        const closeBtn = document.getElementById('lightboxClose');
        const overlay = document.getElementById('lightboxOverlay');
        
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');
        const whatsappBtn = document.getElementById('lightboxWhatsapp');

        let currentIndex = 0;
        let visibleItems = Array.from(catalogItems); 

        function updateModal(index) {
            if (visibleItems.length === 0) return;
            
            if (index < 0) index = visibleItems.length - 1;
            if (index >= visibleItems.length) index = 0;
            
            currentIndex = index;
            const item = visibleItems[currentIndex];
            
            const img = item.querySelector('img');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            
            modalImg.src = img.src;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            const waMessage = encodeURIComponent(`Hola Jairo, deseo solicitar información sobre: ${title}`);
            whatsappBtn.href = `https://wa.me/573127462096?text=${waMessage}`;
        }

        catalogItems.forEach((item) => {
            item.addEventListener('click', () => {
                visibleItems = Array.from(catalogItems).filter(el => !el.classList.contains('hidden'));
                currentIndex = visibleItems.indexOf(item);
                
                updateModal(currentIndex);
                modal.classList.add('active');
            });
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => updateModal(currentIndex - 1));
            nextBtn.addEventListener('click', () => updateModal(currentIndex + 1));
        }

        function closeModal() {
            modal.classList.remove('active');
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }
    
    // 5. Animación del logo de inicio
    const mainLogoLink = document.getElementById('main-logo-link');
    if(mainLogoLink) {
        mainLogoLink.addEventListener('click', (e) => {
            const logoImg = mainLogoLink.querySelector('.logo-img');
            if(logoImg) {
                // Remove and re-add class to trigger animation again
                logoImg.classList.remove('logo-animate');
                void logoImg.offsetWidth; // trigger reflow
                logoImg.classList.add('logo-animate');
            }
        });
    }
});
