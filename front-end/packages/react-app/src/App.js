import React from 'react'
import { addresses, abis } from '@airChain/contracts'
import { gql } from 'apollo-boost'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/react-hooks'
import './App.css'
import { useStoreState } from 'easy-peasy'
import { Flex, Box } from 'rimble-ui'

import Layout from './components/Layout'
import CustomerForm from './components/CustomerForm'
import ManufacturerForm from './components/ManufacturerForm'
import TransporterForm from './components/TransporterForm'
import SupplierForm from './components/SupplierForm'
import Modal from './components/Modal'
import Get from './components/Get'

const GET_TRANSFERS = gql`
  {
    transfers(first: 10) {
      id
      from
      to
      value
    }
  }
`

async function readOnchainBalance () {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = ethers.getDefaultProvider()
  // Create an instance of ethers.Contract
  // Read more about ethers.js on https://docs.ethers.io/ethers.js/html/api-contract.html
  const ceaErc20 = new ethers.Contract(addresses.ceaErc20, abis.erc20, defaultProvider)
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await ceaErc20.balanceOf('0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C')
  console.log({ tokenBalance: tokenBalance.toString() })
}

function App () {
  // const { loading, error, data } = useQuery(GET_TRANSFERS)
  const form = useStoreState(state => state.form.name)

  const forms = {
    customer: <CustomerForm />,
    supplier: <SupplierForm />,
    manufacturer: <ManufacturerForm />,
    transporter: <TransporterForm />
  }

  return (
    <div className='App'>
      <Modal />
      <Layout>
        <Box fontSize={['12px', '14px', '16px']}>
          {forms[form]}
          <Get />
        </Box>
      </Layout>
    </div>
  )
}

export default App
