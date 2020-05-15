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
  const [compId, setCompId] = useState(0)
  const [compManufacturerName, setCompManufacturerName] = useState('')
  const [compOrigin, setCompOrigin] = useState('')
  const [equipmentId, setEquipmentId] = useState(0)
  const [equipmentOrigin, setEquipmentOrigin] = useState('')
  const [equipmentNotes, setEquipmentNotes] = useState('')
  const [transporter, setTransporter] = useState('')

  const onOrder = async event => {
    event.preventDefault()
  }

  const onReceive = async event => {
    event.preventDefault()
  }

  return (
    <>
      <Heading.h2>Supplier actions</Heading.h2>
      <Form onSubmit={onOrder}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Field
            label='Component ID'
            width={1 / 4}
            mx={2}
          >
            <Input
              value={compId}
              type='number'
              width={1}
              required
              placeholder='id'
              onChange={event => setCompId(event.target.value)}
            />
          </Field>
          <Field
            label='Component Manufacturer Name'
            width={1 / 4}
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
            label='Component Origin'
            width={1 / 4}
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
          <Button
            type='submit'
            width={1 / 4}
            mt={3}
            mx={2}
          >
            Receive Component
          </Button>
        </Flex>
      </Form>
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
      <Form onSubmit={onOrder}>
        <Flex alignItems='center' justifyContent='space-between'>
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
              placeholder='0x..'
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
    </>
  )
}
