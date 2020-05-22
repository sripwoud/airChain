import { useState, useEffect } from 'react'
import { addresses, abis } from '@airChain/contracts'
import * as ethers from 'ethers'
import { useWeb3React } from '@web3-react/core'

export function useContract () {
  const context = useWeb3React()
  const { library } = context

  const [contract, setContract] = useState(null)
  useEffect(() => {
    if (library && library.provider) {
      // get signer (prototype methods) for loaded metamask account
      // see: https://docs.ethers.io/ethers.js/html/api-providers.html#jsonrpcprovider
      const signer = library.getSigner(0)

      // load contractWithSigner
      const contractWithSigner = new ethers.Contract(
        addresses.contract,
        abis.supplyChain.abi,
        signer
      )
      setContract(contractWithSigner)
    }
  }, [library])

  return contract
}
