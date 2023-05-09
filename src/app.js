const minNumber = document.querySelector(".min-number"),
      maxNumber = document.querySelector(".max-number");

const gameContainer  = document.getElementById("game-container"),
      getInput = document.querySelector('#guess-number'),
      getBtn = document.querySelector("#btn");

const messageOne = document.querySelector(".message-one"),
      messageTwo = document.querySelector(".message-two");

const voiceContainer = document.getElementById('voice-container'),
      microBtn = document.getElementById('mic-btn');


let min = 10,
    max = 100,
    gameLeft = 3,
    winningNum = 30;


minNumber.innerHTML = min;
maxNumber.innerHTML = max;

function randomNum(min,max){
    let getRdm = Math.floor(Math.random() * (max - min) + 1);
    return getRdm;
}

// console.log(winningNum);


// For Chrome Browser Support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let getRec = new window.SpeechRecognition;

microBtn.addEventListener('click',function(){
    // console.log('hey');
    // console.log(getRec);

    // Start Recognintion, start() come from Recognition API
    getRec.start();
    getRec.addEventListener('result',(e)=>talking(e));
});

function talking(ele){
    // console.log(ele);
    const micResult = ele.results[0][0].transcript;
    // console.log(micResult);

    micMessage(micResult);
    getNumber(micResult);

    // Stop Recognintion, stop() come from Recognition API
    // getRec.stop();
}

function micMessage(msg){
    voiceContainer.innerHTML = `
        <span>Did you say!!!</span> ${msg}
    `;
}

function getNumber(msg){
    const getNum = +msg;
    // console.log(typeof getNum);
    if(Number.isNaN(getNum)){
        voiceContainer.innerHTML += `<div>This is not valid number.</div>`;
        // return;
        return false;
    }
    getInput.value = getNum;

    // Stop Recognintion, stop() come from Recognition API
    getRec.stop();
}

function setMessageOne(msg,color){
    messageOne.textContent = msg;
    messageOne.style.color = color;
}

function setMessageTwo(msg,color){
    messageTwo.textContent = msg;
    messageTwo.style.color = color;
}

function gameOver(won,msg){
    let color;

    won === true ? color = 'green' : color = 'red';

    getInput.disabled = true;
    getInput.style.borderColor = color;
    setMessageOne(msg,color);
    getBtn.value = 'Play Again';
    getBtn.classList.add('play-again');
}

getBtn.addEventListener('click',function(){
    let guess = +getInput.value;
    // console.log(guess);

    if(guess < min || guess > max || isNaN(guess)){
        setMessageTwo(`Please enter a number between ${min} to ${max}`,'red');
    }

    if(guess === winningNum){
        // Game Over WON
        gameOver(true,`${winningNum} is correct!!!, You Won`);
    }else{
        gameLeft--;

        if(gameLeft === 0){
            // Game Over LOSE
            gameOver(false,`Game Over, You Lost, The correct number is ${winningNum}`);
        }else{
            // Continue Game
            getInput.style.borderColor = 'red';
            getInput.value = '';
            setMessageOne(`${guess} is not correct, ${gameLeft} guess left`,'blue');

            if(guess > winningNum){
                voiceContainer.innerHTML += `<div>You should go down a bit</div>`;
            }else if(guess < winningNum){
                voiceContainer.innerHTML += `<div>You should go up a bit</div>`;
            }
        }
    }
});


gameContainer.addEventListener('mousedown',function(e){
    console.log(e.target);

    if(e.target.classList.contains('play-again')){
        window.location.reload();
    }
});