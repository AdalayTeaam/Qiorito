const seccionVideo = document.getElementById("secuenciaVideo");
const videoScroll = document.getElementById("videoScroll");
const vistaTelefono = window.matchMedia("(max-width: 768px)");

let fuenteActual = "";
let videoListo = false;
let animacionPendiente = false;
let tiempoObjetivo = 0;
let urlVideoEnMemoria = "";

function obtenerFuenteVideo() {
    return vistaTelefono.matches
        ? "img/phone-scroll.mp4?v=8"
        : "img/phone-scroll-escritorio.mp4?v=8";
}

function asignarFuenteVideo(fuente) {
    videoListo = false;
    videoScroll.pause();
    videoScroll.src = fuente;
    videoScroll.load();
}

async function cargarFuenteVideo() {
    const nuevaFuente = obtenerFuenteVideo();

    if (fuenteActual === nuevaFuente) return;

    fuenteActual = nuevaFuente;
    videoScroll.muted = true;
    videoScroll.defaultMuted = true;
    videoScroll.setAttribute("playsinline", "");
    videoScroll.setAttribute("webkit-playsinline", "");

    if (urlVideoEnMemoria) {
        URL.revokeObjectURL(urlVideoEnMemoria);
        urlVideoEnMemoria = "";
    }

    // Safari/iOS necesita un video completamente buscable para modificar
    // currentTime durante el scroll. El Blob evita depender de Accept-Ranges.
    if (vistaTelefono.matches && window.location.protocol !== "file:") {
        try {
            const respuesta = await fetch(nuevaFuente, { cache: "force-cache" });
            if (!respuesta.ok) throw new Error("No se pudo cargar el video móvil");

            const datosVideo = await respuesta.blob();
            if (fuenteActual !== nuevaFuente || !vistaTelefono.matches) return;

            urlVideoEnMemoria = URL.createObjectURL(datosVideo);
            asignarFuenteVideo(urlVideoEnMemoria);
            return;
        } catch (error) {
            // Si Blob no está disponible, conserva la reproducción normal.
        }
    }

    asignarFuenteVideo(nuevaFuente);
}

function videoTieneRangoBuscable() {
    if (!videoScroll.seekable.length) return false;

    const inicio = videoScroll.seekable.start(0);
    const fin = videoScroll.seekable.end(videoScroll.seekable.length - 1);
    return Number.isFinite(inicio) && Number.isFinite(fin) && fin - inicio > 0.05;
}

function aplicarTiempoVideo() {
    if (!videoListo || videoScroll.seeking || !videoTieneRangoBuscable()) return;
    if (Math.abs(videoScroll.currentTime - tiempoObjetivo) < 0.02) return;

    const inicioBuscable = videoScroll.seekable.start(0);
    const finBuscable = videoScroll.seekable.end(videoScroll.seekable.length - 1);
    videoScroll.currentTime = Math.max(inicioBuscable, Math.min(tiempoObjetivo, finBuscable));
}

function actualizarVideoScroll() {
    if (!videoListo || !Number.isFinite(videoScroll.duration)) {
        animacionPendiente = false;
        return;
    }

    const rect = seccionVideo.getBoundingClientRect();
    const altoPantalla = window.visualViewport?.height || window.innerHeight;
    const recorrido = Math.max(1, seccionVideo.offsetHeight - altoPantalla);
    let progreso = -rect.top / recorrido;

    progreso = Math.max(0, Math.min(1, progreso));
    tiempoObjetivo = progreso * Math.max(0, videoScroll.duration - 0.05);

    aplicarTiempoVideo();
    animacionPendiente = false;
}

function solicitarActualizacionVideo() {
    if (animacionPendiente) return;

    animacionPendiente = true;
    requestAnimationFrame(actualizarVideoScroll);
}

function marcarVideoListo() {
    if (!Number.isFinite(videoScroll.duration) || !videoTieneRangoBuscable()) return;

    videoListo = true;
    solicitarActualizacionVideo();
}

function desbloquearVideoTelefono() {
    if (!vistaTelefono.matches) return;

    const reproduccion = videoScroll.play();

    if (!reproduccion) return;

    reproduccion.then(function () {
        videoScroll.pause();
        marcarVideoListo();
        solicitarActualizacionVideo();
    }).catch(function () {});
}

videoScroll.addEventListener("loadedmetadata", marcarVideoListo);
videoScroll.addEventListener("loadeddata", marcarVideoListo);
videoScroll.addEventListener("canplay", marcarVideoListo);
videoScroll.addEventListener("progress", marcarVideoListo);

videoScroll.addEventListener("seeked", aplicarTiempoVideo);

window.addEventListener("scroll", solicitarActualizacionVideo, { passive: true });
window.addEventListener("resize", solicitarActualizacionVideo);
window.addEventListener("touchstart", desbloquearVideoTelefono, { once: true, passive: true });
window.addEventListener("pointerdown", desbloquearVideoTelefono, { once: true, passive: true });

if (vistaTelefono.addEventListener) {
    vistaTelefono.addEventListener("change", cargarFuenteVideo);
} else {
    vistaTelefono.addListener(cargarFuenteVideo);
}

cargarFuenteVideo();

//UnidadNegocio
// Compatibilidad con navegadores antiguos
(function () {
    'use strict';

    // Polyfill para requestAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return setTimeout(callback, 16);
        };
    }

    // Variables globales
    const coloresCI = ['#3b863e', '#00b2e2', '#fe5f00', '#ba0d0d'];
    const textos = [
        {
            titulo: 'titulo/Qiora_Conecta.png',
            texto: 'En Conecta, facilitamos la conectividad del futuro a millones de personas y empresas mediante infraestructura, talento humano y herramientas para instalaciones de fibra óptica en varios estados del país. Supervisamos cada etapa del proceso y buscamos mejorar continuamente la calidad del servicio.'
        },
        {
            titulo: 'titulo/Qiora_Telecom.png',
            texto: 'En Telecom, llevamos servicios de telefonía a todo México al ser de los principales Distribuidores Autorizados de AT&T. Conectamos empresas y personas gracias a la red de fuerza comercial, puntos de venta estratégicamente ubicados y atención a cliente cercana y confiable.'
        },
        {
            titulo: 'titulo/Qiora_Infraestructura.png',
            texto: 'Nos especializamos en la construcción de obra civil y la instalación de fibra óptica para operadores de telecomunicaciones y empresas. Contamos con un equipo capacitado y tecnología para garantizar una ejecución eficiente y segura en cada proyecto.'
        },
        {
            titulo: 'titulo/Qiora_Capital.png',
            texto: 'Es el motor de expansión de QiORA, identificando y desarrollando oportunidades de alto impacto en diversas industrias.'
        }
    ];

    const fondos = ['fondo0', 'fondo1', 'fondo2', 'fondo3'];
    const total = coloresCI.length;

    // Elementos del DOM
    const circulo = document.getElementById("circulo");
    const contenedor = document.getElementById("contenedor");
    const tituloEl = document.getElementById("titulo");
    const textoEl = document.getElementById("cuadroTexto");
    const textoContenedor = document.getElementById("contenedorTexto");
    const botones = document.querySelectorAll('.botones button');

    // Variables de estado
    const posicionesRelativas = [
        { x: 0.452, y: 0.08 },
        { x: 0.525, y: 0.29 },
        { x: 0.513, y: 0.50 },
        { x: 0.419, y: 0.70 }
    ];

    let posiciones = [];
    let imgs = [];
    let currentIndex = 0;
    let isTransitioning = false;
    let autoPlayInterval;

    // Funciones principales
    function calcularPosiciones() {
        if (!contenedor) return;

        const ancho = contenedor.clientWidth;
        const alto = contenedor.clientHeight;
        const ladoMin = Math.min(ancho, alto);

        posiciones = posicionesRelativas.map(function (pos) {
            return {
                x: ladoMin * pos.x,
                y: ladoMin * pos.y
            };
        });
    }

    function crearCirculos() {
        if (!circulo) return;

        circulo.innerHTML = "";
        imgs = [];

        coloresCI.forEach(function (color, i) {
            const div = document.createElement("div");
            div.className = "imagen-circular";
            div.style.backgroundColor = color;
            div.dataset.index = i;
            circulo.appendChild(div);
            imgs.push(div);

            // Event listener compatible
            div.addEventListener("click", function () {
                cambiarManual(i);
            });
        });
    }

    function posicionarSinAnim() {
        imgs.forEach(function (img, i) {
            if (!img || !posiciones[i]) return;

            img.style.transition = "none";

            const transform = 'translate(' + posiciones[i].x + 'px, ' + posiciones[i].y + 'px) scale(' +
                (i === currentIndex ? 1 : 0.3) + ') rotate(' +
                (i === currentIndex ? 0 : 180) + 'deg)';

            // Aplicar transform con prefijos
            img.style.webkitTransform = transform;
            img.style.mozTransform = transform;
            img.style.msTransform = transform;
            img.style.transform = transform;

            if (i === currentIndex) {
                img.classList.add("activo");
            } else {
                img.classList.remove("activo");
            }

            // Restaurar transición
            requestAnimationFrame(function () {
                img.style.transition = "all 1.2s ease-out";
            });
        });
    }

    function cambiarFondo(index) {
        fondos.forEach(function (id) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.classList.remove("visible");
            }
        });

        const fondoActivo = document.getElementById(fondos[index]);
        if (fondoActivo) {
            fondoActivo.classList.add("visible");
        }
    }

    function actualizarBotones(index) {
        botones.forEach(function (btn, i) {
            if (i === index) {
                btn.classList.add("activo");
            } else {
                btn.classList.remove("activo");
            }
        });
    }

    function cambiarContenido(index, instant) {
        if (!textos[index]) return;

        if (instant) {
            tituloEl.innerHTML = '<img src="' + textos[index].titulo + '" alt="Título ' + index + '" class="titulo-logo-img">';
            textoEl.textContent = textos[index].texto;
            textoContenedor.style.opacity = "1";
            textoContenedor.classList.remove("cambiando");
            cambiarFondo(index);
            actualizarBotones(index);
            return;
        }

        textoContenedor.classList.add("cambiando");

        setTimeout(function () {
            tituloEl.innerHTML = '<img src="' + textos[index].titulo + '" alt="Título ' + index + '" class="titulo-logo-img">';
            textoEl.textContent = textos[index].texto;
            cambiarFondo(index);
            actualizarBotones(index);
            textoContenedor.classList.remove("cambiando");
        }, 500);
    }

    function moverAnimacion(de, a) {
        if (!imgs[de] || !imgs[a] || !posiciones[de] || !posiciones[a]) return;

        const imgActual = imgs[de];
        const imgSiguiente = imgs[a];
        const posActual = posiciones[de];
        const posSiguiente = posiciones[a];

        // Preparar elemento siguiente
        imgSiguiente.style.transition = "none";

        const transformInicial = 'translate(' + posActual.x + 'px, ' + posActual.y + 'px) scale(0.3) rotate(180deg)';
        imgSiguiente.style.webkitTransform = transformInicial;
        imgSiguiente.style.mozTransform = transformInicial;
        imgSiguiente.style.msTransform = transformInicial;
        imgSiguiente.style.transform = transformInicial;

        imgSiguiente.classList.remove("activo");
        imgSiguiente.offsetHeight; // Force reflow

        // Restaurar transiciones y animar
        imgSiguiente.style.transition = "all 1.2s ease-out";
        imgActual.style.transition = "all 1.2s ease-out";

        // Animar al estado final
        requestAnimationFrame(function () {
            const transformFinalSiguiente = 'translate(' + posSiguiente.x + 'px, ' + posSiguiente.y + 'px) scale(1) rotate(0deg)';
            const transformFinalActual = 'translate(' + posSiguiente.x + 'px, ' + posSiguiente.y + 'px) scale(0.3) rotate(180deg)';

            imgSiguiente.style.webkitTransform = transformFinalSiguiente;
            imgSiguiente.style.mozTransform = transformFinalSiguiente;
            imgSiguiente.style.msTransform = transformFinalSiguiente;
            imgSiguiente.style.transform = transformFinalSiguiente;
            imgSiguiente.classList.add("activo");

            imgActual.style.webkitTransform = transformFinalActual;
            imgActual.style.mozTransform = transformFinalActual;
            imgActual.style.msTransform = transformFinalActual;
            imgActual.style.transform = transformFinalActual;
            imgActual.classList.remove("activo");
        });
    }

    function moverSiguiente() {
        if (isTransitioning) return;

        isTransitioning = true;
        const siguienteIndex = (currentIndex + 1) % total;

        moverAnimacion(currentIndex, siguienteIndex);
        cambiarContenido(siguienteIndex);

        setTimeout(function () {
            currentIndex = siguienteIndex;
            isTransitioning = false;
        }, 1200);
    }

    function cambiarManual(index) {
        if (index === currentIndex || isTransitioning) return;

        isTransitioning = true;
        moverAnimacion(currentIndex, index);
        cambiarContenido(index);

        setTimeout(function () {
            currentIndex = index;
            isTransitioning = false;
        }, 1200);
    }

    // Event listeners para botones
    botones.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
            cambiarManual(i);
            btn.blur();
        });
    });

    // Resize handler
    function handleResize() {
        calcularPosiciones();
        posicionarSinAnim();
    }

    // Throttle para resize
    let resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });

    // === CÓDIGO PARA MÓVIL ===
    const imagenes = [
        "img/Fondo/conecta.png",
        "img/Fondo/telecom.png",
        "img/Fondo/infra.png",
        "img/Fondo/capital.png"
    ];

    const textosCelular = textos;
    let centroIndex = 0;
    let direccion = 1;

    const circulos = [
        document.getElementById('circulo1'),
        document.getElementById('circulo2'),
        document.getElementById('circulo3')
    ];

    const tituloElCelular = document.getElementById("titulo-celular");
    const textoElCelular = document.getElementById("cuadroTexto-celular");
    const textoContenedorCelular = document.getElementById("contenedorTexto-celular");
    const botonesCelular = document.querySelectorAll('.botones-Celular button');

    const estadosBase = [
        { left: '14%', top: '60%', size: '20vw', maxSize: '100px' },
        { left: '50%', top: '50%', size: '30vw', maxSize: '180px' },
        { left: '86%', top: '60%', size: '20vw', maxSize: '100px' }
    ];

    let posicionVisual = [0, 1, 2];

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    function aplicarEstado(circulo, estado, zIndex, scale, opacity) {
        if (!circulo) return;

        circulo.style.left = estado.left;
        circulo.style.top = estado.top;
        circulo.style.width = estado.size;
        circulo.style.height = estado.size;
        circulo.style.maxWidth = estado.maxSize;
        circulo.style.maxHeight = estado.maxSize;
        circulo.style.zIndex = zIndex;
        circulo.style.opacity = opacity;

        const transform = 'translate(-50%, -50%) scale(' + scale + ')';
        circulo.style.webkitTransform = transform;
        circulo.style.mozTransform = transform;
        circulo.style.msTransform = transform;
        circulo.style.transform = transform;
        circulo.style.transition = 'all 0.8s ease-out';
    }

    function actualizarImagenesCelular() {
        const izquierdaIndex = mod(centroIndex - 1, textosCelular.length);
        const centroTemp = centroIndex;
        const derechaIndex = mod(centroIndex + 1, textosCelular.length);

        for (let i = 0; i < circulos.length; i++) {
            if (!circulos[i]) continue;

            if (posicionVisual[i] === 0) {
                circulos[i].style.backgroundImage = 'url(' + imagenes[izquierdaIndex] + ')';
            } else if (posicionVisual[i] === 1) {
                circulos[i].style.backgroundImage = 'url(' + imagenes[centroTemp] + ')';
            } else if (posicionVisual[i] === 2) {
                circulos[i].style.backgroundImage = 'url(' + imagenes[derechaIndex] + ')';
            }
        }
    }

    function actualizarBotonesCelular(index) {
        botonesCelular.forEach(function (btn, i) {
            if (i === index) {
                btn.classList.add("activo");
            } else {
                btn.classList.remove("activo");
            }
        });
    }

    function cambiarContenidoCelulares(index) {
        if (!textosCelular[index]) return;

        textoContenedorCelular.classList.add("cambiando");

        setTimeout(function () {
            tituloElCelular.innerHTML = '<img src="' + textosCelular[index].titulo + '" alt="Título ' + index + '" class="titulo_logo-celular-img">';
            textoElCelular.textContent = textosCelular[index].texto;
            actualizarBotonesCelular(index);
            textoContenedorCelular.classList.remove("cambiando");
        }, 400);
    }

    function animarMovimiento() {
        if (direccion === 1) {
            posicionVisual.unshift(posicionVisual.pop());
        } else {
            posicionVisual.push(posicionVisual.shift());
        }

        actualizarImagenesCelular();
        cambiarContenidoCelulares(centroIndex);

        circulos.forEach(function (c, i) {
            let zIndex = 1;
            let scale = 1;
            let opacity = 1;
            const pos = posicionVisual[i];

            if (pos === 1) {
                zIndex = 3;
                scale = 1;
                opacity = 1;
            } else if (pos === 0 || pos === 2) {
                zIndex = 2;
                scale = 0.8;
                opacity = 0.85;
            }

            aplicarEstado(c, estadosBase[pos], zIndex, scale, opacity);
        });
    }

    function girar() {
        const totalSlides = textosCelular.length;
        centroIndex = mod(centroIndex + direccion, totalSlides);
        animarMovimiento();
    }

    // Event listeners para botones celular
    document.querySelectorAll('button[data-index]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const idx = Number(btn.getAttribute('data-index'));
            if (idx !== centroIndex) {
                centroIndex = idx;
                direccion = 1;
                animarMovimiento();
            }
            btn.blur();
        });
    });

    // Inicialización móvil
    function initMobile() {
        for (let i = 0; i < circulos.length; i++) {
            if (!circulos[i]) continue;

            aplicarEstado(
                circulos[i],
                estadosBase[posicionVisual[i]],
                posicionVisual[i] === 1 ? 3 : 2,
                posicionVisual[i] === 1 ? 1 : 0.8,
                posicionVisual[i] === 1 ? 1 : 0.85
            );
        }

        actualizarImagenesCelular();
        cambiarContenidoCelulares(centroIndex);
    }

    // Inicialización principal
    function init() {
        // Desktop
        if (contenedor) {
            crearCirculos();
            calcularPosiciones();
            posicionarSinAnim();
            cambiarContenido(currentIndex, true);
        }

        // Mobile
        if (circulos[0]) {
            initMobile();
        }
    }

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(function () {
            moverSiguiente();
        }, 10000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Pausar auto-play cuando el usuario interactúa
    document.addEventListener('click', function () {
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000); // Reanudar después de 10 segundos
    });

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            init();
            startAutoPlay();
        });
    } else {
        init();
        startAutoPlay();
    }

    // Pausar animaciones cuando la pestaña no está visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

})();

const nosotros = document.querySelector('.nosotros');
const burbujas = document.querySelectorAll('.burbuja');
const scaleInicial = .99;

let active = false;

// Observador que activa/desactiva el efecto
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        active = entry.isIntersecting;
    });
}, { threshold: 0.1 });

observer.observe(nosotros);

window.addEventListener('scroll', () => {
    if (!active) return; // solo aplica si la sección está visible

    const scrollY = window.scrollY;
    const start = nosotros.offsetTop;

    const scaleNosotros = scaleInicial - (scrollY - start) / 4000;
    nosotros.style.transform = `scale(${scaleNosotros})`;

    burbujas.forEach(b => {
        const scaleB = scaleInicial - (scrollY - start) / 5000;
        b.style.transform = `scale(${scaleB})`;
    });
});

// Luz progresiva de la Q
const seccionLuzQ = document.querySelector(".nosotros-a");
const logoLuzQ = document.getElementById("logoBlanco");
let luzQPendiente = false;

function actualizarLuzQ() {
    if (!seccionLuzQ || !logoLuzQ) {
        luzQPendiente = false;
        return;
    }

    const rect = seccionLuzQ.getBoundingClientRect();
    const inicio = window.innerHeight * 0.9;
    const fin = window.innerHeight * 0.12;
    const progreso = Math.max(0, Math.min(1, (inicio - rect.top) / Math.max(1, inicio - fin)));

    logoLuzQ.style.setProperty("--q-glow-core", (1 + progreso * 8).toFixed(1) + "px");
    logoLuzQ.style.setProperty("--q-glow-mid", (2 + progreso * 18).toFixed(1) + "px");
    logoLuzQ.style.setProperty("--q-glow-wide", (3 + progreso * 32).toFixed(1) + "px");
    logoLuzQ.style.setProperty("--q-brightness", (0.45 + progreso * 0.75).toFixed(2));
    logoLuzQ.style.setProperty("--q-opacity", (0.5 + progreso * 0.5).toFixed(2));
    logoLuzQ.style.setProperty("--q-scale", (0.92 + progreso * 0.12).toFixed(3));
    luzQPendiente = false;
}

function solicitarActualizacionLuzQ() {
    if (luzQPendiente) return;

    luzQPendiente = true;
    requestAnimationFrame(actualizarLuzQ);
}

window.addEventListener("scroll", solicitarActualizacionLuzQ, { passive: true });
window.addEventListener("resize", solicitarActualizacionLuzQ);
solicitarActualizacionLuzQ();

// Cambio de icono 
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const links = document.querySelectorAll('link[rel="icon"]');

const updateIcon = () => {
    const isDark = mediaQuery.matches;
    const dataKey = isDark ? 'hrefDark' : 'hrefLight';

    Array.prototype.slice.call(links).forEach(link => {
        link.href = link.dataset[dataKey];
    });
};

mediaQuery.addEventListener('change', updateIcon);
updateIcon();


// Función para subir al inicio
window.addEventListener("scroll", function () {
    const btn = document.getElementById("btnScrollTop");
    if (window.scrollY > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});
document.getElementById("btnScrollTop").onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Menú móvil
const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.getElementById("mainNavigation");

function cerrarMenuMovil() {
    if (!menuToggle || !mainNavigation) return;

    menuToggle.classList.remove("is-open");
    mainNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
}

if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", function () {
        const abierto = !mainNavigation.classList.contains("is-open");

        menuToggle.classList.toggle("is-open", abierto);
        mainNavigation.classList.toggle("is-open", abierto);
        menuToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
        menuToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    mainNavigation.querySelectorAll("a").forEach(function (enlace) {
        enlace.addEventListener("click", cerrarMenuMovil);
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") cerrarMenuMovil();
    });
}


// Reproducción visible de la animación móvil
const videoHeroMovil = document.getElementById("video_background_mobile");
let reintentoHeroPreparado = false;

function quitarReintentoHero() {
    window.removeEventListener("touchstart", reintentarHeroMovil);
    window.removeEventListener("pointerdown", reintentarHeroMovil);
    window.removeEventListener("scroll", reintentarHeroMovil);
    reintentoHeroPreparado = false;
}

function reintentarHeroMovil() {
    if (!videoHeroMovil || window.innerWidth > 768) return;

    const reproduccion = videoHeroMovil.play();
    if (reproduccion && typeof reproduccion.then === "function") {
        reproduccion.then(quitarReintentoHero).catch(function () { });
    }
}

function prepararReintentoHero() {
    if (reintentoHeroPreparado) return;

    reintentoHeroPreparado = true;
    window.addEventListener("touchstart", reintentarHeroMovil, { passive: true });
    window.addEventListener("pointerdown", reintentarHeroMovil, { passive: true });
    window.addEventListener("scroll", reintentarHeroMovil, { passive: true });
}

function iniciarAnimacionHeroMovil() {
    if (!videoHeroMovil || window.innerWidth > 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    videoHeroMovil.muted = true;
    videoHeroMovil.currentTime = 0;
    const reproduccion = videoHeroMovil.play();

    if (reproduccion && typeof reproduccion.catch === "function") reproduccion.catch(prepararReintentoHero);
}


// cargado
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll("img");
    let loaded = 0;

    function hideLoading() {
        const loader = document.getElementById("loading");
        loader.classList.add("fade-out");
        setTimeout(() => {
            loader.remove();
            iniciarAnimacionHeroMovil();
        }, 800); // elimina del DOM
    }

    function check() {
        if (loaded === images.length) hideLoading();
    }

    if (images.length === 0) {
        hideLoading();
    } else {
        images.forEach(img => {
            if (img.complete) {
                loaded++;
                check();
            } else {
                img.addEventListener("load", () => { loaded++; check(); });
                img.addEventListener("error", () => { loaded++; check(); });
            }
        });
    }
});
