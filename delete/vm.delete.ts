import * as dotenv from "dotenv";
import {getGridClient} from "../core/grid.core";
import {MachinesGetModel} from "grid3_client";

dotenv.config({path: __dirname + '/.env'});

const deleteVM = async () => {
    const gridClient = getGridClient();

    await gridClient.connect();

    const t : MachinesGetModel = {
        name: 'lennertapp2.3bot'
    }

    const a = await gridClient.machines.get(t)
    console.log(a)

    await gridClient.disconnect();
}

deleteVM()

