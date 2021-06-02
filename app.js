const divResultat = document.querySelector('#resultat');
const rejouerBtn = document.getElementById('rejouer');
const text = document.querySelector('h2');
let timer = 41;
let countdownInterval;

var tabJeu = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];

// var tabResultat = [
//     [1,4,3,4],
//     [1,2,3,2],
//     [7,8,6,5],
//     [8,7,5,6]
// ];
var tabResultat = genereTableauAleatoire(); // génère un tableau aléatoire dans le tableau résultat, ce qui permet d'avoir des positions de cartes uniques à chaque fois

var oldSelection=[]; // permet de ne retourner les cartes qu'après la deuxième sélection si différentes
var nbAffiche = 0; 
var ready = true;
var score = 0;

afficherTableau();

function afficherTableau(){
    var txt = '';

    for(var i=0; i < tabJeu.length ; i++){
        txt += "<div>";
        for(var j=0; j < tabJeu[i].length ; j++){
            if(tabJeu[i][j] === 0){
            txt += "<button class='btn btn-dark m-2' onclick='verif(\""+i+"-"+j+"\");startTimer();'>メモリー</button>";
            } else {
                txt += "<img src='"+getImage(tabJeu[i][j])+"' class='m-2'>"
            }
        }
    }

    divResultat.innerHTML = txt;
}

function getImage(valeur){ // associe une valeur à une image
    var imgTxt = "./src/img/";
    switch(valeur){
        case 1 : imgTxt += "death.png";
        break;
        case 2 : imgTxt += "life.png";
        break;
        case 3 : imgTxt += "love.png";
        break;
        case 4 : imgTxt += "hate.png";
        break;
        case 5 : imgTxt += "honor.png";
        break;
        case 6 : imgTxt += "shame.png";
        break;
        case 7 : imgTxt += "war.png";
        break;
        case 8 : imgTxt += "peace.png";
        break;
        default : console.log("cas non pris en compte")
    }
    return imgTxt;
}

function verif(bouton){
    if(ready){
        nbAffiche++;

        var ligne = bouton.substr(0,1); // substr = substring
        var colonne = bouton.substr(2,1);
        // console.log(ligne);
        // console.log(colonne);
        tabJeu[ligne][colonne] = tabResultat[ligne][colonne];
        afficherTableau();

        if(nbAffiche>1){
            ready = false;
            setTimeout(() => { // permet de laisser afficher les deux cartes pendant 1s si différentes
                // verification
                if(tabJeu[ligne][colonne] !== tabResultat[oldSelection[0]][oldSelection[1]]){
                    tabJeu[ligne][colonne] = 0;
                    tabJeu[oldSelection[0]][oldSelection[1]] = 0; //permet de réinitialiser les cartes si différentes
                }
                else{
                    score++;
                    if(score==8){
                        rejouerBtn.style.display = "block";
                        clearInterval(countdownInterval);
                    }
                    rejouerBtn.addEventListener('click', () => {
                        document.location.reload(true); // permet de refresh la page
                    })
                    }
                afficherTableau();
                ready = true;
                nbAffiche = 0;
                oldSelection = [ligne, colonne];
            },500) // 1000 = 1 seconde
        } else {
            oldSelection = [ligne, colonne];
        }
    }
}

function genereTableauAleatoire(){
    var tab = [];
    var nbImagePosition=[0,0,0,0,0,0,0,0];

    for(var i = 0 ; i < 4 ; i++){
        var ligne = [];
        for(var j = 0 ; j < 4 ; j++){
            var fin = false;
            while(!fin){
                var randomImage = Math.floor(Math.random() * 8);
                if(nbImagePosition[randomImage] < 2){ // pour éviter d'avoir plus de 2 images
                    ligne.push(randomImage+1); // on rajoute +1 car position+1 (position = 0 à 7)
                    nbImagePosition[randomImage]++;
                    fin = true;
                }
            } 
        }
        tab.push(ligne); // rajoute une ligne au tableau
    }
    return tab;
}

// TIMER

function startTimer(){
    if(timer == 41){
        timer--;
        function countdown(){
            if(timer<0){
                rejouerBtn.style.display = "block";
                ready = false;
            }
            else if(timer<10){
                text.innerText = `00:0${timer}s;`;
                timer--;
            }
            else{
                text.innerText = `00:${timer}s;`;
                timer--;
            }
            rejouerBtn.addEventListener('click', () => {
                document.location.reload(true); // permet de refresh la page
            })
        }
        
        countdownInterval = setInterval(() => { //setInterval permet de créer un interval à l'aide d'une valeur en ms (1000 = 1s)
        
            countdown()
        
        }, 1000);
    }
}

// EXPLOSION

const containerSlot = document.querySelector('.slot');
const btnConfettis = document.querySelector('.btn-confettis');
const emojis = ['♚', '♛', '♜', '♝', '♞', '♟'];

btnConfettis.addEventListener('click', fiesta);

function fiesta(){

    if(isTweening()) return; // si fiesta est déjà entrain de s'animer, ne peut se relancer une deuxième fois

    for(let i = 0; i < 50; i++){
        const confetti = document.createElement('div'); // createElement -> crée un élément "div"
        confetti.innerText = emojis[Math.floor(Math.random() *emojis.length)]; // randomize un emoji
        containerSlot.appendChild(confetti); // rajouter l'emoji randomizé au container 'Slot'
    }
    
    animateConfettis();
}

// Possible de tout mettre dans une seule fonction mais les séparer augmente la visibilité
function animateConfettis(){

    const TLCONF = gsap.timeline()

    TLCONF // TLCONF = Timeline Confettis = Script Cloudflare
    .to('.slot div',{
        y: "random(-100,100)",
        x: "random(-100,100)", 
        z: "random(0,1000)", //perspective
        rotation: "random(-90,90)",
        duration: 1
    })
    .to('.slot div', {autoAlpha: 0, duration: 0.3}, // autoAlpha = opacity + visibility
    '-=0.2') // Fait disparaître les émojis, mais ne les efface pas du DOM
    .add(() => {
        containerSlot.innerHTML = ""; // On rappelle le contenu du container en HTML et on laisse vide pour effacer le contenu du DOM
    });
}

function isTweening(){
    return gsap.isTweening('.slot div'); // demande au code s'il est entrain de s'animer, qui retourne "true" ou "false" en fonction de si oui, ou non.
}