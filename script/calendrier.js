const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");
const toggle = body.querySelector(".sidebar .toggle"); 
const modeSwitch = body.querySelector(".switch");
const contenu = document.querySelector(".contenu-calendrier-periode"); 
const barreNav = document.querySelector("#barre-nav");
const btn_dropdown = document.querySelector(".dropdown-button");
const menuDropdown = document.querySelector(".dropdown-menu");
const boxRecherche = document.querySelector(".recherche-box");

btn_dropdown.addEventListener("click", () => {
    menuDropdown.classList.toggle("active");
});

// Gestion du mode sombre
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("mode-sombre");
});

// Gestion du toggle de la sidebar
toggle.addEventListener("click", () => {
    sidebar.classList.toggle('reduit');

    // Mise à jour dynamique de la largeur du contenu
    if (sidebar.classList.contains('reduit')) {
        contenu.style.left = "5em";
        contenu.style.width = "calc(100% - 5em)";
        barreNav.style.left = "5em";
        barreNav.style.width = "calc(100% - 5em)";
        toggle.style.transform = "translateY(-50%) rotate(0deg)";
        boxRecherche.style.cursor ="pointer";
        boxRecherche.style.width="100%";

        
        

    } else {
        contenu.style.left = "16.5em";
        contenu.style.width = "calc(100% - 16.5em)";
        barreNav.style.left = "16.5em";
        barreNav.style.width = "calc(100% - 16.5em)";
        toggle.style.transform = "translateY(-50%) rotate(180deg)";
        boxRecherche.style.cursor ="default";
     
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
