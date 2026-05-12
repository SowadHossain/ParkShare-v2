import { Link } from 'react-router-dom'

const driverSteps = [
  { n: '01', t: 'Create an account', s: 'Sign up as a driver. It takes about 30 seconds.' },
  { n: '02', t: 'Search the map', s: 'See available driveways near your destination. Filter by price, vehicle size, and coverage.' },
  { n: '03', t: 'Pick your time', s: 'Choose start and end time. We calculate the total cost upfront — no surprise fees.' },
  { n: '04', t: 'Pay with Stripe', s: 'Secure payment in test mode. We support all major cards.' },
  { n: '05', t: 'Park & go', s: 'Get access instructions from the host. Your spot is reserved.' },
  { n: '06', t: 'Leave a review', s: 'Help the community by rating your experience after your session.' },
]

const hostSteps = [
  { n: '01', t: 'List your driveway', s: 'Set your location, availability hours, vehicle size, and hourly rate.' },
  { n: '02', t: 'Drivers book you', s: 'Get notified when someone books. No action needed — it\'s automatic.' },
  { n: '03', t: 'They pay, you earn', s: 'Stripe handles payment. 85% goes to you after the platform fee.' },
  { n: '04', t: 'Track earnings', s: 'See all bookings and payouts from your host dashboard.' },
]

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="font-mono text-xs text-muted tracking-widest mb-3">HOW IT WORKS</div>
      <h1 className="text-5xl font-bold tracking-tight mb-4">Simple by design.</h1>
      <p className="text-muted text-lg leading-relaxed mb-16">Whether you need a spot or have one to share, ParkShare gets you there in minutes.</p>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">For drivers</h2>
        <div className="space-y-4">
          {driverSteps.map(s => (
            <div key={s.n} className="flex gap-5 items-start p-5 bg-white border border-black/10 rounded-2xl">
              <div className="font-mono text-2xl font-bold text-lime leading-none flex-shrink-0 w-12">{s.n}</div>
              <div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-muted text-sm mt-1 leading-relaxed">{s.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/register?role=driver" className="px-6 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm inline-flex hover:bg-ink/90 transition-colors">
            Find parking →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">For hosts</h2>
        <div className="space-y-4">
          {hostSteps.map(s => (
            <div key={s.n} className="flex gap-5 items-start p-5 bg-lime border border-lime rounded-2xl">
              <div className="font-mono text-2xl font-bold text-ink leading-none flex-shrink-0 w-12">{s.n}</div>
              <div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-ink/60 text-sm mt-1 leading-relaxed">{s.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/register?role=host" className="px-6 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm inline-flex hover:bg-ink/90 transition-colors">
            List your driveway →
          </Link>
        </div>
      </section>
    </div>
  )
}
