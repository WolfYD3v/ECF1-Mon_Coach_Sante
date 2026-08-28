export function loadHTML(HTMLFilePath, elementId) {
    console.log(`HTML Loader - Loading HTML File '${HTMLFilePath}' For Element with Id '${elementId}' ...`);

    return fetch(HTMLFilePath)
        .then(response => response.text())
        .then(text => {
            let container = document.getElementById(elementId);
            if (container) { container.insertAdjacentHTML('beforeend', text); }
        });
}