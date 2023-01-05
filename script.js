// TODO: Style the table on the last page
// TODO: Don't let player finish game if they don't answer all questions

// Tying into HTML elements
let _answerItemNodes = document.getElementsByClassName("answer-items");
let _hallOfFame = document.getElementById("hall-of-fame");
let _initCol = document.getElementById("init");
let _scoreCol = document.getElementById("score");

let _welcomeWindow = document.getElementById("welcome-window");
let _questionWindow = document.getElementById("question-window");
let _answerWindow = document.getElementById("answer-window");
let _scoreboardWindow = document.getElementById("scoreboard-window");

let _questionNode = document.getElementById("question");
let _outcomeNode = document.getElementById("outcome");
let _goodbyeMessageNode = document.getElementById("goodbye-p");

let _timer = document.getElementById("timer");
let _userInitials = document.getElementById("initials");
let _viewScoresButton = document.getElementById("view-scores");
let _startButton = document.getElementById("start-button");
let _submitButton = document.getElementById("sub-init-button");
let _playAgainButton = document.getElementById("play-again-button");

let timer = 200;
let gameIndex = 0;
let numCorrect = 0;
let highScores = [];
let gameDeck;                   //Declaring gameDeck which is populated with quiz questions at bottom of code

class questionCard {
    constructor(question, answerArray, correctAnswer){
        this.question = question;
        this.answerArray = answerArray;
        this.correctAnswer = correctAnswer;
    }
}

// WHEN I click the start button
// THEN a timer starts and I am presented with a question

_startButton.addEventListener("click", () => {
    startGame();
})

_playAgainButton.addEventListener("click", () => {
    _hallOfFame.style.display = "none";
    startGame();
})

_submitButton.addEventListener("click", () => {
    tallyScore(_userInitials.value, timer);
    showHighScores();
})

_viewScoresButton.addEventListener("click", () => {
    timer = 0;
    _timer.textContent = 0;
    showHighScores();
})

_answerWindow.addEventListener("click", (event) => {
    if(event.target.className === "answer-items"){
        grader(gameIndex, event.target.dataset.val);
        gameIndex++;
        if(gameIndex < gameDeck.length){
            nextCard(gameIndex);
        } else {
            _questionWindow.style.display = "none";
            gameOver();
        }
    }
})

function init(){
    timer = 200;
    gameIndex = 0;
    numCorrect = 0;
    if(localStorage.getItem("highScores") === null){
        localStorage.setItem("highScores", "");
    }
}

// Starts game, initializing counters and indexes
function startGame(){
    init();
    _welcomeWindow.style.display = "none";                          // Disappears welcome window
    _questionWindow.style.display = "flex";                         // Shows the question window
    nextCard(0);                                                    // Pulls first card with index 0
    
    _timer.innerText = timer;                                       // Set timer to initialized value

   let countDown = setInterval(() => {                              // setInterval function to countdown every 1s
        if(gameIndex === gameDeck.length){           // WHEN all questions are answered or the timer reaches 0
            clearInterval(countDown);                               // THEN the game is over
            gameOver();                                             
        } else if(timer === 0){
            clearInterval(countDown);
        } else{
            timer-=.01;
            _timer.innerText = timer.toFixed(2);
        }
    }, "10");
}

// Draw the next card based on the deck index and populate the question and answer fields with values
function nextCard(index) {
    _questionNode.innerText = gameDeck[index].question;
    for(let i = 0; i < gameDeck[index].answerArray.length; i++){
        _answerItemNodes[i].textContent = gameDeck[index].answerArray[i];
        _answerItemNodes[i].style.backgroundColor = "";
    }
}

// Evaluate the question, user choice, and correct answer
// Tally correct answers
// Subtract 10 seconds from timer for each incorrect question
function grader(cardIndex, choice) {
    if(choice == gameDeck[cardIndex].correctAnswer){
        _outcomeNode.innerText = "Correct!";
        numCorrect++;
    } else {
        _outcomeNode.innerText = "Incorrect! 10 seconds subtracted from your time.";
        if(timer - 10 < 0){
            timer = 0;
            _timer.textContent = timer.toFixed(2);
        }else {
            timer -= 10;
            _timer.textContent = timer.toFixed(2);
        }
    }
}

// Show scoreboard window and goodbye message (new div appears in CSS with data-attribute)
// WHEN the game is over
// THEN I can save my initials and score
function gameOver(){
    _scoreboardWindow.style.display = "flex";
    _goodbyeMessageNode.innerText = `Thanks for playing! You got ${numCorrect} correct out of ${gameDeck.length}.\nYour time was ${timer.toFixed(2)}.\nPlease enter your initials below`;
}

// Add new TRs to the high score table
// Only add a new high score if values are passed, not if user clicks "View High Scores"
// Parse fixed string to float to compare to other high scores
function tallyScore(inits, time){
    let fixedTime = parseFloat(time.toFixed(2));

    if(highScores.length == 0 || fixedTime < highScores[highScores.length - 1][1]) {
        highScores.push([inits, fixedTime]);
    } else if(fixedTime > highScores[0][1]){
        highScores.splice(0, 0, [inits, fixedTime]);
    } else {
        for(let i = 1; i < highScores.length; i++){
            if(fixedTime > highScores[i][1]){
                highScores.splice(i, 0, [inits, fixedTime]);
                break;
            }
        }
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function showHighScores() {    
    _welcomeWindow.style.display = "none";
    _questionWindow.style.display = "none";
    _scoreboardWindow.style.display = "none";
    _hallOfFame.style.display = "flex";

    _initCol.innerHTML = "<span class='hof-header'>Initials</span>";
    _scoreCol.innerHTML = "<span class='hof-header'>Score</span>";

    
    if(localStorage.getItem("highScores") == ""){
        alert("Be the first to play!");
    } else {
        highScores = JSON.parse(localStorage.getItem("highScores"));
        
        for(let i = 0; i < highScores.length; i++){
            let newInitEl = document.createElement("TR");
            let newInitData = document.createTextNode(`${highScores[i][0]}`);
            let newScoreEl = document.createElement("TR");
            let newScoreData = document.createTextNode(`${highScores[i][1]}`);

            newInitEl.appendChild(newInitData);
            newScoreEl.appendChild(newScoreData);

            _initCol.appendChild(newInitEl);
            _scoreCol.appendChild(newScoreEl);
        }
    }
}

if(localStorage.getItem("highScores") === null){
    localStorage.setItem("highScores", highScores);
}










let question0 = new questionCard(
    "1. Sample Question 1",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question1 = new questionCard(
    "2. Sample Question 2",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question2 = new questionCard(
    "3. Sample Question 3",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question3 = new questionCard(
    "4. Sample Question 4",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question4 = new questionCard(
    "5. Sample Question 5",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question5 = new questionCard(
    "6. Sample Question 6",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question6 = new questionCard(
    "7. Sample Question 7",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question7 = new questionCard(
    "8. Sample Question 8",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question8 = new questionCard(
    "9. Sample Question 9",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question9 = new questionCard(
    "10. Sample Question 10",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question10 = new questionCard(
    "11. Sample Question 11",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);


let question11 = new questionCard(
    "12. Sample Question 12",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question12 = new questionCard(
    "13. Sample Question 13",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question13 = new questionCard(
    "14. Sample Question 14",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question14 = new questionCard(
    "15. Sample Question 15",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);


let question15 = new questionCard(
    "16. Sample Question 16",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question16 = new questionCard(
    "17. Sample Question 17",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question17 = new questionCard(
    "18. Sample Question 18",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question18 = new questionCard(
    "19. Sample Question 19",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question19 = new questionCard(
    "20. Sample Question 20",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

gameDeck = [question0, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12, question13, question14, question15, question16, question17, question18, question19];