const divResultat = document.querySelector('#resultat');
const rejouerBtn = document.getElementById('rejouer');


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

afficherTableau();

function afficherTableau(){
    var txt = '';

    for(var i=0; i < tabJeu.length ; i++){
        txt += "<div>";
        for(var j=0; j < tabJeu[i].length ; j++){
            if(tabJeu[i][j] === 0){
            txt += "<button class='btn btn-primary m-2' onClick='verif(\""+i+"-"+j+"\")'>Afficher</button>";
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
        case 1 : imgTxt += "elephant.png";
        break;
        case 2 : imgTxt += "giraffe.png";
        break;
        case 3 : imgTxt += "hippo.png";
        break;
        case 4 : imgTxt += "monkey.png";
        break;
        case 5 : imgTxt += "panda.png";
        break;
        case 6 : imgTxt += "parrot.png";
        break;
        case 7 : imgTxt += "penguin.png";
        break;
        case 8 : imgTxt += "pig.png";
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
                afficherTableau();
                ready = true;
                nbAffiche = 0;
                oldSelection = [ligne, colonne];
            },1000) // 1000 = 1 seconde
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