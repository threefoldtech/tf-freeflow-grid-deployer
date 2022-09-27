# Deployer for FreeFlow to Grid3

This repository contains typescript code to deploy FreeFlow containers to the grid. You can also manage your contracts / gateways within this repository.

## References

ThreeFold Connect (for .3bot name): https://github.com/threefoldtech/threefold_connect

Grid3 Typescript client: https://github.com/threefoldtech/grid3_client_ts

Flist: https://github.com/threefoldtech/0-flist
## Usage

### Setup development environment

``` cp ./.env.example ./.env```

### **Environement variables:** 

``` SUBSTRATE_SEED: Your substrated seed used for billing (for hosting your VM's)```

``` USER_ID: Your 3Bot connect name ```

``` PUBLIC_SSH_KEY: .pub key so you can SSH to your FreeFlow container```

``` FLIST: URL of FList that has to be deployed on the VM```



### **Delete all contracts:**

``` yarn && yarn delete-contracts```

### **Delete named gateways (fill the gateway names in the array):**

``` yarn && yarn delete-gateways```


### **Deploy a VM**

Make sure all constants are filled in correctly

``` yarn && yarn deploy```


## Used tools:

Manually deploy VM's: https://play.grid.tf/

Dashboard for managing TFT: https://dashboard.grid.tf/

Converting docker to flist: https://hub.grid.tf/docker-convert


### Converting docker to flist:

``` docker build --file docker/prod/Dockerfile -t  threefoldjimber/freeflow-ssh . ```

``` docker push threefoldjimber/freeflow-ssh ```

When these steps are finished, you can easily convert the docker image to an flist using the tool referenced in Used tools.

eg: ``` threefoldjimber/freeflow-ssh``` in the input field.

