var vowels = ['A', 'E', 'I', 'O', 'U'];
var consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
var smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var largeNumbers = [25, 50, 75, 100];

var letters = [];
var numbers = [];

var solution = '';
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
            $("#check-word").html(data + " The best word I could find was " + solution);
            $("#play-again").show();
        });
    });

    drawClock(0);
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
        solution = data;
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
        solution = data;
    });
}

function finishNumbersGame()
{
    if (solution == "") {
        message = "There is no solution to this game.";
    }
    else {
        message = "How did you do? There is a solution to this game:<br/>" + solution;
    }

    $("#solution").html(message);
    $("#play-again").show();
}

function showClock(finishCallback)
{
    $("#buttons").hide();
    document.getElementById("audio").play();

    var $clock = $('#clock');
    var time = 0;
    
    var x = setInterval(function() {
        time++;
        drawClock(time);

        if (time == 30) {
            clearInterval(x);
            $("#clock").hide();
            finishCallback();
        }
    }, 980);
}

function drawClock(seconds)
{
    var canvas = document.getElementById("clock-canvas");
    var ctx = canvas.getContext("2d");
    var posx=canvas.width/2;
    var posy=canvas.height/2;

    // Start with a full size circle
    ctx.arc(posx, posy, posy, toRadians(0), toRadians(360));
    ctx.fillStyle="#999999";
    ctx.fill();


    var angle = seconds * 180/30;
    ctx.beginPath();
    ctx.moveTo(posx,posy)
    ctx.arc(posx, posy, posy, toRadians(0), toRadians(angle));
    ctx.lineTo(posx, posy);
    ctx.fillStyle="#cccccc";

    ctx.fill();

    // draw the border
    ctxBorder = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(posx, posy, posy-2, toRadians(0), toRadians(360));
    ctx.strokeStyle="#000099";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(0, posy);
    ctx.lineTo(canvas.width, posy);
    ctx.stroke();

    ctx.moveTo(posx, 0);
    ctx.lineTo(posx, canvas.height);
    ctx.stroke();
}

// Convert degrees to radians, offset by 90 degrees to make zero the top of the arc
function toRadians(deg) {
    deg = deg - 90;
    return (deg * Math.PI / 180);
}