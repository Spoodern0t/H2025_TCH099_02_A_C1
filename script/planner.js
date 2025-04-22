
/*
let resultatJSON = {
	'id' : '2',
	'nom' : 'a',
	'description' : null,
	'auteur' : 'a',
	'element' : [ 
		{
			'id_calendrier' : 2,
			'id_element' : 16,
			'nom' : 'Réunion Sprint 2',
			'description' : '',
			'date_debut' : '2025-04-17 15:27:00.000',
			'date_fin' : '2025-04-17 16:27:00.000',
			'evenement' : {
				'id_evenement' : 4,
				'id_calendrier' : 2,
				'nom' : 'TCH099',
				'description' : 'Projet intégrateur en informatique',
				'couleur' : 'E33B3B'
			}
		},
		{
			'id_calendrier' : 2,
			'id_element' : 16,
			'nom' : 'RDV dentiste',
			'description' : '',
			'date_debut' : '2025-04-18 17:30:00.000',
			'date_fin' : '2025-04-18 18:15:00.000',
			'evenement' : null
		}
	],
	'evenement' : [
		{
			'id_evenement' : 4,
			'id_calendrier' : 2,
			'nom' : 'TCH099',
			'description' : 'Projet intégrateur en informatique',
			'couleur' : 'E33B3B'
		}
	]
};
*/

//valeurs temporaires - remplacer par de vrais appels à l'API
let reponse = '{"id" : "2","nom" : "a","description" : null,"auteur" : "a",' +
'"element" : [ {"id_calendrier" : 2,"id_element" : 16,"nom" : "Réunion Sprint 2","description" : "","date_debut" : "2025-04-17 15:27:00.000","date_fin" : "2025-04-17 16:27:00.000","evenement" : {"id_evenement" : 4,"id_calendrier" : 2,"nom" : "TCH099","description" : "Projet intégrateur en informatique","couleur" : "E33B3B"}},' +
' {"id_calendrier" : 2,"id_element" : 16,"nom" : "RDV dentiste","description" : "","date_debut" : "2025-04-18 17:30:00.000","date_fin" : "2025-04-18 18:15:00.000","evenement" : null}]' +
',"evenement" : [ {"id_evenement" : 4,"id_calendrier" : 2,"nom" : "TCH099","description" : "Projet intégrateur en informatique","couleur" : "E33B3B"} ]}';

const resultatJSON = JSON.parse(reponse);

document.addEventListener("DOMContentLoaded", () => {

    const elements = resultatJSON['element'];

    for (let index in elements){
        nouveauMessage(elements[index]);
    }

    /**
    * Ajouter un nouvel élément
    * 
    * @param {Object} element 
    */
    function nouveauMessage(element) {
        
        // Conteneur parent
        const liste = document.getElementsByClassName('liste-periode')[0];

        // Conteneur d'element
        const planifElement = document.createElement('div');
        planifElement.classList.add('contenu-periode');

        const description = document.createElement('div');
        description.classList.add('description');

        // Couleur
        let couleur = 'transparent';
        if (element['evenement'] != null) {
            couleur = '#' + element['evenement']['couleur'];
        }
        const planifElementCouleur = document.createElement('div');
        planifElementCouleur.setAttribute('id', 'categorie-image');
        planifElementCouleur.style.backgroundColor = couleur;

        // Nom
        let evenementNom = "";
        if (element['evenement'] != null) {
            evenementNom = element['evenement']['nom'] + " : ";
        }
        const elementNom = element['nom'];
        const nom = evenementNom + elementNom;
        const planifElementNom = document.createElement('div');
        planifElementNom.setAttribute('id', 'nom-periode');

        const planifElementNomSpan = document.createElement('span');
        planifElementNomSpan.innerText = nom;

        planifElementNom.append(planifElementNomSpan);

        // Dates
        let debutDate = "";
        if (element['date_debut'] != null) {
            debutDate = new Date(element['date_debut']).toLocaleDateString('fr-CA');
        }
        const finDate = new Date(element['date_fin']).toLocaleDateString('fr-CA');
        const dates = debutDate != finDate && debutDate != "" ? debutDate + " à " + finDate : finDate;
        const planifElementDates = document.createElement('div');
        planifElementDates.setAttribute('id', 'temps-limite');

        const planifElementDatesSpan = document.createElement('span');
        planifElementDatesSpan.innerText = dates;

        planifElementDates.append(planifElementDatesSpan);

        // Heures
        const heuresOptions = {
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        };
        let debutheure = "";
        if (element['date_debut'] != null) {
            debutheure = new Date(element['date_debut']).toLocaleTimeString('fr-CA', heuresOptions) + " à ";
        }
        const finheure = new Date(element['date_fin']).toLocaleTimeString('fr-CA', heuresOptions);
        const heures = debutheure + finheure;
        const planifElementHeures = document.createElement('div');
        planifElementHeures.setAttribute('id', 'temps-limite');
        planifElementHeures.classList.add('planif-element-heures');

        const planifElementHeuresSpan = document.createElement('span');
        planifElementHeuresSpan.innerText = heures;

        const planifElementHeuresIcon = document.createElement('i');
        planifElementHeuresIcon.classList.add('bx');
        planifElementHeuresIcon.classList.add('bx-time-five');

        planifElementHeures.append(planifElementHeuresIcon);
        planifElementHeures.append(planifElementHeuresSpan);


        // Construire le conteneur de texte
        description.append(planifElementNom);
        description.append(planifElementDates);
        description.append(planifElementHeures);

        // Construire l'élément dans le conteneur
        planifElement.append(planifElementCouleur);
        planifElement.append(description);

        // Afficher l'élément au premier rang
        liste.append(planifElement);
    }

});