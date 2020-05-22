import React, { useState } from 'react'
import {
  Button,
  Field,
  Flex,
  Form,
  Heading,
  Input
} from 'rimble-ui'

import { useContract } from '../hooks'
import { EQUIPMENT_PRICE, TRANSPORT_FEE } from '../constants'
import { addresses } from '@airChain/contracts'
import Toast from '../components/Toast'

export default props => {
  const contract = useContract()
  const [equipmentId, setEquipmentId] = useState(0)
  const [supplier, setSupplier] = useState(addresses.accounts.supplier.pubKey)
  const [msn, setMsn] = useState(0)
  const [msnOrigin, setMsnOrigin] = useState('')
  const [msnNotes, setMsnNotes] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastState, setToastState] = useState('loading')

  const onOrder = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.orderEquipment(
        equipmentId,
        supplier,
        msn,
        {
          gasLimit: 900000,
          value: +EQUIPMENT_PRICE
        }
      )

      await tx.wait(1)
      // const { args: { asset, id } } = receipt.events.pop()

      setToastState('success')
    } catch (error) {
      setToastState('failed')
    }
  }

  const onReceive = async event => {
    // last: MSN 26, eqID 5
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.receiveEquipment(
        equipmentId,
        { gasLimit: 900000, value: +TRANSPORT_FEE / 2 }
      )

      await tx.wait(1)
      setToastState('success')
    } catch (error) {
      setToastState('failed')
    }
  }

  const onPrepare = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.prepareStructure(
        msn,
        msnOrigin,
        msnNotes,
        { gasLimit: 900000 }
      )

      await tx.wait(1)
      // const { args: { asset, id } } = receipt.events.pop()
      setToastState('success')
    } catch (error) {
      setToastState('failed')
    }
  }

  const onProcess = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.processEquipment(
        equipmentId,
        msnNotes,
        { gasLimit: 900000 }
      )

      await tx.wait(1)
      // const { args: { asset, id } } = receipt.events.pop()
      setToastState('success')
    } catch (error) {
      setToastState('failed')
    }
  }

  return (
    <>
      <Heading.h2>Manufacturer actions</Heading.h2>
      <Form onSubmit={onOrder}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Equipment ID'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={equipmentId}
              type='number'
              width={1}
              required
              placeholder='id'
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Field
            label='Supplier Address'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={supplier}
              type='text'
              required
              placeholder='0x...'
              width={1}
              onChange={event => setSupplier(event.target.value)}
            />
          </Field>
          <Field
            label='MSN'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={msn}
              type='number'
              required
              placeholder='0'
              width={1}
              onChange={event => setMsn(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 4}
            mt={3}
            mx={2}
          >
            Order Equipment
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onReceive}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Equipment ID'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={equipmentId}
              type='number'
              width={1}
              required
              placeholder='id'
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Button
            width={1 / 2}
            my={3}
            type='submit'
          >
            Receive Equipment
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onPrepare}>
        <Flex justifyContent='space-between'>
          <Field
            label='MSN'
            width={1}
            ml={2}
            pr={3}
          >
            <Input
              value={msn}
              type='number'
              required
              width={1}
              onChange={event => setMsn(event.target.value)}
            />
          </Field>
          <Field
            label='MSN Origin'
            width={1}
            ml={2}
            pr={3}
          >
            <Input
              value={msnOrigin}
              type='text'
              required
              placeholder='Town'
              width={1}
              onChange={event => setMsnOrigin(event.target.value)}
            />
          </Field>
          <Field
            label='Notes'
            width={1}
            ml={2}
            pr={3}
          >
            <Input
              value={msnNotes}
              type='text'
              required
              placeholder='Comment'
              width={1}
              onChange={event => setMsnNotes(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1}
            mt='27px'
            mr={2}
          >
            Prepare Structure
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onProcess}>
        <Flex justifyContent='space-between'>
          <Field
            label='Equipment ID'
            width={1}
            ml={2}
            pr={3}
          >
            <Input
              value={equipmentId}
              type='number'
              required
              width={1}
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Field
            label='Notes'
            width={1}
            ml={2}
            pr={3}
          >
            <Input
              value={msnNotes}
              type='text'
              required
              placeholder='Comment'
              width={1}
              onChange={event => setMsnNotes(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1}
            mt='27px'
            mr={2}
          >
            Process Equipment
          </Button>
        </Flex>
      </Form>
      {showToast ? <Toast state={toastState} /> : null}
    </>
  )
}
