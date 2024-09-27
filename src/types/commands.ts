export interface CommandConfig {
    description: string,
    aliases: string[]
};

export interface Command extends CommandConfig {
    name: string,
    displayName: string
};

export interface CommandFile extends Command {
    run: Function
};

export interface CommandImport {
    config: CommandConfig,
    default: Function
};

