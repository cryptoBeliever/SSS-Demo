import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

// import Contents from './Contents'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

const App = () => {
  const navi = useNavigate()
  const [installed, setInstalled] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      if (!window.SSS) {
        console.log('not installed')
        setInstalled(false)
      } else {
        console.log('installed')
      }
    }, 100)
  }, [])
  return (
    <Root>
      <Center>
        <Typography variant="h2">SSS Extension DEMO List</Typography>
      </Center>
      {!installed && (
        <Right>
          <a
            href="https://chrome.google.com/webstore/detail/sss-extension/llildiojemakefgnhhkmiiffonembcan"
            target="_blank"
            rel="noreferrer">
            SSS Extensionをインストールする
          </a>
        </Right>
      )}
      <Link onClick={() => navi('/demo0')}>SSSのインストール確認</Link>
      <Link onClick={() => navi('/demo1')}>メッセージを送る</Link>
      <Link onClick={() => navi('/demo2')}>xymを送る</Link>
      <Link onClick={() => navi('/demo3')}>モザイクを送る</Link>
      <Link onClick={() => navi('/demo4')}>ネームスペースで送る</Link>
    </Root>
  )
}

export default App

const Link = styled('div')({
  margin: '8px',
  padding: '8px',
  color: 'purple',
  fontSize: '32px',
  cursor: 'pointer',
  background: '#fafafa',
})

const Root = styled('div')({
  margin: '80px',
})

const Center = styled('div')({
  display: 'flex',
  justifyContent: 'center',
})
const Right = styled('div')({
  display: 'flex',
  justifyContent: 'end',
})
