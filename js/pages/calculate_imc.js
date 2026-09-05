import { updateLocalStorage, BASE_JSON_FILE_IMC_CALCULATED_ENTRY } from "../local_storage_manager.js";

const FORM_FIELD_INVALID_CLASS = "form-field-invalid";
const IMC_STEPS_FOR_COMMENT = {
    "Famine": [-999999999.0, 16.5],
    "Maigreur": [16.5, 18.4],
    "Corpulence normale": [18.5, 24.9],
    "Surpoids": [25.0, 29.9],
    "Obésité modérée": [30.0, 34.9],
    "Obésité sévère": [35.0, 39.9],
    "Obésité morbide": [40.0, 999999999.0]
};
const IMC_STEPS_FOR_ADVICE = {
    "Famine": "Ton corps manque de ressources essentielles. Un suivi médical d'urgence est nécessaire pour restaurer ta santé en toute sécurité. Consultes sans attendre, et ne tentes pas de prendre du poids seul sans encadrement adapté.",
    "Maigreur": "Un petit bilan de santé t'aidera à écarter d'éventuelles carences. Enrichis tes repas au quotidien avec de bons lipides (oléagineux, huiles végétales, féculents) et privilégie le renforcement musculaire doux pour te bâtir une vitalité durable.",
    "Corpulence normale": "Ton équilibre est au top ! Continue de nourrir ton corps avec des aliments simples et variés, conserve une activité physique qui te fait plaisir et préserve ton sommeil pour garder ton corps en bonne santé.",
    "Surpoids": "Une régularité est de mise ici. Pas besoin de régimes drastiques, réduis doucement les produits ultra-transformés et réintègre plus de mouvement dans ton quotidien. L'objectif clé est de stabiliser ton poids tout en regagnant du tonus.",
    "Obésité modérée": "Prends le temps de faire un bilan avec un professionnel de santé pour fixer des objectifs réalistes. Maintiens une activité douce et portée (marche, vélo, natation) pour préserver tes articulations tout en stimulant ton métabolisme.",
    "Obésité sévère": "Un accompagnement global (médecin, diététicien, coach adapté) fera toute la différence. Privilégie des exercices sur mesure et écoute ton rythme pour progresser en toute sécurité.",
    "Obésité morbide": "Des solutions médicales et pluridisciplinaires adaptées existent pour t'accompagner vers un mieux-être. Rapproche-toi d'une équipe spécialisée ou d'un centre dédié pour construire un parcours de soin bienveillant et sur mesure."
};

let menus = document.getElementById("menus");
let form = document.getElementById("calculate-imc-form");
let formFields = document.querySelectorAll("input[required], textarea[required]");
let calculateImcFormBtn = document.getElementById("calculate-imc-form-btn");
let calculateImcFormHeightInput = document.getElementById("calculate-imc-form-height-input");
let calculateImcFormWeightInput = document.getElementById("calculate-imc-form-weight-input");
let goToIndexBtn = document.getElementById("go-to-index-btn");
let imcCalculatedMenu = document.getElementById("imc-calculated-menu");
console.log(formFields);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formValid = true;
    let errors = [];

    formFields.forEach(formField => {
        resetFormField(formField);
        if (!validateFormField(formField)) {
            formValid = false;
            errors.push(formField);
        }
    });

    if (formValid) { calculateAndSaveIMC(event); }
});

formFields.forEach(formField => {
    formField.addEventListener("input", event => {
        formFieldChanged(event.target);
    });
});

function formFieldChanged(formField) {
    resetFormField(formField);
    validateFormField(formField);
}

function validateFormField(formField) {
    let isValid = formField.checkValidity();
    if (!isValid) {
        formField.classList.add(FORM_FIELD_INVALID_CLASS);
        formField.previousElementSibling.insertAdjacentHTML(
            "beforeend",
            `<p style="color: red; margin: 0px; margin-top: 5px;" title="An error has been made while filling the form: ${formField.validationMessage}">${formField.validationMessage}</p>`
        )
    }

    return isValid
}

function resetFormField(formField) {
    let formFieldLabel = formField.previousElementSibling;
    formField.classList.remove(FORM_FIELD_INVALID_CLASS);
    while (formFieldLabel.firstElementChild) { formFieldLabel.removeChild(formFieldLabel.firstElementChild); }
}

function disableForm(value = true) {
    calculateImcFormBtn.disabled = value;
    formFields.forEach(field => {
        field.disabled = value;
    });
}

function getComment(imc) {
    let comment = "";
    Object.keys(IMC_STEPS_FOR_COMMENT).forEach(key => {
        let stepValues = IMC_STEPS_FOR_COMMENT[key];
        console.log(stepValues);
        if (imc >= stepValues[0] && imc <= stepValues[1]) { comment = String(key); }
    });

    return comment
}

async function calculateAndSaveIMC() {
    // Disable the form, and stop displaying the button to leave this page (important to not disturb thr saving and calculation process)
    disableForm();
    goToIndexBtn.style.display = "none";

    // Calculate IMC, and wait for the data to be saved in the localStorage
    let imc = calculateIMC();
    let comment = getComment(imc);
    let advice = IMC_STEPS_FOR_ADVICE[comment];
    await updateLocalStorage(BASE_JSON_FILE_IMC_CALCULATED_ENTRY(imc, comment));

    // Display again the button to leave the page, with the text changed
    form.classList.toggle("popup");
    form.classList.toggle("popout");
    setTimeout(() => {
        menus.removeChild(form);
    }, 2000);
    goToIndexBtn.innerText = "VALIDER";
    goToIndexBtn.style.display = "flex";

    imcCalculatedMenu.classList.toggle("force-hide");
    imcCalculatedMenu.classList.toggle("popup");
    imcCalculatedMenu.querySelector("h1:nth-of-type(2)").innerText = String(imc);
    document.querySelector("#imc-calculated-menu-advice-container > h3").innerText = comment;
    document.querySelector("#imc-calculated-menu-advice-container > p").innerText = advice;
}

function calculateIMC() {
    let weight = Number(calculateImcFormWeightInput.value);
    let height = Number(calculateImcFormHeightInput.value);
    let imc = weight / (height * height);
    imc = Number(imc.toFixed(2));

    return imc
}