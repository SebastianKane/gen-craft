import { type Logger, type LoggerOptions } from 'pino';

export enum ServerEnvironment {
    DEV,
    PREV,
    STG,
    PROD 
}

export type PinoLogger = Logger & {
    setLogLevel?: (NODE_ENV: ServerEnvironment) => LoggerOptions['level'];
};

// '#' Represents fillable boxes on the grid
// '' Represents unfillable boxes on the grid
export type squareFill = '' | '#';