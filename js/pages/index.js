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

let seeAllCalculatedIMCsBtn = document.getElementById("see-all-calculated-imcs-btn");
let lastIMCsCalculatedContainer = document.getElementById("last-imcs-calculated-container");
let data = getData(5);

console.log(data.length);
if (data.length > 0) {
    data.forEach(data => {
        let html = `
        <div class="imc-calclated-card lastest-imc-calclated-card">
            <div>
                <h3>${data.calculatedIMC}</h3>
                <h5>${data.dateOfCalculation}</h5>
            </div>
            <h3>${data.comment}</h3>
        </div>
        `;
        lastIMCsCalculatedContainer.insertAdjacentHTML("beforeend", html);
    });
}
else {
    seeAllCalculatedIMCsBtn.style.setProperty("display", "none", "important");
    lastIMCsCalculatedContainer.insertAdjacentHTML("beforeend", '<h3 id="no-calculated-imc-found-h3">Aucuns IMC calculés trouvés, veuillez calculer votre premier IMC pour afficher un premier résultat</h3>');
}