// varibale for holding values for touch events
let startingX, startingY, movingX, movingY;
//Container to hold the reference which contain the undo text
const Undo_Container = document.querySelector(".undo");
/**
 * Stack to hold the last 10 game states
 * const ele = {
    configuration: lastState, // It is grid configuration
    score: scoreobj.score, // It stores the score
  };
 * 
 */
const Stack = []; // Stack to store previous 10 states.
// Custome event to fire change color when innerText of class changes.
const ChangeBackgroundColor = new Event("change_background_color");
// This variable store the last state(Can be eliminated)
let lastState = new Array(4); // letiable to store last state of game(can be removed) // manual event
// This variable hold the reference of current game status.
const gameStatus = document.getElementById("game_status");
// This is very main variable which hold the reference the for the 2048 game.
//This is one day array of containing Object of type:-
//<div class="cell"</div>
const grid = document.querySelectorAll(".cell"); // imported all div cell having class name cell.It is array of div

// Map which point to the integer to the color
const colorMap = {
  0: "rgb(205,193,180)",
  2: "#EEE4DA",
  4: "#EEE1C9",
  8: "#F3B27A",
  16: "#F69664",
  32: "#F77C5F",
  64: "#F75F3B",
  128: "#EDD073",
  256: "#5c094f",
  512: "#EDC850",
  1024: "#EDC53F",
  2048: "#EDC22D",
};

/** Incorrect variable naming conventions used throughout project. Learn about letiable naming conventions/standards */

/**
 * It should be defined as let. A better way to use it to use a class and use methods to update it, so it's not available globally.
 * Think what all could be included in that class.
 * And after that it's your call whether to implement it for now or not. The future assignments will still require you to implement it.
 */

// This object stores the current score of game and text which point to the score on the html page.

let scoreobj = new Object(); // Creating new object

scoreobj.score = 0;
scoreobj.scoretext = document.getElementById("score");
scoreobj.update_score = function (num) {
  this.score = this.score + num;
  this.scoretext.innerText = this.score;
};

/** Let me know whether we should use `let` or `const` */

/** For all the variables, see if youhave to use `let` or `const`. Never use `var`. */

// This variable hold the reference of h1 element where we display win or Loose.

// Mapping from integer to color.

let box = new Array(4); // 2048 grid

// This is a list which hold box places which are available to display new 2

const empty = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

let current_cell = 0; // temporary variable

// Added event listener to the main document(window)
document.addEventListener("keydown", logKey);

// Call  the move function accordingly to the key pressed.
function logKey(e) {
  switch (e.keyCode) {
    case 39:
      moveRight();
      break;
    case 37:
      moveLeft();
      break;
    case 38:
      moveUp();
      break;
    case 40:
      moveDown();
      break;
    default:
      console.log("Wrong key pressed");
  }
}

// storing div reference in the box variable and setting initail valy=ue 0 to all varaible.

for (let i = 0; i <= 3; i++) {
  box[i] = [];
  lastState[i] = [];
  for (let j = 0; j <= 3; j++) {
    grid[current_cell].innerText = 0;
    box[i].push(grid[current_cell]);
    current_cell += 1;
  }
}

/** Every line need not be documented. A good explanation for a function should be enough.
 * Only complex logics and statements are required to be explained separately.
 *
 * And there is incorrect variable naming convention for all the functions
 */

// function to generate value of 2 at random avilable space

function generateTwoAtAvailableSpace() {
  let final_range = empty.length;
  let x1;
  let y1;
  let place = Math.floor(Math.random() * final_range); // random index
  x1 = parseInt(empty[place] / 4); // will give row at which it will insert 2
  y1 = empty[place] % 4; // will give coulumn at which it will insert 2
  box[x1][y1].innerText = 2;
  function_change_background_color(x1, y1); // placing 2
}

/**
 * Missing commenting. Thinkproperly what all needs to be commented.
 * There are a lot of unnecessary empty lines.
 * Fix for all functions.
 */

/**This function get executed when user press right down arrow key.
 * It first check that Is it possible to make some move or not. If yes then it proceed
 * 1. It save last configuration
 * 2. Iterate all the rows and column(penalty mate). And check that is it possible to merge two boxes or next box  is empty or not
 * of empty move current innerText value to next box and setting 0 to itself.
 * Then change the background color on the basis of innerText.
 * 3. If  boxes get merged than it decrease the range at which merge can happen.
 *
 * */

function moveRight() {
  if (checkGameStatus()) {
    // store last state of game in Stack
    save_last_status();
    // boolean value to reflect the change in 2048 configuration.
    let isStateChange = false;

    // Iterating rows and columns.
    for (let i = 0; i < 4; i++) {
      /**  Initially the greatest column at which merge can take place is 3. If merge take place at column 3 then we cannot merge
       * another at same place so we decrease it by 1. And in all move accordingly.
       */
      let range = 3;

      for (let j = 2; j >= 0; j--) {
        // current box should slide to the possible box which are empty. We are moving box state one by one till movement can take place.
        let current_column = j;
        /** Unused variable */
        // If any box is zero then don't proceed.

        if (parseInt(box[i][j].innerText) != 0) {
          while (current_column < range) {
            /** Using the same reference - box[i][current_column + 1] everywhere is not good. A change in one of them would require a change in all of them.
             * And that is undesirable
             */
            // As you  suggested.
            const current_box = box[i][current_column];
            const another_box = box[i][current_column + 1];
            // merging only can take place if and only if it is another box is not zero and it is equal to current box.
            if (
              parseInt(another_box.innerText) != 0 &&
              parseInt(another_box.innerText) == parseInt(current_box.innerText)
            ) {
              /**
               * If change take place then change value to true
               */
              isStateChange = true;

              another_box.innerText = 2 * parseInt(another_box.innerText);
              scoreobj.update_score(2 * parseInt(current_box.innerText));
              current_box.innerText = 0;
              // Change the color of both boxes.
              function_change_background_color(i, current_column);
              function_change_background_color(i, current_column + 1);

              range -= 1;
              // If merge take place then break the column loop don't move current box more.
              break;
            }
            /** Is this IF statement even required? */
            /**It is require because next box can be zero or something different from current box.
             *  We can use nested if else but I don't want it
             * */
            if (parseInt(another_box.innerText) === 0) {
              isStateChange = true;
              another_box.innerText = parseInt(current_box.innerText);
              current_box.innerText = 0;
              function_change_background_color(i, current_column);
              function_change_background_color(i, current_column + 1);
            }
            current_column += 1;
          }
        }
      }
    }
    // So before placing the next 2 we should update the empty list which contain empty boxes.

    if (isStateChange) {
      update_empty(box);
      generateTwoAtAvailableSpace();
    }
  }
}

/** Same mistakes in this one too */
function moveLeft() {
  if (checkGameStatus()) {
    save_last_status();
    let isStateChange = false;
    for (let i = 0; i < 4; i++) {
      let range = 0;

      for (let j = 1; j < 4; j++) {
        let current_column = j;

        if (parseInt(box[i][j].innerText) != 0) {
          while (current_column > range) {
            if (
              parseInt(box[i][current_column - 1].innerText) != 0 &&
              parseInt(box[i][current_column - 1].innerText) ==
                parseInt(box[i][current_column].innerText)
            ) {
              isStateChange = true;
              box[i][current_column - 1].innerText =
                2 * parseInt(box[i][current_column - 1].innerText);
              scoreobj.update_score(
                2 * parseInt(box[i][current_column].innerText)
              );
              box[i][current_column].innerText = 0;
              function_change_background_color(i, current_column);
              function_change_background_color(i, current_column - 1);

              range += 1;
              break;
            }
            if (parseInt(box[i][current_column - 1].innerText) === 0) {
              isStateChange = true;
              box[i][current_column - 1].innerText = parseInt(
                box[i][current_column].innerText
              );
              box[i][current_column].innerText = 0;
              function_change_background_color(i, current_column);
              function_change_background_color(i, current_column - 1);
            }
            current_column -= 1;
          }
        }
      }
    }

    if (isStateChange) {
      update_empty(box);
      generateTwoAtAvailableSpace();
    }
  }
}

/** Same mistakes in this one too */
function moveUp() {
  if (checkGameStatus()) {
    save_last_status();
    let isStateChange = false;
    for (let j = 0; j < 4; j++) {
      let range = 0;

      for (let i = 1; i < 4; i++) {
        let current_row = i;

        if (parseInt(box[i][j].innerText) != 0) {
          while (current_row > range) {
            if (
              parseInt(box[current_row - 1][j].innerText) != 0 &&
              parseInt(box[current_row - 1][j].innerText) ==
                parseInt(box[current_row][j].innerText)
            ) {
              isStateChange = true;
              box[current_row - 1][j].innerText =
                2 * parseInt(box[current_row - 1][j].innerText);
              scoreobj.update_score(
                2 * parseInt(box[current_row][j].innerText)
              );
              box[current_row][j].innerText = 0;
              function_change_background_color(current_row, j);
              function_change_background_color(current_row - 1, j);

              range += 1;
              break;
            }
            if (parseInt(box[current_row - 1][j].innerText) === 0) {
              isStateChange = true;
              box[current_row - 1][j].innerText = parseInt(
                box[current_row][j].innerText
              );
              box[current_row][j].innerText = 0;
              function_change_background_color(current_row, j);
              function_change_background_color(current_row - 1, j);
            }
            current_row -= 1;
          }
        }
      }
    }

    if (isStateChange) {
      update_empty(box);
      generateTwoAtAvailableSpace();
    }
  }
}

/** Same mistakes in this one too */
function moveDown() {
  // check for win or loose will return true if win and false if loose
  if (checkGameStatus()) {
    save_last_status();
    let isStateChange = false;
    for (let j = 0; j < 4; j++) {
      let range = 3;

      for (let i = 2; i >= 0; i--) {
        let current_row = i;

        if (parseInt(box[i][j].innerText) != 0) {
          while (current_row < range) {
            if (
              parseInt(box[current_row + 1][j].innerText) != 0 &&
              parseInt(box[current_row + 1][j].innerText) ==
                parseInt(box[current_row][j].innerText)
            ) {
              isStateChange = true;
              box[current_row + 1][j].innerText =
                2 * parseInt(box[current_row][j].innerText);
              scoreobj.update_score(
                2 * parseInt(box[current_row][j].innerText)
              );
              box[current_row][j].innerText = 0;
              function_change_background_color(current_row, j);
              function_change_background_color(current_row + 1, j);

              range -= 1;
              break;
            }
            if (parseInt(box[current_row + 1][j].innerText) === 0) {
              isStateChange = true;
              box[current_row + 1][j].innerText = parseInt(
                box[current_row][j].innerText
              );
              box[current_row][j].innerText = 0;
              function_change_background_color(current_row, j);
              function_change_background_color(current_row + 1, j);
            }
            current_row += 1;
          }
        }
      }
    }

    if (isStateChange) {
      update_empty(box);
      generateTwoAtAvailableSpace();
    }
  }
}

/** What is this explanation for?
 * No need of input can also we can also handle with global variable.
 */
// Input: Copy of 2D array of original 2048 confiuration of .
// function: It pops out the filled box from global empty_array and pushes back which are empty.

function update_empty(arr) {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      if (parseInt(arr[j][i].innerText) != 0) {
        if (empty.includes(j * 4 + i)) {
          empty.splice(empty.indexOf(j * 4 + i), 1); // find index of place then remove it using splice function
        }
      } else {
        if (!empty.includes(j * 4 + i)) {
          // if it zero and  it is not present in empty array push it back.
          empty.push(j * 4 + i);
        }
      }
    }
  }
}

// Input: ith row and jth col of 2d grid(2048)
// Change the background color of div background according to innerText

function function_change_background_color(i, j) {
  //
  box[i][j].addEventListener("change_background_color", (e) => {
    box[i][j].style.backgroundColor = colorMap[parseInt(box[i][j].innerText)]; // changing the background color using DOM manipulation;
  });
  box[i][j].dispatchEvent(ChangeBackgroundColor); // Dispatch event
}

// This function will check for win and loose return accordingly
// if any div inner text is equal to 2048 then display win and if any further move is not possible then show loose
function checkGameStatus() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (parseInt(box[i][j].innerText) == 2048) {
        gameStatus.style.display = "block"; // change display to block to show
        gameStatus.innerText = "You Win"; // change text
        return true; // returning true because further move is possible
      } else {
        // if ant div inner text is equal to 0  or any neighbour div inner text is equal then further move are possibke
        // check in all four direction
        if (parseInt(box[i][j].innerText) == 0) {
          return true;
        }
        /** Do you require 2 IF statements? */
        if (
          i - 1 > 0 &&
          parseInt(box[i][j].innerText) == parseInt(box[i - 1][j].innerText)
        ) {
          return true;
        }
        if (
          j - 1 > 0 &&
          parseInt(box[i][j - 1].innerText) == parseInt(box[i][j].innerText)
        ) {
          return true;
        }
        if (
          i + 1 < 4 &&
          parseInt(box[i + 1][j].innerText) == parseInt(box[i][j].innerText)
        ) {
          return true;
        }
        if (
          j + 1 < 4 &&
          parseInt(box[i][j + 1].innerText) == parseInt(box[i][j].innerText)
        ) {
          return true;
        }
      }
    }
  }
  // if any further move is not possible then user lost the game change the status accordingly.
  gameStatus.style.display = "block";
  gameStatus.innerText = "You Loose";

  return false;
}

// It store the current state before any move. It store maximum last 10 state.

function save_last_status() {
  // If Stack size is greater than 10 remove the first
  if (Stack.length > 10) {
    /** Variable not required */
    Stack.shift();
  }

  const ele = {
    configuration: lastState,
    score: scoreobj.score,
  };
  // push into the Stack
  Stack.push(ele);

  // Redefining array and storing current state into variable lastState
  lastState = new Array(4);
  for (let i = 0; i < 4; i++) {
    lastState[i] = [];
    for (let j = 0; j < 4; j++) {
      lastState[i].push(parseInt(box[i][j].innerText));
    }
  }
}
// It  undo the previous state of game
function undo_game_state() {
  Undo_Container.style.backgroundColor = "rgb(151, 28, 28)";
  setTimeout(function () {
    Undo_Container.style.backgroundColor = "rgb(247, 220, 220)";
  }, 100); // set background color of button back to previous state
  gameStatus.style.display = "none"; // if gameStatu is visible make univisible
  // Now store the lastState into box configuartion(2048 grid)
  if (Stack.length > 0) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        box[i][j].innerText = lastState[i][j];
        function_change_background_color(i, j);
      }
    }
    /** `Let` or `const`? */
    const popped_element = Stack.pop(); //Now pop second last configuartion  and store in lastState
    lastState = popped_element.configuration; // Assigning value to last state
    const change = popped_element.score; // updating score variable in JS
    scoreobj.update_score(-1 * (scoreobj.score - change)); // Updating score on front end
  }
}

function touchStart(evt) {
  startingX = evt.touches[0].clientX;
  startingY = evt.touches[0].clientY;
}

function touchMoving(evt) {
  movingX = evt.touches[0].clientX;
  movingY = evt.touches[0].clientY;
}

function touchEnd(evt) {
  if (startingX + 100 < movingX) {
    moveRight();
  } else if (startingX - 100 > movingX) {
    moveLeft();
  } else if (startingY + 100 < movingY) {
    moveDown();
  } else moveUp();
}

/** Do you know what you are doing here, and why does this work? */
// As we loaded our JavaScript this function will called first
generateTwoAtAvailableSpace();
/** See if you break the functions in this file into multiple files, for modularity */
