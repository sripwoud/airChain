import React from 'react'
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

function App() {
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
