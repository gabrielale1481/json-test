const { readFile, writeFile } = require("fs/promises");
const { exec } = require("child_process");
const { promisify } = require("util");

const JSON_PATH = process.cwd().concat("/changeMe.json");

const execute = function( command ){

    const _exec = cmd => promisify(exec)(cmd);

    if( Array.isArray(command) ) return new Promise(async function(resolve, reject){
        const result = [];
        try{
            for( let cmd of command ) result.push(await _exec(cmd));
            return resolve(result);
        } catch (e) { reject(e) }
    })

    return _exec(command);

}

const changeJSON = function(){
    return (
        readFile(JSON_PATH)
        .then(JSON.parse)
        .then(parsed => ({
            ...parsed,
            count: parsed.count + 1
        }))
        .then(modified => JSON.stringify(modified, undefined, 4))
        .then(JSONText => writeFile(JSON_PATH, JSONText))
    )
}

const lookForErrors = commands => {
    const error = commands.find(cmd => cmd.stderr)?.stderr;
    if( error ) throw error;
    return commands.map(x => x.stdout.replace("\n\r")).join("\n");
}

const gitCommands = [
    'git init',
    'git config user.name gabrielale1481',
    'git config user.email gabrielale1481@gmail.com',
    'git remote add origin https://github.com/gabrielale1481/json-test.git',
    'git add .',
    'git commit -m "commit from Heroku"',
    'git pull origin main',
    'git push origin main'
]

changeJSON()
    .then(() => execute(gitCommands))
    .then(lookForErrors)
    .then(console.log)
    .catch(e => console.log(e.message ?? e))