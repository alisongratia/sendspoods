// Shared by index.html and shop.html: the cartoon spood drawing and the merch list.
(function(){
  function spoodSVG(o){
    o = o || {};
    var body=o.body||'#2A1636', accent=o.accent||'#FF6FAE', fuzz=o.fuzz, jumper=o.jumper!==false, thread=o.thread;
    var s='';
    if(thread) s+='<line x1="100" y1="0" x2="100" y2="70" stroke="'+body+'" stroke-width="2"/>';
    // legs
    var legs=[[-30,-18,-70,-50,-86,-20],[-32,-6,-78,-14,-94,16],[-30,6,-74,22,-86,56],[-24,14,-56,46,-62,82]];
    legs.forEach(function(l){
      [1,-1].forEach(function(d){
        s+='<path d="M100 112 Q'+(100+d*l[0]*1.6)+' '+(112+l[1]*1.4)+' '+(100+d*l[2])+' '+(112+l[3])+' T'+(100+d*l[4])+' '+(112+l[5])+'" fill="none" stroke="'+body+'" stroke-width="7" stroke-linecap="round"'+(fuzz?' stroke-dasharray="2 3"':'')+'/>';
        if(fuzz) s+='<path d="M100 112 Q'+(100+d*l[0]*1.6)+' '+(112+l[1]*1.4)+' '+(100+d*l[2])+' '+(112+l[3])+' T'+(100+d*l[4])+' '+(112+l[5])+'" fill="none" stroke="'+body+'" stroke-width="4" stroke-linecap="round"/>';
      });
    });
    // abdomen + head
    s+='<ellipse cx="100" cy="146" rx="34" ry="30" fill="'+body+'"/>';
    s+='<path d="M84 140 Q100 132 116 140 M86 154 Q100 146 114 154" stroke="'+accent+'" stroke-width="5" fill="none" stroke-linecap="round"/>';
    s+='<circle cx="100" cy="100" r="32" fill="'+body+'"'+(fuzz?' stroke="'+body+'" stroke-width="6" stroke-dasharray="3 3"':'')+'/>';
    // eyes
    if(jumper){
      s+='<circle cx="87" cy="100" r="12" fill="#fff"/><circle cx="113" cy="100" r="12" fill="#fff"/>';
      s+='<circle cx="89" cy="102" r="7" fill="#1a0d22"/><circle cx="115" cy="102" r="7" fill="#1a0d22"/>';
      s+='<circle cx="91" cy="99" r="2.6" fill="#fff"/><circle cx="117" cy="99" r="2.6" fill="#fff"/>';
      s+='<circle cx="70" cy="92" r="4" fill="#fff"/><circle cx="130" cy="92" r="4" fill="#fff"/>';
    } else {
      [[88,96],[112,96],[80,88],[120,88],[94,86],[106,86]].forEach(function(e,i){
        s+='<circle cx="'+e[0]+'" cy="'+e[1]+'" r="'+(i<2?7:4)+'" fill="#fff"/><circle cx="'+(e[0]+1)+'" cy="'+(e[1]+1)+'" r="'+(i<2?3.5:2)+'" fill="#1a0d22"/>';
      });
    }
    // little smile + chelicerae blush
    s+='<path d="M92 118 Q100 124 108 118" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>';
    s+='<circle cx="76" cy="114" r="5" fill="'+accent+'" opacity=".8"/><circle cx="124" cy="114" r="5" fill="'+accent+'" opacity=".8"/>';
    return '<svg viewBox="0 '+(thread?0:40)+' 200 '+(thread?190:150)+'" role="img" aria-label="Cartoon spider placeholder">'+s+'</svg>';
  }

  var products=[
    {n:'Mama Legs Mug',d:'Holds 12 oz of coffee and roughly forty spiderlings’ worth of love.',bg:'#FFD66B',tag:'first up',k:'mug'},
    {n:'Spood Crew Tee',d:'Heavyweight cotton. Front: Peaches, back: "8 legs, 0 problems."',bg:'#9BE3B9',tag:'fan fave',k:'tee'},
    {n:'Spood Shuttle Glass',d:'A clear glass for your drinks, or for gently relocating a spood. “Place spood here” circle included.',bg:'#7CCBFF',tag:'new',k:'glass'},
    {n:'Spood Spotter’s Field Journal',d:'Log every spood you meet: name, species, where found, vibe, and legs visible out of 8.',bg:'#C9B6FF',tag:'new',k:'journal'},
    {n:'Certified Spood Relocator',d:'Make it official. A badge for everyone who catches and releases.',bg:'#FFB38A',k:'badge'},
    {n:'Spood Eviction Notices',d:'Sticky notes for polite relocations: “You are being relocated. Nothing personal. — Management.”',bg:'#FFE872',k:'notes'},
    {n:'I Brake for Spoods',d:'Weatherproof bumper sticker, 10 × 3 in. Tell the world.',bg:'#FF9FCB',k:'sticker'},
    {n:'Spider-Friendly Home Decal',d:'A window decal that lets everyone know: this home catches and releases.',bg:'#9BE3B9',k:'decal'},
    {n:'Queen Stripes Pin',d:'Hard enamel pin with a gold zigzag, just like her web.',bg:'#7CCBFF',k:'pin'},
    {n:'Spood Rescue Cap',d:'An embroidered crew cap for the spood rescue squad.',bg:'#FFD66B',k:'cap'},
    {n:'Peaches Plush',d:'Eight wiggly legs, two enormous eyes, fully huggable.',bg:'#C9B6FF',tag:'so soft',k:'plush'},
    {n:'Spood Catcher',d:'A long-handled catcher for gentle, no-touch relocations. In the works.',bg:'#FF9FCB',tag:'someday',k:'catcher'}
  ];
  function productArt(k){
    var sp=function(t,sc,o){return '<g transform="'+t+' scale('+sc+')">'+spoodSVG(o||{}).replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</g>';};
    var L='#2A1636';
    if(k==='tee') return '<svg viewBox="0 0 200 160"><path d="M60 14 L30 30 L12 62 L38 74 L46 60 L46 150 L154 150 L154 60 L162 74 L188 62 L170 30 L140 14 Q100 36 60 14Z" fill="#FFFDF3" stroke="'+L+'" stroke-width="4" stroke-linejoin="round"/>'+sp('translate(66,40)',.34,{body:'#1A0D22',accent:'#FF6FAE',jumper:true})+'<text x="100" y="138" text-anchor="middle" font-family="Gaegu,cursive" font-weight="700" font-size="15" fill="'+L+'">spood crew</text></svg>';
    if(k==='mug') return '<svg viewBox="0 0 200 160"><path d="M140 52 Q178 52 176 86 Q174 118 140 116" fill="none" stroke="'+L+'" stroke-width="10"/><rect x="36" y="30" width="110" height="116" rx="12" fill="#FFFDF3" stroke="'+L+'" stroke-width="4"/>'+sp('translate(56,50)',.36,{body:'#4A2A1A',accent:'#FFE872',jumper:false,fuzz:true})+'</svg>';
    if(k==='sticker') return '<svg viewBox="0 0 200 160"><rect x="10" y="50" width="180" height="60" rx="10" fill="#FFFDF3" stroke="'+L+'" stroke-width="4" transform="rotate(-4 100 80)"/><text x="100" y="89" text-anchor="middle" font-family="Bagel Fat One,sans-serif" font-size="15" fill="'+L+'" transform="rotate(-4 100 80)">I BRAKE FOR SPOODS</text></svg>';
    if(k==='pin') return '<svg viewBox="0 0 200 160"><circle cx="100" cy="80" r="62" fill="#FFE872" stroke="'+L+'" stroke-width="6"/><path d="M70 40 L90 60 L70 80 L90 100 L70 120 M130 40 L110 60 L130 80 L110 100 L130 120" stroke="#fff" stroke-width="5" fill="none"/>'+sp('translate(64,48)',.36,{body:'#1A0D22',accent:'#FFE872',jumper:false})+'</svg>';
    if(k==='plush') return '<svg viewBox="0 0 200 160">'+sp('translate(10,-20)',.9,{body:'#3B1F12',accent:'#FF9F5A',jumper:true,fuzz:true})+'</svg>';
    var T=function(x,y,size,txt,fam,rot){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="'+(fam||'Figtree, sans-serif')+'" font-weight="800" font-size="'+size+'" fill="'+L+'"'+(rot?' transform="rotate('+rot+' '+x+' '+y+')"':'')+'>'+txt+'</text>';};
    if(k==='glass') return '<svg viewBox="0 0 200 160"><path d="M46 18 L154 18 L144 146 L56 146Z" fill="rgba(255,255,255,.6)" stroke="'+L+'" stroke-width="4" stroke-linejoin="round"/><path d="M58 26 L56 136" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>'+T(100,44,12,'SPOOD','Bagel Fat One, sans-serif')+T(100,56,9,'SHUTTLE')+T(100,67,6,'gentle relocation service')+'<circle cx="100" cy="100" r="24" fill="none" stroke="'+L+'" stroke-width="2" stroke-dasharray="4 4"/>'+sp('translate(88,86)',.12,{body:L,accent:'#FF6FAE',jumper:true})+T(100,136,7,'place spood here')+'</svg>';
    if(k==='journal') return '<svg viewBox="0 0 200 160"><rect x="52" y="14" width="100" height="134" rx="8" fill="#2A1636"/><rect x="58" y="14" width="94" height="134" rx="6" fill="#FFFDF3" stroke="'+L+'" stroke-width="4"/><rect x="138" y="14" width="6" height="134" fill="#FF6FAE"/>'+T(98,44,12,'SPOOD','Bagel Fat One, sans-serif')+T(98,58,8,'SPOTTER’S')+T(98,70,8,'FIELD JOURNAL')+sp('translate(80,78)',.2,{body:'#4A2A1A',accent:'#FFE872',jumper:false,fuzz:true})+'</svg>';
    if(k==='badge') return '<svg viewBox="0 0 200 160"><path d="M100 10 L150 28 L146 92 Q140 128 100 150 Q60 128 54 92 L50 28Z" fill="#FFFDF3" stroke="'+L+'" stroke-width="5" stroke-linejoin="round"/>'+T(100,42,9,'CERTIFIED')+sp('translate(82,48)',.18,{body:L,accent:'#FF6FAE',jumper:true})+T(100,104,13,'SPOOD','Bagel Fat One, sans-serif')+T(100,120,9,'RELOCATOR')+'<path d="M84 130 L100 138 L116 130" stroke="#FF6FAE" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
    if(k==='notes') return '<svg viewBox="0 0 200 160"><rect x="48" y="24" width="112" height="112" fill="#FFFDF3" stroke="'+L+'" stroke-width="3" transform="rotate(6 104 80)"/><rect x="42" y="18" width="112" height="112" fill="#FFF4B8" stroke="'+L+'" stroke-width="4" transform="rotate(-4 98 74)"/><g transform="rotate(-4 98 74)">'+T(98,46,14,'NOTICE','Bagel Fat One, sans-serif')+T(98,66,8,'You are being')+T(98,78,8,'relocated.')+T(98,94,8,'Nothing personal.')+T(98,114,8,'— Management')+'</g></svg>';
    if(k==='decal') return '<svg viewBox="0 0 200 160"><rect x="36" y="14" width="128" height="134" rx="4" fill="#DDF3FF" stroke="'+L+'" stroke-width="5"/><path d="M100 14 V148 M36 81 H164" stroke="'+L+'" stroke-width="5"/><circle cx="100" cy="81" r="34" fill="#FFFDF3" stroke="'+L+'" stroke-width="3"/>'+sp('translate(88,58)',.12,{body:L,accent:'#FF6FAE',jumper:true})+T(100,90,7,'SPIDER-FRIENDLY')+T(100,100,7,'HOME')+'</svg>';
    if(k==='cap') return '<svg viewBox="0 0 200 160"><path d="M40 104 Q42 40 100 38 Q158 40 160 104 Z" fill="#2A1636"/><path d="M40 104 Q100 92 188 112 Q160 124 40 110 Z" fill="#2A1636" stroke="#FFFDF3" stroke-width="2"/><circle cx="100" cy="40" r="5" fill="#FF6FAE"/><rect x="66" y="58" width="68" height="32" rx="8" fill="#FFE872" stroke="#FFFDF3" stroke-width="2" stroke-dasharray="3 2"/>'+T(100,72,9,'SPOOD','Bagel Fat One, sans-serif')+T(100,84,8,'RESCUE')+'</svg>';
    if(k==='catcher') return '<svg viewBox="0 0 200 160"><path d="M36 146 L104 78" stroke="'+L+'" stroke-width="8" stroke-linecap="round"/><path d="M36 146 L104 78" stroke="#FF6FAE" stroke-width="3" stroke-linecap="round"/><ellipse cx="124" cy="62" rx="30" ry="26" fill="rgba(255,255,255,.6)" stroke="'+L+'" stroke-width="4"/>'+sp('translate(112,48)',.12,{body:L,accent:'#FF6FAE',jumper:true})+'</svg>';
    return '';
  }

  function merchCard(p){
    return '<article class="item" style="--bg:'+p.bg+'"><div class="shot">'+productArt(p.k)+(p.tag?'<span class="tag">'+p.tag+'</span>':'')+'</div><div class="info"><h4>'+p.n+'</h4><p>'+p.d+'</p><div class="buy"><span class="soon">Coming soon</span></div></div></article>';
  }

  window.SpoodArt={spoodSVG:spoodSVG,products:products,productArt:productArt,merchCard:merchCard};
})();
