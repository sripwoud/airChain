const Web3 = require('web3')
const fs = require('fs')

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
web3.eth.getAccounts().then(accounts => {
  fs.writeFile(`${__dirname}/owner_account`, accounts[0], err => {
    if (err) {
      return console.log(err)
    }
    console.log('File was saved')
  })
 })
