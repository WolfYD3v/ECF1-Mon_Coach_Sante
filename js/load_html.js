export function loadHTML(HTMLFilePath, elementId) {
    console.log(`HTML Loader - Loading HTML File '${HTMLFilePath}' For Element with Id '${elementId}' ...`);

    return fetch(HTMLFilePath)
        .then(response => response.text())
        .then(text => tryInsertHTML(elementId, text))
        .catch(err => console.error(`HTML Loader - The Loading of the HTML File '${HTMLFilePath}' (for Element with Id '${elementId}') Failed: ${err}`));
}

function tryInsertHTML(elementId, newHTML) {
    let container = document.getElementById(elementId);
    if (container) { container.insertAdjacentHTML('beforeend', newHTML); }
}