#! /usr/bin/env node
const fs = require('fs');
const fse = require('fs-extra');
const { exec, execSync } = require('child_process');
const clc = require('cli-color');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

console.log(
    clc.cyanBright(
        `
 __    __  ________  __       ______  __    __  __       __ 
/  |  /  |/        |/  |     /      |/  |  /  |/  \     /  |
$$ |  $$ |$$$$$$$$/ $$ |     $$$$$$/ $$ |  $$ |$$  \   /$$ |
$$ |__$$ |$$ |__    $$ |       $$ |  $$ |  $$ |$$$  \ /$$$ |
$$    $$ |$$    |   $$ |       $$ |  $$ |  $$ |$$$$  /$$$$ |
$$$$$$$$ |$$$$$/    $$ |       $$ |  $$ |  $$ |$$ $$ $$/$$ |
$$ |  $$ |$$ |_____ $$ |_____ _$$ |_ $$ \__$$ |$$ |$$$/ $$ |
$$ |  $$ |$$       |$$       / $$   |$$    $$/ $$ | $/  $$ |
$$/   $$/ $$$$$$$$/ $$$$$$$$/$$$$$$/  $$$$$$/  $$/      $$/                                              
                                              
    `
    )
);

setTimeout(() => {
    console.log(`Creating a new ${clc.cyanBright('Helium')} project`);

    const name = selectName();
    const structure = selectStructure();
    createProject(name, structure);
}, 1000);

const selectName = () => {
    return prompt('Enter the name of your new project: ');
};

const selectStructure = () => {
    console.log(`
    ============================
    | ${clc.yellow('1')} - Standard structure   |
    | ${clc.yellow('2')} - React structure      | ${clc.red('(Temporarily out of service)')}
    ============================
    `);
    const structure = prompt(
        'Which structure you want to create (enter a number): '
    );

    switch (structure) {
        case '1':
            return "web";
            break;
        case '2':
            return "react";
            break;
        default:
            console.log(clc.red('Unknown structure, enter again'));
            selectStructure();
            break;
    }
};

const createProject = (name, structure) => {
    console.log(
        clc.green(
            "That's great! I create a project and load all the necessary dependencies :)"
        )
    );
    setTimeout(() => {
        execSync(
            'cd ' +
                process.cwd() +
                ' && git clone https://github.com/Helium-project/helium-application-structure'
        );

        fse.copySync(path.join(process.cwd(), 'helium-application-structure', structure), path.join(process.cwd(), 'helium-application-structure'));
        fs.rmSync(path.join(process.cwd(), 'helium-application-structure', 'web'), { recursive: true, force: true });
        fs.rmSync(path.join(process.cwd(), 'helium-application-structure', 'react'), { recursive: true, force: true });

        fs.renameSync(
            path.join(process.cwd(), 'helium-application-structure'),
            path.join(process.cwd(), name)
        );

        const packageFile = Buffer.from(
            fs.readFileSync(path.join(process.cwd(), name, 'package.json'))
        ).toString();
        fs.rmSync(path.join(process.cwd(), name, 'package.json'));
        fs.writeFileSync(
            path.join(process.cwd(), name, 'package.json'),
            packageFile.replaceAll('helium-application-structure', name)
        );

        console.log('Dependency setup...');

        execSync(
            'cd ' +
                path.join(process.cwd(), name) +
                ' && npm install && npm install https://github.com/Helium-project/Helium'
        );

        console.log(clc.cyanBright(`Happiness for all, for free, and so that no one's left offended`));
    }, 1000);
};
