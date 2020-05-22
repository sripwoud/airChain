import React, { useEffect } from 'react'
import { Heading, Flex, Image, Button, Box } from 'rimble-ui'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import ConnectionBanner from '@rimble/connection-banner'
// import { NetworkIndicator } from '@rimble/NetworkIndicator'

import Flash from './Flash'
import logo from '../ethereumLogo.png'
import { addresses } from '@airChain/contracts'

const { accounts } = addresses

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
})

const { ethereum } = window

export default () => {
  const changeForm = useStoreActions(actions => actions.form.changeForm)
  const toggle = useStoreActions(actions => actions.modal.toggle)
  const activeForm = useStoreState(state => state.form.name)

  const forms = ['customer', 'supplier', 'manufacturer', 'transporter']

  const context = useWeb3React()
  const {
    account,
    chainId,
    activate,
    // deactivate,
    active,
    error
  } = context

  if (ethereum && ethereum.on && !active && !error) {
    activate(injected)
  }

  useEffect(() => {
    if (ethereum && ethereum.on && !active && !error) {
      const handleChainChanged = chainId => {
        activate(injected)
      }

      const handleAccountsChanged = accounts => {
        if (accounts.length > 0) {
          activate(injected)
        }
      }

      const handleNetworkChanged = networkId => {
        activate(injected)
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }

    return () => {}
  }, [active, error, activate])

  return (
    <>
      <Flex justifyContent='flex-end' alignItems='center' mt={1}>
        <Flex flexGrow={4} alignItems='center'>
          <Image
            src={logo}
            alt='Logo'
            height={['30px', '40px', '50px']}
            ml={3}
            mr={[3, 5, 5]}
          />
          <Box display='block'>
            <Heading
              fontSize={[3, 4, 6]}
              my={1}
            >
              AirChain
            </Heading>
            <Button.Text onClick={toggle}>Infos</Button.Text>
          </Box>
        </Flex>
        <Flex
          flexWrap={['wrap', 'nowrap']}
          flexDirection={['column', 'row']}
        >
          {forms.map((form, index) => (
            <Button.Outline
              key={index}
              mx={1}
              size='small'
              onClick={() => changeForm(form)}
            >
              {form.slice(0, 1).toUpperCase() + form.slice(1)}
            </Button.Outline>
          ))}
        </Flex>
      </Flex>
      <ConnectionBanner
        currentNetwork={chainId}
        requiredNetwork={4}
      />
      {account !== accounts[activeForm].pubKey ? <Flash /> : null}
    </>
  )
}
