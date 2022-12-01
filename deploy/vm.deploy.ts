import {DiskModel, FilterOptions, GatewayNameModel, MachineModel, MachinesModel, NetworkModel} from "grid3_client";

import * as dotenv from "dotenv";
import {Environment} from "../enums/deployer.enums";
import {generateUuid} from "../helpers/deploy.helpers";
import {getGridClient} from "../core/grid.core";

dotenv.config({path: __dirname + '/.env'});


const USER_ID = process.env.USER_ID
const DNS = USER_ID + '.gent01.grid.tf';

const NETWORK_NAME: string = 'TFNet'
const IP_RANGE: string = '10.249.0.0/16'

const DISK_NAME: string = 'disk'
const DISK_SIZE: number = 8;
const DISK_MOUNT_POINT: string = '/disk'

const VM_DEPLOY_NODE_ID: number = 1;
const VM_USE_PLANETARY: boolean = true;
const VM_USE_PUBLIC_IP: boolean = true;
const VM_CPU_COUNT: number = 1;
const VM_MEMORY_COUNT: number = 1024 * 2;
const VM_ROOT_FS_SIZE: number = 0;
const VM_ENTRY_POINT: string = '/init.sh'
const VM_DESCRIPTION: string = 'FreeFlow Grid VM'

const GATEWAY_TLS_PASS_TROUGH: boolean = false;

const deployVirtualMachine = async () => {
    const gridClient = getGridClient();

    await gridClient.connect();

    const n = new NetworkModel();
    n.name = NETWORK_NAME;
    n.ip_range = IP_RANGE;

    const disk = new DiskModel();
    disk.name = DISK_NAME
    disk.size = DISK_SIZE
    disk.mountpoint = DISK_MOUNT_POINT

    const machine = new MachineModel();
    machine.public_ip6 = true;
    machine.name = USER_ID;
    machine.node_id = VM_DEPLOY_NODE_ID;
    machine.disks = [disk];
    machine.planetary = VM_USE_PLANETARY;
    machine.public_ip = VM_USE_PUBLIC_IP;
    machine.cpu = VM_CPU_COUNT;
    machine.memory = VM_MEMORY_COUNT;
    machine.rootfs_size = VM_ROOT_FS_SIZE;
    machine.flist = process.env.FLIST;
    machine.entrypoint = VM_ENTRY_POINT;

    machine.env = {
        NODE_ENV: Environment.STAGING,
        SSH_KEY: process.env.PUBLIC_SSH_KEY,
        USER_ID: USER_ID,
        DIGITALTWIN_APPID: DNS,
        THREEBOT_PHRASE: process.env.THREEBOT_PHRASE,
        SECRET: process.env.SECRET,
        ENABLE_SSL: process.env.ENABLE_SSL
    };

    const virtualMachine = new MachinesModel();
    virtualMachine.name = generateUuid();
    virtualMachine.network = n;
    virtualMachine.machines = [machine];
    virtualMachine.description = VM_DESCRIPTION;


    const vmResult = await gridClient.machines.deploy(virtualMachine);
    console.log('VM Result', vmResult)

    const vmResultObject = await gridClient.machines.getObj(virtualMachine.name);
    console.log('VM Result', vmResultObject)

    const gatewayQueryOptions: FilterOptions = {
        gateway: true,
        farmId: 1,
    };

    const ip = vmResultObject[0]['publicIP']['ip'].split('/')[0]

    const gw = new GatewayNameModel();
    gw.name = USER_ID

    gw.node_id = +(await gridClient.capacity.filterNodes(gatewayQueryOptions))[0].nodeId;
    gw.tls_passthrough = GATEWAY_TLS_PASS_TROUGH;

    gw.backends = [`http://${ip}:80`];

    const nameResult = await gridClient.gateway.deploy_name(gw);
    console.log('Result of name deploy', nameResult)

    const nameDeploymentResult = await gridClient.gateway.getObj(gw.name);
    console.log('Result of name deploy', nameDeploymentResult)

    await gridClient.disconnect();
}


deployVirtualMachine()

