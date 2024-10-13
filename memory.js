window.onload = començar;

var sprites =["url(img/carta1.jpg)","url(img/carta2.jpg)","url(img/carta3.jpg)","url(img/carta4.jpg)","url(img/carta5.jpg)","url(img/carta6.jpg)",
			  "url(img/carta7.jpg)","url(img/carta8.jpg)","url(img/carta9.jpg)","url(img/carta10.jpg)","url(img/carta11.jpg)","url(img/carta12.jpg)",
			  "url(img/carta13.jpg)","url(img/carta14.jpg)","url(img/carta15.jpg)","url(img/carta16.jpg)","url(img/carta17.jpg)","url(img/carta18.jpg)",
			  "url(img/carta19.jpg)","url(img/carta20.jpg)"];

var cartesBarrejades = shuffleArray(sprites);			  

// Funció que determina l'inici del joc. Demanarà usuari i mode i invocarà addCardListener.
function començar(){
	let nomUsuari = prompt("Escriu aqui el teu nom: ");
	
	while(nomUsuari == ""){
		nomUsuari = prompt("El nom no es pot deixar buit!");
	}
	
	// D'un decimal, agafarà només la part enetera
	let dificultat = parseInt(prompt("Dificultat desitjada: \nFàcil - [1]        Normal - [2]        Difícil - [3]"));
	
	// Passarem aquest valor a la funció que verificarà si hem escrit bé els valors.
	verificar(dificultat);
}

function verificar(dificultat){	
	// Els únics valors disponibles han de ser 1, 2 o 3.
	while(isNaN(dificultat) || dificultat < 1 || dificultat > 3){
		dificultat = parseInt(prompt("Format incorrecte. Repeteix: \nFàcil - [1]        Normal - [2]        Difícil - [3]"));
	}
	
	// Si arribem aqui, la dificultat és correcta, per tant, podem repartir les cartes.
	dibuixarTauler(dificultat);
}

//	Es mostrarà una quantitat de cartes segons la dificultat seleccionada anteriorment (paràmetre 'dificultat')
function dibuixarTauler(dificultat){
	
	let tauler = document.getElementById('board');
	
	switch(dificultat){
		case 1:
			alert("Comença el mode fàcil!");
			break;
		case 2:
			alert("Comença el mode mitjà!");
			break;
		default:
		
			// Com en mode difícil no s'eliminarà cap carta, s'aplica directament l'amplada
			alert("Comença el mode difícil!");
			tauler.style.width = '126vh';
			cartesBarrejades = cartesBarrejades.concat(cartesBarrejades);
			cartesBarrejades = shuffleArray(cartesBarrejades);
			break;
	}
	
	// En fàcil, ens volem quedar amb les 12 primeres cartes, en mitjà, amb les 20 primeres.
	if(dificultat == 1){
		// Eliminemt els fills innecesaris
		eliminarFills(12);
		// Com el màxim son 12 cartes, agafem 6 de diferents
		cartesBarrejades = cartesBarrejades.slice(0,6);
		// Treballarem amb 12 cartes, osigui, 6 parelles
		cartesBarrejades = cartesBarrejades.concat(cartesBarrejades);
		// I tornem a barrejar
		cartesBarrejades = shuffleArray(cartesBarrejades);
	}
	else if(dificultat == 2){
		eliminarFills(20);
		cartesBarrejades = cartesBarrejades.slice(0,10);
		cartesBarrejades = cartesBarrejades.concat(cartesBarrejades);
		cartesBarrejades = shuffleArray(cartesBarrejades);
	}
	
	addCardListener();
}


/*
	La forma en la que el programa cambiarà la quantitat de cartes disponibles serà eliminant les
	cartes sobrants segons la dificultat.
	Si el mode és fàcil, conservarà les primeres 12 cartes, i eliminarà les restants.
	En mitjà, agafarà de la mateixa manera només les 20 primeres.
	En dicícil, no eliminarà cap carta.
*/
function eliminarFills(limit){
	
	// Es guarden les cartes en posicions d'array per poder  treballar de forma més modular.
	let arrayCartes = [];
	let tauler = document.getElementById('board');
	let amplada = null;
	
	// Segons les cartes sobre el tauler, s'aplicarà una amplada o una altra
	switch(limit){
		case 12:
			tauler.style.width = '70vh';
			tauler.style.height = '38vh';
			break;
		default:
			tauler.style.width = '84vh';
			break;
	}
	
	// Es recórre totes les cartes, i segons la dificultat, s'eliminarà una quantitat determinada
	for(let i = 0; i <= 39; i++){
		arrayCartes[i] = document.getElementById(i);
		
		if(i >= limit){
			tauler.removeChild(arrayCartes[i]);
		}
	}
}	

/**
* Funció subministrada pel professorat que agafarà cada carta i farà que escolti l'esdeveniment de ratolí.
  En aquest cas, l'event és el click del ratolí.
*/
function addCardListener()
{
	let cards;
	
	cards = document.getElementsByClassName("card");
	
	
	for (let i = 0; i < cards.length; i++)
	{
		cards[i].addEventListener("click", function() {clickCard(this.id)}, false);
		//assignarCartes(cards.length);
	}
}

// Funció per desordenar cartes.
function shuffleArray(arr)
{
	clonedArray = arr.slice();
	
	return clonedArray.sort(function() {
        return Math.random() - 0.5
    })
}

// Es guardarà la quantitat de cartes girades, per tenir-lo present per tenir només dues girades alhora
let cartesGirades = 0;

var imatgesPerLesCartes = shuffleArray(sprites);
var cartesGiradesAlhora = [];

var carta1 = null;
var carta2 = null;
var oldBackground = '';
var encerts = 0;
var errades = 0;

function clickCard(id)
{	
	// No es permetrà tenir més de dues cartes alhora. La funció es complirà només si hi ha menys de dues aixecades.
	if(cartesGirades < 2){
		cartesGirades++;
		
		// Guardem la primera carta i la girem. Fins que no es giri una altra cartan aquesta no tornarà al seu estat original.
		if(cartesGirades == 1){
			carta1 = document.getElementById(id);
			oldBackground = document.getElementById(id).style.background;
			document.getElementById(id).style.backgroundImage = consultarCarta(id);
			
		}
		else if(cartesGirades == 2){
			carta2 = document.getElementById(id);
			document.getElementById(id).style.backgroundImage = consultarCarta(id);
			
			// Si les dues cartes son iguals, ho considerem un encert, posem el seus fons girats i tornem a considerar que hi ha 0 cartes girades.
			if(carta1.style.backgroundImage === carta2.style.backgroundImage){
				
				encerts++;
				let tauler = document.getElementById('board');
				//setTimeout(function() {carta1.remove(), carta2.remove(),verificarFinal(); cartesGirades = 0;}, 500);
				setTimeout(function() {girarCartes(carta1, carta2); cartesGirades = 0;}, 500);
				cartesGirades = 0;
			}else{
				setTimeout(function() {carta1.style.background = oldBackground, carta2.style.background = oldBackground; cartesGirades = 0;}, 500);
				errades++;
			}
		}
	}
	else{
		// En cas de tenir dues cartes girades, impedim que una tercera carta es giri
		let carta = document.getElementById(id);
		
		carta.removeEventListener("click", clickCard);
	}

}

function consultarCarta(id){
	let carta = document.getElementById(id);
	
	return cartesBarrejades[id];
}

function verificarFinal(){
	let cartesRestants = document.getElementsByClassName('card');

	if(cartesRestants.length == 0){
		let resposta = prompt('Enhorabona, has completat el memory amb ' + encerts +' encers i amb ' + errades + ' errades!\nJuguem un altre cop?\nSI - Prem "S" a l\'input\nNO - Prem qualsevol tecla a l\'input');
		
		if(resposta == "S" || resposta == 's' || resposta == 'si' || resposta == 'SI'){
			location.reload();
		}
	}
}

var parellesTrobades = 0;
var parellesTotals = document.getElementByClassName('card').length / 2;

function girarCartes(carta1, carta2){
	carta1.removeEventListener("click", clickCard);
    carta2.removeEventListener("click", clickCard);
    carta1.style.pointerEvents = "none";
    carta2.style.pointerEvents = "none";
    carta1.style.visibility = "hidden";
    carta2.style.visibility = "hidden";
	carta1.classList.remove("card");
	carta2.classList.remove("card");
	carta1.classList.add("card-girada");
	carta2.classList.add("card-girada");
	parellesTrobades++;
	
	verificarFinal();
}
