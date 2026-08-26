const form = document.querySelector('.form'); // 👈 usa el mismo nombre siempre
let active = false;

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        active = entry.isIntersecting;
    });
}, { threshold: 0.1 });

observer.observe(form);

const scaleInicial = 1; // valor inicial de escala

window.addEventListener('scroll', () => {
    if (!active) return; // solo aplica si la sección está visible

    const scrollY = window.scrollY;
    const start = form.offsetTop;

    const scaleform = scaleInicial - (scrollY - start) / 3000;
    form.style.transform = `scale(${scaleform})`;
});

// Validación básica antes del envío real
document.getElementById('form-contacto').addEventListener('submit', function (e) {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const status = document.getElementById('form-status');

    if (!name || !email || !message) {
        e.preventDefault(); // evita el envío solo si hay error
        status.textContent = "Por favor completa los campos obligatorios.";
        status.style.color = "red";
    }
});

