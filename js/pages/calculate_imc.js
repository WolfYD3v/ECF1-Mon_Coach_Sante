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

let form = document.getElementById("calculate-imc-form");
let formFields = document.querySelectorAll("input[required], textarea[required]");
let calculateImcFormHeightInput = document.getElementById("calculate-imc-form-height-input");
let calculateImcFormWeightInput = document.getElementById("calculate-imc-form-weight-input");
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

    if (formValid) {
        calculateIMC();
        event.target.submit();
    }
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

function getComment(imc) {
    let comment = "";
    Object.keys(IMC_STEPS_FOR_COMMENT).forEach(key => {
        let stepValues = IMC_STEPS_FOR_COMMENT[key];
        console.log(stepValues);
        if (imc >= stepValues[0] && imc <= stepValues[1]) { comment = String(key); }
    });

    return comment
}

function calculateIMC() {
    let weight = Number(calculateImcFormWeightInput.value);
    let height = Number(calculateImcFormHeightInput.value);
    let imc = weight / (height * height);
    imc = Number(imc.toFixed(2));

    updateLocalStorage(BASE_JSON_FILE_IMC_CALCULATED_ENTRY(imc, getComment(imc)));
}