
// Hello fellow developer, hope you starred this project :) 
// A star doesn't cost anything, and it's appreciated.
// exec is to execute an OS command via NodeJS, but it's OS dependent. I left my Ubuntu one.
// In case you're not on a module project, uncomment these ones and comment the 2 following ones
// fs = require ('fs');
// const {exec} = require('child_process');
import fs from 'fs';
//import {exec} from 'child_process'; // for dot to JPG

let listoffiles = [];
let fullname = process.argv[2];
let mypath = fullname.replace(/(.+)\/.+\..+/g,"$1/"); // src/
console.log("myorigpath: ", mypath);
let dot =`digraph g {
    label ="Starting at ${mypath}";
    labelloc = top;
    labeljust = left;
    `
    
async function readfile (file) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err;
        console.log('file: ' + file);
        let proprefile = file.replace(mypath,""); // for dot

        let newpath = mypath; // local path
        if (file.match(/\.\./)) newpath = mypath+"." // for parent folder
        
        let result = data;
        result = result.replace(/.*\n.*?(import.+?;)/g, "$1"); // before import (need a line, even empty), all imports are on a single ligne
        result = result.replace(/(^import.+?$).+/ms, "$1"); // erase after import
        result = result.replace(/.+?['"](.+?)['"]/g, "$1,"); // preps for array
        listoffiles = result.split(","); // array
        listoffiles.pop(); // removes the final ";"
        console.log(listoffiles);
        listoffiles.forEach(element => {
            dot = dot.concat(`"${proprefile}"->`);
            let newfullname = newpath + element;
            const childregex =  new RegExp(`^${mypath}[a-zA-Z0-9]+\/`,'g'); // regex for child folder
                // console.log(childregex)
                if (file.match(childregex)) {
                    const nodotregex = new RegExp (`${mypath}\.`,'g'); // regex for no dot
                    newfullname = newfullname.replace(nodotregex,mypath); // for child folder
                }
            let proprefile2 = newfullname.replace(mypath,"");
            const dotregex =  new RegExp(`^\.\./${mypath}`,'g');
            if (proprefile2.match(dotregex)) proprefile2 = proprefile2.replace(dotregex, "./");
            dot = dot.concat(`"${proprefile2}";\n`);
            //console.log("dot: " + dot); // for you to see it populated
            readfile(newfullname); // recursive!
        });
        // console.log("out of foreach")
    });
    // console.log("out of readfile")
}

function main(){
    readfile(fullname);
    setTimeout(() => { // terrible way to allow the unknown recursive function to finish
        dot = dot.concat(`}`);
        fs.writeFile('dot.dot', dot, function (err) {
        if (err) throw err;
        console.log('OK: ' + 'dot.dot');
        // uncomment if you have dot installed on Linux, maybe Mac.
        //exec('dot -T jpg -O dot.dot', (err, stdout, stderr) => {
        //     if (err) {
        //       //some err occurred
        //       console.error(err)
        //     }
        //   });
    });
    }, 2000)
}

main();

// Copyright Philippe Manzano. In Europe, copyright is automatically granted to the author of the work according to the Berne convention. No registration needed.
