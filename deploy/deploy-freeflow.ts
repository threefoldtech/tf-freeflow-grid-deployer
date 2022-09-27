import {
    BackendStorageType,
    DiskModel,
    FilterOptions,
    GatewayNameModel,
    GridClient,
    KeypairType,
    MachineModel,
    MachinesModel,
    NetworkEnv,
    NetworkModel
} from "grid3_client";
import {HTTPMessageBusClient} from "ts-rmb-http-client";

import * as dotenv from "dotenv";
import {Environment} from "../enums/deployer.enums";
import {generateUuid} from "../helpers/deploy.helpers";

dotenv.config({ path: __dirname+'/.env' });

const mnemonic = process.env.SUBSTRATE_SEED

const rmb = new HTTPMessageBusClient(0, "", "https://graph.grid.tf/graphql", mnemonic);
const gridClient = new GridClient(NetworkEnv.main, mnemonic, "", rmb, "FreeFlow-Grid", BackendStorageType.auto, KeypairType.sr25519);


const USER_ID = process.env.USER_ID
const DNS = USER_ID + '.gent01.grid.tf';

const initialization = async () => {
    await gridClient.connect();

    const n = new NetworkModel();
    n.name = 'TFNet'
    n.ip_range = "10.249.0.0/16";

    const disk = new DiskModel();
    disk.name = 'disk';
    disk.size = 8;
    disk.mountpoint = "/disk"

    const vm = new MachineModel();
    vm.name = USER_ID;
    vm.node_id = 1;
    vm.disks = [disk];
    vm.planetary = true;
    vm.public_ip = true;
    vm.cpu = 1;
    vm.memory = 1024 * 2;
    vm.rootfs_size = 0;
    vm.flist = process.env.FLIST;
    vm.entrypoint = "/init.sh";

    vm.env = {
        NODE_ENV: Environment.STAGING,
        SSH_KEY: process.env.PUBLIC_SSH_KEY,
        USER_ID: USER_ID,
        DIGITALTWIN_APPID: DNS,
        THREEBOT_PHRASE: process.env.THREEBOT_PHRASE,
        SECRET: process.env.SECRET,
        ENABLE_SSL: process.env.ENABLE_SSL
    };

    const vms = new MachinesModel();
    vms.name = generateUuid();
    vms.network = n;
    vms.machines = [vm];
    vms.description = "FreeFlow VM";


    const vmResult = await gridClient.machines.deploy(vms);
    console.log('VM Result')
    console.log(vmResult);

    const vmResultObject = await gridClient.machines.getObj(vms.name);
    console.log('VM Result')
    console.log(vmResultObject);


    const gatewayQueryOptions: FilterOptions = {
        gateway: true,
        farmId: 1,
    };

    const ip = vmResultObject[0]['publicIP']['ip'].split('/')[0]

    const gw = new GatewayNameModel();
    gw.name = USER_ID

    gw.node_id = +(await gridClient.capacity.filterNodes(gatewayQueryOptions))[0].nodeId;
    gw.tls_passthrough = false;

    gw.backends = [`http://${ip}:80`];

    const nameResult = await gridClient.gateway.deploy_name(gw);
    console.log('Result of name deploy')
    console.log(nameResult);

    const nameDeploymentResult = await gridClient.gateway.getObj(gw.name);
    console.log('Result of name deploy')
    console.log(nameDeploymentResult);

    await gridClient.disconnect();
}

// initialization()

