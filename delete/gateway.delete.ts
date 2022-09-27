import * as dotenv from "dotenv";
import {getGridClient} from "../core/grid.core";

dotenv.config({path: __dirname + '/.env'});

const REMOVE_GATEWAY_LIST = ['freeflowtesting', 'lennertapp2', 'freeflowgrid', 'freeflow2']

const deleteGateways = async () => {
    const gridClient = getGridClient();

    await gridClient.connect();

    for (let i = 0; i < REMOVE_GATEWAY_LIST.length; i++) {
        const name = REMOVE_GATEWAY_LIST[i]

        await gridClient.gateway.delete_name({name})
    }

    await gridClient.disconnect();
}

deleteGateways()

