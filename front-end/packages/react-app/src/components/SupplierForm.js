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
import { TRANSPORT_FEE } from '../constants'
import { addresses } from '@airChain/contracts'
import Toast from '../components/Toast'

export default props => {
  const contract = useContract()
  const [compId, setCompId] = useState(0)
  const [compManufacturerName, setCompManufacturerName] = useState('')
  const [compOrigin, setCompOrigin] = useState('')
  const [transporter, setTransporter] = useState(addresses.accounts.transporter.pubKey)
  const [equipmentId, setEquipmentId] = useState(0)
  const [equipmentOrigin, setEquipmentOrigin] = useState('')
  const [equipmentNotes, setEquipmentNotes] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastState, setToastState] = useState('loading')

  const onReceive = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.receiveComponent(
        compId,
        compManufacturerName,
        compOrigin,
        equipmentId,
        { gasLimit: 900000 }
      )

      await tx.wait(1)
      setToastState('success')
    } catch (error) {
      console.log(error)
      setToastState('failed')
    }
  }

  const onBuild = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.processComponent(
        compId,
        equipmentOrigin,
        equipmentNotes,
        { gasLimit: 900000 }
      )
      // wait for 1 confirmation
      await tx.wait(1)
      setToastState('success')
    } catch (error) {
      console.log(error)
      setToastState('failed')
    }
  }

  const onPack = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.packEquipment(
        equipmentId,
        transporter,
        {
          gasLimit: 900000,
          value: +TRANSPORT_FEE / 2
        }
      )
      // wait for 1 confirmation
      await tx.wait(1)
      setToastState('success')
    } catch (error) {
      console.log(error)
      setToastState('failed')
    }
  }

  return (
    <>
      <Heading.h2>Supplier actions</Heading.h2>
      <Form onSubmit={onReceive}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Part ID'
            width={1 / 5}
            mx={2}
          >
            <Input
              value={compId}
              type='number'
              width={1}
              required
              onChange={event => setCompId(event.target.value)}
            />
          </Field>
          <Field
            label='Part Manufacturer'
            width={1 / 5}
            mx={2}
          >
            <Input
              value={compManufacturerName}
              type='text'
              required
              placeholder='Name'
              width={1}
              onChange={event => setCompManufacturerName(event.target.value)}
            />
          </Field>
          <Field
            label='Part Origin'
            width={1 / 5}
            mx={2}
          >
            <Input
              value={compOrigin}
              type='text'
              required
              placeholder='Town'
              width={1}
              onChange={event => setCompOrigin(event.target.value)}
            />
          </Field>
          <Field
            label='Equipment ID'
            width={1 / 5}
            mx={2}
          >
            <Input
              value={equipmentId}
              type='number'
              width={1}
              required
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 5}
            mt={3}
            mx={2}
          >
            Receive Part
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onBuild}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Part ID'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={compId}
              type='number'
              width={1}
              required
              onChange={event => setCompId(event.target.value)}
            />
          </Field>
          <Field
            label='Equipment Origin'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={equipmentOrigin}
              type='text'
              required
              placeholder='Town'
              width={1}
              onChange={event => setEquipmentOrigin(event.target.value)}
            />
          </Field>
          <Field
            label='Notes'
            width={1 / 4}
          >
            <Input
              value={equipmentNotes}
              type='text'
              required
              placeholder='Notes'
              width={1}
              onChange={event => setEquipmentNotes(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 4}
            mt={3}
            mx={2}
          >
            Build Equipment
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onPack}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Equipment ID'
            width={1 / 5}
            mx={2}
          >
            <Input
              value={equipmentId}
              type='number'
              width={1}
              required
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Field
            label='Transporter'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={transporter}
              type='text'
              width={1}
              required
              onChange={event => setTransporter(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 4}
            mt={3}
            mx={2}
          >
            Pack Equipment
          </Button>
        </Flex>
      </Form>
      {showToast ? <Toast state={toastState} /> : null}
    </>
  )
}
