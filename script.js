// Tying into HTML elements

// Main windows that switch between display: none and display: flex
let _welcomeWindow = document.getElementById("welcome-window");                     //Landing div, displayed on load, hidden for else
let _questionWindow = document.getElementById("question-window");                   //The div displayed during game's execution that houses the quiz question, answers, and outcome message
let _answerWindow = document.getElementById("answer-window");                       //The main window housing answer boxes (_answerItemNodes[0-3])
let _scoreboardWindow = document.getElementById("scoreboard-window");               //Main scoreboard windows

let _questionNode = document.getElementById("question");                            //quizQuestion.question is displayed here
let _outcomeNode = document.getElementById("outcome");                              //Positioned under the answer window.  Correct if true, Incorrect if false
let _goodbyeMessageNode = document.getElementById("goodbye-p");                     //Goodbye <p> for final game message and stats display

let _timer = document.getElementById("timer");                                      //timer in the upper right-hand corner
let _userInitials = document.getElementById("initials");                            //textarea for the user to input their initials
let _viewScoresButton = document.getElementById("view-scores");                     //view high scores button in upper left hand corner
let _startButton = document.getElementById("start-button");                         //Initial "click to play" button on _welcomeWindow
let _submitButton = document.getElementById("sub-init-button");                     //button users will press when submitting their initials on _scoreboardWindow
let _playAgainButton = document.getElementById("play-again-button");                //button displayed on _hallofFame to play again

let _answerItemNodes = document.getElementsByClassName("answer-items");             //answer boxes 0-3
let _hallOfFame = document.getElementById("hall-of-fame");                          //high score window
let _initCol = document.getElementById("init");                                     //initials column on the scoreboard
let _scoreCol = document.getElementById("score");                                   //score column on the scoreboard

let timer = 200;                                    //Initialize timer to 200 seconds
let gameDeck;                                       //Declaring gameDeck which is populated with quiz questions at bottom of code
let gameIndex = 0;                                  //controls main index of gameDeck
let numCorrect = 0;                                 //counts how many correct answers the user gets - only impacts final score display and answer for quizQuestions[7]
let highScores = [];                                //initialize highScores array which 2D array which will populate initials and scores

class questionCard {
    constructor(question, answerArray, correctAnswer){
        this.question = question;
        this.answerArray = answerArray;
        this.correctAnswer = correctAnswer;
    }
}

if(localStorage.getItem("highScores") === null){
    localStorage.setItem("highScores", "");
}

//EVENT_LISTENERS

//clicking the start button starts the game
_startButton.addEventListener("click", () => {
    startGame();
})

//clicking play again hides the _hallOfFame window and starts the game
_playAgainButton.addEventListener("click", () => {
    _hallOfFame.style.display = "none";
    startGame();
})

//clicking submit button will call tallyScore, passing the initials the user entered and the timer value then calling showHighScores
_submitButton.addEventListener("click", () => {
    tallyScore(_userInitials.value, timer);
    showHighScores();
})

//clicking view high scores in the top left resets the timer (to end game), setting the display to 0 and showing high scores
_viewScoresButton.addEventListener("click", () => {
    timer = 0;
    _timer.textContent = 0;
    showHighScores();
})

//Initialize the game reseetting the timer, gameIndex, number of correct questions
//Check localStorage to ensure local variable wasn't erased mid-game, setting it to an empty string if it's null
function init(){
    timer = 200;
    gameIndex = 0;
    numCorrect = 0;
    _outcomeNode.textContent = "";
    if(localStorage.getItem("highScores") == null){
        localStorage.setItem("highScores", "");
        highScores = [];
    }
    if(localStorage.getItem("highScores") != ""){
        highScores = JSON.parse(localStorage.getItem("highScores"));
    } 
}

//clicking an element with the answer-items class calls grader to compare answer vs selection, then increments gameIndex
//if gameIndex isn't at the end of the gameDeck, pull the next card, otherwise hide the game window and end the game
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

// Starts game, calling init to reset and displaying the main question window
// Set the timer on the game to 200, start interval of 10ms to countdown
//      Interval: if the gameIndex reaches the length of gameDeck, clear and run gameover
//                else if the timer is zeroed out from somewhere else, clear interval - that game ender will handle end game
//                else decrement timer by .01 seconds, set the timer to a fixed float with 2 decimal places
function startGame(){
    init();
    _welcomeWindow.style.display = "none";                          // Disappears welcome window
    _questionWindow.style.display = "flex";                         // Shows the question window
    nextCard(0);                                                    // Pulls first card with index 0
    
    _timer.innerText = timer;                                       // Set timer to initialized value

   let countDown = setInterval(() => {                              // setInterval function to countdown every 1s
        if((timer < .01) || gameIndex === gameDeck.length){           // WHEN all questions are answered or the timer reaches 0
            clearInterval(countDown);                               // THEN the game is over
            if(_scoreboardWindow.style.display != "none"){
                gameOver();
            }                                             
        } else{
            timer-=.01;
            _timer.innerText = timer.toFixed(2);
        }
    }, "10");
}

// Draw the next card based on the deck index and populate the question and answer fields with values
function nextCard(index) {
    _questionNode.innerText = gameDeck[index].question;                                         //Set question window to quizQuestion.question at index
    for(let i = 0; i < gameDeck[index].answerArray.length; i++){                                //For each of the answer nodes, set the corresponding answer from quizQuestion.answerArray
        _answerItemNodes[i].textContent = gameDeck[index].answerArray[i];
        _answerItemNodes[i].style.backgroundColor = "";                                         //reset selected background color (need to deprecate)
        console.log(i);
    }

    //Easter Eggs
    //for question 7, calculate and display the number of correct questions user has gotten so far in answer index 2.  Answer is index 2.
    if(index == 6){
        _answerItemNodes[2].textContent = `${numCorrect}`;
    }

    //for question 8, user cannot select the x in answerNodes.  If event.target.className is answer-items and has an "X" in it, pick a random other box
    //that isn't that box and set the value to "X";  The answer is a span created around the "X!" with a custom data-val of 4, corresponding answer index
    //set in quizQuestion.correctAnswer.  When clicked will call grader, index the counter, and call nextCard as an answer-item box would.
    if(index == 7){
        _questionNode.innerHTML = "8. Click the <span id=x data-val=4>X!</span>";
        document.getElementById("x").addEventListener("click", (event) => {
            grader(gameIndex, event.target.dataset.val);
            gameIndex++;
            nextCard(gameIndex);
        })
        document.getElementById("answer-window").addEventListener("mouseover", (event) => {
            if(event.target.className === "answer-items" && event.target.innerText == "X"){
                let lastIndex = event.target.dataset.val;
                let rando = Math.floor(Math.random() * _answerItemNodes.length);
                event.target.innerText = "";
                while(rando == lastIndex){
                    rando = Math.floor(Math.random() * _answerItemNodes.length);
                }
                _answerItemNodes[rando].innerText = "X";
            }
        })
    }

    //for question 11, start a new interval that updates answers 2 and 4 in real-time with time left and time elapsed, relatively
    //If the gameIndex increases to 11 or the timer goes to 0, clear interval
    if(index == 10){
        let newInterval = setInterval(() => {
            if(gameIndex == 11 || timer == 0){
                clearInterval(newInterval);
            } else {
                _answerItemNodes[1].innerText = timer.toFixed(2);
                _answerItemNodes[3].innerText = (200 - parseFloat(timer.toFixed(2))).toFixed(2);
            }
        }, "10")
    }

    if(index == 14){
        let rando = Math.floor(Math.random() * _answerItemNodes.length);
        for(let i = 0; i < _answerItemNodes.length; i++){
            if(i == rando){
                _answerItemNodes[i].textContent = "Correct Answer";
                gameDeck[gameIndex].correctAnswer = i;
            } else {
                _answerItemNodes[i].textContent = "An Answer";
            }
        _answerWindow.style.color = "var(--purple)";
        }
    }
    if(index == 15){
        _answerWindow.style.color = "white";
    }
}

// Evaluate the question, user choice, and correct answer
// Tally correct answers
// Subtract 10 seconds from timer for each incorrect question
function grader(cardIndex, choice) {
    if(choice == gameDeck[cardIndex].correctAnswer || gameDeck[cardIndex].correctAnswer == "any"){
        _outcomeNode.innerText = "Correct!";
        numCorrect++;
    } else {
        _outcomeNode.innerText = "Incorrect! 10 seconds subtracted from your time.";
        if(timer - 10 < 0){
            timer = 0;
            _timer.textContent = timer.toFixed(2);
            gameOver();
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
    _questionWindow.style.display = "none";
    _scoreboardWindow.style.display = "flex";
    _goodbyeMessageNode.innerText = `Thanks for playing! You got ${numCorrect} correct out of ${gameDeck.length}.\nYour time was ${timer.toFixed(2)}.\nPlease enter your initials below`;
}

// Add new TRs to the high score table
// Only add a new high score if values are passed, not if user clicks "View High Scores"
// Parse fixed string to float to compare to other high scores
function tallyScore(inits, time){
    let fixedTime = parseFloat(time.toFixed(2));
    let initials = (inits != "" ? inits : "N/A");

    if(highScores.length == 0 || fixedTime < highScores[highScores.length - 1][1]) {
        highScores.push([initials, fixedTime]);
    } else if(fixedTime > highScores[0][1]){
        highScores.splice(0, 0, [initials, fixedTime]);
    } else {
        for(let i = 1; i < highScores.length; i++){
            if(fixedTime > highScores[i][1]){
                highScores.splice(i, 0, [initials, fixedTime]);
                break;
            }
        }
    }

    localStorage.setItem("highScores", JSON.stringify(highScores)); // bug
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










let question0 = new questionCard(
    "1. The answer to this question is 2*2/2+2",
    [
        "1",
        "2",
        "3",
        "4",
    ],
    3
);

let question1 = new questionCard(
    "2. How many 2s were in the last equation?",
    [
        "1",
        "2",
        "3",
        "4",
    ],
    3
);

let question2 = new questionCard(
    "3. The question before the next one is: ",
    [
        "1",
        "2",
        "3",
        "4",
    ],
    2
);

let question3 = new questionCard(
    "4. This is question",
    [
        "For",
        "four",
        "for()",
        "Fore!",
    ],
    1
);

let question4 = new questionCard(
    "5. The hex value for the color of the high score button is",
    [
        "#F55F76",
        "#F7F2F7",
        "#696466",
        "#d3vt00l5",
    ],
    0
);

let question5 = new questionCard(
    "6. This quiz is (no opinions, please!)",
    [
        "Silly!",
        "Amazing!",
        "Bonkers!",
        "Rubbish!",
    ],
    2
);

let question6 = new questionCard(
    "7. Up until now, how many questions have you gotten correct?",
    [
        "A",
        "8",
        "fill with numCorrect",
        "All of the above",
    ],
    2
);

let question7 = new questionCard(
    "8. Click the X!",
    [
        "X",
        "",
        "",
        "",
    ],
    4
);

let question8 = new questionCard(
    "9. The answer to this question == !!!false",
    [
        "False!",
        "!true",
        "0",
        "1",
    ],
    3
);

let question9 = new questionCard(
    "10. How much of the quiz do you have left to complete?",
    [
        "45%",
        "50%",
        "55%",
        "60%",
    ],
    2
);

let question10 = new questionCard(
    "11. Precisely how much time do you have left?",
    [
        "TONS of time",
        "",
        "Doesn't Matter!",
        "",
    ],
    1
);


let question11 = new questionCard(
    "12. What was the last thing the welcome message said?",
    [
        "Good luck!",
        "Buckle up!",
        "It's gonna get bumpy!",
        "Let's go!!!",
    ],
    0
);

let question12 = new questionCard(
    "13. How many times was the word quiz used on the welcome slide?",
    [
        "3",
        "4",
        "5",
        "6",
    ],
    2
);

let question13 = new questionCard(
    "14. The timer started out with _ minutes.",
    [
        "3",
        "3.20",
        "3.33",
        "3.40",
    ],
    2
);

let question14 = new questionCard(
    "15. Lots of answers, only one is correct",
    [
        "",
        "",
        "",
        "",
    ],
    0
);

let question15 = new questionCard(
    "16. The question is the answer",
    [
        "Which question?",
        "Enough of this",
        "Why I oughta...",
        "...",
    ],
    0
);

let question16 = new questionCard(
    "17. If you're happy and you know it...",
    [
        "Clap your hands",
        "Flap your wangs",
        "Flash your fangs",
        "It's this one",
    ],
    3
);

let question17 = new questionCard(
    "18. A common myth suggests you should pick this choice for multiple choice questions you don't know the answer to:",
    [
        "A",
        "B",
        "C",
        "D",
    ],
    2
);

let question18 = new questionCard(
    "19. Guess!",
    [
        "A",
        "B",
        "C",
        "D",
    ],
    2
);

let question19 = new questionCard(
    '20. Last one is a gimme, click any answer!',
    [
        "This one",
        "Or this one",
        "Literally any",
        "This one?",
    ],
    "any"
);

gameDeck = [question0, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12, question13, question14, question15, question16, question17, question18, question19];