import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import Login from './Login'
import Home from './Home'
import RootLayout from './RootLayout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='home' element={<Home />} />
      <Route index element={<Login />} />
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App