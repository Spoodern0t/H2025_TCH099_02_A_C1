$(document).ready(() => {

    const inputNom = $("#fld-nom");
    const inputCourriel = $("#fld-courriel");
    const inputMotPasse = $("#fld-mdp1");
    const inputMotPasseConfirmation = $("#fld-mdp2");

    //bouton "créer votre compte"
    $(".btn-submit").click(()=>{
        const nom = inputNom.val();
        console.log(nom);
        const courriel = inputCourriel.val();
        console.log(courriel);
        const mdp1 = inputMotPasse.val();
        console.log(inputMotPasse);
        const mdp2 = inputMotPasseConfirmation.val();
        console.log(inputMotPasseConfirmation);
        const regexCourriel = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        //Vérifier que les mots de passe sont identiques
        if (mdp1 === mdp2){

            //Vérifier que toutes les infos sont non-nulles
            if (nom.trim() == 0 || courriel.trim() == 0 || mdp1.trim() == 0){
                $("#info").text("Veuillez remplir tous les champs.");
                $("#info").css("color", "red");
                return;

            }
            
            //si le courriel a une structure valide, inscrire un compte
            if (regexCourriel.test(courriel)) {
                inscrireUtilisateur(courriel, nom, mdp1);
            } else {
                $("#info").text("Veuillez saisir une adresse courriel valide.");
                $("#info").css("color", "red");
            }

        } else {
            $("#info").text("Veuillez saisir le même mot de passe dans les deux champs.");
            $("#info").css("color", "red");
        }

    });

    //bouton "recommencer"
    $(".btn-reset").click(()=>{

        //réinitialiser le texte
        $("#info").text("Remplissez les champs ci-dessous pour vous inscrire.");
        $("#info").css("color", "#000000");

    });

    //créer un nouvel utilisateur dans la base de données
    async function inscrireUtilisateur(courriel, nom, motPasse){
        let reponse = await fetch('http://localhost/H2025_TCH099_02_A_API/index.php/inscription', {
            method: 'POST',
            body: JSON.stringify({
                email: courriel,
                username: nom,
                password: motPasse
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (reponse.status != 200){
            //TODO: afficher vrai message d'erreur si un compte ou une adresse courriel existe déjà
            console.log("Erreur! Code: " + reponse.status);
            $("#info").css("color", "#000000");
        }
        console.log("Inscription - succès" + reponse.status);


        /*
                1. Utilisateurs
        ________________________________________

        POST /inscription

        Description : Enregistre un nouvel utilisateur.

        Entrée (JSON) :
        {
        "email": "johndoe@gmail.com",
        "username": "JohnDoe",
        "password": "password123"
        }

        Retour : Code HTTP 200 OK
    */
    }
});