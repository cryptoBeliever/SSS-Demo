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
  SSS: object
  requestSSS: () => void
  isAllowedSSS: () => boolean
}
declare const window: SSSWindow

type State = 'ACTIVE' | 'INACTIVE' | 'NONE' | 'LOADING'

function App() {
  const [state, setState] = useState<State>('LOADING')
  useEffect(() => {
    setTimeout(() => {
      try {
        if (window.isAllowedSSS()) {
          setState('ACTIVE')
        } else {
          setState('INACTIVE')
        }
      } catch (e) {
        console.error(e)
        setState('NONE')
      }
    }, 200) // SSSのプログラムがwindowに挿入されるよりも後に実行するために遅らせる
  }, [])

  if (state === 'LOADING') {
    return <Root>Now Loading...</Root>
  }

  if (state === 'NONE') {
    return (
      <Root>
        <Spacer>
          SSSがinstallされていません。
          <a
            href="https://chrome.google.com/webstore/detail/sss-extension/llildiojemakefgnhhkmiiffonembcan"
            target="_blank"
            rel="noreferrer">
            SSS Extensionをinstallする
          </a>
        </Spacer>
      </Root>
    )
  }

  if (state === 'INACTIVE') {
    return (
      <Root>
        <Spacer>SSSが有効になっていません。</Spacer>
      </Root>
    )
  }

  return (
    <Root>
      <Spacer>SSSが有効になっています。Let's enjoy Symbol with SSS!</Spacer>
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
