// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CounterModule", (m) => {
  const initialValue = m.getParameter("initialValue", 0);

  const counter = m.contract("Counter", [initialValue]);

  return { counter };
});



