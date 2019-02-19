// migrating the appropriate contracts
const SupplyChain = artifacts.require('./SupplyChain.sol')

module.exports = function (deployer) {
  deployer.deploy(SupplyChain, { from: '0x79078A5671D4B53B37BA8e03f1E53950DbF3818F' })
}
