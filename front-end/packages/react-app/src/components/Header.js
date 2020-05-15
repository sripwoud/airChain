import React from 'react'
import { Heading, Flex, Image, Button } from 'rimble-ui'
import { useStoreActions } from 'easy-peasy'

import logo from '../ethereumLogo.png'

export default () => {
  const changeForm = useStoreActions(actions => actions.changeForm)
  return (
    <Flex justifyContent='flex-end' alignItems='center'>
      <Flex flexGrow={4} alignItems='center'>
        <Image
          src={logo}
          alt='Logo'
          height={['30px', '40px', '50px']}
          ml={3}
          mr={[3, 5, 5]}
        />
        <Heading fontSize={[3, 4, 6]}>AirChain</Heading>
      </Flex>
      <Button.Outline
        mx={1}
        onClick={() => changeForm('customer')}
        size='small'
      >
        Customer
      </Button.Outline>
      <Button.Outline
        mx={1}
        onClick={() => changeForm('supplier')}
        size='small'
      >
        Supplier
      </Button.Outline>
      <Button.Outline
        mx={1}
        onClick={() => changeForm('manufacturer')}
        size='small'
      >
        Manufacturer
      </Button.Outline>
      <Button.Outline
        mx={1}
        onClick={() => changeForm('transporter')}
        size='small'
      >
        Transporter
      </Button.Outline>
    </Flex>
  )
}
