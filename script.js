const characters = [  
  {
    id: 1,
    name: 'Iglá',
    pickerImg: './img/picker/igla.png',
    animation: './img/animations/igla.gif',
  },
  {
    id: 2,
    name: 'Dri',
    pickerImg: './img/picker/dri.png',
    animation: './img/animations/dri.gif',
  },
  {
    id: 3,
    name: 'Felipe',
    pickerImg: './img/picker/felipe.png',
    animation: './img/animations/felipe.gif',
  } 
];

const scene = document.getElementById('scene');

let backgroundElement;
let characterElement;
let pointsElement;
let pickerElement;
let pointsSystemInterval;

let isJumping = false;
let isGameOver = false;
let characterBottom = 10;
let characterLeft = 20;
let enemyBottom = 10;
let jumpSpeed = 20;
let characterSize = 60;
let enemySize = 60;
let points = 0;
let pointsSpeed = 200;

function handleEvents(event) {
  if (event.keyCode === 32 || event.type === 'click') {
    if (!isJumping) {
      jump();
    }
  }
}

function jump() {
  isJumping = true;

  let upInterval = setInterval(() => {
    if (characterBottom >= (characterSize * 3)) {
      // Descendo
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (characterBottom <= 10) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          characterBottom -= jumpSpeed;
          characterElement.style.bottom = characterBottom + 'px';
        }
      }, 20);
    } else {
      // Subindo
      characterBottom += jumpSpeed;
      characterElement.style.bottom = characterBottom + 'px';
    }
  }, jumpSpeed);
}

function createEnemies() {
  let enemyElement = document.createElement('div');
  let enemyPosition = window.innerWidth;
  let randomTime = Math.random() * 6000;

  if (isGameOver) return;

  enemyElement.classList.add('enemy');
  enemyElement.style.bottom = enemyBottom + 'px';
  enemyElement.style.width = enemySize  + 'px';
  enemyElement.style.height = enemySize  + 'px';
  backgroundElement.appendChild(enemyElement);

  enemyElement.style.left = enemyPosition + 'px';

  let leftTimer = setInterval(() => {
    if (enemyPosition < -(enemySize)) {
      // Saiu da tela
      clearInterval(leftTimer);
      backgroundElement.removeChild(enemyElement);
    }  else if (enemyPosition > 0 && enemyPosition < (characterSize + characterLeft) && characterBottom < enemySize) {
      // Game over
      clearInterval(leftTimer);
      isGameOver = true;
      clearInterval(pointsSystemInterval);
      characterElement.remove();
      enemyElement.remove();
      pointsElement.innerHTML= `<h1 class="game-over">Fim de jogo</h1><h2 class="points">Pontos: ${points}</h2>`;
    } else {
      enemyPosition -= 10;
      enemyElement.style.left = enemyPosition + 'px';
    }
  }, 20);

  setTimeout(createEnemies, randomTime);
}

function createBackground() {
  //create background
  backgroundElement = document.createElement('div');
  backgroundElement.classList.add('background');
  backgroundElement.setAttribute('id', 'background');
  scene.appendChild(backgroundElement);
}

function createPicker() {
  //create character picker
  pickerElement = document.createElement('div');
  pickerElement.classList.add('picker');
  pickerElement.setAttribute('id', 'picker');
  scene.appendChild(pickerElement);

  let text = document.createElement('h2');
  text.innerText= 'Selecione um jogador';
  pickerElement.appendChild(text);

  characters.forEach(character => {
    let option = document.createElement('div');
    let name = document.createElement('h4');
    let img = document.createElement('img');
    option.classList.add('option');
    img.src = `${character.pickerImg}`;
    name.innerText= character.name; 
    option.appendChild(img);  
    option.appendChild(name);  
    pickerElement.appendChild(option); 
    option.addEventListener("click",function(e){
      startGame(character.id);
    },false);     
  })  
}

function createCharacter(characterID) {

  let character = characters.find(character => character.id === characterID);

  //create character
  characterElement = document.createElement('div');
  characterElement.classList.add('character');
  characterElement.setAttribute('id', 'character');
  characterElement.style.bottom = characterBottom  + 'px';
  characterElement.style.left = characterLeft  + 'px';
  characterElement.style.width = characterSize  + 'px';
  characterElement.style.height = characterSize  + 'px';
  characterElement.style.backgroundImage = `url(${character.animation})`;
  scene.appendChild(characterElement);
}

function createPoints() {
  //create points
  pointsElement = document.createElement('h2');
  pointsElement.classList.add('points');
  pointsElement.setAttribute('id', 'points');
  scene.appendChild(pointsElement);
  points = 0;
  clearInterval(pointsSystemInterval);
  pointsSystemInterval = setInterval(pointsCounter, pointsSpeed);
}

function pointsCounter() {
  points++;
  pointsElement.innerText = points;
} 

function startGame(characterID) {
  createBackground();
  createCharacter(characterID);
  createPoints();
  createEnemies();
  
  pickerElement.remove();

  document.addEventListener('keyup', handleEvents);
  document.addEventListener('click', handleEvents);
}

function init() {
  createPicker();
}

init ();
