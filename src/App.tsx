import { Outlet } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import { DesktopFooter } from './components/Footer/DesktopFooter'
import { MobileNav } from './components/Navbar/MobileNav'

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>

      <DesktopFooter />
      <MobileNav />
    </div>
  )
}

export default App
