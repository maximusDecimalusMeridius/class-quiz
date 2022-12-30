// Tying into HTML elements
let _answerItemNodes = document.getElementsByClassName("answer-items");

let _welcomeWindow = document.getElementById("welcome-window");
let _questionWindow = document.getElementById("question-window");
let _answerWindow = document.getElementById("answer-window");
let _scoreboardWindow = document.getElementById("scoreboard-window");

let _questionNode = document.getElementById("question");
let _outcomeNode = document.getElementById("outcome");

let _timer = document.getElementById("timer");
let _userInitials = document.getElementById("initials");
let _startButton = document.getElementById("start-button");
let _submitButton = document.getElementById("sub-init-button");

let timer = 200;
let gameIndex = 0;
let numCorrect = 0;

// WHEN I click the start button
// THEN a timer starts and I am presented with a question

_startButton.addEventListener("click", () => {
    _welcomeWindow.style.display = "none";
    _questionWindow.style.display = "flex";
    nextCard(0);
    
    _timer.innerText = timer;                           // Initialize timer

    setInterval(() => {                                 // setInterval function to countdown every 1s
        timer--;
        _timer.innerText = timer;
        if(timer === 0){
            clearInterval();
            gameOver();
        }
    }, "1000")
})

// WHEN I answer a question
// THEN I am presented with another question
// function checkAnswer(selected, correct), nextQuestion()

_answerWindow.addEventListener("click", (event) => {
    if(event.target.className === "answer-items"){
        event.target.style.backgroundColor = "white";
        grader(gameIndex, event.target.value);
        gameIndex++;
        if(gameIndex < gameDeck.length){
            nextCard(gameIndex);
        } else {
            _questionWindow.style.display = "none";
            gameOver();
        }
    }
})

// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock

// WHEN all questions are answered or the timer reaches 0
// THEN the game is over

// WHEN the game is over
// THEN I can save my initials and score

function nextCard(index) {
    _questionNode.innerText = gameDeck[index].question;
    for(let i = 0; i < gameDeck[index].answerArray.length; i++){
        _answerItemNodes[i].innerText = gameDeck[index].answerArray[i];
        _answerItemNodes[i].style.backgroundColor = "";
    }
}

function grader(cardIndex, choice) {
    if(choice == gameDeck[cardIndex].correctAnswer){
        _outcomeNode.innerText = "Correctomundo!";
        numCorrect++;
    } else {
        _outcomeNode.innerText = "Wrong-o! 10 seconds subtracted from your time!";
        timer -= 10;
    }
}


function gameOver(){
    _scoreboardWindow.style.display = "flex";

}













class questionCard {
    constructor(question, answerArray, correctAnswer){
        this.question = question;
        this.answerArray = answerArray;
        this.correctAnswer = correctAnswer;
    }
}

let question0 = new questionCard(
    "1. Sample Question 0",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question1 = new questionCard(
    "2. Sample Question 1",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question2 = new questionCard(
    "3. Sample Question 2",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question3 = new questionCard(
    "4. Sample Question 3",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question4 = new questionCard(
    "5. Sample Question 4",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question5 = new questionCard(
    "6. Sample Question 5",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question6 = new questionCard(
    "7. Sample Question 6",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question7 = new questionCard(
    "8. Sample Question 7",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question8 = new questionCard(
    "9. Sample Question 8",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question9 = new questionCard(
    "10. Sample Question 9",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question10 = new questionCard(
    "11. Sample Question 10",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);


let question11 = new questionCard(
    "12. Sample Question 11",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question12 = new questionCard(
    "13. Sample Question 12",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question13 = new questionCard(
    "14. Sample Question 13",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question14 = new questionCard(
    "15. Sample Question 14",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);


let question15 = new questionCard(
    "16. Sample Question 15",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question16 = new questionCard(
    "17. Sample Question 16",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question17 = new questionCard(
    "18. Sample Question 17",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question18 = new questionCard(
    "19. Sample Question 18",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let question19 = new questionCard(
    "20. Sample Question 19",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
    ],
    0
);

let gameDeck = [question0, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12, question13, question14, question15, question16, question17, question18, question19];