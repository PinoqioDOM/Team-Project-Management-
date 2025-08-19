import { Outlet } from 'react-router-dom'
import Headerr from './Headerr'
import Footer from './Footer'


const Layout = () => {
  return (
    <div>
      <Headerr />

      <Outlet />

      <Footer />
    </div>
  )
}

export default Layout