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
      <Heading.h2>Transporter actions</Heading.h2>
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
              placeholder='0x...'
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
    </>
  )
}
