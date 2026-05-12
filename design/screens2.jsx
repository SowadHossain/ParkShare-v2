// More screens for ParkShare

const { INK, PAPER, PAPER2, LIME, MUTED, HAIRLINE } = window.PSColors;

// ──────────────────────────────────────────────────────────────
// 03 — Spot details (photo hero + bottom sheet)
// ──────────────────────────────────────────────────────────────
function ScreenSpotDetails() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      {/* hero image */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:380,
        background:`linear-gradient(135deg, #5C6B4E 0%, #7A8868 50%, #B8C098 100%)`,
        overflow:'hidden',
      }}>
        {/* stripes overlay to feel like a photo placeholder */}
        <div style={{position:'absolute',inset:0, background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 24px, rgba(0,0,0,0.04) 24px 48px)'}}/>
        <div style={{position:'absolute', top:62, left:16, right:16, display:'flex', justifyContent:'space-between'}}>
          <div style={{width:40, height:40, borderRadius:14, background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)'}}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{display:'flex', gap:8}}>
            <div style={{height:40, padding:'0 14px', borderRadius:14, background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600}}>
              <svg width="13" height="13" viewBox="0 0 13 13"><path d="M6.5 1l1.7 3.5 3.8.5-2.8 2.7.7 3.8-3.4-1.8L3 11.5l.7-3.8L1 5l3.8-.5z" fill={INK}/></svg>
              Save
            </div>
            <div style={{width:40, height:40, borderRadius:14, background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M3 4h8M3 10h8" stroke={INK} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
        {/* photo dots */}
        <div style={{position:'absolute', bottom:60, left:0, right:0, display:'flex', justifyContent:'center', gap:6}}>
          {[1,1,0,0,0].map((a,i)=>(<div key={i} style={{width:a?20:6, height:6, borderRadius:3, background:'rgba(255,255,255,0.9)'}}/>))}
        </div>
        <div style={{position:'absolute', bottom:24, left:16, fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.85)'}}>spot_0042 · 2 of 5</div>
      </div>

      {/* content sheet */}
      <div style={{position:'absolute', top:340, left:0, right:0, bottom:0, background:PAPER, borderTopLeftRadius:28, borderTopRightRadius:28, overflowY:'auto', padding:'20px 20px 130px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14}}>
          <div style={{flex:1}}>
            <StatusChip tone="lime">● Available now</StatusChip>
            <h1 style={{fontSize:24, fontWeight:700, marginTop:10, lineHeight:1.15}}>Cozy driveway by the lake</h1>
            <div style={{fontSize:13, color:MUTED, marginTop:4}}>Road 113, Gulshan 2 · 120 m away</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="num" style={{fontSize:32, fontWeight:700, letterSpacing:'-0.03em'}}>$3</div>
            <div style={{fontSize:11, color:MUTED}}>per hour</div>
          </div>
        </div>

        {/* feature row */}
        <div style={{marginTop:18, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
          {[
            {l:'Covered', s:'Roof'},
            {l:'SUV', s:'fits up to'},
            {l:'24/7', s:'access'},
            {l:'CCTV', s:'monitored'},
          ].map(f=>(
            <div key={f.l} style={{background:'#fff', border:`1px solid ${HAIRLINE}`, borderRadius:14, padding:'10px 8px', textAlign:'center'}}>
              <div style={{fontSize:13, fontWeight:700}}>{f.l}</div>
              <div style={{fontSize:10, color:MUTED, marginTop:2}}>{f.s}</div>
            </div>
          ))}
        </div>

        {/* host */}
        <div style={{marginTop:18, padding:'14px 14px', background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`, display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:46, height:46, borderRadius:99, background:'#D4C8AA', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:INK}}>MK</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:600}}>Hosted by Mrs Khan</div>
            <div style={{fontSize:12, color:MUTED, marginTop:2}}>★ 4.9 · 142 bookings · Superhost</div>
          </div>
          <div style={{fontSize:13, fontWeight:600}}>View →</div>
        </div>

        {/* rules */}
        <h3 style={{fontSize:13, fontWeight:600, color:MUTED, marginTop:22, textTransform:'uppercase', letterSpacing:'0.06em'}}>House rules</h3>
        <div style={{marginTop:8, fontSize:14, lineHeight:1.55, color:INK}}>
          No oversized trucks. Please don't block the gate. Honk twice on arrival — the gate is automatic.
        </div>

        <h3 style={{fontSize:13, fontWeight:600, color:MUTED, marginTop:20, textTransform:'uppercase', letterSpacing:'0.06em'}}>Recent reviews</h3>
        <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:10}}>
          {[
            ['Rafiq A.', '★★★★★', 'Easy in and out. Mrs Khan greeted me with chai.'],
            ['Nadia S.', '★★★★★', 'Closer to the office than the public lot. Worth it.'],
          ].map(([n,s,t],i)=>(
            <div key={i} style={{background:'#fff', borderRadius:16, padding:14, border:`1px solid ${HAIRLINE}`}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
                <span style={{fontWeight:600}}>{n}</span><span style={{color:'#D2A300'}}>{s}</span>
              </div>
              <div style={{fontSize:13, color:'#3A3A33', marginTop:6, lineHeight:1.45}}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'16px 20px 38px', background:`linear-gradient(180deg, rgba(246,244,238,0) 0%, ${PAPER} 30%)`}}>
        <PillButton big>Book this spot · <Mono style={{marginLeft:4}}>$3/hr</Mono></PillButton>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 04 — Booking form (pick time, see total)
// ──────────────────────────────────────────────────────────────
function ScreenBooking() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <div style={{padding:'62px 20px 20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{width:40, height:40, borderRadius:14, background:'#fff', display:'flex',alignItems:'center',justifyContent:'center', border:`1px solid ${HAIRLINE}`}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:MUTED, letterSpacing:'0.08em'}}>STEP 1 OF 3</div>
        <div style={{width:40}}/>
      </div>

      <div style={{padding:'10px 20px'}}>
        <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>BOOKING</div>
        <h1 style={{fontSize:30, fontWeight:700, marginTop:6, lineHeight:1.08}}>When do you<br/>need it?</h1>
      </div>

      <div style={{padding:'20px 20px 0'}}>
        {/* date picker chips */}
        <div style={{display:'flex', gap:8, overflowX:'auto'}}>
          {[
            ['Today','12 May', false],
            ['Tue','13 May', true],
            ['Wed','14 May', false],
            ['Thu','15 May', false],
            ['Fri','16 May', false],
          ].map(([d,n,a],i)=>(
            <div key={i} style={{
              minWidth:62, padding:'12px 10px', borderRadius:18,
              background: a ? INK : '#fff', color: a? PAPER: INK,
              border: a? 'none' : `1px solid ${HAIRLINE}`,
              textAlign:'center',
            }}>
              <div style={{fontSize:11, opacity:0.7}}>{d}</div>
              <div style={{fontSize:16, fontWeight:700, marginTop:2}}>{n}</div>
            </div>
          ))}
        </div>

        {/* time block */}
        <div style={{marginTop:20, background:'#fff', borderRadius:22, border:`1px solid ${HAIRLINE}`, overflow:'hidden'}}>
          <div style={{padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>START</div>
              <div className="num" style={{fontSize:28, fontWeight:700, marginTop:2}}>2:00 PM</div>
            </div>
            <div style={{width:36, height:36, borderRadius:10, background:PAPER2, display:'flex',alignItems:'center', justifyContent:'center', color:MUTED, fontSize:18}}>⌄</div>
          </div>
          <div style={{height:1, background:HAIRLINE}}/>
          <div style={{padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>END</div>
              <div className="num" style={{fontSize:28, fontWeight:700, marginTop:2}}>5:30 PM</div>
            </div>
            <div style={{width:36, height:36, borderRadius:10, background:PAPER2, display:'flex',alignItems:'center', justifyContent:'center', color:MUTED, fontSize:18}}>⌄</div>
          </div>
        </div>

        {/* duration slider visual */}
        <div style={{marginTop:18, padding:'16px 18px', background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`}}>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
            <span style={{color:MUTED}}>Duration</span>
            <span className="num" style={{fontWeight:700}}>3h 30m</span>
          </div>
          <div style={{marginTop:14, position:'relative', height:6, background:PAPER2, borderRadius:99}}>
            <div style={{position:'absolute', left:0, top:0, height:6, width:'46%', background:INK, borderRadius:99}}/>
            <div style={{position:'absolute', left:'46%', top:-7, width:20, height:20, borderRadius:99, background:LIME, transform:'translateX(-50%)', boxShadow:'0 2px 6px rgba(0,0,0,0.2)', border:`3px solid ${INK}`}}/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:MUTED, marginTop:8, fontFamily:'"JetBrains Mono",monospace'}}>
            <span>30 MIN</span><span>8 HRS</span>
          </div>
        </div>
      </div>

      {/* total + CTA */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'14px 20px 38px', background:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, borderTop:`1px solid ${HAIRLINE}`}}>
        <div style={{display:'flex', justifyContent:'space-between', padding:'2px 0 6px'}}>
          <div style={{fontSize:13, color:MUTED}}>$3.00 × 3.5 hrs</div>
          <div className="num" style={{fontSize:13}}>$10.50</div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', padding:'2px 0 12px', borderBottom:`1px dashed ${HAIRLINE}`}}>
          <div style={{fontSize:13, color:MUTED}}>Service fee</div>
          <div className="num" style={{fontSize:13}}>$0.50</div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0 14px', alignItems:'baseline'}}>
          <div style={{fontSize:14, fontWeight:600}}>Total</div>
          <div className="num" style={{fontSize:26, fontWeight:700}}>$11.00</div>
        </div>
        <PillButton big>Continue to payment</PillButton>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 05 — Payment (Stripe-style)
// ──────────────────────────────────────────────────────────────
function ScreenPayment() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <div style={{padding:'62px 20px 20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{width:40, height:40, borderRadius:14, background:'#fff', display:'flex',alignItems:'center',justifyContent:'center', border:`1px solid ${HAIRLINE}`}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:MUTED, letterSpacing:'0.08em'}}>STEP 3 OF 3</div>
        <div style={{width:40, height:40, borderRadius:14, background:LIME, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7h10M9 4l3 3-3 3" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
        </div>
      </div>

      <div style={{padding:'10px 20px 20px'}}>
        <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>SECURE CHECKOUT · STRIPE</div>
        <h1 style={{fontSize:30, fontWeight:700, marginTop:6, lineHeight:1.08}}>Pay <Mono>$11.00</Mono></h1>
      </div>

      {/* summary card */}
      <div style={{margin:'0 20px', padding:'16px', background:INK, color:PAPER, borderRadius:20}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:11, color:LIME, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>BOOKING</div>
            <div style={{fontSize:15, fontWeight:600, marginTop:4}}>Cozy driveway by the lake</div>
            <div style={{fontSize:12, color:'rgba(246,244,238,0.6)', marginTop:2}}>Tue 13 May · 2:00–5:30 PM</div>
          </div>
          <div style={{width:46, height:46, borderRadius:12, background:`repeating-linear-gradient(135deg, #5C6B4E 0 6px, #7A8868 6px 12px)`}}/>
        </div>
      </div>

      {/* methods */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{fontSize:13, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em', textTransform:'uppercase'}}>Payment method</div>
        <div style={{marginTop:10, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`, overflow:'hidden'}}>
          <div style={{padding:14, display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${HAIRLINE}`}}>
            <div style={{width:44, height:30, borderRadius:6, background:'#1A1F71', display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', fontSize:9, fontWeight:700}}>VISA</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:600}}><Mono>•••• 4242</Mono></div>
              <div style={{fontSize:11, color:MUTED}}>Expires 12/27</div>
            </div>
            <div style={{width:22, height:22, borderRadius:99, background:INK, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5l3 3 5-6" stroke={LIME} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div style={{padding:14, display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:44, height:30, borderRadius:6, background:PAPER2, display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:18}}>+</span>
            </div>
            <div style={{fontSize:14, color:MUTED}}>Add a new card</div>
          </div>
        </div>

        {/* card mock with input fields */}
        <div style={{marginTop:18, padding:14, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`}}>
          <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>CARD NUMBER</div>
          <div className="num" style={{fontSize:18, fontWeight:600, marginTop:6, letterSpacing:'0.08em'}}>4242  4242  4242  4242</div>
          <div style={{display:'flex', gap:16, marginTop:14}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>EXPIRY</div>
              <div className="num" style={{fontSize:16, fontWeight:600, marginTop:4}}>12 / 27</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>CVC</div>
              <div className="num" style={{fontSize:16, fontWeight:600, marginTop:4}}>•••</div>
            </div>
          </div>
        </div>

        <div style={{marginTop:14, fontSize:11, color:MUTED, display:'flex', alignItems:'center', gap:6}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="5" width="8" height="6" rx="1" stroke={MUTED} strokeWidth="1.2" fill="none"/><path d="M4 5V3.5a2 2 0 014 0V5" stroke={MUTED} strokeWidth="1.2" fill="none"/></svg>
          Encrypted end-to-end. Test mode.
        </div>
      </div>

      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'14px 20px 38px'}}>
        <PillButton big>Pay <Mono style={{marginLeft:4}}>$11.00</Mono></PillButton>
      </div>
    </div>
  );
}

window.ScreenSpotDetails = ScreenSpotDetails;
window.ScreenBooking = ScreenBooking;
window.ScreenPayment = ScreenPayment;
