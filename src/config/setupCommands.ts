import type { CommandImport } from '@@types/commands';

import fs from 'fs';

import config from '@@config/index';

import { promises } from '@@utils/index';

async function setupCommands() {

    const commandDir = "./src/commands";
    const dirSync = fs.readdirSync(commandDir);
    const files = dirSync.filter((file) => file.split(".").pop() === "ts");

    for(let i = 0; i < files.length; i++) {
        const commandFile = files[i];
        const displayName = commandFile.split(".")[0].replace(/([a-z])([A-Z])/g, '$1 $2');;

        const [command, err] = await promises.handle<CommandImport>(import(`../commands/${commandFile}`));

        if(err) {
            return console.error("Something went wrong...", err);
        }

        if(!command) {
            return console.error(`Command not found - ${displayName}`);
        }

        config.commands.push({ 
            ...command.config,
            name: displayName.toLocaleLowerCase(),
            displayName: displayName,
            run: command.default 
        });
    };
};

export default setupCommands;