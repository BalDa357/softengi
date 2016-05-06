/*** Created by Dart Vader on 19.04.2016.*/
var response, exercises, previousRand = -1, points = 0, attempts = 0, username, equalSplit, tabPage=0;

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

(function () {
    var xmlhttp = getXmlHttp();
    xmlhttp.open('GET', 'praxis.txt', false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200) {
        response = xmlhttp.responseText.split(/\r?\n+/, xmlhttp.lineNumber);
    }
})();

function deleteExercisesFromList(elemId, sign) {
    if (!document.getElementById(elemId).checked) {
        for (var i=0; i<exercises.length; i++) {
            if (exercises[i].indexOf(sign)> -1) {
                exercises.splice(i, 1);
                i--;
            }
        }
    }
}

function ExerciseListGenerate() {
    exercises = response.slice();

    deleteExercisesFromList("add", '+');
    deleteExercisesFromList("sub", '-');
    deleteExercisesFromList("mul", '*');
    deleteExercisesFromList("div", '/');
}
//сгенерировать рандомный пример из массива exercises
function RandomExercise() {
    var Rand = Math.floor(Math.random() * exercises.length);//рандом от 0 до длинны массива exercises
    //подбор примера не такого как был перед этим
    while (true) {
        if (Rand != previousRand)
            break;
        else
            Rand = Math.floor(Math.random() * exercises.length);
    }
    previousRand = Rand;

    var exercise = exercises[Rand];
    equalSplit = exercise.split('=', 2);//разделение уравнения на пример и решение
    //вывод на страницу
    document.getElementById("points").innerHTML = (username +'<p>' + 'Баллы: ' + points + '/' + attempts+'<\p>');
    attempts++;// количество попыток
    document.getElementById("exercise").innerHTML = ('\nРешите пример:\n' + '<H2>' + equalSplit[0] + '<\H2>');
}

//при нажатии на кнопку начало теста
function startTestBtn() {
    ExerciseListGenerate();
    if (!document.getElementById("add").checked & !document.getElementById("sub").checked &
        !document.getElementById("mul").checked & !document.getElementById("div").checked) {
        alert ("Укажите типы примеров!")
    } else
        if (document.getElementById("inpName").value == "") {
            alert("Укажите свое имя!")
        } else{
            var reg = /^[а-яА-ЯёЁa-zA-ZіІ ]+$/;
            username = document.getElementById("inpName").value;
            if (!reg.test(username) || username.length<2 || username.length>20) {
                alert("Недопустимые символы или слишком короткое/длинное имя!\n" +
                    " (длина имени должна составлять от 2х до 20ти букв)");
            } else {
                username = username.toUpperCase();
                document.getElementById("setting").setAttribute("style", "display: none");
                document.getElementById("testing").setAttribute("style", "display: block");
                Testing();
            }
        }
}

//ловит нажатие кнопки enter в окне браузера
document.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        //отслеживание в каком окне нажжата кнопка (0- в стартовом окне(установка), 1- в окне теста(проверка)
        if (tabPage==0) {startTestBtn();} else if (tabPage==1) {answerEx();}
    }
    // Отменяем действие браузера
    return false;
}

//Сгенерировать страничку с примером
function Testing(){
    tabPage=1;
    RandomExercise();
}
//обработка при нажатии ответа на пример
function answerEx(){
    var userAnswer = document.getElementById("answer").value;
    if (userAnswer!=''){
        var reg = /^[0-9]+$/;
        if (!reg.test(userAnswer)) {
            alert("Можно вводить только натуральные числа!");
            return true;
        } else
        if (equalSplit[1]==userAnswer){
            points++;
        }
    }else {
        alert ("Введите ответ в поле!");
        return true;
    }
    document.getElementById("answer").value = '';

    if (attempts == 10){
        document.getElementById("testing").setAttribute("style", "display: none");
        document.getElementById("results").setAttribute("style", "display: block");
        showResult();
        return false;
    }
    RandomExercise();
}

function testAgain(){
    tabPage = 0;
    document.getElementById("results").setAttribute("style", "display: none");
    document.getElementById("setting").setAttribute("style", "display: block");
    saveResults();
}

function showResult(){
    tabPage=3;
    document.getElementById("resultPoints").innerHTML = ('<br><br><font color="#32cd32">Количество правильных ответов: '+points+'</font>'+
        '<br><font color="red">Количество неправильных ответов: '+(attempts-points)+ '</font>');
}
function saveResults(){
    points=0;
    attempts=0;
}