import React from 'react'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Contents from './Contents'

// import Contents from './Contents'
const App = () => {
  const codeString = `import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

function App() {
  const [installed, setInstalled] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      if (!window.SSS) {
        console.log('not installed')
        setInstalled(false)
      } else {
        console.log('installed')
      }
    }, 100) // SSSのプログラムがwindowに挿入されるよりも後に実行するために遅らせる
  }, [])

  return (
    <Root>
      {installed ? (
        <Spacer>Install済みです。ありがとうございます。</Spacer>
      ) : (
        <Spacer>
          Installしていません。下記リンクからインストールしてください。
          <a
            href="https://chrome.google.com/webstore/detail/sss-extension/llildiojemakefgnhhkmiiffonembcan"
            target="_blank"
            rel="noreferrer">
            SSS Extensionをインストールする
          </a>
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
