import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Contents from './Contents'

// import Contents from './Contents'
const App = () => {
  const codeString = `import React, { Dispatch, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Chip, Grid, TextField, Typography } from '@mui/material'
import {
  Address,
  Deadline,
  Mosaic,
  MosaicId,
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
  const [mosaics, setMosaics] = useState<Mosaic[]>([])
  const [mosaicId, setMosaicId] = useState<string>('')
  const [isRequest, setIsRequest] = useState<boolean>(false)

  useEffect(() => {
    if (isRequest) {
      window.SSS.requestSign().then((signedTx: SignedTransaction) => {
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
    const tx = TransferTransaction.create(
      Deadline.create(1637848847),
      Address.createFromRawAddress(address),
      mosaics,
      PlainMessage.create('send mosaics'),
      NetworkType.TEST_NET,
      UInt64.fromUint(2000000)
    )

    window.SSS.setTransaction(tx)

    setIsRequest(true)
  }

  const addMosaic = () => {
    console.log('id')
    setMosaics([
      ...mosaics,
      new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(1)),
    ])
    setMosaicId('')
  }
  return (
    <Root>
      <Header>
        <Typography variant="h4">SSS Extension DEMO</Typography>
        <Typography variant="subtitle2">
          複数のモザイクを送ることができます。1モザイク送信します。
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
          label="MosaicID"
          onChange={(e) => handleChange(e.target.value, setMosaicId)}
        />
      </Spacer>
      <Spacer>
        <Flex>
          <Grid sx={{ flexGrow: 1 }} />
          <Button variant="outlined" onClick={addMosaic} sx={{ margin: '8px' }}>
            モザイクを追加
          </Button>
          <Button variant="outlined" onClick={submit} sx={{ margin: '8px' }}>
            SSSで署名
          </Button>
        </Flex>
      </Spacer>
      <Spacer>
        {mosaics.map((m) => {
          return (
            <span key={m.id.toHex()}>
              <Chip label={m.id.toHex()} />
            </span>
          )
        })}
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

  `
  return (
    <>
      <Wrapper>
        <Contents />
      </Wrapper>
      <Wrapper>
        <Program>
          <Typography variant="h4">Demo Program</Typography>
          <SyntaxHighlighter language="typescript" style={style}>
            {codeString}
          </SyntaxHighlighter>
        </Program>
      </Wrapper>
    </>
  )
}

export default App

const Wrapper = styled('div')({
  margin: '16px',
})

const Program = styled('div')({
  marginTop: '80px',
})
