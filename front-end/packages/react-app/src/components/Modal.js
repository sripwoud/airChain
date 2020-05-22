import {
  Box,
  Modal,
  Button,
  Card,
  Text,
  Heading,
  // EthAddress,
  Link
} from 'rimble-ui'
import React from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'

import { addresses } from '@airChain/contracts'

const { accounts } = addresses

export default props => {
  const showModal = useStoreState(state => state.modal.show)

  const toggleModal = useStoreActions(actions => actions.modal.toggle)

  return (
    <>
      <Modal isOpen={showModal}>
        <Card width={['350px', '500px', '800px']} p={0}>
          <Button.Text
            icononly
            icon='Close'
            color='moon-gray'
            position='absolute'
            top={0}
            right={0}
            mt={1}
            mr={1}
            onClick={toggleModal}
          />
          <Box p={4} mb={3}>
            <Text fontSize={['12px', '14px', '16px']}>
              This Dapp is deployed on the Rinkeby network.
              The ETH you will use aren't worth anything.
              Some test accounts with specific roles are already predefined.<br />
            Import them in
              <Link
                px={2}
                href='https://metamask.io/'
                target='_blank'
              >
                Metamask
              </Link>
              using the following private keys in order to use the Dapp:
            </Text>
            {Object.values(accounts).map(({ name, pubKey, privateKey }, index) => (
              <Box key={index}>
                <Heading my={1} fontSize={['14px', '20px', '26px']}>
                  {name}
                </Heading>
                {/* <EthAddress address={pubKey} /> */}
                <Text
                  fontSize={['12px', '14px', '16px']}
                  style={{
                    wordWrap: 'break-word',
                    margin: '5px 0 0 0'
                  }}
                >
                Private Key: {privateKey}
                </Text>
              </Box>
            ))}
          </Box>
        </Card>
      </Modal>
    </>
  )
}
