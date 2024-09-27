import readline from 'node:readline';
import chalk from 'chalk';

import setupCommands from '@@config/setupCommands';
import config from '@@config/index';

await setupCommands();


const commandList = config.commands.map((command, index) => `${index + 1}. ${command.name}\n\t- ${command.description}`);
const initialMessage = chalk.hex("#F56080")(`What would you like to do?\n\n${commandList}\n\n`);

async function main() {
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    prompt.question(initialMessage, async (answer) => { 
        const commandFile = config.commands.filter((command) => command.name === answer)[0];
        prompt.close();

        if(!commandFile) {
            console.log(chalk.hex("#FF0000")("Invalid command, please try again"));
            return main();
        }

        console.log(chalk.hex("#FDA04A")(`Running command - ${commandFile.displayName}...`));
        await commandFile.run();
        console.log(chalk.hex("#00FF00")(`${commandFile.displayName} complete!\n`));
        main();
    });
};

main();