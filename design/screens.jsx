// ParkShare — mobile screens
// Design language:
//   ink #0E0E0C, paper #F6F4EE, lime accent oklch(0.88 0.2 128) ≈ #C8FF3D
//   Type: DM Sans + JetBrains Mono. Big numbers, monospace codes.

const INK = '#0E0E0C';
const PAPER = '#F6F4EE';
const PAPER2 = '#EFEBE0';
const LIME = '#C8FF3D';
const MUTED = '#7A776E';
const HAIRLINE = 'rgba(14,14,12,0.08)';

// ──────────────────────────────────────────────────────────────
// Stylized top-down map illustration (abstract — not from any real provider)
// ──────────────────────────────────────────────────────────────
function MapBg({ pins = [], me = { x: 200, y: 480 }, w = 402, h = 874, tone = 'day' }) {
  const bg = tone === 'day' ? '#E8E4D7' : '#1A1A18';
  const block = tone === 'day' ? '#DFDACA' : '#222220';
  const water = tone === 'day' ? '#CFDAE0' : '#23292D';
  const road = tone === 'day' ? '#F6F4EE' : '#2E2D2A';
  const roadEdge = tone === 'day' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const park = tone === 'day' ? '#D6DDC2' : '#262922';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position:'absolute',inset:0}}>
      <rect width={w} height={h} fill={bg}/>
      {/* water inlet */}
      <path d={`M${w} 0 L${w} 280 Q${w-60} 320 ${w-90} 360 Q${w-120} 410 ${w-70} 460 L${w} 500 Z`} fill={water}/>
      {/* park */}
      <rect x="40" y="610" width="170" height="120" rx="6" fill={park}/>
      {/* blocks */}
      {[
        [30,140,140,90],[190,140,120,90],[330,140,90,90],
        [30,250,140,110],[190,250,120,110],
        [30,380,90,110],[140,380,170,110],
        [30,510,170,80],[220,510,140,80],
        [220,610,140,80],
        [40,760,170,90],[220,720,180,130],
      ].map(([x,y,bw,bh],i)=>(
        <rect key={i} x={x} y={y} width={bw} height={bh} rx="4" fill={block}/>
      ))}
      {/* roads — horizontal */}
      {[120,230,360,490,590,700].map(y=>(
        <g key={'h'+y}>
          <rect x="0" y={y} width={w} height="22" fill={road}/>
          <line x1="0" y1={y} x2={w} y2={y} stroke={roadEdge} strokeWidth="1"/>
          <line x1="0" y1={y+22} x2={w} y2={y+22} stroke={roadEdge} strokeWidth="1"/>
        </g>
      ))}
      {/* roads — vertical */}
      {[170,310,420].map(x=>(
        <g key={'v'+x}>
          <rect x={x} y="0" width="22" height={h} fill={road}/>
          <line x1={x} y1="0" x2={x} y2={h} stroke={roadEdge} strokeWidth="1"/>
          <line x1={x+22} y1="0" x2={x+22} y2={h} stroke={roadEdge} strokeWidth="1"/>
        </g>
      ))}
      {/* diagonal avenue */}
      <path d={`M-20 820 L${w+20} 540`} stroke={road} strokeWidth="26"/>
      <path d={`M-20 820 L${w+20} 540`} stroke={roadEdge} strokeWidth="1" fill="none"/>
      {/* dashed midlines on big roads */}
      {[131,241,371,501,601,711].map(y=>(
        <line key={'d'+y} x1="0" y1={y} x2={w} y2={y} stroke={tone==='day'?'#D9D4C2':'#3A3936'} strokeWidth="1" strokeDasharray="6 8"/>
      ))}
      {/* pins */}
      {pins.map((p,i)=>(
        <g key={i} transform={`translate(${p.x},${p.y})`}>
          {p.kind === 'cluster' ? (
            <g>
              <circle r="22" fill={INK}/>
              <text textAnchor="middle" y="5" fill={LIME} fontFamily="DM Sans" fontSize="14" fontWeight="700">{p.label}</text>
            </g>
          ) : p.active ? (
            <g>
              <circle r="26" fill={LIME} opacity="0.25"/>
              <circle r="18" fill={LIME}/>
              <path d="M-1 -8 v8 l6 4" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text textAnchor="middle" y="6" fill={INK} fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">{p.label || ''}</text>
            </g>
          ) : (
            <g>
              <rect x="-22" y="-14" width="44" height="28" rx="14" fill={INK}/>
              <text textAnchor="middle" y="5" fill={PAPER} fontFamily="DM Sans" fontSize="13" fontWeight="700">{p.label}</text>
              <path d="M-4 14 L0 20 L4 14 Z" fill={INK}/>
            </g>
          )}
        </g>
      ))}
      {/* "me" puck */}
      {me && (
        <g transform={`translate(${me.x},${me.y})`}>
          <circle r="28" fill="#3D7BFF" opacity="0.18"/>
          <circle r="11" fill="#fff"/>
          <circle r="8" fill="#3D7BFF"/>
        </g>
      )}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Small primitives
// ──────────────────────────────────────────────────────────────
const Mono = ({children, style={}}) => (
  <span style={{fontFamily:'"JetBrains Mono", ui-monospace, monospace', letterSpacing:'-0.02em', ...style}}>{children}</span>
);

function PillButton({children, bg=LIME, fg=INK, big=false, style={}}) {
  return (
    <div style={{
      height: big ? 60 : 52, borderRadius: 999, background: bg, color: fg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight: 600, fontSize: big ? 18 : 17, letterSpacing:'-0.01em',
      boxShadow: bg===LIME ? '0 6px 18px rgba(200,255,61,0.4)' : '0 6px 18px rgba(14,14,12,0.18)',
      ...style,
    }}>{children}</div>
  );
}

function Sheet({children, style={}}) {
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0,
      background: PAPER, borderTopLeftRadius:28, borderTopRightRadius:28,
      paddingBottom: 38, paddingTop: 8,
      boxShadow:'0 -20px 60px rgba(0,0,0,0.18)',
      ...style,
    }}>
      <div style={{width:40, height:5, background:'rgba(0,0,0,0.14)', borderRadius:99, margin:'8px auto 14px'}}/>
      {children}
    </div>
  );
}

function StatusChip({tone='lime', children}) {
  const map = {
    lime: {bg:LIME, fg:INK},
    ink:  {bg:INK, fg:PAPER},
    soft: {bg:'rgba(14,14,12,0.06)', fg:INK},
    warn: {bg:'#FFD4A8', fg:'#5A3416'},
  };
  const {bg, fg} = map[tone];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      background:bg, color:fg, padding:'5px 10px', borderRadius:99,
      fontSize:11, fontWeight:600, letterSpacing:'0.02em',
      fontFamily:'"JetBrains Mono", monospace', textTransform:'uppercase',
    }}>{children}</span>
  );
}

// shared CSS injected once
function Style() {
  return (
    <style>{`
      .ps * { box-sizing:border-box; }
      .ps { font-family: "DM Sans", -apple-system, system-ui, sans-serif; color:${INK}; }
      .ps h1,.ps h2,.ps h3 { margin:0; letter-spacing:-0.02em; }
      .ps .num { font-family:"JetBrains Mono", ui-monospace, monospace; letter-spacing:-0.02em; }
    `}</style>
  );
}

// ──────────────────────────────────────────────────────────────
// 01 — Landing / Splash (pre-auth)
// ──────────────────────────────────────────────────────────────
function ScreenLanding() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:INK, overflow:'hidden'}}>
      <Style/>
      <div style={{position:'absolute',inset:0, opacity:0.85}}>
        <MapBg tone="night" me={null} pins={[{x:180,y:300,label:'$3',kind:'price'},{x:300,y:430,label:'$5',kind:'price'},{x:90,y:560,label:'$2',kind:'price'}]} />
      </div>
      <div style={{position:'absolute',inset:0, background:'linear-gradient(180deg, rgba(14,14,12,0.6) 0%, rgba(14,14,12,0) 30%, rgba(14,14,12,0) 55%, rgba(14,14,12,0.92) 88%)'}}/>
      {/* top brand */}
      <div style={{position:'absolute', top:62, left:24, right:24, display:'flex', alignItems:'center', justifyContent:'space-between', color:PAPER}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:32, height:32, borderRadius:9, background:LIME, display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 14V4h5.5a3 3 0 010 6H7" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          <div style={{fontSize:20, fontWeight:700, letterSpacing:'-0.02em'}}>ParkShare</div>
        </div>
        <div style={{fontSize:13, opacity:0.7}}>Sign in</div>
      </div>

      <div style={{position:'absolute', bottom:42, left:24, right:24, color:PAPER}}>
        <div style={{fontSize:13, color:LIME, fontFamily:'"JetBrains Mono",monospace', letterSpacing:'0.05em', marginBottom:14}}>● 2,481 SPOTS NEAR YOU</div>
        <h1 style={{fontSize:46, fontWeight:700, lineHeight:1.02}}>
          Driveway<br/>parking,<br/><span style={{color:LIME}}>on demand.</span>
        </h1>
        <p style={{fontSize:15, color:'rgba(246,244,238,0.7)', marginTop:16, lineHeight:1.5, maxWidth:320}}>
          Find a spot in a neighbor's driveway. Book by the hour. Pay only for what you use.
        </p>
        <div style={{marginTop:26, display:'flex', flexDirection:'column', gap:10}}>
          <PillButton big>Get started</PillButton>
          <div style={{textAlign:'center', fontSize:14, color:'rgba(246,244,238,0.6)', padding:14}}>I'm a host →</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 02 — Search spots (map + draggable bottom sheet of cards)
// ──────────────────────────────────────────────────────────────
function SpotCard({title, dist, rating, price, badge}) {
  return (
    <div style={{
      minWidth:260, background:'#fff', borderRadius:20, padding:14, border:`1px solid ${HAIRLINE}`,
      display:'flex', flexDirection:'column', gap:10,
    }}>
      {/* placeholder image */}
      <div style={{
        height:96, borderRadius:14, background:`repeating-linear-gradient(135deg, ${PAPER2} 0 10px, #E5E0D0 10px 20px)`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{position:'absolute', top:8, left:10, fontFamily:'"JetBrains Mono",monospace', fontSize:10, color:MUTED}}>driveway.jpg</div>
        {badge && <div style={{position:'absolute', top:8, right:8}}><StatusChip tone="ink">{badge}</StatusChip></div>}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8}}>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:15, fontWeight:600, lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{title}</div>
          <div style={{fontSize:12, color:MUTED, marginTop:4, display:'flex', gap:8}}>
            <span>★ {rating}</span><span>·</span><span>{dist} away</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="num" style={{fontSize:20, fontWeight:700}}>${price}</div>
          <div style={{fontSize:10, color:MUTED, marginTop:-2}}>per hour</div>
        </div>
      </div>
    </div>
  );
}

function ScreenSearch() {
  return (
    <div className="ps" style={{position:'relative', width:'100%', height:'100%', background:PAPER, overflow:'hidden'}}>
      <Style/>
      <MapBg tone="day" me={{x:210, y:430}} pins={[
        {x:120, y:320, label:'$2'},
        {x:280, y:280, label:'$5'},
        {x:90,  y:500, label:'$3', active:true},
        {x:330, y:520, label:'$4'},
        {x:230, y:640, label:'$6'},
        {x:140, y:200, label:'12', kind:'cluster'},
      ]}/>

      {/* search bar */}
      <div style={{position:'absolute', top:60, left:16, right:16, display:'flex', gap:8}}>
        <div style={{flex:1, height:52, background:'#fff', borderRadius:18, display:'flex', alignItems:'center', padding:'0 16px', gap:10, boxShadow:'0 6px 20px rgba(0,0,0,0.08)'}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="8" cy="8" r="6" stroke={INK} strokeWidth="2" fill="none"/><path d="M13 13l4 4" stroke={INK} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{flex:1, fontSize:15}}><span style={{fontWeight:600}}>Gulshan 2</span><span style={{color:MUTED}}> · Today 2–5 PM</span></div>
        </div>
        <div style={{width:52, height:52, background:'#fff', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 20px rgba(0,0,0,0.08)'}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 5h14M5 9h8M7 13h4" stroke={INK} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>
      {/* filter chips */}
      <div style={{position:'absolute', top:128, left:16, right:0, display:'flex', gap:8, overflow:'hidden'}}>
        {['Under $5/hr', 'Covered', '★ 4.5+', 'SUV-friendly', 'Open now'].map(t=>(
          <div key={t} style={{height:36, padding:'0 14px', background:'#fff', borderRadius:99, display:'flex', alignItems:'center', fontSize:13, fontWeight:500, boxShadow:'0 4px 12px rgba(0,0,0,0.04)', border:`1px solid ${HAIRLINE}`, whiteSpace:'nowrap'}}>{t}</div>
        ))}
      </div>

      {/* recenter FAB */}
      <div style={{position:'absolute', right:20, bottom:380, width:48, height:48, borderRadius:16, background:'#fff', boxShadow:'0 8px 22px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2.5" fill={INK}/><circle cx="10" cy="10" r="6" stroke={INK} strokeWidth="1.6" fill="none"/><path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke={INK} strokeWidth="1.8" strokeLinecap="round"/></svg>
      </div>

      {/* bottom sheet */}
      <Sheet style={{height:340}}>
        <div style={{padding:'0 20px 14px', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:20, fontWeight:700}}>32 spots nearby</div>
            <div style={{fontSize:13, color:MUTED, marginTop:2}}>Sorted by distance</div>
          </div>
          <div style={{fontSize:13, fontWeight:600, color:INK, display:'flex', alignItems:'center', gap:4}}>Map ↑</div>
        </div>
        <div style={{display:'flex', gap:12, padding:'0 20px', overflowX:'auto'}}>
          <SpotCard title="Cozy driveway by lake" dist="120 m" rating="4.9" price="3" badge="Covered"/>
          <SpotCard title="Mrs Khan's spot" dist="240 m" rating="4.8" price="4"/>
          <SpotCard title="Behind Banani 11" dist="380 m" rating="4.6" price="2"/>
        </div>
      </Sheet>
    </div>
  );
}

window.ScreenLanding = ScreenLanding;
window.ScreenSearch = ScreenSearch;
window.MapBg = MapBg;
window.PillButton = PillButton;
window.Sheet = Sheet;
window.StatusChip = StatusChip;
window.Style = Style;
window.Mono = Mono;
window.PSColors = { INK, PAPER, PAPER2, LIME, MUTED, HAIRLINE };
