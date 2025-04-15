$(document).ready(() =>{
    //éléments graphiques
    const inputCourriel = $("#fld-courriel");
    const inputMotPasse = $("#fld-mdp");

    //bouton se connecter
    $(".btn-connexion").click(async ()=>{
        const courriel = inputCourriel.val();
        const mdp = inputMotPasse.val();

        //Vérifier que toutes les infos sont non-nulles
        if (courriel.trim() == 0 || mdp.trim() == 0){

            $("#info").text("Veuillez remplir tous les champs.");
            $("#info").css("color", "red");
            return;

        } else {

            const connexion = await getConnexion(courriel, mdp);

            if (connexion['token'] === false){   

                //requête réussie mais le compte est introuvable
                $("#info").text("Le courriel ou le mot de passe saisi est invalide.");
                $("#info").css("color", "#000000");

            } else if (connexion['email'] == courriel){

                //requête réussie, stocker les attributs constants de la connexion localement
                localStorage.setItem('username', connexion['username']);
                localStorage.setItem('email', connexion['email']);
                localStorage.setItem('token', connexion['token']);

                //rediriger vers la page des calendriers
                location.replace("http://localhost/H2025_TCH099_02_A_C1/page_accueil/page_calendrier.html");
            }

        }

    });

    //bouton s'inscrire
    $(".btn-inscription").click(()=>{

    });


    //chercher un compte dans la base de données
    async function getConnexion(courriel, motPasse){
        try{
            let reponse = await fetch('http://localhost/H2025_TCH099_02_A_API/index.php/connexion', {
                method: 'POST',
                body: JSON.stringify({
                    "email": courriel,
                    "password": motPasse
                }),
                headers: {'Content-Type': 'application/json'}
            });

            let reponseJSON = await reponse.json();

            return reponseJSON;
            
        } catch (err){
            console.log(err);
        }
    }

});