//STORAGE SYSTEM
//Si on a deja un utilisateur qui a été enregistré, on recupere tout et on recrée l'objet.
if(localStorage.getItem('user')){
    let tempUser = JSON.parse(localStorage.getItem('user'));
    user = new User(tempUser.name, 
                    tempUser.firstname, 
                    tempUser.dateReservation, 
                    tempUser.station, 
                    tempUser.signature,
                    tempUser.timer
                   );
    user.reset = tempUser.reset;
    let reservName = document.getElementById('reservationName');
    let reservFirstName = document.getElementById('reservationFirstName');
    
    signature_validation = tempUser.signatureValidation;
    reservName.value = tempUser.name;
    reservFirstName.value = tempUser.firstname;
    userInfo();
}

const basicTimer = 20;
var timer;
let minute;
let seconde;
var startTimer = false;

if(typeof user != "undefined"){
    minute = user.timer[0];
    seconde = user.timer[1];
    
    canvasForm.setAttribute('style', 'display: block');
    reserveBtn.setAttribute('style', 'display: none');
    formPad.setAttribute('style', 'height: auto');
    
    if(user.signature != null){
        let img = new Image;
        img.src = user.signature;
        img.onload = function (){
            context.drawImage(img, 0, 0);
        };
    }
}

//Si un utilisateur existe (donc la reservation existe) et si la reservation est plus vielle que 20min, alors on reset!
if(typeof user != "undefined"){
    if(user.dateReservation != null){
        let userTS = Date.parse(user.dateReservation);
        let limitTimer = 20*60*1000; //20min
        let now = Date.now();
        if((now - userTS) > limitTimer){
            resetStorage();
            user.dateReservation = null;
            user.saveData();
        }
    }
    else{
        let message = document.getElementById('reservNone');
        let oldMessage = document.getElementById('reservOK');
        message.setAttribute('style', 'display: block');
        oldMessage.setAttribute('style', 'display: none');
    }
}


function resetStorage(){
    //On reset tout !
    sessionStorage.removeItem('signature');
    clearInterval(timer);
    
    alert('Votre réservation n\'est plus valable !');
    min = 20;
    seconde = 0;
    start = false;
}

function startInterval(){
    timer = setInterval(timerDraw, 1000);
}

function timerDraw(){
    //user.timer[0] = minute / timer[1] = seconde
    if((user.timer[0] == 0)&&(user.timer[1] == 0)){
        user.resetReservation();
    }
    
    else if((user.timer[0] >= 0)&&(user.timer[1] >= -1)){
        if (user.timer[1] ==  0){
            user.timer[1] = 59;
            user.timer[0]--;
        }
        else{
            user.timer[1]--;
        }
        userInfo(user.timer[0], user.timer[1]);
    }
    user.saveData();//On sauvegarde pour actualiser le timer dans le cache
}

function userInfo(min, scd){
    let stationName = user.station;
    //let resaName = localStorage.getItem('savedName') + ' ' + localStorage.getItem('savedFirstName');
    let resaName = user.name + ' ' + user.firstname;
    
    
    let stationUI = document.getElementById('stationName');
    let nameUI = document.getElementById('userName');
    let minuteUI = document.getElementById('minute');
    let secondeUI = document.getElementById('seconde');
    
    userUI.setAttribute('style', 'display: block');
    stationUI.textContent = stationName;
    nameUI.textContent = resaName;
    minuteUI.textContent = min;
    secondeUI.textContent = scd;
    if (!startTimer){
        startTimer = true;
        clearInterval(timer);
        startInterval();
    }
}

//USER OBJECT
function User(name, firstname, date, station, signature, remainingTime = [basicTimer, 00]){
    this.name = name;
    this.firstname = firstname;
    this.dateReservation = date;
    this.station = station;
    this.signature = signature;
    this.timer = remainingTime;
    this.signatureValidation = signature_validation;
    this.reset = false;
    
    this.saveData = function (){
        localStorage.setItem('user', JSON.stringify(user));
    }
    this.resetReservation = function(){
        this.reset = true;
        message.setAttribute('style', 'display: block');
        oldMessage.setAttribute('style', 'display: none');
        
        this.timer = [basicTimer, 00];
        this.dateReservation = null;
        sessionStorage.removeItem('signature');
        clearInterval(timer);
        alert('Votre réservation n\'est plus valable !');
        min = 20;
        seconde = 0;
        start = false;
        signature_validation = 0;
        clear_canvas();
    }
}