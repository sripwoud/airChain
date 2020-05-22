import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import './index.css'
import App from './App'
import { StoreProvider } from 'easy-peasy'
import { Web3ReactProvider } from '@web3-react/core'
import * as ethers from 'ethers'

import store from './store'

// You should replace this uri with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app'
})

function getLibrary (provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 8000
  return library
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <StoreProvider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </StoreProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
