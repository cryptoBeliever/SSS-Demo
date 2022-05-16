import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Slider,
  TextField,
} from '@mui/material'
import {
  Address,
  AggregateTransaction,
  Deadline,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicNonce,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
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

const epochAdjustment = 1615853185
const networkType = NetworkType.MAIN_NET
const node_url = 'https://sym-main.opening-line.jp:3001'

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
]

function App() {
  const [isRequest, setIsRequest] = useState<boolean>(false)

  const [isSupplyMutable, setIsSupplyMutable] = useState<boolean>(false)
  const [isTransferable, setIsTransferable] = useState<boolean>(false)
  const [isRestrictable, setIsRestrictable] = useState<boolean>(false)
  const [divisibility, setDivisibility] = useState<number>(0)
  const [delta, setDelta] = useState<number>(1000000)

  useEffect(() => {
    if (isRequest) {
      window.SSS.requestSign().then((signedTx: SignedTransaction) => {
        new TransactionHttp(node_url).announce(signedTx).subscribe(
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

  const submit = () => {
    const duration = UInt64.fromUint(0)

    const nonce = MosaicNonce.createRandom()
    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
      Deadline.create(epochAdjustment),
      nonce,
      MosaicId.createFromNonce(
        nonce,
        Address.createFromRawAddress(window.SSS.activeAddress)
      ),
      MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
      divisibility,
      duration,
      networkType
    )

    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
      Deadline.create(epochAdjustment),
      mosaicDefinitionTransaction.mosaicId,
      MosaicSupplyChangeAction.Increase,
      UInt64.fromUint(delta * Math.pow(10, divisibility)),
      networkType
    )

    const aggregateTransaction = AggregateTransaction.createComplete(
      Deadline.create(epochAdjustment),
      [
        mosaicDefinitionTransaction.toAggregate(
          PublicAccount.createFromPublicKey(
            window.SSS.activePublicKey,
            networkType
          )
        ),
        mosaicSupplyChangeTransaction.toAggregate(
          PublicAccount.createFromPublicKey(
            window.SSS.activePublicKey,
            networkType
          )
        ),
      ],
      networkType,
      [],
      UInt64.fromUint(100000)
    )

    window.SSS.setTransaction(aggregateTransaction)

    setIsRequest(true)
  }

  function valuetext(value: number) {
    return `${value}°C!`
  }

  return (
    <Root>
      <Spacer>
        <Flex>
          <FormControlLabel
            label="供給量の変更ができるか"
            control={
              <Checkbox onChange={() => setIsSupplyMutable((prev) => !prev)} />
            }
          />
        </Flex>
        <Flex>
          <FormControlLabel
            label="第三者へと譲渡できるか"
            control={
              <Checkbox onChange={() => setIsTransferable((prev) => !prev)} />
            }
          />
        </Flex>
        <Flex>
          <FormControlLabel
            label="モザイク制限"
            control={
              <Checkbox onChange={() => setIsRestrictable((prev) => !prev)} />
            }
          />
        </Flex>
        <Flex>可分性</Flex>
        <Flex>
          <Slider
            aria-label="Always visible"
            defaultValue={0}
            getAriaValueText={valuetext}
            step={1}
            min={0}
            max={6}
            marks={marks}
            onChange={(e: any) => setDivisibility(e.target.value)}
            valueLabelDisplay="auto"
          />
        </Flex>
        <Flex>
          <TextField
            fullWidth
            label="発行量"
            onChange={(e) => setDelta(Number(e.target.value))}
          />
        </Flex>
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

const Spacer = styled('div')({
  margin: '16px',
})

const Flex = styled('div')({
  display: 'flex',
  margin: '8px',
})
