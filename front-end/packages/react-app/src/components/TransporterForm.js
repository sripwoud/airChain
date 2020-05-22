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
import Toast from '../components/Toast'

export default props => {
  const contract = useContract()
  const [equipmentId, setEquipmentId] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastState, setToastState] = useState('loading')

  const onSubmit = async event => {
    event.preventDefault()
    setShowToast(true)
    setToastState('loading')
    try {
      const tx = await contract.transportEquipment(
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
      {showToast ? <Toast state={toastState} /> : null}
    </>
  )
}
