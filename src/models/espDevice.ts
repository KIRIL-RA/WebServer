import { Client, MessageType, Variable } from '../interfaces/Esp';
import WebSocket, { Server /* etc */ } from 'ws';

/**
 * Класс, представляющий устройство ESP.
 * 
 * @class EspDevice
 * @property {string} mac - MAC-адрес устройства.
 * @property {string} name - Имя устройства.
 * @property {WebSocket} connection - Соединение WebSocket с устройством.
 * @property {Variable[]} variables - Массив переменных устройства.
 * 
 * @method constructor - Конструктор класса EspDevice.
 * @param {string} mac - MAC-адрес устройства.
 * @param {string} name - Имя устройства.
 * @param {WebSocket} connection - Соединение WebSocket с устройством.
 * 
 * @method HandleInitMessage - Обрабатывает начальное сообщение и инициализирует переменные.
 * @param {any} data - Данные начального сообщения.
 * 
 * @method UpdateStates - Обновляет состояния переменных на основе полученных данных.
 * @param {any} data - Данные для обновления состояний.
 * 
 * @method UpdateVariableLocal - Локально обновляет значение переменной.
 * @param {string} name - Имя переменной.
 * @param {number} value - Новое значение переменной.
 * 
 * @method SetVariable - Устанавливает значение переменной и отправляет сообщение устройству.
 * @param {string} name - Имя переменной.
 * @param {number} value - Новое значение переменной.
 * 
 * @method GetVariables - Возвращает массив текущих переменных устройства.
 * @returns {Variable[]} Массив переменных устройства.
 * 
 * @method HandleMessage - Обрабатывает входящие сообщения от устройства.
 * @param {string} message - Входящее сообщение в формате JSON.
 */
export class EspDevice {
    mac: string;
    name: string;
    connection: WebSocket;
    private variables: Variable[] = [];

    constructor(mac: string, name: string, connection: WebSocket) {
        this.mac = mac;
        this.name = name;
        this.connection = connection;
    }

    private HandleInitMessage(data: any) {
        // Process all received variables
        this.variables = [];
        const receivedVariables = data.variables;

        receivedVariables.forEach((variable: any) => {
            this.variables.push({
                name: variable.name,
                value: Number(variable.value),
                type: Number(variable.type)
            });
        });
    }

    private UpdateStates(data: any) {
        // Update states of variables based on received data
        const receivedVariables = data.variables;
        receivedVariables.forEach((variable: any) => {
            this.UpdateVariableLocal(variable.name, Number(variable.value));
        });
    }

    private UpdateVariableLocal(name: string, value: number) {
        // Update the local value of a variable
        const variable = this.variables.find(v => v.name === name);
        if (variable) variable.value = value;
    }

    public async SetVariable(name: string, value: number) {
        // Set the value of a variable and send a message to the device
        console.log('Setting variable', name, value);
        const variable = this.variables.find(v => v.name === name);
        if (!variable) return;

        variable.value = value;

        const message = JSON.stringify({
            type: MessageType.SET,
            name: name,
            value: value
        });

        this.connection.send(message);
    }

    public GetVariables() {
        // Return the current array of device variables
        return this.variables;
    }

    /**
     * Handle incoming messages from socket
     * @param message 
     */
    async HandleMessage(message: string) {
        try {
            // Parse the message
            const dataObj = JSON.parse(message);

            switch (Number(dataObj.type)) {
                case MessageType.INIT:
                    // Handle initialization message
                    this.HandleInitMessage(dataObj);
                    break;

                case MessageType.STATE:
                    // Handle state update message
                    this.UpdateStates(dataObj);
                    break;
                default:
                    console.log('Invalid message type');
            }
        } catch (e) {
            console.log(e);
        }
    }
}