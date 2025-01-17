import WebSocket, { Server /* etc */} from 'ws';

interface ExtendedWebSocket extends WebSocket {

    dispatchEvent(event: Event): boolean;

}

export interface Client {
    name: string;
    mac: string;
    connection: WebSocket;
}

export enum DeviceTypes {
    ESP = 'esp',
    CONTROL = 'control'
}