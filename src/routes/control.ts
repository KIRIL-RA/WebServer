import express, { Request, Response } from 'express';
import { espDevices } from '../models/socket';
const path = require('path');

const controlPage = express.Router();

controlPage.get('/control/:espName', 
    async (req: Request, res: Response) => {
        const espName = req.params.espName;

        // Search esp by name
        try{
            const esp = espDevices.find(esp => esp.name === espName);
            if(!esp) res.status(404).sendStatus(404);
            else res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default controlPage;