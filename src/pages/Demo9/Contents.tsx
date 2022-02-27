import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Grid, TextField, Typography } from '@mui/material'
import {
  AccountMetadataTransaction,
  Address,
  AggregateTransaction,
  Deadline,
  KeyGenerator,
  NetworkType,
  PublicAccount,
  SignedTransaction,
  TransactionHttp,
  UInt64,
} from 'symbol-sdk'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

function App() {
  const [address, setAddress] = useState<string>('')
  const [isRequest, setIsRequest] = useState<boolean>(false)

  useEffect(() => {
    if (isRequest) {
      window.SSS.requestSign().then((signedTx: SignedTransaction) => {
        console.log('signedtx', signedTx)
        new TransactionHttp('https://sym-test.opening-line.jp:3001')
          .announce(signedTx)
          .subscribe(
            (x) => {
              console.log('x', x)
              setIsRequest(false)
            },
            (err) => {
              console.error(err)
              setIsRequest(false)
            }
          )
      })
    }
  }, [isRequest])

  const handleChange = (state: string, setState: Dispatch<string>) => {
    setState(state)
  }

  const submit = () => {
    const key = KeyGenerator.generateUInt64Key('TEST')
    const value = 'aaa'
    const tx = AccountMetadataTransaction.create(
      Deadline.create(1637848847),
      Address.createFromRawAddress(address),
      key,
      value.length,
      value,
      NetworkType.TEST_NET
    )

    const agtx = AggregateTransaction.createComplete(
      Deadline.create(1637848847),
      [
        tx.toAggregate(
          PublicAccount.createFromPublicKey(
            window.SSS.activePublicKey,
            NetworkType.TEST_NET
          )
        ),
      ],
      NetworkType.TEST_NET,
      [],
      UInt64.fromUint(2000000)
    )

    window.SSS.setTransaction(agtx)

    setIsRequest(true)
  }

  return (
    <Root>
      <Header>
        <Typography variant="h4">SSS Extension DEMO</Typography>
        <Typography variant="subtitle2">
          ネームスペース指定でメッセージを送れます。
        </Typography>
      </Header>
      <Spacer>
        <TextField
          fullWidth
          label="Address"
          onChange={(e) => handleChange(e.target.value, setAddress)}
        />
      </Spacer>
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
