// More screens for ParkShare — success, active booking, history, host dashboard, add spot

const { INK, PAPER, PAPER2, LIME, MUTED, HAIRLINE } = window.PSColors;

// ──────────────────────────────────────────────────────────────
// 06 — Payment success (with booking code)
// ──────────────────────────────────────────────────────────────
function ScreenSuccess() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:INK, overflow:'hidden', color:PAPER}}>
      <Style/>
      {/* faint map */}
      <div style={{position:'absolute',inset:0, opacity:0.18}}>
        <MapBg tone="night" me={null} pins={[]}/>
      </div>
      <div style={{position:'absolute', inset:0, background:`radial-gradient(circle at 50% 30%, rgba(200,255,61,0.18) 0%, rgba(14,14,12,0) 60%)`}}/>

      <div style={{position:'absolute', top:62, left:0, right:0, textAlign:'center', fontSize:11, color:'rgba(246,244,238,0.5)', fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.12em'}}>BOOKING CONFIRMED</div>

      <div style={{position:'absolute', top:120, left:0, right:0, display:'flex', justifyContent:'center'}}>
        <div style={{width:96, height:96, borderRadius:99, background:LIME, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 80px rgba(200,255,61,0.5)'}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><path d="M10 21l8 8 14-16" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div style={{position:'absolute', top:240, left:24, right:24, textAlign:'center'}}>
        <h1 style={{fontSize:32, fontWeight:700, lineHeight:1.1}}>You're parked.</h1>
        <p style={{fontSize:15, color:'rgba(246,244,238,0.6)', marginTop:8, lineHeight:1.5}}>
          Mrs Khan has been notified. Drive over anytime between 2:00 and 5:30 PM.
        </p>
      </div>

      {/* ticket card */}
      <div style={{position:'absolute', top:380, left:20, right:20, background:PAPER, color:INK, borderRadius:24, padding:20}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>BOOKING CODE</div>
            <div className="num" style={{fontSize:28, fontWeight:700, marginTop:4, letterSpacing:'0.04em'}}>PK-4F2A9</div>
          </div>
          <div style={{width:62, height:62, borderRadius:8, background:`repeating-linear-gradient(45deg, ${INK} 0 4px, transparent 4px 8px), repeating-linear-gradient(-45deg, ${INK} 0 2px, transparent 2px 7px)`, opacity:0.9}}/>
        </div>
        <div style={{margin:'16px -20px', position:'relative', height:1}}>
          <div style={{position:'absolute', left:-10, top:-10, width:20, height:20, borderRadius:99, background:INK}}/>
          <div style={{position:'absolute', right:-10, top:-10, width:20, height:20, borderRadius:99, background:INK}}/>
          <div style={{borderTop:`1px dashed ${HAIRLINE}`, height:1, margin:'0 14px'}}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:6}}>
          <div>
            <div style={{fontSize:10, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>SPOT</div>
            <div style={{fontSize:14, fontWeight:600, marginTop:2}}>Cozy driveway<br/>by the lake</div>
          </div>
          <div>
            <div style={{fontSize:10, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>WHEN</div>
            <div style={{fontSize:14, fontWeight:600, marginTop:2}}>Tue 13 May<br/>2:00–5:30 PM</div>
          </div>
        </div>
      </div>

      <div style={{position:'absolute', left:20, right:20, bottom:42, display:'flex', flexDirection:'column', gap:10}}>
        <PillButton big>Get directions</PillButton>
        <div style={{textAlign:'center', fontSize:14, color:'rgba(246,244,238,0.6)', padding:12}}>View my bookings</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 07 — Active booking (countdown + live status, like an active ride)
// ──────────────────────────────────────────────────────────────
function ScreenActive() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <MapBg tone="day" me={{x:210, y:480}} pins={[{x:120, y:340, label:'$3', active:true}]}/>
      {/* route line */}
      <svg width="402" height="874" viewBox="0 0 402 874" style={{position:'absolute', inset:0, pointerEvents:'none'}}>
        <path d="M210 480 Q170 420 150 380 Q130 340 120 340" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="2 8"/>
      </svg>

      {/* top status */}
      <div style={{position:'absolute', top:60, left:16, right:16}}>
        <div style={{background:INK, color:PAPER, borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 12px 30px rgba(0,0,0,0.18)'}}>
          <div style={{width:36, height:36, borderRadius:12, background:LIME, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke={INK} strokeWidth="2" fill="none"/><path d="M8 4v4l2.5 2" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11, color:LIME, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>ACTIVE BOOKING</div>
            <div style={{fontSize:15, fontWeight:600, marginTop:2}}>Ends in <Mono>2h 14m</Mono></div>
          </div>
          <div style={{fontSize:12, color:'rgba(246,244,238,0.5)', fontFamily:'"JetBrains Mono",monospace'}}>PK-4F2A9</div>
        </div>
      </div>

      {/* bottom sheet — driving directions */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, background:PAPER, borderTopLeftRadius:28, borderTopRightRadius:28, padding:'10px 20px 38px', boxShadow:'0 -20px 60px rgba(0,0,0,0.14)'}}>
        <div style={{width:40, height:5, background:'rgba(0,0,0,0.14)', borderRadius:99, margin:'4px auto 16px'}}/>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>ARRIVING</div>
            <h2 style={{fontSize:24, fontWeight:700, marginTop:2}}>in 4 min · <Mono>1.2 km</Mono></h2>
          </div>
          <StatusChip tone="lime">● Paid</StatusChip>
        </div>

        {/* host card */}
        <div style={{marginTop:16, padding:14, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`, display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:42, height:42, borderRadius:99, background:'#D4C8AA', display:'flex',alignItems:'center',justifyContent:'center', fontWeight:700}}>MK</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:600}}>Mrs Khan</div>
            <div style={{fontSize:12, color:MUTED}}>Road 113 · Gate code 7724</div>
          </div>
          <div style={{width:38, height:38, borderRadius:12, background:LIME, display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 2v3a9 9 0 009 9h2v-3l-2-1-2 1a7 7 0 01-4-4l1-2-1-2H3z" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>
          </div>
          <div style={{width:38, height:38, borderRadius:12, background:'#fff', border:`1px solid ${HAIRLINE}`, display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12v8H5l-3 3z" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div style={{marginTop:14, padding:'12px 14px', background:LIME, borderRadius:16, display:'flex', alignItems:'center', gap:10}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke={INK} strokeWidth="1.6" fill="none"/><path d="M9 5v5l3 1" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
          <div style={{fontSize:13, fontWeight:600, color:INK}}>Tip: Honk twice on arrival — the gate is automatic.</div>
        </div>

        <div style={{marginTop:14, display:'flex', gap:10}}>
          <div style={{flex:1, height:48, borderRadius:99, background:'#fff', border:`1px solid ${HAIRLINE}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600}}>Extend time</div>
          <div style={{flex:1, height:48, borderRadius:99, background:INK, color:PAPER, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600}}>End early</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 08 — Booking history (tabs)
// ──────────────────────────────────────────────────────────────
function ScreenHistory() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <div style={{padding:'62px 20px 8px'}}>
        <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>HELLO, RAFIQ</div>
        <h1 style={{fontSize:34, fontWeight:700, marginTop:6}}>Your bookings</h1>
      </div>

      {/* tabs */}
      <div style={{padding:'10px 20px 0', display:'flex', gap:6, borderBottom:`1px solid ${HAIRLINE}`}}>
        {['Active','Upcoming','Past','Cancelled'].map((t,i)=>(
          <div key={t} style={{
            padding:'10px 12px', fontSize:13, fontWeight: i===0? 700 : 500,
            color: i===0 ? INK : MUTED,
            borderBottom: i===0 ? `2px solid ${INK}` : '2px solid transparent',
            marginBottom:-1,
          }}>{t}{i===1 && <span style={{marginLeft:6, fontSize:10, padding:'2px 6px', background:INK, color:LIME, borderRadius:99, fontFamily:'"JetBrains Mono",monospace'}}>2</span>}</div>
        ))}
      </div>

      <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:12}}>
        {/* active card */}
        <div style={{padding:16, background:INK, color:PAPER, borderRadius:20}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div>
              <StatusChip tone="lime">● Active · ends 5:30 PM</StatusChip>
              <div style={{fontSize:18, fontWeight:600, marginTop:10}}>Cozy driveway by the lake</div>
              <div style={{fontSize:13, color:'rgba(246,244,238,0.6)', marginTop:4}}>Road 113, Gulshan 2</div>
            </div>
            <div style={{width:54, height:54, borderRadius:12, background:`repeating-linear-gradient(135deg, #5C6B4E 0 5px, #7A8868 5px 10px)`}}/>
          </div>
          <div style={{marginTop:14, paddingTop:14, borderTop:`1px dashed rgba(246,244,238,0.18)`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="num" style={{fontSize:12, color:LIME}}>PK-4F2A9 · 2h 14m left</div>
            <div style={{fontSize:13, fontWeight:600, color:LIME}}>Track →</div>
          </div>
        </div>

        {/* past entries */}
        {[
          {t:'Mrs Khan\'s spot', a:'Banani 11', d:'10 May', p:'$8.00', s:'Completed', tone:'soft', stars:'★★★★★'},
          {t:'Behind Sky Tower', a:'Dhanmondi 27', d:'4 May', p:'$12.00', s:'Completed', tone:'soft', stars:'★★★★☆'},
          {t:'Gulshan Lake Park', a:'Road 41', d:'28 Apr', p:'—', s:'Cancelled', tone:'warn', stars:''},
        ].map((b,i)=>(
          <div key={i} style={{padding:14, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`, display:'flex', gap:12, alignItems:'center'}}>
            <div style={{width:46, height:46, borderRadius:12, background:PAPER2, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 17V8a3 3 0 013-3h2l1-2h2l1 2h2a3 3 0 013 3v9" stroke={INK} strokeWidth="1.6" fill="none"/><circle cx="6.5" cy="14" r="1.5" fill={INK}/><circle cx="13.5" cy="14" r="1.5" fill={INK}/></svg>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:14, fontWeight:600, lineHeight:1.2}}>{b.t}</div>
              <div style={{fontSize:12, color:MUTED, marginTop:3, display:'flex', gap:8}}>
                <span>{b.a}</span><span>·</span><span>{b.d}</span>{b.stars && <><span>·</span><span style={{color:'#D2A300'}}>{b.stars}</span></>}
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="num" style={{fontSize:15, fontWeight:700}}>{b.p}</div>
              <div style={{fontSize:10, color:MUTED, marginTop:2}}>{b.s}</div>
            </div>
          </div>
        ))}
      </div>

      {/* tab bar */}
      <div style={{position:'absolute', left:14, right:14, bottom:24, background:INK, borderRadius:28, padding:'10px 14px', display:'flex', justifyContent:'space-around', boxShadow:'0 14px 36px rgba(0,0,0,0.22)'}}>
        {[
          ['Search', false],
          ['Trips', true],
          ['Saved', false],
          ['Profile', false],
        ].map(([l,a])=>(
          <div key={l} style={{padding:'8px 12px', borderRadius:99, background: a? LIME : 'transparent', color: a? INK : PAPER, fontSize:13, fontWeight:600}}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 09 — Host dashboard (earnings)
// ──────────────────────────────────────────────────────────────
function ScreenHost() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>HOST DASHBOARD</div>
          <h1 style={{fontSize:26, fontWeight:700, marginTop:4}}>Hi Mrs Khan</h1>
        </div>
        <div style={{width:42, height:42, borderRadius:99, background:'#D4C8AA', display:'flex',alignItems:'center',justifyContent:'center', fontWeight:700, fontSize:14}}>MK</div>
      </div>

      {/* earnings card */}
      <div style={{margin:'10px 20px 0', padding:20, background:INK, color:PAPER, borderRadius:22, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:99, background:LIME, opacity:0.18}}/>
        <div style={{fontSize:11, color:LIME, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>EARNINGS · MAY</div>
        <div className="num" style={{fontSize:48, fontWeight:700, marginTop:8, letterSpacing:'-0.03em'}}>$184.50</div>
        <div style={{fontSize:13, color:'rgba(246,244,238,0.6)', marginTop:2}}>+ <Mono style={{color:LIME}}>$42.00</Mono> vs last month</div>

        {/* mini chart */}
        <div style={{marginTop:16, display:'flex', alignItems:'flex-end', gap:6, height:48}}>
          {[18,32,12,40,28,52,46,38,60,34,48,72,40,58].map((h,i)=>(
            <div key={i} style={{flex:1, height:h, background:i===11? LIME : 'rgba(246,244,238,0.18)', borderRadius:3}}/>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(246,244,238,0.4)', marginTop:6, fontFamily:'"JetBrains Mono",monospace'}}>
          <span>1 MAY</span><span>14 MAY</span>
        </div>
      </div>

      {/* stat grid */}
      <div style={{margin:'14px 20px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div style={{padding:14, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`}}>
          <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>BOOKINGS</div>
          <div className="num" style={{fontSize:26, fontWeight:700, marginTop:4}}>23</div>
          <div style={{fontSize:11, color:MUTED, marginTop:2}}>this month</div>
        </div>
        <div style={{padding:14, background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`}}>
          <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>RATING</div>
          <div className="num" style={{fontSize:26, fontWeight:700, marginTop:4}}>4.9 <span style={{color:'#D2A300'}}>★</span></div>
          <div style={{fontSize:11, color:MUTED, marginTop:2}}>142 reviews</div>
        </div>
      </div>

      {/* upcoming today */}
      <div style={{margin:'18px 20px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
          <h3 style={{fontSize:17, fontWeight:700}}>Today's bookings</h3>
          <div style={{fontSize:12, color:MUTED}}>3 incoming</div>
        </div>

        <div style={{position:'relative', paddingLeft:24}}>
          <div style={{position:'absolute', left:9, top:6, bottom:6, width:2, background:HAIRLINE}}/>
          {[
            {t:'10:00 AM', n:'Rafiq A.', s:'Cozy driveway', dur:'2h', d:'Now'},
            {t:'2:00 PM', n:'Nadia S.', s:'Cozy driveway', dur:'3.5h', d:'Soon'},
            {t:'6:30 PM', n:'Imran K.', s:'Cozy driveway', dur:'1h', d:'Later'},
          ].map((b,i)=>(
            <div key={i} style={{position:'relative', marginBottom:12, background:'#fff', borderRadius:16, padding:'12px 14px', border:`1px solid ${HAIRLINE}`}}>
              <div style={{position:'absolute', left:-19, top:18, width:12, height:12, borderRadius:99, background: i===0? LIME : '#fff', border:`2px solid ${INK}`}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div className="num" style={{fontSize:14, fontWeight:700}}>{b.t}</div>
                <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace'}}>{b.dur}</div>
              </div>
              <div style={{fontSize:14, marginTop:4}}><span style={{fontWeight:600}}>{b.n}</span> <span style={{color:MUTED}}>· {b.s}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* my spots */}
      <div style={{margin:'14px 20px 24px', padding:'16px 16px', background:'#fff', borderRadius:18, border:`1px solid ${HAIRLINE}`, display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:50, height:50, borderRadius:12, background:`repeating-linear-gradient(135deg, #5C6B4E 0 5px, #7A8868 5px 10px)`}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:14, fontWeight:600}}>Cozy driveway by the lake</div>
          <div style={{fontSize:12, color:MUTED, marginTop:2}}>Live · <span className="num">$3</span>/hr · 9 AM – 5 PM</div>
        </div>
        <div style={{fontSize:13, fontWeight:600}}>Edit</div>
      </div>

      <div style={{margin:'0 20px 100px', height:60, borderRadius:18, background:LIME, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:16, boxShadow:'0 8px 22px rgba(200,255,61,0.4)'}}>
        + Add a new spot
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 10 — Add spot location (host onboarding)
// ──────────────────────────────────────────────────────────────
function ScreenAddSpot() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <MapBg tone="day" me={null} pins={[]}/>
      {/* center pin (draggable) */}
      <div style={{position:'absolute', left:'50%', top:'42%', transform:'translate(-50%,-100%)'}}>
        <div style={{width:60, height:60, borderRadius:99, background:INK, border:`4px solid ${LIME}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 24px rgba(0,0,0,0.25)'}}>
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 1L11 11M11 21L11 13" stroke={LIME} strokeWidth="2" strokeLinecap="round"/><path d="M3 7h4l2-2h4l2 2h4v10H3V7z" stroke={LIME} strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
        </div>
        <div style={{width:2, height:18, background:INK, margin:'0 auto'}}/>
        <div style={{width:18, height:6, background:'rgba(0,0,0,0.18)', borderRadius:99, margin:'0 auto'}}/>
      </div>

      {/* top bar */}
      <div style={{position:'absolute', top:60, left:16, right:16, display:'flex', gap:8}}>
        <div style={{width:46, height:46, borderRadius:14, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1, height:46, background:'#fff', borderRadius:16, display:'flex', alignItems:'center', padding:'0 14px', gap:10, boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
          <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={INK} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={INK} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{flex:1, fontSize:14, color:MUTED}}>Search your address</div>
        </div>
      </div>

      {/* stepper */}
      <div style={{position:'absolute', top:120, left:16, right:16, display:'flex', gap:6}}>
        {[1,1,0,0].map((a,i)=>(
          <div key={i} style={{flex:1, height:4, borderRadius:99, background: a? INK : 'rgba(14,14,12,0.14)'}}/>
        ))}
      </div>

      {/* bottom sheet */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, background:PAPER, borderTopLeftRadius:28, borderTopRightRadius:28, padding:'10px 20px 38px', boxShadow:'0 -20px 60px rgba(0,0,0,0.14)'}}>
        <div style={{width:40, height:5, background:'rgba(0,0,0,0.14)', borderRadius:99, margin:'4px auto 16px'}}/>
        <div style={{fontSize:11, color:MUTED, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.08em'}}>STEP 1 OF 4 · LOCATION</div>
        <h2 style={{fontSize:24, fontWeight:700, marginTop:6, lineHeight:1.15}}>Drop a pin on<br/>your driveway</h2>
        <p style={{fontSize:14, color:MUTED, marginTop:8, lineHeight:1.5}}>
          Drivers will see this exact spot. You can adjust the pin by dragging.
        </p>
        <div style={{marginTop:14, padding:'12px 14px', background:'#fff', borderRadius:16, border:`1px solid ${HAIRLINE}`, display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:32, height:32, borderRadius:10, background:LIME, display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 5h2l1.5-1.5h1L9 5h2v6H3V5z" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>
          </div>
          <div style={{flex:1, fontSize:13, lineHeight:1.3}}>
            <div style={{fontWeight:600}}>House 27, Road 113</div>
            <div style={{color:MUTED}}>Gulshan 2, Dhaka 1212</div>
          </div>
        </div>
        <div style={{marginTop:14}}>
          <PillButton big>Next · Details</PillButton>
        </div>
      </div>
    </div>
  );
}

window.ScreenSuccess = ScreenSuccess;
window.ScreenActive = ScreenActive;
window.ScreenHistory = ScreenHistory;
window.ScreenHost = ScreenHost;
window.ScreenAddSpot = ScreenAddSpot;
