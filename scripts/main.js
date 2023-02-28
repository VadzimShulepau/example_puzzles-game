const gameWrapper = document.createElement('div');
gameWrapper.className = 'game-wrapper';
document.body.append(gameWrapper);

const gameHeader = document.createElement('header');
gameWrapper.append(gameHeader);

const buttonsWrapper = document.createElement('section');
buttonsWrapper.className = 'buttons-wrapper';
gameHeader.append(buttonsWrapper);

const shuffleButton = document.createElement('button');
shuffleButton.className = 'shuffle-button';
shuffleButton.innerText = 'Shuffle and start';
buttonsWrapper.append(shuffleButton);

const stopButton = document.createElement('button');
stopButton.className = 'stop-button';
stopButton.innerText = 'Stop';
buttonsWrapper.append(stopButton);

const saveButton = document.createElement('button');
saveButton.className = 'save-button';
saveButton.innerText = 'Save';
buttonsWrapper.append(saveButton);

const resultsButton = document.createElement('button');
resultsButton.className = 'results-button';
resultsButton.innerText = 'Results';
buttonsWrapper.append(resultsButton);

const gameProgressField = document.createElement('section');
gameProgressField.className = 'game-progress-field';
gameHeader.append(gameProgressField);

const stepsField = document.createElement('span');
stepsField.className = 'step-field';
stepsField.innerText = 'Moves: 0';
gameProgressField.append(stepsField);

const timeField = document.createElement('span');
timeField.className = 'time-field';
timeField.innerText = 'Time: 00:00';
gameProgressField.append(timeField);

const gameField = document.createElement('main');
gameField.className = 'game-field';
gameWrapper.append(gameField);

const gameFooter = document.createElement('footer');
gameWrapper.append(gameFooter);

const currentFrameSize = document.createElement('span');
currentFrameSize.className = 'current-frame-size';
currentFrameSize.innerText = 'Frame size: 4x4';
gameFooter.append(currentFrameSize);

const otherFrameSizes = document.createElement('span');
otherFrameSizes.className = 'other-frame-sizes';
otherFrameSizes.innerText = 'Other sizes: ';
gameFooter.append(otherFrameSizes);

//variables
let gameSize = 4;
let cellsNumber = gameSize * gameSize;
let coords = [];
let startArray = [...new Array(cellsNumber)].map((_, i) => i + 1);
let puzzleItems = [];
let startTimer;
//variables

//destinations
gameField.style.gridTemplate = `repeat(${gameSize}, 1fr) / repeat(${gameSize}, 1fr)`;
shuffleButton.addEventListener('click', shuffleAndStart);
stopButton.addEventListener('click', stopGameTimer);
gameField.addEventListener('click', movePuzzle);
//destinations

createGameField(startArray);

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
};

function clearGameTimer() {
  gameField.innerHTML = '';
  timeField.innerText = 'Time: 00:00';
  stepsField.innerText = 'Moves: 0';
  clearInterval(startTimer);
};

function showGameTimer() {
  const start = Date.now();
  function setTimer() {
    let time = Date.now() - start;
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    seconds < 10 && (seconds = `0${seconds}`);
    minutes < 10 && (minutes = `0${minutes}`);
    timeField.innerText = `Time: ${minutes} : ${seconds}`;
  };

  startTimer = setInterval(setTimer, 1000);
};

function shuffleAndStart() {
  clearGameTimer();
  showGameTimer();
  const array = shuffleArray(startArray);
  createGameField(array);
};

function stopGameTimer() {
  clearInterval(startTimer);
};

function createGameField(gameArray) {
  // console.log(gameArray)
  puzzleItems = gameArray.reduce((acc, item, i, arr) => {
    item = document.createElement('div');
    item.className = 'puzzle';
    item.id = arr[i];

    if (item.id < arr.length) {
      item.innerText = arr[i];
    } else {
      item.style.backgroundColor = '#E5E5E5';
      item.style.border = 'none';
    };

    let row = 1;
    let col = 1;

    for (let j = 0; j < cellsNumber; j++) {

      if (col >= gameSize + 1) {
        row++;
        col = 1;
      };

      coords.push(`${row} / ${col} / ${row + 1} / ${col + 1}`); //row-start / col-start / row-end / col-end/
      col++;
    };

    acc.push(item);
    gameField.append(item);
    return acc;
  }, []);

  puzzleItems.map((item, i) => {
    item.style.gridArea = coords[i];
  });
};

function movePuzzle(e) {

  let [row1, col1, row2, col2] = e.target.style.gridArea.split(' / ');
  //row-start / col-start / row-end / col-end/

  const baseCell = document.getElementById(`${startArray.length}`);
  const [bRow1, bCol1, bRow2, bCol2] = baseCell.style.gridArea.split(' / ');
  // console.log(row1, col1, row2, col2)
  // console.log(bRow1, bCol1, bRow2, bCol2)
  if (row2 === bRow1 && col1 === bCol1 || row1 === bRow1 && col2 === bCol1 || row1 === bRow2 && col1 === bCol1 || row1 === bRow1 && col1 === bCol2) {
    e.target.style.gridArea = [bRow1, bCol1, bRow2, bCol2].join(' / ');
    baseCell.style.gridArea = [row1, col1, row2, col2].join(' / ');
    movesCount();

    swapArray(puzzleItems, puzzleItems.indexOf(e.target), puzzleItems.indexOf(baseCell));

  };
};

function movesCount() {

  function parseNumber(n) {
    return Number([...n].map((item) => {
      if (!isNaN(item)) return item;
    }).join(''));
  };

  let num = parseNumber(stepsField.innerText);
  num += 1;
  stepsField.innerText = `Moves: ${num}`;
};

function swapArray(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  // console.log(arr)
  // arr[i] = arr.splice(j, 1, arr[i])[0];
  isWon(arr) && showWin(arr[arr.length - 1]);
};

function isWon(arr) {
  return arr.map((item) => item.id).toString() == startArray.toString();
};

function showWin(cell) {
  cell.style.backgroundColor = '#0D9095';
  cell.style.color = 'white';
  cell.innerText = 'WIN!';
  cell.style.gridArea = '1 / 1 / 5 / 5';
  cell.style.border = '1px solid white';
  cell.style.opacity = 0.8;
};
