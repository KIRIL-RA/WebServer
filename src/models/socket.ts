import WebSocket from 'ws';
import { Client, DeviceTypes } from '../interfaces/Client';
import config from './configLoader';
import { EspDevice } from './espDevice';
import { Controller } from '../interfaces/Controller';
import { Server } from 'http';

const espDevices: EspDevice[] = [];

function CreateWebSocket(nodeServer: Server) {
    const validToken = config.TOKEN;

    const server = new WebSocket.Server({ server: nodeServer });
    const controllers: Controller[] = [];

    server.on('connection', handleWebSocketConnection);

    /**
     * Handles the connection of a new websocket client
     * @param ws 
     * @param req 
     * @returns 
     */
    function handleWebSocketConnection(ws: WebSocket, req: any) {
        const urlParams = new URLSearchParams(req.url?.split('?')[1]);
        const name = urlParams.get('name');
        const mac = urlParams.get('mac');
        const token = urlParams.get('token');
        const deviceType = urlParams.get('type');

        switch (deviceType) {
            // Esp connection handler
            case DeviceTypes.ESP:
                console.log(urlParams)
                // Validate tokens and parameters
                if (!name || !mac || !token || token !== validToken) {
                    ws.close(1008, 'Invalid token');
                    return;
                }

                // Check if the device is already connected
                const existingEsp = espDevices.find(c => c.name === name);

                // If exist -> replace existing connection
                const index = espDevices.findIndex(c => c.name === name);

                // Create a new EspDevice instance
                const esp: EspDevice = new EspDevice(mac, name, ws);

                // Save it if doesnt exist
                if (index !== -1) espDevices[index] = esp;
                else espDevices.push(esp);

                // Handle incoming messages
                ws.on('message', async (message) => {
                    await esp.HandleMessage(message.toString());

                    // Send states to all controllers
                    controllers.forEach(controller => {
                        if (controller.name === name) controller.connection.send(JSON.stringify(esp.GetVariables()));
                    });
                });
                break;

            // Control connection handler
            case DeviceTypes.CONTROL:
                // Check that esp device with this mac exist
                const espDevice = espDevices.find(esp => esp.name === name);
                if (!espDevice) {
                    ws.close(1008, 'Invalid device mac');
                    return;
                }

                // Create a new Controller instance
                const controller: Controller = {
                    name: name,
                    connection: ws
                };
                controllers.push(controller);

                // Send state of esp to this controller
                controller.connection.send(JSON.stringify({ type: "init", variables: espDevice.GetVariables() }));

                // Handle incoming messages
                ws.on('message', (message) => {
                    console.log(`Received message: ${message}`);

                    // Handle incoming message
                    const data = JSON.parse(message.toString());

                    // If user want's to set variable
                    // Set it on esp device
                    if (data.type === 'set') {
                        espDevice.SetVariable(data.name, data.value);
                    }
                });

                // Handle close event
                ws.on('close', () => {
                    const index = controllers.findIndex(c => c.name === name);
                    if (index !== -1) {
                        controllers.splice(index, 1);
                    }
                });

                break;
            default:
                ws.close(1008, 'Invalid device type');
        }
    }
}
export { CreateWebSocket, espDevices };