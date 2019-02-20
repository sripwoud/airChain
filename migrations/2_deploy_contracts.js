const SupplyChain = artifacts.require('./SupplyChain.sol')
const fs = require('fs')

const account = fs.readFileSync("../app/owner_account").toString().trim()

module.exports = function (deployer) {
  deployer.deploy(SupplyChain, { from: account })
}
