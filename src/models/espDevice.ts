import { Client, MessageType, Variable } from '../interfaces/Esp';
import WebSocket, { Server /* etc */ } from 'ws';

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
        // Process all recieved variables
        this.variables = [];
        const recievedVariables = data.variables;

        recievedVariables.forEach((variable: any) => {
            this.variables.push({
                name: variable.name,
                value: Number(variable.value),
                type: Number(variable.type)
            });
        });
    }

    private UpdateStates(data: any){
        const recievedVariables = data.variables;
        recievedVariables.forEach((variable: any) => {
            this.UpdateVariableLocal(variable.name, Number(variable.value));
        });
    }

    private UpdateVariableLocal(name: string, value: number){
        const variable = this.variables.find(v => v.name === name);
        if(variable) variable.value = value;
    }

    public async SetVariable(name: string, value: number){
        console.log('Setting variable', name, value);
        const variable = this.variables.find(v => v.name === name);
        if(!variable) return;

        variable.value = value;

        const message = JSON.stringify({
            type: MessageType.SET,
            name: name,
            value: value
        });

        this.connection.send(message);
    }

    public GetVariables(){
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
                    this.HandleInitMessage(dataObj);
                    break;

                case MessageType.STATE:
                    this.UpdateStates(dataObj);
                    break;
                default:
                    console.log('Invalid message type');
            }
        }
        catch (e) {
            console.log(e);

        }
    }
}