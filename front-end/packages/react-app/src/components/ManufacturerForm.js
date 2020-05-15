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
  const [supplier, setSupplier] = useState('')
  const [msn, setMsn] = useState(0)
  const [msnOrigin, setMsnOrigin] = useState('')
  const [msnNotes, setMsnNotes] = useState('')

  const data = { equipmentId, supplier, msn }

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
      <Button width={1 / 2} my={3}>Receive Equipment</Button>
      <Form onSubmit={onReceive}>
        <Flex justifyContent='space-between'>
          <Field
            label='MSN Origin Plant'
            width={1 / 3}
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
            width={1 / 3}
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
            width={1 / 3}
            mt='27px'
            mr={2}
          >
            Prepare Structure
          </Button>
          <Button
            type='submit'
            width={1 / 3}
            mt='27px'
            mr={2}
          >
            Process Equipment
          </Button>
        </Flex>
      </Form>
    </>
  )
}
