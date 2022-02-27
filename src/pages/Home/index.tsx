import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router'

const App = () => {
  const navi = useNavigate()
  return (
    <Root>
      <Center>
        <Typography variant="h2">SSS Extension DEMO List</Typography>
      </Center>
      <Link onClick={() => navi('/demo0')}>0. SSSを有効にする</Link>
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
