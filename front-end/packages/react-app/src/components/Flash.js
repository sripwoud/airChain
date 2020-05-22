import React from 'react'
import { Flash, Link } from 'rimble-ui'
import { useStoreState } from 'easy-peasy'

import { addresses } from '@airChain/contracts'

const { accounts } = addresses

export default () => {
  const form = useStoreState(state => state.form.name)

  return (
    <Flash mt={2} variant='danger'>
      You haven't loaded the {form}'s address in
      <Link
        pl={2}
        href='https://metamask.io/'
        target='_blank'
      >
        Metamask
      </Link>.<br />
    Any actions you'll try will fail! (You can still check assets' status)<br />
      Import the {form}'s account in Metamask using this private key:<br />
      {accounts[form].privateKey}
    </Flash>
  )
}
