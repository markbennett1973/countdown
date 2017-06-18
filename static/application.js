var vowels = ['A', 'E', 'I', 'O', 'U'];
var consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
var smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var largeNumbers = [25, 50, 75, 100];

var letters = [];
var numbers = [];

var bestWord = '';
var targetNumber = 0;

$(document).ready(function() {
    $("#choose-vowel").click(chooseVowel);
    $("#choose-consonant").click(chooseConsonant);
    $("#choose-small-number").click(chooseSmallNumber);
    $("#choose-large-number").click(chooseLargeNumber);
    
    $("#check-word-form").submit(function(e) {
        e.preventDefault();
        var $form = $(this);
        $("input[name=letters]").val(letters.join());
        var url = $form.attr("action") + '?' + $form.serialize();
        
        $.get(url, function(data) {
            $("#check-word").html(data + " The best word I could find was " + bestWord);
            $("#play-again").show();
        });
    });
});


function chooseVowel()
{
    addLetter(getRandomElement(vowels));
}

function chooseConsonant()
{
    addLetter(getRandomElement(consonants));
}

function chooseSmallNumber()
{
    addNumber(getRandomElement(smallNumbers));
}

function chooseLargeNumber()
{
    addNumber(getRandomElement(largeNumbers));
}

function getRandomElement(list)
{
    return list[Math.floor(Math.random() * list.length)];
}

function addLetter(letter)
{
    lettersCount = letters.push(letter);
    $('.tile:eq(' + (lettersCount - 1) + ')').html(letter);
    if (lettersCount == 9) {
        startLettersGame();
    }
}

function startLettersGame()
{
    showClock(finishLettersGame);
    $.get('/letters/solve?letters=' + letters.join(), function(data) {
        bestWord = data;
    });
}

function finishLettersGame()
{
    $("#check-word").show();
    $("input[name=word").focus();
}

function addNumber(number)
{
    numbersCount = numbers.push(number);
    $('.tile:eq(' + (numbersCount - 1) + ')').html(number);
    if (numbersCount == 6) {
        startNumbersGame();
    }
}

function startNumbersGame()
{
    targetNumber = Math.floor(Math.random() * 900) + 100;
    console.log(targetNumber);
    $("#target .tile").html(targetNumber);
    $("#target").show();
    
    showClock(finishNumbersGame);
    $.get('/numbers/solve?numbers=' + numbers.join() + '&target=' + targetNumber, function(data) {
        console.log(data);
    });
}

function finishNumbersGame()
{
    alert("finish numbers game");
}

function showClock(finishCallback)
{
    $("#buttons").hide();
    
    var $clock = $('#clock');
    var time = 3;
    
    var x = setInterval(function() {
        $clock.html(time);
        time--;

        if (time < 0) {
            clearInterval(x);
            $("#clock").hide();
            finishCallback();
        }
    }, 1000);
}
