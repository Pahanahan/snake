const cellBox = document.querySelector(".cell__box");
const cell = document.querySelectorAll(".cell");
const end = document.querySelector(".end");
const again = document.querySelector(".again");
const scoreSpan = document.querySelector(".score span");
const recordSpan = document.querySelector(".record span");
const arrowsBox = document.querySelector(".arrows__box");

// Создание медиа-запроса для экранов шириной 1024px и меньше
const mediaQuery = window.matchMedia("(max-width: 1024px)");

// Функция, которая выполняется при срабатывании медиа-запроса
function handleMediaQueryChange(event) {
  if (event.matches) {
    arrowsBox.style.display = "flex";
  } else {
    arrowsBox.style.display = "none";
  }
}

// Проверка начального состояния
handleMediaQueryChange(mediaQuery);

// Добавление слушателя событий для отслеживания изменений медиа-запроса
mediaQuery.addEventListener("change", handleMediaQueryChange);

let recordLocalStorage = JSON.parse(localStorage.getItem("recordSnake"));

if (recordLocalStorage) {
  recordSpan.textContent = recordLocalStorage;
}

// Инициализация змейки
const headSnake = document.querySelector(".cell45");
const bodySnake = document.querySelector(".cell44");
const tailSnake = document.querySelector(".cell43");

headSnake.classList.add("cell__head");
bodySnake.classList.add("cell__body");
tailSnake.classList.add("cell__tail");

function randomBackgroundColor() {
  const color1 = Math.trunc(Math.random() * 257);
  const color2 = Math.trunc(Math.random() * 257);
  const color3 = Math.trunc(Math.random() * 257);
  return `rgb(${color1}, ${color2}, ${color3})`;
}

document.querySelector("body").style.backgroundColor = randomBackgroundColor();
randomBackgroundColor();

let score = 0;

function scoreNumberToText() {
  score++;
  scoreSpan.textContent = score;
}

function recordNumberToText() {
  if (recordLocalStorage < score) {
    recordLocalStorage = score;
    saveToLocalStorage();
    recordSpan.textContent = recordLocalStorage;
  } else {
    recordSpan.textContent = recordLocalStorage;
  }
}

// Генерация случайной точки, избегая ячеек, где находится змейка
function generatePoint() {
  let randomPoint = Math.ceil(Math.random() * 100);
  let point = document.querySelector(`.cell${randomPoint}`);

  // Проверяем, не попадает ли точка на змейку
  while (
    randomPoint === 45 ||
    randomPoint === 44 ||
    randomPoint === 43 ||
    !point
  ) {
    randomPoint = Math.ceil(Math.random() * 100);
    point = document.querySelector(`.cell${randomPoint}`);
  }

  point.classList.add("cell__point");
  console.log("Generated point at:", randomPoint);
}

generatePoint();

// Функция для движения змейки
let snakeParts = [headSnake, bodySnake, tailSnake]; // Массив частей змейки

function changeSnake() {
  const tail = snakeParts[snakeParts.length - 1];
  const body = snakeParts[snakeParts.length - 2];
  const head = snakeParts[0];

  tail.classList.remove("cell__tail");
  body.classList.replace("cell__body", "cell__tail");
  head.classList.replace("cell__head", "cell__body");

  // Пример перемещения головы (движение на одну клетку вниз)
  let nextCell;
  if (eventMoveDescription === "ArrowDown") {
    const nextCellNumber = parseInt(head.classList[1].replace("cell", "")) + 10;
    nextCell = document.querySelector(`.cell${nextCellNumber}`);
  } else if (eventMoveDescription === "ArrowUp") {
    const nextCellNumber = parseInt(head.classList[1].replace("cell", "")) - 10;
    nextCell = document.querySelector(`.cell${nextCellNumber}`);
  } else if (eventMoveDescription === "ArrowLeft") {
    const nextCellNumber = parseInt(head.classList[1].replace("cell", "")) - 1;
    nextCell = document.querySelector(`.cell${nextCellNumber}`);
  } else if (eventMoveDescription === "ArrowRight") {
    const nextCellNumber = parseInt(head.classList[1].replace("cell", "")) + 1;
    nextCell = document.querySelector(`.cell${nextCellNumber}`);
  }

  if (nextCell) {
    nextCell.classList.add("cell__head");
    snakeParts.unshift(nextCell); // Добавляем новую голову в массив

    if (nextCell.classList.contains("cell__point")) {
      nextCell.classList.remove("cell__point");
      generatePoint();
      scoreNumberToText();
    } else {
      const removedPart = snakeParts.pop(); // Убираем последний элемент, если не съели точку
      removedPart.classList.remove("cell__body");
    }
  }
}

// Движение змейки по нажатию клавиш
let eventMoveDescription = "ArrowRight";

function startGameEventListener(e) {
  const left = "ArrowLeft";
  const right = "ArrowRight";
  const up = "ArrowUp";
  const down = "ArrowDown";

  if (e.key === "ArrowDown" && eventMoveDescription === "ArrowUp") {
    eventMoveDescription = "ArrowUp";
    changeSnake();
  } else if (e.key === "ArrowDown") {
    eventMoveDescription = "ArrowDown";
    changeSnake();
  }

  if (e.key === "ArrowUp" && eventMoveDescription === "ArrowDown") {
    eventMoveDescription = "ArrowDown";
    changeSnake();
  } else if (e.key === "ArrowUp") {
    eventMoveDescription = "ArrowUp";
    changeSnake();
  }

  if (e.key === "ArrowLeft" && eventMoveDescription === "ArrowRight") {
    eventMoveDescription = "ArrowRight";
    changeSnake();
  } else if (e.key === "ArrowLeft") {
    eventMoveDescription = "ArrowLeft";
    changeSnake();
  }

  if (e.key === "ArrowRight" && eventMoveDescription === "ArrowLeft") {
    eventMoveDescription = "ArrowLeft";
    changeSnake();
  } else if (e.key === "ArrowRight") {
    eventMoveDescription = "ArrowRight";
    changeSnake();
  }
}

function endGameEventListener() {
  window.removeEventListener("keydown", startGameEventListener);
}

let arrowUp = document.querySelector(".up");
let arrowDown = document.querySelector(".down");
let arrowLeft = document.querySelector(".left");
let arrowRight = document.querySelector(".right");

arrowUp.addEventListener("click", function () {
  eventMoveDescription = "ArrowUp";
});
arrowDown.addEventListener("click", function () {
  eventMoveDescription = "ArrowDown";
});
arrowLeft.addEventListener("click", function () {
  eventMoveDescription = "ArrowLeft";
});
arrowRight.addEventListener("click", function () {
  eventMoveDescription = "ArrowRight";
});

let time;

function startGame() {
  end.classList.add("hidden");
  time = setInterval(() => {
    window.addEventListener("keydown", startGameEventListener);
    checkCollisionWithWall();

    changeSnake();
  }, 300);
}

startGame();

function reloadWindow() {
  location.reload();
}

again.addEventListener("click", reloadWindow);

function checkCollisionWithWall() {
  let headSnakeError = document.querySelector(".cell__head");
  if (
    (headSnakeError.classList.contains("cell10") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell20") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell30") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell40") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell50") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell60") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell70") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell80") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell90") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell100") &&
      eventMoveDescription === "ArrowRight") ||
    (headSnakeError.classList.contains("cell1") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell11") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell21") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell31") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell41") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell51") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell61") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell71") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell81") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell91") &&
      eventMoveDescription === "ArrowLeft") ||
    (headSnakeError.classList.contains("cell1") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell2") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell3") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell4") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell5") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell6") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell7") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell8") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell9") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell10") &&
      eventMoveDescription === "ArrowUp") ||
    (headSnakeError.classList.contains("cell91") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell92") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell93") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell94") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell95") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell96") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell97") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell98") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell99") &&
      eventMoveDescription === "ArrowDown") ||
    (headSnakeError.classList.contains("cell100") &&
      eventMoveDescription === "ArrowDown")
  ) {
    console.log("Game Over!!!!!");
    clearInterval(time);
    endGameEventListener();
    end.classList.remove("hidden");
    recordNumberToText();
  }

  if (headSnakeError.classList.contains("cell__body")) {
    console.log("Game Over!!!!!");
    clearInterval(time);
    endGameEventListener();
    end.classList.remove("hidden");
    recordNumberToText();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("recordSnake", JSON.stringify(recordLocalStorage));
}
