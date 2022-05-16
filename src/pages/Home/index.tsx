import styled from '@emotion/styled'
import { Divider, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const App = () => {
  const navi = useNavigate()

  useEffect(() => {
    console.log('home')
  }, [])
  return (
    <Root>
      <Center>
        <Typography variant="h2">SSS Extension DEMO List</Typography>
      </Center>
      <Link onClick={() => navi('/demo0')}>0. SSSを有効にする</Link>
      <Link onClick={() => navi('/demo1')}>1. メッセージを送る</Link>
      <Link onClick={() => navi('/demo2')}>2. xymを送る</Link>
      <Link onClick={() => navi('/demo3')}>3. モザイクを送る</Link>
      <Link onClick={() => navi('/demo4')}>4. ネームスペース宛に送信する</Link>
      <Link onClick={() => navi('/demo5')}>5. 2人に一斉送信する</Link>
      <Link onClick={() => navi('/demo6')}>6. 連署者と署名を行う</Link>
      <Link onClick={() => navi('/demo7')}>7. SSSを用いてログインする</Link>
      <Link onClick={() => navi('/demo8')}>
        8. モザイクをネームスペースで指定して送る
      </Link>
      <Space>
        <Divider />
      </Space>
      <Center>
        <Typography variant="h2">SSS Extension Main Net Tools</Typography>
      </Center>
      <Link onClick={() => navi('/main1')}>1. モザイクの作成</Link>
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

const Space = styled('div')({
  marginTop: '40px',
  marginBottom: '40px',
})
