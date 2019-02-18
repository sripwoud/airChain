module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 3000000000
    },
    gui: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    }
  },
  solc: {
    optimizer:
    { enabled: true,
      runs: 200 } }
}
