window.addEventListener('load', function () {
  init();
});

var num_p1 = 0;
function player1() {
  if (num_p1 < 0) {
    num_p1 = 0
  }
  if (document.getElementById(0).innerHTML == "" && num_p1 > 40) {
    document.getElementById('0' + 40).innerHTML = '';
    num_p1 = 0;
    console.log('0' + num_p1);
  }
  // document.getElementById('display').innerText = num_p1;
  if (num_p1 % 2 == 0) {
    document.getElementById('0' + num_p1).innerHTML = `
    <span><b style="padding-left: 16px; color: #ff0000;">Player 1</b></span><img src="img/Player_1.png" width="64" height="64" id="player1-icon">
    `;
    if (num_p1 - 2 >= 0) {
      document.getElementById('0' + (num_p1 - 2)).innerHTML = '';
    } else {
      document.getElementById('0' + (num_p1 + 2)).innerHTML = '';
    }
  }
}

var num_p2 = 1;
function player2() {
  if (num_p2 < 1) {
    num_p2 = 1
  }
  if (document.getElementById(1).innerText == "" && num_p2 > 41) {
    document.getElementById('0' + 41).innerText = '';
    num_p2 = 1;
    console.log('0' + num_p2);
  }
  // document.getElementById('display').innerText = num_p2;
  if (num_p2 % 2 != 0) {
    document.getElementById('0' + num_p2).innerHTML = `
    <span><b style="padding-left: 16px; color: #0000ff;">Player 2</b></span><img src="img/Player_2.png" width="64" height="64" id="player2-icon">
    `;
    if (num_p2 - 2 >= 1) {
      document.getElementById('0' + (num_p2 - 2)).innerHTML = '';
    } else {
      document.getElementById('0' + (num_p2 + 2)).innerHTML = '';
    }
  }
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function generateBoard() {
  var num_questions = 21;
  var container = document.getElementById('game-board');
  var child = container.getElementsByClassName('block');
  var even_numbers = new Array();
  var odd_numbers = new Array();
  
  for (var i = 0; i < 42; i++) {
    if (i % 2 == 0) {
      even_numbers.push('0' + i);
    } else {
      odd_numbers.push('0' + i);
    }
  }
  for (var i = 0; i < num_questions; i++) {
    var board = document.createElement('div');
    board.setAttribute('class', 'block');
    board.setAttribute('id', i + 43);
    document.getElementById('game-board').appendChild(board);
    var player1 = document.createElement('div');
    var player2 = document.createElement('div');
    player1.setAttribute('id', even_numbers[i]);
    player2.setAttribute('id', odd_numbers[i]);
    player1.setAttribute('class', 'player1');
    player2.setAttribute('class', 'player2');
    document.getElementsByClassName('block')[i].appendChild(player1);
    document.getElementsByClassName('block')[i].appendChild(player2);
    if (child.length % 8 == 0) {
      child[i].style.margin = "8px 0px 0px 8px";
    }
    if (num_questions <= 8) {
      child[i].style.margin = "8px 0px 0px 0px";
    }
  }
  var directions = document.createElement('div');
  directions.id = "directions";
  var beforeElement = document.getElementById('43');
  insertAfter(beforeElement, directions);
  createDirections();
}

function createDirections() {
  document.getElementById('directions').innerHTML = `
  <h1>The Crucible Board game</h1>
If you answer the question correct then you move up a spot. If you get a question wrong then you move back a space. Who ever at the end of the game has the most points will win the game. Once someone has won the game the game will ask you weather you want to play again or not.<br>
<p><b>Note:</b> This has to be run on Mozila Firefox inorder to work properly.</p>
<br>
<div style="display: inline-block;">It is <div id="currentTurn">null</div> turn!!!</div>
  `;
}

function loadJson(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'json/questions.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      callback(xobj.responseText);
    }
  }
  xobj.send(null);
}

function whoWon(player, gameQuestions) {
  if (gameQuestions.question0.length == 0) {
    for (var i = 0; i < 42; i++) {
      if (document.getElementById('0' + i).innerText == player) {
        break;
      }
    }
    alert(player + " " + "won the game");
    var playAgain = prompt("Would you like to play again? (Yes or No)", "");
    if (playAgain == "Yes" || playAgain == "yes") {
      init();
    } else {
      document.write("Game Over");
    }
  }
}

function shuffleArray(array) {
  var i = array.length - 1;
  for (i; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[r];
    array[r] = temp;
  }
  return array;
}

function genRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function removeQuestion(array, indexToDelete) {
  array.splice(indexToDelete, 1);
}

var count = -1;
function flipFlop() {
  var players = ['Player 1', 'Player 2'];
  count++;
  if (count > players.length - 1) {
    count = 0;
  }
  return players[count];
}

var player1Questions = {};
var player2Questions = {};
function init() {
  player1Questions;
  player2Questions;
  loadJson(function (response) {
    var questions = JSON.parse(response);
    player1Questions.question0 = JSON.parse(response).question0;
    player1Questions.incorrect0 = JSON.parse(response).incorrect0;
    player1Questions.incorrect1 = JSON.parse(response).incorrect1;
    player1Questions.incorrect2 = JSON.parse(response).incorrect2;
    player1Questions.correct0 = JSON.parse(response).correct0;

    player2Questions.question0 = JSON.parse(response).question0;
    player2Questions.incorrect0 = JSON.parse(response).incorrect0;
    player2Questions.incorrect1 = JSON.parse(response).incorrect1;
    player2Questions.incorrect2 = JSON.parse(response).incorrect2;
    player2Questions.correct0 = JSON.parse(response).correct0;
    generateBoard();
    main();
    check();
    player1();
    player2();
  });
}

var whoseTurn;
var gameQuestions;
function main() {
  var x = document.getElementById('question-container').getElementsByClassName('options');
  var array = [];
  var i = 0;
  for (i; i < x.length; i++) {
    array.push(i);
  }

  if (flipFlop() == 'Player 1') {
    document.getElementById('currentTurn').innerText = 'Player 1\'s';
    whoseTurn = 'Player 1';
    gameQuestions = player1Questions;
  } else {
    document.getElementById('currentTurn').innerText = 'Player 2\'s';
    whoseTurn = 'Player 2';
    gameQuestions = player2Questions
  }

  g = genRandomNum(0, gameQuestions.question0.length - 1);
  shuffleArray(array);
  console.log(array);
  document.getElementById('question').innerText = gameQuestions.question0[g];
  document.getElementById('l' + array[0]).innerText = gameQuestions.incorrect0[g];
  document.getElementById(array[0]).value = gameQuestions.incorrect0[g];
  document.getElementById('l' + array[1]).innerText = gameQuestions.incorrect1[g];
  document.getElementById(array[1]).value = gameQuestions.incorrect1[g];
  document.getElementById('l' + array[2]).innerText = gameQuestions.incorrect2[g];
  document.getElementById(array[2]).value = gameQuestions.incorrect2[g];
  document.getElementById('l' + array[3]).innerText = gameQuestions.correct0[g];
  document.getElementById(array[3]).value = gameQuestions.correct0[g];
}

var p1correct = 0;
var p2correct = 0;
var p1incorrect = 0;
var p2incorrect = 0;
function check() {
  var x = document.getElementsByName('options');
  var i = 0;
  for (i; i < x.length; i++) {
    x[i].checked = false;
    x[i].addEventListener('click', function () {
      valRadio = this.value;
      console.log(valRadio);
    });
  }

  if (typeof valRadio !== 'undefined') {
    if (gameQuestions === player1Questions) {
      if (valRadio == player1Questions.correct0[g]) {
        alert('You got it correct. It was ' + valRadio);
        p1correct ++;
        num_p1 += 2;
        whoWon("Player 1", gameQuestions);
        player1();
        removeQuestion(gameQuestions.question0, g);
        removeQuestion(gameQuestions.incorrect0, g);
        removeQuestion(gameQuestions.incorrect1, g);
        removeQuestion(gameQuestions.incorrect2, g);
        removeQuestion(gameQuestions.correct0, g);
        console.log(gameQuestions.question0.length);
        document.getElementById('p1correct').innerText = p1correct;
        main();
      } else {
        p1incorrect ++;
        num_p1 -= 2;
        whoWon("Player 1", gameQuestions);
        player1();
        document.getElementById('p1incorrect').innerText = p1incorrect
        main();
      }
    } else {
      if (valRadio == player2Questions.correct0[g]) {
        alert('You got it correct. It was ' + valRadio);
        p2correct ++;
        num_p2 += 2;
        whoWon("Player 2", gameQuestions);
        player2();
        removeQuestion(gameQuestions.question0, g);
        removeQuestion(gameQuestions.incorrect0, g);
        removeQuestion(gameQuestions.incorrect1, g);
        removeQuestion(gameQuestions.incorrect2, g);
        removeQuestion(gameQuestions.correct0, g);
        console.log(gameQuestions.question0.length);
        document.getElementById('p2correct').innerText = p2correct;
        main();
      } else {
        p2incorrect ++;
        num_p2 -= 2;
        whoWon("Player 2", gameQuestions);
        player2();
        document.getElementById('p2incorrect').innerText = p2incorrect;
        main();
      }
    }
  }
}