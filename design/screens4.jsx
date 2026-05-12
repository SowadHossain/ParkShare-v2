// Auth + welcome + driver dashboard + utility screens

const { INK: I4, PAPER: P4, PAPER2: P4b, LIME: L4, MUTED: M4, HAIRLINE: H4 } = window.PSColors;

// shared atoms
function Logo({ dark = false }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:34,height:34,borderRadius:10,background:L4,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={I4} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
      </div>
      <div style={{fontSize:20,fontWeight:700,letterSpacing:'-0.02em',color: dark? P4 : I4}}>ParkShare</div>
    </div>
  );
}
function Field({label, value, ph}) {
  return (
    <div>
      <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>{label}</div>
      <div style={{marginTop:6,padding:'14px 16px',background:'#fff',borderRadius:14,border:`1px solid ${H4}`,fontSize:15, color: value? I4 : M4}}>{value || ph}</div>
    </div>
  );
}
function TopBack({label, dark=false}) {
  const bg = dark ? 'rgba(255,255,255,0.08)' : '#fff';
  const stroke = dark ? P4 : I4;
  return (
    <div style={{padding:'62px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{width:40,height:40,borderRadius:14,background:bg,display:'flex',alignItems:'center',justifyContent:'center',border:dark?'none':`1px solid ${H4}`}}>
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{fontSize:11,color: dark? 'rgba(255,255,255,0.5)' : M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>{label}</div>
      <div style={{width:40}}/>
    </div>
  );
}

// 11 — Login
function ScreenLogin() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P4,padding:'62px 24px 38px',display:'flex',flexDirection:'column'}}>
      <Style/>
      <Logo/>
      <div style={{marginTop:40}}>
        <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>SIGN IN</div>
        <h1 style={{fontSize:32,fontWeight:700,marginTop:6,lineHeight:1.08}}>Welcome back.</h1>
      </div>
      <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:14}}>
        <Field label="EMAIL" value="rafiq@northsouth.edu"/>
        <Field label="PASSWORD" value="••••••••••"/>
        <div style={{textAlign:'right',fontSize:13,fontWeight:600,color:M4}}>Forgot password?</div>
      </div>
      <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:10}}>
        <PillButton big>Sign in</PillButton>
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'14px 4px'}}>
          <div style={{flex:1,height:1,background:H4}}/>
          <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace'}}>OR</div>
          <div style={{flex:1,height:1,background:H4}}/>
        </div>
        <div style={{height:56,borderRadius:99,background:'#fff',border:`1px solid ${H4}`,display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:15,fontWeight:600}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.6 9.2c0-.7-.06-1.4-.18-2H9v3.8h4.84a4.14 4.14 0 01-1.8 2.7v2.25h2.92c1.7-1.57 2.7-3.9 2.7-6.75z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.55-1.84.87-3.04.87-2.34 0-4.32-1.58-5.02-3.7H.95v2.32A9 9 0 009 18z" fill="#34A853"/><path d="M3.98 10.73a5.41 5.41 0 010-3.46V4.96H.95a9 9 0 000 8.08l3.03-2.31z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 00.95 4.96l3.03 2.3C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </div>
        <div style={{textAlign:'center',fontSize:14,color:M4,marginTop:14}}>New here? <span style={{color:I4,fontWeight:600}}>Create account</span></div>
      </div>
    </div>
  );
}

// 12 — Register (with role picker)
function ScreenRegister() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P4,overflow:'hidden'}}>
      <Style/>
      <TopBack label="STEP 1 OF 2"/>
      <div style={{padding:'0 24px'}}>
        <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>SIGN UP</div>
        <h1 style={{fontSize:30,fontWeight:700,marginTop:6,lineHeight:1.08}}>How will you<br/>use ParkShare?</h1>
        <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:12}}>
          {[
            {k:'driver',t:'I need parking',s:'Find driveways by the hour',a:true,ic:<path d="M3 17V8a3 3 0 013-3h2l1-2h2l1 2h2a3 3 0 013 3v9" stroke={I4} strokeWidth="1.6" fill="none"/>},
            {k:'host',t:'I have a driveway',s:'Earn passive income',a:false,ic:<path d="M3 18V8l8-5 8 5v10h-5v-6H8v6H3z" stroke={I4} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>},
          ].map(r=>(
            <div key={r.k} style={{padding:18,borderRadius:20,background: r.a? I4 : '#fff', color: r.a? P4 : I4, border: r.a? 'none' : `1px solid ${H4}`,display:'flex',gap:14,alignItems:'center'}}>
              <div style={{width:48,height:48,borderRadius:12,background: r.a? L4 : P4b,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="22" height="22" viewBox="0 0 22 22">{r.ic}</svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700}}>{r.t}</div>
                <div style={{fontSize:13,color: r.a? 'rgba(246,244,238,0.6)' : M4, marginTop:2}}>{r.s}</div>
              </div>
              <div style={{width:24,height:24,borderRadius:99,background: r.a? L4 : 'transparent', border: r.a? 'none' : `2px solid ${H4}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {r.a && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke={I4} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:18,fontSize:12,color:M4,lineHeight:1.5}}>You can switch roles later from your profile.</div>
      </div>
      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 24px 38px'}}>
        <PillButton big>Continue · Driver</PillButton>
      </div>
    </div>
  );
}

// 13 — Driver Welcome (3-step intro)
function ScreenDriverWelcome() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:I4,color:P4,overflow:'hidden'}}>
      <Style/>
      <div style={{position:'absolute',inset:0,opacity:0.12}}><MapBg tone="night" me={null} pins={[]}/></div>
      <div style={{position:'absolute',top:62,left:24,right:24,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Logo dark/>
        <div style={{fontSize:13,color:'rgba(246,244,238,0.6)'}}>Skip</div>
      </div>
      <div style={{position:'absolute',top:140,left:24,right:24}}>
        <div style={{display:'flex',gap:6}}>
          {[1,0,0].map((a,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background: a? L4 : 'rgba(246,244,238,0.18)'}}/>)}
        </div>
      </div>

      {/* big visual */}
      <div style={{position:'absolute',top:200,left:0,right:0,display:'flex',justifyContent:'center'}}>
        <div style={{position:'relative',width:280,height:280}}>
          <div style={{position:'absolute',inset:0,borderRadius:99,background:'rgba(200,255,61,0.15)'}}/>
          <div style={{position:'absolute',inset:30,borderRadius:99,background:'rgba(200,255,61,0.25)'}}/>
          <div style={{position:'absolute',inset:70,borderRadius:99,background:L4,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="36" r="22" stroke={I4} strokeWidth="4" fill="none"/>
              <circle cx="40" cy="36" r="7" fill={I4}/>
              <path d="M40 58v14M30 68h20" stroke={I4} strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{position:'absolute',top:520,left:24,right:24}}>
        <div style={{fontSize:11,color:L4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.12em'}}>① FIND</div>
        <h1 style={{fontSize:34,fontWeight:700,marginTop:8,lineHeight:1.05}}>Open spots,<br/>right near you.</h1>
        <p style={{fontSize:15,color:'rgba(246,244,238,0.65)',marginTop:12,lineHeight:1.5}}>
          See real driveways on a live map. Filter by price, vehicle size, or covered parking.
        </p>
      </div>

      <div style={{position:'absolute',left:24,right:24,bottom:38,display:'flex',gap:12}}>
        <div style={{flex:1}}><PillButton big>Continue</PillButton></div>
        <div style={{width:60,height:60,borderRadius:99,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M6 11h12M14 6l5 5-5 5" stroke={P4} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}

// 14 — Driver dashboard (home)
function ScreenDriverHome() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P4,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 4px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>GOOD AFTERNOON</div>
          <h1 style={{fontSize:28,fontWeight:700,marginTop:4}}>Where to, Rafiq?</h1>
        </div>
        <div style={{width:44,height:44,borderRadius:99,background:'#D4C8AA',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>R</div>
      </div>

      {/* big search bar */}
      <div style={{margin:'16px 20px 0',padding:'14px 16px',background:'#fff',borderRadius:18,border:`1px solid ${H4}`,display:'flex',alignItems:'center',gap:12,boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
        <div style={{width:36,height:36,borderRadius:10,background:L4,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={I4} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={I4} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{flex:1,fontSize:15,color:M4}}>Where do you need to park?</div>
      </div>

      {/* active booking strip */}
      <div style={{margin:'14px 20px 0',padding:14,background:I4,color:P4,borderRadius:18,display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:8,height:48,borderRadius:99,background:L4}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:L4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>ACTIVE NOW</div>
          <div style={{fontSize:15,fontWeight:600,marginTop:2}}>Cozy driveway · 2h 14m left</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" stroke={L4} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* quick picks */}
      <div style={{margin:'22px 20px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:10}}>
          <h3 style={{fontSize:17,fontWeight:700}}>Saved spots</h3>
          <div style={{fontSize:13,color:M4}}>See all</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            ['Near my office','Gulshan 2','3'],
            ['Mon yoga class','Banani 11','2'],
            ['Mum\'s building','Dhanmondi 27','5'],
          ].map(([t,a,p],i)=>(
            <div key={i} style={{padding:14,background:'#fff',borderRadius:16,border:`1px solid ${H4}`,display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:P4b,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1L9.7 5.5 14.5 6l-3.7 3.3.9 4.7L8 11.5 4.3 14l.9-4.7L1.5 6 6.3 5.5z" fill={I4}/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{t}</div>
                <div style={{fontSize:12,color:M4,marginTop:2}}>{a}</div>
              </div>
              <div className="num" style={{fontSize:16,fontWeight:700}}>${p}<span style={{fontSize:11,fontWeight:400,color:M4}}>/hr</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* explore tile */}
      <div style={{margin:'22px 20px 100px',padding:18,background:L4,borderRadius:22,position:'relative',overflow:'hidden'}}>
        <div style={{fontSize:11,color:I4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>NEW IN GULSHAN</div>
        <div style={{fontSize:20,fontWeight:700,marginTop:6,lineHeight:1.2}}>14 fresh spots<br/>under <span className="num">$4/hr</span></div>
        <div style={{marginTop:14,display:'inline-flex',padding:'10px 16px',borderRadius:99,background:I4,color:P4,fontSize:13,fontWeight:600}}>Explore →</div>
      </div>

      <div style={{position:'absolute',left:14,right:14,bottom:24,background:I4,borderRadius:28,padding:'10px 14px',display:'flex',justifyContent:'space-around',boxShadow:'0 14px 36px rgba(0,0,0,0.22)'}}>
        {[['Home',true],['Search',false],['Trips',false],['Profile',false]].map(([l,a])=>(
          <div key={l} style={{padding:'8px 12px',borderRadius:99,background: a? L4 : 'transparent', color: a? I4 : P4,fontSize:13,fontWeight:600}}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// 15 — Checkout Review (between booking and payment)
function ScreenCheckoutReview() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P4,overflow:'hidden'}}>
      <Style/>
      <TopBack label="STEP 2 OF 3"/>
      <div style={{padding:'0 20px'}}>
        <div style={{fontSize:11,color:M4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>REVIEW</div>
        <h1 style={{fontSize:30,fontWeight:700,marginTop:6,lineHeight:1.08}}>Looks good?</h1>
        <p style={{fontSize:14,color:M4,marginTop:8}}>You won't be charged until you tap Pay.</p>
      </div>

      <div style={{margin:'20px 20px 0',padding:16,background:'#fff',borderRadius:20,border:`1px solid ${H4}`}}>
        <div style={{display:'flex',gap:12}}>
          <div style={{width:64,height:64,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600}}>Cozy driveway by the lake</div>
            <div style={{fontSize:12,color:M4,marginTop:2}}>Road 113, Gulshan 2</div>
            <div style={{fontSize:12,color:M4,marginTop:4}}>★ 4.9 · Hosted by Mrs Khan</div>
          </div>
        </div>
      </div>

      <div style={{margin:'14px 20px 0',padding:16,background:'#fff',borderRadius:20,border:`1px solid ${H4}`}}>
        {[
          ['Date','Tue 13 May'],
          ['Time','2:00 – 5:30 PM'],
          ['Duration','3h 30m'],
          ['Vehicle','Toyota Axio · DHA-1294'],
        ].map(([k,v],i,arr)=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom: i<arr.length-1? `1px solid ${H4}` : 'none'}}>
            <div style={{fontSize:13,color:M4}}>{k}</div>
            <div style={{fontSize:14,fontWeight:600}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{margin:'14px 20px 0',padding:'14px 16px',background:L4,borderRadius:16,display:'flex',alignItems:'center',gap:10}}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 1L11 6h5l-4 3 1.5 5L9 11.5 4.5 14 6 9 2 6h5z" fill={I4}/></svg>
        <div style={{fontSize:13,fontWeight:600}}>Free cancellation up to 1 hour before start</div>
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 20px 38px',background:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,borderTop:`1px solid ${H4}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:12}}>
          <div style={{fontSize:14,color:M4}}>Total</div>
          <div className="num" style={{fontSize:26,fontWeight:700}}>$11.00</div>
        </div>
        <PillButton big>Pay now →</PillButton>
      </div>
    </div>
  );
}

window.ScreenLogin = ScreenLogin;
window.ScreenRegister = ScreenRegister;
window.ScreenDriverWelcome = ScreenDriverWelcome;
window.ScreenDriverHome = ScreenDriverHome;
window.ScreenCheckoutReview = ScreenCheckoutReview;
window.Logo = Logo; window.Field = Field; window.TopBack = TopBack;
