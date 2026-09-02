import { tryInitHeader } from "../compenents/header.js";
import { loadHTML } from "../load_html.js";
import { getData, testLocalStorageManager } from "../local_storage_manager.js";



async function init() {
    await Promise.all([
        loadHTML("compenents/header.html", "header-container")
    ]);

    tryInitHeader();
}

await init();

let allCalculatedIMCsContainer = document.getElementById("all-calculated-imcs-container");
let data = getData();
let latestEntriesCount = 5;

if (data.length > 0) {
    let imcCalculatedOldDayOfCreation = getImcCalculatedDayOfCreation(data[0]);

    let dataToUse = [];
    for (let idx = 0; idx < data.length; idx++) {
        let dataEntry = data[idx];
        let dataEntryImcCalculatedDayOfCreation = getImcCalculatedDayOfCreation(dataEntry);
        console.log(dataEntryImcCalculatedDayOfCreation);
        if (dataEntryImcCalculatedDayOfCreation != imcCalculatedOldDayOfCreation) {
            allCalculatedIMCsContainer.insertAdjacentHTML("beforeend", createDaySection(dataToUse, imcCalculatedOldDayOfCreation));
            imcCalculatedOldDayOfCreation = dataEntryImcCalculatedDayOfCreation;
            dataToUse = [];
        }
        else {
            dataToUse.push(dataEntry);
        }
    }
    allCalculatedIMCsContainer.insertAdjacentHTML("beforeend", createDaySection(dataToUse, imcCalculatedOldDayOfCreation));
}
else {
    allCalculatedIMCsContainer.insertAdjacentHTML("beforeend", `
        <h3 id="no-calculated-imc-found-h3">Aucuns IMC calculés trouvés, veuillez calculer votre premier IMC pour afficher un premier résultat</h3>
        <a href="calculate_imc.html" class="button">Calculer mon IMC</a>
    `);
}

function getImcCalculatedDayOfCreation(dataEntry) {
    return String(dataEntry.dateOfCalculation.split("-")[0])
}

function createDaySection(dataRelated = [], day) {
    let cardsHTML = ``;
    for (let dataRelatedEntry of dataRelated) {
        let mainDivClasses = "imc-calclated-card";
        if (latestEntriesCount > 0) {
            mainDivClasses += " lastest-imc-calclated-card";
            latestEntriesCount--;
        }
        cardsHTML += `
            <div class="${mainDivClasses}">
                <div>
                    <h3>${dataRelatedEntry.calculatedIMC}</h3>
                    <h5>${dataRelatedEntry.dateOfCalculation}</h5>
                </div>
                <h3>${dataRelatedEntry.comment}</h3>
            </div>
        `;
    }

    let dayHTMLSection = `
        <div class="all-calculated-imcs-day-section">
            <h3>${day}</h3>
            ${cardsHTML}
        </div>
    `;
    return dayHTMLSection
}