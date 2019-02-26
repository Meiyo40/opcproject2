"use strict";

let slides = ['assets/diapo/diapo1.jpg',
              'assets/diapo/diapo2.jpg',
              'assets/diapo/diapo3.jpg', 
              'assets/diapo/diapo4.jpg'];
let descriptions = ["<strong>Tutoriel étape 1/3:</strong> Choisissez une des stations disponible",
                    "<strong>Tutoriel étape 2/3:</strong> Saisissez votre <strong>Nom</strong> et votre <strong>Prénom</strong>, puis cliquez sur 'Réservation'.",
                    "<strong>Tutoriel étape 3/3:</strong> Signez le formulaire, si tout est en ordre, vous verrez une fenetre confirmant la réservation apparaître, attention, la réservation n'est valable que 20 min.",
                   "<strong>Profitez maintenant de votre réservation !</strong>"];

let slider = new Slider(slides ,descriptions);
let autoTimer = slider.isMobile() ? null : setInterval(Slider.sliderControl, 5000);
let delAnimTimer;
let btnAction = false;
slider.sliderControl();

//NEW VERSION
function Slider (slides, descriptions){
    this.slides = slides;
    this.descriptions = descriptions;
    this.currentSlide = 0;
    this.slideContainer = document.getElementById('slide');
    this.carouselContainer = document.getElementById('carousel');
    this.figure = document.getElementById('slide_container');
    this.slideWindow = document.getElementById('diaporama');
    this.description = document.getElementById('description');
    this.width = this.slideWindow.offsetWidth;
    
    this.sliderControl = function (){
        
        if(this.slides != undefined){
            
            this.slideContainer.src = this.slides[this.currentSlide];
            this.figure.style.left = '0';
            this.slideContainer.classList.add('fadeIn');
            this.description.innerHTML = this.descriptions[this.currentSlide];

            clearInterval(autoTimer);
            //ADAPT CONTAINER SIZE TO FIGURE SIZE
            let height = this.figure.offsetHeight;
            this.carouselContainer.style.height = height + 30 + 'px';



            if(!this.isMobile() && !btnAction){
                delAnimTimer = setTimeout(this.animation, 1000);
            }
            else{
                initTimer();
            }
        }
    }
    
    this.animation = function (){
        clearTimeout(delAnimTimer);
        
        slider.slideContainer.classList.remove('fadeIn');
        slider.range(+1);

        
        initTimer();
    }
    
    //currentSlide must be in the range of slides.length
    this.range = function (index){
        if(index == (+1)){
            if(this.currentSlide < (this.slides.length-1)){
                this.currentSlide++;
            }
            else{
                this.currentSlide = 0;
            }
        }
        else if(index == (-1)){
            if(this.currentSlide > 0){
                this.currentSlide--;
            }
            else{
                this.currentSlide = this.slides.length-1;
            }
        }
        else{
            console.log('error slide index..');
        }
    }
    
    //If the media is too small we saw a mobile and disable the auto slide
    this.isMobile = function(){
        if(document.documentElement.clientWidth < 480){
            return true;
        }
        else{
            return false;
        }
    }
}
//endObject


function initTimer(){
    clearTimeout(delAnimTimer);
    clearInterval(autoTimer);
    btnAction = false;
    
    autoTimer = setInterval(function(){
        slider.sliderControl();
    }, 5000);
}

//GOTO the next slide
function next(){
    slider.range(+1);
    btnAction = true;
    clearInterval(autoTimer);
    clearInterval();
    slider.sliderControl();
}

//GOTO the previous slide
function less(){
    slider.range(-1);
    btnAction = true;
    clearInterval(autoTimer);
    slider.sliderControl();
}


function pause(){
    clearInterval(autoTimer);
}

