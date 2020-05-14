import React, { useState } from 'react'
import {
  Box,
  Button,
  Field,
  Flex,
  Form,
  Heading,
  Input
} from 'rimble-ui'

export default props => {
  const [equipmentId, setEquipmentId] = useState(0)
  const [manufacturer, setManufacturer] = useState('')
  const [msn, setMsn] = useState(0)

  const data = { equipmentId, manufacturer }

  const onOrder = async event => {
    event.preventDefault()
    console.log(data)
  }

  const onReceive = async event => {
    event.preventDefault()
    console.log(msn)
  }

  return (
    <>
      <Heading.h2>Customer actions</Heading.h2>
      <Form onSubmit={onOrder}>
        <Flex alignItems='center'>
          <Field
            label='Equipment ID'
            width={1}
          >
            <Input
              value={equipmentId}
              type='number'
              required
              placeholder='id'
              width={1}
              onChange={event => setEquipmentId(event.target.value)}
            />
          </Field>
          <Field label='Manufacturer Address' width={1}>
            <Input
              value={manufacturer}
              type='text'
              required
              placeholder='0x...'
              width={1}
              onChange={event => setManufacturer(event.target.value)}
            />
          </Field>
          <Button type='submit' width={1 / 2} mt={3}>Order</Button>
        </Flex>
      </Form>
      <Form onSubmit={onReceive}>
        <Flex>
          <Field label='MSN' width={1}>
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
            width={1}
            mt='27px'
          >
            Receive
          </Button>
        </Flex>
      </Form>
    </>
  )
}
