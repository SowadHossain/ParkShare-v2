// Host bookings + earnings detail + admin + edge cases
const { INK: I6, PAPER: P6, PAPER2: P6b, LIME: L6, MUTED: M6, HAIRLINE: H6 } = window.PSColors;

// 24 — Host bookings (tabs)
function ScreenHostBookings() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P6,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 8px'}}>
        <div style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>RESERVATIONS</div>
        <h1 style={{fontSize:30,fontWeight:700,marginTop:4}}>Incoming</h1>
      </div>
      <div style={{padding:'10px 20px 0',display:'flex',gap:4,borderBottom:`1px solid ${H6}`}}>
        {['Upcoming','Active','Past','Cancelled'].map((t,i)=>(
          <div key={t} style={{padding:'10px 12px',fontSize:13,fontWeight:i===0?700:500,color:i===0?I6:M6,borderBottom:i===0?`2px solid ${I6}`:'2px solid transparent',marginBottom:-1}}>
            {t}{i===0 && <span style={{marginLeft:6,fontSize:10,padding:'2px 6px',background:I6,color:L6,borderRadius:99,fontFamily:'"JetBrains Mono",monospace'}}>3</span>}
          </div>
        ))}
      </div>

      <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:10}}>
        {[
          {when:'Today · 2:00 PM', dur:'3h 30m', name:'Rafiq A.', plate:'DHA-1294', spot:'Cozy driveway', earn:'10.50', state:'Pending'},
          {when:'Today · 6:30 PM', dur:'1h', name:'Imran K.', plate:'DHA-8821', spot:'Cozy driveway', earn:'3.00', state:'Paid'},
          {when:'Tue · 9:00 AM', dur:'8h', name:'Nadia S.', plate:'DHA-0044', spot:'Behind garage', earn:'40.00', state:'Paid'},
          {when:'Wed · 11:00 AM', dur:'2h', name:'Tahmid R.', plate:'DHA-7712', spot:'Cozy driveway', earn:'6.00', state:'Paid'},
        ].map((b,i)=>(
          <div key={i} style={{padding:14,background:'#fff',borderRadius:18,border:`1px solid ${H6}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div className="num" style={{fontSize:14,fontWeight:700}}>{b.when}</div>
              <StatusChip tone={b.state==='Pending'?'warn':'lime'}>● {b.state}</StatusChip>
            </div>
            <div style={{marginTop:10,display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:42,height:42,borderRadius:99,background:P6b,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{b.name.split(' ')[0][0]}{b.name.split(' ')[1][0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{b.name} <span style={{color:M6,fontWeight:400}}>· {b.plate}</span></div>
                <div style={{fontSize:12,color:M6,marginTop:2}}>{b.spot} · {b.dur}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="num" style={{fontSize:16,fontWeight:700}}>+${b.earn}</div>
                <div style={{fontSize:10,color:M6,marginTop:1}}>your earn</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{height:100}}/>
      <div style={{position:'absolute',left:14,right:14,bottom:24,background:I6,borderRadius:28,padding:'10px 14px',display:'flex',justifyContent:'space-around',boxShadow:'0 14px 36px rgba(0,0,0,0.22)'}}>
        {[['Home',false],['Spots',false],['Bookings',true],['Earnings',false]].map(([l,a])=>(
          <div key={l} style={{padding:'8px 12px',borderRadius:99,background:a?L6:'transparent',color:a?I6:P6,fontSize:13,fontWeight:600}}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// 25 — Earnings detail
function ScreenEarnings() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:I6,color:P6,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 0'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{width:40,height:40,borderRadius:14,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={P6} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{fontSize:13,color:'rgba(246,244,238,0.6)'}}>Export</div>
        </div>
        <div style={{marginTop:18,fontSize:11,color:L6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>EARNINGS · MAY 2026</div>
        <div className="num" style={{fontSize:56,fontWeight:700,marginTop:6,letterSpacing:'-0.03em'}}>$184.50</div>
        <div style={{fontSize:13,color:'rgba(246,244,238,0.6)',marginTop:2}}>+ <Mono style={{color:L6}}>$42.00</Mono> vs April</div>
      </div>

      {/* chart */}
      <div style={{margin:'18px 20px 0',height:140,position:'relative'}}>
        <svg width="100%" height="140" viewBox="0 0 360 140" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g6" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={L6} stopOpacity="0.45"/>
              <stop offset="100%" stopColor={L6} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 90 L30 70 L60 92 L90 60 L120 78 L150 45 L180 58 L210 30 L240 50 L270 22 L300 38 L330 18 L360 28 L360 140 L0 140 Z" fill="url(#g6)"/>
          <path d="M0 90 L30 70 L60 92 L90 60 L120 78 L150 45 L180 58 L210 30 L240 50 L270 22 L300 38 L330 18 L360 28" stroke={L6} strokeWidth="2.5" fill="none"/>
          <circle cx="330" cy="18" r="5" fill={L6}/>
          <circle cx="330" cy="18" r="9" fill={L6} opacity="0.3"/>
        </svg>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(246,244,238,0.4)',marginTop:4,fontFamily:'"JetBrains Mono",monospace'}}>
          <span>1 MAY</span><span>7</span><span>14</span><span>TODAY</span>
        </div>
      </div>

      <div style={{margin:'14px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[['Avg/day','$13.20'],['Top day','$28.00'],['Payouts','$140'],['Pending','$44.50']].map(([k,v])=>(
          <div key={k} style={{padding:14,background:'rgba(255,255,255,0.06)',borderRadius:14}}>
            <div style={{fontSize:11,color:'rgba(246,244,238,0.5)',fontFamily:'"JetBrains Mono",monospace'}}>{k.toUpperCase()}</div>
            <div className="num" style={{fontSize:20,fontWeight:700,marginTop:4}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{margin:'24px 20px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:10}}>
          <div style={{fontSize:11,color:L6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>RECENT TRANSACTIONS</div>
          <div style={{fontSize:13,color:'rgba(246,244,238,0.6)'}}>All →</div>
        </div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:18,overflow:'hidden'}}>
          {[
            ['12 May','Rafiq A. · 3h 30m','10.50'],
            ['10 May','Nadia S. · 8h','24.00'],
            ['10 May','Imran K. · 1h','3.00'],
            ['8 May','Tahmid R. · 2h','6.00'],
            ['6 May','Sara H. · 4h','12.00'],
          ].map(([d,n,a],i,arr)=>(
            <div key={i} style={{padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom: i<arr.length-1? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{n}</div>
                <div className="num" style={{fontSize:11,color:'rgba(246,244,238,0.5)',marginTop:2}}>{d}</div>
              </div>
              <div className="num" style={{fontSize:14,fontWeight:700,color:L6}}>+${a}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height:80}}/>
    </div>
  );
}

// 26 — Admin dashboard
function ScreenAdmin() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P6,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 4px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>● ADMIN · CSE482</div>
          <h1 style={{fontSize:26,fontWeight:700,marginTop:4}}>Platform health</h1>
        </div>
        <div style={{width:42,height:42,borderRadius:99,background:I6,color:L6,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>A</div>
      </div>

      <div style={{margin:'18px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[
          {l:'Users', v:'1,284', d:'+18 this week', tone:'lime'},
          {l:'Active spots', v:'412', d:'5 pending review', tone:'soft'},
          {l:'Bookings', v:'3,109', d:'94 today', tone:'soft'},
          {l:'GMV', v:'$24.8k', d:'+12% MoM', tone:'lime'},
        ].map(s=>(
          <div key={s.l} style={{padding:16,background:'#fff',borderRadius:18,border:`1px solid ${H6}`}}>
            <div style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.06em'}}>{s.l.toUpperCase()}</div>
            <div className="num" style={{fontSize:24,fontWeight:700,marginTop:6}}>{s.v}</div>
            <div style={{fontSize:11,marginTop:4,color: s.tone==='lime'? '#3D7A18' : M6}}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{margin:'18px 20px 0'}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:10}}>Moderation queue</h3>
        <div style={{background:'#fff',borderRadius:18,border:`1px solid ${H6}`,overflow:'hidden'}}>
          {[
            {t:'Spot reported as inactive', s:'spot_0087 · 2 reports', tag:'SPOT', ic:'⚠'},
            {t:'Review flagged as spam', s:'review_4421 · "Best ever..."', tag:'REVIEW', ic:'!'},
            {t:'New host signup', s:'imran.k@nsu.edu', tag:'USER', ic:'+'},
            {t:'Duplicate listing detected', s:'spot_0114 vs spot_0119', tag:'SPOT', ic:'⚠'},
          ].map((r,i,arr)=>(
            <div key={i} style={{padding:14,display:'flex',alignItems:'center',gap:12,borderBottom:i<arr.length-1?`1px solid ${H6}`:'none'}}>
              <div style={{width:36,height:36,borderRadius:10,background:P6b,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{r.ic}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{r.t}</div>
                <div className="num" style={{fontSize:11,color:M6,marginTop:2}}>{r.s}</div>
              </div>
              <div style={{fontSize:10,padding:'4px 8px',background:I6,color:L6,borderRadius:99,fontFamily:'"JetBrains Mono",monospace'}}>{r.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{margin:'18px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[['Users','1,284'],['Spots','412'],['Reviews','2.1k']].map(([l,v])=>(
          <div key={l} style={{padding:14,background:I6,color:P6,borderRadius:16,textAlign:'center'}}>
            <div className="num" style={{fontSize:18,fontWeight:700}}>{v}</div>
            <div style={{fontSize:11,color:'rgba(246,244,238,0.5)',marginTop:4}}>{l} →</div>
          </div>
        ))}
      </div>

      <div style={{height:80}}/>
    </div>
  );
}

// 27 — Admin moderation (users)
function ScreenAdminMod() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P6,overflow:'auto'}}>
      <Style/>
      <TopBack label="MODERATION"/>
      <div style={{padding:'0 20px'}}>
        <h1 style={{fontSize:26,fontWeight:700}}>Users</h1>
        <div style={{marginTop:14,padding:'12px 14px',background:'#fff',borderRadius:14,border:`1px solid ${H6}`,display:'flex',alignItems:'center',gap:10}}>
          <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={M6} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={M6} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{flex:1,fontSize:14,color:M6}}>Search by name or email</div>
        </div>
        <div style={{display:'flex',gap:6,marginTop:12,overflowX:'auto'}}>
          {[['All',true],['Drivers',false],['Hosts',false],['Flagged',false]].map(([l,a])=>(
            <div key={l} style={{padding:'8px 12px',background:a?I6:'#fff',color:a?P6:I6,borderRadius:99,fontSize:12,fontWeight:600,border:a?'none':`1px solid ${H6}`}}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{padding:'14px 20px 100px'}}>
        <div style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace',padding:'8px 4px'}}>1,284 USERS · SORTED BY RECENT</div>
        <div style={{background:'#fff',borderRadius:18,border:`1px solid ${H6}`,overflow:'hidden'}}>
          {[
            {n:'Rafiq Ahmed', e:'rafiq@nsu.edu', r:'driver', c:'12 trips', flag:false},
            {n:'Mrs Khan', e:'mkhan@gmail.com', r:'host', c:'$184 earned', flag:false},
            {n:'Imran K.', e:'imran.k@nsu.edu', r:'host', c:'new · pending', flag:true},
            {n:'Nadia Sultana', e:'nadia.s@brac.edu', r:'driver', c:'4 trips', flag:false},
            {n:'Sara Hossain', e:'sara.h@gmail.com', r:'driver', c:'spam reports: 2', flag:true},
            {n:'Tahmid Rahman', e:'tahmid@nsu.edu', r:'driver', c:'7 trips', flag:false},
          ].map((u,i,arr)=>(
            <div key={i} style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:12,borderBottom:i<arr.length-1?`1px solid ${H6}`:'none'}}>
              <div style={{width:36,height:36,borderRadius:99,background:P6b,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>{u.n.split(' ').map(x=>x[0]).join('')}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:6}}>{u.n} {u.flag && <span style={{fontSize:9,padding:'2px 6px',background:'#FFE0CF',color:'#9A4310',borderRadius:99,fontFamily:'"JetBrains Mono",monospace'}}>FLAG</span>}</div>
                <div style={{fontSize:11,color:M6,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.e}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:10,fontFamily:'"JetBrains Mono",monospace',color:I6,textTransform:'uppercase'}}>{u.r}</div>
                <div className="num" style={{fontSize:10,color:M6,marginTop:1}}>{u.c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 28 — Payment failed
function ScreenPaymentFailed() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P6,overflow:'hidden'}}>
      <Style/>
      <TopBack label="PAYMENT FAILED"/>
      <div style={{padding:'20px 24px 0',textAlign:'center'}}>
        <div style={{width:84,height:84,borderRadius:99,background:'#FFE0CF',margin:'10px auto 18px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="36" height="36" viewBox="0 0 36 36"><path d="M9 9l18 18M27 9L9 27" stroke="#E04A2B" strokeWidth="3.5" strokeLinecap="round"/></svg>
        </div>
        <div style={{fontSize:11,color:'#E04A2B',fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.12em'}}>ERR · CARD_DECLINED</div>
        <h1 style={{fontSize:28,fontWeight:700,marginTop:10,lineHeight:1.1}}>Your card was<br/>declined.</h1>
        <p style={{fontSize:14,color:M6,marginTop:12,lineHeight:1.5}}>No charge was made. Your spot is held for the next <Mono style={{fontWeight:700,color:I6}}>4:32</Mono> while you try again.</p>
      </div>

      <div style={{margin:'24px 20px 0',padding:'14px 16px',background:'#fff',borderRadius:16,border:`1px solid ${H6}`,display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:30,borderRadius:6,background:'#1A1F71',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:9,fontWeight:700}}>VISA</div>
        <div style={{flex:1}}>
          <div className="num" style={{fontSize:14,fontWeight:600}}>•••• 4242</div>
          <div style={{fontSize:11,color:'#E04A2B'}}>Insufficient funds</div>
        </div>
        <div style={{fontSize:12,fontWeight:600}}>Change →</div>
      </div>

      <div style={{margin:'14px 20px 0',padding:'14px 16px',background:L6,borderRadius:16,fontSize:13,fontWeight:500,lineHeight:1.5}}>
        Tip: This is Stripe <Mono style={{fontWeight:700}}>test mode</Mono>. Try card <Mono style={{fontWeight:700}}>4242 4242 4242 4242</Mono> to simulate success.
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 20px 38px',display:'flex',flexDirection:'column',gap:8}}>
        <PillButton big>Try again</PillButton>
        <div style={{textAlign:'center',fontSize:14,color:M6,padding:12}}>Cancel booking</div>
      </div>
    </div>
  );
}

// 29 — Cancellation done
function ScreenCancelDone() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P6,overflow:'hidden'}}>
      <Style/>
      <div style={{position:'absolute',top:80,left:24,right:24,textAlign:'center'}}>
        <div style={{width:84,height:84,borderRadius:99,background:I6,color:L6,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="36" height="36" viewBox="0 0 36 36"><path d="M10 18l5 5 12-13" stroke={L6} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.12em',marginTop:18}}>BOOKING CANCELLED</div>
        <h1 style={{fontSize:30,fontWeight:700,marginTop:8,lineHeight:1.1}}>You're all set.</h1>
        <p style={{fontSize:14,color:M6,marginTop:10,lineHeight:1.5}}>Your refund of <Mono style={{fontWeight:700,color:I6}}>$11.00</Mono> is on its way to your Visa ending in 4242. Expect it within 3–5 days.</p>
      </div>

      {/* receipt */}
      <div style={{position:'absolute',top:380,left:20,right:20,padding:18,background:'#fff',borderRadius:20,border:`1px solid ${H6}`}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div className="num" style={{fontSize:11,color:M6,fontFamily:'"JetBrains Mono",monospace'}}>PK-4F2A9</div>
          <StatusChip tone="soft">Cancelled</StatusChip>
        </div>
        <div style={{marginTop:10,fontSize:15,fontWeight:600}}>Cozy driveway by the lake</div>
        <div style={{fontSize:12,color:M6,marginTop:2}}>Tue 13 May · 2:00–5:30 PM</div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${H6}`,display:'flex',justifyContent:'space-between'}}>
          <div style={{fontSize:13,color:M6}}>Refunded</div>
          <div className="num" style={{fontSize:18,fontWeight:700}}>$11.00</div>
        </div>
      </div>

      <div style={{position:'absolute',left:20,right:20,bottom:38,display:'flex',flexDirection:'column',gap:10}}>
        <PillButton big>Find another spot</PillButton>
        <div style={{textAlign:'center',fontSize:14,color:M6,padding:12}}>Back to bookings</div>
      </div>
    </div>
  );
}

window.ScreenHostBookings = ScreenHostBookings;
window.ScreenEarnings = ScreenEarnings;
window.ScreenAdmin = ScreenAdmin;
window.ScreenAdminMod = ScreenAdminMod;
window.ScreenPaymentFailed = ScreenPaymentFailed;
window.ScreenCancelDone = ScreenCancelDone;
