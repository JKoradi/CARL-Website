/* CARL inverse-kinematics simulation — synced from kinematics.html */
(()=>{
const host=document.querySelector('#simulation carl-kinematics');
if(!host)return;
const root=host.attachShadow({mode:'open'});
const style=document.createElement('style');
style.textContent="\n  :host{\n    --paper:#dde3e8;\n    --paper-hi:#eef2f5;\n    --ink:#101a24;\n    --ink-soft:#4a5a68;\n    --grid:#c5cfd8;\n    --rule:#b9c4cd;\n    /* link colours taken straight from the sketch */\n    --l1:#f0a81e;\n    --l2:#a41fb0;\n    --l3:#1663ab;\n    --l4:#e0202a;\n    --joint:#35b6f0;\n    --foot:#15803c;\n  }\n  *{box-sizing:border-box}\n  :host{margin:0;padding:0}\n:host{\n    background:var(--paper);\n    color:var(--ink);\n    font-family:\"IBM Plex Sans\",system-ui,sans-serif;\n    font-size:15px;line-height:1.5;\n    -webkit-font-smoothing:antialiased;\n  }\n  .wrap{max-width:1180px;margin:0 auto;padding:28px 20px 56px}\n\n  header.masthead{\n    display:flex;align-items:flex-end;justify-content:space-between;\n    gap:24px;flex-wrap:wrap;\n    border-bottom:1.5px solid var(--ink);\n    padding-bottom:14px;margin-bottom:22px;\n  }\n  .eyebrow{\n    font-family:\"IBM Plex Mono\",monospace;\n    font-size:11px;letter-spacing:.18em;text-transform:uppercase;\n    color:var(--ink-soft);margin:0 0 4px;\n  }\n  h1{\n    font-family:\"Space Grotesk\",\"IBM Plex Sans\",sans-serif;\n    font-weight:700;font-size:clamp(28px,4.2vw,42px);\n    letter-spacing:-.02em;line-height:1;margin:0;\n  }\n  .lede{max-width:38ch;font-size:14px;color:var(--ink-soft);margin:0}\n\n  .bench{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:22px;align-items:start}\n  @media (max-width:900px){.bench{grid-template-columns:1fr}}\n\n  .plate{\n    background:var(--paper-hi);\n    border:1.5px solid var(--ink);\n    margin-bottom:18px;\n  }\n  .plate-label{\n    display:flex;justify-content:space-between;align-items:center;gap:12px;\n    font-family:\"IBM Plex Mono\",monospace;\n    font-size:11px;letter-spacing:.14em;text-transform:uppercase;\n    color:var(--ink-soft);\n    border-bottom:1px solid var(--rule);\n    padding:8px 12px;\n  }\n  .plate-body{padding:12px}\n\n  svg#stage{display:block;width:100%;height:auto;touch-action:none;background:\n    linear-gradient(var(--grid) 1px,transparent 1px) 0 0/22px 22px,\n    linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/22px 22px,\n    var(--paper-hi);\n  }\n\n  /* ---------- link styling ---------- */\n  .lk{stroke-linecap:round;fill:none}\n  #lnL1{stroke:var(--l1);stroke-width:7}\n  #lnL2{stroke:var(--l2);stroke-width:7}\n  #lnL3{stroke:var(--l3);stroke-width:7}\n  #lnL41,#lnL42{stroke:var(--l4);stroke-width:7}\n  #hipbar{stroke:var(--ink);stroke-width:4;stroke-linecap:round}\n  .joint{fill:var(--joint);stroke:var(--ink);stroke-width:1.4}\n  .pivot{fill:var(--paper-hi);stroke:var(--ink);stroke-width:2.4}\n  .guide{stroke:var(--ink-soft);stroke-width:1;stroke-dasharray:4 4;fill:none;opacity:.7}\n  .reachline{stroke:var(--ink-soft);stroke-width:1.2;stroke-dasharray:2 5;fill:none}\n  .arc{fill:none;stroke:var(--ink);stroke-width:1.4}\n  .arc.k{stroke:var(--l4)}\n  .lab{font-family:\"IBM Plex Mono\",monospace;font-size:11px;fill:var(--ink-soft)}\n  .lab.big{font-size:12px;fill:var(--ink);font-weight:500}\n  .lab.l1{fill:var(--l1)}.lab.l2{fill:var(--l2)}.lab.l3{fill:var(--l3)}.lab.l4{fill:var(--l4)}\n  .ws{fill:none;stroke:#48c7ff;stroke-width:3.2;stroke-linecap:round;opacity:.58}\n  #trace{fill:none;stroke:var(--foot);stroke-width:1.6;stroke-dasharray:5 4;opacity:.85}\n  #footdot{fill:var(--foot);stroke:var(--ink);stroke-width:1.5}\n  #halo{fill:var(--foot);opacity:.14}\n  #handle{cursor:grab}\n  #handle:active{cursor:grabbing}\n  #handle:focus-visible #halo{opacity:.3}\n  .stale #lnL1,.stale #lnL2,.stale #lnL3,.stale #lnL41,.stale #lnL42{opacity:.35}\n\n  /* hover isolation from the solution sheet */\n  #stage[data-hl] .fade{opacity:.12}\n  #stage[data-hl=\"foot\"]  .h-foot,\n  #stage[data-hl=\"k\"]     .h-k,\n  #stage[data-hl=\"psi\"]   .h-psi,\n  #stage[data-hl=\"e\"]     .h-e,\n  #stage[data-hl=\"reach\"] .h-reach,\n  #stage[data-hl=\"p1\"]    .h-p1,\n  #stage[data-hl=\"out\"]   .h-out{opacity:1}\n\n  /* ---------- controls ---------- */\n  .ctls{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px}\n  @media (max-width:520px){.ctls{grid-template-columns:1fr}}\n  .ctl label{\n    display:flex;justify-content:space-between;gap:8px;\n    font-family:\"IBM Plex Mono\",monospace;font-size:11px;\n    letter-spacing:.05em;color:var(--ink-soft);\n  }\n  .ctl label b{color:var(--ink);font-weight:600}\n  input[type=range]{width:100%;margin:4px 0 0;accent-color:var(--l2);height:18px}\n  input[type=range]:focus-visible{outline:2px solid var(--ink);outline-offset:3px}\n  .ctl .range-entry{display:flex;align-items:center;gap:8px;margin-top:4px}\n  .ctl .range-entry input[type=range]{flex:1;min-width:0;margin:0}\n  .ctl .range-entry input[type=number]{width:75px;min-width:0;padding:5px 6px;background:var(--paper-hi);border:1px solid var(--rule);color:var(--ink);font:12px \"IBM Plex Mono\",monospace}\n  .linked-note{font:11px \"IBM Plex Mono\",monospace;color:var(--ink-soft);margin-top:8px}\n  .swatch{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:baseline}\n  .sub{grid-column:1/-1;font-family:\"IBM Plex Mono\",monospace;font-size:10px;\n    letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft);\n    border-top:1px solid var(--rule);padding-top:9px;margin-top:3px}\n  .btnrow{display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px;border-top:1px solid var(--rule)}\n  button{\n    font-family:\"IBM Plex Mono\",monospace;font-size:11px;letter-spacing:.08em;\n    text-transform:uppercase;background:var(--paper-hi);color:var(--ink);\n    border:1.5px solid var(--ink);padding:7px 11px;cursor:pointer;\n  }\n  button:hover{background:var(--ink);color:var(--paper-hi)}\n  button[aria-pressed=\"true\"]{background:var(--ink);color:var(--paper-hi)}\n  button:focus-visible{outline:2px solid var(--l2);outline-offset:2px}\n\n  /* ---------- solution sheet ---------- */\n  .step{\n    display:grid;grid-template-columns:1fr auto;gap:2px 12px;\n    padding:9px 12px;border-bottom:1px solid var(--rule);\n  }\n  .step:last-of-type{border-bottom:none}\n  .step:hover{background:var(--paper)}\n  .step .idx{\n    font-family:\"IBM Plex Mono\",monospace;font-size:10px;color:var(--ink-soft);\n    letter-spacing:.14em;grid-column:1/-1;\n  }\n  .step .name{font-size:13.5px;font-weight:500}\n  .step .formula{\n    grid-column:1/2;font-family:\"IBM Plex Mono\",monospace;font-size:11.5px;\n    color:var(--ink-soft);line-height:1.45;\n  }\n  .step .val{\n    grid-column:2/3;grid-row:2/4;align-self:center;text-align:right;\n    font-family:\"IBM Plex Mono\",monospace;font-size:13px;font-weight:600;white-space:nowrap;\n  }\n  .note{font-size:12.5px;color:var(--ink-soft);padding:11px 12px 13px;margin:0;border-top:1px solid var(--rule)}\n  .note code{font-family:\"IBM Plex Mono\",monospace;background:var(--paper);padding:1px 4px}\n  #reachFlag.bad{color:var(--l4)}\n  footer{\n    display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;\n    border-top:1.5px solid var(--ink);margin-top:18px;padding-top:10px;\n    font-family:\"IBM Plex Mono\",monospace;font-size:10.5px;\n    letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);\n  }\n  @media (prefers-reduced-motion:reduce){*{transition:none!important}}\n/* CARL portfolio dark theme */\n:host{--paper:#0b0e12;--paper-hi:#171d25;--ink:#f1f3f5;--ink-soft:#a3aebb;--grid:#303a46;--rule:#38424f;--joint:#35b6f0;--foot:#4fc88d}\nbutton:hover,button[aria-pressed=\"true\"]{background:#ff794a;color:#10151b}\n:host{background:var(--paper);color:var(--ink)}\n.back-link{display:inline-block;color:#ff794a;text-decoration:none;font:600 12px 'IBM Plex Mono',monospace;letter-spacing:.05em;margin-bottom:18px}.back-link:hover{text-decoration:underline}\n\n:host{display:block;width:100%;font-family:\"IBM Plex Sans\",system-ui,sans-serif;line-height:1.5;background:#0b0e12;color:#f1f3f5} .wrap{max-width:none;margin:0;padding:0} .masthead{display:none} .back-link{display:none}";
root.appendChild(style);
const content=document.createElement('div');
content.innerHTML="<div class=\"wrap\">\n<a class=\"back-link\" href=\"index.html\">← BACK TO CARL PROJECT</a>\n\n  \n\n  <div class=\"bench\">\n\n    <!-- =============== stage =============== -->\n    <div>\n      <div class=\"plate\">\n        <div class=\"plate-label\"><span>Mechanism</span><span id=\"statusText\"></span></div>\n        <svg id=\"stage\" viewBox=\"0 0 660 570\" role=\"img\" aria-label=\"Five-bar leg linkage\">\n          <path id=\"wspace\" class=\"ws fade\"></path>\n          <polyline id=\"trace\" class=\"fade h-foot\" points=\"\" style=\"display:none\"></polyline>\n\n          <line id=\"vertA\" class=\"guide fade h-out\"></line>\n          <line id=\"vertB\" class=\"guide fade h-k h-out\"></line>\n          <line id=\"extK\"  class=\"guide fade h-psi\" style=\"stroke:var(--l4);opacity:.55\"></line>\n          <line id=\"reachE\" class=\"reachline fade h-reach h-p1\"></line>\n\n          <line id=\"hipbar\" class=\"fade h-k h-p1 h-out\"></line>\n          <line id=\"lnL2\"  class=\"lk fade h-k h-out\"></line>\n          <line id=\"lnL41\" class=\"lk fade h-psi h-e\"></line>\n          <line id=\"lnL42\" class=\"lk fade h-foot h-psi h-k\"></line>\n          <line id=\"lnL3\"  class=\"lk fade h-p1 h-reach\"></line>\n          <line id=\"lnL1\"  class=\"lk fade h-p1 h-out\"></line>\n\n          <path id=\"arcT2\" class=\"arc fade h-k h-out\"></path>\n          <path id=\"arcT1\" class=\"arc fade h-p1 h-out\"></path>\n          <path id=\"arcK\"  class=\"arc k fade h-psi\"></path>\n\n          <circle id=\"pivA\" class=\"pivot fade h-p1 h-out\" r=\"6\"></circle>\n          <circle id=\"pivB\" class=\"pivot fade h-k h-out\" r=\"6\"></circle>\n          <circle id=\"jP1\"  class=\"joint fade h-p1\" r=\"6\"></circle>\n          <circle id=\"jE\"   class=\"joint fade h-e h-reach\" r=\"6\"></circle>\n          <circle id=\"jK\"   class=\"joint fade h-k h-psi\" r=\"6\"></circle>\n\n          <text id=\"labL1\" class=\"lab l1 fade h-p1 h-out\">L₁</text>\n          <text id=\"labL2\" class=\"lab l2 fade h-k h-out\">L₂</text>\n          <text id=\"labL3\" class=\"lab l3 fade h-p1 h-reach\">L₃</text>\n          <text id=\"labL41\" class=\"lab l4 fade h-psi h-e\">L₄.₁</text>\n          <text id=\"labL42\" class=\"lab l4 fade h-foot h-psi\">L₄.₂</text>\n          <text id=\"labK\"  class=\"lab l4 fade h-psi\">κ</text>\n          <text id=\"labT1\" class=\"lab big fade h-p1 h-out\">θ₁</text>\n          <text id=\"labT2\" class=\"lab big fade h-k h-out\">θ₂</text>\n          <text id=\"labA\"  class=\"lab fade h-p1 h-out\">A</text>\n          <text id=\"labB\"  class=\"lab fade h-k h-out\">B</text>\n          <text id=\"labE\"  class=\"lab fade h-e h-reach\">E</text>\n          <text id=\"labKp\" class=\"lab fade h-k h-psi\">K</text>\n          <text id=\"labP1\" class=\"lab fade h-p1\">P₁</text>\n\n          <g id=\"handle\" class=\"fade h-foot\" tabindex=\"0\"\n             aria-label=\"Foot target — drag, or use arrow keys to nudge\">\n            <circle id=\"halo\" r=\"17\"></circle>\n            <circle id=\"footdot\" r=\"7\"></circle>\n            <text id=\"footlab\" class=\"lab big\"></text>\n          </g>\n        </svg>\n        <div class=\"btnrow\">\n          <button id=\"playBtn\" aria-pressed=\"false\">Play walk cycle</button>\n          <button id=\"reverseBtn\" aria-pressed=\"false\" title=\"Reverse foot travel direction\">Reverse gait</button>\n          <button id=\"wsBtn\" aria-pressed=\"true\">Hide workspace</button>\n          <button id=\"legRight\" aria-pressed=\"true\">Right leg</button>\n          <button id=\"legLeft\" aria-pressed=\"false\">Left leg</button>\n          <button id=\"resetBtn\">Reset</button>\n        </div>\n      </div>\n    </div>\n\n    <!-- =============== controls + sheet =============== -->\n    <div>\n      <div class=\"plate\">\n        <div class=\"plate-label\"><span>Geometry</span><span id=\"paraFlag\"></span></div>\n        <div class=\"plate-body\">\n          <div class=\"ctls\">\n            <div class=\"ctl\"><label for=\"sL1\"><span><span class=\"swatch\" style=\"background:var(--l1)\"></span>L₁ driven</span><b id=\"vL1\"></b></label><input id=\"sL1\" type=\"range\" min=\"30\" max=\"180\" step=\"1\" value=\"85\"></div>\n            <div class=\"ctl\"><label for=\"sL2\"><span><span class=\"swatch\" style=\"background:var(--l2)\"></span>L₂ driven</span><b id=\"vL2\"></b></label><input id=\"sL2\" type=\"range\" min=\"50\" max=\"260\" step=\"1\" value=\"150\"></div>\n            <div class=\"ctl\"><label><span><span class=\"swatch\" style=\"background:var(--l3)\"></span>L₃ passive (linked to L₂)</span><b id=\"vL3\">150 mm</b></label><div class=\"linked-note\">Automatically matches L₂</div></div>\n            <div class=\"sub\">L₄.₁ = L₁ and L₃ = L₂ (coupled link lengths).</div>\n            <div class=\"ctl\"><label for=\"sL42\"><span><span class=\"swatch\" style=\"background:var(--l4)\"></span>L₄.₂ to foot</span><b id=\"vL42\"></b></label><input id=\"sL42\" type=\"range\" min=\"30\" max=\"260\" step=\"1\" value=\"140\"></div>\n            <div class=\"ctl\"><label for=\"sK\"><span>Kink κ</span><b id=\"vK\"></b></label><input id=\"sK\" type=\"range\" min=\"-45\" max=\"60\" step=\"0.5\" value=\"15\"></div>\n\n            <div class=\"sub\">Walk cycle</div>\n            <div class=\"ctl\"><label for=\"sStep\"><span>Step length</span><b id=\"vStep\"></b></label><input id=\"sStep\" type=\"range\" min=\"20\" max=\"220\" step=\"1\" value=\"110\"></div>\n            <div class=\"ctl\"><label for=\"sLift\"><span>Foot lift</span><b id=\"vLift\"></b></label><input id=\"sLift\" type=\"range\" min=\"5\" max=\"90\" step=\"1\" value=\"40\"></div>\n            <div class=\"ctl\"><label for=\"sDepth\"><span>Stance depth</span><b id=\"vDepth\"></b></label><input id=\"sDepth\" type=\"range\" min=\"60\" max=\"340\" step=\"1\" value=\"200\"></div>\n            <div class=\"ctl\"><label for=\"sOff\"><span>Stance offset x</span><b id=\"vOff\"></b></label><input id=\"sOff\" type=\"range\" min=\"-140\" max=\"140\" step=\"1\" value=\"0\"></div>\n          </div>\n        </div>\n      </div>\n\n      <section class=\"plate\" aria-label=\"Inverse kinematics results\">\n        <div class=\"plate-label\"><span>Foot position and joint angles</span><span id=\"reachFlag\">in range</span></div>\n        <div class=\"plate-body\">\n          <p>Target foot position (x, y): <strong id=\"oF\"></strong></p>\n          <p>Joint angles: <strong id=\"oTh\"></strong></p>\n          <p class=\"note\">Angles measured clockwise from vertically upwards. Left-leg joint angles are mirrored; limits below refer to the right-leg convention. Joint limits: θ₁ −95° to 25°; θ₂ 162.732° to 282.732° (wraps through ±180°). Relative opening angle between L₁ and L₂: greater than 47.1° and at most 152.2°. Invalid targets are rejected.</p>\n        </div>\n      </section>\n    </div>\n  </div>\n\n  <footer>\n    <span>Two driven links · one rigid bent distal body · one foot</span>\n    <span>Solved analytically</span>\n  </footer>\n</div>\n\n";
root.appendChild(content);

(function(){
  "use strict";
  const $ = id => root.getElementById(id);
  const stage = $("stage");
  const DEG = 180/Math.PI, RAD = Math.PI/180;

  const CX = 330, CY = 150;
  let S = 1;

  const st = {
    L1:85, L2:150, L3:150, L41:85, L42:140, kink:15*RAD, d:0,
    x:0, y:200, leg:"right", sK:+1, sP:+1, walking:false, phase:0, reverse:false, showWs:true
  };
  let gait = {step:110, lift:40, depth:200, off:0};
  let pose = null;          // last successfully solved pose
  let solvable = true;

  const px = p => [CX + S*p.x, CY + S*p.y];
  function scaleFor(){ return 0.8; } // Fixed pixels/mm: changing a link never rescales the other links.

  // ---- circle ∩ circle --------------------------------------------------
  function ci(P, rP, Q, rQ, sign){
    const dx=Q.x-P.x, dy=Q.y-P.y, d=Math.hypot(dx,dy);
    if(d<1e-9) return null;
    if(d>rP+rQ-1e-9 || d<Math.abs(rP-rQ)+1e-9) return null;
    const a=(d*d+rP*rP-rQ*rQ)/(2*d);
    const h=Math.sqrt(Math.max(0,rP*rP-a*a));
    const ux=dx/d, uy=dy/d;
    return { x:P.x+a*ux + sign*h*(-uy), y:P.y+a*uy + sign*h*ux };
  }

  // Angles are clockwise from upward (negative screen y).
  const jointAngle = (from,to) => Math.atan2(to.x-from.x, from.y-to.y);
  const wrap360 = deg => ((deg%360)+360)%360;
  const theta2Allowed = deg => { const wrapped=wrap360(deg); return wrapped>=162.732-1e-8 && wrapped<=282.732+1e-8; };
  const openingAngle = (a,b) => Math.acos(Math.max(-1,Math.min(1,Math.cos(a-b))))*DEG;

  // Reject crossed-link assemblies: the physical L2 (B-K) and L3 (P1-E)
  // cannot pass through one another. This checks the finite segments, not
  // their infinitely extended lines.
  function segmentsIntersect(a,b,c,d){
    const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
    const eps=1e-8;
    const abC=cross(a,b,c), abD=cross(a,b,d);
    const cdA=cross(c,d,a), cdB=cross(c,d,b);
    if(((abC>eps&&abD< -eps)||(abC< -eps&&abD>eps)) &&
       ((cdA>eps&&cdB< -eps)||(cdA< -eps&&cdB>eps))) return true;
    const onSegment=(p,q,r)=>Math.min(p.x,r.x)-eps<=q.x&&q.x<=Math.max(p.x,r.x)+eps &&
      Math.min(p.y,r.y)-eps<=q.y&&q.y<=Math.max(p.y,r.y)+eps;
    return (Math.abs(abC)<=eps&&onSegment(a,c,b)) ||
      (Math.abs(abD)<=eps&&onSegment(a,d,b)) ||
      (Math.abs(cdA)<=eps&&onSegment(c,a,d)) ||
      (Math.abs(cdB)<=eps&&onSegment(c,b,d));
  }

  // ---- inverse kinematics ----------------------------------------------
  function solveRightIK(fx, fy){
    const A = {x:-st.d/2, y:0}, B = {x:+st.d/2, y:0}, F = {x:fx, y:fy};

    const K = ci(B, st.L2, F, st.L42, +1);
    if(!K) return null;

    const vx=F.x-K.x, vy=F.y-K.y, n=Math.hypot(vx,vy);
    const a = -(Math.PI - st.kink), c=Math.cos(a), s=Math.sin(a);
    const ex=(vx*c - vy*s)/n, ey=(vx*s + vy*c)/n;
    const E = {x:K.x + st.L41*ex, y:K.y + st.L41*ey};

    const r = Math.hypot(E.x-A.x, E.y-A.y);
    const candidates = [+1,-1].map(sign=>ci(A,st.L1,E,st.L3,sign)).filter(Boolean);
    const P1 = candidates.find(p=>{
      if(segmentsIntersect(B,K,p,E)) return false;
      const t1=jointAngle(A,p), t2=jointAngle(B,K);
      const relative=openingAngle(t1,t2);
      return t1*DEG>=-95 && t1*DEG<=25 &&
        theta2Allowed(t2*DEG) && relative>47.1 && relative<=152.2;
    });
    if(!P1) return null;

    return {
      A,B,F,K,E,P1,r,
      psi: Math.atan2(ex, ey),
      th1: jointAngle(A,P1),
      th2: jointAngle(B,K)
    };
  }

  // A left leg is the exact geometric reflection of the right leg.
  // Solve in right-leg coordinates first, then mirror every joint and the foot.
  // This preserves the kink, the selected assembly branch, and collision checks.
  function solveIK(fx, fy){
    const right=solveRightIK(st.leg==="left" ? -fx : fx,fy);
    if(!right) return null;
    if(st.leg==="right") return right;
    const mirror=p=>({x:-p.x,y:p.y});
    return {
      ...right,
      A:mirror(right.A), B:mirror(right.B), F:mirror(right.F),
      K:mirror(right.K), E:mirror(right.E), P1:mirror(right.P1),
      psi:-right.psi,
      th1:jointAngle(mirror(right.A),mirror(right.P1)),
      th2:jointAngle(mirror(right.B),mirror(right.K))
    };
  }

  // ---- svg helpers ------------------------------------------------------
  function line(el,p,q){ const a=px(p),b=px(q);
    el.setAttribute("x1",a[0].toFixed(2));el.setAttribute("y1",a[1].toFixed(2));
    el.setAttribute("x2",b[0].toFixed(2));el.setAttribute("y2",b[1].toFixed(2)); }
  function dot(el,p){ const a=px(p); el.setAttribute("cx",a[0].toFixed(2));el.setAttribute("cy",a[1].toFixed(2)); }
  function text(el,p,dx,dy,s){ const a=px(p);
    el.setAttribute("x",(a[0]+dx).toFixed(2));el.setAttribute("y",(a[1]+dy).toFixed(2));
    if(s!==undefined) el.textContent=s; }
  function arc(el,c,rad,a0,a1){
    const C=px(c); let d=a1-a0;
    while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
    const x0=C[0]+rad*Math.cos(a0), y0=C[1]+rad*Math.sin(a0);
    const x1=C[0]+rad*Math.cos(a0+d), y1=C[1]+rad*Math.sin(a0+d);
    el.setAttribute("d",`M${x0.toFixed(2)} ${y0.toFixed(2)} A${rad} ${rad} 0 0 ${d>0?1:0} ${x1.toFixed(2)} ${y1.toFixed(2)}`);
  }
  const scr = (p,q) => Math.atan2(px(q)[1]-px(p)[1], px(q)[0]-px(p)[0]);
  const mid = (p,q) => ({x:(p.x+q.x)/2, y:(p.y+q.y)/2});
  const mm = v => v.toFixed(1);
  const dg = v => (v*DEG).toFixed(1)+"°";
  const pt = p => `(${mm(p.x)}, ${mm(p.y)})`;

  // ---- workspace (sampled through the same IK) --------------------------
  function buildWorkspace(){
    const R = st.L2 + st.L42;
    const x0=-R, x1=R, y0=-0.45*R, y1=R, N=104;
    const hx=(x1-x0)/N, hy=(y1-y0)/N;
    let d="";
    for(let i=0;i<=N;i++){
      const X=x0+i*hx;
      for(let j=0;j<=N;j++){
        const Y=y0+j*hy;
        if(solveIK(X,Y)){ const p=px({x:X,y:Y}); d+=`M${p[0].toFixed(1)} ${p[1].toFixed(1)}h0.01`; }
      }
    }
    $("wspace").setAttribute("d", d);
  }

  // ---- render -----------------------------------------------------------
  function render(){
    S = scaleFor();
    const sol = solveIK(st.x, st.y);
    solvable = !!sol;
    pose = sol; // Never display an old linkage with newly changed slider dimensions.
    stage.classList.toggle("stale", !solvable);
    if(!pose){
      // Hide old geometry rather than showing stale link lengths after slider changes.
      const ids=["hipbar","lnL1","lnL3","lnL41","lnL42","lnL2","reachE","vertA","vertB","extK","arcT1","arcT2","arcK"];
      ids.forEach(id=>$(id).setAttribute("visibility","hidden"));
      ["pivA","pivB","jP1","jE","jK"].forEach(id=>$(id).setAttribute("visibility","hidden"));
      ["labL1","labL3","labL41","labL42","labL2","labK","labT1","labT2","labA","labB","labE","labKp","labP1"].forEach(id=>$(id).setAttribute("visibility","hidden"));
      $("statusText").textContent="target unreachable — adjust foot position or geometry";
      $("oF").textContent=pt({x:st.x,y:st.y});
      $("oTh").textContent="—";
      $("reachFlag").textContent="out of limits";
      $("reachFlag").classList.add("bad");
      const f=px({x:st.x,y:st.y});
      $("handle").setAttribute("transform",`translate(${f[0].toFixed(2)},${f[1].toFixed(2)})`);
      return;
    }
    ["hipbar","lnL1","lnL3","lnL41","lnL42","lnL2","reachE","vertA","vertB","extK","arcT1","arcT2","arcK","pivA","pivB","jP1","jE","jK","labL1","labL3","labL41","labL42","labL2","labK","labT1","labT2","labA","labB","labE","labKp","labP1"].forEach(id=>$(id).removeAttribute("visibility"));

    const {A,B,K,E,P1,r,psi,th1,th2} = pose;
    const F = {x:st.x, y:st.y};
    const Fp = pose.F;

    line($("hipbar"), A, B);
    line($("lnL1"), A, P1);
    line($("lnL3"), P1, E);
    line($("lnL41"), E, K);
    line($("lnL42"), K, Fp);
    line($("lnL2"), B, K);
    line($("reachE"), A, E);

    line($("vertA"), A, {x:A.x, y:-44/S});
    line($("vertB"), B, {x:B.x, y:-64/S});

    // backward extension of L4.2 through K — the thin reference line
    const ux=(Fp.x-K.x)/st.L42, uy=(Fp.y-K.y)/st.L42;
    line($("extK"), K, {x:K.x - ux*st.L41*1.15, y:K.y - uy*st.L41*1.15});

    dot($("pivA"), A); dot($("pivB"), B);
    dot($("jP1"), P1); dot($("jE"), E); dot($("jK"), K);

    arc($("arcT1"), A, 34, -Math.PI/2, scr(A,P1));
    arc($("arcT2"), B, 50, -Math.PI/2, scr(B,K));
    arc($("arcK"),  K, 30, Math.atan2(-uy,-ux), scr(K,E));

    text($("labL1"),  mid(A,P1),  10, -6, "L₁ "+mm(st.L1));
    text($("labL3"),  mid(P1,E),  -8, -8, "L₃ "+mm(st.L3));
    text($("labL41"), mid(E,K),  -34,  0, "L₄.₁ "+mm(st.L41));
    text($("labL42"), mid(K,Fp),  12,  4, "L₄.₂ "+mm(st.L42));
    text($("labL2"),  mid(B,K),    6, -8, "L₂ "+mm(st.L2));
    text($("labK"),   K,          -8, -30, "κ "+dg(st.kink));
    text($("labT1"),  A,         -66,  30, "θ₁ "+dg(th1));
    text($("labT2"),  B,          14,  60, "θ₂ "+dg(th2));
    text($("labA"),   A,         -18, -12, "A");
    text($("labB"),   B,          10, -12, "B");
    text($("labE"),   E,         -20,  -12, "E");
    text($("labKp"),  K,         -18,  16, "K");
    text($("labP1"),  P1,         10, -12, "P₁");

    const f = px(F);
    $("handle").setAttribute("transform",`translate(${f[0].toFixed(2)},${f[1].toFixed(2)})`);
    $("halo").setAttribute("cx",0);$("halo").setAttribute("cy",0);
    $("footdot").setAttribute("cx",0);$("footdot").setAttribute("cy",0);
    $("footlab").setAttribute("x",14);$("footlab").setAttribute("y",22);
    $("footlab").textContent = pt(F);

    $("oF").textContent   = pt(F);
    $("oTh").textContent  = solvable ? "θ₁ "+dg(th1)+"  θ₂ "+dg(th2) : "—";

    $("reachFlag").textContent = solvable ? "in range" : "out of limits";
    $("reachFlag").classList.toggle("bad", !solvable);
    $("statusText").textContent = st.walking
      ? "Walking · phase "+(st.phase*100).toFixed(0)+"%"
      : (solvable ? "θ₁ "+dg(th1)+" · θ₂ "+dg(th2) : "target unreachable · showing last pose");

    const para = Math.abs(st.L1-st.L41)<0.5 && Math.abs(st.L2-st.L3)<0.5;
    $("paraFlag").textContent = para ? "parallelogram" : "general four-bar";
  }

  // ---- walk trajectory --------------------------------------------------
  function walkPoint(t){
    const reverseTrajectory = st.leg==="right" ? !st.reverse : st.reverse;
    if(reverseTrajectory) t=(1-t+1)%1; // Mirror gait direction for the right leg.
    if(t < 0.6){ const u=t/0.6; return [gait.off + gait.step/2 - u*gait.step, gait.depth]; }
    const u=(t-0.6)/0.4;
    return [gait.off - gait.step/2 + u*gait.step, gait.depth - gait.lift*Math.sin(Math.PI*u)];
  }
  function buildTrace(){
    const pts=[];
    for(let i=0;i<=140;i++){
      const [x,y]=walkPoint(i/140); const s=px({x,y});
      pts.push(s[0].toFixed(1)+","+s[1].toFixed(1));
    }
    $("trace").setAttribute("points",pts.join(" "));
  }

  let last=0;
  function tick(ts){
    if(!st.walking) return;
    if(!last) last=ts;
    st.phase = (st.phase + (ts-last)/1700) % 1;
    last = ts;
    const [x,y] = walkPoint(st.phase);
    st.x=x; st.y=y;
    render();
    requestAnimationFrame(tick);
  }

  // ---- dragging ---------------------------------------------------------
  function toLocal(evt){
    const p = stage.createSVGPoint();
    p.x = evt.clientX; p.y = evt.clientY;
    const q = p.matrixTransform(stage.getScreenCTM().inverse());
    return [(q.x-CX)/S, (q.y-CY)/S];
  }
  let dragging=false;
  function startDrag(e){
    dragging=true;
    if(st.walking) stopWalk();
    $("handle").focus({preventScroll:true});
    moveDrag(e); e.preventDefault();
  }
  function moveDrag(e){
    if(!dragging) return;
    const [x,y]=toLocal(e);
    if(solveIK(x,y)){ st.x=x; st.y=y; render(); }
  }
  $("handle").addEventListener("pointerdown", startDrag);
  stage.addEventListener("pointerdown", e => { if(e.target.closest("#handle")) return; startDrag(e); });
  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", ()=>{ dragging=false; });

  $("handle").addEventListener("keydown", e=>{
    const k = e.shiftKey ? 10 : 2;
    const map = {ArrowLeft:[-k,0],ArrowRight:[k,0],ArrowUp:[0,-k],ArrowDown:[0,k]};
    if(!map[e.key]) return;
    if(st.walking) stopWalk();
    const x=st.x+map[e.key][0],y=st.y+map[e.key][1];
    if(solveIK(x,y)){st.x=x;st.y=y;render();} e.preventDefault();
  });

  // ---- hover isolation --------------------------------------------------
  root.querySelectorAll(".step").forEach(row=>{
    const on = ()=> stage.setAttribute("data-hl", row.dataset.hl);
    const off = ()=> stage.removeAttribute("data-hl");
    row.addEventListener("mouseenter",on); row.addEventListener("mouseleave",off);
    row.addEventListener("focusin",on);    row.addEventListener("focusout",off);
  });

  // ---- controls ---------------------------------------------------------
  function bind(id,label,fmt,apply,heavy){
    const el=$(id);
    const numeric=document.createElement("input");
    numeric.type="number";
    numeric.id=id+"Number";
    numeric.setAttribute("aria-label",el.closest(".ctl").querySelector("label span").textContent.trim()+" numeric value");
    numeric.min=el.min; numeric.max=el.max; numeric.step=el.step;
    const row=document.createElement("div");
    row.className="range-entry";
    el.parentNode.insertBefore(row,el);
    row.appendChild(el);
    row.appendChild(numeric);
    const update=(value)=>{
      const min=Number(el.min), max=Number(el.max);
      if(!Number.isFinite(value)) return;
      const clamped=Math.max(min,Math.min(max,value));
      el.value=String(clamped);
      numeric.value=el.value;
      apply(Number(el.value));
      $(label).textContent=fmt(Number(el.value));
      if(heavy) buildWorkspace();
      buildTrace(); render();
    };
    el.addEventListener("input",()=>update(Number(el.value)));
    numeric.addEventListener("change",()=>update(Number(numeric.value)));
    numeric.addEventListener("keydown",e=>{if(e.key==="Enter"){numeric.blur();}});
    update(Number(el.value));
  }
  const asMM = v => v+" mm";
  const asDeg = v => v+"°";
  bind("sL1","vL1",asMM,v=>{st.L1=v;st.L41=v;},true);
  bind("sL2","vL2",asMM,v=>{st.L2=v;st.L3=v;$("vL3").textContent=asMM(v);},true);
  bind("sL42","vL42",asMM,v=>st.L42=v,true);
  bind("sK","vK",asDeg,v=>st.kink=v*RAD,true);
  bind("sStep","vStep",asMM,v=>gait.step=v);
  bind("sLift","vLift",asMM,v=>gait.lift=v);
  bind("sDepth","vDepth",asMM,v=>gait.depth=v);
  bind("sOff","vOff",asMM,v=>gait.off=v);

  function stopWalk(){
    st.walking=false; last=0;
    $("playBtn").setAttribute("aria-pressed","false");
    $("playBtn").textContent="Play walk cycle";
    $("trace").style.display="none";
    render();
  }
  $("playBtn").addEventListener("click",()=>{
    if(st.walking){ stopWalk(); return; }
    st.walking=true; last=0;
    $("playBtn").setAttribute("aria-pressed","true");
    $("playBtn").textContent="Pause walk cycle";
    buildTrace(); $("trace").style.display="";
    requestAnimationFrame(tick);
  });
  $("reverseBtn").addEventListener("click",()=>{
    st.reverse=!st.reverse;
    st.phase=(1-st.phase+1)%1; // Keep foot position continuous on direction changes.
    $("reverseBtn").setAttribute("aria-pressed",String(st.reverse));
    $("reverseBtn").textContent=st.reverse?"Forward gait":"Reverse gait";
    buildTrace(); render();
  });
  $("wsBtn").addEventListener("click",()=>{
    st.showWs=!st.showWs;
    $("wspace").style.display = st.showWs?"":"none";
    $("wsBtn").setAttribute("aria-pressed",String(st.showWs));
    $("wsBtn").textContent = st.showWs?"Hide workspace":"Show workspace";
  });
  function selectLeg(side){
    st.leg=side;
    $("legRight").setAttribute("aria-pressed",String(side==="right"));
    $("legLeft").setAttribute("aria-pressed",String(side==="left"));
    buildWorkspace(); render();
  }
  $("legRight").addEventListener("click",()=>selectLeg("right"));
  $("legLeft").addEventListener("click",()=>selectLeg("left"));
  $("resetBtn").addEventListener("click",()=>{
    stopWalk();
    st.leg="right";
    $("legRight").setAttribute("aria-pressed","true"); $("legLeft").setAttribute("aria-pressed","false");
    const d={sL1:85,sL2:150,sL42:140,sK:15,
             sStep:110,sLift:40,sDepth:200,sOff:0};
    for(const k in d){ $(k).value=d[k]; }
    for(const k in d){ $(k).dispatchEvent(new Event("input")); }
    st.x=0; st.y=200; buildWorkspace(); render();
  });

  buildWorkspace(); buildTrace(); render();
})();

})();
