// migrating the appropriate contracts
const CustomerRole = artifacts.require('./CustomerRole.sol')
const ManufacturerRole = artifacts.require('./ManufacturerRole.sol')
const SupplierRole = artifacts.require('./SupplierRole.sol')
const TransporterRole = artifacts.require('./TransporterRole.sol')
const SupplyChain = artifacts.require('./SupplyChain.sol')

module.exports = function (deployer) {
  // deployer.deploy(CustomerRole, 'Customer0')
  // deployer.deploy(ManufacturerRole, 'Manufacturer0')
  // deployer.deploy(SupplierRole, 'Supplier0')
  // deployer.deploy(TransporterRole, 'Transporter0')
  deployer.deploy(SupplyChain)
}
