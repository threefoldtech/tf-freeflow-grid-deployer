import {HTTPMessageBusClient} from "ts-rmb-http-client";
import {BackendStorageType, GridClient, KeypairType, NetworkEnv} from "grid3_client/dist/node";

export const getGridClient = () : GridClient => {
    const mnemonic = process.env.SUBSTRATE_SEED

    const rmb = new HTTPMessageBusClient(0, "", "https://graph.grid.tf/graphql", mnemonic);
    return new GridClient(NetworkEnv.main, mnemonic, "", rmb, "FreeFlow-Grid", BackendStorageType.auto, KeypairType.sr25519);
}
