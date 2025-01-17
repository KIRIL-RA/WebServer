import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    SERVER_PORT: number, 
    SOCKET_PORT: number,
    TOKEN: string
}

const config: Config = {
    SERVER_PORT: Number(process.env.PORT) || 3000,
    SOCKET_PORT: Number(process.env.PORT) || 3000,
    TOKEN: process.env.TOKEN || 'token'
};

export default config;