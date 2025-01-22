/**
 * Загружает и парсит настройки конфигурации из переменных окружения.
 * 
 * Этот модуль использует пакет `dotenv` для загрузки переменных окружения из файла `.env`
 * в `process.env`. Затем он определяет интерфейс `Config` и создает объект `config`,
 * который соответствует этому интерфейсу, используя переменные окружения или значения по умолчанию.
 * 
 * @interface Config
 * @property {number} SERVER_PORT - Номер порта, на котором будет работать сервер.
 * @property {number} SOCKET_PORT - Номер порта, на котором будет работать сокет-сервер.
 * @property {string} TOKEN - Токен, используемый для аутентификации.
 * 
 * @constant {Config} config - Объект конфигурации, содержащий порты сервера и сокета, а также токен.
 * 
 * @example
 * // Пример файла .env
 * // PORT=4000
 * // TOKEN=mysecrettoken
 * 
 * @example
 * // Пример использования
 * import config from './configLoader';
 * console.log(config.SERVER_PORT); // 4000
 * console.log(config.TOKEN); // 'mysecrettoken'
 */
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