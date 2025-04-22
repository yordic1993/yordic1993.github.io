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
      "Masaje para 2 personas",
      "Piqueo en nuestro bar",
      "Set menú para 2",
      "1000 puntos Marriott Bonvoy",
      "500 puntos Marriott Bonvoy",
      "30% descuento SPA"
  ],
  en: [
      "Massage for 2 people",
      "Snack at our bar",
      "Set menu for 2",
      "1000 Marriott Bonvoy points",
      "500 Marriott Bonvoy points",
      "30% SPA discount"
  ]
};



const mensajes = {
  es: {
      "Masaje para 2 personas": "Ganaste un Masaje para 2 personas!\nDisfruta de un tratamiento relajante enfocado en cabeza, cuello y hombros.",
      "Piqueo en nuestro bar": "Disfruta de un exquisito piqueo seleccionado especialmente por nuestro Chef.",
      "Set menú para 2": "Disfruta de un exquisito menú de 3 tiempos con platos diseñados exclusivamente por nuestro Chef.",
      "1000 puntos Marriott Bonvoy": "Felicidades !! Ganaste 1000 puntos Marriott Bonvoy",
      "500 puntos Marriott Bonvoy": "Felicidades !! Ganaste 500 puntos Marriott Bonvoy",
      "30% descuento SPA": "Felicidades !! Ganaste un 30% de descuento en nuestro SPA"
  },
  en: {
      "Massage for 2 people": "You won a Massage for 2 people!\nEnjoy a relaxing treatment focused on head, neck, and shoulders.",
      "Snack at our bar": "Enjoy a delicious snack specially selected by our Chef.",
      "Set menu for 2": "Enjoy a delicious 3-course menu with dishes exclusively designed by our Chef.",
      "1000 Marriott Bonvoy points": "Congratulations !! You won 1000 Marriott Bonvoy points",
      "500 Marriott Bonvoy points": "Congratulations !! You won 500 Marriott Bonvoy points",
      "30% SPA discount": "Congratulations !! You won a 30% discount at our SPA"
  }
};



const colores = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F3FF33", "#33FFF5"];
const segmentos = premios.es.length;
const anguloPorSegmento = 2 * Math.PI / segmentos;
let anguloActual = 0;
let girando = false;
let idiomaActual = 'es';

function dibujarRuleta() {
  for (let i = 0; i < segmentos; i++) {
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 150, i * anguloPorSegmento, (i + 1) * anguloPorSegmento);
      ctx.closePath();
      ctx.fillStyle = colores[i % colores.length];
      ctx.fill();
      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(i * anguloPorSegmento + anguloPorSegmento / 2);
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px Arial";  // Reducir el tamaño de la fuente
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lineas = premios[idiomaActual][i].split(' ');
      let textoCompleto = "";
      for (let palabra of lineas) {
          const lineaPrueba = textoCompleto + palabra + " ";
          const medida = ctx.measureText(lineaPrueba).width;
          if (medida > 100) {
              ctx.fillText(textoCompleto.trim(), 90, -10);
              textoCompleto = palabra + " ";
          } else {
              textoCompleto += palabra + " ";
          }
      }
      ctx.fillText(textoCompleto.trim(), 90, 10);
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
    function animar(tiempo) {
        const progreso = Math.min((tiempo - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - progreso, 3);
        const angulo = anguloActual + rotacion * ease;
        ctx.clearRect(0, 0, 300, 300);
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(angulo);
        ctx.translate(-150, -150);
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
