import { eraseLocalStorage } from "../local_storage_manager.js";

let headerBurgerMenu;
let toggleheaderBurgerMenuBtn;
let visible = true;

export function tryInitHeader() {
    headerBurgerMenu = document.getElementById("header-mobile-burger-menu");
    toggleheaderBurgerMenuBtn = document.getElementById("header-toggle-burger-menu-mobile-btn");
    if (toggleheaderBurgerMenuBtn && headerBurgerMenu) {
        toggleheaderBurgerMenuBtn.addEventListener("click", toggleHeaderBurgerMenu);
        document.querySelectorAll(".header-erase-data-btn").forEach(headerEraseDataBtn => {
            headerEraseDataBtn.addEventListener("click", () => {
                eraseLocalStorage();
                location.reload();
            });
        });
        toggleHeaderBurgerMenu();
    }
}

function toggleHeaderBurgerMenu() {
    visible = !visible;
    visible ? headerBurgerMenu.style.display = "block" : headerBurgerMenu.style.display = "none";
}

/*
$(document).ready(function() {
    $("#toggle-navbar-burger-menu-btn").click(function() {
        $("#navbar-burger-menu").stop(true, true).slideToggle(15000)
    })
})
*/
