import {BackendStorageType, GridClient, KeypairType, NetworkEnv,} from "grid3_client";
import {HTTPMessageBusClient} from "ts-rmb-http-client";

import * as dotenv from "dotenv";

dotenv.config({path: __dirname + '/.env'});

const mnemonic = process.env.SUBSTRATE_SEED

const rmb = new HTTPMessageBusClient(0, "", "https://graph.grid.tf/graphql", mnemonic);
const gridClient = new GridClient(NetworkEnv.main, mnemonic, "", rmb, "DeleteContracts", BackendStorageType.auto, KeypairType.sr25519);


const deleteContracts = async () => {
    await gridClient.connect();


    await gridClient.contracts.cancelMyContracts()

    await gridClient.disconnect();
}

deleteContracts()

