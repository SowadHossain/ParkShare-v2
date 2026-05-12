// Desktop web screens — ParkShare
// Use the same ink/paper/lime palette. Compact components for canvas display.

const WC = window.PSColors || { INK:'#0E0E0C', PAPER:'#F6F4EE', PAPER2:'#E8E4D7', LIME:'#C8FF3D', MUTED:'#8A8275', HAIRLINE:'rgba(14,14,12,0.10)' };
const { INK: IW, PAPER: PW, PAPER2: PW2, LIME: LW, MUTED: MW, HAIRLINE: HW } = WC;

const mono = {fontFamily:'"JetBrains Mono",monospace'};
const MonoW = ({children,style={}}) => <span style={{...mono,...style}}>{children}</span>;

// Mini reusable
function WebNav({active='Home', dark=false}) {
  const fg = dark? PW : IW;
  const sub = dark? 'rgba(246,244,238,0.62)' : MW;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 56px',borderBottom: dark? '1px solid rgba(255,255,255,0.08)' : `1px solid ${HW}`}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:34,height:34,borderRadius:10,background:LW,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IW} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
        </div>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:'-0.02em',color:fg}}>ParkShare</div>
      </div>
      <div style={{display:'flex',gap:30,alignItems:'center'}}>
        {['Home','Find parking','How it works','For hosts','About'].map(t=>(
          <div key={t} style={{fontSize:14,fontWeight: active===t? 600 : 500, color: active===t? fg : sub}}>{t}</div>
        ))}
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <div style={{fontSize:14,fontWeight:500,color:sub}}>Sign in</div>
        <div style={{padding:'10px 18px',background:LW,color:IW,borderRadius:99,fontSize:14,fontWeight:600}}>Get started →</div>
      </div>
    </div>
  );
}

function WebFoot({dark=false}) {
  const bg = dark? '#08080A' : PW2;
  const fg = dark? 'rgba(246,244,238,0.7)' : MW;
  return (
    <div style={{padding:'40px 56px',background:bg,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontSize:12,...mono,color:fg}}>© 2026 PARKSHARE · NSU CSE482 · GROUP 05</div>
      <div style={{display:'flex',gap:24,fontSize:13,color:fg}}>
        <span>Privacy</span><span>Terms</span><span>Help</span><span>Press</span>
      </div>
    </div>
  );
}

// W1 — Public landing
function WebLanding() {
  return (
    <div style={{background:IW,color:PW,minHeight:'100%'}}>
      <WebNav dark active="Home"/>
      <div style={{padding:'72px 56px 60px',display:'grid',gridTemplateColumns:'1.15fr 1fr',gap:60,alignItems:'center'}}>
        <div>
          <div style={{...mono,fontSize:12,color:LW,letterSpacing:'0.16em'}}>● LIVE IN DHAKA · GULSHAN · BANANI · DHANMONDI</div>
          <h1 style={{fontSize:80,fontWeight:700,lineHeight:0.98,letterSpacing:'-0.04em',marginTop:18}}>
            Park in someone's<br/><span style={{color:LW}}>driveway.</span> By<br/>the hour. For less.
          </h1>
          <p style={{fontSize:18,color:'rgba(246,244,238,0.65)',marginTop:22,lineHeight:1.5,maxWidth:540}}>
            ParkShare is a residential driveway marketplace. Find unused space near you, book in 30 seconds, and pay only for the time you need.
          </p>
          <div style={{marginTop:32,display:'flex',gap:12,alignItems:'center'}}>
            <div style={{padding:'14px 22px',background:LW,color:IW,borderRadius:99,fontSize:15,fontWeight:600}}>Find parking →</div>
            <div style={{padding:'14px 22px',border:'1px solid rgba(246,244,238,0.2)',color:PW,borderRadius:99,fontSize:15,fontWeight:500}}>I have a driveway</div>
          </div>
          <div style={{marginTop:38,display:'flex',gap:36}}>
            {[['412','active spots'],['$2.40','avg hourly'],['4.8 ★','host rating']].map(([v,l])=>(
              <div key={l}>
                <div style={{...mono,fontSize:28,fontWeight:700}}>{v}</div>
                <div style={{fontSize:12,color:'rgba(246,244,238,0.5)',marginTop:4,...mono,textTransform:'uppercase'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* big visual */}
        <div style={{position:'relative',height:560}}>
          <div style={{position:'absolute',inset:0,borderRadius:24,background:'linear-gradient(135deg, #2B3826 0%, #6E8050 60%, #B8C098 100%)',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 28px, rgba(0,0,0,0.06) 28px 56px)'}}/>
            {/* roads */}
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 600 560" preserveAspectRatio="none">
              <path d="M-20 220 Q200 200 320 280 T620 320" stroke="rgba(246,244,238,0.18)" strokeWidth="32" fill="none"/>
              <path d="M-20 220 Q200 200 320 280 T620 320" stroke="rgba(246,244,238,0.4)" strokeWidth="2" strokeDasharray="10 14" fill="none"/>
              <path d="M180 -20 Q220 200 280 360 T380 580" stroke="rgba(246,244,238,0.18)" strokeWidth="28" fill="none"/>
            </svg>
            {/* pins */}
            {[{l:120,t:140,p:'$3'},{l:300,t:90,p:'$4'},{l:240,t:260,p:'$2'},{l:420,t:200,p:'$5'},{l:380,t:380,p:'$3'},{l:160,t:420,p:'$2'}].map((p,i)=>(
              <div key={i} style={{position:'absolute',left:p.l,top:p.t,padding:'6px 12px',background: i===2? LW : PW,color: IW,borderRadius:99,fontSize:13,fontWeight:700,...mono,boxShadow:'0 6px 16px rgba(0,0,0,0.25)'}}>{p.p}</div>
            ))}
            {/* "you" */}
            <div style={{position:'absolute',left:260,top:200,width:28,height:28,borderRadius:99,background:LW,border:`4px solid ${IW}`,boxShadow:'0 8px 24px rgba(200,255,61,0.6)'}}/>
          </div>
          {/* floating spot card */}
          <div style={{position:'absolute',right:-20,bottom:30,width:280,background:PW,color:IW,borderRadius:20,padding:16,boxShadow:'0 24px 60px rgba(0,0,0,0.4)'}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>Cozy driveway</div>
                <div style={{fontSize:12,color:MW,marginTop:2}}>★ 4.9 · 230m away</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{...mono,fontSize:18,fontWeight:700}}>$3</div>
                <div style={{fontSize:10,color:MW}}>/hr</div>
              </div>
            </div>
            <div style={{marginTop:12,padding:'10px 14px',background:IW,color:PW,borderRadius:99,fontSize:13,fontWeight:600,textAlign:'center'}}>Book now</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{padding:'80px 56px 40px',background:'#08080A'}}>
        <div style={{...mono,fontSize:12,color:LW,letterSpacing:'0.16em'}}>HOW IT WORKS</div>
        <h2 style={{fontSize:48,fontWeight:700,marginTop:10,letterSpacing:'-0.02em'}}>Three steps. About a minute.</h2>
        <div style={{marginTop:40,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18}}>
          {[
            {n:'01',t:'Search the map',s:'See real driveways near your destination. Filter by price, size, covered parking.'},
            {n:'02',t:'Pick your time',s:'Choose start and end. We calculate the total upfront — no surprises.'},
            {n:'03',t:'Park & go',s:'Pay with Stripe. Get a code or gate instructions. Your spot is reserved.'},
          ].map(s=>(
            <div key={s.n} style={{padding:24,borderRadius:20,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{...mono,fontSize:48,fontWeight:700,color:LW,letterSpacing:'-0.02em'}}>{s.n}</div>
              <div style={{fontSize:20,fontWeight:600,marginTop:12}}>{s.t}</div>
              <div style={{fontSize:14,color:'rgba(246,244,238,0.55)',marginTop:8,lineHeight:1.55}}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* For hosts strip */}
      <div style={{padding:'80px 56px',background:LW,color:IW,display:'flex',alignItems:'center',justifyContent:'space-between',gap:60}}>
        <div style={{flex:1}}>
          <div style={{...mono,fontSize:12,letterSpacing:'0.16em'}}>● FOR HOSTS</div>
          <h2 style={{fontSize:54,fontWeight:700,marginTop:10,lineHeight:1.02,letterSpacing:'-0.03em'}}>Make your driveway<br/>pay rent too.</h2>
          <div style={{marginTop:24,display:'flex',gap:14,alignItems:'center'}}>
            <div style={{padding:'14px 22px',background:IW,color:PW,borderRadius:99,fontSize:15,fontWeight:600}}>List your driveway →</div>
            <div style={{fontSize:14,fontWeight:500}}>Free to list. 15% platform fee.</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2, 180px)',gap:14}}>
          {[['~$160','/mo avg'],['9 AM – 5 PM','typical window'],['~14','bookings/mo'],['3–5 min','to list']].map(([v,l])=>(
            <div key={l} style={{padding:18,background:IW,color:PW,borderRadius:16}}>
              <div style={{...mono,fontSize:20,fontWeight:700}}>{v}</div>
              <div style={{fontSize:12,color:'rgba(246,244,238,0.55)',marginTop:6,...mono,textTransform:'uppercase'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <WebFoot dark/>
    </div>
  );
}

// W2 — Login
function WebLogin() {
  return (
    <div style={{minHeight:'100%',background:PW,display:'flex'}}>
      <div style={{flex:1.05,padding:'56px',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:LW,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IW} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:20,fontWeight:700,letterSpacing:'-0.02em'}}>ParkShare</div>
        </div>
        <div style={{margin:'auto 0',maxWidth:380}}>
          <div style={{...mono,fontSize:12,color:MW,letterSpacing:'0.12em'}}>WELCOME BACK</div>
          <h1 style={{fontSize:46,fontWeight:700,lineHeight:1,letterSpacing:'-0.02em',marginTop:12}}>Sign in to<br/>ParkShare.</h1>
          <div style={{marginTop:32,display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>EMAIL</div>
              <div style={{marginTop:6,padding:'14px 16px',background:'#fff',borderRadius:12,border:`1px solid ${HW}`,fontSize:15}}>rafiq@northsouth.edu</div>
            </div>
            <div>
              <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>PASSWORD</div>
              <div style={{marginTop:6,padding:'14px 16px',background:'#fff',borderRadius:12,border:`1px solid ${HW}`,fontSize:15,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>••••••••••</span><span style={{...mono,fontSize:11,color:MW}}>SHOW</span></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,color:MW}}>
              <label style={{display:'flex',gap:8,alignItems:'center'}}><span style={{width:16,height:16,background:IW,borderRadius:4,display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 4l2.5 3L8 1" stroke={LW} strokeWidth="2" fill="none" strokeLinecap="round"/></svg></span>Keep me signed in</label>
              <span style={{fontWeight:600,color:IW}}>Forgot?</span>
            </div>
            <div style={{height:52,marginTop:6,borderRadius:99,background:IW,color:PW,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:600}}>Sign in →</div>
            <div style={{display:'flex',alignItems:'center',gap:10,margin:'6px 4px'}}>
              <div style={{flex:1,height:1,background:HW}}/><div style={{...mono,fontSize:11,color:MW}}>OR</div><div style={{flex:1,height:1,background:HW}}/>
            </div>
            <div style={{height:52,borderRadius:99,background:'#fff',border:`1px solid ${HW}`,display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:15,fontWeight:600}}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.6 9.2c0-.7-.06-1.4-.18-2H9v3.8h4.84a4.14 4.14 0 01-1.8 2.7v2.25h2.92c1.7-1.57 2.7-3.9 2.7-6.75z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.55-1.84.87-3.04.87-2.34 0-4.32-1.58-5.02-3.7H.95v2.32A9 9 0 009 18z" fill="#34A853"/><path d="M3.98 10.73a5.41 5.41 0 010-3.46V4.96H.95a9 9 0 000 8.08l3.03-2.31z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 00.95 4.96l3.03 2.3C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/></svg>
              Continue with Google
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:24,fontSize:14,color:MW}}>New to ParkShare? <span style={{fontWeight:600,color:IW}}>Create account →</span></div>
        </div>
        <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>© 2026 · CSE482</div>
      </div>
      <div style={{flex:1,background:IW,color:PW,padding:'56px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 70% 30%, rgba(200,255,61,0.18), transparent 60%)`}}/>
        <div style={{position:'relative'}}>
          <div style={{...mono,fontSize:12,color:LW,letterSpacing:'0.16em'}}>● TODAY IN GULSHAN</div>
          <h2 style={{fontSize:42,fontWeight:700,marginTop:14,lineHeight:1.02,letterSpacing:'-0.02em'}}>14 fresh spots<br/>under $4/hr.</h2>
        </div>
        <div style={{position:'absolute',left:56,right:56,bottom:56}}>
          <div style={{padding:20,background:'rgba(255,255,255,0.06)',borderRadius:20,border:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{fontSize:14,color:'rgba(246,244,238,0.7)',lineHeight:1.55,fontStyle:'italic'}}>"I parked at Mrs. Khan's driveway every Tuesday for my yoga class. She brought me chai once. Five stars."</div>
            <div style={{marginTop:14,display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:38,height:38,borderRadius:99,background:'#D4C8AA',color:IW,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>NS</div>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>Nadia Sultana</div>
                <div style={{fontSize:11,color:'rgba(246,244,238,0.5)',marginTop:1}}>Driver since Feb 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// W3 — Driver Search (map + filters + cards) — THE hero web page
function WebSearch() {
  return (
    <div style={{minHeight:'100%',background:PW,display:'flex',flexDirection:'column'}}>
      <WebNav active="Find parking"/>
      <div style={{flex:1,display:'grid',gridTemplateColumns:'260px 460px 1fr',gap:0,minHeight:720}}>
        {/* filters */}
        <div style={{padding:'24px 22px',borderRight:`1px solid ${HW}`,background:PW}}>
          <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>FILTERS</div>
          <h3 style={{fontSize:20,fontWeight:700,marginTop:4}}>Refine</h3>

          <div style={{marginTop:22}}>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>MAX PRICE / HR</div>
            <div style={{...mono,fontSize:28,fontWeight:700,marginTop:6}}>$5.00</div>
            <div style={{marginTop:10,position:'relative',height:6,background:PW2,borderRadius:99}}>
              <div style={{position:'absolute',inset:0,width:'55%',background:IW,borderRadius:99}}/>
              <div style={{position:'absolute',left:'55%',top:-7,width:20,height:20,borderRadius:99,background:LW,border:`3px solid ${IW}`,transform:'translateX(-50%)'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',...mono,fontSize:10,color:MW,marginTop:8}}><span>$1</span><span>$10+</span></div>
          </div>

          <div style={{marginTop:22}}>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em',marginBottom:8}}>VEHICLE</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {[['Sedan',true],['SUV',false],['Van',false],['Truck',false]].map(([t,a])=>(
                <div key={t} style={{padding:'8px 12px',background: a? IW : '#fff',color: a? PW : IW,border: a? 'none' : `1px solid ${HW}`,borderRadius:99,fontSize:12,fontWeight:600}}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{marginTop:22}}>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em',marginBottom:8}}>MIN RATING</div>
            <div style={{display:'flex',gap:6}}>
              {[3,4,5].map(r=>(
                <div key={r} style={{flex:1,padding:'10px 0',background: r===4? IW : '#fff',color: r===4? PW : IW,border: r===4? 'none' : `1px solid ${HW}`,borderRadius:10,fontSize:12,fontWeight:600,textAlign:'center'}}>{r}★+</div>
              ))}
            </div>
          </div>

          <div style={{marginTop:22}}>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em',marginBottom:8}}>FEATURES</div>
            {[['Covered',true],['CCTV',true],['EV charging',false],['Gated',false],['24/7 access',false]].map(([t,a])=>(
              <div key={t} style={{padding:'7px 0',display:'flex',gap:10,alignItems:'center',fontSize:13}}>
                <span style={{width:18,height:18,borderRadius:5,background: a? IW : '#fff',border: a? 'none' : `1.5px solid ${HW}`,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                  {a && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5l2.5 3L9 1" stroke={LW} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                </span>
                {t}
              </div>
            ))}
          </div>

          <div style={{marginTop:24,padding:14,background:IW,color:PW,borderRadius:14}}>
            <div style={{...mono,fontSize:11,color:LW,letterSpacing:'0.08em'}}>RESULTS</div>
            <div style={{...mono,fontSize:26,fontWeight:700,marginTop:4}}>42 spots</div>
            <div style={{fontSize:12,color:'rgba(246,244,238,0.6)',marginTop:4}}>within 1.2 km of Gulshan 2</div>
          </div>
        </div>

        {/* cards */}
        <div style={{padding:'18px 18px',borderRight:`1px solid ${HW}`,overflow:'auto',background:'#fff'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:13,color:MW}}>Sorted by <span style={{color:IW,fontWeight:600}}>nearest</span></div>
            <div style={{fontSize:13,color:MW}}>Map view ⇆</div>
          </div>
          {[
            {t:'Cozy driveway by the lake', a:'Road 113, Gulshan 2', d:'230 m', p:'3.00', r:'4.9', h:'Mrs Khan', tags:['Covered','CCTV'], hi:true},
            {t:'Quiet side gate', a:'Road 89, Gulshan 1', d:'420 m', p:'2.50', r:'4.8', h:'Imran K.', tags:['Gated']},
            {t:'Front of the bakery', a:'Road 27, Banani 11', d:'780 m', p:'4.00', r:'5.0', h:'Sara H.', tags:['24/7','Lighted']},
            {t:'Behind the house garage', a:'Road 89, Gulshan 1', d:'1.0 km', p:'5.00', r:'4.7', h:'Tahmid R.', tags:['Covered','EV']},
            {t:'Shaded driveway', a:'Road 16, Gulshan 2', d:'1.1 km', p:'2.00', r:'4.6', h:'Maya B.', tags:['Covered']},
          ].map((s,i)=>(
            <div key={i} style={{padding:14,marginBottom:10,borderRadius:16,border:`1px solid ${s.hi?IW:HW}`,background: s.hi? PW : '#fff',display:'flex',gap:12,boxShadow: s.hi? '0 8px 24px rgba(0,0,0,0.08)':'none'}}>
              <div style={{width:96,height:96,borderRadius:12,background:`linear-gradient(135deg, ${['#5C6B4E','#6F584A','#4F6A78','#705D4A','#5A7066'][i]}, ${['#B8C098','#C8B49B','#A8C0CB','#C8B8A0','#9DB5AB'][i]})`,flexShrink:0,position:'relative'}}>
                <div style={{position:'absolute',top:8,left:8,padding:'2px 6px',background:'rgba(0,0,0,0.5)',color:PW,borderRadius:6,fontSize:10,...mono}}>{i+1}/6</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                  <div style={{fontSize:15,fontWeight:600,lineHeight:1.2}}>{s.t}</div>
                  <div style={{textAlign:'right'}}>
                    <div style={{...mono,fontSize:18,fontWeight:700}}>${s.p}</div>
                    <div style={{fontSize:10,color:MW}}>/ hour</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:MW,marginTop:3}}>{s.a}</div>
                <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
                  {s.tags.map(t=><div key={t} style={{padding:'3px 8px',background:PW2,borderRadius:99,fontSize:10,fontWeight:600,...mono}}>{t}</div>)}
                </div>
                <div style={{marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:MW}}>
                  <span>★ {s.r} · {s.h}</span>
                  <span style={{...mono}}>{s.d}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* map */}
        <div style={{position:'relative',background:'linear-gradient(135deg, #DCDCC9 0%, #C5C3AC 100%)',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px)'}}/>
          {/* search bar */}
          <div style={{position:'absolute',top:18,left:18,right:18,padding:'12px 16px',background:'#fff',borderRadius:14,boxShadow:'0 6px 20px rgba(0,0,0,0.12)',display:'flex',gap:10,alignItems:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={IW} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={IW} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{flex:1,fontSize:14}}>Gulshan 2, Dhaka <span style={{color:MW}}>· 2:00 PM – 5:30 PM</span></div>
            <div style={{...mono,fontSize:11,color:MW}}>Tue 13 May</div>
          </div>
          {/* roads */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 700 720" preserveAspectRatio="xMidYMid slice">
            <path d="M-20 280 Q200 240 350 320 T740 280" stroke="rgba(255,255,255,0.5)" strokeWidth="40" fill="none"/>
            <path d="M-20 280 Q200 240 350 320 T740 280" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeDasharray="12 16" fill="none"/>
            <path d="M200 -20 Q260 260 320 460 T420 740" stroke="rgba(255,255,255,0.5)" strokeWidth="36" fill="none"/>
            <path d="M-20 540 Q200 500 380 560 T740 520" stroke="rgba(255,255,255,0.5)" strokeWidth="32" fill="none"/>
          </svg>
          {/* pins */}
          {[
            {l:120,t:180,p:'$3',hi:true,n:1},{l:340,t:140,p:'$2.5',n:2},{l:500,t:240,p:'$4',n:3},
            {l:560,t:430,p:'$5',n:4},{l:170,t:480,p:'$2',n:5},{l:340,t:560,p:'$3.5',n:6},
            {l:430,t:380,p:'$3',n:7},{l:200,t:330,p:'$4',n:8},
          ].map(p=>(
            <div key={p.n} style={{position:'absolute',left:p.l,top:p.t,padding:'6px 12px',background: p.hi? LW : '#fff',color: IW,borderRadius:99,fontSize:13,fontWeight:700,...mono,boxShadow:'0 6px 16px rgba(0,0,0,0.2)',border: p.hi? `2px solid ${IW}` : 'none'}}>{p.p}</div>
          ))}
          {/* me */}
          <div style={{position:'absolute',left:280,top:300,width:18,height:18,borderRadius:99,background:'#2A6FDB',border:`3px solid ${PW}`,boxShadow:'0 0 0 8px rgba(42,111,219,0.2)'}}/>
          {/* legend */}
          <div style={{position:'absolute',bottom:18,left:18,padding:'10px 14px',background:'rgba(14,14,12,0.92)',color:PW,borderRadius:12,fontSize:11,...mono,letterSpacing:'0.08em'}}>● MAP · GULSHAN · ZOOM 16</div>
        </div>
      </div>
    </div>
  );
}

// W4 — Spot details
function WebSpotDetails() {
  return (
    <div style={{minHeight:'100%',background:PW}}>
      <WebNav active="Find parking"/>
      <div style={{padding:'24px 56px',display:'flex',gap:6,fontSize:13,color:MW}}>
        <span>Find parking</span><span>→</span><span>Gulshan</span><span>→</span><span style={{color:IW,fontWeight:600}}>Cozy driveway by the lake</span>
      </div>

      {/* photo grid */}
      <div style={{padding:'0 56px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gridTemplateRows:'200px 200px',gap:8,height:408}}>
        <div style={{gridRow:'1 / 3',background:'linear-gradient(135deg,#5C6B4E,#B8C098)',borderRadius:'18px 0 0 18px',position:'relative'}}>
          <div style={{position:'absolute',top:14,left:14,padding:'4px 10px',background:'rgba(0,0,0,0.5)',color:PW,...mono,fontSize:11,borderRadius:99}}>PHOTO 1/6</div>
        </div>
        <div style={{background:'linear-gradient(135deg,#6F584A,#C8B49B)'}}/>
        <div style={{background:'linear-gradient(135deg,#4F6A78,#A8C0CB)',borderRadius:'0 18px 0 0'}}/>
        <div style={{background:'linear-gradient(135deg,#705D4A,#C8B8A0)'}}/>
        <div style={{background:'linear-gradient(135deg,#5A7066,#9DB5AB)',borderRadius:'0 0 18px 0',position:'relative'}}>
          <div style={{position:'absolute',right:12,bottom:12,padding:'8px 14px',background:'#fff',color:IW,borderRadius:99,fontSize:13,fontWeight:600,boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>See all 6 →</div>
        </div>
      </div>

      <div style={{padding:'30px 56px',display:'grid',gridTemplateColumns:'1.7fr 1fr',gap:48,alignItems:'flex-start'}}>
        <div>
          <div style={{...mono,fontSize:12,color:MW,letterSpacing:'0.08em'}}>SPOT_0042 · GULSHAN 2</div>
          <h1 style={{fontSize:42,fontWeight:700,marginTop:6,lineHeight:1,letterSpacing:'-0.02em'}}>Cozy driveway by the lake</h1>
          <div style={{marginTop:10,display:'flex',gap:18,fontSize:14,color:MW}}>
            <span>★ <span style={{color:IW,fontWeight:600}}>4.9</span> · 28 reviews</span>
            <span>·</span>
            <span>Hosted by <span style={{color:IW,fontWeight:600}}>Mrs Khan</span></span>
            <span>·</span>
            <span>Road 113, Gulshan 2</span>
          </div>

          <div style={{marginTop:30,display:'flex',gap:18}}>
            {[
              {ic:'⌂',t:'Fits up to SUV',s:'4.5m × 2.3m driveway'},
              {ic:'☂',t:'Covered & CCTV',s:'Roof + 24/7 cameras'},
              {ic:'♦',t:'Available 9–5',s:'Mon to Sat'},
            ].map(f=>(
              <div key={f.t} style={{flex:1,padding:16,background:'#fff',border:`1px solid ${HW}`,borderRadius:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:PW2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{f.ic}</div>
                <div style={{fontSize:14,fontWeight:600,marginTop:10}}>{f.t}</div>
                <div style={{fontSize:12,color:MW,marginTop:3}}>{f.s}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop:30}}>
            <h3 style={{fontSize:20,fontWeight:700}}>About this spot</h3>
            <p style={{marginTop:10,fontSize:15,color:MW,lineHeight:1.6,maxWidth:580}}>
              Tucked behind a quiet lane in Gulshan 2, right by Lake Park. Easy access via the side gate — punch in the code we send you. The space comfortably fits a sedan or compact SUV; we've had a Land Cruiser too but it's tight.
            </p>
          </div>

          <div style={{marginTop:30}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <h3 style={{fontSize:20,fontWeight:700}}>House rules</h3>
              <div style={{fontSize:13,color:MW}}>3 rules</div>
            </div>
            <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                ['No oversized trucks','Pickup trucks are fine; lorries no.'],
                ["Don't block the gate",'Park well past the gate sensor.'],
                ['Honk twice on arrival','So we can buzz you in.'],
                ['Quiet hours after 9 PM','Light sleepers upstairs.'],
              ].map(([t,s])=>(
                <div key={t} style={{padding:14,background:'#fff',border:`1px solid ${HW}`,borderRadius:14}}>
                  <div style={{fontSize:14,fontWeight:600}}>{t}</div>
                  <div style={{fontSize:12,color:MW,marginTop:3}}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:30}}>
            <h3 style={{fontSize:20,fontWeight:700}}>Reviews · 28</h3>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                {n:'Nadia Sultana', d:'2 weeks ago', r:5, t:'Mrs Khan greeted me with chai. Gate code worked first try. The spot is a tight fit for an SUV but doable.'},
                {n:'Tahmid Rahman', d:'1 month ago', r:5, t:"Quiet, covered, exactly as described. I'd book again."},
              ].map((r,i)=>(
                <div key={i} style={{padding:16,background:'#fff',border:`1px solid ${HW}`,borderRadius:16}}>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <div style={{width:38,height:38,borderRadius:99,background:'#D4C8AA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{r.n.split(' ').map(x=>x[0]).join('')}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600}}>{r.n}</div>
                      <div style={{fontSize:11,color:MW,marginTop:1}}>{r.d}</div>
                    </div>
                    <div style={{fontSize:12,color:'#A88A12',fontWeight:700}}>★★★★★</div>
                  </div>
                  <div style={{marginTop:10,fontSize:13,color:IW,lineHeight:1.5}}>{r.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* sticky booking card */}
        <div style={{position:'sticky',top:20,padding:20,background:'#fff',borderRadius:20,border:`1px solid ${HW}`,boxShadow:'0 12px 30px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <div style={{...mono,fontSize:36,fontWeight:700,letterSpacing:'-0.02em'}}>$3</div>
            <div style={{fontSize:14,color:MW}}>/ hour</div>
          </div>
          <div style={{marginTop:14,padding:0,border:`1px solid ${HW}`,borderRadius:14,overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
              <div style={{padding:12,borderRight:`1px solid ${HW}`}}>
                <div style={{...mono,fontSize:10,color:MW,letterSpacing:'0.08em'}}>FROM</div>
                <div style={{fontSize:14,fontWeight:600,marginTop:2}}>Tue · 2:00 PM</div>
              </div>
              <div style={{padding:12}}>
                <div style={{...mono,fontSize:10,color:MW,letterSpacing:'0.08em'}}>TO</div>
                <div style={{fontSize:14,fontWeight:600,marginTop:2}}>Tue · 5:30 PM</div>
              </div>
            </div>
            <div style={{padding:12,borderTop:`1px solid ${HW}`}}>
              <div style={{...mono,fontSize:10,color:MW,letterSpacing:'0.08em'}}>VEHICLE</div>
              <div style={{fontSize:14,fontWeight:600,marginTop:2}}>Toyota Axio · DHA-1294</div>
            </div>
          </div>

          <div style={{marginTop:14,height:52,borderRadius:99,background:IW,color:PW,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:600}}>Book this spot · $10.50</div>
          <div style={{marginTop:10,fontSize:12,color:MW,textAlign:'center'}}>You won't be charged yet</div>

          <div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${HW}`,display:'flex',flexDirection:'column',gap:8,fontSize:13}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MW}}>$3 × 3.5h</span><MonoW>$10.50</MonoW></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MW}}>Service fee</span><MonoW>$0.00</MonoW></div>
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:8,borderTop:`1px dashed ${HW}`,fontWeight:700,fontSize:15}}><span>Total</span><MonoW>$10.50</MonoW></div>
          </div>
        </div>
      </div>
      <WebFoot/>
    </div>
  );
}

// W5 — Host dashboard
function WebHostDash() {
  return (
    <div style={{minHeight:'100%',background:PW,display:'flex'}}>
      {/* sidebar */}
      <div style={{width:240,background:IW,color:PW,padding:'24px 18px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',gap:10,alignItems:'center',padding:'4px 8px',marginBottom:20}}>
          <div style={{width:30,height:30,borderRadius:9,background:LW,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IW} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:16,fontWeight:700}}>ParkShare <span style={{color:LW,...mono,fontSize:11,marginLeft:4}}>HOST</span></div>
        </div>
        {[
          ['Dashboard','▭',true],
          ['My spots','▤',false],
          ['Bookings','◷',false],
          ['Earnings','$',false],
          ['Notifications','♥',false],
          ['Profile','◉',false],
        ].map(([l,ic,a])=>(
          <div key={l} style={{padding:'10px 12px',borderRadius:10,background:a?'rgba(255,255,255,0.08)':'transparent',display:'flex',gap:12,alignItems:'center',fontSize:14,fontWeight:a?600:500,color:a?PW:'rgba(246,244,238,0.65)'}}>
            <span style={{width:20,...mono,color:a?LW:'rgba(246,244,238,0.5)'}}>{ic}</span>{l}
          </div>
        ))}
        <div style={{marginTop:'auto',padding:14,background:'rgba(255,255,255,0.06)',borderRadius:12}}>
          <div style={{...mono,fontSize:10,color:LW,letterSpacing:'0.1em'}}>● 3 NEW</div>
          <div style={{fontSize:13,marginTop:4}}>Pending bookings need your action.</div>
        </div>
      </div>

      {/* main */}
      <div style={{flex:1,padding:'28px 36px',overflow:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <div style={{...mono,fontSize:12,color:MW,letterSpacing:'0.08em'}}>GOOD AFTERNOON · MRS KHAN</div>
            <h1 style={{fontSize:36,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Your driveway is busy today.</h1>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={{padding:'10px 14px',border:`1px solid ${HW}`,background:'#fff',borderRadius:99,fontSize:13,fontWeight:600}}>This month ▾</div>
            <div style={{padding:'10px 16px',background:IW,color:PW,borderRadius:99,fontSize:13,fontWeight:600}}>+ Add spot</div>
          </div>
        </div>

        <div style={{marginTop:24,display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:12}}>
          {[
            {l:'EARNINGS · MAY',v:'$184.50',d:'+ $42 vs April',tone:'lime'},
            {l:'BOOKINGS',v:'23',d:'3 today',tone:'soft'},
            {l:'OCCUPANCY',v:'68%',d:'9 AM – 5 PM',tone:'soft'},
            {l:'RATING',v:'4.9 ★',d:'28 reviews',tone:'soft'},
          ].map((s,i)=>(
            <div key={s.l} style={{padding:18,background: i===0? IW : '#fff',color: i===0? PW : IW,border: i===0? 'none' : `1px solid ${HW}`,borderRadius:18}}>
              <div style={{...mono,fontSize:10,color: i===0? LW : MW,letterSpacing:'0.08em'}}>{s.l}</div>
              <div style={{...mono,fontSize:30,fontWeight:700,marginTop:8,letterSpacing:'-0.02em'}}>{s.v}</div>
              <div style={{fontSize:11,color: i===0? 'rgba(246,244,238,0.55)' : MW,marginTop:6}}>{s.d}</div>
            </div>
          ))}
        </div>

        <div style={{marginTop:24,display:'grid',gridTemplateColumns:'2fr 1.1fr',gap:18}}>
          {/* chart */}
          <div style={{padding:22,background:'#fff',borderRadius:20,border:`1px solid ${HW}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <div>
                <div style={{...mono,fontSize:10,color:MW,letterSpacing:'0.08em'}}>DAILY EARNINGS · MAY 2026</div>
                <div style={{fontSize:22,fontWeight:700,marginTop:4}}>Trending up — keep going.</div>
              </div>
              <div style={{display:'flex',gap:6}}>
                {['7D','30D','90D'].map((t,i)=><div key={t} style={{padding:'6px 10px',borderRadius:8,background:i===1?IW:'transparent',color:i===1?PW:MW,fontSize:11,...mono}}>{t}</div>)}
              </div>
            </div>
            <div style={{marginTop:14,height:200,display:'flex',gap:4,alignItems:'flex-end'}}>
              {[18,22,14,28,9,16,24,12,30,20,26,32,18,22,28,34,16,24,38,30,22,28,42,36,30,38,46,32,40,52].map((v,i)=>(
                <div key={i} style={{flex:1,height:`${v*1.6}%`,background: i===28? LW : i>22 ? IW : PW2,borderRadius:'4px 4px 0 0',position:'relative'}}>
                  {i===28 && <div style={{position:'absolute',top:-26,left:'50%',transform:'translateX(-50%)',...mono,fontSize:10,fontWeight:700,padding:'2px 6px',background:IW,color:LW,borderRadius:6,whiteSpace:'nowrap'}}>$28</div>}
                </div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',...mono,fontSize:10,color:MW,marginTop:8}}>
              <span>1</span><span>8</span><span>15</span><span>22</span><span>29</span>
            </div>
          </div>

          {/* today schedule */}
          <div style={{padding:22,background:IW,color:PW,borderRadius:20}}>
            <div style={{...mono,fontSize:10,color:LW,letterSpacing:'0.08em'}}>TODAY · 12 MAY</div>
            <div style={{fontSize:22,fontWeight:700,marginTop:4}}>4 bookings</div>
            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
              {[
                {t:'9:00 – 11:00', n:'Nadia S.', e:'6.00', a:false},
                {t:'2:00 – 5:30', n:'Rafiq A.', e:'10.50', a:true},
                {t:'6:30 – 7:30', n:'Imran K.', e:'3.00', a:false},
                {t:'8:00 – 10:00', n:'Tahmid R.', e:'6.00', a:false},
              ].map((b,i)=>(
                <div key={i} style={{padding:10,borderRadius:12,background: b.a? LW : 'rgba(255,255,255,0.06)',color: b.a? IW : PW,display:'flex',gap:10,alignItems:'center'}}>
                  <div style={{width:6,height:30,borderRadius:99,background: b.a? IW : 'rgba(246,244,238,0.3)'}}/>
                  <div style={{flex:1}}>
                    <div style={{...mono,fontSize:12,fontWeight:700}}>{b.t}</div>
                    <div style={{fontSize:11,color: b.a? IW : 'rgba(246,244,238,0.5)',marginTop:2}}>{b.n}{b.a && ' · ACTIVE NOW'}</div>
                  </div>
                  <div style={{...mono,fontSize:13,fontWeight:700}}>${b.e}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* recent activity */}
        <div style={{marginTop:24,padding:22,background:'#fff',borderRadius:20,border:`1px solid ${HW}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <h3 style={{fontSize:18,fontWeight:700}}>Recent activity</h3>
            <div style={{fontSize:13,color:MW}}>See all →</div>
          </div>
          <div style={{marginTop:14}}>
            {[
              ['Nadia S.','booked 9:00–11:00 AM tomorrow','2m','+$6.00'],
              ['Tahmid R.','left a 5★ review','1h','—'],
              ['Imran K.','requested 6:30 PM today','3h','pending'],
              ['Sara H.','cancelled Tue booking','1d','refund $11.00'],
            ].map(([n,a,t,e],i,arr)=>(
              <div key={i} style={{padding:'12px 0',display:'flex',alignItems:'center',gap:12,borderBottom: i<arr.length-1? `1px solid ${HW}` : 'none'}}>
                <div style={{width:34,height:34,borderRadius:99,background:PW2,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{n.split(' ').map(x=>x[0]).join('')}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13}}><strong>{n}</strong> <span style={{color:MW}}>{a}</span></div>
                </div>
                <div style={{...mono,fontSize:12,fontWeight:600,color: e.startsWith('+')? '#3D7A18' : MW}}>{e}</div>
                <div style={{...mono,fontSize:11,color:MW,width:30,textAlign:'right'}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// W6 — Admin dashboard
function WebAdmin() {
  return (
    <div style={{minHeight:'100%',background:PW,display:'flex'}}>
      <div style={{width:220,background:'#08080A',color:PW,padding:'24px 16px',display:'flex',flexDirection:'column',gap:4}}>
        <div style={{...mono,fontSize:10,color:'rgba(200,255,61,0.7)',letterSpacing:'0.16em',marginBottom:18,padding:'0 6px'}}>● ADMIN · CSE482</div>
        {[['Overview','▭',true],['Users','◉',false],['Spots','▤',false],['Reviews','★',false],['Bookings','◷',false],['Reports','⚠',false]].map(([l,ic,a])=>(
          <div key={l} style={{padding:'9px 10px',borderRadius:8,background:a?'rgba(200,255,61,0.12)':'transparent',display:'flex',gap:10,alignItems:'center',fontSize:13,fontWeight:a?600:500,color:a?LW:'rgba(246,244,238,0.55)'}}>
            <span style={{width:16,...mono,fontSize:12}}>{ic}</span>{l}
          </div>
        ))}
      </div>
      <div style={{flex:1,padding:'24px 32px',overflow:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>PLATFORM OVERVIEW · LAST 30 DAYS</div>
            <h1 style={{fontSize:30,fontWeight:700,marginTop:4}}>Everything is healthy.</h1>
          </div>
          <div style={{padding:'8px 14px',background:'#fff',border:`1px solid ${HW}`,borderRadius:10,fontSize:13,...mono}}>admin@parkshare.app</div>
        </div>

        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
          {[
            ['USERS','1,284','+18 wk','lime'],
            ['ACTIVE SPOTS','412','5 pending','soft'],
            ['BOOKINGS','3,109','94 today','soft'],
            ['GMV','$24.8k','+12% MoM','lime'],
            ['REPORTS','7','2 unresolved','warn'],
          ].map(([l,v,d,tone])=>(
            <div key={l} style={{padding:14,background:'#fff',borderRadius:14,border:`1px solid ${HW}`}}>
              <div style={{...mono,fontSize:9,color:MW,letterSpacing:'0.08em'}}>{l}</div>
              <div style={{...mono,fontSize:22,fontWeight:700,marginTop:6}}>{v}</div>
              <div style={{fontSize:10,marginTop:4,color: tone==='lime'? '#3D7A18' : tone==='warn'? '#9A4310' : MW}}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14}}>
          <div style={{padding:18,background:'#fff',borderRadius:16,border:`1px solid ${HW}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <h3 style={{fontSize:15,fontWeight:700}}>Moderation queue</h3>
              <div style={{fontSize:12,color:MW}}>Open in full →</div>
            </div>
            <table style={{width:'100%',marginTop:12,borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{textAlign:'left',color:MW,...mono,fontSize:10}}>
                  <th style={{padding:'8px 0',fontWeight:500}}>TYPE</th>
                  <th style={{padding:'8px 0',fontWeight:500}}>SUBJECT</th>
                  <th style={{padding:'8px 0',fontWeight:500}}>REPORTS</th>
                  <th style={{padding:'8px 0',fontWeight:500,textAlign:'right'}}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['SPOT','spot_0087 · Cozy driveway','2','review'],
                  ['REVIEW','review_4421 · "Best ever..."','3','dismiss'],
                  ['USER','sara.h@gmail.com','2','warn'],
                  ['SPOT','spot_0114 (duplicate)','1','merge'],
                  ['REVIEW','review_4503 · spam','4','remove'],
                ].map(([k,s,r,a],i)=>(
                  <tr key={i} style={{borderTop:`1px solid ${HW}`}}>
                    <td style={{padding:'10px 0'}}><span style={{padding:'2px 8px',background:IW,color:LW,borderRadius:99,fontSize:9,...mono}}>{k}</span></td>
                    <td style={{padding:'10px 0',fontWeight:500}}>{s}</td>
                    <td style={{padding:'10px 0',...mono}}>{r}</td>
                    <td style={{padding:'10px 0',textAlign:'right'}}><span style={{padding:'4px 10px',background:PW2,borderRadius:8,fontSize:11,fontWeight:600}}>{a}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{padding:18,background:IW,color:PW,borderRadius:16}}>
            <div style={{...mono,fontSize:10,color:LW,letterSpacing:'0.08em'}}>GMV · LAST 30 DAYS</div>
            <div style={{...mono,fontSize:32,fontWeight:700,marginTop:6}}>$24,830</div>
            <div style={{marginTop:14,height:90}}>
              <svg width="100%" height="90" viewBox="0 0 300 90" preserveAspectRatio="none">
                <path d="M0 70 L20 60 L40 65 L60 50 L80 55 L100 40 L120 48 L140 35 L160 42 L180 28 L200 38 L220 22 L240 30 L260 18 L280 25 L300 12" stroke={LW} strokeWidth="2.5" fill="none"/>
                <path d="M0 70 L20 60 L40 65 L60 50 L80 55 L100 40 L120 48 L140 35 L160 42 L180 28 L200 38 L220 22 L240 30 L260 18 L280 25 L300 12 L300 90 L0 90 Z" fill={LW} opacity="0.18"/>
              </svg>
            </div>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div><div style={{...mono,fontSize:9,color:'rgba(246,244,238,0.5)',letterSpacing:'0.08em'}}>HOST PAYOUT</div><div style={{...mono,fontSize:18,fontWeight:700,marginTop:2}}>$21.1k</div></div>
              <div><div style={{...mono,fontSize:9,color:'rgba(246,244,238,0.5)',letterSpacing:'0.08em'}}>PLATFORM FEE</div><div style={{...mono,fontSize:18,fontWeight:700,marginTop:2,color:LW}}>$3.7k</div></div>
            </div>
          </div>
        </div>

        <div style={{marginTop:20,padding:18,background:'#fff',borderRadius:16,border:`1px solid ${HW}`}}>
          <h3 style={{fontSize:15,fontWeight:700}}>Recent activity feed</h3>
          <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
            {[
              ['user_1284','registered as host','15m'],
              ['booking_3109','paid · $10.50','22m'],
              ['spot_0412','published','40m'],
              ['review_4503','flagged for spam','1h'],
              ['user_1281','password reset','2h'],
              ['booking_3098','cancelled · refund $11','3h'],
            ].map(([id,a,t],i,arr)=>(
              <div key={i} style={{padding:'10px 12px',display:'flex',gap:10,alignItems:'center',borderBottom: i<arr.length-2? `1px solid ${HW}` : 'none'}}>
                <div style={{width:8,height:8,borderRadius:99,background:LW}}/>
                <div style={{...mono,fontSize:11,color:MW,width:96}}>{id}</div>
                <div style={{fontSize:12,flex:1}}>{a}</div>
                <div style={{...mono,fontSize:10,color:MW}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// W7 — Add spot (location pick)
function WebAddSpot() {
  return (
    <div style={{minHeight:'100%',background:PW}}>
      <div style={{padding:'20px 56px',borderBottom:`1px solid ${HW}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={IW} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div style={{...mono,fontSize:12,color:MW,letterSpacing:'0.1em'}}>NEW LISTING · STEP 1 / 4</div>
        </div>
        <div style={{display:'flex',gap:18,fontSize:13}}>
          {['Location','Details','Pricing','Review'].map((t,i)=>(
            <div key={t} style={{padding:'6px 12px',borderRadius:99,background:i===0?IW:'transparent',color:i===0?PW:MW,fontWeight: i===0?600:500}}>{i+1}. {t}</div>
          ))}
        </div>
        <div style={{...mono,fontSize:12,color:MW}}>SAVE & EXIT</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',height:'calc(100% - 70px)',minHeight:700}}>
        <div style={{padding:'40px 48px',display:'flex',flexDirection:'column'}}>
          <div style={{...mono,fontSize:12,color:MW,letterSpacing:'0.08em'}}>STEP 1</div>
          <h1 style={{fontSize:42,fontWeight:700,marginTop:6,letterSpacing:'-0.02em',lineHeight:1.04}}>Where is your<br/>driveway?</h1>
          <p style={{fontSize:15,color:MW,marginTop:14,lineHeight:1.55,maxWidth:440}}>Drop a pin or type the address. Drivers will see this exact location after they book.</p>

          <div style={{marginTop:24,padding:'14px 16px',background:'#fff',border:`1px solid ${HW}`,borderRadius:14,display:'flex',gap:10,alignItems:'center'}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={MW} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={MW} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{flex:1,fontSize:14}}>Road 113, Gulshan 2, Dhaka 1212</div>
            <div style={{...mono,fontSize:11,color:MW}}>VERIFIED</div>
          </div>

          <div style={{marginTop:16,padding:16,background:'#fff',border:`1px solid ${HW}`,borderRadius:14}}>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>PIN COORDINATES</div>
            <div style={{display:'flex',gap:18,marginTop:8}}>
              <div><div style={{fontSize:11,color:MW}}>Latitude</div><div style={{...mono,fontSize:16,fontWeight:600,marginTop:2}}>23.7917° N</div></div>
              <div><div style={{fontSize:11,color:MW}}>Longitude</div><div style={{...mono,fontSize:16,fontWeight:600,marginTop:2}}>90.4147° E</div></div>
            </div>
          </div>

          <div style={{marginTop:16,padding:16,background:LW,borderRadius:14,fontSize:13,fontWeight:500,lineHeight:1.5}}>
            <strong>Tip:</strong> drag the pin to the exact spot drivers should park. Don't drop it on your front door.
          </div>

          <div style={{marginTop:'auto',display:'flex',gap:10}}>
            <div style={{padding:'14px 22px',background:'#fff',border:`1px solid ${HW}`,borderRadius:99,fontSize:14,fontWeight:600,color:MW}}>Back</div>
            <div style={{flex:1,padding:'14px 22px',background:IW,color:PW,borderRadius:99,fontSize:14,fontWeight:600,textAlign:'center'}}>Continue · Details →</div>
          </div>
        </div>

        <div style={{position:'relative',background:'linear-gradient(135deg, #DCDCC9 0%, #C5C3AC 100%)',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px)'}}/>
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice">
            <path d="M-20 300 Q200 270 350 360 T640 320" stroke="rgba(255,255,255,0.5)" strokeWidth="44" fill="none"/>
            <path d="M-20 300 Q200 270 350 360 T640 320" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeDasharray="12 16" fill="none"/>
            <path d="M260 -20 Q300 280 350 480 T440 740" stroke="rgba(255,255,255,0.5)" strokeWidth="36" fill="none"/>
          </svg>
          {/* draggable pin */}
          <div style={{position:'absolute',left:'42%',top:'46%',transform:'translate(-50%,-100%)'}}>
            <div style={{padding:'10px 16px',background:IW,color:LW,borderRadius:14,...mono,fontSize:12,fontWeight:700,letterSpacing:'0.08em',whiteSpace:'nowrap',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}>DROP PIN HERE</div>
            <div style={{width:0,height:0,borderLeft:'7px solid transparent',borderRight:'7px solid transparent',borderTop:`8px solid ${IW}`,margin:'0 auto'}}/>
            <div style={{width:36,height:36,borderRadius:'50% 50% 50% 0',background:LW,border:`4px solid ${IW}`,transform:'rotate(-45deg)',marginTop:6,marginLeft:'auto',marginRight:'auto'}}/>
            <div style={{width:14,height:5,borderRadius:99,background:'rgba(0,0,0,0.2)',marginTop:-2,marginLeft:'auto',marginRight:'auto'}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// W8 — Earnings (full page)
function WebEarnings() {
  return (
    <div style={{minHeight:'100%',background:PW,display:'flex'}}>
      <div style={{width:240,background:IW,color:PW,padding:'24px 18px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',gap:10,alignItems:'center',padding:'4px 8px',marginBottom:20}}>
          <div style={{width:30,height:30,borderRadius:9,background:LW,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IW} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:16,fontWeight:700}}>ParkShare <span style={{color:LW,...mono,fontSize:11,marginLeft:4}}>HOST</span></div>
        </div>
        {[['Dashboard','▭',false],['My spots','▤',false],['Bookings','◷',false],['Earnings','$',true],['Notifications','♥',false],['Profile','◉',false]].map(([l,ic,a])=>(
          <div key={l} style={{padding:'10px 12px',borderRadius:10,background:a?'rgba(255,255,255,0.08)':'transparent',display:'flex',gap:12,alignItems:'center',fontSize:14,fontWeight:a?600:500,color:a?PW:'rgba(246,244,238,0.65)'}}>
            <span style={{width:20,...mono,color:a?LW:'rgba(246,244,238,0.5)'}}>{ic}</span>{l}
          </div>
        ))}
      </div>

      <div style={{flex:1,padding:'28px 36px',overflow:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <div style={{...mono,fontSize:11,color:MW,letterSpacing:'0.08em'}}>EARNINGS</div>
            <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>Money in the door.</h1>
          </div>
          <div style={{display:'flex',gap:10}}>
            <div style={{padding:'10px 14px',background:'#fff',border:`1px solid ${HW}`,borderRadius:10,fontSize:13,fontWeight:600}}>Export CSV</div>
            <div style={{padding:'10px 14px',background:IW,color:PW,borderRadius:10,fontSize:13,fontWeight:600}}>Request payout</div>
          </div>
        </div>

        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14}}>
          <div style={{padding:24,background:IW,color:PW,borderRadius:20,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 90% 10%, rgba(200,255,61,0.15), transparent 50%)`}}/>
            <div style={{position:'relative'}}>
              <div style={{...mono,fontSize:11,color:LW,letterSpacing:'0.08em'}}>YTD EARNINGS</div>
              <div style={{...mono,fontSize:64,fontWeight:700,marginTop:8,letterSpacing:'-0.03em',lineHeight:1}}>$1,284.<span style={{color:'rgba(246,244,238,0.5)',fontSize:40}}>50</span></div>
              <div style={{fontSize:13,color:'rgba(246,244,238,0.6)',marginTop:10}}>across 142 bookings · 7 spots</div>
            </div>

            <div style={{marginTop:30,height:120}}>
              <svg width="100%" height="120" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gE" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={LW} stopOpacity="0.5"/>
                    <stop offset="100%" stopColor={LW} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 90 L40 80 L80 85 L120 70 L160 75 L200 60 L240 65 L280 50 L320 55 L360 38 L400 45 L440 25 L500 18 L500 120 L0 120 Z" fill="url(#gE)"/>
                <path d="M0 90 L40 80 L80 85 L120 70 L160 75 L200 60 L240 65 L280 50 L320 55 L360 38 L400 45 L440 25 L500 18" stroke={LW} strokeWidth="2.5" fill="none"/>
              </svg>
              <div style={{display:'flex',justifyContent:'space-between',...mono,fontSize:10,color:'rgba(246,244,238,0.4)',marginTop:4}}>
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span>
              </div>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              ['NEXT PAYOUT','$184.50','15 May · Friday','lime'],
              ['PENDING','$44.50','from 3 active bookings','soft'],
              ['LIFETIME PAID','$1,099.00','sent to NCC Bank •••• 7741','soft'],
            ].map(([l,v,d,t])=>(
              <div key={l} style={{padding:18,background: t==='lime'? LW : '#fff',borderRadius:16,border: t==='lime'? 'none' : `1px solid ${HW}`}}>
                <div style={{...mono,fontSize:10,color: t==='lime'? IW : MW,letterSpacing:'0.08em'}}>{l}</div>
                <div style={{...mono,fontSize:26,fontWeight:700,marginTop:4}}>{v}</div>
                <div style={{fontSize:11,color: t==='lime'? 'rgba(14,14,12,0.6)' : MW,marginTop:4}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:20,padding:20,background:'#fff',borderRadius:16,border:`1px solid ${HW}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <h3 style={{fontSize:17,fontWeight:700}}>Transactions</h3>
            <div style={{display:'flex',gap:6}}>
              {['All','Paid','Pending','Refunded'].map((t,i)=><div key={t} style={{padding:'6px 10px',borderRadius:8,background: i===0?IW:'transparent',color:i===0?PW:MW,fontSize:11,fontWeight:600}}>{t}</div>)}
            </div>
          </div>
          <table style={{width:'100%',marginTop:14,borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{textAlign:'left',color:MW,...mono,fontSize:10}}>
                <th style={{padding:'8px 0',fontWeight:500}}>DATE</th>
                <th style={{padding:'8px 0',fontWeight:500}}>BOOKING</th>
                <th style={{padding:'8px 0',fontWeight:500}}>DRIVER</th>
                <th style={{padding:'8px 0',fontWeight:500}}>SPOT</th>
                <th style={{padding:'8px 0',fontWeight:500}}>STATUS</th>
                <th style={{padding:'8px 0',fontWeight:500,textAlign:'right'}}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['12 May','PK-4F2A9','Rafiq A.','Cozy driveway','PAID','+$10.50'],
                ['10 May','PK-4F1E8','Nadia S.','Cozy driveway','PAID','+$24.00'],
                ['10 May','PK-4F1A2','Imran K.','Behind garage','PAID','+$3.00'],
                ['8 May','PK-4F0B4','Tahmid R.','Cozy driveway','REFUND','-$11.00'],
                ['7 May','PK-4F092','Sara H.','Side gate','PAID','+$12.00'],
                ['6 May','PK-4F051','Maya B.','Cozy driveway','PAID','+$6.00'],
                ['4 May','PK-4F008','Nadia S.','Behind garage','PAID','+$40.00'],
              ].map((r,i)=>(
                <tr key={i} style={{borderTop:`1px solid ${HW}`}}>
                  <td style={{padding:'12px 0',...mono,color:MW}}>{r[0]}</td>
                  <td style={{padding:'12px 0',...mono,fontWeight:600}}>{r[1]}</td>
                  <td style={{padding:'12px 0',fontWeight:500}}>{r[2]}</td>
                  <td style={{padding:'12px 0',color:MW}}>{r[3]}</td>
                  <td style={{padding:'12px 0'}}><span style={{padding:'3px 8px',borderRadius:99,fontSize:10,...mono,fontWeight:600,background: r[4]==='REFUND'?'#FFE0CF':LW,color: r[4]==='REFUND'?'#9A4310':IW}}>{r[4]}</span></td>
                  <td style={{padding:'12px 0',textAlign:'right',...mono,fontWeight:700,color: r[5].startsWith('-')?'#9A4310':IW}}>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.WebLanding = WebLanding;
window.WebLogin = WebLogin;
window.WebSearch = WebSearch;
window.WebSpotDetails = WebSpotDetails;
window.WebHostDash = WebHostDash;
window.WebAdmin = WebAdmin;
window.WebAddSpot = WebAddSpot;
window.WebEarnings = WebEarnings;
