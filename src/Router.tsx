import React from 'react'
import { Routes, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import Demo0 from './pages/Demo0'
import Demo1 from './pages/Demo1'
import Demo2 from './pages/Demo2'
import Demo3 from './pages/Demo3'
import Demo4 from './pages/Demo4'
import Demo5 from './pages/Demo5'
import Demo6 from './pages/Demo6'
import Demo7 from './pages/Demo7'

const Router: React.VFC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo0" element={<Demo0 />} />
        <Route path="/demo1" element={<Demo1 />} />
        <Route path="/demo2" element={<Demo2 />} />
        <Route path="/demo3" element={<Demo3 />} />
        <Route path="/demo4" element={<Demo4 />} />
        <Route path="/demo5" element={<Demo5 />} />
        <Route path="/demo6" element={<Demo6 />} />
        <Route path="/demo7" element={<Demo7 />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router
