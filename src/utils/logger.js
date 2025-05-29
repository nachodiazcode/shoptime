import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// Configuración de colores y estilos para los niveles de log
winston.addColors({
    error: 'bold red',
    warn: 'bold yellow',
    info: 'gray',
    http: 'italic green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta'
});

// Crear un formato personalizado
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configurar el logger
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize({
            all: true
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' })
    ],
});

export default logger;
