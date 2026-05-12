// Cancel + review + notifications + profile + host multi-step add-spot
const { INK: I5, PAPER: P5, PAPER2: P5b, LIME: L5, MUTED: M5, HAIRLINE: H5 } = window.PSColors;

// 16 — Cancel booking confirmation
function ScreenCancel() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'hidden'}}>
      <Style/>
      <TopBack label="CANCEL BOOKING"/>
      <div style={{padding:'0 24px'}}>
        <div style={{width:64,height:64,borderRadius:18,background:'#FFE0CF',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 4l14 24H2L16 4z" stroke="#9A4310" strokeWidth="2.4" fill="none" strokeLinejoin="round"/><path d="M16 14v6M16 23v1" stroke="#9A4310" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </div>
        <h1 style={{fontSize:28,fontWeight:700,marginTop:16,lineHeight:1.1}}>Cancel this<br/>booking?</h1>
        <p style={{fontSize:14,color:M5,marginTop:10,lineHeight:1.5}}>You're more than 1 hour from start, so you'll get a full refund to your original payment method.</p>
      </div>

      <div style={{margin:'22px 24px 0',padding:16,background:'#fff',borderRadius:20,border:`1px solid ${H5}`}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>Cozy driveway by the lake</div>
            <div style={{fontSize:12,color:M5,marginTop:2}}>Tue 13 May · 2:00–5:30 PM</div>
          </div>
        </div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px dashed ${H5}`,display:'flex',justifyContent:'space-between'}}>
          <div style={{fontSize:13}}>Refund</div>
          <div className="num" style={{fontSize:18,fontWeight:700}}>$11.00</div>
        </div>
      </div>

      <div style={{margin:'18px 24px 0',padding:'14px 16px',background:'#fff',borderRadius:16,border:`1px solid ${H5}`}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>REASON (OPTIONAL)</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10}}>
          {['Plans changed','Found closer','Spot too small','Other'].map((t,i)=>(
            <div key={t} style={{padding:'8px 12px',background: i===0? I5 : P5b, color: i===0? P5 : I5,borderRadius:99,fontSize:12,fontWeight:600}}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 24px 38px',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{height:60,borderRadius:99,background:'#E04A2B',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:600,boxShadow:'0 6px 18px rgba(224,74,43,0.3)'}}>Yes, cancel booking</div>
        <div style={{textAlign:'center',fontSize:14,color:M5,padding:14}}>Keep my booking</div>
      </div>
    </div>
  );
}

// 17 — Write review
function ScreenWriteReview() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'hidden'}}>
      <Style/>
      <TopBack label="REVIEW"/>
      <div style={{padding:'0 24px'}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>HOW WAS IT?</div>
        <h1 style={{fontSize:28,fontWeight:700,marginTop:6,lineHeight:1.1}}>Rate Mrs Khan's<br/>driveway.</h1>
      </div>

      <div style={{margin:'24px 24px 0',padding:16,background:'#fff',borderRadius:20,border:`1px solid ${H5}`,display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:50,height:50,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Cozy driveway by the lake</div>
          <div style={{fontSize:12,color:M5,marginTop:2}}>10 May · 2h booking · $6.00</div>
        </div>
      </div>

      <div style={{margin:'30px 24px 0',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',gap:10}}>
          {[1,1,1,1,0].map((on,i)=>(
            <svg key={i} width="48" height="48" viewBox="0 0 24 24"><path d="M12 2L14.6 8.4 21 9.2l-4.8 4.4L17.5 21 12 17.6 6.5 21l1.3-7.4L3 9.2l6.4-.8z" fill={on?'#FFCB1A':'rgba(0,0,0,0.06)'} stroke={on?'#FFCB1A':'rgba(0,0,0,0.12)'} strokeWidth="1.2"/></svg>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:13,color:M5,fontFamily:'"JetBrains Mono",monospace'}}>4 OF 5 · GREAT</div>
      </div>

      <div style={{margin:'24px 24px 0'}}>
        <div style={{fontSize:13,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em',marginBottom:8}}>WHAT WORKED</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {[
            ['Easy access', true],
            ['Clean', true],
            ['Friendly host', true],
            ['Quiet street', false],
            ['Well-lit', false],
            ['Safe', false],
          ].map(([t,a])=>(
            <div key={t} style={{padding:'9px 13px',background: a? I5 : '#fff',color: a? P5 : I5,borderRadius:99,fontSize:12,fontWeight:600, border: a? 'none' : `1px solid ${H5}`}}>{t}{a && ' ✓'}</div>
          ))}
        </div>
      </div>

      <div style={{margin:'18px 24px 0',padding:'14px 16px',background:'#fff',borderRadius:16,border:`1px solid ${H5}`}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>COMMENT (PUBLIC)</div>
        <div style={{marginTop:8,fontSize:14,lineHeight:1.5,color:I5}}>Mrs Khan greeted me with chai. The gate code worked first try.</div>
        <div style={{marginTop:8,fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',textAlign:'right'}}>74 / 280</div>
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 24px 38px'}}>
        <PillButton big>Submit review</PillButton>
      </div>
    </div>
  );
}

// 18 — Notifications
function ScreenNotifications() {
  const items = [
    {tone:'lime', t:'Booking confirmed', s:'Cozy driveway · Tue 2:00 PM', when:'Now', ic:'✓'},
    {tone:'lime', t:'Mrs Khan accepted your request', s:'View booking details', when:'2m', ic:'→'},
    {tone:'soft', t:'How was your last stay?', s:'Leave a review for Mrs Khan', when:'1h', ic:'★'},
    {tone:'soft', t:'New price drop nearby', s:'Banani 11 · now $2/hr', when:'3h', ic:'$'},
    {tone:'warn', t:'Your card expires soon', s:'Visa •••• 4242 · 12/27', when:'1d', ic:'!'},
    {tone:'soft', t:'Welcome to ParkShare 👋', s:'Find your first parking spot', when:'2d', ic:'P'},
  ];
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1 style={{fontSize:30,fontWeight:700}}>Notifications</h1>
        <div style={{fontSize:13,fontWeight:600,color:M5}}>Clear</div>
      </div>
      <div style={{padding:'0 20px',display:'flex',gap:8,marginBottom:14}}>
        {['All','Unread','Bookings'].map((t,i)=>(
          <div key={t} style={{padding:'8px 14px',borderRadius:99,fontSize:13,fontWeight:600, background: i===0? I5 : 'transparent', color: i===0? P5 : M5, border: i===0? 'none' : `1px solid ${H5}`}}>{t}{i===1 && ' · 3'}</div>
        ))}
      </div>

      <div style={{padding:'0 20px 100px',display:'flex',flexDirection:'column',gap:8}}>
        {items.map((n,i)=>{
          const bg = n.tone==='lime'? L5 : n.tone==='warn'? '#FFE0CF' : P5b;
          const fg = n.tone==='warn'? '#9A4310' : I5;
          return (
            <div key={i} style={{padding:14,background:'#fff',borderRadius:16,border:`1px solid ${H5}`,display:'flex',gap:12,alignItems:'flex-start'}}>
              <div style={{width:38,height:38,borderRadius:12,background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,flexShrink:0}}>{n.ic}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
                  <div style={{fontSize:14,fontWeight:600}}>{n.t}</div>
                  <div className="num" style={{fontSize:11,color:M5}}>{n.when}</div>
                </div>
                <div style={{fontSize:12,color:M5,marginTop:3}}>{n.s}</div>
              </div>
              {i<2 && <div style={{width:8,height:8,borderRadius:99,background:L5,marginTop:6}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 19 — Profile / Settings
function ScreenProfile() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 0'}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>PROFILE</div>
        <h1 style={{fontSize:30,fontWeight:700,marginTop:4}}>Account</h1>
      </div>

      <div style={{margin:'18px 20px 0',padding:18,background:I5,color:P5,borderRadius:22,display:'flex',gap:14,alignItems:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-30,top:-30,width:120,height:120,borderRadius:99,background:L5,opacity:0.18}}/>
        <div style={{width:64,height:64,borderRadius:99,background:'#D4C8AA',color:I5,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700}}>RA</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:700}}>Rafiq Ahmed</div>
          <div style={{fontSize:13,color:'rgba(246,244,238,0.6)',marginTop:2}}>Driver · since May 2025</div>
        </div>
      </div>

      <div style={{margin:'14px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        {[['12','Trips'],['4.9 ★','Rating'],['$84','Saved']].map(([v,l])=>(
          <div key={l} style={{padding:14,background:'#fff',borderRadius:16,border:`1px solid ${H5}`,textAlign:'center'}}>
            <div className="num" style={{fontSize:20,fontWeight:700}}>{v}</div>
            <div style={{fontSize:11,color:M5,marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      {[
        {h:'PERSONAL', rows:[
          ['Vehicle','Toyota Axio · DHA-1294'],
          ['Phone','+880 1712 ••• 482'],
          ['Email','rafiq@northsouth.edu'],
        ]},
        {h:'PAYMENT', rows:[
          ['Default card','Visa •••• 4242'],
          ['Add payment method', null],
        ]},
        {h:'PREFERENCES', rows:[
          ['Push notifications','On'],
          ['Language','English'],
          ['Become a host', null],
        ]},
      ].map(g=>(
        <div key={g.h} style={{margin:'22px 20px 0'}}>
          <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em',marginBottom:8}}>{g.h}</div>
          <div style={{background:'#fff',borderRadius:18,border:`1px solid ${H5}`,overflow:'hidden'}}>
            {g.rows.map(([k,v],i)=>(
              <div key={k} style={{padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom: i<g.rows.length-1? `1px solid ${H5}` : 'none'}}>
                <div style={{fontSize:14,fontWeight: v? 500 : 600}}>{k}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {v && <span style={{fontSize:13,color:M5}}>{v}</span>}
                  <svg width="8" height="14" viewBox="0 0 8 14"><path d="M1 1l6 6-6 6" stroke={M5} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{margin:'22px 20px 100px',display:'flex',gap:10}}>
        <div style={{flex:1,padding:16,background:'#fff',borderRadius:16,border:`1px solid ${H5}`,textAlign:'center',fontSize:14,fontWeight:600,color:M5}}>Sign out</div>
        <div style={{flex:1,padding:16,background:'#fff',borderRadius:16,border:`1px solid ${H5}`,textAlign:'center',fontSize:14,fontWeight:600,color:'#E04A2B'}}>Delete</div>
      </div>
    </div>
  );
}

// 20 — Add spot · details (step 2)
function ScreenAddSpotDetails() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'hidden'}}>
      <Style/>
      <TopBack label="STEP 2 OF 4"/>
      <div style={{padding:'0 20px'}}>
        <div style={{display:'flex',gap:6,marginBottom:18}}>
          {[1,1,0,0].map((a,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background: a? I5 : 'rgba(14,14,12,0.14)'}}/>)}
        </div>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>DETAILS</div>
        <h1 style={{fontSize:26,fontWeight:700,marginTop:6,lineHeight:1.1}}>Tell drivers<br/>about your spot.</h1>
      </div>

      <div style={{padding:'20px',display:'flex',flexDirection:'column',gap:14}}>
        <Field label="LISTING TITLE" value="Cozy driveway by the lake"/>
        <div>
          <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em',marginBottom:8}}>FITS UP TO</div>
          <div style={{display:'flex',gap:8}}>
            {[
              ['Sedan',false],['SUV',true],['Van',false],['Truck',false],
            ].map(([t,a])=>(
              <div key={t} style={{flex:1,padding:'14px 6px',borderRadius:14,background:a?I5:'#fff',color:a?P5:I5,border:a?'none':`1px solid ${H5}`,textAlign:'center',fontSize:13,fontWeight:600}}>{t}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em',marginBottom:8}}>FEATURES</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {['Covered ✓','CCTV ✓','24/7 ✓','EV charging','Gated','Lighted'].map((t,i)=>(
              <div key={t} style={{padding:'10px 14px',borderRadius:99,background: i<3? L5 : '#fff', border: i<3? 'none' : `1px solid ${H5}`, fontSize:13,fontWeight:600}}>{t}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em',marginBottom:6}}>HOUSE RULES</div>
          <div style={{padding:'12px 14px',background:'#fff',borderRadius:14,border:`1px solid ${H5}`,fontSize:14,lineHeight:1.5}}>No oversized trucks. Please don't block the gate. Honk twice on arrival — the gate is automatic.</div>
        </div>
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 20px 38px'}}>
        <PillButton big>Next · Pricing</PillButton>
      </div>
    </div>
  );
}

// 21 — Add spot · pricing (step 3)
function ScreenAddSpotPricing() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'hidden'}}>
      <Style/>
      <TopBack label="STEP 3 OF 4"/>
      <div style={{padding:'0 20px'}}>
        <div style={{display:'flex',gap:6,marginBottom:18}}>
          {[1,1,1,0].map((a,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background: a? I5 : 'rgba(14,14,12,0.14)'}}/>)}
        </div>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>PRICING</div>
        <h1 style={{fontSize:26,fontWeight:700,marginTop:6,lineHeight:1.1}}>Set your<br/>hourly rate.</h1>
      </div>

      {/* big price tile */}
      <div style={{margin:'22px 20px 0',padding:'30px 20px',background:I5,color:P5,borderRadius:24,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 50% 50%, rgba(200,255,61,0.15), transparent 60%)`}}/>
        <div style={{position:'relative',fontSize:11,color:L5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>PER HOUR</div>
        <div style={{position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'center',gap:4,marginTop:8}}>
          <div className="num" style={{fontSize:24,fontWeight:600,marginTop:14}}>$</div>
          <div className="num" style={{fontSize:80,fontWeight:700,lineHeight:0.9,letterSpacing:'-0.04em'}}>3</div>
          <div className="num" style={{fontSize:32,fontWeight:600,marginTop:8,color:'rgba(246,244,238,0.6)'}}>.00</div>
        </div>
        <div style={{position:'relative',fontSize:12,color:L5,marginTop:8,fontFamily:'"JetBrains Mono",monospace'}}>● COMPETITIVE FOR GULSHAN</div>
      </div>

      {/* slider area */}
      <div style={{margin:'14px 20px 0',padding:'14px 16px',background:'#fff',borderRadius:16,border:`1px solid ${H5}`}}>
        <div style={{position:'relative',height:6,background:P5b,borderRadius:99}}>
          <div style={{position:'absolute',left:0,top:0,height:6,width:'30%',background:I5,borderRadius:99}}/>
          <div style={{position:'absolute',left:'30%',top:-7,width:20,height:20,borderRadius:99,background:L5,transform:'translateX(-50%)',border:`3px solid ${I5}`}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:M5,marginTop:10,fontFamily:'"JetBrains Mono",monospace'}}><span>$1</span><span>$10</span></div>
      </div>

      <div style={{margin:'20px 20px 0',display:'flex',flexDirection:'column',gap:10}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>AVAILABLE HOURS</div>
        <div style={{padding:'14px 16px',background:'#fff',borderRadius:16,border:`1px solid ${H5}`,display:'flex',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:11,color:M5}}>From</div>
            <div className="num" style={{fontSize:22,fontWeight:700,marginTop:2}}>9:00 AM</div>
          </div>
          <div style={{fontSize:24,color:M5,alignSelf:'center'}}>→</div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:M5}}>To</div>
            <div className="num" style={{fontSize:22,fontWeight:700,marginTop:2}}>5:00 PM</div>
          </div>
        </div>
      </div>

      <div style={{margin:'14px 20px 0',padding:'14px 16px',background:L5,borderRadius:16,fontSize:13,lineHeight:1.5,fontWeight:500}}>
        Estimated earnings <Mono style={{fontWeight:700}}>~$160/mo</Mono> based on similar Gulshan spots.
      </div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'14px 20px 38px'}}>
        <PillButton big>Next · Review</PillButton>
      </div>
    </div>
  );
}

// 22 — Spot published (success)
function ScreenSpotPublished() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'hidden'}}>
      <Style/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:380,background:L5,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 24px, rgba(0,0,0,0.04) 24px 48px)'}}/>
        <div style={{position:'absolute',top:140,left:0,right:0,textAlign:'center'}}>
          <div style={{width:96,height:96,borderRadius:99,background:I5,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 40px rgba(0,0,0,0.18)'}}>
            <svg width="44" height="44" viewBox="0 0 44 44"><path d="M22 4l4 6h6l-2 7 4 5-6 3 1 7-7-2-7 2 1-7-6-3 4-5-2-7h6z" stroke={L5} strokeWidth="3" fill="none" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
      <div style={{position:'absolute',top:300,left:24,right:24,textAlign:'center'}}>
        <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.12em'}}>YOU'RE LIVE</div>
        <h1 style={{fontSize:34,fontWeight:700,marginTop:10,lineHeight:1.05}}>Your spot is<br/>open for business.</h1>
        <p style={{fontSize:14,color:M5,marginTop:12,lineHeight:1.5}}>Drivers near Gulshan can now find and book your driveway.</p>
      </div>

      <div style={{position:'absolute',top:520,left:20,right:20,padding:18,background:'#fff',borderRadius:20,border:`1px solid ${H5}`,display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:54,height:54,borderRadius:12,background:'linear-gradient(135deg,#5C6B4E,#B8C098)'}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:600}}>Cozy driveway by the lake</div>
          <div style={{fontSize:12,color:M5,marginTop:2}}>Live · <Mono>$3</Mono>/hr · 9 AM – 5 PM</div>
        </div>
        <StatusChip tone="lime">● Live</StatusChip>
      </div>

      <div style={{position:'absolute',left:20,right:20,bottom:38,display:'flex',flexDirection:'column',gap:10}}>
        <PillButton big>View my spots</PillButton>
        <div style={{textAlign:'center',fontSize:14,color:M5,padding:12}}>Share my listing</div>
      </div>
    </div>
  );
}

// 23 — My spots (host)
function ScreenMySpots() {
  return (
    <div className="ps" style={{position:'relative',width:'100%',height:'100%',background:P5,overflow:'auto'}}>
      <Style/>
      <div style={{padding:'62px 20px 4px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div style={{fontSize:11,color:M5,fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.08em'}}>YOUR LISTINGS</div>
          <h1 style={{fontSize:28,fontWeight:700,marginTop:4}}>My spots</h1>
        </div>
        <div style={{width:44,height:44,borderRadius:14,background:L5,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 2v14M2 9h14" stroke={I5} strokeWidth="2.4" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div style={{padding:'18px 20px 100px',display:'flex',flexDirection:'column',gap:12}}>
        {[
          {t:'Cozy driveway by the lake',a:'Road 113, Gulshan 2',p:'3',s:'live',r:'4.9',b:'23'},
          {t:'Behind the house garage',a:'Road 89, Gulshan 1',p:'5',s:'live',r:'4.8',b:'14'},
          {t:'Side driveway (rainy season)',a:'Road 113, Gulshan 2',p:'2',s:'paused',r:'5.0',b:'6'},
        ].map((sp,i)=>(
          <div key={i} style={{background:'#fff',borderRadius:20,border:`1px solid ${H5}`,overflow:'hidden'}}>
            <div style={{height:120,background:`linear-gradient(135deg, ${i===0?'#5C6B4E':i===1?'#6F584A':'#4F6A78'} 0%, ${i===0?'#B8C098':i===1?'#C8B49B':'#A8C0CB'} 100%)`,position:'relative'}}>
              <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 18px, rgba(0,0,0,0.04) 18px 36px)'}}/>
              <div style={{position:'absolute',top:12,left:12}}><StatusChip tone={sp.s==='live'?'lime':'soft'}>● {sp.s==='live'?'Live':'Paused'}</StatusChip></div>
              <div style={{position:'absolute',bottom:10,right:12,fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:'rgba(255,255,255,0.85)'}}>spot_{(i+1).toString().padStart(4,'0')}</div>
            </div>
            <div style={{padding:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                <div>
                  <div style={{fontSize:15,fontWeight:600,lineHeight:1.2}}>{sp.t}</div>
                  <div style={{fontSize:12,color:M5,marginTop:3}}>{sp.a}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="num" style={{fontSize:20,fontWeight:700}}>${sp.p}</div>
                  <div style={{fontSize:10,color:M5}}>/ hour</div>
                </div>
              </div>
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${H5}`,display:'flex',gap:18,fontSize:12}}>
                <div><span style={{color:M5}}>Rating</span> <span className="num" style={{fontWeight:700,marginLeft:4}}>{sp.r} ★</span></div>
                <div><span style={{color:M5}}>Bookings</span> <span className="num" style={{fontWeight:700,marginLeft:4}}>{sp.b}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ScreenCancel = ScreenCancel;
window.ScreenWriteReview = ScreenWriteReview;
window.ScreenNotifications = ScreenNotifications;
window.ScreenProfile = ScreenProfile;
window.ScreenAddSpotDetails = ScreenAddSpotDetails;
window.ScreenAddSpotPricing = ScreenAddSpotPricing;
window.ScreenSpotPublished = ScreenSpotPublished;
window.ScreenMySpots = ScreenMySpots;
