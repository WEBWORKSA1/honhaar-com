/* Honhaar.com — site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var HB=window.HB||'';
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  /* ---------- Private inbox routing (the address is never written in the page) ---------- */
  var _k=[102,100,104,37,103,98,106,102,108,75,58,106,120,96,121,100,124,105,110,124];
  function inbox(){return String.fromCharCode.apply(null,_k.map(function(c){return c^11})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from Honhaar.com');
    });
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement,tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    var n=dark?'light':'dark';root.setAttribute('data-theme',n);store('hh-theme',n);
  });

  /* ---------- Nav ---------- */
  var here=location.pathname;
  $$('#menu a').forEach(function(a){
    var h=a.getAttribute('href');
    if(h===here||(h.indexOf('/guides/')>-1&&here.indexOf('/guides/')>-1)){a.classList.add('active');a.setAttribute('aria-current','page')}
  });
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu)bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)});

  /* ---------- Reveal, cookie, year ---------- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});
    $$('.reveal').forEach(function(el){io.observe(el)});
  }else $$('.reveal').forEach(function(el){el.classList.add('in')});
  var ck=$('#cookie');
  if(ck&&!store('hh-cookie'))ck.classList.add('show');
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('hh-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show')})});
  $$('.year').forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- Attribution (stored once per visitor, sent with leads) ---------- */
  var qs=new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign'].forEach(function(k){if(qs.get(k))store('hh-'+k,qs.get(k))});
  if(!store('hh-landing'))store('hh-landing',location.pathname+' | ref: '+(document.referrer||'direct'));

  /* ---------- Forms ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey'&&v!=='')data[k]=data[k]?data[k]+', '+v:v});
      if(f.hasAttribute('data-score'))data.lead_tier=scoreLead(data);
      data._subject=(f.getAttribute('data-subject')||'Honhaar.com form')+(data.lead_tier?' ['+data.lead_tier+']':'')+' — '+(data.name||data.email||'');
      data._template='table';data._captcha='false';
      data.page=location.pathname;
      data.first_landing=store('hh-landing')||'';
      ['utm_source','utm_medium','utm_campaign'].forEach(function(k){var v=store('hh-'+k);if(v)data[k]=v});
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received — we will reply within 48 hours.'}
          var go=f.getAttribute('data-thanks');
          f.reset();resetSteps(f);
          if(go)setTimeout(function(){location.href=HB+go},900);
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Network error — please try again in a minute.'}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });
  function scoreLead(d){
    var s=0,t=(d.timeline||''),n=(d.needs||'');
    if(/Within 3 months|This month/.test(t))s+=3;else if(/3–6/.test(t))s+=2;else if(/6–12/.test(t))s+=1;
    if(/Study abroad|Education loan|Online degree/.test(n))s+=2;
    if(/Above|10–25|25–50/.test(d.budget||''))s+=2;
    if(d.phone)s+=1;if(d.partner_consent)s+=1;
    return s>=7?'HOT':s>=4?'WARM':'NURTURE';
  }
  function resetSteps(f){
    var st=$$('.step',f);if(!st.length)return;
    st.forEach(function(s,i){s.classList.toggle('active',i===0)});
    $$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});
    f._go&&f._go(0,true);
  }
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0,lbl=$('.step-count',f);
    function go(n,force){
      if(!force&&n>i){var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
      if(lbl)lbl.textContent='Step '+(i+1)+' of '+steps.length;
    }
    f._go=go;
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    go(0,true);
  });

  /* ---------- YouTube facades ---------- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt'),t=v.getAttribute('data-title')||'YouTube video';
    v.innerHTML='<img loading="lazy" alt="'+esc(t)+'" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span aria-hidden="true">▶</span></div>';
    v.setAttribute('role','button');v.setAttribute('tabindex','0');v.setAttribute('aria-label','Play: '+t);
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+esc(t)+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener('click',play,{once:true});
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });

  /* ---------- Scholarship helpers ---------- */
  var DATA=window.HH_SCHOLARSHIPS||[],M=window.HH_MONTHS||[];
  var saved={};try{saved=JSON.parse(store('hh-saved')||'{}')}catch(e){saved={}}
  function monthsAway(dl){if(!dl)return 99;var m=new Date().getMonth()+1;var d=dl-m;return d<0?d+12:d}
  function whenText(s){
    if(!s.dl)return 'Window varies — check official site';
    var a=monthsAway(s.dl);
    return (a===0?'Usually closes this month':a===1?'Usually closes next month':'Usually closes in '+M[s.dl-1]);
  }
  function card(s){
    var urgent=s.dl&&monthsAway(s.dl)<=1;
    return '<article class="card sch" id="'+s.id+'"><div><h3>'+esc(s.name)+'</h3><div class="meta">'+
      '<span class="pill">'+esc(s.region==='Global'?'Open internationally':s.region)+'</span>'+
      '<span class="pill gold">'+esc(s.funding)+'</span>'+
      '<span class="pill">'+esc(s.level.join(' · '))+'</span>'+
      '<span class="pill">'+esc(s.type)+'</span>'+
      (s.dest!==s.region?'<span class="pill">Study in '+esc(s.dest)+'</span>':'')+
      '</div><p>'+esc(s.about)+'</p><p style="margin-top:8px;font-size:.84rem;color:var(--mute)">Provider: '+esc(s.provider)+'</p></div>'+
      '<div class="acts"><span class="when">'+(urgent?'<span class="pill coral">Closing soon</span><br>':'')+whenText(s)+'</span>'+
      '<a class="btn btn-teal btn-sm" href="'+s.url+'" target="_blank" rel="noopener nofollow">Official site ↗</a>'+
      '<button class="save'+(saved[s.id]?' on':'')+'" data-save="'+s.id+'" aria-pressed="'+(!!saved[s.id])+'">'+(saved[s.id]?'★ Saved':'☆ Save')+'</button></div></article>';
  }
  function bindSave(scope){
    $$('[data-save]',scope).forEach(function(b){b.addEventListener('click',function(){
      var id=b.getAttribute('data-save');if(saved[id])delete saved[id];else saved[id]=1;
      store('hh-saved',JSON.stringify(saved));
      b.classList.toggle('on',!!saved[id]);b.textContent=saved[id]?'★ Saved':'☆ Save';b.setAttribute('aria-pressed',!!saved[id]);
      var sc=$('#savedCount');if(sc)sc.textContent=Object.keys(saved).length;
    })});
  }

  /* Home: upcoming deadlines + featured */
  var up=$('#upcoming');
  if(up&&DATA.length){
    var list=DATA.filter(function(s){return s.dl}).sort(function(a,b){return monthsAway(a.dl)-monthsAway(b.dl)}).slice(0,6);
    up.innerHTML=list.map(function(s){return '<li><a href="'+HB+'/scholarships.html#'+s.id+'">'+esc(s.name)+'</a><span class="pill'+(monthsAway(s.dl)<=1?' coral':'')+'">'+M[s.dl-1]+'</span></li>'}).join('');
  }
  var feat=$('#featured');
  if(feat&&DATA.length){
    var ids=(feat.getAttribute('data-ids')||'').split(',');
    feat.innerHTML=DATA.filter(function(s){return ids.indexOf(s.id)>-1}).map(function(s){
      return '<a class="card link" href="'+HB+'/scholarships.html#'+s.id+'"><div class="meta" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="pill gold">'+esc(s.funding)+'</span><span class="pill">'+esc(s.dest)+'</span></div><h3>'+esc(s.name)+'</h3><p style="color:var(--ink2);font-size:.93rem">'+esc(s.about)+'</p><span class="pill">'+whenText(s)+'</span></a>';
    }).join('');
  }
  var cnt=$$('[data-count-sch]');cnt.forEach(function(el){el.textContent=DATA.length+'+'});

  /* Hero search → finder */
  var hs=$('#heroSearch');
  if(hs)hs.addEventListener('submit',function(e){e.preventDefault();location.href=HB+'/scholarships.html?q='+encodeURIComponent($('input',hs).value)});

  /* Finder */
  var res=$('#results');
  if(res&&DATA.length){
    var F={q:$('#fq'),region:$('#fregion'),level:$('#flevel'),type:$('#ftype'),funding:$('#ffund'),sort:$('#fsort'),saved:$('#fsaved')};
    if(qs.get('q'))F.q.value=qs.get('q');
    if(qs.get('region'))F.region.value=qs.get('region');
    if(qs.get('level'))F.level.value=qs.get('level');
    function run(){
      var q=F.q.value.trim().toLowerCase(),r=F.region.value,l=F.level.value,t=F.type.value,fu=F.funding.value,sv=F.saved.checked;
      var out=DATA.filter(function(s){
        if(q&&(s.name+' '+s.provider+' '+s.about+' '+s.dest+' '+s.type+' '+s.funding+' '+s.level.join(' ')+' '+s.region).toLowerCase().indexOf(q)<0)return false;
        if(r&&s.region!==r&&!(r==='Abroad'&&s.dest!=='India'&&s.dest!=='Pakistan'))return false;
        if(l&&s.level.indexOf(l)<0)return false;
        if(t&&s.type.indexOf(t)<0)return false;
        if(fu==='Full'&&s.funding!=='Full')return false;
        if(fu==='Partial'&&s.funding==='Full')return false;
        if(sv&&!saved[s.id])return false;
        return true;
      });
      if(F.sort.value==='deadline')out.sort(function(a,b){return monthsAway(a.dl)-monthsAway(b.dl)});
      else if(F.sort.value==='az')out.sort(function(a,b){return a.name.localeCompare(b.name)});
      else out.sort(function(a,b){return (a.funding==='Full'?0:1)-(b.funding==='Full'?0:1)});
      $('#resCount').textContent=out.length+' scholarship'+(out.length===1?'':'s');
      res.innerHTML=out.length?out.map(card).join(''):'<div class="empty card">No matches. Clear a filter — or <a href="'+HB+'/match.html">get a free personal match</a>.</div>';
      bindSave(res);
    }
    Object.keys(F).forEach(function(k){F[k].addEventListener(k==='q'?'input':'change',run)});
    $('#fclear').addEventListener('click',function(){F.q.value='';F.region.value='';F.level.value='';F.type.value='';F.funding.value='';F.saved.checked=false;run()});
    $$('[data-quick]').forEach(function(c){c.addEventListener('click',function(){var p=c.getAttribute('data-quick').split('=');F[p[0]].value=p[1];run()})});
    run();
    var sc=$('#savedCount');if(sc)sc.textContent=Object.keys(saved).length;
    if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el){el.style.borderColor='var(--gold)';el.scrollIntoView({block:'center'})}}
  }

  /* ---------- Contest countdown: last day of the month, 23:59 IST ---------- */
  var cd=$('#contestCountdown');
  if(cd){
    function deadline(){var n=new Date();var d=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+1,0,18,29,0));if(d<n)d=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+2,0,18,29,0));return d}
    var target=deadline(),cdl=$('#contestDate');
    if(cdl)cdl.textContent=target.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'})+', 11:59 pm IST';
    (function tick(){var ms=Math.max(0,target-new Date());var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
      cd.textContent=d+'d '+(h<10?'0':'')+h+'h '+(m<10?'0':'')+m+'m '+(s<10?'0':'')+s+'s';setTimeout(tick,1000)})();
    var th=$('#contestTheme');
    if(th){var themes=['Essay: “The problem in my town I would solve first”','Art & Design: “Tomorrow’s classroom”','Coding: a tool that helps students','Speech (2-min video): “What talent means to me”','Photography: “Work, hands and hope”','Science explainer: one idea in 90 seconds','Short story: “The letter that changed everything”','Innovation pitch: a 1-page startup for your community','Poetry (original): “Home”','Data story: a chart about your city','Debate video: “Exams measure talent — agree or disagree?”','Entrepreneurship: earn ₹1,000 / Rs 1,000 ethically in 30 days'];
      th.textContent=themes[new Date().getMonth()]}
  }

  /* ---------- Tools ---------- */
  $$('.tool-tabs button').forEach(function(b){b.addEventListener('click',function(){
    $$('.tool-tabs button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
    $$('.tool').forEach(function(t){t.classList.toggle('on',t.id===b.getAttribute('data-tool'))});
    history.replaceState(null,'','#'+b.getAttribute('data-tool'));
  })});
  if(location.hash){var hb=$('.tool-tabs button[data-tool="'+location.hash.slice(1)+'"]');if(hb)hb.click()}
  function num(id){var el=document.getElementById(id);return el?parseFloat(el.value)||0:0}
  function bind(ids,fn){ids.forEach(function(id){var el=document.getElementById(id);if(el){el.addEventListener('input',fn);el.addEventListener('change',fn)}});fn()}
  function fmt(n,cur){cur=cur||'₹';if(!isFinite(n))return '—';return cur+Math.round(n).toLocaleString('en-IN')}

  if($('#t-cgpa')){bind(['g-cgpa','g-scale','g-formula'],function(){
    var c=num('g-cgpa'),sc=num('g-scale')||10,f=$('#g-formula').value,p;
    if(f==='cbse')p=c*9.5;else if(f==='mu')p=7.1*c+11;else if(f==='aktu')p=(c-0.75)*10;else p=c/sc*100;
    if(sc!==10&&f!=='linear'){p=c/sc*100}
    p=Math.max(0,Math.min(100,p));
    $('#g-out').textContent=p.toFixed(2)+'%';
    $('#g-div').textContent=p>=75?'Distinction (most Indian boards)':p>=60?'First division':p>=50?'Second division':p>=33?'Pass':'Below pass';
    $('#g-bar').style.width=p+'%';
    $('#g-us').textContent=(c/sc*4).toFixed(2)+' / 4.0';
  })}
  if($('#t-emi')){bind(['e-amt','e-rate','e-yrs','e-mor','e-simple'],function(){
    var P=num('e-amt'),r=num('e-rate')/1200,n=Math.max(1,num('e-yrs')*12),mor=num('e-mor'),simple=$('#e-simple').checked;
    var interestMor=simple?P*r*mor:P*(Math.pow(1+r,mor)-1);
    var P2=P+interestMor;
    var emi=r?P2*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P2/n;
    var total=emi*n;
    $('#e-out').textContent=fmt(emi)+'/month';
    $('#e-mi').textContent=fmt(interestMor);$('#e-prin').textContent=fmt(P2);
    $('#e-int').textContent=fmt(total-P);$('#e-tot').textContent=fmt(total);
    $('#e-bar').style.width=Math.min(100,P/total*100)+'%';
    $('#e-80e').textContent='In India, interest on a qualifying education loan can be deductible under Section 80E for up to 8 years — confirm with a tax professional.';
  })}
  if($('#t-abroad')){
    var C={UK:{t:2400000,l:1600000,m:12,cur:'£'},USA:{t:4200000,l:1900000,m:24,cur:'$'},Canada:{t:2300000,l:1300000,m:24,cur:'C$'},Germany:{t:150000,l:1100000,m:24,cur:'€'},Australia:{t:3000000,l:1700000,m:24,cur:'A$'},Ireland:{t:2000000,l:1300000,m:12,cur:'€'},France:{t:600000,l:1100000,m:24,cur:'€'},Japan:{t:600000,l:1000000,m:24,cur:'¥'}};
    bind(['a-country','a-style','a-schol','a-fx'],function(){
      var c=C[$('#a-country').value],style=num('a-style'),sch=num('a-schol')/100;
      var tuition=c.t,living=c.l*style,visa=60000,travel=70000,ins=c.m>12?90000:45000;
      var gross=tuition+living+visa+travel+ins,net=gross-tuition*sch;
      $('#a-out').textContent=fmt(net);
      $('#a-t').textContent=fmt(tuition);$('#a-l').textContent=fmt(living);$('#a-o').textContent=fmt(visa+travel+ins);$('#a-s').textContent='− '+fmt(tuition*sch);
      $('#a-m').textContent=c.m+' months typical programme';
      var fx=num('a-fx');$('#a-pk').textContent=fx?('≈ Rs '+Math.round(net*fx).toLocaleString('en-PK')+' (PKR at your rate)'):'';
    });
  }
  if($('#t-plan')){bind(['p-date','p-type'],function(){
    var v=$('#p-date').value,out=$('#p-out');
    if(!v){out.innerHTML='<li>Pick your deadline to build a backward plan.</li>';return}
    var d=new Date(v+'T12:00:00'),type=$('#p-type').value;
    var plan=type==='abroad'?[[120,'Shortlist 6–10 programmes and scholarships; check eligibility line by line'],[100,'Book English / aptitude tests (IELTS, TOEFL, GRE) if required'],[80,'Ask 2–3 referees; send them your CV and a one-page brag sheet'],[60,'Draft personal statement / SOP v1 (see our SOP guide)'],[45,'Get feedback from two people; rewrite v2'],[30,'Order transcripts, degree certificates and translations'],[14,'Final proofread; fill every form field offline first'],[3,'Submit — never on the last day; save PDF copies of everything']]
      :[[45,'Confirm eligibility, income limits and documents list on the official site'],[35,'Get income, caste/domicile and bonafide certificates issued'],[25,'Scan documents to the required size and format'],[20,'Draft any essay or statement of purpose'],[10,'Fill the form; double-check bank account and Aadhaar/CNIC seeding'],[5,'Submit and download the acknowledgement'],[0,'Deadline — then track status and institute verification weekly']];
    var today=new Date();today.setHours(0,0,0,0);
    out.innerHTML=plan.map(function(p){var x=new Date(d);x.setDate(x.getDate()-p[0]);var late=x<today;return '<li'+(late?' style="opacity:.6"':'')+'><b>'+x.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})+'</b>'+(late?' <span class="pill coral">overdue</span>':'')+'<br>'+p[1]+'</li>'}).join('');
    var days=Math.round((d-today)/864e5);$('#p-days').textContent=days>=0?days+' days left':'Deadline passed';
  })}
  if($('#t-ready')){
    var boxes=$$('#t-ready input[type=checkbox]'),st={};try{st=JSON.parse(store('hh-ready')||'{}')}catch(e){}
    function upd(){var done=boxes.filter(function(b){return b.checked}).length,p=Math.round(done/boxes.length*100);$('#r-out').textContent=p+'%';$('#r-bar').style.width=p+'%';$('#r-msg').textContent=p===100?'Application-ready. Submit early.':p>=60?'Close — finish the missing documents this week.':'Start with the documents that take longest: certificates and references.'}
    boxes.forEach(function(b){b.checked=!!st[b.id];b.addEventListener('change',function(){st[b.id]=b.checked;store('hh-ready',JSON.stringify(st));upd()})});upd();
  }

  /* ---------- Guide filter ---------- */
  var gs=$('#guideSearch');
  if(gs)gs.addEventListener('input',function(){var q=gs.value.toLowerCase();$$('[data-guide]').forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(q)>-1?'':'none'})});

  /* ---------- Donation amount sync ---------- */
  $$('[data-amt]').forEach(function(b){b.addEventListener('click',function(){var r=document.querySelector('input[name=amount][value="'+b.getAttribute('data-amt')+'"]');if(r){r.checked=true;r.scrollIntoView({block:'center'})}})});
})();
