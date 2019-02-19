import Web3 from 'web3'
import supplyChainArtifact from '../../build/contracts/SupplyChain.json'

const App = {
  web3: null,
  account: null,
  supplyChain: null,
  prices: {
    aircraft: null,
    equipment: null,
    transport: null
  },
  states: {
    0: 'Unhandled',
    1: 'Ordered',
    2: 'Assembled',
    3: 'Packed',
    4: 'InTransit',
    5: 'Received',
    6: 'Integrated',
    7: 'StructureReady'
  },

  start: async function () {
    const { web3 } = this

    try {
      // prints for test
      console.log('Owner: ' + '0x79078A5671D4B53B37BA8e03f1E53950DbF3818F')
      console.log('Customer: ' + '0x6Cfe6b3861B74A17a4056EC5b491490F538A7b93')
      console.log('Manufacturer: ' + '0xe2664C8D93AcED44355091bF85F0c4A9f4edE8fF')
      console.log('Supplier: ' + '0xFeF2B31C16F7a7C17Af4B250d237ddA4A318Ef48')
      console.log('Transporter: ' + '0xc28f5856bCA516D48f0eF537E55F770E578e50b1')
      // get contract instance
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = supplyChainArtifact.networks[networkId]
      this.supplyChain = new web3.eth.Contract(
        supplyChainArtifact.abi,
        deployedNetwork.address
      )

      // get accounts
      this.refreshAccount()

      // get assets prices
      const { aircraftPrice, transportFee, equipmentPrice } = this.supplyChain.methods
      this.prices.aircraft = await aircraftPrice.call()
      this.prices.transport = await transportFee.call()
      this.prices.equipment = await equipmentPrice.call()
    } catch (error) {
      console.error('Could not connect to contract or chain.')
    }

    // event listeners
    // this.supplyChain.events.Ordered()
    //   .on('data', (log) => {
    //     const { returnValues: { asset, id } } = log
    //     // console.log('data', asset, id)
    //     this.setStatus(`${asset} ${id} ordered`)
    //   })
    const { Ordered, Assembled, Packed, InTransit, Received, Integrated, StructureReady, ManufacturerAdded, ManufacturerRemoved, CustomerAdded, CustomerRemoved, SupplierAdded, SupplierRemoved, TransporterAdded, TransporterRemoved } = this.supplyChain.events
    const events1 = {
      ordered: Ordered,
      assembled: Assembled,
      received: Received,
      integrated: Integrated
    }
    const events2 = {
      'manufacturer added': ManufacturerAdded,
      'manufacturer removed': ManufacturerRemoved,
      'customer added': CustomerAdded,
      'customer removed': CustomerRemoved,
      'supplier added': SupplierAdded,
      'supplier removed': SupplierRemoved,
      'transporter removed': TransporterRemoved,
      'transporter added': TransporterAdded
    }
    for (let ev in events1) {
      events1[ev]()
        .on('data', (log) => {
          const { returnValues: { asset, id } } = log
          this.setStatus(`${asset} ${id} ${ev}`)
        })
    }
    for (let ev in events2) {
      events2[ev]()
        .on('data', (log) => {
          const { returnValues: { account, name } } = log
          this.setStatus(`${name} - address ${account}: role ${ev}`)
        })
    }
    InTransit()
      .on('data', (log) => {
        const { returnValues: { id } } = log
        this.setStatus(`Equipment ${id} is in transit`)
      })
    Packed()
      .on('data', (log) => {
        const { returnValues: { id } } = log
        this.setStatus(`Equipment ${id} is packed`)
      })
    StructureReady()
      .on('data', (log) => {
        const { returnValues: { msn } } = log
        this.setStatus(`Aircraft ${msn} has its structure ready`)
      })
  },

  refreshAccount: async function () {
    const accounts = await this.web3.eth.getAccounts()
    this.account = accounts[0]
  },

  setStatus: message => {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  addRole: async function () {
    this.refreshAccount()
    const { addManufacturer, addCustomer, addSupplier, addTransporter } = this.supplyChain.methods
    const address = document.getElementById('roleAddress').value
    const name = document.getElementById('roleName').value
    try {
      const role = document.querySelector('input[name="role"]:checked').value
      switch (role) {
        case 'customer':
          await addCustomer(address, name).send({ from: this.account })
          break
        case 'manufacturer':
          await addManufacturer(address, name).send({ from: this.account })
          break
        case 'supplier':
          await addSupplier(address, name).send({ from: this.account })
          break
        case 'transporter':
          await addTransporter(address, name).send({ from: this.account })
          break
      }
    } catch (error) {
      console.error('Please check one of the radio button')
    }
  },
  renounceRole: async function () {
    const { renounceManufacturer, renounceCustomer, renounceSupplier, renounceTransporter } = this.supplyChain.methods
    try {
      const role = document.querySelector('input[name="role"]:checked').value
      switch (role) {
        case 'customer':
          await renounceCustomer().send({ from: this.account })
          break
        case 'manufacturer':
          await renounceManufacturer().send({ from: this.account })
          break
        case 'supplier':
          await renounceSupplier().send({ from: this.account })
          break
        case 'transporter':
          await renounceTransporter().send({ from: this.account })
          break
      }
    } catch (error) {
      console.error('Please check one of the radio button')
    }
  },

  orderAircraft: async function () {
    this.refreshAccount()
    const { orderAircraft } = this.supplyChain.methods
    const equipmentID = document.getElementById('orderACEqID').value
    const manufacturerID = document.getElementById('orderACManufacturer').value
    await orderAircraft(equipmentID, manufacturerID).send({ from: this.account, value: this.prices.aircraft / 2 })
    // msn has been increase by contract so minus 1!
    // this.setStatus(`Aircraft MSN ${_msn - 1} ordered`)
  },
  orderEquipment: async function () {
    this.refreshAccount()
    const { orderEquipment } = this.supplyChain.methods
    const equipmentID = document.getElementById('orderEqID').value
    const supplierID = document.getElementById('orderEqSupplierID').value
    const msn = document.getElementById('orderEqMSN').value
    await orderEquipment(equipmentID, supplierID, msn).send({ from: this.account, value: this.prices.equipment })
  },
  receiveEquipment: async function () {
    this.refreshAccount()
    const { receiveEquipment } = this.supplyChain.methods
    const equipmentID = document.getElementById('orderEqID').value
    await receiveEquipment(equipmentID).send({ from: this.account, value: this.prices.transport / 2 })
  },
  processEquipment: async function () {
    this.refreshAccount()
    const { processEquipment } = this.supplyChain.methods
    const equipmentID = document.getElementById('orderEqID').value
    const notes = document.getElementById('MSNNotes').value
    await processEquipment(equipmentID, notes).send({ from: this.account })
  },
  prepareStructure: async function () {
    this.refreshAccount()
    const { prepareStructure } = this.supplyChain.methods
    const msn = document.getElementById('orderEqMSN').value
    const originPlant = document.getElementById('MSNOrig').value
    const aircraftNotes = document.getElementById('MSNNotes').value
    await prepareStructure(msn, originPlant, aircraftNotes).send({ from: this.account })
  },
  receiveComponent: async function () {
    this.refreshAccount()
    const componentID = document.getElementById('compID').value
    const originManufacturerName = document.getElementById('compManufacturerName').value
    const originPlant = document.getElementById('compOrig').value
    const equipmentID = document.getElementById('compEqID').value
    const { receiveComponent } = this.supplyChain.methods
    await receiveComponent(componentID, originManufacturerName, originPlant, equipmentID).send({ from: this.account })
  },
  processComponent: async function () {
    this.refreshAccount()
    const componentID = document.getElementById('compID').value
    const originPlant = document.getElementById('eqOrig').value
    const equipmentNotes = document.getElementById('eqNotes').value
    const { processComponent } = this.supplyChain.methods
    await processComponent(componentID, originPlant, equipmentNotes).send({ from: this.account })
    // setStatus()
  },
  packEquipment: async function () {
    this.refreshAccount()
    const equipmentID = document.getElementById('compEqID').value
    const transporterID = document.getElementById('transporterID').value
    const { packEquipment } = this.supplyChain.methods
    await packEquipment(equipmentID, transporterID).send({ from: this.account, value: this.prices.transport / 2 })
  },
  transportEquipment: async function () {
    const { transportEquipment } = this.supplyChain.methods
    const equipmentID = document.getElementById('transportEqID').value
    await transportEquipment(equipmentID).send({ from: this.account })
    this.setStatus(`Equipment ${equipmentID} in Transit`)
  },
  receiveAircraft: async function () {
    this.refreshAccount()
    const { receiveAircraft } = this.supplyChain.methods
    const msn = document.getElementById('receiveMSN').value
    await receiveAircraft(msn).send({ from: this.account, value: this.prices.aircraft / 2 })
  },
  fetchAsset: async function () {
    this.refreshAccount()
    const { fetchAircraft, fetchEquipment, fetchComponent } = this.supplyChain.methods
    const id = document.getElementById('fetchID').value
    const asset = document.querySelector('input[name="asset"]:checked').value
    switch (asset) {
      case 'aircraft':
        let aircraft = await fetchAircraft(id).call()
        for (let i = 0; i < 9; i++) {
          delete aircraft[i]
        }
        aircraft.state = App.states[aircraft.state]
        this.setStatus(JSON.stringify(aircraft, undefined, 2))
        break
      case 'equipment':
        let equipment = await fetchEquipment(id).call()
        for (let i = 0; i < 11; i++) {
          delete equipment[i]
        }
        equipment.state = App.states[equipment.state]
        this.setStatus(JSON.stringify(equipment, undefined, 2))
        break
      case 'component':
        let component = await fetchComponent(id).call()
        for (let i = 0; i < 9; i++) {
          delete component[i]
        }
        component.state = App.states[component.state]
        this.setStatus(JSON.stringify(component, undefined, 2))
        break
    }
  },
  checkRoles: async function () {
    const address = document.getElementById('fetchAddress').value
    const { isManufacturer, isCustomer, isTransporter, isSupplier } = this.supplyChain.methods
    const checks = {
      manufacturer: isManufacturer,
      customer: isCustomer,
      transporter: isTransporter,
      suppplier: isSupplier
    }
    const results = {}
    for (let check in checks) {
      let func = checks[check]
      const result = await func(address).call()
      results[check] = result
    }
    this.setStatus(JSON.stringify(results))
  }
}

window.App = App

window.addEventListener('load', function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum)
    window.ethereum.enable() // get permission to access accounts
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:9545')
    )
  }

  App.start()
})
