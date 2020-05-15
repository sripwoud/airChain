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

  const onSubmit = async event => {
    event.preventDefault()
  }

  return (
    <>
      <Heading.h2>Transporter actions</Heading.h2>
      <Form onSubmit={onSubmit}>
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
          <Button
            type='submit'
            width={1 / 2}
            mt={3}
            mx={2}
          >
            Transport Equipment
          </Button>
        </Flex>
      </Form>
    </>
  )
}
