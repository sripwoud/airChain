import React from 'react'
import { Heading, Flex, Image, Button } from 'rimble-ui'

import logo from '../ethereumLogo.png'

export default () => {
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
      <Button mx={1}>Customer</Button>
      <Button mx={1}>Manufacturer</Button>
      <Button mx={1}>Transporter</Button>
      <Button mx={1}>Supplier</Button>
    </Flex>
  )
}
