import chalk from 'chalk';

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('afterResponse', (event) => {
        const status = getResponseStatus(event);
        const message = `${event.method} ${event.path} ${status}`;
        if(status >= 500) {
            console.log(chalk.red(message));
        } else if(status >= 300) {
            console.log(chalk.yellow(message));
        } else {
            console.log(chalk.green(message));
        }
    });
})