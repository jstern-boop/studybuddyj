(function(){
const ES=document.documentElement.lang==='es';
const $=id=>document.getElementById(id);
const STORE='https://studybuddyj.com/public/select-session#:~:text=';

/* ---------- chalkboard ticker ---------- */
const tk=$('ticker');
if(tk){const lines=['y = mx + b ✓','slope = rise / run ✓','a² + b² = c² ✓','2x + 3 = 11 → x = 4 ✓','|x − 2| < 5 ✓'];
 if(ES)lines[1]='pendiente = subida / avance ✓';
 let li=0;setInterval(()=>{li=(li+1)%lines.length;tk.textContent=lines[li]},2200);}

/* ---------- counters ---------- */
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,end=+el.dataset.count,start=end>1000?1900:0;let n=start;const step=Math.max(1,Math.round((end-start)/40));const t=setInterval(()=>{n=Math.min(end,n+step);el.textContent=n;if(n>=end)clearInterval(t)},25);io.unobserve(el)}),{threshold:.6});
 document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));}

/* ---------- 60-second math check ---------- */
const quiz=$('quiz');
if(quiz){
 const Q=ES?[
  {q:'Resuelve: 2x + 3 = 11',o:['x = 7','x = 4','x = 5.5','x = 8'],a:1,e:'Deshaz las operaciones en orden inverso. Primero quita el 3 (2x = 8), luego divide entre 2 (x = 4). Comprueba: 2(4) + 3 = 11 ✓'},
  {q:'¿Cuál es la pendiente de y = 3x − 2?',o:['−2','3','2/3','−3'],a:1,e:'En y = mx + b, el número pegado a la x es la pendiente. Pendiente significa "cuánto sube y cuando x sube 1". Aquí es 3.'},
  {q:'Simplifica: 3(x + 4)',o:['3x + 4','x + 12','3x + 12','7x'],a:2,e:'El 3 tiene que visitar a todos dentro del paréntesis: 3·x y 3·4. Eso es la propiedad distributiva: 3x + 12.'}
 ]:[
  {q:'Solve: 2x + 3 = 11',o:['x = 7','x = 4','x = 5.5','x = 8'],a:1,e:'Undo things in reverse order. Take away the 3 first (2x = 8), then split it in half (x = 4). Check it: 2(4) + 3 = 11 ✓'},
  {q:'What is the slope of y = 3x − 2?',o:['−2','3','2/3','−3'],a:1,e:'In y = mx + b, the number stuck to x is the slope. Slope just means "how much y goes up when x goes up by 1." Here that\'s 3.'},
  {q:'Simplify: 3(x + 4)',o:['3x + 4','x + 12','3x + 12','7x'],a:2,e:'The 3 has to visit everyone inside the parentheses: 3·x and 3·4. That\'s the distributive property: 3x + 12.'}
 ];
 const T=ES?{res:'Tu resultado',good:'¡Muy bien! ¿Quieres ir un paso adelante? La videoteca tiene todos los temas de Álgebra 1.',gap:'Para eso son las clases. Una sesión puede cerrar estas brechas rápido.',plan:'Encontrar mi plan',again:'Intentar de nuevo',qn:(i,n)=>`Pregunta ${i} de ${n}`,ex:'J explica:',next:'Siguiente →',see:'Ver mi resultado',start:'../empezar/'}
  :{res:'Your result',good:'Nice work! Want to stay ahead? The video library has every Algebra 1 topic.',gap:'That\'s exactly what lessons are for. One session can close these gaps fast.',plan:'Find my plan',again:'Try again',qn:(i,n)=>`Question ${i} of ${n}`,ex:'J explains:',next:'Next →',see:'See my score',start:'get-started/'};
 const startHref=quiz.dataset.start||T.start;
 let qi=0,score=0,answered=false;
 function renderQ(){
  if(qi>=Q.length){
   quiz.innerHTML=`<div class="qnum">${T.res}</div><div class="score">${score} / ${Q.length}</div><p style="color:#cfe0ff;margin:8px 0 20px">${score===3?T.good:T.gap}</p><div class="btns"><a class="btn btn-main" href="${startHref}">${T.plan}</a><button class="btn btn-alt" id="again">${T.again}</button></div>`;
   $('again').onclick=()=>{qi=0;score=0;renderQ()};return;}
  const d=Q[qi];answered=false;
  quiz.innerHTML=`<div class="qnum">${T.qn(qi+1,Q.length)}</div><div class="qtext">${d.q}</div><div class="opts">${d.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}</div><div class="explain" id="exp"><b>${T.ex}</b><br>${d.e}</div><div class="qnav"><div class="dots">${Q.map((_,i)=>`<i class="${i<=qi?'on':''}"></i>`).join('')}</div><button class="btn btn-main" id="next" style="display:none;padding:11px 20px">${qi===Q.length-1?T.see:T.next}</button></div>`;
  quiz.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
   if(answered)return;answered=true;const i=+b.dataset.i;
   if(i===d.a){score++;b.classList.add('right')}else{b.classList.add('wrong');quiz.querySelector(`.opt[data-i="${d.a}"]`).classList.add('right')}
   $('exp').classList.add('show');$('next').style.display='inline-block';});
  $('next').onclick=()=>{qi++;renderQ()};
 }
 renderQ();
}

/* ---------- video library ---------- */
const lib=$('lib');
if(lib&&window.SBJ_VIDEOS){
 const V=window.SBJ_VIDEOS;
 const SUBJ=ES?{'Algebra 1':'Álgebra 1','Geometry':'Geometría','Algebra 2':'Álgebra 2','Algebra 2 & Trig':'Álgebra 2 y Trigonometría'}:null;
 const nm=s=>ES?SUBJ[s]:s;
 const colors={'Algebra 1':'#e76f51','Geometry':'#2a9d8f','Algebra 2':'#3a5ba0','Algebra 2 & Trig':'#8e5bd1'};
 let filt='all';const search=$('search');
 function render(){
  const s=search.value.toLowerCase().trim();
  const list=V.filter(v=>(filt==='all'||v[1]===filt)&&(!s||(nm(v[1])+' '+(ES?'sesión ':'session ')+v[2]+' '+(ES?v[5]:v[4])+' '+v[0]).toLowerCase().includes(s)));
  $('count').textContent=ES?`${list.length} ${list.length===1?'sesión':'sesiones'} · $40 cada una, o incluidas en una suscripción`:`${list.length} session${list.length===1?'':'s'} · $40 each, or included in a subscription`;
  lib.innerHTML=list.map(v=>`<a class="vid" href="${STORE}${v[0]}" target="_blank" rel="noopener"><div class="play" style="background:${colors[v[1]]}">▶</div><div><b>${nm(v[1])}, ${ES?'Sesión':'Session'} ${v[2]}</b><span>${ES?v[5]:v[4]}${v[3]?' · '+v[3]:''}</span><span class="go">${ES?'Comprar · $40 →':'Buy · $40 →'}</span></div></a>`).join('')||`<p style="color:var(--ink-soft)">${ES?'Ninguna sesión coincide. Prueba con "pendiente" o "funciones".':'No sessions match that search. Try "slope" or "functions".'}</p>`;
 }
 search.addEventListener('input',render);
 document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('on'));b.classList.add('on');filt=b.dataset.f;render()});
 render();
}

/* ---------- plan finder ---------- */
const finder=$('finder');
if(finder){
 const F=ES?[
  {q:'¿Quién necesita ayuda?',c:[['🧒','Un estudiante de secundaria (4.º a 8.º grado)','ms'],['🎒','Un estudiante de preparatoria','hs'],['🎓','Un estudiante universitario','col']]},
  {q:'¿Cuál es la situación?',c:[['⏰','Se acerca un examen','test'],['📉','Las calificaciones han bajado todo el año','slip'],['🚀','Va bien y quiere adelantarse','ahead']]},
  {q:'¿Cómo aprende mejor?',c:[['👤','Uno a uno con un maestro','live'],['▶','A su propio ritmo','video'],['👥','Con otros estudiantes','group']]}
 ]:[
  {q:'Who needs help?',c:[['🧒','A middle schooler (grades 4–8)','ms'],['🎒','A high schooler','hs'],['🎓','A college student','col']]},
  {q:'What\'s the situation?',c:[['⏰','A test is coming up soon','test'],['📉','Grades have been slipping all year','slip'],['🚀','Doing fine, wants to get ahead','ahead']]},
  {q:'How do they learn best?',c:[['👤','One-on-one with a teacher','live'],['▶','On their own schedule','video'],['👥','With other students','group']]}
 ];
 const R=ES?{
  live:['Clases particulares en vivo','Con un examen cerca, unas cuantas clases en vivo son la forma más rápida de mejorar. J empieza con el material de esta semana y repasa lo que falta.','Clases privadas basadas exactamente en lo que tu estudiante está viendo, a su propio ritmo.'],
  group:['Programa de Álgebra 1 en grupo','Clases en video, sesiones de resolución de problemas y práctica cada semana. $1 para inscribirse. Grupos en español disponibles.'],
  video:['Una suscripción de videos','Avanza por el curso completo en orden y mantente un paso adelante. El plan Semestral cubre un semestre.','Reconstruye las bases en casa, sesión por sesión, con apuntes para imprimir. Agrega una clase en vivo cuando algo no quede claro.'],
  rec:'nuestra recomendación',book:'Pedir una primera clase',redo:'Empezar de nuevo'
 }:{
  live:['Live 1-on-1 tutoring','With a test coming up, a few focused live lessons are the fastest fix. J will start with this week\'s material and work back to the gaps.','Private lessons built around exactly what your student is working on, at a pace that fits them.'],
  group:['Algebra 1 group program','Weekly video lessons, problem-solving sessions and practice days, for $1 to register. Spanish-language groups available too.'],
  video:['A video subscription','Work through the full course in order and stay a step ahead of class. The Half plan covers a semester.','Rebuild the foundation at home, session by session, with notes to print. Add a live lesson anytime something doesn\'t click.'],
  rec:'our recommendation',book:'Request a first lesson',redo:'Start over'
 };
 let fi=0,ans=[];
 function renderF(){
  $('bar').style.width=(fi/F.length*100)+'%';
  if(fi>=F.length){
   let title,why;
   if(ans[1]==='test'||ans[2]==='live'||ans[0]==='col'){title=R.live[0];why=ans[1]==='test'?R.live[1]:R.live[2]}
   else if(ans[2]==='group'){title=R.group[0];why=R.group[1]}
   else{title=R.video[0];why=ans[1]==='ahead'?R.video[1]:R.video[2]}
   finder.innerHTML=`<div class="result"><div style="font-family:Caveat,cursive;font-size:24px;color:#9fb0cf">${R.rec}</div><h3>${title}</h3><p>${why}</p><div class="btns" style="margin-top:22px"><a class="btn btn-main" href="#book">${R.book}</a><button class="btn btn-alt" id="redo">${R.redo}</button></div></div>`;
   $('redo').onclick=()=>{fi=0;ans=[];renderF()};return;}
  const d=F[fi];
  finder.innerHTML=`<div class="step-q">${d.q}</div><div class="choices">${d.c.map(c=>`<button class="choice" data-v="${c[2]}"><span>${c[0]}</span>${c[1]}</button>`).join('')}</div>`;
  finder.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{ans[fi]=b.dataset.v;fi++;renderF()});
 }
 renderF();
}

/* ---------- booking form (demo) ---------- */
const bf=$('bookForm');
if(bf)bf.addEventListener('submit',e=>{e.preventDefault();bf.style.display='none';$('sent').style.display='block'});
})();
