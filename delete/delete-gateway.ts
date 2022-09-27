import {
    BackendStorageType,
    GridClient,
    KeypairType,
    NetworkEnv,
} from "grid3_client";
import {HTTPMessageBusClient} from "ts-rmb-http-client";

import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'/.env' });

const mnemonic = process.env.SUBSTRATE_SEED

const rmb = new HTTPMessageBusClient(0, "", "https://graph.grid.tf/graphql", mnemonic);
const gridClient = new GridClient(NetworkEnv.main, mnemonic, "", rmb, "DeleteGateway", BackendStorageType.auto, KeypairType.sr25519);


const deleteGateways = async () => {
    await gridClient.connect();

    await gridClient.gateway.delete_name({ name : 'freeflowtesting'})
    await gridClient.gateway.delete_name({ name : 'lennertapp2'})
    await gridClient.gateway.delete_name({ name : 'freeflowgrid'})
    await gridClient.gateway.delete_name({ name : 'freeflow2'})

    await gridClient.disconnect();
}

deleteGateways()

