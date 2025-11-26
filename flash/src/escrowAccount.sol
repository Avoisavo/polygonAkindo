// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EscrowAccount {
    address public  contractOwner;
    IERC20 public  token;

    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Payment(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor(address tokenAddress_) {
        contractOwner = msg.sender;
        token = IERC20(tokenAddress_);
    }

    /**
     * @dev Allows a user to deposit tokens into their escrow balance.
     * @param amount The amount of tokens to deposit.
     */
    function deposit(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Triggered by the x402 agent (contract owner) to pay for a service.
     * Deducts from the user's balance and sends to the contract owner (service provider).
     *
     * @param user The user who requested the service.
     * @param amount The cost of the service.
     */
    function payService(address user, uint256 amount) public onlyContractOwner {
        require(balances[user] >= amount, "Insufficient user balance");

        balances[user] -= amount;
        require(token.transfer(contractOwner, amount), "Token transfer failed");

        emit Payment(user, amount);
    }

    /**
     * @dev Allows a user to withdraw their unused balance.
     * @param amount The amount to withdraw.
     */
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        emit Withdrawal(msg.sender, amount);
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    modifier onlyContractOwner() {
        require(
            msg.sender == contractOwner,
            "Only contract owner can call this function"
        );
        _;
    }
}
