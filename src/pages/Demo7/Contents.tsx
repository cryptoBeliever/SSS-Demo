import React, { useState } from 'react'
import styled from '@emotion/styled'
import { NetworkType, PublicAccount } from 'symbol-sdk'
import { Button } from '@mui/material'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

function App() {
  const [account, setAccount] = useState<PublicAccount | null>(null)

  const login = () => {
    if (!window.SSS) {
      console.log('not installed')
    } else {
      console.log('installed', window.SSS.activePublicKey)
      const acc = PublicAccount.createFromPublicKey(
        window.SSS.activePublicKey,
        NetworkType.TEST_NET
      )
      setAccount(acc)
    }
  }

  return (
    <Root>
      {account ? (
        <Spacer>
          ログイン成功
          <Spacer>Address : {account.address.plain()}</Spacer>
          <Spacer>PublicKey : {account.publicKey}</Spacer>
        </Spacer>
      ) : (
        <Spacer>
          <Button onClick={login}>LOGIN</Button>
        </Spacer>
      )}
    </Root>
  )
}

export default App

const Root = styled('div')({
  margin: '13px',
  border: '4px solid #B429F9',
  padding: '16px',
  boxSizing: 'border-box',
})

const Spacer = styled('div')({
  margin: '16px',
})
