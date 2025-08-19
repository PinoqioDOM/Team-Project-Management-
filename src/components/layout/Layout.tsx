import { Outlet } from 'react-router-dom'
import Headerr from './Headerr'
import Footer from './Footer'


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Headerr />

      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;