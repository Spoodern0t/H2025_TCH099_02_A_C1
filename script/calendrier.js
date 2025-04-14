$(document).ready(()=>{

    //vérifier que la connexion est valide avant de charger le calendrier.
    //TODO: remplacer par getUserCalendars. les routes vont éventuellement renvoyer 401 si le token est invalide.

    const token = localStorage.getItem("token");
    if (token == null){
        location.replace("http://localhost/H2025_TCH099_02_A_C1/formulaire/connexion.html");
    }

    //récupérer les détails de l'utilisateur

    const nom = localStorage.getItem("username");
    const courriel = localStorage.getItem("email");
    let userCalendars;
    getUserCalendars().then(reponseObj =>{
        userCalendars = reponseObj;
    });

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
    const btnPeriode   = document.querySelector("#btn-creer-periode");
    const btnEvenement = document.querySelector("#btn-creer-evenement");
    const btnAfficherLimite = document.querySelector(".btn-creer-limite");
    const btnsAnnuler   = document.querySelector("#btn-quit");
    const overlay = document.getElementById("overlay");
    const popUp = document.querySelector(".pop-up");
    const btnQuitter = document.querySelector("#btn-quitter");
    const btnAnnuler = document.querySelector("#btn-annuler");
    const logOut = document.querySelector("#log-out");
    const btnSubMenu = document.querySelector(".toggle-arrow");
    const menuBar = document.querySelector(".menu-bar");

    //initialisation

    $("#txt-nom").text(nom);
    $("#profile-icon").text(nom.charAt(0).toUpperCase());

    if (localStorage.getItem("mode-sombre") == "enabled"){
        body.classList.toggle("mode-sombre");
    }

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
            })
            
            

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
        localStorage.clear();
        location.replace("http://localhost/H2025_TCH099_02_A_C1/formulaire/connexion.html");
    });

    //bouton "non" du popup de déconnexion
    btnAnnuler.addEventListener("click", () => {
        cacherMenuQuitter();
    });


    btnPeriode.addEventListener("click", () => {
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

    btnEvenement.addEventListener("click", () => {
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


    /*
        FIXME: btnAfficherLimite n'existe pas dans page_calendrier.html
        Cette méthode cause une erreur dans son état actuel.
        À régler lorsque je sais ce qu'elle doit faire. ~AF
    */
    btnAfficherLimite.addEventListener("click", () => {
        fetch("pop-up-limite.html")
        .then(promesse => {
            if(!(promesse.ok)) {
                throw new Error("Erreur lors du chargument du pop-up limite.")
            }
            return promesse.text();
        })
        .then(promesse => {
            document.getElementById("conteneur-pop-up").innerHTML = promesse;
            const btnAnnuler = document.querySelector("#btn-quit"); 
            if (btnAnnuler) {
                btnAnnuler.addEventListener("click", () => {
                    document.querySelector("#conteneur-pop-up").innerHTML = "";
                });
            }
        
        })
        .catch(error => console.error("Erreur:", error));
    });

    
    //requêtes à l'API

    /**
     * Requête des calendriers auxquels l'utilisateur connecté à accès.
     * @returns {Array<object>} Tableau d'objets de référence vers les calendriers de l'utilisateur.
     */
    async function getUserCalendars(){
        try{
            let reponseJSON = await fetch('http://localhost/H2025_TCH099_02_A_API/index.php/usercalendars/' + token);
            let reponseObj = await reponseJSON.json();
            console.log(reponseObj)
            return reponseObj;

        } catch (err){
            console.log("erreur de récupération de calendriers: " + err);
        }
    }

});



