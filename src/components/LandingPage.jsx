import Navbar from "./Navbar"
import Hero from "./Hero"
import Footer from "./Footer"

export default function LandingPage({ onNavigateToAuth }) {
  return (
    <div className="h-screen bg-[#F7F4ED] flex flex-col overflow-hidden">
      <Navbar onNavigateToAuth={onNavigateToAuth} />
      <main className="flex-1 flex">
        <Hero onNavigateToAuth={onNavigateToAuth} />
      </main>
      <Footer />
    </div>
  )
}
