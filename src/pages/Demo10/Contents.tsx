import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Grid, TextField, Typography } from '@mui/material'
import {
  Account,
  Address,
  AggregateTransaction,
  CosignatureSignedTransaction,
  CosignatureTransaction,
  Deadline,
  HashLockTransaction,
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage,
  PublicAccount,
  RepositoryFactoryHttp,
  SignedTransaction,
  Transaction,
  TransactionGroup,
  TransactionHttp,
  TransactionMapping,
  TransactionService,
  TransferTransaction,
  UInt64,
} from 'symbol-sdk'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

const bob = Account.createFromPrivateKey(
  '891D9D7E9672925123CFB7766CE9AC740BAFED43AE78F64CE2D296F54E62E57A',
  NetworkType.TEST_NET
)

const gh = '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836'

const NODE_URL = 'https://sym-test.opening-line.jp:3001'
const repositoryFactory = new RepositoryFactoryHttp(NODE_URL)
const transactionHttp = repositoryFactory.createTransactionRepository()

function App() {
  const [isRequest, setIsRequest] = useState<boolean>(false)
  const [payload, setPayload] = useState('')
  const [hash, setHash] = useState('')

  useEffect(() => {
    if (isRequest) {
      console.log('requestSignCosignatureTransaction')
      window.SSS.requestSignCosignatureTransaction().then(
        (cosignedTx: CosignatureSignedTransaction) => {
          console.log('signedtx', cosignedTx)
          const cosigTxs = [
            new CosignatureSignedTransaction(
              cosignedTx.parentHash,
              cosignedTx.signature,
              cosignedTx.signerPublicKey
            ),
          ]
          const recreatedSignedTx =
            TransactionMapping.createFromPayload(payload)

          const agtxPayload =
            payload +
            cosigTxs.map(
              (tx) => tx.version.toHex() + tx.signerPublicKey + tx.signature
            )
          const size = `00000000${(agtxPayload.length / 2).toString(16)}`
          const formatedSize = size.substr(size.length - 8, size.length)
          const littleEndianSize =
            formatedSize.substr(6, 2) +
            formatedSize.substr(4, 2) +
            formatedSize.substr(2, 2) +
            formatedSize.substr(0, 2)

          const signedPayload =
            littleEndianSize + agtxPayload.substr(8, agtxPayload.length - 8)
          const signedTx = new SignedTransaction(
            signedPayload,
            hash,
            window.SSS.activePublicKey,
            recreatedSignedTx.type,
            recreatedSignedTx.networkType
          )

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
  }, [hash, isRequest, payload])

  const submit = () => {
    const alicePub = PublicAccount.createFromPublicKey(
      window.SSS.activePublicKey,
      NetworkType.TEST_NET
    )

    const bobToAliceTx = TransferTransaction.create(
      Deadline.create(1637848847),
      alicePub.address,
      [],
      PlainMessage.create('test 1'),
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )

    const aliceToBobTx = TransferTransaction.create(
      Deadline.create(1637848847),
      bob.address,
      [],
      PlainMessage.create('test 2'),
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )

    const agtx = AggregateTransaction.createComplete(
      Deadline.create(1637848847),
      [
        bobToAliceTx.toAggregate(bob.publicAccount),
        aliceToBobTx.toAggregate(alicePub),
      ],
      NetworkType.TEST_NET,
      [],
      UInt64.fromUint(2000000)
    )

    const signedAgTx = bob.sign(agtx, gh)
    setPayload(signedAgTx.payload)
    setHash(signedAgTx.hash)
    window.SSS.setTransactionByPayload(signedAgTx.payload)
    setIsRequest(true)
  }

  return (
    <Root>
      <Header>
        <Typography variant="h4">SSS Extension DEMO</Typography>
        <Typography variant="subtitle2">アグボン</Typography>
      </Header>
      <Spacer>
        <Flex>
          <Grid sx={{ flexGrow: 1 }} />
          <Button variant="outlined" onClick={submit} sx={{ margin: '8px' }}>
            エスクロー
          </Button>
          {/* <Button variant="outlined" onClick={submitSSS} sx={{ margin: '8px' }}>
            SSS
          </Button> */}
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
