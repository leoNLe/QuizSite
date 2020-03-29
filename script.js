var timeDisp = document.querySelector("#timeDisp");
var display = document.querySelector("#display")
var feedback = document.querySelector("#feedback");

let testLength = 60;
let time = testLength;
let next = false;
let isTesting = false;

let score = 0;
let punishment = 10;
let award = 1;
let perfect = true;

let highScores = [];

let curQuesIdx = 0;
let questions = [
        {
            question: "When does scope chaining stops?",
            answer: "3",  //Array index
            choices: ["When you get found the reference", "When scopes chained back up to window", "When you go up to the parent's scope", "1st and 2nd answer"]
        }, 
        {
            question: "Which his the correct way to declare an array?", 
            answer: "2",
            choices: ["var array = {1, 2, 3};", "var array = {1; 2, 3}", "var array = [1,2 ,3]", "var array = [1; 2, 3]"]
        }, 
        {
            question: "Hoisting is default behavior  of javascript to move declaration to the ___.", 
            answer: "0",
            choices: ["top", "right", "bottom", "left"]
        },
        {
            question: "What a process is added to event queue when execution stack have processes on it?", 
            answer: "1",
            choices: ["remove the data from execution stack and process the event queue.", "Wait for the stack to clear.", "Send Signal to the stack to finish current slice then clear.", "Create new thread with its own thread"] 
        },
        {
            question: `What would the following code prints?  Assumes nothing else is in the file. \n
                        console.log(a) \n
                        var a = 1;`, 
            answer: "2",
            choices: ["1", "a", "undefined", "a=1"]
        },
        {
            question: "What would the following code prints?  Assumes nothing else is in the file. \n"+
                        "var a = '1';\n" +  
                        "if(a == 1) \n" +
                        "\tconsole.log('hey'); \n" +
                        "console.log(a);",
            answer: "3",
            choices: ["hey", "1", "undefined", "hey 1"]
        },
        {
            question: `What would the following code prints?  Assumes nothing else is in the file. \n
                var a = "1"; \n
                if(a == 1)\n
                   console.log("hey");\n
                console.log(a);`, 
            answer: "3",
            choices: ["hey", "1", "undefined", "hey 1"]
        },
        {
            question: `What is the incorrect way to declare a for loop?`, 
            answer: "3",
            choices: ["for(var i = 0; i < 10 ; i++)", "for(let i = 0; i < 10; i++)", "for(var i = 100; i > 10; i--)", "for(let i = 100, i < 10, i--)"]
        },
        {
            question: `What would the following code prints?  Assumes nothing else is in the file.
                        console.log(a) 
                        var a = 1;`, 
            answer: "2",
            choices: ["1", "a", "undefined", "a=1"]
        },

    
]

init();

function init() {
    introScreen();
    loadHighScores();
    timeDisp.textContent = time;
}
function loadHighScores() {
    if(localStorage.getItem("highScores") !== null)  {
        highScores = JSON.parse(localStorage.getItem("highScores"));
    }
}

function saveHighScores(){
    localStorage.setItem("highScores", JSON.stringify( highScores));    
}

function displayHighScores() {
    if(isTesting === true) {
        document.querySelector(".backTest").setAttribute("style", "visibility: visible");
    }
    display.textContent ="";
    feedback.textContent = "";
    feedback.setAttribute("style", "border-style: none");
    let list = document.createElement("ol");
    list.classList += "scoreList";
    
    for(let i = 0; i < highScores.length; i++) {
        let item = document.createElement("li");
        //Will have to added span for css to separate it into columns
        item.textContent = `${highScores[i].initial}  ${highScores[i].score}`;
        list.appendChild(item);
    }
    display.appendChild(list);
    let btn = document.createElement("button");
    btn.classList += "btn";
    btn.textContent = "To Test";
    btn.addEventListener("click", introScreen );
    display.appendChild(btn)
}

function addScore(initial) {
    //Practicing
    // let begin = 0;
    // let end = highScores.length -1;
    // let mid = Math.floor((end - begin)/ 2) + begin; 
    // let idx = end;
    // while(begin <= end) {
    //     if(highScores[mid].score === score){
    //         idx = mid+1;
    //         break;
    //     }
    //     if (highScores[mid].score >= score) {
    //         begin = mid+1;
    //         if(begin > end || highScores[begin].score < score){
    //             idx = mid+1;
    //             break;
    //         }
    //         mid = Math.floor((end - begin)/ 2)+begin;

    //     } else {
    //         end = mid - 1;
    //         if(begin < end || highScores[end].score < score){
    //             idx = mid-1;
    //             break;
    //         }
    //         mid = Math.floor((end - begin)/ 2)+ begin; 
    //     }
    // }
    if(initial === "") {
        feedback.textContent = "Initials are needed";
        return;
    }
    feedback.textContent = "";
    let idx = highScores.length;

    for( let i  =  0; i < highScores.length; i++) {
        if(highScores[i].score <= score){
            idx = i;
            break;
        }
    }
    //Add Score
    let user = {
        initial: initial,
        score: score
    }
    highScores.splice(idx, 0, user);

    //Zero out score
    score = 0;
    saveHighScores();
    feedback.textContent = "Score Added";
}

/* 
    Function call when a answer is clicked and evaluate the answer.  Update score if correct and update time if incorrect.
        also update the feedback container.
*/
function evaluateAnswer(event){
    next = true;
    let el = event.target;
    let questionIdx = el.getAttribute("questionIdx");
    feedback.setAttribute("style", "border-top: 2px inset")
    if(el.id === questions[questionIdx].answer) {
        feedback.textContent = "Correct!";
        score += award;
    } else {
        feedback.textContent = "Wrong!";
        perfect = false;
        if(time >= punishment) {
            time -= punishment;
        } else {
            time = 0;
        }
    }
}

/*
    Decide which question to show based on curQuestIdx.
*/
function showQuestion() {
    //Hide the Back To Test button and remove destroy previous items in display
    document.querySelector(".backTest").setAttribute("style", "visibility: hidden");
    display.textContent = "";
    
    let question = document.createElement("p");
    question.classList = "question"
    question.textContent = questions[curQuesIdx].question;
    question.id = curQuesIdx;
    display.appendChild(question);

    let answerDiv = document.createElement("div");
    answerDiv.classList += "answerDiv";
    answerDiv.setAttribute("class", "answerDiv");

    let choices = questions[curQuesIdx].choices; 
    for(let i = 0; i < choices.length; i++) {
        let choice = document.createElement("a");
        choice.setAttribute("class", "answerAnchor");
        choice.textContent = choices[i];
        choice.id = i;
        choice.setAttribute("questionIdx", curQuesIdx);
        choice.addEventListener("click", evaluateAnswer);
        answerDiv.appendChild(choice);
    }

    display.appendChild(answerDiv);
}

//Control when to to update the timer
function timerDisplay(){
    
    let interval = setInterval(function() {

        time--;
        timeDisp.textContent = time;

        //Do something if at the end of questions 
        if(time <= 0) {
            time = 0;
            timeDisp.textContent = time;
            clearInterval(interval);
        }
    }, 1000);

}

//Display questions on test;  Also control what happens when timer is 0;
function testDisplay(){
    showQuestion();
    let interval = setInterval( function() {
        if(next){
            next = false;
            curQuesIdx++;
            if(curQuesIdx < questions.length)
                showQuestion();
        }
        if(time <=0 || curQuesIdx === questions.length) {

            //reward fo
            if(curQuesIdx === questions.length && timer !== 0 && perfect) {
                score += 10;
            }
            time = 0;
            endScreen();
            document.querySelector(".backTest").setAttribute("style", "visibility: hidden");
            clearInterval(interval);
        }
    }, 250);
}

function startTest(){
    display.textContent = "";
    time = testLength;
    score = 0;
    curQuesIdx = 0;
    isTesting = true;
    timerDisplay();
    testDisplay();
}

//Create and append the intro screen to Display Div
function introScreen() {
    display.textContent = "";
    let intro = document.createElement("h2");
    intro.textContent = "Javascript Knowledge Test";
    display.appendChild(intro); 

    let introDescr = document.createElement("p");
    introDescr.classList += "introText";
    introDescr.textContent = `Testing your general knowledge of Javascript.  You will be given ${testLength} seconds.  If you answer the question correctly, 
                              your score will increase by ${award}.  If you got the answer wrong, ${punishment} seconds will be removed from time remaining. 
                              Are you ready to test your knowledge?`
    display.appendChild(introDescr);

    let startBtn = document.createElement("button");
    startBtn.classList +="btn"
    startBtn.textContent  = "START";
    startBtn.addEventListener("click", startTest);
    
    display.appendChild(startBtn);
}

//Create and append the end screen to Display div. 
function endScreen() {
    isTesting = false;

    let feedback = document.querySelector("#feedback");

    //Clear the feedback and display div before creating end screen;
    feedback.textContent = "";
    display.textContent = "";
    feedback.setAttribute("style", "border-style: none");

    let doneEl = document.createElement("h3");
    doneEl.textContent = "All Done. Your score is: " + score;

    display.appendChild(doneEl);

    let container = document.createElement("div");
    container.setAttribute("class", "endSubmitDiv");

    let input = document.createElement("input");
    input.classList += "input";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Initials");
    input.setAttribute("id", "initial");


    let btn = document.createElement("button");
    btn.classList +="addScore";
    btn.textContent = "Add Score";
    btn.addEventListener("click", function(){
        addScore(input.value);
    } );

    let backToBegining = document.createElement("button");
    backToBegining.classList += "btn"
    backToBegining.textContent = "Test Again";
    backToBegining.addEventListener("click", startTest);

    container.appendChild(input);
    container.appendChild(btn);
    display.appendChild(container);
    display.appendChild(backToBegining);

    
}

document.querySelector(".highScores").addEventListener("click", displayHighScores);

document.querySelector(".backTest").addEventListener("click", showQuestion);
