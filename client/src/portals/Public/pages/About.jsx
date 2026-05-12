import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="font-mono text-xs text-muted tracking-widest mb-3">ABOUT</div>
      <h1 className="text-5xl font-bold tracking-tight mb-6">The driveway<br />marketplace.</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>ParkShare connects drivers who need short-term parking with homeowners who have unused driveway space. Think Airbnb, but for parking — by the hour, in Dhaka.</p>
        <p>We started with a simple observation: thousands of driveways sit empty every day while drivers circle the block looking for a spot. We built the bridge.</p>
        <p>Hosts list their driveways in under 5 minutes and earn passive income. Drivers search a map, book in 30 seconds, and pay only for the time they use. Everyone wins.</p>
      </div>
      <div className="mt-10 p-6 bg-paper2 rounded-2xl">
        <div className="font-mono text-xs text-muted tracking-widest mb-2">BUILT BY</div>
        <div className="font-bold text-lg">Group 05 — CSE482 Lab</div>
        <div className="text-muted text-sm mt-1">Tawsif Ahmed · Sowad Hossain · North South University</div>
      </div>
      <div className="mt-8">
        <Link to="/register" className="px-6 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 transition-colors inline-flex">
          Get started →
        </Link>
      </div>
    </div>
  )
}
