
(()=>{
  const topbar=document.getElementById('topbar');
  const navToggle=document.getElementById('navToggle');
  const navLinks=document.getElementById('navLinks');
  const navAnchors=[...document.querySelectorAll('.links a')];
  const navDropdowns=[...document.querySelectorAll('.nav-dropdown')];
  const pageSemester=document.body.dataset.pageSemester;
  const closeDropdowns=except=>navDropdowns.forEach(dropdown=>{
    if(dropdown===except)return;
    dropdown.classList.remove('open');
    dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false');
  });
  const onScroll=()=>{topbar.classList.toggle('scrolled',window.scrollY>20);document.getElementById('backTop').classList.toggle('show',window.scrollY>600)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.classList.toggle('open',open);navToggle.setAttribute('aria-expanded',open);navToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu')});
  navDropdowns.forEach(dropdown=>{
    const toggle=dropdown.querySelector('.nav-dropdown-toggle');
    toggle.addEventListener('click',event=>{
      event.stopPropagation();
      const willOpen=!dropdown.classList.contains('open');
      closeDropdowns(dropdown);
      dropdown.classList.toggle('open',willOpen);
      toggle.setAttribute('aria-expanded',willOpen?'true':'false');
    });
  });
  navAnchors.forEach(a=>a.addEventListener('click',()=>{closeDropdowns();navLinks.classList.remove('open');navToggle.classList.remove('open');navToggle.setAttribute('aria-expanded','false')}));
  document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))closeDropdowns()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDropdowns();navLinks.classList.remove('open');navToggle.classList.remove('open');navToggle.setAttribute('aria-expanded','false')}});

  if(pageSemester){
    document.querySelector(`[data-semester-menu="${pageSemester}"] .nav-dropdown-toggle`)?.classList.add('active');
  }else if(document.body.classList.contains('ppg-detail-page')){
    document.querySelector('.nav-lk3')?.classList.add('active');
  }else{
    document.querySelector('.nav-home')?.classList.add('active');
  }

  // Active nav
  const sections=[...document.querySelectorAll('main section[id]')];
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){navAnchors.forEach(a=>{const href=a.getAttribute('href')||'';const hash=href.includes('#')?href.slice(href.indexOf('#')):'';const homeMatch=!pageSemester&&a.classList.contains('nav-home')&&e.target.id==='beranda';a.classList.toggle('active',homeMatch||hash==='#'+e.target.id)})}})},{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sections.forEach(s=>obs.observe(s));

  // Semester panels
  const semesterPanels=[...document.querySelectorAll('[data-semester-panel]')];
  const semesterTriggers=[...document.querySelectorAll('[data-semester-jump]')];
  function activateSemester(semester,scroll=true,targetSelector=''){
    semesterPanels.forEach(panel=>{
      const on=panel.dataset.semesterPanel===String(semester);
      panel.classList.toggle('active',on);
      panel.hidden=!on;
    });
    semesterTriggers.forEach(trigger=>{
      const on=trigger.dataset.semesterJump===String(semester);
      trigger.classList.toggle('semester-selected',on);
      if(trigger.tagName==='BUTTON')trigger.setAttribute('aria-pressed',on?'true':'false');
    });
    if(scroll){
      requestAnimationFrame(()=>{
        const target=(targetSelector&&document.querySelector(targetSelector))||document.querySelector(`[data-semester-panel="${semester}"]`);
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    }
  }
  semesterTriggers.forEach(trigger=>trigger.addEventListener('click',event=>{
    event.preventDefault();
    const href=trigger.getAttribute('href');
    activateSemester(trigger.dataset.semesterJump,true,href&&href.startsWith('#')?href:'');
  }));
  if(pageSemester){
    activateSemester(pageSemester,false);
    if(location.hash){
      requestAnimationFrame(()=>{
        const target=document.querySelector(location.hash);
        if(target)target.scrollIntoView({block:'start'});
      });
    }
  }

  // Reveal
  const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target)}})},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>{const d=el.dataset.delay;if(d)el.style.transitionDelay=d+'ms';revObs.observe(el)});

  // Hero slider (aktif hanya jika slideshow tersedia)
  const slides=[...document.querySelectorAll('.hero-slide')], dots=[...document.querySelectorAll('.slider-dots button')];
  if(slides.length){
    let current=0,timer;
    const show=n=>{current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));dots.forEach((d,i)=>d.classList.toggle('active',i===current))};
    const auto=()=>{clearInterval(timer);timer=setInterval(()=>show(current+1),5600)};
    const next=document.querySelector('.slide-arrow.next');
    const prev=document.querySelector('.slide-arrow.prev');
    if(next)next.addEventListener('click',()=>{show(current+1);auto()});
    if(prev)prev.addEventListener('click',()=>{show(current-1);auto()});
    dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);auto()}));
    const hs=document.getElementById('heroSlider');
    if(hs){hs.addEventListener('mouseenter',()=>clearInterval(timer));hs.addEventListener('mouseleave',auto)}
    auto();
  }

  // Course tabs, scoped independently inside each semester panel
  semesterPanels.forEach(semesterPanel=>{
    const tabs=[...semesterPanel.querySelectorAll('.course-tab')];
    const panels=[...semesterPanel.querySelectorAll('.reflection-panel')];
    function activateCourse(course,scroll=false){
      tabs.forEach(t=>{const on=t.dataset.course===course;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
      panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===course));
      if(scroll){const section=semesterPanel.querySelector('.reflection-section');if(section)section.scrollIntoView({behavior:'smooth',block:'start'})}
    }
    tabs.forEach(t=>t.addEventListener('click',()=>activateCourse(t.dataset.course,false)));
    semesterPanel.querySelectorAll('[data-jump]').forEach(c=>c.addEventListener('click',()=>activateCourse(c.dataset.jump,true)));
  });

  // Artifact filters, scoped independently inside each semester panel
  document.querySelectorAll('.artifact-section').forEach(section=>{
    const buttons=[...section.querySelectorAll('.artifact-filters button')];
    const items=[...section.querySelectorAll('.artifact-item')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;items.forEach(it=>it.classList.toggle('hidden',f!=='all'&&it.dataset.category!==f))}));
  });

  // Moments
  const moments=document.getElementById('momentSlider');
  if(moments){
    document.getElementById('momentNext')?.addEventListener('click',()=>moments.scrollBy({left:330,behavior:'smooth'}));
    document.getElementById('momentPrev')?.addEventListener('click',()=>moments.scrollBy({left:-330,behavior:'smooth'}));
  }

  // PDF modal
  const modal=document.getElementById('pdfModal'), frame=document.getElementById('pdfFrame'), openPdf=document.getElementById('openPdf');
  document.querySelectorAll('.preview-doc').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();const pdf=el.dataset.pdf||el.getAttribute('href');frame.src=pdf+'#toolbar=1&navpanes=0';openPdf.href=pdf;if(typeof modal.showModal==='function')modal.showModal();else window.open(pdf,'_blank')}));
  document.getElementById('closeModal').addEventListener('click',()=>{modal.close();frame.src='' });
  modal.addEventListener('click',e=>{if(e.target===modal){modal.close();frame.src=''}});
  modal.addEventListener('close',()=>frame.src='');

  document.getElementById('backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();
