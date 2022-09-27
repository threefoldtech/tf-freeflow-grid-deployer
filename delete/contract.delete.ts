import * as dotenv from "dotenv";
import {getGridClient} from "../core/grid.core";

dotenv.config({path: __dirname + '/.env'});




const deleteContracts = async () => {
    const gridClient = getGridClient();

    await gridClient.connect();

    await gridClient.contracts.cancelMyContracts()

    await gridClient.disconnect();
}

deleteContracts()

