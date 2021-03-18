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

execute(gitCommands).then(function([add, commit, push]){

    const error = add.stderr ?? commit.stderr ?? push.stderr;

    console.log(error);

    if( error ) throw error;

    console.log([...arguments[0]].map(x => formatOutput(x.stdout)).join("\n\n"));

}).catch(e => console.log(e.message))