import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import React from 'react'
import Contents from './Contents'

// import Contents from './Contents'
const App = () => {
  return (
    <>
      <Wrapper>
        <Contents />
      </Wrapper>
    </>
  )
}

export default App

const Wrapper = styled('div')({
  margin: '16px',
})
