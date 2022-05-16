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
  TransactionGroup,
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
  const [isRequestSSS, setIsRequestSSS] = useState<boolean>(false)
  const [isAnnounce, setAnnounce] = useState<boolean>(false)
  const [signedAgtx, setSignedAgtx] = useState<SignedTransaction>(
    {} as SignedTransaction
  )

  useEffect(() => {
    if (isRequestSSS) {
      console.log('requestSignCosignatureTransaction')
      window.SSS.requestSignCosignatureTransaction().then(
        (signedTx: CosignatureSignedTransaction) => {
          console.log('signedtx', signedTx)
          transactionHttp.announceAggregateBondedCosignature(signedTx)
          setIsRequestSSS(false)
        }
      )
    }
  }, [isAnnounce, isRequestSSS])

  const submit = () => {
    const alicePub = PublicAccount.createFromPublicKey(
      '07D35713EA43995FF9E694075AB03BA4A4032823824154B9AD16A6E752496161',
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

    const agtx = AggregateTransaction.createBonded(
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
    setSignedAgtx(signedAgTx)
  }

  const submitHL = () => {
    const hashLockTransaction = HashLockTransaction.create(
      Deadline.create(1637848847),
      new Mosaic(
        new MosaicId('3A8416DB2D53B6C8'),
        UInt64.fromUint(10 * Math.pow(10, 6))
      ),
      UInt64.fromUint(480),
      signedAgtx,
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )
    const signedHlTx = bob.sign(hashLockTransaction, gh)

    const nodeUrl = 'https://sym-test.opening-line.jp:3001'
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl, {
      websocketUrl: 'wss://sym-test.opening-line.jp:3001/ws',
      websocketInjected: WebSocket,
    })
    const listener = repositoryFactory.createListener()
    const receiptHttp = repositoryFactory.createReceiptRepository()
    const transactionHttp = repositoryFactory.createTransactionRepository()
    const transactionService = new TransactionService(
      transactionHttp,
      receiptHttp
    )

    listener.open().then(() => {
      transactionService
        .announceHashLockAggregateBonded(signedHlTx, signedAgtx, listener)
        .subscribe(
          (x) => console.log('s', x),
          (err) => console.log('f', err),
          () => listener.close()
        )
    })
  }

  const submitSSS = () => {
    transactionHttp
      .getTransaction(signedAgtx.hash, TransactionGroup.Partial)
      .subscribe((tx) => {
        console.log('sbmt tx', tx)

        window.SSS.setTransaction(tx)
        window.SSS.requestSignCosignatureTransaction().then(
          (signedTx: CosignatureSignedTransaction) => {
            console.log('signedtx', signedTx)
            transactionHttp
              .announceAggregateBondedCosignature(signedTx)
              .subscribe((x) => console.log(x))
          }
        )
      })
  }

  const announce = () => {
    setAnnounce(true)
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
          <Button variant="outlined" onClick={submitHL} sx={{ margin: '8px' }}>
            HashLock
          </Button>
          <Button variant="outlined" onClick={submitSSS} sx={{ margin: '8px' }}>
            SSS
          </Button>
          <Button variant="outlined" onClick={announce} sx={{ margin: '8px' }}>
            announce
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
