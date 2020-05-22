import React, { useState } from 'react'
import {
  Button,
  Field,
  Flex,
  Form,
  Heading,
  Input,
  Box
} from 'rimble-ui'

import { useContract } from '../hooks'
import { STATES } from '../constants'

export default () => {
  const contract = useContract()
  // console.log(contract)
  const [id, setId] = useState('')
  const [asset, setAsset] = useState('ac')
  const [content, setContent] = useState('')

  // get only named Keys
  const getData = obj => {
    const data = {}
    for (const key in obj) {
      if (isNaN(parseInt(key))) {
        data[key] = obj[key]
      }
    }
    data.state = STATES[data.state]
    // convert hex to decimals numbers
    for (const key in data) {
      if (data[key].hasOwnProperty('_hex')) {
        data[key] = parseInt(data[key]._hex, 16)
      }
    }
    return JSON.stringify(data, undefined, 2)
  }

  const onCheck = async event => {
    event.preventDefault()
    let result
    switch (asset) {
      case 'ac':
        result = await contract.fetchAircraft(id)
        break
      case 'eq':
        result = await contract.fetchEquipment(id)
        break
      case 'comp':
        result = await contract.fetchComponent(id)
    }
    setContent(getData(result))
  }
  return (
    <>
      <Heading fontSize={['20px', '25px', '32px']}>
        Check status
      </Heading>
      <Form onSubmit={onCheck}>
        <Flex>
          <Field
            label='MSN or ID #'
            width={1 / 3}
            mx={2}
          >
            <Input
              value={id}
              type='number'
              width={1}
              required
              onChange={event => setId(event.target.value)}
            />
          </Field>
          <Field
            label='Asset'
            width={1 / 3}
            mx={2}
          >
            <select
              required
              style={{
                fontSize: '1rem',
                backgroundColor: '#fff',
                height: '3rem',
                border: '1px solid transparent',
                borderColor: '#ccc',
                borderRadius: '4px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '5px'
              }}
              onChange={e => setAsset(e.target.value)}
            >
              <option value='ac'>Aircraft</option>
              <option value='eq'>Equipment</option>
              <option value='comp'>Component</option>
            </select>
          </Field>
          <Button
            type='submit'
            width={1 / 3}
            mt='25px'
            mx={2}
          >
          Check
          </Button>
        </Flex>
      </Form>
      <Box textAlign='left' mx={4}>
        <pre><code>{content}</code></pre>
      </Box>
    </>

  )
}
