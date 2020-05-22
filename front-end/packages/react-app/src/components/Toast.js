import React from 'react'
import { ToastMessage } from 'rimble-ui'

export default ({ state }) => {
  if (state === 'loading') {
    return (
      <ToastMessage.Processing
        mx={2}
        mb={2}
        message='Transaction processing...'
      />
    )
  } else if (state === 'success') {
    return (
      <ToastMessage.Success
        mx={2}
        mb={2}
        message='Transaction success'
      />
    )
  } else {
    return (
      <ToastMessage.Failure
        mx={2}
        mb={2}
        message='Transaction failed'
      />
    )
  }
}
