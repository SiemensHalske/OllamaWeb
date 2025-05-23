import chalk from 'chalk';
import {v4 as uuidv4} from 'uuid';

export default defineNitroPlugin((nitro) => {
    const responseStartTimes: Map<string | null, number> = new Map();

    nitro.hooks.hook('request', (event) => {
        const id = uuidv4();

        responseStartTimes.set(id, Date.now());

        event.headers.append('requestId', id);
    });

    nitro.hooks.hook('afterResponse', (event) => {
        const requestId = event.headers.get('requestId');
        const startTime = responseStartTimes.get(requestId);

        const statusCode = getResponseStatus(event);
        let status= statusCode.toString();
        if(statusCode >= 500) {
            status = chalk.red(status);
        } else if(statusCode >= 300) {
            status = chalk.yellow(status);
        } else {
            status = chalk.green(status);
        }

        if (requestId != null && startTime != null) {
            const ms = Date.now() - startTime;
            const seconds = Math.floor(ms / 1000);

            let timeString = ms + 'ms';
            if(ms > 999){ 
                timeString = seconds + 's ';
            }
            timeString = timeString.padStart(5, ' ');
            console.log(`${timeString} ${status} ${event.method.padEnd(6, ' ')} ${chalk.gray(event.path)}`);
        } else {
            console.log(`${status} ${event.method.padEnd(6, ' ')} ${chalk.gray(event.path)}`);
        }
    });
})