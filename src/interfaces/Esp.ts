import WebSocket, { Server /* etc */} from 'ws';

export enum MessageType{
    INIT,
    STATE,
    SET
}

export enum VariableType {
    ANALOG_INPUT,
    DIGITAL_INPUT,
    ANALOG_OUTPUT,
    DIGITAL_OUTPUT
}

export interface Variable{
    name: string;
    value: number;
    type: VariableType;
}

export interface Client {
    name: string;
    mac: string;
    connection: WebSocket;
}

