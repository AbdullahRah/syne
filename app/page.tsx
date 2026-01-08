import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { SyneHero } from "@/components/SyneHero"
import { AudienceSplit } from "@/components/AudienceSplit"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <PortfolioNavbar />
      <SyneHero />
      <AudienceSplit />
      <Footer />
    </div>
  )
}
