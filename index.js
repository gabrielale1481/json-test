const { promisify } = require("util");
const { exec } = require("child_process");

const execute = function( command ){

    const _exec = cmd => promisify(exec)(cmd);

    if( Array.isArray(command) ) return new Promise(async function(resolve, reject){
        const result = [];
        for( let cmd of command ) result.push(await _exec(cmd));
        resolve(result);
    })

    return _exec(command);

}

const formatOutput = output => output.replace(/\n\r/g, '');

const gitCommands = [
    'git add .',
    'git commit -m "initial commit"',
    'git push origin main'
]

execute(gitCommands).then(function(commands){

    const error = commands.find(cmd => cmd.stderr)?.stderr;

    if( error ) throw error;

}).catch(e => console.log(e.message))