import WebSocket, { Server /* etc */} from 'ws';

export interface Controller {
    name: string | null;
    connection: WebSocket;
}