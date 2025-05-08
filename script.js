const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const botonGirar = document.getElementById('botonGirar');
const resultado = document.getElementById('resultado');
const botonIngresar = document.getElementById('botonIngresar');
const botonEspanol = document.getElementById('botonEspanol');
const botonIngles = document.getElementById('botonIngles');
const paginaPrincipal = document.getElementById('paginaPrincipal');
const paginaRuleta = document.getElementById('paginaRuleta');

const premios = {
  es: [
      "Masaje para 1 persona",
      "Piqueo en nuestro bar",
      "Descuento especial en alimentos",
      "500 puntos Marriott Bonvoy",
      "300 puntos Marriott Bonvoy",
      "30% descuento SPA"
  ],
  en: [
      "Massage for 1 people",
      "Snack at our bar",
      "Special discount on food",
      "1000 Marriott Bonvoy points",
      "500 Marriott Bonvoy points",
      "30% SPA discount"
  ]
};



const mensajes = {
  es: {
      "Masaje para 1 persona": "Ganaste un Masaje para 1 persona!\nDisfruta de un tratamiento relajante enfocado en cabeza, cuello y hombros.",
      "Piqueo en nuestro bar": "Disfruta de un exquisito piqueo seleccionado especialmente por nuestro Chef.",
      "Descuento especial en alimentos": "Sumérgete en una experiencia gastronómica exclusiva en manos de nuestro chef ejecutivo con el 50% de descuento",
      "500 puntos Marriott Bonvoy": "Felicidades !! Ganaste 500 puntos Marriott Bonvoy",
      "300 puntos Marriott Bonvoy": "Felicidades !! Ganaste 300 puntos Marriott Bonvoy",
      "30% descuento SPA": "Felicidades !! Ganaste un 30% de descuento en nuestro SPA"
  },
  en: {
      "Massage for 1 people": "You won a Massage for 1 people!\nEnjoy a relaxing treatment focused on head, neck, and shoulders.",
      "Snack at our bar": "Enjoy a delicious snack specially selected by our Chef.",
      "Set menu for 2": "Immerse yourself in an exclusive gastronomic experience led by our executive chef with a 50% discount.",
      "500 Marriott Bonvoy points": "Congratulations !! You won 500 Marriott Bonvoy points",
      "300 Marriott Bonvoy points": "Congratulations !! You won 300 Marriott Bonvoy points",
      "30% SPA discount": "Congratulations !! You won a 30% discount at our SPA"
  }
};



const colores = ["#EAC7C7", "#A0C3D2", "#EAE0DA", "#EAC7C7", "#A0C3D2", "#EAE0DA"];
const segmentos = premios.es.length;
const anguloPorSegmento = 2 * Math.PI / segmentos;
let anguloActual = 0;
let girando = false;
let idiomaActual = 'es';

function dibujarRuleta() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    for (let i = 0; i < segmentos; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * anguloPorSegmento, (i + 1) * anguloPorSegmento);
        ctx.closePath();
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * anguloPorSegmento + anguloPorSegmento / 2);
        ctx.fillStyle = "#000";
        ctx.font = "bold " + (radius * 0.08) + "px Arial"; // Ajustar tamaño de texto proporcional
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lineas = premios[idiomaActual][i].split(' ');
        let textoCompleto = "";
        for (let palabra of lineas) {
            const lineaPrueba = textoCompleto + palabra + " ";
            const medida = ctx.measureText(lineaPrueba).width;
            if (medida > radius * 0.7) { // Limitar ancho del texto
                ctx.fillText(textoCompleto.trim(), radius * 0.6, -10);
                textoCompleto = palabra + " ";
            } else {
                textoCompleto += palabra + " ";
            }
        }
        ctx.fillText(textoCompleto.trim(), radius * 0.6, 10);
        ctx.restore();
    }
}


function girar() {
    if (girando) return;
    girando = true;
    const vueltas = Math.floor(Math.random() * 3) + 5;
    const extra = Math.random() * 2 * Math.PI;
    const rotacion = vueltas * 2 * Math.PI + extra;
    const duracion = 4000;
    const inicio = performance.now();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function animar(tiempo) {
        const progreso = Math.min((tiempo - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - progreso, 3);
        const angulo = anguloActual + rotacion * ease;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY); // Nuevo centro dinámico
        ctx.rotate(angulo);
        ctx.translate(-centerX, -centerY);
        dibujarRuleta();
        ctx.restore();
        if (progreso < 1) {
            requestAnimationFrame(animar);
        } else {
            anguloActual += rotacion;
            mostrarResultado();
            girando = false;
        }
    }
    requestAnimationFrame(animar);
}


function mostrarResultado() {
    const anguloFinal = anguloActual % (2 * Math.PI);
    const anguloPuntero = (3 * Math.PI / 2);
    const anguloDesdePuntero = (anguloPuntero - anguloFinal + 2 * Math.PI) % (2 * Math.PI);
    const indice = Math.floor(anguloDesdePuntero / anguloPorSegmento) % segmentos;
    const premioGanado = premios[idiomaActual][indice];
    const mensajeEspecial = mensajes[idiomaActual][premioGanado] || "¡Sigue intentando!";
    resultado.style.textAlign = "center";
    resultado.innerText = mensajeEspecial;
    // Lanzar confeti para todos los premios
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        scalar: 0.5
    });
}

// Cambiar idioma
botonEspanol.addEventListener('click', () => {
    idiomaActual = 'es';
    dibujarRuleta();
});

botonIngles.addEventListener('click', () => {
    idiomaActual = 'en';
    dibujarRuleta();
});

// Navegar a la página de la ruleta
botonIngresar.addEventListener('click', () => {
    paginaPrincipal.style.display = 'none';
    paginaRuleta.style.display = 'flex';
});

dibujarRuleta();
botonGirar.addEventListener('click', girar);
