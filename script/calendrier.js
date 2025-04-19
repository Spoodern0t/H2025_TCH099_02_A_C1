$(document).ready(()=>{

    //récupérer les détails de l'utilisateur (ou le rediriger s'il n'est pas correctement connecté)
    if (localStorage['token'] === null){
        redemanderConnexion();
    }

    let userCalendars;
    getUserCalendars().then(reponseObj =>{
        userCalendars = reponseObj;
    });

    const nom = localStorage.getItem("username");
    const courriel = localStorage.getItem("email");

    //autres variables et constantes

    const jourPresent = new Date();
    const dimancheDernier = new Date(jourPresent); //dimanche de la semaine présente
    dimancheDernier.setDate(jourPresent.getDate() - jourPresent.getDay());

    const debutSemaine = new Date(dimancheDernier); //dimanche de la semaine affichée sur le calendrier
    
    //éléments graphiques
    
    const body = document.querySelector("body");
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".sidebar .toggle"); 
    const modeSwitch = document.querySelector(".switch");
    const contenu = document.querySelector(".contenu-calendrier-periode"); 
    const sidebarDropdowns = document.querySelectorAll(".dropdown-btn");
    const accountDropdown = document.querySelector(".dropdown-button");
    const menuDropdown = document.querySelector(".dropdown-menu");
    const boxRecherche = document.querySelector(".recherche-box");
    const btnAfficherPeriode   = document.querySelector(".btn-creer-periode");
    const btnAfficherEvenement = document.querySelector(".btn-creer-evenement");
    const btnAfficherLimite = document.querySelector(".btn-creer-limite");
    const btnAfficherCalendrier = document.querySelector(".btn-creer-calendrier");
    const btnsAnnuler   = document.querySelector("#btn-quit");
    const overlay = document.getElementById("overlay");
    const popUp = document.querySelector(".pop-up");
    const btnQuitter = document.querySelector("#btn-quitter");
    const btnAnnuler = document.querySelector("#btn-annuler");
    const logOut = document.querySelector("#log-out");
    const btnSubMenu = document.querySelector(".toggle-arrow");
    const menuBar = document.querySelector(".menu-bar");
    const txtInfoSemaine = document.querySelector("#info-semaine");
    const btnAvancerCalendrier = document.querySelector("#btn-avancer-semaine");
    const btnReculerCalendrier = document.querySelector("#btn-reculer-semaine");
    const btnAujourdhui = document.querySelector("#btn-aujourdhui");

    //initier les éléments graphiques

    $("#txt-nom").text(nom);
    $("#profile-icon").text(nom.charAt(0).toUpperCase());

    if (localStorage.getItem("mode-sombre") == "enabled"){
        body.classList.toggle("mode-sombre");
    }

    const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const conteneur = document.querySelector(".calendrier");

    for (let h = 0; h < 24; h++) {
        const heure = h.toString().padStart(2, '0') + ":00";

        const heureCell = document.createElement("div");
        heureCell.classList.add("cell", "heure-cell");
        const label = document.createElement("div");
        label.classList.add("heure-label");
        label.textContent = heure;
        heureCell.appendChild(label);
        conteneur.appendChild(heureCell);

        jours.forEach(jour => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.day = jour;
            cell.dataset.hour = heure;
            conteneur.appendChild(cell);
        });
    }

    changerSemaine(debutSemaine.getDate());

    //fonctions graphiques

    function afficherMenuQuitter() {
        popUp.style.display = "flex";
        overlay.style.display = "block";
    }

    function cacherMenuQuitter() {
        overlay.style.display = "none";
        popUp.style.display = "none";

    }
    function afficherOverlay() {
        overlay.style.display = "block";
    }

    function cacherOverlay() {
        overlay.style.display = "none";
    }
    
    function toggleSubMenu(button) {
        const btnSousMenu = button.nextElementSibling;
        const arrow = button.querySelector('.toggle-arrow');

        if (!sidebar.classList.contains('reduit')) {
            btnSousMenu.classList.toggle('show');
            arrow.classList.toggle('rotate');
        } else {
            btnSousMenu.classList.remove('show');
        }
    }

    // écouteurs d'évènement

    sidebarDropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function(){
            toggleSubMenu(this);
        });
    });

    accountDropdown.addEventListener("click", () => {
        menuDropdown.classList.toggle("active");
    });

    // Gestion du mode sombre
    modeSwitch.addEventListener("click", () => {
        body.classList.toggle("mode-sombre");

        //sauvegarder le mode pour le restant de la connexion
        if ($(body).hasClass("mode-sombre")){
            localStorage.setItem("mode-sombre", "enabled");
        } else {
            localStorage.removeItem("mode-sombre");
        }

    });

    // Gestion du toggle de la sidebar
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle('reduit');

        // Mise à jour dynamique de la largeur du contenu
        if (sidebar.classList.contains('reduit')) {
            contenu.style.left = "5em";
            contenu.style.width = "calc(100% - 5em)";
            toggle.style.transform = "translateY(-50%) rotate(0deg)";
            boxRecherche.style.cursor ="pointer";
            boxRecherche.style.width="100%";
            menuBar.style.overflow="hidden";

            Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
                ul.classList.remove('show');

                const toggleButton = ul.previousElementSibling.querySelector('.toggle-arrow');
                if (toggleButton) {
                    toggleButton.classList.remove('rotate');
                }
            });

        } else {
            contenu.style.left = "16.5em";
            contenu.style.width = "calc(100% - 16.5em)";
            toggle.style.transform = "translateY(-50%) rotate(180deg)";
            boxRecherche.style.cursor ="default"; 
            menuBar.style.overflow="scroll";
        }
    });


    // Gestion de la recherche 
    boxRecherche.addEventListener("click", () => {
        if (sidebar.classList.contains('reduit')) {
            sidebar.classList.remove('reduit');
            contenu.style.left = "16.5em";
            contenu.style.width = "calc(100% - 16.5em)";
            barreNav.style.left = "16.5em";
            barreNav.style.width = "calc(100% - 16.5em)";
            toggle.style.transform = "translateY(-50%) rotate(180deg)";
            boxRecherche.style.cursor = "default";
        }
    });

    //bouton "se déconnecter"
    logOut.addEventListener("click", () => {
        afficherMenuQuitter();
    });

    //bouton "oui" du popup de déconnexion
    btnQuitter.addEventListener("click", () => {
        deleteConnexion();
    });

    //bouton "non" du popup de déconnexion
    btnAnnuler.addEventListener("click", () => {
        cacherMenuQuitter();
    });


    btnAfficherPeriode.addEventListener("click", () => {
        fetch("pop-up-periode.html")
        .then(promesse => {
            if (!(promesse.ok)) { //Reponse.ok est du statut 200 à 299
                throw new Error("Erreur lors du chargement du pop-up période."); //Si response.ok est false (statut 404-500)
            }
            return promesse.text();
        })
        .then(promesse => {
            afficherOverlay();
            document.getElementById("conteneur-pop-up").innerHTML = promesse;

            const btnAnnuler = document.querySelector("#btn-quit"); 
            if (btnAnnuler) {
                btnAnnuler.addEventListener("click", () => {
                    document.querySelector("#conteneur-pop-up").innerHTML = "";
                    cacherOverlay();
                });
            }
        })
        .catch(error => console.error("Erreur:", error));
    });

    btnAfficherEvenement.addEventListener("click", () => {
        fetch("pop-up-evenement.html")
        .then(promesse => {
            if (!(promesse.ok)) { //Reponse.ok est du statut 200 à 299
                throw new Error("Erreur lors du chargement du pop-up événement."); //Si response.ok est false (statut 404-500)
            }
            return promesse.text();
        })
        .then(promesse => {
            afficherOverlay();
            document.getElementById("conteneur-pop-up").innerHTML = promesse;

            const btnAnnuler = document.querySelector("#btn-quit"); 
            if (btnAnnuler) {
                btnAnnuler.addEventListener("click", () => {
                    document.querySelector("#conteneur-pop-up").innerHTML = "";
                    cacherOverlay();
                });
            }
        })
        .catch(error => console.error("Erreur:", error));
    });

    // btnAfficherLimite ne semble pas exister dans le html
    /*
    btnAfficherLimite.addEventListener("click", () => {
        fetch("pop-up-limite.html")
        .then(promesse => {
            if(!(promesse.ok)) {
                throw new Error("Erreur lors du chargement du pop-up limite.")
            }
            return promesse.text();
        })
        .then(promesse => {
            afficherOverlay();
            document.getElementById("conteneur-pop-up").innerHTML = promesse;
            const btnAnnuler = document.querySelector("#btn-quit"); 
            if (btnAnnuler) {
                btnAnnuler.addEventListener("click", () => {
                    document.querySelector("#conteneur-pop-up").innerHTML = "";
                    cacherOverlay();
                });
            }
        })
        .catch(error => console.error("Erreur:", error));
    });
    */

    // btnAfficherCalendrier ne semble pas exister dans le html
    /*
    btnAfficherCalendrier.addEventListener("click", () => {
        fetch("pop-up-calendrier.html")
        .then(promesse => {
            if(!(promesse.ok)) {
                throw new Error("Erreur lors du chargement du pop-up limite.")
            }
            return promesse.text();
        })
        .then(promesse => {
            afficherOverlay();
            document.getElementById("conteneur-pop-up").innerHTML = promesse;
            const btnAnnuler = document.querySelector("#btn-quit"); 
            if (btnAnnuler) {
                btnAnnuler.addEventListener("click", () => {
                    document.querySelector("#conteneur-pop-up").innerHTML = "";
                    cacherOverlay();
                });
            }
          })
          .catch(error => console.error("Erreur:", error));
    });
    */

    //gestion du changement de page de calendrier
    $(btnAvancerCalendrier).click(()=>{
        changerSemaine(debutSemaine.getDate() +7);
    });

    $(btnReculerCalendrier).click(()=>{
        changerSemaine(debutSemaine.getDate() -7);
    });

    $(btnAujourdhui).click(()=>{
        if (debutSemaine.getTime() != dimancheDernier.getTime()){
            debutSemaine.setTime(dimancheDernier.getTime());
            changerSemaine(dimancheDernier.getDate());
        }
    });

    //Code JavaScript pour la logique du calendrier

    function redemanderConnexion(){
        localStorage.clear();
        location.replace("http://localhost/H2025_TCH099_02_A_C1/formulaire/connexion.html");
    }

    //TODO: Changer les paramètres heureDebut et duree pour prendre un DateTime de début et un DateTime de fin.
    function ajouterPeriode(jour, heureDebut, duree, titre) {
        const [heure, minutes] = heureDebut.split(":").map(Number);
        const cellule = document.querySelector(`.cell[data-day="${jour.toLowerCase()}"][data-hour="${heure.toString().padStart(2, '0')}:00"]`);
        if (cellule) {
            const periodeDiv = document.createElement("div");
            periodeDiv.classList.add("periode", "element");
            periodeDiv.textContent = titre +'\n' +heureDebut;
            periodeDiv.style.whiteSpace = 'pre-wrap';

            const hauteur = 60 * duree; //1px par minute
            periodeDiv.style.position = 'absolute';
            periodeDiv.style.top = `${minutes}px`;
            periodeDiv.style.height = `${hauteur}px`;
            periodeDiv.style.zIndex = "1";

            cellule.appendChild(periodeDiv);
        }
    }

    function ajouterDateLimite(jour, heureFin, titre){

    }

    ajouterPeriode("mardi", "01:00", 5, "Cours de sport");
    ajouterPeriode("lundi", "15:00", 2, "test 1");
    ajouterPeriode("mardi", "04:00", 5, "test 2");
    ajouterPeriode("dimanche", "01:00", 1, "test");
    ajouterPeriode("mercredi", "07:00", 8, "shit");
    ajouterPeriode("vendredi", "01:17", 1, "eenie");
    ajouterPeriode("vendredi", "02:45", 1, "meenie");
    ajouterPeriode("vendredi", "03:56", 3, "miney");
    ajouterPeriode("vendredi", "08:23", 2, "mort");

    function viderCalendrier(){
        document.querySelectorAll('.element').forEach(el => el.remove());
    }

    function changerSemaine(dateDimanche){

        //déclarer le début et la fin de la semaine à afficher
        debutSemaine.setDate(dateDimanche);
        const finSemaine = new Date(debutSemaine);
        finSemaine.setDate(debutSemaine.getDate() + 6);;

        //mettre à jour le texte au sommet du calendrier
        const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

        let txtSemaine = "Semaine du " +debutSemaine.getDate() +" ";
        if (debutSemaine.getDate() > finSemaine.getDate()){
            txtSemaine += mois[debutSemaine.getMonth()] +" ";
            if (debutSemaine.getFullYear() < finSemaine.getFullYear()){
                txtSemaine += debutSemaine.getFullYear() +" ";
            }
        }
        txtSemaine += "au " +finSemaine.getDate() +" " +mois[finSemaine.getMonth()] +" " +finSemaine.getFullYear();
        
        $(txtInfoSemaine).text(txtSemaine);

        //enlever les éléments affichés
        viderCalendrier();

        //afficher les bons éléments pour la semaine
    }


    //requêtes à l'API

    /**
     * Requête des calendriers auxquels l'utilisateur connecté a accès.
     * @returns {Array<object>} Tableau d'objets de référence vers les calendriers de l'utilisateur.
     */
    async function getUserCalendars(){
        try{
            let reponse = await fetch('http://localhost/H2025_TCH099_02_A_API/index.php/usercalendars/' + localStorage.getItem("token"));

            if (reponse.status == 401){
                // 401 = connexion (token) expirée ou absente de la BD. Effacer la mémoire locale de l'utilisateur.
                redemanderConnexion();

            } else {
                let reponseObj = await reponse.json();
                return reponseObj;
            }
            

        } catch (err){
            console.log("erreur de récupération de calendriers: " + err);
        }
    }

    /**
     * Requête de déconnexion manuelle de l'utilisateur. Retire formellement la connexion de la BD avant de quitter.
     */
    async function deleteConnexion(){
        try{
            let reponse = await fetch('http://localhost/H2025_TCH099_02_A_API/index.php/deconnexion', {
                method: 'DELETE',
                body: JSON.stringify({
                    "token": localStorage.getItem("token")
                }),
                headers: {'Content-Type': 'application/json'}
            });

            if (reponse.status == 200){
                // 200 = connexion supprimée de la BD. Effacer du côté utilisateur.
                redemanderConnexion();
            }

        } catch (err){
            console.log("erreur de déconnexion: " +err);
        }
    }

});
