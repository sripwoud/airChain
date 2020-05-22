import React, { useState } from 'react'
import * as ethers from 'ethers'
import {
  Button,
  Field,
  Flex,
  Form,
  Heading,
  Input
} from 'rimble-ui'

import { useContract } from '../hooks'
import { AIRCRAFT_PRICE } from '../constants'
import { addresses } from '@airChain/contracts'
import Toast from '../components/Toast'

export default () => {
  const contract = useContract()

  const [equipmentId, setEquipmentId] = useState(0)
  const [manufacturer, setManufacturer] = useState(addresses.accounts.manufacturer.pubKey)
  const [msn, setMsn] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastState, setToastState] = useState('loading')

  const onOrder = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.orderAircraft(
        equipmentId,
        manufacturer,
        {
          gasLimit: 900000,
          value: ethers.utils.parseEther(`${AIRCRAFT_PRICE / 2}`)
        }
      )
      console.log(tx)

      await tx.wait(1)
      // const { args: { asset, id } } = receipt.events.pop()

      setToastState('success')
    } catch (error) {
      console.log(error)
      setToastState('failed')
    }
  }

  const onReceive = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.receiveAircraft(
        msn,
        {
          gasLimit: 900000,
          value: ethers.utils.parseEther(`${AIRCRAFT_PRICE / 2}`)
        }
      )

      await tx.wait(1)
      // const { args: { asset, id } } = receipt.events.pop()
      setToastState('success')
    } catch (error) {
      console.log(error)
      setToastState('failed')
    }
  }

  return (
    <>
      <Heading fontSize={['20px', '25px', '32px']}>
        Customer actions
      </Heading>
      <Form onSubmit={onOrder}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Equipment ID'
            width={1 / 2}
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
            label='Manufacturer Address'
            width={1 / 2}
          >
            <Input
              value={manufacturer}
              type='text'
              required
              width={1}
              onChange={event => setManufacturer(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 2}
            mt={3}
            mx={2}
          >
            Order
          </Button>
        </Flex>
      </Form>
      <Form onSubmit={onReceive}>
        <Flex justifyContent='space-between'>
          <Field
            label='MSN'
            width={1 / 3}
            ml={2}
            pr={3}
          >
            <Input
              value={msn}
              type='number'
              required
              placeholder='MSN'
              width={1}
              onChange={event => setMsn(event.target.value)}
            />
          </Field>
          <Button
            type='submit'
            width={1 / 3}
            mt='27px'
            mr={2}
          >
            Receive
          </Button>
        </Flex>
      </Form>
      {showToast ? <Toast state={toastState} /> : null}
    </>
  )
}
