import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Grid, TextField, Typography } from '@mui/material'
import {
  Address,
  AggregateTransaction,
  Deadline,
  NetworkType,
  PlainMessage,
  PublicAccount,
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
  const [message, setMessage] = useState<string>('')
  const [address2, setAddress2] = useState<string>('')
  const [isRequest, setIsRequest] = useState<boolean>(false)

  useEffect(() => {
    if (isRequest) {
      console.log(window.SSS.requestSignWithCosignatories)
      window.SSS.requestSignWithCosignatories([]).then(
        (signedTx: SignedTransaction) => {
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
        }
      )
    }
  }, [isRequest])

  const handleChange = (state: string, setState: Dispatch<string>) => {
    setState(state)
  }

  const submit = () => {
    const publicKey = window.SSS.activePublicKey
    const acc = PublicAccount.createFromPublicKey(
      publicKey,
      NetworkType.TEST_NET
    )
    const tx1 = TransferTransaction.create(
      Deadline.create(1637848847),
      Address.createFromRawAddress(address),
      [],
      PlainMessage.create(message),
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )
    const tx2 = TransferTransaction.create(
      Deadline.create(1637848847),
      Address.createFromRawAddress(address2),
      [],
      PlainMessage.create(message),
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )

    const agtx = AggregateTransaction.createComplete(
      Deadline.create(1637848847),
      [tx1.toAggregate(acc), tx2.toAggregate(acc)],
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
          連署者を指定して署名を行う。requestSignWithCosignatoriesのサンプルです。
          signTransactionWithCosignatories で署名が行われます。
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
        <TextField
          fullWidth
          label="Address (2人目)"
          onChange={(e) => handleChange(e.target.value, setAddress2)}
        />
      </Spacer>
      <Spacer>
        <TextField
          fullWidth
          label="Message"
          onChange={(e) => handleChange(e.target.value, setMessage)}
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
