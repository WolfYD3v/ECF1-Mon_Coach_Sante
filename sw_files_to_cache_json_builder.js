let fs = require('fs');
let path = require('path');

let swFilesToCacheJSON = "sw_files_to_cache_json.json";



function listFilesForJSON(directoryPath = ".", ignoreList = [""]) {
    let allFiles = [];
    let ignoreFile = false;
    let files = fs.readdirSync(directoryPath);

    // For each files found in the directory...
    files.forEach(file => {
        // Reset to false, then set the 'ignoreFile' flag to true if the file is similar/contains something in the given ignoreList
        ignoreFile = false;
        ignoreList.forEach(ignore => {
            if (file.includes(ignore)) { ignoreFile = true; }
        });

        // If the file cannot be ignored, add it to the output array 'allFiles', then if the file is a directory try to call 'FTC()' inside if it has content in it
        // If the file have to be ignored, output a message in the console
        if (!ignoreFile) {
            if (fs.statSync(`${directoryPath}/${file}`).isDirectory()) {
                allFiles.push(...listFilesForJSON(`${directoryPath}/${file}`, ignoreList));
            }
            else { allFiles.push(`${directoryPath}/${file}`.slice(1)); }
        }
        else { console.log(`Ignoring '${file}' ...`); }

    });

    return allFiles
}

function createJSONFile(files = []) {
    // Try to delete the JSON file before creating it
    fs.unlink(swFilesToCacheJSON, (err) => {
        if (err) { console.log(`${err}`) }
        else { console.log(`JSON File '${swFilesToCacheJSON}' Deleted Successfully !`); }
    });

    // Try to create the JSON file
    files = ["/", ...files]
    fs.writeFile(swFilesToCacheJSON, JSON.stringify(files), (err) => {
        if (err) { console.log(err); }
        console.log(`JSON File '${swFilesToCacheJSON}' Written Successfully ! Ready To Be Used By The Service Worker !`);
    });
}



let directoriesIgnoreList = [".git", ".sass-cache", ".vscode", "figma", "node_modules"];
let filesIgnoreList = [swFilesToCacheJSON, "test_gradient.html", "ANALYSE.txt", "CREDITS.txt", "sw_files_to_cache_json_builder.js", "LICENSE", ".scss", "package", ".md", ".sh", ".map", "questions_de_reflexion_reponses.txt"];
let ignoreList = [...directoriesIgnoreList, ...filesIgnoreList];
createJSONFile(
    listFilesForJSON(".", ignoreList)
)

/*
COMMAND TO RUN TO UPDATE THE JSON FILE:
node sw_files_to_cache_json_builder.js

Node.js needs to be installed to run this file in CLI
*/