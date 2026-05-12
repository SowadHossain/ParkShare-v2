import { Link } from 'react-router-dom'

const stats = [
  ['412', 'active spots'],
  ['$2.40', 'avg / hour'],
  ['4.8 ★', 'host rating'],
]

const steps = [
  { n: '01', t: 'Search the map', s: 'See real driveways near your destination. Filter by price, size, and coverage.' },
  { n: '02', t: 'Pick your time', s: 'Choose start and end. We calculate the total upfront — no surprises.' },
  { n: '03', t: 'Park & go', s: 'Pay with Stripe. Get access instructions. Your spot is reserved.' },
]

const hostStats = [
  ['~$160', '/mo avg'],
  ['9 AM – 5 PM', 'typical window'],
  ['~14', 'bookings/mo'],
  ['3–5 min', 'to list'],
]

export default function Home() {
  return (
    <div className="bg-ink text-paper min-h-screen">
      {/* Hero */}
      <section className="px-8 md:px-14 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="font-mono text-xs text-lime tracking-widest mb-4">● LIVE IN DHAKA · GULSHAN · BANANI · DHANMONDI</div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.98] tracking-[-0.04em]">
            Park in someone's<br />
            <span className="text-lime">driveway.</span> By<br />
            the hour. For less.
          </h1>
          <p className="text-paper/65 text-lg mt-5 leading-relaxed max-w-lg">
            ParkShare is a residential driveway marketplace. Find unused space near you, book in 30 seconds, and pay only for the time you need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <Link to="/register?role=driver" className="px-6 py-3.5 bg-lime text-ink rounded-full font-semibold hover:opacity-90 transition-opacity">
              Find parking →
            </Link>
            <Link to="/register?role=host" className="px-6 py-3.5 border border-paper/20 text-paper rounded-full font-medium hover:border-paper/40 transition-colors">
              I have a driveway
            </Link>
          </div>
          <div className="mt-10 flex gap-10">
            {stats.map(([v, l]) => (
              <div key={l}>
                <div className="font-mono text-3xl font-bold">{v}</div>
                <div className="font-mono text-[11px] text-paper/50 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map visual */}
        <div className="relative h-96 md:h-[520px] rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2B3826 0%, #6E8050 60%, #B8C098 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 28px, rgba(0,0,0,0.05) 28px 56px)' }} />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 520" preserveAspectRatio="none">
            <path d="M-20 220 Q200 200 320 280 T620 320" stroke="rgba(246,244,238,0.18)" strokeWidth="32" fill="none" />
            <path d="M-20 220 Q200 200 320 280 T620 320" stroke="rgba(246,244,238,0.4)" strokeWidth="2" strokeDasharray="10 14" fill="none" />
            <path d="M180 -20 Q220 200 280 360 T380 540" stroke="rgba(246,244,238,0.18)" strokeWidth="28" fill="none" />
          </svg>
          {[{ l: 110, t: 130, p: '$3' }, { l: 290, t: 80, p: '$4' }, { l: 230, t: 250, p: '$2', hi: true }, { l: 410, t: 190, p: '$5' }, { l: 380, t: 360, p: '$3' }, { l: 150, t: 400, p: '$2' }].map((pin, i) => (
            <div key={i} style={{ position: 'absolute', left: pin.l, top: pin.t }} className={`px-3 py-1.5 rounded-full text-sm font-mono font-bold shadow-lg ${pin.hi ? 'bg-lime text-ink ring-2 ring-ink' : 'bg-paper text-ink'}`}>
              {pin.p}
            </div>
          ))}
          <div className="absolute" style={{ left: 252, top: 192, width: 26, height: 26, borderRadius: '50%', background: '#C8FF3D', border: '4px solid #0E0E0C', boxShadow: '0 0 0 8px rgba(200,255,61,0.3)' }} />
          {/* floating card */}
          <div className="absolute right-0 bottom-6 w-64 bg-paper text-ink rounded-2xl p-4 shadow-2xl mr-4">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#5C6B4E,#B8C098)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">Cozy driveway</div>
                <div className="text-xs text-muted mt-0.5">★ 4.9 · 230m away</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold">$3</div>
                <div className="text-[10px] text-muted">/hr</div>
              </div>
            </div>
            <div className="mt-3 py-2.5 bg-ink text-paper rounded-full text-sm font-semibold text-center">Book now</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 md:px-14 py-20 bg-[#08080A]">
        <div className="font-mono text-xs text-lime tracking-widest mb-3">HOW IT WORKS</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Three steps. About a minute.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {steps.map(s => (
            <div key={s.n} className="p-6 rounded-2xl border border-white/6 bg-white/4">
              <div className="font-mono text-5xl font-bold text-lime tracking-tight">{s.n}</div>
              <div className="text-xl font-semibold mt-3">{s.t}</div>
              <div className="text-sm text-paper/55 mt-2 leading-relaxed">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* For hosts */}
      <section className="px-8 md:px-14 py-20 bg-lime text-ink flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        <div className="flex-1">
          <div className="font-mono text-xs tracking-widest mb-3">● FOR HOSTS</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Make your driveway<br />pay rent too.</h2>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <Link to="/register?role=host" className="px-6 py-3.5 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 transition-colors">
              List your driveway →
            </Link>
            <span className="text-sm font-medium opacity-70">Free to list. 15% platform fee.</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hostStats.map(([v, l]) => (
            <div key={l} className="p-4 bg-ink text-paper rounded-2xl">
              <div className="font-mono text-xl font-bold">{v}</div>
              <div className="font-mono text-[10px] text-paper/55 uppercase tracking-wider mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-14 py-10 bg-[#08080A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-paper/50">© 2026 PARKSHARE · NSU CSE482 · GROUP 05</div>
        <div className="flex gap-6 text-sm text-paper/50">
          <span className="hover:text-paper/80 cursor-pointer">Privacy</span>
          <span className="hover:text-paper/80 cursor-pointer">Terms</span>
          <span className="hover:text-paper/80 cursor-pointer">Help</span>
        </div>
      </footer>
    </div>
  )
}
