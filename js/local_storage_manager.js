/*
TODO:

- Create base JSON file structure     [DONE]
- Write JSON files on localStorage    [DONE]
- Read JSON files on localStorage     [DONE]
- Delete JSON files on localStorage   [DONE]
*/

const BASE_JSON_FILE_DATA = [];
export const BASE_JSON_FILE_IMC_CALCULATED_ENTRY = function(_calculatedIMC, _comment) {
    return {
            calculatedIMC: _calculatedIMC,
            dateOfCalculation: getCurrentDate(),
            comment: _comment
    }
}
const FORMAT_NUMBER = function(_number) {
    let strNumber = String(_number);
    if (strNumber.length < 2) { strNumber = `0${strNumber}`; }

    return strNumber
}
const MAX_ENTRIES_AMOUNT_PER_JSON_FILE = 25;

function getCurrentDate() {
    let months = [
        "jan.", "fev.", "mars", "avril",
        "mai", "juin", "jui.", "août",
        "sept.", "oct.", "nov.", "dec."
    ]
    let date = new Date();

    let day = FORMAT_NUMBER(date.getDate());
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let currentDay = `${day} ${month} ${year}`;

    let hours = FORMAT_NUMBER(date.getHours());
    let minutes = FORMAT_NUMBER(date.getMinutes());
    let seconds = FORMAT_NUMBER(date.getSeconds());
    let currentHours = `${hours}:${minutes}:${seconds}`;

    let formattedDate = `${currentDay} - ${currentHours}`;

    return formattedDate
}

function lookForAvaibleFileIdx() {
    let avaibleFileIdx = 0;

    for (let idx = 0; idx < localStorage.length; idx++) {
        let key = localStorage.key(idx);
        let parsedJSONFileEntry = JSON.parse(localStorage.getItem(key));

        avaibleFileIdx = Number(key);
        if (parsedJSONFileEntry.length >= MAX_ENTRIES_AMOUNT_PER_JSON_FILE) {
            avaibleFileIdx++;
            break;
        }
    }

    return avaibleFileIdx
}

function writeJSONFile(entryKey, data) {
    let promise = new Promise((resolve, reject) => {
        let dataToUpdate = JSON.parse(localStorage.getItem(entryKey));
        if (localStorage.length >= entryKey + 1) {
            dataToUpdate = [data, ...dataToUpdate];
            localStorage.setItem(entryKey, JSON.stringify(dataToUpdate));
        }
        else { localStorage.setItem(entryKey, JSON.stringify([data])); }

        let dataUpdated = JSON.parse(localStorage.getItem(entryKey));
        if (dataUpdated != dataToUpdate) { resolve("UPDATED !"); }
        else { reject(new Error("UPDATE FAILED !")); }
    });

    return promise

    /* if (localStorage.length >= entryKey + 1) {
        let dataToUpdate = JSON.parse(localStorage.getItem(entryKey));
        dataToUpdate = [data, ...dataToUpdate];
        localStorage.setItem(entryKey, JSON.stringify(dataToUpdate));
    }
    else {
        localStorage.setItem(entryKey, JSON.stringify([data]));
    } */
}

export function updateLocalStorage(data) {
    let avaibleFileIdx = lookForAvaibleFileIdx();
    return writeJSONFile(avaibleFileIdx, data);
}

export function eraseLocalStorage() {
    localStorage.clear();
    console.log(getData());
}

export function getData(maxEntries = 0) {
    let data = [];

    let baseData = [];
    for (let idx = localStorage.length - 1; idx >= 0; idx--) {
        let key = localStorage.key(idx);
        let parsedJSONFileEntry = JSON.parse(localStorage.getItem(String(idx)));
        baseData = [...baseData, ...parsedJSONFileEntry];
    }

    let iter = baseData.length;
    if (maxEntries > 0) { iter = Math.min(Math.max(maxEntries, 0), baseData.length); }
    for (let idx = 0; idx < iter; idx++) {
        data.push(baseData[idx]);
    }

    return data
}

export function testLocalStorageManager() {
    console.log("Testing JSON entry creation...");
    let testJSONEntry = BASE_JSON_FILE_IMC_CALCULATED_ENTRY(14, "OK");
    console.log(testJSONEntry);

    console.log("Testing data deletion...");
    eraseLocalStorage();

    console.log("Testing saving data...");
    for (let loop = 0; loop < 92; loop++) {
       updateLocalStorage(BASE_JSON_FILE_IMC_CALCULATED_ENTRY(14, "OK")); 
    }

    console.log("Testing fetching data...");
    console.log("everything");
    console.log(getData());
    console.log("too much (578 wanted, but only 92 saved)");
    console.log(getData(578));
    console.log("only 5 (92 are saved)");
    console.log(getData(5));

    console.log("Testing finished !");
}