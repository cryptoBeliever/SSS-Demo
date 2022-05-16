import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Grid, TextField, Typography } from '@mui/material'
import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  Mosaic,
  NamespaceId,
  NetworkType,
  PlainMessage,
  SignedTransaction,
  TransactionHttp,
  TransferTransaction,
  UInt64,
} from 'symbol-sdk'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

function App() {
  const [address, setAddress] = useState<string>('')
  const [nameSpace, setNameSpace] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isRequest, setIsRequest] = useState<boolean>(false)

  useEffect(() => {
    if (isRequest) {
      window.SSS.requestSignEncription().then((message: EncryptedMessage) => {
        console.log('resolve', message)

        const acc = Account.createFromPrivateKey(
          '891D9D7E9672925123CFB7766CE9AC740BAFED43AE78F64CE2D296F54E62E57A',
          NetworkType.TEST_NET
        )

        const dec = acc.decryptMessage(message, acc.publicAccount)
        console.log('dec', dec)
      })
    }
  }, [isRequest])

  const handleChange = (state: string, setState: Dispatch<string>) => {
    setState(state)
  }

  const submit = () => {
    window.SSS.setMessage('message', window.SSS.activePublicKey)
    setIsRequest(true)
  }

  return (
    <Root>
      <Spacer>
        <Flex>
          <Grid sx={{ flexGrow: 1 }} />
          <Button variant="outlined" onClick={submit} sx={{ margin: '8px' }}>
            SSSで署名
          </Button>
        </Flex>
      </Spacer>
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

const Header = styled('div')({
  marginBottom: '40px',
})
const Spacer = styled('div')({
  margin: '16px',
})

const Flex = styled('div')({
  display: 'flex',
})
