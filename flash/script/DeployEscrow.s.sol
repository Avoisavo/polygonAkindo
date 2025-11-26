// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {EscrowAccount} from "../src/escrowAccount.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployEscrow is Script {
    EscrowAccount public escrow;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("ESCROW_TOKEN_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        escrow = new EscrowAccount(tokenAddress);

        vm.stopBroadcast();
    }
}
