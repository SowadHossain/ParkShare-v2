// Additional desktop web screens — fills out PRD page list.
// All visuals reuse the same ink/paper/lime tokens + DM Sans + JetBrains Mono as mobile.

const C = window.PSColors;
const { INK:IK, PAPER:PR, PAPER2:PR2, LIME:LM, MUTED:MU, HAIRLINE:HL } = C;
const mn = {fontFamily:'"JetBrains Mono",monospace'};
const Mo = ({c,s={}})=> <span style={{...mn,...s}}>{c}</span>;

// shared layouts
function PubShell({active,children,dark=false}) {
  const fg = dark?PR:IK, sub = dark?'rgba(246,244,238,0.62)':MU;
  return (
    <div style={{minHeight:'100%',background:dark?IK:PR,color:fg}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 56px',borderBottom: dark?'1px solid rgba(255,255,255,0.08)':`1px solid ${HL}`}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:34,height:34,borderRadius:10,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IK} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:18,fontWeight:700,letterSpacing:'-0.02em'}}>ParkShare</div>
        </div>
        <div style={{display:'flex',gap:30}}>
          {['Home','Find parking','How it works','For hosts','About'].map(t=><div key={t} style={{fontSize:14,fontWeight:active===t?600:500,color:active===t?fg:sub}}>{t}</div>)}
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{fontSize:14,color:sub}}>Sign in</div>
          <div style={{padding:'10px 18px',background:LM,color:IK,borderRadius:99,fontSize:14,fontWeight:600}}>Get started →</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function PortalShell({role='driver',active,children}) {
  const items = role==='driver'
    ? [['Dashboard','▭'],['Find parking','◎'],['Bookings','◷'],['Notifications','♥'],['Profile','◉']]
    : role==='host'
    ? [['Dashboard','▭'],['My spots','▤'],['Bookings','◷'],['Earnings','$'],['Notifications','♥'],['Profile','◉']]
    : [['Overview','▭'],['Users','◉'],['Spots','▤'],['Reviews','★'],['Bookings','◷'],['Reports','⚠']];
  const tag = role==='admin'?'ADMIN':role==='host'?'HOST':'DRIVER';
  const sideBg = role==='admin'?'#08080A':IK;
  return (
    <div style={{minHeight:'100%',background:PR,display:'flex'}}>
      <div style={{width:role==='admin'?220:240,background:sideBg,color:PR,padding:'24px 18px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',gap:10,alignItems:'center',padding:'4px 8px',marginBottom:18}}>
          <div style={{width:30,height:30,borderRadius:9,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IK} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:16,fontWeight:700}}>ParkShare <span style={{color:LM,...mn,fontSize:11,marginLeft:4}}>{tag}</span></div>
        </div>
        {items.map(([l,ic])=>{
          const a = active===l;
          return (
            <div key={l} style={{padding:'10px 12px',borderRadius:10,background:a?'rgba(255,255,255,0.08)':'transparent',display:'flex',gap:12,alignItems:'center',fontSize:14,fontWeight:a?600:500,color:a?PR:'rgba(246,244,238,0.65)'}}>
              <span style={{width:20,...mn,color:a?LM:'rgba(246,244,238,0.5)'}}>{ic}</span>{l}
            </div>
          );
        })}
      </div>
      <div style={{flex:1,padding:'28px 36px',overflow:'auto'}}>{children}</div>
    </div>
  );
}

function Card({c,style={}}) { return <div style={{padding:18,background:'#fff',borderRadius:16,border:`1px solid ${HL}`,...style}}>{c}</div>; }
function Btn({c,p=true}) { return <div style={{padding:'12px 22px',background:p?IK:'#fff',color:p?PR:IK,border:p?'none':`1px solid ${HL}`,borderRadius:99,fontSize:14,fontWeight:600,display:'inline-block'}}>{c}</div>; }
function Chip({c,t='soft'}) { const bg=t==='lime'?LM:t==='warn'?'#FFE0CF':t==='ink'?IK:PR2; const fg=t==='ink'?LM:t==='warn'?'#9A4310':IK; return <span style={{padding:'3px 9px',borderRadius:99,background:bg,color:fg,fontSize:10,fontWeight:700,...mn,letterSpacing:'0.05em'}}>{c}</span>; }
function Lbl({c}) { return <div style={{...mn,fontSize:11,color:MU,letterSpacing:'0.08em'}}>{c}</div>; }

// W9 — Register
function WebRegister() {
  return (
    <div style={{minHeight:'100%',background:PR,display:'flex'}}>
      <div style={{flex:1.05,padding:'56px',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:34,height:34,borderRadius:10,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IK} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:20,fontWeight:700}}>ParkShare</div>
        </div>
        <div style={{margin:'auto 0',maxWidth:460}}>
          <Lbl c="STEP 1 OF 2"/>
          <h1 style={{fontSize:46,fontWeight:700,lineHeight:1,letterSpacing:'-0.02em',marginTop:8}}>How will you<br/>use ParkShare?</h1>
          <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:12}}>
            {[
              {k:'I need parking',s:'Find driveways by the hour',a:true,ic:<path d="M3 17V8a3 3 0 013-3h2l1-2h2l1 2h2a3 3 0 013 3v9" stroke="currentColor" strokeWidth="1.6" fill="none"/>},
              {k:'I have a driveway',s:'Earn passive income',a:false,ic:<path d="M3 18V8l8-5 8 5v10h-5v-6H8v6H3z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>},
            ].map(r=>(
              <div key={r.k} style={{padding:18,borderRadius:16,background: r.a?IK:'#fff',color:r.a?PR:IK,border:r.a?'none':`1px solid ${HL}`,display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:48,height:48,borderRadius:12,background:r.a?LM:PR2,display:'flex',alignItems:'center',justifyContent:'center',color:IK}}>
                  <svg width="22" height="22" viewBox="0 0 22 22">{r.ic}</svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:700}}>{r.k}</div>
                  <div style={{fontSize:13,color:r.a?'rgba(246,244,238,0.6)':MU,marginTop:2}}>{r.s}</div>
                </div>
                <div style={{width:22,height:22,borderRadius:99,background:r.a?LM:'transparent',border:r.a?'none':`2px solid ${HL}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {r.a && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke={IK} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div><Lbl c="FULL NAME"/><div style={{marginTop:6,padding:'12px 14px',background:'#fff',borderRadius:10,border:`1px solid ${HL}`,fontSize:14}}>Rafiq Ahmed</div></div>
            <div><Lbl c="EMAIL"/><div style={{marginTop:6,padding:'12px 14px',background:'#fff',borderRadius:10,border:`1px solid ${HL}`,fontSize:14}}>rafiq@nsu.edu</div></div>
          </div>
          <div style={{marginTop:18}}><Btn c="Continue · Driver →"/></div>
        </div>
        <Lbl c="© 2026 · CSE482"/>
      </div>
      <div style={{flex:1,background:IK,color:PR,padding:56,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 30%, rgba(200,255,61,0.18), transparent 60%)'}}/>
        <div style={{position:'relative',...mn,fontSize:12,color:LM,letterSpacing:'0.16em'}}>● JOIN 1,284 PEOPLE</div>
        <h2 style={{position:'relative',fontSize:42,fontWeight:700,marginTop:14,lineHeight:1.02,letterSpacing:'-0.02em'}}>The Dhaka<br/>parking marketplace.</h2>
      </div>
    </div>
  );
}

// W10 — How it works (public)
function WebHowItWorks() {
  return (
    <PubShell active="How it works">
      <div style={{padding:'72px 56px 40px',textAlign:'center'}}>
        <Lbl c="HOW IT WORKS"/>
        <h1 style={{fontSize:68,fontWeight:700,marginTop:10,letterSpacing:'-0.03em',lineHeight:1}}>Park in three taps.<br/>Earn in three steps.</h1>
      </div>
      <div style={{padding:'0 56px 60px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {[
            {h:'FOR DRIVERS', steps:[['01','Search the map','Driveways near you, real-time.'],['02','Pick your time','Hourly. Live total. No surprises.'],['03','Park & go','Pay with Stripe. Done.']]},
            {h:'FOR HOSTS', steps:[['01','List your driveway','3 minutes, 4 short screens.'],['02','Approve bookings','Auto or one-tap approve.'],['03','Get paid','Weekly payout to your bank.']]},
          ].map((col,i)=>(
            <div key={col.h} style={{padding:32,background:i===0?'#fff':IK,color:i===0?IK:PR,borderRadius:24,border:i===0?`1px solid ${HL}`:'none'}}>
              <Lbl c={col.h}/>
              <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:14}}>
                {col.steps.map(([n,t,s])=>(
                  <div key={n} style={{display:'flex',gap:18,paddingTop:14,borderTop:i===0?`1px solid ${HL}`:'1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{...mn,fontSize:38,fontWeight:700,color:i===0?IK:LM,letterSpacing:'-0.02em',lineHeight:1}}>{n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:20,fontWeight:700}}>{t}</div>
                      <div style={{fontSize:14,color:i===0?MU:'rgba(246,244,238,0.55)',marginTop:4,lineHeight:1.5}}>{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'40px 56px',background:LM,color:IK,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em'}}>Ready to park or list?</div>
        <div style={{display:'flex',gap:10}}><Btn c="Find parking →"/><Btn c="List your driveway" p={false}/></div>
      </div>
    </PubShell>
  );
}

// W11 — 404
function Web404() {
  return (
    <PubShell active="">
      <div style={{padding:'120px 56px',textAlign:'center'}}>
        <Lbl c="404 · NOT FOUND"/>
        <div style={{...mn,fontSize:160,fontWeight:700,letterSpacing:'-0.04em',marginTop:14,lineHeight:1}}>404</div>
        <h1 style={{fontSize:36,fontWeight:700,marginTop:8,letterSpacing:'-0.02em'}}>This driveway doesn't exist.</h1>
        <p style={{fontSize:16,color:MU,marginTop:14,maxWidth:520,margin:'14px auto 0'}}>The page you're looking for got towed. Let's get you back somewhere useful.</p>
        <div style={{marginTop:30,display:'flex',gap:10,justifyContent:'center'}}><Btn c="Go home →"/><Btn c="Find parking" p={false}/></div>
      </div>
    </PubShell>
  );
}

// W12 — Driver welcome
function WebDriverWelcome() {
  return (
    <div style={{minHeight:'100%',background:IK,color:PR,padding:56,display:'flex',flexDirection:'column',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 80% 20%, rgba(200,255,61,0.12), transparent 60%)'}}/>
      <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:34,height:34,borderRadius:10,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={IK} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:18,fontWeight:700}}>ParkShare</div>
        </div>
        <div style={{fontSize:13,color:'rgba(246,244,238,0.6)'}}>Skip onboarding</div>
      </div>
      <div style={{position:'relative',margin:'auto',maxWidth:1100,width:'100%',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <div style={{display:'flex',gap:6,marginBottom:20}}>{[1,0,0].map((a,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:a?LM:'rgba(246,244,238,0.15)'}}/>)}</div>
          <Lbl c="① FIND"/>
          <h1 style={{fontSize:64,fontWeight:700,marginTop:10,lineHeight:1,letterSpacing:'-0.03em'}}>Open spots,<br/>right near you.</h1>
          <p style={{fontSize:17,color:'rgba(246,244,238,0.65)',marginTop:18,lineHeight:1.55,maxWidth:480}}>See real driveways on a live map. Filter by price, vehicle size, or covered parking.</p>
          <div style={{marginTop:32,display:'flex',gap:10}}>
            <div style={{padding:'14px 22px',background:LM,color:IK,borderRadius:99,fontSize:15,fontWeight:600}}>Continue →</div>
            <div style={{padding:'14px 22px',border:'1px solid rgba(246,244,238,0.2)',borderRadius:99,fontSize:15,fontWeight:500}}>Skip</div>
          </div>
        </div>
        <div style={{position:'relative',width:480,height:480,margin:'0 auto'}}>
          <div style={{position:'absolute',inset:0,borderRadius:99,background:'rgba(200,255,61,0.12)'}}/>
          <div style={{position:'absolute',inset:60,borderRadius:99,background:'rgba(200,255,61,0.22)'}}/>
          <div style={{position:'absolute',inset:120,borderRadius:99,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="140" height="140" viewBox="0 0 80 80"><circle cx="40" cy="36" r="22" stroke={IK} strokeWidth="4" fill="none"/><circle cx="40" cy="36" r="7" fill={IK}/><path d="M40 58v14M30 68h20" stroke={IK} strokeWidth="4" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// W13 — Driver dashboard
function WebDriverDash() {
  return (
    <PortalShell role="driver" active="Dashboard">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="GOOD AFTERNOON · RAFIQ"/><h1 style={{fontSize:36,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Where to today?</h1></div>
        <Btn c="Find parking →"/>
      </div>
      {/* search */}
      <div style={{marginTop:22,padding:18,background:'#fff',borderRadius:18,border:`1px solid ${HL}`,display:'flex',gap:14,alignItems:'center',boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
        <div style={{width:44,height:44,borderRadius:12,background:LM,display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="18" height="18" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={IK} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={IK} strokeWidth="2" strokeLinecap="round"/></svg></div>
        <div style={{flex:1,fontSize:16,color:MU}}>Where do you need to park?</div>
        <Mo c="Tue 13 May" s={{fontSize:12,color:MU}}/>
      </div>
      {/* active */}
      <div style={{marginTop:14,padding:18,background:IK,color:PR,borderRadius:18,display:'flex',gap:14,alignItems:'center'}}>
        <div style={{width:8,height:54,borderRadius:99,background:LM}}/>
        <div style={{flex:1}}>
          <Mo c="ACTIVE NOW · 2H 14M LEFT" s={{fontSize:11,color:LM,letterSpacing:'0.08em'}}/>
          <div style={{fontSize:17,fontWeight:600,marginTop:4}}>Cozy driveway by the lake</div>
          <div style={{fontSize:12,color:'rgba(246,244,238,0.55)',marginTop:2}}>Road 113, Gulshan 2 · Mrs Khan</div>
        </div>
        <Btn c="View booking →"/>
      </div>
      {/* 2col */}
      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14}}>
        <Card c={<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}><h3 style={{fontSize:17,fontWeight:700}}>Saved spots</h3><div style={{fontSize:13,color:MU}}>See all →</div></div>
          <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8}}>
            {[['Near my office','Gulshan 2','3'],["Mon yoga class","Banani 11",'2'],['Mum\'s building','Dhanmondi 27','5'],['Saturday market','Mohakhali','4']].map(([t,a,p],i)=>(
              <div key={i} style={{padding:12,borderRadius:12,border:`1px solid ${HL}`,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:34,height:34,borderRadius:10,background:PR2,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1L9.7 5.5 14.5 6l-3.7 3.3.9 4.7L8 11.5 4.3 14l.9-4.7L1.5 6 6.3 5.5z" fill={IK}/></svg>
                </div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:MU,marginTop:1}}>{a}</div></div>
                <Mo c={`$${p}/hr`} s={{fontSize:14,fontWeight:700}}/>
              </div>
            ))}
          </div>
        </>}/>
        <div style={{padding:24,background:LM,borderRadius:18,position:'relative',overflow:'hidden'}}>
          <Lbl c="NEW IN GULSHAN"/>
          <div style={{fontSize:28,fontWeight:700,marginTop:8,lineHeight:1.1,letterSpacing:'-0.02em'}}>14 fresh spots<br/>under <Mo c="$4/hr"/></div>
          <div style={{marginTop:20}}><Btn c="Explore →"/></div>
          <div style={{marginTop:18,paddingTop:18,borderTop:'1px solid rgba(14,14,12,0.15)',fontSize:13,fontWeight:500}}>Avg ★ 4.7 · 230m–1.2km</div>
        </div>
      </div>
    </PortalShell>
  );
}

// W14 — Booking form
function WebBookingForm() {
  return (
    <PortalShell role="driver" active="Find parking">
      <Lbl c="BOOK · STEP 1 OF 3"/>
      <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>Pick your time.</h1>
      <div style={{marginTop:22,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18}}>
        <Card c={<>
          <Lbl c="DATE"/>
          <div style={{marginTop:10,display:'flex',gap:6}}>
            {['MON 12','TUE 13','WED 14','THU 15','FRI 16','SAT 17','SUN 18'].map((d,i)=>(
              <div key={d} style={{flex:1,padding:'12px 0',borderRadius:10,background:i===1?IK:PR2,color:i===1?PR:IK,fontSize:12,fontWeight:600,textAlign:'center',...mn}}>{d}</div>
            ))}
          </div>
          <div style={{marginTop:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div><Lbl c="FROM"/><div style={{marginTop:8,padding:'18px 20px',background:PR2,borderRadius:14}}><Mo c="2:00 PM" s={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em'}}/></div></div>
            <div><Lbl c="TO"/><div style={{marginTop:8,padding:'18px 20px',background:PR2,borderRadius:14}}><Mo c="5:30 PM" s={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em'}}/></div></div>
          </div>
          <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
            {['+30m','+1h','+2h','+3h','+ half day'].map(t=><div key={t} style={{padding:'8px 12px',background:'#fff',border:`1px solid ${HL}`,borderRadius:99,fontSize:12,fontWeight:600}}>{t}</div>)}
          </div>
          <div style={{marginTop:24}}><Lbl c="VEHICLE"/>
            <div style={{marginTop:8,padding:'12px 14px',background:'#fff',border:`1px solid ${HL}`,borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontSize:14,fontWeight:600}}>Toyota Axio · DHA-1294</div><div style={{fontSize:11,color:MU,marginTop:2}}>Sedan · default</div></div>
              <div style={{fontSize:13,color:MU}}>Change ↓</div>
            </div>
          </div>
        </>}/>
        <Card style={{position:'sticky',top:20}} c={<>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <Mo c="$3" s={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em'}}/>
            <span style={{fontSize:14,color:MU}}>/ hr · Cozy driveway</span>
          </div>
          <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:10,fontSize:13}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>3.5 hours × $3</span><Mo c="$10.50"/></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>Service fee</span><Mo c="$0.00"/></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>Discount (1st booking)</span><Mo c="-$1.50" s={{color:'#3D7A18'}}/></div>
          </div>
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${HL}`,display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:18}}><span>Total</span><Mo c="$9.00"/></div>
          <div style={{marginTop:16,height:52,borderRadius:99,background:IK,color:PR,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:600}}>Continue to review →</div>
          <div style={{marginTop:10,fontSize:11,color:MU,textAlign:'center'}}>Free cancellation up to 1h before</div>
        </>}/>
      </div>
    </PortalShell>
  );
}

// W15 — Checkout review
function WebCheckoutReview() {
  return (
    <PortalShell role="driver" active="Find parking">
      <Lbl c="BOOK · STEP 2 OF 3"/>
      <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>Looks good?</h1>
      <p style={{fontSize:14,color:MU,marginTop:6}}>You won't be charged until you tap Pay.</p>
      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Card c={<div style={{display:'flex',gap:14}}>
            <div style={{width:80,height:80,borderRadius:14,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:700}}>Cozy driveway by the lake</div>
              <div style={{fontSize:13,color:MU,marginTop:2}}>Road 113, Gulshan 2</div>
              <div style={{fontSize:13,color:MU,marginTop:6}}>★ 4.9 · 28 reviews · Hosted by Mrs Khan</div>
            </div>
          </div>}/>
          <Card c={<>
            <Lbl c="YOUR RESERVATION"/>
            <div style={{marginTop:10}}>
              {[['Date','Tue 13 May'],['Time','2:00 – 5:30 PM'],['Duration','3h 30m'],['Vehicle','Toyota Axio · DHA-1294']].map(([k,v],i,a)=>(
                <div key={k} style={{padding:'10px 0',display:'flex',justifyContent:'space-between',borderBottom:i<a.length-1?`1px solid ${HL}`:'none'}}>
                  <span style={{fontSize:13,color:MU}}>{k}</span><span style={{fontSize:14,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}/>
          <div style={{padding:'14px 18px',background:LM,borderRadius:14,display:'flex',gap:12,alignItems:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M9 1L11 6h5l-4 3 1.5 5L9 11.5 4.5 14 6 9 2 6h5z" fill={IK}/></svg>
            <div style={{fontSize:14,fontWeight:600}}>Free cancellation up to 1 hour before start</div>
          </div>
        </div>
        <Card style={{position:'sticky',top:20}} c={<>
          <Lbl c="PAYMENT SUMMARY"/>
          <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8,fontSize:13}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>$3 × 3.5h</span><Mo c="$10.50"/></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>Service fee</span><Mo c="$0.50"/></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:MU}}>Tax</span><Mo c="$0.00"/></div>
          </div>
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px dashed ${HL}`,display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:18}}><span>Total</span><Mo c="$11.00"/></div>
          <div style={{marginTop:16,padding:12,background:PR2,borderRadius:10,display:'flex',gap:10,alignItems:'center'}}>
            <div style={{width:34,height:24,borderRadius:4,background:'#1A1F71',color:'#fff',fontSize:8,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>VISA</div>
            <Mo c="•••• 4242" s={{fontSize:13,fontWeight:600,flex:1}}/>
            <div style={{fontSize:12,color:MU}}>Change</div>
          </div>
          <div style={{marginTop:14,height:52,borderRadius:99,background:IK,color:PR,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:600}}>Pay now →</div>
        </>}/>
      </div>
    </PortalShell>
  );
}

// W16 — Payment (Stripe Elements)
function WebPayment() {
  return (
    <PortalShell role="driver" active="Find parking">
      <Lbl c="BOOK · STEP 3 OF 3"/>
      <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>Payment.</h1>
      <p style={{fontSize:14,color:MU,marginTop:6}}>Secure · Powered by Stripe (test mode)</p>
      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18}}>
        <Card c={<>
          <div style={{display:'flex',gap:6}}>
            {['Card','GPay','bKash'].map((t,i)=><div key={t} style={{padding:'10px 16px',borderRadius:10,background:i===0?IK:PR2,color:i===0?PR:IK,fontSize:13,fontWeight:600}}>{t}</div>)}
          </div>
          <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:12}}>
            <div><Lbl c="CARD NUMBER"/>
              <div style={{marginTop:6,padding:'14px 16px',background:PR2,borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Mo c="4242 4242 4242 4242" s={{fontSize:17,letterSpacing:'0.1em'}}/>
                <div style={{display:'flex',gap:4}}><div style={{width:30,height:20,borderRadius:3,background:'#1A1F71'}}/><div style={{width:30,height:20,borderRadius:3,background:'#EB001B'}}/></div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><Lbl c="EXPIRY"/><div style={{marginTop:6,padding:'14px 16px',background:PR2,borderRadius:12}}><Mo c="12 / 27" s={{fontSize:17}}/></div></div>
              <div><Lbl c="CVC"/><div style={{marginTop:6,padding:'14px 16px',background:PR2,borderRadius:12}}><Mo c="123" s={{fontSize:17}}/></div></div>
            </div>
            <div><Lbl c="CARDHOLDER NAME"/><div style={{marginTop:6,padding:'14px 16px',background:PR2,borderRadius:12,fontSize:15}}>Rafiq Ahmed</div></div>
            <label style={{display:'flex',gap:10,alignItems:'center',fontSize:13,color:MU,marginTop:6}}>
              <span style={{width:18,height:18,borderRadius:5,background:IK,display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5l2.5 3L9 1" stroke={LM} strokeWidth="2" fill="none" strokeLinecap="round"/></svg></span>
              Save card for next time
            </label>
          </div>
        </>}/>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Card c={<>
            <Lbl c="YOU'RE PAYING"/>
            <Mo c="$11.00" s={{fontSize:36,fontWeight:700,marginTop:4,letterSpacing:'-0.02em',display:'block'}}/>
            <div style={{fontSize:13,color:MU,marginTop:4}}>Cozy driveway · 3h 30m</div>
            <div style={{marginTop:16,height:52,borderRadius:99,background:IK,color:PR,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:600}}>Pay $11.00 →</div>
            <div style={{marginTop:10,...mn,fontSize:11,color:MU,textAlign:'center',letterSpacing:'0.04em'}}>🔒 256-BIT TLS · STRIPE TEST MODE</div>
          </>}/>
          <Card style={{background:LM,border:'none'}} c={<>
            <div style={{fontSize:13,fontWeight:500,lineHeight:1.5}}>This is <Mo c="test mode" s={{fontWeight:700}}/>. Use card <Mo c="4242 4242 4242 4242" s={{fontWeight:700}}/> with any future expiry & CVC.</div>
          </>}/>
        </div>
      </div>
    </PortalShell>
  );
}

// W17 — Payment success
function WebPaySuccess() {
  return (
    <div style={{minHeight:'100%',background:IK,color:PR,padding:'56px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 30%, rgba(200,255,61,0.15), transparent 60%)'}}/>
      <div style={{position:'relative',width:120,height:120,borderRadius:99,background:LM,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 40px rgba(200,255,61,0.3)'}}>
        <svg width="56" height="56" viewBox="0 0 36 36"><path d="M10 18l5 5 12-13" stroke={IK} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{position:'relative',marginTop:30,...mn,fontSize:12,color:LM,letterSpacing:'0.14em'}}>● PAYMENT CONFIRMED</div>
      <h1 style={{position:'relative',fontSize:54,fontWeight:700,marginTop:12,letterSpacing:'-0.03em',textAlign:'center',lineHeight:1.05}}>You're booked.<br/>See you Tuesday.</h1>
      {/* receipt */}
      <div style={{position:'relative',marginTop:30,width:520,background:PR,color:IK,borderRadius:20,padding:24,boxShadow:'0 24px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><div><Lbl c="BOOKING CODE"/><Mo c="PK-4F2A9" s={{fontSize:24,fontWeight:700,marginTop:4,display:'block',letterSpacing:'0.05em'}}/></div><Chip c="● PAID" t="lime"/></div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${HL}`,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div><Lbl c="SPOT"/><div style={{fontSize:14,fontWeight:600,marginTop:2}}>Cozy driveway</div></div>
          <div><Lbl c="HOST"/><div style={{fontSize:14,fontWeight:600,marginTop:2}}>Mrs Khan · ★4.9</div></div>
          <div><Lbl c="WHEN"/><div style={{fontSize:14,fontWeight:600,marginTop:2}}>Tue 13 May, 2:00 PM</div></div>
          <div><Lbl c="DURATION"/><div style={{fontSize:14,fontWeight:600,marginTop:2}}>3h 30m</div></div>
        </div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${HL}`,display:'flex',justifyContent:'space-between'}}>
          <div><Lbl c="GATE CODE"/><Mo c="4 9 2 1 #" s={{fontSize:22,fontWeight:700,marginTop:4,letterSpacing:'0.18em',display:'block'}}/></div>
          <div style={{textAlign:'right'}}><Lbl c="TOTAL"/><Mo c="$11.00" s={{fontSize:22,fontWeight:700,marginTop:4,display:'block'}}/></div>
        </div>
      </div>
      <div style={{position:'relative',marginTop:24,display:'flex',gap:10}}>
        <div style={{padding:'14px 22px',background:LM,color:IK,borderRadius:99,fontSize:15,fontWeight:600}}>View on map →</div>
        <div style={{padding:'14px 22px',border:'1px solid rgba(246,244,238,0.2)',borderRadius:99,fontSize:15,fontWeight:500}}>My bookings</div>
      </div>
    </div>
  );
}

// W18 — Payment failed
function WebPayFailed() {
  return (
    <PortalShell role="driver" active="Find parking">
      <Card c={<>
        <div style={{display:'flex',gap:18,alignItems:'flex-start'}}>
          <div style={{width:64,height:64,borderRadius:99,background:'#FFE0CF',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="28" height="28" viewBox="0 0 36 36"><path d="M9 9l18 18M27 9L9 27" stroke="#E04A2B" strokeWidth="3.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{flex:1}}>
            <Mo c="ERR · CARD_DECLINED" s={{fontSize:11,color:'#E04A2B',letterSpacing:'0.12em'}}/>
            <h1 style={{fontSize:32,fontWeight:700,marginTop:6,letterSpacing:'-0.02em'}}>Your card was declined.</h1>
            <p style={{fontSize:15,color:MU,marginTop:10,lineHeight:1.5}}>No charge was made. Your spot is held for the next <Mo c="4:32" s={{fontWeight:700,color:IK}}/> while you try again.</p>
          </div>
        </div>
        <div style={{marginTop:22,padding:14,background:PR2,borderRadius:12,display:'flex',gap:14,alignItems:'center'}}>
          <div style={{width:44,height:30,borderRadius:6,background:'#1A1F71',color:'#fff',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>VISA</div>
          <div style={{flex:1}}><Mo c="•••• 4242" s={{fontSize:14,fontWeight:600}}/><div style={{fontSize:11,color:'#E04A2B',marginTop:2}}>Insufficient funds</div></div>
          <div style={{fontSize:13,fontWeight:600}}>Change →</div>
        </div>
        <div style={{marginTop:14,padding:14,background:LM,borderRadius:12,fontSize:13,fontWeight:500,lineHeight:1.5}}>Tip: This is Stripe <Mo c="test mode" s={{fontWeight:700}}/>. Try <Mo c="4242 4242 4242 4242" s={{fontWeight:700}}/> to simulate success.</div>
        <div style={{marginTop:18,display:'flex',gap:10}}><Btn c="Try again →"/><Btn c="Cancel booking" p={false}/></div>
      </>}/>
    </PortalShell>
  );
}

// W19 — Booking history
function WebBookingHistory() {
  return (
    <PortalShell role="driver" active="Bookings">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="YOUR TRIPS"/><h1 style={{fontSize:34,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Bookings</h1></div>
      </div>
      <div style={{marginTop:16,borderBottom:`1px solid ${HL}`,display:'flex',gap:4}}>
        {['Upcoming','Active','Past','Cancelled'].map((t,i)=>(
          <div key={t} style={{padding:'10px 14px',fontSize:14,fontWeight:i===0?700:500,color:i===0?IK:MU,borderBottom:i===0?`2px solid ${IK}`:'2px solid transparent',marginBottom:-1}}>
            {t}{i===0 && <span style={{marginLeft:6,fontSize:10,padding:'2px 6px',background:IK,color:LM,borderRadius:99,...mn}}>2</span>}
          </div>
        ))}
      </div>
      <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
        {[
          {when:'Today · 2:00 PM',dur:'3h 30m',spot:'Cozy driveway by the lake',addr:'Road 113, Gulshan 2',amt:'11.00',code:'PK-4F2A9',state:'PAID',tone:'lime'},
          {when:'Fri 16 · 9:00 AM',dur:'2h',spot:'Behind the bakery',addr:'Road 27, Banani 11',amt:'8.00',code:'PK-4F351',state:'PAID',tone:'lime'},
          {when:'Wed 10 · 11:00 AM',dur:'2h',spot:'Quiet side gate',addr:'Road 89, Gulshan 1',amt:'5.00',code:'PK-4F0C2',state:'COMPLETED',tone:'soft'},
          {when:'Tue 6 · 4:00 PM',dur:'1h',spot:'Cozy driveway by the lake',addr:'Road 113, Gulshan 2',amt:'3.00',code:'PK-4F082',state:'CANCELLED',tone:'warn'},
        ].map((b,i)=>(
          <Card key={i} c={<div style={{display:'flex',gap:18,alignItems:'center'}}>
            <div style={{width:80,height:80,borderRadius:12,background:`linear-gradient(135deg, ${['#5C6B4E','#6F584A','#4F6A78','#705D4A'][i]}, ${['#B8C098','#C8B49B','#A8C0CB','#C8B8A0'][i]})`,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><Mo c={b.when} s={{fontSize:13,fontWeight:700}}/><Chip c={'● '+b.state} t={b.tone}/></div>
              <div style={{fontSize:17,fontWeight:600,marginTop:4}}>{b.spot}</div>
              <div style={{fontSize:12,color:MU,marginTop:2}}>{b.addr} · {b.dur}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <Mo c={`$${b.amt}`} s={{fontSize:22,fontWeight:700,letterSpacing:'-0.01em'}}/>
              <Mo c={b.code} s={{fontSize:11,color:MU,marginTop:2,display:'block'}}/>
            </div>
            <div style={{padding:'10px 16px',background:PR2,borderRadius:99,fontSize:13,fontWeight:600}}>Details →</div>
          </div>}/>
        ))}
      </div>
    </PortalShell>
  );
}

// W20 — Booking details
function WebBookingDetails() {
  return (
    <PortalShell role="driver" active="Bookings">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="BOOKING · PK-4F2A9"/><h1 style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Cozy driveway by the lake</h1><div style={{marginTop:6,display:'flex',gap:8}}><Chip c="● ACTIVE NOW" t="lime"/><Chip c="2H 14M LEFT" t="ink"/></div></div>
        <div style={{display:'flex',gap:8}}><Btn c="Get directions →"/><Btn c="Cancel" p={false}/></div>
      </div>
      <div style={{marginTop:22,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* countdown */}
          <div style={{padding:28,background:IK,color:PR,borderRadius:20,textAlign:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%, rgba(200,255,61,0.15), transparent 60%)'}}/>
            <div style={{position:'relative'}}>
              <Lbl c="TIME REMAINING"/>
              <Mo c="2:14:38" s={{fontSize:80,fontWeight:700,marginTop:8,letterSpacing:'-0.04em',display:'block',lineHeight:1}}/>
              <div style={{marginTop:10,fontSize:13,color:'rgba(246,244,238,0.6)'}}>Ends 5:30 PM · Mrs Khan can extend if needed</div>
            </div>
          </div>
          {/* map */}
          <div style={{height:280,borderRadius:18,background:'linear-gradient(135deg,#DCDCC9,#C5C3AC)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 60px)'}}/>
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 800 280" preserveAspectRatio="xMidYMid slice">
              <path d="M-20 140 Q200 100 400 160 T820 130" stroke="rgba(255,255,255,0.55)" strokeWidth="36" fill="none"/>
              <path d="M-20 140 Q200 100 400 160 T820 130" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeDasharray="10 14" fill="none"/>
            </svg>
            <div style={{position:'absolute',left:'30%',top:'60%',width:20,height:20,borderRadius:99,background:'#2A6FDB',border:`3px solid ${PR}`,boxShadow:'0 0 0 8px rgba(42,111,219,0.2)'}}/>
            <div style={{position:'absolute',left:'62%',top:'40%',padding:'8px 14px',background:LM,color:IK,borderRadius:99,fontSize:13,fontWeight:700,...mn,boxShadow:'0 8px 24px rgba(0,0,0,0.25)',border:`2px solid ${IK}`}}>★ MRS KHAN'S</div>
          </div>
          <Card c={<>
            <Lbl c="HOST"/>
            <div style={{marginTop:10,display:'flex',gap:14,alignItems:'center'}}>
              <div style={{width:54,height:54,borderRadius:99,background:'#D4C8AA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700}}>MK</div>
              <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>Mrs Khan</div><div style={{fontSize:12,color:MU,marginTop:2}}>★ 4.9 · Host since 2024</div></div>
              <Btn c="Message" p={false}/>
              <Btn c="Call"/>
            </div>
          </>}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Card c={<>
            <Lbl c="GATE CODE"/>
            <Mo c="4 9 2 1 #" s={{fontSize:38,fontWeight:700,marginTop:8,letterSpacing:'0.16em',display:'block'}}/>
            <div style={{fontSize:12,color:MU,marginTop:6}}>Punch in at the side gate, then park in slot B.</div>
          </>}/>
          <Card c={<>
            <Lbl c="DETAILS"/>
            <div style={{marginTop:8}}>
              {[['Code','PK-4F2A9'],['Date','Tue 13 May'],['Time','2:00 – 5:30 PM'],['Vehicle','DHA-1294'],['Paid','$11.00']].map(([k,v],i,a)=>(
                <div key={k} style={{padding:'9px 0',display:'flex',justifyContent:'space-between',borderBottom:i<a.length-1?`1px solid ${HL}`:'none'}}>
                  <span style={{fontSize:12,color:MU}}>{k}</span><Mo c={v} s={{fontSize:13,fontWeight:600}}/>
                </div>
              ))}
            </div>
          </>}/>
        </div>
      </div>
    </PortalShell>
  );
}

// W21 — Cancel
function WebCancel() {
  return (
    <PortalShell role="driver" active="Bookings">
      <Lbl c="CANCEL BOOKING"/>
      <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>Cancel this booking?</h1>
      <p style={{fontSize:14,color:MU,marginTop:6,maxWidth:560}}>You're more than 1 hour from start, so you'll get a full refund to your original payment method.</p>
      <div style={{marginTop:22,maxWidth:680}}>
        <Card c={<div style={{display:'flex',gap:14,alignItems:'center'}}>
          <div style={{width:64,height:64,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>Cozy driveway by the lake</div><div style={{fontSize:12,color:MU,marginTop:2}}>Tue 13 May · 2:00–5:30 PM · PK-4F2A9</div></div>
          <div style={{textAlign:'right'}}><Lbl c="REFUND"/><Mo c="$11.00" s={{fontSize:22,fontWeight:700,marginTop:2,display:'block'}}/></div>
        </div>}/>
        <Card style={{marginTop:14}} c={<>
          <Lbl c="REASON (OPTIONAL)"/>
          <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
            {['Plans changed','Found closer','Spot too small','Cost too high','Other'].map((t,i)=>(
              <div key={t} style={{padding:'9px 14px',background:i===0?IK:PR2,color:i===0?PR:IK,borderRadius:99,fontSize:13,fontWeight:600}}>{t}</div>
            ))}
          </div>
        </>}/>
        <div style={{marginTop:18,display:'flex',gap:10}}>
          <div style={{padding:'14px 26px',background:'#E04A2B',color:'#fff',borderRadius:99,fontSize:15,fontWeight:600,boxShadow:'0 6px 18px rgba(224,74,43,0.3)'}}>Yes, cancel booking</div>
          <Btn c="Keep my booking" p={false}/>
        </div>
      </div>
    </PortalShell>
  );
}

// W22 — Write review
function WebWriteReview() {
  return (
    <PortalShell role="driver" active="Bookings">
      <Lbl c="REVIEW · BOOKING PK-4F1E8"/>
      <h1 style={{fontSize:34,fontWeight:700,marginTop:4,letterSpacing:'-0.02em'}}>How was Mrs Khan's driveway?</h1>
      <div style={{marginTop:22,maxWidth:720,display:'flex',flexDirection:'column',gap:14}}>
        <Card c={<div style={{display:'flex',gap:14,alignItems:'center'}}>
          <div style={{width:54,height:54,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
          <div><div style={{fontSize:15,fontWeight:600}}>Cozy driveway by the lake</div><div style={{fontSize:12,color:MU,marginTop:2}}>10 May · 2h booking · $6.00</div></div>
        </div>}/>
        <Card c={<>
          <Lbl c="RATING"/>
          <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
            {[1,1,1,1,0].map((on,i)=>(
              <svg key={i} width="56" height="56" viewBox="0 0 24 24"><path d="M12 2L14.6 8.4 21 9.2l-4.8 4.4L17.5 21 12 17.6 6.5 21l1.3-7.4L3 9.2l6.4-.8z" fill={on?'#FFCB1A':'rgba(0,0,0,0.06)'} stroke={on?'#FFCB1A':'rgba(0,0,0,0.12)'} strokeWidth="1.2"/></svg>
            ))}
          </div>
          <Mo c="4 OF 5 · GREAT" s={{fontSize:11,color:MU,letterSpacing:'0.08em',textAlign:'center',display:'block',marginTop:10}}/>
        </>}/>
        <Card c={<>
          <Lbl c="WHAT WORKED"/>
          <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['Easy access',true],['Clean',true],['Friendly host',true],['Quiet street',false],['Well-lit',false],['Safe',false],['Good size',false]].map(([t,a])=>(
              <div key={t} style={{padding:'9px 13px',background:a?IK:'#fff',color:a?PR:IK,borderRadius:99,fontSize:12,fontWeight:600,border:a?'none':`1px solid ${HL}`}}>{t}{a && ' ✓'}</div>
            ))}
          </div>
        </>}/>
        <Card c={<>
          <Lbl c="COMMENT (PUBLIC)"/>
          <div style={{marginTop:8,padding:14,background:PR2,borderRadius:10,fontSize:14,lineHeight:1.5}}>Mrs Khan greeted me with chai. The gate code worked first try. I'd book again Monday for yoga class.</div>
          <Mo c="98 / 280" s={{fontSize:11,color:MU,textAlign:'right',display:'block',marginTop:6}}/>
        </>}/>
        <div><Btn c="Submit review →"/></div>
      </div>
    </PortalShell>
  );
}

// W23 — Notifications
function WebNotifications() {
  return (
    <PortalShell role="driver" active="Notifications">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="ALL UPDATES"/><h1 style={{fontSize:34,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Notifications</h1></div>
        <div style={{display:'flex',gap:6}}>{['All','Unread · 3','Bookings','Promos'].map((t,i)=><div key={t} style={{padding:'8px 14px',borderRadius:99,background:i===0?IK:'#fff',color:i===0?PR:IK,fontSize:13,fontWeight:600,border:i===0?'none':`1px solid ${HL}`}}>{t}</div>)}</div>
      </div>
      <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:8}}>
        {[
          {tone:'lime',ic:'✓',t:'Booking confirmed',s:'Cozy driveway · Tue 2:00 PM · PK-4F2A9',w:'now',u:true},
          {tone:'lime',ic:'→',t:'Mrs Khan accepted your request',s:'Gate code: 4921#',w:'2m',u:true},
          {tone:'soft',ic:'★',t:'How was your last stay?',s:'Leave a review for Mrs Khan',w:'1h',u:true},
          {tone:'soft',ic:'$',t:'New price drop nearby',s:'Banani 11 · now $2/hr',w:'3h',u:false},
          {tone:'warn',ic:'!',t:'Your card expires soon',s:'Visa •••• 4242 · 12/27',w:'1d',u:false},
          {tone:'soft',ic:'P',t:'Welcome to ParkShare 👋',s:'Find your first parking spot',w:'2d',u:false},
        ].map((n,i)=>{
          const bg = n.tone==='lime'?LM:n.tone==='warn'?'#FFE0CF':PR2, fg = n.tone==='warn'?'#9A4310':IK;
          return (
            <Card key={i} c={<div style={{display:'flex',gap:14,alignItems:'center'}}>
              <div style={{width:46,height:46,borderRadius:12,background:bg,color:fg,fontWeight:700,fontSize:20,display:'flex',alignItems:'center',justifyContent:'center'}}>{n.ic}</div>
              <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{n.t}</div><div style={{fontSize:12,color:MU,marginTop:2}}>{n.s}</div></div>
              <Mo c={n.w} s={{fontSize:11,color:MU}}/>
              {n.u && <div style={{width:9,height:9,borderRadius:99,background:LM}}/>}
            </div>}/>
          );
        })}
      </div>
    </PortalShell>
  );
}

// W24 — Profile
function WebProfile() {
  return (
    <PortalShell role="driver" active="Profile">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="ACCOUNT"/><h1 style={{fontSize:34,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Your profile</h1></div>
        <Btn c="Edit →"/>
      </div>
      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:18}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{padding:24,background:IK,color:PR,borderRadius:20,display:'flex',gap:18,alignItems:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',right:-40,top:-40,width:160,height:160,borderRadius:99,background:LM,opacity:0.15}}/>
            <div style={{width:86,height:86,borderRadius:99,background:'#D4C8AA',color:IK,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:700,position:'relative'}}>RA</div>
            <div style={{position:'relative'}}>
              <div style={{fontSize:24,fontWeight:700}}>Rafiq Ahmed</div>
              <div style={{fontSize:13,color:'rgba(246,244,238,0.6)',marginTop:2}}>Driver · member since May 2025</div>
              <div style={{marginTop:8,display:'flex',gap:8}}><Chip c="● VERIFIED" t="lime"/><Chip c="12 TRIPS" t="ink"/></div>
            </div>
          </div>
          {[
            {h:'PERSONAL',rows:[['Vehicle','Toyota Axio · DHA-1294'],['Phone','+880 1712 ••• 482'],['Email','rafiq@northsouth.edu']]},
            {h:'PAYMENT',rows:[['Default card','Visa •••• 4242'],['bKash','+880 1712 ••• 482'],['Add payment method',null]]},
            {h:'PREFERENCES',rows:[['Push notifications','On'],['Language','English'],['Become a host',null]]},
          ].map(g=>(
            <div key={g.h}>
              <Lbl c={g.h}/>
              <div style={{marginTop:8,background:'#fff',borderRadius:14,border:`1px solid ${HL}`,overflow:'hidden'}}>
                {g.rows.map(([k,v],i,a)=>(
                  <div key={k} style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:i<a.length-1?`1px solid ${HL}`:'none'}}>
                    <div style={{fontSize:14,fontWeight:v?500:600}}>{k}</div>
                    <div style={{display:'flex',gap:10,alignItems:'center'}}>{v && <span style={{fontSize:13,color:MU}}>{v}</span>}<span style={{fontSize:13,color:MU}}>→</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[['12','Trips'],['4.9★','Rating'],['$84','Saved']].map(([v,l])=>(
              <Card key={l} style={{textAlign:'center'}} c={<><Mo c={v} s={{fontSize:24,fontWeight:700,display:'block'}}/><div style={{fontSize:11,color:MU,marginTop:4}}>{l}</div></>}/>
            ))}
          </div>
          <Card c={<>
            <Lbl c="DANGER ZONE"/>
            <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}>
              <div style={{padding:'12px 14px',background:PR2,borderRadius:10,fontSize:14,fontWeight:600}}>Sign out</div>
              <div style={{padding:'12px 14px',background:PR2,borderRadius:10,fontSize:14,fontWeight:600,color:'#E04A2B'}}>Delete account</div>
            </div>
          </>}/>
        </div>
      </div>
    </PortalShell>
  );
}

// W25 — Host welcome
function WebHostWelcome() {
  return (
    <div style={{minHeight:'100%',background:LM,color:IK,padding:'48px 56px',position:'relative',overflow:'hidden'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:34,height:34,borderRadius:10,background:IK,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={LM} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:18,fontWeight:700}}>ParkShare</div>
        </div>
        <div style={{fontSize:13}}>Skip</div>
      </div>
      <div style={{maxWidth:1100,margin:'80px auto 0',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <Lbl c="WELCOME, MRS KHAN"/>
          <h1 style={{fontSize:72,fontWeight:700,marginTop:12,lineHeight:0.98,letterSpacing:'-0.03em'}}>Your driveway<br/>can pay rent too.</h1>
          <p style={{fontSize:17,marginTop:20,lineHeight:1.55,maxWidth:480}}>ParkShare hosts in Gulshan average <Mo c="$160/month" s={{fontWeight:700}}/> from a driveway that would otherwise sit empty. List in 4 minutes — drivers can book today.</p>
          <div style={{marginTop:36,display:'flex',gap:12}}>
            <div style={{padding:'16px 24px',background:IK,color:LM,borderRadius:99,fontSize:16,fontWeight:600}}>Add your first spot →</div>
            <div style={{padding:'16px 24px',border:`1.5px solid ${IK}`,borderRadius:99,fontSize:16,fontWeight:500}}>Tour the dashboard</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[['LIST','3 min, 4 screens','▤'],['EARN','$2–6 per hour','$'],['TRUST','Verified drivers','◉'],['PAYOUT','Weekly to bank','→']].map(([h,s,ic])=>(
            <div key={h} style={{padding:20,background:IK,color:PR,borderRadius:18}}>
              <div style={{width:36,height:36,borderRadius:10,background:LM,color:IK,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,...mn}}>{ic}</div>
              <Lbl c={h}/>
              <div style={{fontSize:16,fontWeight:600,marginTop:6}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// W26 — My spots
function WebMySpots() {
  return (
    <PortalShell role="host" active="My spots">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="YOUR LISTINGS"/><h1 style={{fontSize:34,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>My spots</h1></div>
        <Btn c="+ Add new spot"/>
      </div>
      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
        {[
          {t:'Cozy driveway by the lake',a:'Road 113, Gulshan 2',p:'3',s:'live',r:'4.9',b:'23',rev:'$184',g:0},
          {t:'Behind the house garage',a:'Road 89, Gulshan 1',p:'5',s:'live',r:'4.8',b:'14',rev:'$94',g:1},
          {t:'Side driveway · rainy',a:'Road 113, Gulshan 2',p:'2',s:'paused',r:'5.0',b:'6',rev:'$28',g:2},
        ].map((sp,i)=>(
          <div key={i} style={{background:'#fff',borderRadius:18,border:`1px solid ${HL}`,overflow:'hidden'}}>
            <div style={{height:160,background:`linear-gradient(135deg, ${['#5C6B4E','#6F584A','#4F6A78'][sp.g]}, ${['#B8C098','#C8B49B','#A8C0CB'][sp.g]})`,position:'relative'}}>
              <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 18px, rgba(0,0,0,0.04) 18px 36px)'}}/>
              <div style={{position:'absolute',top:12,left:12}}><Chip c={'● '+(sp.s==='live'?'LIVE':'PAUSED')} t={sp.s==='live'?'lime':'soft'}/></div>
              <Mo c={`spot_${(i+1).toString().padStart(4,'0')}`} s={{position:'absolute',bottom:10,right:12,fontSize:10,color:'rgba(255,255,255,0.85)'}}/>
            </div>
            <div style={{padding:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                <div><div style={{fontSize:16,fontWeight:700}}>{sp.t}</div><div style={{fontSize:12,color:MU,marginTop:3}}>{sp.a}</div></div>
                <div style={{textAlign:'right'}}><Mo c={`$${sp.p}`} s={{fontSize:22,fontWeight:700}}/><div style={{fontSize:10,color:MU}}>/ hour</div></div>
              </div>
              <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${HL}`,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
                {[['Rating',sp.r+'★'],['Bookings',sp.b],['Revenue',sp.rev]].map(([k,v])=>(
                  <div key={k}><div style={{fontSize:10,color:MU,...mn}}>{k.toUpperCase()}</div><Mo c={v} s={{fontSize:14,fontWeight:700,marginTop:2,display:'block'}}/></div>
                ))}
              </div>
              <div style={{marginTop:14,display:'flex',gap:6}}><div style={{flex:1,padding:'10px 0',background:PR2,borderRadius:8,fontSize:12,fontWeight:600,textAlign:'center'}}>Edit</div><div style={{flex:1,padding:'10px 0',background:PR2,borderRadius:8,fontSize:12,fontWeight:600,textAlign:'center'}}>Bookings</div></div>
            </div>
          </div>
        ))}
        <div style={{padding:32,borderRadius:18,border:`2px dashed ${HL}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,minHeight:340,color:MU}}>
          <div style={{width:48,height:48,borderRadius:99,background:PR2,display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="22" height="22" viewBox="0 0 18 18"><path d="M9 2v14M2 9h14" stroke={IK} strokeWidth="2.4" strokeLinecap="round"/></svg></div>
          <div style={{fontSize:15,fontWeight:600,color:IK,marginTop:6}}>Add another spot</div>
          <div style={{fontSize:12,textAlign:'center',maxWidth:200}}>List a second driveway to earn more.</div>
        </div>
      </div>
    </PortalShell>
  );
}

// W27 — Add spot details (step 2)
function WebAddSpotDetails() {
  return (
    <div style={{minHeight:'100%',background:PR}}>
      <div style={{padding:'20px 56px',borderBottom:`1px solid ${HL}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Lbl c="NEW LISTING · STEP 2 / 4"/>
        <div style={{display:'flex',gap:8}}>{['Location','Details','Pricing','Review'].map((t,i)=><div key={t} style={{padding:'6px 12px',borderRadius:99,background:i===1?IK:i<1?LM:'transparent',color:i<2?IK:MU,fontWeight:i===1?700:500,fontSize:13}}>{i+1}. {t}</div>)}</div>
        <div style={{...mn,fontSize:12,color:MU}}>SAVE & EXIT</div>
      </div>
      <div style={{padding:'36px 56px',maxWidth:880,margin:'0 auto'}}>
        <Lbl c="STEP 2"/>
        <h1 style={{fontSize:42,fontWeight:700,marginTop:6,letterSpacing:'-0.02em',lineHeight:1.05}}>Tell drivers about<br/>your spot.</h1>
        <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:18}}>
          <Card c={<>
            <Lbl c="LISTING TITLE"/>
            <div style={{marginTop:8,padding:'14px 16px',background:PR2,borderRadius:10,fontSize:16,fontWeight:500}}>Cozy driveway by the lake</div>
            <Mo c="32 / 80" s={{fontSize:11,color:MU,marginTop:6,display:'block'}}/>
          </>}/>
          <Card c={<>
            <Lbl c="FITS UP TO"/>
            <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10}}>
              {[['Sedan','3.5×1.8'],['SUV','4.5×2.3'],['Van','5×2.5'],['Truck','6×2.5']].map(([t,d],i)=>(
                <div key={t} style={{padding:18,borderRadius:14,background:i===1?IK:'#fff',color:i===1?PR:IK,border:i===1?'none':`1px solid ${HL}`,textAlign:'center'}}>
                  <div style={{fontSize:15,fontWeight:700}}>{t}</div>
                  <Mo c={`${d}m`} s={{fontSize:11,color:i===1?'rgba(246,244,238,0.6)':MU,marginTop:4,display:'block'}}/>
                </div>
              ))}
            </div>
          </>}/>
          <Card c={<>
            <Lbl c="FEATURES"/>
            <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
              {[['Covered',true],['CCTV',true],['24/7',true],['EV charging',false],['Gated',false],['Lighted',false],['Easy in/out',false]].map(([t,a])=>(
                <div key={t} style={{padding:'11px 18px',borderRadius:99,background:a?LM:'#fff',border:a?'none':`1px solid ${HL}`,fontSize:13,fontWeight:600}}>{t}{a && ' ✓'}</div>
              ))}
            </div>
          </>}/>
          <Card c={<>
            <Lbl c="HOUSE RULES"/>
            <div style={{marginTop:8,padding:14,background:PR2,borderRadius:10,fontSize:14,lineHeight:1.55,minHeight:80}}>No oversized trucks. Please don't block the gate. Honk twice on arrival — the gate is automatic.</div>
          </>}/>
          <div style={{display:'flex',gap:10,justifyContent:'space-between'}}><Btn c="← Back · Location" p={false}/><Btn c="Continue · Pricing →"/></div>
        </div>
      </div>
    </div>
  );
}

// W28 — Add spot pricing (step 3)
function WebAddSpotPricing() {
  return (
    <div style={{minHeight:'100%',background:PR}}>
      <div style={{padding:'20px 56px',borderBottom:`1px solid ${HL}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Lbl c="NEW LISTING · STEP 3 / 4"/>
        <div style={{display:'flex',gap:8}}>{['Location','Details','Pricing','Review'].map((t,i)=><div key={t} style={{padding:'6px 12px',borderRadius:99,background:i===2?IK:i<2?LM:'transparent',color:i<3?IK:MU,fontWeight:i===2?700:500,fontSize:13}}>{i+1}. {t}</div>)}</div>
        <div style={{...mn,fontSize:12,color:MU}}>SAVE & EXIT</div>
      </div>
      <div style={{padding:'36px 56px',maxWidth:880,margin:'0 auto'}}>
        <Lbl c="STEP 3"/>
        <h1 style={{fontSize:42,fontWeight:700,marginTop:6,letterSpacing:'-0.02em'}}>Set your hourly rate.</h1>

        <div style={{marginTop:28,padding:'40px 32px',background:IK,color:PR,borderRadius:24,textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%, rgba(200,255,61,0.15), transparent 60%)'}}/>
          <div style={{position:'relative'}}>
            <Lbl c="PER HOUR"/>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',gap:6,marginTop:10}}>
              <Mo c="$" s={{fontSize:36,fontWeight:600,marginTop:22}}/>
              <Mo c="3" s={{fontSize:130,fontWeight:700,letterSpacing:'-0.04em',lineHeight:0.9}}/>
              <Mo c=".00" s={{fontSize:44,fontWeight:600,marginTop:14,color:'rgba(246,244,238,0.5)'}}/>
            </div>
            <Mo c="● COMPETITIVE FOR GULSHAN" s={{fontSize:12,color:LM,letterSpacing:'0.08em',marginTop:10}}/>
          </div>
        </div>

        <Card style={{marginTop:14}} c={<>
          <div style={{position:'relative',height:8,background:PR2,borderRadius:99}}>
            <div style={{position:'absolute',left:0,top:0,height:8,width:'30%',background:IK,borderRadius:99}}/>
            <div style={{position:'absolute',left:'30%',top:-7,width:22,height:22,borderRadius:99,background:LM,transform:'translateX(-50%)',border:`3px solid ${IK}`}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontSize:11,color:MU,...mn}}><span>$1</span><span>$5</span><span>$10+</span></div>
        </>}/>

        <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Card c={<>
            <Lbl c="AVAILABLE FROM"/>
            <Mo c="9:00 AM" s={{fontSize:30,fontWeight:700,marginTop:6,letterSpacing:'-0.02em',display:'block'}}/>
          </>}/>
          <Card c={<>
            <Lbl c="AVAILABLE TO"/>
            <Mo c="5:00 PM" s={{fontSize:30,fontWeight:700,marginTop:6,letterSpacing:'-0.02em',display:'block'}}/>
          </>}/>
        </div>
        <Card style={{marginTop:14}} c={<>
          <Lbl c="AVAILABLE DAYS"/>
          <div style={{marginTop:10,display:'flex',gap:8}}>
            {[['MON',true],['TUE',true],['WED',true],['THU',true],['FRI',true],['SAT',true],['SUN',false]].map(([d,a])=>(
              <div key={d} style={{flex:1,padding:14,borderRadius:10,background:a?IK:'#fff',color:a?PR:MU,border:a?'none':`1px solid ${HL}`,fontSize:12,fontWeight:600,textAlign:'center',...mn}}>{d}</div>
            ))}
          </div>
        </>}/>

        <div style={{marginTop:14,padding:'16px 18px',background:LM,borderRadius:14,fontSize:14,fontWeight:500,lineHeight:1.5}}>Estimated earnings <Mo c="~$160/mo" s={{fontWeight:700}}/> based on similar Gulshan spots. <Mo c="(~14 bookings, 68% occupancy)" s={{color:MU,fontSize:12}}/></div>

        <div style={{marginTop:18,display:'flex',justifyContent:'space-between'}}><Btn c="← Back · Details" p={false}/><Btn c="Continue · Review →"/></div>
      </div>
    </div>
  );
}

// W29 — Spot published
function WebSpotPublished() {
  return (
    <div style={{minHeight:'100%',background:LM,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 28px, rgba(0,0,0,0.04) 28px 56px)'}}/>
      <div style={{position:'relative',padding:'72px 56px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
        <div style={{width:120,height:120,borderRadius:99,background:IK,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 20px 50px rgba(0,0,0,0.2)'}}>
          <svg width="56" height="56" viewBox="0 0 44 44"><path d="M22 4l4 6h6l-2 7 4 5-6 3 1 7-7-2-7 2 1-7-6-3 4-5-2-7h6z" stroke={LM} strokeWidth="3" fill="none" strokeLinejoin="round"/></svg>
        </div>
        <Lbl c="YOU'RE LIVE"/>
        <h1 style={{fontSize:64,fontWeight:700,marginTop:14,letterSpacing:'-0.03em',lineHeight:1.02}}>Your spot is open<br/>for business.</h1>
        <p style={{fontSize:17,color:'rgba(14,14,12,0.7)',marginTop:14,maxWidth:560,lineHeight:1.55}}>Drivers near Gulshan can find and book your driveway starting now. We'll notify you the moment your first booking comes in.</p>

        <div style={{marginTop:36,width:600,background:PR,borderRadius:20,padding:24,boxShadow:'0 24px 60px rgba(0,0,0,0.18)',display:'flex',gap:18,alignItems:'center'}}>
          <div style={{width:80,height:80,borderRadius:14,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
          <div style={{flex:1,textAlign:'left'}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}><div style={{fontSize:18,fontWeight:700}}>Cozy driveway by the lake</div><Chip c="● LIVE" t="lime"/></div>
            <div style={{fontSize:13,color:MU,marginTop:4}}>Road 113, Gulshan 2 · <Mo c="$3/hr"/> · 9 AM–5 PM · Mon–Sat</div>
          </div>
        </div>

        <div style={{marginTop:30,display:'flex',gap:12}}>
          <Btn c="View my spots →"/>
          <Btn c="Share my listing" p={false}/>
        </div>
      </div>
    </div>
  );
}

// W30 — Host bookings
function WebHostBookings() {
  return (
    <PortalShell role="host" active="Bookings">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="RESERVATIONS"/><h1 style={{fontSize:34,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Incoming</h1></div>
      </div>
      <div style={{marginTop:16,borderBottom:`1px solid ${HL}`,display:'flex',gap:4}}>
        {['Upcoming · 3','Active · 1','Past','Cancelled'].map((t,i)=>(
          <div key={t} style={{padding:'10px 14px',fontSize:14,fontWeight:i===0?700:500,color:i===0?IK:MU,borderBottom:i===0?`2px solid ${IK}`:'2px solid transparent',marginBottom:-1}}>{t}</div>
        ))}
      </div>
      <div style={{marginTop:14}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead>
            <tr style={{textAlign:'left',color:MU,...mn,fontSize:10}}>
              {['WHEN','DRIVER','VEHICLE','SPOT','DURATION','STATUS','YOUR CUT','ACTION'].map(h=><th key={h} style={{padding:'10px 0',fontWeight:500}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ['Today · 2:00 PM','Rafiq A.','DHA-1294','Cozy driveway','3h 30m','PENDING','$10.50','warn'],
              ['Today · 6:30 PM','Imran K.','DHA-8821','Cozy driveway','1h','PAID','$3.00','lime'],
              ['Tue · 9:00 AM','Nadia S.','DHA-0044','Behind garage','8h','PAID','$40.00','lime'],
              ['Wed · 11:00 AM','Tahmid R.','DHA-7712','Cozy driveway','2h','PAID','$6.00','lime'],
              ['Thu · 1:00 PM','Maya B.','DHA-5503','Side gate','4h','PAID','$10.00','lime'],
            ].map((r,i)=>(
              <tr key={i} style={{borderTop:`1px solid ${HL}`,background:i===0?PR:'#fff'}}>
                <td style={{padding:'14px 0'}}><Mo c={r[0]} s={{fontWeight:700}}/></td>
                <td style={{padding:'14px 0'}}><div style={{display:'flex',gap:10,alignItems:'center'}}><div style={{width:30,height:30,borderRadius:99,background:PR2,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{r[1].split(' ').map(x=>x[0]).join('')}</div>{r[1]}</div></td>
                <td style={{padding:'14px 0',...mn,color:MU}}>{r[2]}</td>
                <td style={{padding:'14px 0',fontWeight:500}}>{r[3]}</td>
                <td style={{padding:'14px 0',color:MU}}>{r[4]}</td>
                <td style={{padding:'14px 0'}}><Chip c={'● '+r[5]} t={r[6]}/></td>
                <td style={{padding:'14px 0'}}><Mo c={r[6]} s={{fontWeight:700}}/></td>
                <td style={{padding:'14px 0'}}><div style={{padding:'6px 12px',background:PR2,borderRadius:8,fontSize:11,fontWeight:600,display:'inline-block'}}>{i===0?'Approve':'Open'}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}

// W31 — Admin moderation users
function WebAdminMod() {
  return (
    <PortalShell role="admin" active="Users">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><Lbl c="MODERATION"/><h1 style={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em',marginTop:4}}>Users · 1,284</h1></div>
        <div style={{display:'flex',gap:8}}>
          <div style={{padding:'10px 14px',background:'#fff',border:`1px solid ${HL}`,borderRadius:10,fontSize:13,...mn,display:'flex',gap:10,alignItems:'center'}}><svg width="14" height="14" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke={MU} strokeWidth="2" fill="none"/><path d="M11 11l4 4" stroke={MU} strokeWidth="2" strokeLinecap="round"/></svg><span style={{color:MU}}>Search by name or email</span></div>
          <div style={{padding:'10px 14px',background:IK,color:PR,borderRadius:10,fontSize:13,fontWeight:600}}>Export</div>
        </div>
      </div>
      <div style={{marginTop:14,display:'flex',gap:6}}>
        {[['All',true],['Drivers',false],['Hosts',false],['Admins',false],['Flagged · 2',false]].map(([l,a])=><div key={l} style={{padding:'8px 14px',background:a?IK:'#fff',color:a?PR:IK,border:a?'none':`1px solid ${HL}`,borderRadius:99,fontSize:13,fontWeight:600}}>{l}</div>)}
      </div>
      <Card style={{marginTop:16,padding:0,overflow:'hidden'}} c={
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead>
            <tr style={{textAlign:'left',color:MU,...mn,fontSize:10,background:PR}}>
              {['USER','EMAIL','ROLE','JOINED','ACTIVITY','STATUS','ACTIONS'].map(h=><th key={h} style={{padding:'12px 14px',fontWeight:500}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              {n:'Rafiq Ahmed',e:'rafiq@nsu.edu',r:'driver',j:'May 2025',a:'12 trips',s:'OK',f:false},
              {n:'Mrs Khan',e:'mkhan@gmail.com',r:'host',j:'Mar 2024',a:'$184 earned',s:'OK',f:false},
              {n:'Imran K.',e:'imran.k@nsu.edu',r:'host',j:'May 2026',a:'new · pending',s:'PENDING',f:true},
              {n:'Nadia Sultana',e:'nadia.s@brac.edu',r:'driver',j:'Feb 2026',a:'4 trips',s:'OK',f:false},
              {n:'Sara Hossain',e:'sara.h@gmail.com',r:'driver',j:'Jan 2026',a:'2 spam reports',s:'FLAG',f:true},
              {n:'Tahmid Rahman',e:'tahmid@nsu.edu',r:'driver',j:'Dec 2025',a:'7 trips',s:'OK',f:false},
              {n:'Maya Begum',e:'maya.b@gmail.com',r:'driver',j:'Nov 2025',a:'3 trips',s:'OK',f:false},
              {n:'Admin · NSU',e:'admin@parkshare.app',r:'admin',j:'Sep 2025',a:'platform',s:'OK',f:false},
            ].map((u,i)=>(
              <tr key={i} style={{borderTop:`1px solid ${HL}`}}>
                <td style={{padding:'12px 14px'}}><div style={{display:'flex',gap:10,alignItems:'center'}}><div style={{width:32,height:32,borderRadius:99,background:PR2,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{u.n.split(' ').map(x=>x[0]).join('')}</div><span style={{fontWeight:600}}>{u.n}</span></div></td>
                <td style={{padding:'12px 14px',...mn,color:MU}}>{u.e}</td>
                <td style={{padding:'12px 14px'}}><Chip c={u.r.toUpperCase()} t="ink"/></td>
                <td style={{padding:'12px 14px',color:MU}}>{u.j}</td>
                <td style={{padding:'12px 14px'}}>{u.a}</td>
                <td style={{padding:'12px 14px'}}><Chip c={'● '+u.s} t={u.s==='FLAG'?'warn':u.s==='PENDING'?'soft':'lime'}/></td>
                <td style={{padding:'12px 14px'}}><div style={{display:'flex',gap:6}}><div style={{padding:'4px 10px',background:PR2,borderRadius:6,fontSize:11,fontWeight:600}}>View</div>{u.f && <div style={{padding:'4px 10px',background:'#FFE0CF',color:'#9A4310',borderRadius:6,fontSize:11,fontWeight:600}}>Review</div>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      }/>
    </PortalShell>
  );
}

window.WebRegister = WebRegister;
window.WebHowItWorks = WebHowItWorks;
window.Web404 = Web404;
window.WebDriverWelcome = WebDriverWelcome;
window.WebDriverDash = WebDriverDash;
window.WebBookingForm = WebBookingForm;
window.WebCheckoutReview = WebCheckoutReview;
window.WebPayment = WebPayment;
window.WebPaySuccess = WebPaySuccess;
window.WebPayFailed = WebPayFailed;
window.WebBookingHistory = WebBookingHistory;
window.WebBookingDetails = WebBookingDetails;
window.WebCancel = WebCancel;
window.WebWriteReview = WebWriteReview;
window.WebNotifications = WebNotifications;
window.WebProfile = WebProfile;
window.WebHostWelcome = WebHostWelcome;
window.WebMySpots = WebMySpots;
window.WebAddSpotDetails = WebAddSpotDetails;
window.WebAddSpotPricing = WebAddSpotPricing;
window.WebSpotPublished = WebSpotPublished;
window.WebHostBookings = WebHostBookings;
window.WebAdminMod = WebAdminMod;
