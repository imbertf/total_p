// Récupérer le canvas et son contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Définir les propriétés du dessin
const penColor = "deeppink";
const lineWidth = 3;
let genitalX = 160; // Position initiale en X des parties génitales
let genitalY = 0; // Position initiale en Y des parties génitales
let objectX = 0; // Position initiale en X de l'objet
let objectY = 0; // Position initiale en Y de l'objet

// Propriétés du cercle mobile
const circleSize = 80; // Taille du cercle
let circleX = canvas.width / 2 - circleSize / 2; // Position initiale en X du cercle
let circleY = canvas.height / 2 - circleSize / 2; // Position initiale en Y du cercle
let circleSpeedX = 2; // Vitesse initiale en X du cercle
let circleSpeedY = 2; // Vitesse initiale en Y du cercle

// Fonction pour dessiner les parties génitales
function drawGenitals() {
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Créer un stylo rose
  ctx.strokeStyle = penColor;
  ctx.lineWidth = lineWidth;

  // Dessiner le premier cercle (partie supérieure)
  ctx.beginPath();
  ctx.arc(50 + objectX, 50 + objectY, 20, 0, Math.PI * 2); // Dessiner le cercle supérieur
  ctx.stroke();

  // Dessiner le deuxième cercle (partie inférieure)
  ctx.beginPath();
  ctx.arc(50 + objectX, 90 + objectY, 20, 0, Math.PI * 2); // Dessiner le cercle inférieur
  ctx.stroke();

  // Dessiner l'ovale (partie entre les deux cercles)
  ctx.beginPath();
  ctx.moveTo(70 + objectX, 50 + objectY); // Déplacer le stylo vers le début de l'ovale
  ctx.quadraticCurveTo(
    80 + objectX + genitalX,
    60 + objectY + genitalY,
    70 + objectX,
    90 + objectY
  ); // Dessiner l'ovale
  ctx.stroke();
}

// Fonction pour dessiner le cercle mobile
function drawCircle() {
  // Créer un stylo bleu
  ctx.fillStyle = "deeppink";

  // Dessiner le cercle
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Fonction pour mettre à jour la taille du canvas pour qu'il occupe les 3/4 de l'écran
function resizeCanvas() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const canvasWidth = (screenWidth * 3) / 4;
  const canvasHeight = (screenHeight * 3) / 4;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  objectY = canvasHeight - 140; // Positionnement initial de l'objet en bas du canvas
  drawGenitals(); // Redessiner les parties génitales avec la nouvelle taille du canvas
}

// Appeler la fonction pour redimensionner le canvas lors du chargement de la page
resizeCanvas();

// Ajouter un gestionnaire d'événements pour redimensionner le canvas lorsque la fenêtre est redimensionnée
window.addEventListener("resize", resizeCanvas);

// Fonction pour mettre à jour les coordonnées des parties génitales avec la roulette de la souris
function updateOval(event) {
  const step = 5; // Nombre de pixels de déplacement à chaque rotation de la roulette
  if (event.deltaY > 0) {
    genitalY += step; // Courber l'ovale vers le haut avec la roulette vers le bas
  } else {
    genitalY -= step; // Courber l'ovale vers le bas avec la roulette vers le haut
  }
  drawGenitals(); // Redessiner les parties génitales avec les nouvelles coordonnées
}

// Ajouter un gestionnaire d'événements pour détecter les mouvements de la roulette de la souris
canvas.addEventListener("wheel", updateOval);

// Fonction pour mettre à jour les coordonnées de l'objet avec les touches du clavier
function updateObject(event) {
  const step = 5; // Nombre de pixels de déplacement à chaque touche pressée
  switch (event.keyCode) {
    case 37: // Flèche gauche
      objectX -= step;
      break;
    case 38: // Flèche haut
      objectY -= step;
      break;
    case 39: // Flèche droite
      objectX += step;
      break;
    case 40: // Flèche bas
      objectY += step;
      break;
  }
  drawGenitals(); // Redessiner les parties génitales avec les nouvelles coordonnées
}

// Ajouter un gestionnaire d'événements pour détecter les touches du clavier
document.addEventListener("keydown", updateObject);

// Fonction pour mettre à jour la position du cercle mobile
function updateCircle() {
  // Mise à jour de la position du cercle en fonction de sa vitesse
  circleX += circleSpeedX;
  circleY += circleSpeedY;

  // Vérifier les collisions avec les bords du canvas
  if (circleX + circleSize / 2 > canvas.width || circleX - circleSize / 2 < 0) {
    circleSpeedX = -circleSpeedX; // Inverser la direction horizontale en cas de collision avec les bords gauche ou droit
  }
  if (
    circleY + circleSize / 2 > canvas.height ||
    circleY - circleSize / 2 < 0
  ) {
    circleSpeedY = -circleSpeedY; // Inverser la direction verticale en cas de collision avec les bords supérieur ou inférieur
  }

  // Vérifier la collision avec l'objet
  if (
    circleX + circleSize / 2 >= 50 + objectX && // Côté droit du cercle est à droite de la bordure gauche de l'objet
    circleX - circleSize / 2 <= 50 + objectX + 40 && // Côté gauche du cercle est à gauche de la bordure droite de l'objet
    circleY + circleSize / 2 >= 50 + objectY && // Bas du cercle est en dessous de la bordure supérieure de l'objet
    circleY - circleSize / 2 <= 90 + objectY && // Haut du cercle est au-dessus de la bordure inférieure de l'objet
    ((circleSpeedY > 0 && circleY - circleSize / 2 <= 90 + objectY) || // Le cercle va vers le bas et est au-dessus de l'objet
      (circleSpeedY < 0 && circleY + circleSize / 2 >= 50 + objectY)) // Le cercle va vers le haut et est en dessous de l'objet
  ) {
    // Gérer la collision avec l'objet en inversant la direction du cercle
    if (circleSpeedY > 0) {
      // Si le cercle descend, il rebondit vers le haut
      circleSpeedY = -circleSpeedY;
      circleY = 50 + objectY - circleSize / 2; // Empêcher le cercle de passer à travers l'objet
    } else {
      // Si le cercle monte, il rebondit vers le bas
      circleSpeedY = -circleSpeedY;
      circleY = 90 + objectY + circleSize / 2; // Empêcher le cercle de passer à travers l'objet
    }
  }

  // Effacer le canvas avant de redessiner le cercle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner les parties génitales et le cercle
  drawGenitals();
  drawCircle();
}

// Appeler la fonction pour mettre à jour la position du cercle toutes les 16 millisecondes (environ 60 fois par seconde)
setInterval(updateCircle, 16);

const addAutoplay = () => {
  // Attendez que le document soit entièrement chargé
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      // Récupérer l'élément audio avec controls
      const audioPlayer = document.querySelector("audio[controls]");
      audioPlayer.play();
    }, 1000);
  });
};

addAutoplay();
