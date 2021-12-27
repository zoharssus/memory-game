document.addEventListener('DOMContentLoaded', () => {
    const [
        EASY_HEIGHT,
        EASY_WIDTH,
        MEDIUM_HEIGHT,
        MEDIUM_WIDTH,
        HARD_HEIGHT,
        HARD_WIDTH] = [3,4,4,4,5,5];
    const boardMeasurements = {
        easy: {
            height: EASY_HEIGHT,
            width: EASY_WIDTH
        },
        medium: {
            height: MEDIUM_HEIGHT,
            width: MEDIUM_WIDTH
        },
        hard: {
            height: HARD_HEIGHT,
            width: HARD_WIDTH
        }
    }

    let photos;

    let isPaused = false;
    let correctGuesses = 0;
    let wrongGuesses = 0;

    let cardsSelected = [];
    let cardsSelectedIds = [];
    let cardsFaceUp = [];

    const grid = document.querySelector('.grid');
    const modal = document.getElementById('modal');
    const span = document.getElementsByClassName('close')[0];
    let wrong = document.getElementById('wrong');

    let minutesLabel, secondsLabel, totalSeconds;

    span.onclick = function() {
        modal.style.display = 'none';
    }
    document.querySelectorAll('.new-game')
    .forEach(button => {
        button.addEventListener('click', gameInit);
    })
    
    function resetGameValues() {
        modal.style.display = 'none';
        wrongGuesses = 0;
        totalSeconds = 0;
        secondsLabel.innerHTML = '00';
        minutesLabel.innerHTML = '00';
        wrong.innerHTML = `Wrong Guesses: ${wrongGuesses}`;
        grid.innerHTML = '';
    }

    function gameInit(level = 'easy') {
        resetGameValues();
        const {height, width} = boardMeasurements[level] || boardMeasurements['easy'];
        const numOfPhotos = height * width / 2;
        photos = new Array(height * width);
        for (let i = 0; i < photos.length; i++) {
            photos[i] = {
                id: i,
                img: `/img/${i + 1 > numOfPhotos ? i + 1 - numOfPhotos : i + 1}.jpg`
            }
        }
        buildLayout(photos);
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
    
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    
        return array;
    }

    function buildLayout(photos) {
        photos = shuffle(photos);
        photos.forEach((photo, i) => {
            const card = document.createElement('img');
            card.setAttribute('src', 'img/back-face.jpg'); 
            card.setAttribute('card-id', i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function guessRight() {
        correctGuesses++;
        if (correctGuesses === photos.length / 2) {
            modal.style.display = 'block';
        }
    }

    function guessWrong() {
        wrongGuesses++;
        document.getElementById('wrong').innerHTML = `Wrong Guesses: ${wrongGuesses}`;
    }

    function checkMatch() {
        let cards = document.querySelectorAll('img');
        const firstId = cardsSelectedIds[0];
        const secondId = cardsSelectedIds[1];
        if (photos[firstId].img === photos[secondId].img) {
            cardsFaceUp = [...cardsFaceUp, ...cardsSelectedIds];
            guessRight();
        } else {
            cards[firstId].setAttribute('src', 'img/back-face.jpg');
            cards[secondId].setAttribute('src', 'img/back-face.jpg');
            guessWrong();
        };
        cardsSelected = [];
        cardsSelectedIds = [];
        isPaused = false;
    }

    function flipCard() {
        if (isPaused) return;
        const cardId = this.getAttribute('card-id');
        if ([...cardsSelectedIds, ...cardsFaceUp].includes(cardId)) return;
        cardsSelected.push(photos[cardId].img);
        cardsSelectedIds.push(cardId);
        this.setAttribute('src', photos[cardId].img);
        if (cardsSelected.length === 2) {
            isPaused = true;
            setTimeout(checkMatch, 1000);
        }
    }

    function timer() {
        minutesLabel = document.getElementById("minutes");
        secondsLabel = document.getElementById("seconds");
        totalSeconds = 0;
        setInterval(setTime, 1000);
    }
                                                     
    function setTime() {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        let valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else return valString;
    }

    timer();
    gameInit();
    
});