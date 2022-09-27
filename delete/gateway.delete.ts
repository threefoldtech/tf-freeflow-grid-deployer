import * as dotenv from "dotenv";
import {getGridClient} from "../core/grid.core";

dotenv.config({ path: __dirname+'/.env' });

const deleteGateways = async () => {
    const gridClient = getGridClient();

    await gridClient.connect();

    await gridClient.gateway.delete_name({name: 'freeflowtesting'})
    await gridClient.gateway.delete_name({name: 'lennertapp2'})
    await gridClient.gateway.delete_name({name: 'freeflowgrid'})
    await gridClient.gateway.delete_name({name: 'freeflow2'})

    await gridClient.disconnect();
}

deleteGateways()

