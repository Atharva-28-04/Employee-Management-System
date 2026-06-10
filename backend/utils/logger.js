import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Define how the log text should look
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'info', // 'info' logs general data, 'error' logs crashes
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        // 1. Write ALL logs (info + errors) to combined.log
        new transports.File({ filename: 'logs/combined.log' }),
        
        // 2. Write ONLY errors to a dedicated error.log
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

// 3. If we are testing locally, also print to the terminal so we can see it
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(), // Adds colors to the terminal output
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat
        )
    }));
}

export default logger;