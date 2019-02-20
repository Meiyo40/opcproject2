//STORAGE SYSTEM
//Si on a deja un utilisateur qui a été enregistré, on recupere tout et on recrée l'objet.
const basicTimer = 20;
var timer;
let minute;
let seconde;
var startTimer = false;

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
    let reservName = document.getElementById('name');
    let reservFirstName = document.getElementById('firstname');
    
    signature_validation = tempUser.signatureValidation;
    reservName.value = tempUser.name;
    reservFirstName.value = tempUser.firstname;
    userInfo();
}



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
            user.resetReservation();
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
    
    //Cette fonction gere l'affichage du  bouton d'information et d'acces rapide en haut de page
    function userAccess(){
        let userAccess = document.getElementById('userAccess');
        let minAccess = document.getElementById('minAccess');
        let scdAccess = document.getElementById('scdAccess');
        
        
        minAccess.textContent = min;
        scdAccess.textContent = scd;
        
        
        if(user.dateReservation != null){
            if(user.timer[0] >= 10){
                userAccess.setAttribute('style', 'background-color: green; display: block');
            }
            else if((user.timer[0] < 10) && (user.timer[0] > 3)){
                userAccess.setAttribute('style', 'background-color: orange; display: block');
            }
            else{
                userAccess.setAttribute('style', 'background-color: red; display: block;');
            }
        
        }
        
    }
    //Cette fonction gère l'affichage du curseur sur la timeline
    function timeline(){
        const max = 1200;
        //On recupere les secondes du timer user
        let stamp = (user.timer[0]*60) + user.timer[1];
        let timelineCursor = document.getElementById('timeline-cursor');
        
        stamp = Math.round((stamp/1200)*100);
        let cursorPos = (99-stamp) + '%';
        timelineCursor.style.left = cursorPos;
    }
    
    if (!startTimer){
        startTimer = true;
        clearInterval(timer);
        startInterval();
    }
    
    userAccess();
    timeline();
    
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
        let userAccess = document.getElementById('userAccess');
        userAccess.setAttribute('style', 'display: none');
        
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