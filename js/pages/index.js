import { tryInitHeader } from "../compenents/header.js";
import { loadHTML } from "../load_html.js";
import { getData } from "../local_storage_manager.js";



async function init() {
    await Promise.all([
        loadHTML("compenents/header.html", "header-container")
    ]);

    tryInitHeader();
}

await init();

let seeAllCalculatedIMCsBtn = document.getElementById("see-all-calculated-imcs-btn");
let lastIMCsCalculatedContainer = document.getElementById("last-imcs-calculated-container");
let healthScoreBarFilling = document.getElementById("health-score-bar-filling");
let currentHealthScore = document.getElementById("current-health-score");
let data = getData(5);

calculateHealthScore();

if (data.length > 0) {
    data.forEach(data => {
        let html = `
        <div class="imc-calclated-card lastest-imc-calclated-card">
            <div>
                <h3>${data.calculatedIMC}</h3>
                <h5 id="imc-calclated-card-date-of-creation">${data.dateOfCalculation}</h5>
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

function calculateHealthScore() {
    let healthScore = 0;

    let imcs = getData(1);
    if (imcs.length > 0) {
        // Got the calculated IMC from the latest data saved in the localStorage
        let imc = imcs[0].calculatedIMC;

        // Calculate the health score (0 to 100 as the answer)
        let imcOpt = 21.75;
        let sigma = imc < imcOpt ? 4.2 : 7.0;
        let score = 100 * Math.exp(-Math.pow(imc - imcOpt, 2) / (2 * Math.pow(sigma, 2)));
        healthScore = Math.round(score);
    }

    // Force update the width of the "healthScoreBarFilling" div with "healthScore%" (width: 0% to 100% !important)
    healthScoreBarFilling.style.setProperty("width", `${healthScore}%`, "important");
    currentHealthScore.innerText = String(healthScore * 9);
}