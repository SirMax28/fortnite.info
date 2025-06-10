// script.js para la landing page de Fortnite 

// Datos de las figuras
const figurasData = {
    'corona-victoria': {
        titulo: 'Corona Victoria',
        imagen: 'assets/img/corona.png',
        descripcion: 'La Corona de la Victoria es un objeto icónico que representa el triunfo supremo en Fortnite. Otorgada solo a los jugadores más hábiles que logran conseguir una Victoria Royale, esta corona dorada es un símbolo de excelencia y dominio en el campo de batalla.'
    },
    'espiritu-superman': {
        titulo: 'Espíritu Superman',
        imagen: 'assets/img/fortnite_item.png',
        descripcion: 'El Espíritu de Superman es una manifestación única de uno de los superhéroes más emblemáticos en Fortnite. Este objeto especial captura la esencia del Hombre de Acero, combinando el poder y la esperanza que Superman representa en el universo de Fortnite.'
    },
    'fred-llama': {
        titulo: 'Fred Llama',
        imagen: 'assets/img/llama.png',
        descripcion: 'Fred la Llama es la mascota más querida de Fortnite. Estas coloridas llamas no solo son adorables, sino que también contienen valiosos recursos y botín. En el modo Battle Royale, encontrar una Llama de Suministros puede cambiar completamente el curso de una partida.'
    },
    'medallon': {
        titulo: 'Medallón',
        imagen: 'assets/img/escudo.png',
        descripcion: 'El Medallón es un artefacto legendario que simboliza el honor y la valentía en el mundo de Fortnite. Este objeto ornamentado no solo es una pieza de colección codiciada, sino que también representa el legado de los guerreros más destacados del juego.'
    },
    'granada-choque': {
        titulo: 'Granada de Choque',
        imagen: 'assets/img/impulse.png',
        descripcion: 'La Granada de Choque es una herramienta táctica esencial en Fortnite. Este dispositivo explosivo no causa daño directo, pero genera una poderosa onda de choque que puede impulsar a los jugadores por los aires, perfecta para escapar de situaciones peligrosas o alcanzar lugares elevados.'
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Parallax effect
    const parallaxContainer = document.querySelector('.parallax-container');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    let lastScrollY = window.scrollY;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rafId = null;
    let scrollTimeout;

    // Función para suavizar el movimiento
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Función para limitar un valor entre un mínimo y máximo
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const scrollPercent = clamp(scrollY / maxScroll, 0, 1);

        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            // Reducimos el factor de parallax para un efecto más sutil
            const parallaxFactor = speed * 0.15;
            const yPos = -scrollY * parallaxFactor;

            // Reducimos el efecto del mouse para más estabilidad
            const xOffset = lastMouseX * speed * 5;
            const yOffset = lastMouseY * speed * 5;

            // Aplicamos una transformación más suave
            const transform = `translate3d(${xOffset}px, ${yPos + yOffset}px, ${layer.dataset.z || 0}px)`;
            const scale = layer.dataset.scale || 1;

            layer.style.transform = `${transform} scale(${scale})`;
        });

        rafId = requestAnimationFrame(animate);
    }

    // Mouse parallax con efecto más sutil
    function handleMouseMove(e) {
        const mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;

        // Suavizamos más el movimiento del mouse
        lastMouseX = lerp(lastMouseX, mouseX * 0.2, 0.03);
        lastMouseY = lerp(lastMouseY, mouseY * 0.2, 0.03);
    }

    function animate() {
        updateParallax();
    }

    // Optimización del scroll
    function handleScroll() {
        lastScrollY = window.scrollY;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            const finalPosition = Math.round(lastScrollY / 10) * 10;
            if (Math.abs(lastScrollY - finalPosition) > 1) {
                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
            }
        }, 150);

        if (!rafId) {
            rafId = requestAnimationFrame(animate);
        }
    }

    // Event listeners con throttling
    let isScrolling = false;
    let isMoving = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            handleScroll();
            setTimeout(() => {
                isScrolling = false;
            }, 16);
        }
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (!isMoving) {
            isMoving = true;
            handleMouseMove(e);
            setTimeout(() => {
                isMoving = false;
            }, 16);
        }
    }, { passive: true });

    // Optimización para dispositivos móviles
    let isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        let lastBeta = 0;
        let lastGamma = 0;

        window.addEventListener('deviceorientation', function (e) {
            if (e.beta !== null && e.gamma !== null) {
                // Suavizamos los valores del giroscopio
                lastBeta = lerp(lastBeta, clamp(e.beta, -45, 45) / 45, 0.05);
                lastGamma = lerp(lastGamma, clamp(e.gamma, -45, 45) / 45, 0.05);

                lastMouseX = lastGamma * 0.1;
                lastMouseY = lastBeta * 0.1;
            }
        }, { passive: true });
    }

    // Inicialización y limpieza
    function init() {
        updateParallax();
        rafId = requestAnimationFrame(animate);
    }

    function cleanup() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanup();
        } else {
            init();
        }
    });

    window.addEventListener('focus', init);
    window.addEventListener('blur', cleanup);

    init();

    const carrusel = document.querySelector('.figuras-carrusel');
    const btnLeft = document.querySelector('.carrusel-arrow.left');
    const btnRight = document.querySelector('.carrusel-arrow.right');
    const detalleObjeto = document.querySelector('.detalle-objeto');
    let currentIndex = 2; // Comenzamos con Fred Llama seleccionado
    let autoScrollInterval;
    const itemWidth = 190;

    // Función para actualizar el detalle del objeto
    function actualizarDetalle(id) {
        const data = figurasData[id];
        if (!data) return;

        detalleObjeto.innerHTML = `
            <div class="detalle-info">
                <h2>${data.titulo}</h2>
                <p>${data.descripcion}</p>
            </div>
            <div class="detalle-img-cuadro">
                <img src="${data.imagen}" alt="${data.titulo}" class="llama-img-cuadro">
            </div>
        `;
    }

    // Función para manejar el clic en un item
    function handleItemClick(item) {
        // Remover la clase destacada de todos los items (incluyendo clones)
        document.querySelectorAll('.figura-item').forEach(i => i.classList.remove('figura-destacada'));

        // Agregar la clase destacada al item clickeado y sus clones
        const id = item.getAttribute('data-id');
        document.querySelectorAll(`.figura-item[data-id="${id}"]`).forEach(i => i.classList.add('figura-destacada'));

        // Actualizar el detalle
        actualizarDetalle(id);

        // Centrar el item seleccionado
        const itemRect = item.getBoundingClientRect();
        const carruselRect = carrusel.getBoundingClientRect();
        const offset = itemRect.left - carruselRect.left - (carruselRect.width / 2) + (itemRect.width / 2);
        carrusel.scrollBy({ left: offset, behavior: 'smooth' });
    }

    function cloneItems() {
        const items = Array.from(carrusel.children);
        items.forEach(item => {
            const cloneBefore = item.cloneNode(true);
            const cloneAfter = item.cloneNode(true);
            cloneBefore.classList.add('clone');
            cloneAfter.classList.add('clone');

            // Agregar event listeners a los clones
            cloneBefore.addEventListener('click', () => handleItemClick(cloneBefore));
            cloneAfter.addEventListener('click', () => handleItemClick(cloneAfter));

            carrusel.insertBefore(cloneBefore, carrusel.firstChild);
            carrusel.appendChild(cloneAfter);
        });

        // Agregar event listeners a los items originales
        items.forEach(item => {
            item.addEventListener('click', () => handleItemClick(item));
        });

        carrusel.scrollLeft = carrusel.scrollWidth / 3;
    }

    function scrollCarrusel(direction = 1) {
        if (!carrusel) return;

        const scrollAmount = direction * itemWidth;
        const targetScroll = carrusel.scrollLeft + scrollAmount;

        carrusel.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });

        setTimeout(checkInfiniteScroll, 500);
    }

    function checkInfiniteScroll() {
        const maxScroll = carrusel.scrollWidth * 2 / 3;
        const threshold = itemWidth / 2;

        if (carrusel.scrollLeft <= threshold) {
            carrusel.scrollLeft = maxScroll - itemWidth * 2;
        } else if (carrusel.scrollLeft >= maxScroll - threshold) {
            carrusel.scrollLeft = itemWidth * 2;
        }
    }

    btnLeft.addEventListener('click', () => {
        scrollCarrusel(-1);
        resetAutoScroll();
    });

    btnRight.addEventListener('click', () => {
        scrollCarrusel(1);
        resetAutoScroll();
    });

    function autoScroll() {
        autoScrollInterval = setInterval(() => {
            scrollCarrusel(1);
        }, 5000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScroll();
    }

    // Inicialización
    cloneItems();
    autoScroll();
    actualizarDetalle('fred-llama'); // Mostrar Fred Llama inicialmente

    // Eventos de mouse
    carrusel.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carrusel.addEventListener('mouseleave', resetAutoScroll);

    // Prevenir el comportamiento extraño durante el scroll
    carrusel.addEventListener('scroll', () => {
        clearTimeout(carrusel.scrollTimeout);
        carrusel.scrollTimeout = setTimeout(checkInfiniteScroll, 100);
    });

    // Función para crear partículas
    function createParticles(x, y) {
        const particleCount = 12;
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            document.body.appendChild(particle);

            const angle = (i / particleCount) * 360;
            const velocity = 2 + Math.random() * 2;
            const size = 5 + Math.random() * 5;

            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            gsap.to(particle, {
                x: Math.cos(angle * Math.PI / 180) * 100 * velocity,
                y: Math.sin(angle * Math.PI / 180) * 100 * velocity,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    // Función para manejar el efecto de scroll
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }

    // Función para animar la transición entre productos
    function animateProductTransition(productElement) {
        // Resetear animaciones previas
        productElement.style.animation = 'none';
        productElement.offsetHeight; // Forzar reflow

        // Añadir clase active para iniciar animación
        productElement.classList.add('active');

        // Crear efecto de partículas
        const rect = productElement.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Animar elementos internos
        const title = productElement.querySelector('.product-title');
        const description = productElement.querySelector('.product-description');
        const image = productElement.querySelector('.product-image');

        if (title) title.style.animation = 'none';
        if (description) description.style.animation = 'none';
        if (image) image.style.animation = 'none';

        // Forzar reflow
        void productElement.offsetHeight;

        // Iniciar animaciones
        if (title) title.style.animation = '';
        if (description) description.style.animation = '';
        if (image) image.style.animation = '';
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializar animaciones de scroll
        handleScrollAnimations();

        // Añadir clase scroll-reveal a elementos que queremos animar
        document.querySelectorAll('.product-details, .section-title, .hero-content').forEach(element => {
            element.classList.add('scroll-reveal');
        });

        // Click en productos del carrusel
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const productDetails = document.querySelector('.product-details');
                if (productDetails) {
                    animateProductTransition(productDetails);
                }
                createParticles(e.clientX, e.clientY);
            });
        });
    });

    // Event listener para scroll
    window.addEventListener('scroll', handleScrollAnimations);

    // Animación hover para productos
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                rotation: 2,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });
}); 