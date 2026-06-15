import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingSocial from '../components/FloatingSocial';
import BackToTop from '../components/BackToTop';

function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingSocial />
      <BackToTop />
    </div>
  );
}

export default Layout;