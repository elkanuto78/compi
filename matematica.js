/* Motor matemático de Compi: aritmética, álgebra, derivadas, integrales, límites, ecuaciones y más. */
(function(){
const PI=Math.PI;
/* ---------- formato ---------- */
const fmtN=v=>{
  if(!isFinite(v))return v>0?'∞':v<0?'−∞':'indefinido';
  if(Number.isInteger(v)&&Math.abs(v)<1e15)return String(v);
  let s=parseFloat(v.toPrecision(9)).toString();
  if(/e/.test(s)){const m=s.split('e');s=parseFloat(m[0]).toString().replace('.',',')+'·10^'+parseInt(m[1])}
  return s.replace('.',',');
};
const ratio=v=>{for(let q=1;q<=1000;q++){const p=v*q;if(Math.abs(p-Math.round(p))<1e-9*Math.max(1,Math.abs(p)))return[Math.round(p),q]}return null};
/* ---------- AST ---------- */
const N=v=>({k:'n',v}),V=n=>({k:'v',n}),PIn={k:'n',v:PI,s:'π'},En={k:'n',v:Math.E,s:'e'};
const isN=n=>n.k==='n'&&!n.s,isV=(n,v)=>n.k==='v'&&n.n===v;
const has=(n,v)=>n.k==='v'?n.n===v:n.k==='n'?false:n.k==='f'||n.k==='neg'||n.k==='!'?has(n.a,v):has(n.a,v)||has(n.b,v);
const vars=(n,s=new Set())=>{if(n.k==='v')s.add(n.n);else if(n.a){vars(n.a,s);if(n.b)vars(n.b,s)}return s};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const add=(a,b)=>isN(a)&&a.v===0?b:isN(b)&&b.v===0?a:isN(a)&&isN(b)?N(a.v+b.v):b.k==='neg'?sub(a,b.a):a.k==='neg'&&b.k!=='neg'?sub(b,a.a):{k:'+',a,b};
const neg=a=>isN(a)?N(-a.v):a.k==='neg'?a.a:{k:'neg',a};
const sub=(a,b)=>isN(b)&&b.v===0?a:isN(a)&&a.v===0?neg(b):isN(a)&&isN(b)?N(a.v-b.v):b.k==='neg'?add(a,b.a):{k:'-',a,b};
const mul=(a,b)=>{
  if(isN(a)&&a.v===0||isN(b)&&b.v===0)return N(0);
  if(isN(a)&&a.v===1)return b;if(isN(b)&&b.v===1)return a;
  if(isN(a)&&isN(b))return N(a.v*b.v);
  if(isN(b)&&!isN(a))return mul(b,a);
  if(isN(a)&&b.k==='*'&&isN(b.a))return mul(N(a.v*b.a.v),b.b);
  if(isN(a)&&a.v===-1)return neg(b);
  if(a.k==='neg')return neg(mul(a.a,b));if(b.k==='neg')return neg(mul(a,b.a));
  if(a.k==='*'&&isN(a.a)&&b.k==='*'&&isN(b.a))return mul(N(a.a.v*b.a.v),mul(a.b,b.b));
  if(a.k==='*'&&isN(a.a))return mul(a.a,mul(a.b,b));if(b.k==='*'&&isN(b.a))return mul(b.a,mul(a,b.b));
  {const pb=x=>x.k==='^'&&isN(x.b)?{b:x.a,e:x.b.v}:x.k==='v'?{b:x,e:1}:null,pa=pb(a),pc=pb(b);
   if(pa&&pc&&eq(pa.b,pc.b)){const e=pa.e+pc.e;return e===0?N(1):e===1?pa.b:{k:'^',a:pa.b,b:N(e)}}}
  if(a.k==='/'&&isN(a.a)&&a.a.v===1)return div(b,a.b);if(b.k==='/'&&isN(b.a)&&b.a.v===1)return div(a,b.b);
  return{k:'*',a,b};
};
const div=(a,b)=>eq(a,b)&&!isN(a)?N(1):isN(b)&&b.v===1?a:isN(a)&&a.v===0?N(0):isN(a)&&isN(b)&&b.v!==0?N(a.v/b.v):isN(b)&&b.v!==0?mul(N(1/b.v),a):{k:'/',a,b};
const pow=(a,b)=>isN(b)&&b.v===1?a:isN(b)&&b.v===0?N(1):isN(a)&&a.v===1?N(1):isN(a)&&isN(b)&&(a.v>=0||Number.isInteger(b.v))?N(Math.pow(a.v,b.v)):{k:'^',a,b};
const fn=(n,a)=>({k:'f',n,a});
/* ---------- parser ---------- */
const FUN={sec:'sec',csc:'csc',cot:'cot',sqrt:'sqrt',raiz:'sqrt',cbrt:'cbrt',sin:'sin',sen:'sin',cos:'cos',tan:'tan',tg:'tan',ln:'ln',log:'log',exp:'exp',abs:'abs',arcsen:'asin',asin:'asin',arccos:'acos',acos:'acos',arctan:'atan',atan:'atan',sinh:'sinh',cosh:'cosh',tanh:'tanh'};
const FNAMES=Object.keys(FUN).sort((a,b)=>b.length-a.length);
function tokenize(s){
  const T=[];let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){i++;continue}
    if(/[0-9.]/.test(c)){const m=s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/);if(!m)throw 0;T.push({t:'n',v:parseFloat(m[0])});i+=m[0].length;continue}
    if(/[a-z]/.test(c)){
      const rest=s.slice(i);let f=FNAMES.find(n=>rest.startsWith(n)&&!/^[a-z]/.test(rest.slice(n.length).replace(/^[0-9]*/,'')===''?'':''));
      f=FNAMES.find(n=>rest.startsWith(n));
      if(f){T.push({t:'f',v:FUN[f]});i+=f.length;continue}
      if(rest.startsWith('pi')){T.push({t:'c',v:'pi'});i+=2;continue}
      if(c==='e'){T.push({t:'c',v:'e'});i++;continue}
      T.push({t:'v',v:c});i++;continue;
    }
    if('+-*/^()!='.includes(c)){T.push({t:c});i++;continue}
    throw 0;
  }
  return T;
}
function parse(s){
  const T=tokenize(s);let p=0;
  const pk=()=>T[p],nx=()=>T[p++];
  const startsPrim=t=>t&&(t.t==='n'||t.t==='v'||t.t==='c'||t.t==='f'||t.t==='(');
  function expr(){let a=term();while(pk()&&(pk().t==='+'||pk().t==='-')){const o=nx().t;const b=term();a=o==='+'?add(a,b):sub(a,b)}return a}
  function term(){
    let a=unary();
    for(;;){
      const t=pk();
      if(t&&(t.t==='*'||t.t==='/')){nx();const b=unary();a=t.t==='*'?mul(a,b):div(a,b)}
      else if(startsPrim(t)){const b=unary();a=mul(a,b)}
      else break;
    }
    return a;
  }
  function unary(){const t=pk();if(t&&t.t==='-'){nx();return neg(unary())}if(t&&t.t==='+'){nx();return unary()}return pw()}
  function pw(){const a=post();if(pk()&&pk().t==='^'){nx();const b=unary();return pow(a,b)}return a}
  function post(){let a=prim();while(pk()&&pk().t==='!'){nx();a={k:'!',a}}return a}
  function prim(){
    const t=nx();if(!t)throw 0;
    if(t.t==='n')return N(t.v);
    if(t.t==='v')return V(t.v);
    if(t.t==='c')return t.v==='pi'?PIn:En;
    if(t.t==='('){const e=expr();if(!pk()||nx().t!==')')throw 0;return e}
    if(t.t==='f'){
      let a;
      if(pk()&&pk().t==='('){nx();a=expr();if(!pk()||nx().t!==')')throw 0}else a=pw();
      if(pk()&&pk().t==='^'&&false){}
      return fn(t.v,a);
    }
    throw 0;
  }
  const r=expr();if(p!==T.length)throw 0;return r;
}
/* ---------- evaluación ---------- */
const FACT=n=>{if(n<0||!Number.isInteger(n)||n>170)return NaN;let r=1;for(let i=2;i<=n;i++)r*=i;return r};
function ev(n,E){
  switch(n.k){
    case'n':return n.v;
    case'v':{const x=E[n.n];if(x===undefined)throw 0;return x}
    case'neg':return -ev(n.a,E);
    case'+':return ev(n.a,E)+ev(n.b,E);
    case'-':return ev(n.a,E)-ev(n.b,E);
    case'*':return ev(n.a,E)*ev(n.b,E);
    case'/':return ev(n.a,E)/ev(n.b,E);
    case'^':{const a=ev(n.a,E),b=ev(n.b,E);return a<0&&!Number.isInteger(b)?(Math.abs(b-1/3)<1e-12?-Math.cbrt(-a):NaN):Math.pow(a,b)}
    case'!':return FACT(ev(n.a,E));
    case'f':{const a=ev(n.a,E);
      return({sec:x=>1/Math.cos(x),csc:x=>1/Math.sin(x),cot:x=>1/Math.tan(x),sqrt:Math.sqrt,cbrt:Math.cbrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,ln:Math.log,log:Math.log10,exp:Math.exp,abs:Math.abs,asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh})[n.n](a)}
  }
}
const num=(n)=>{try{return ev(n,{})}catch(e){return NaN}};
/* ---------- impresión ---------- */
function pr(n,p=0){
  switch(n.k){
    case'n':{if(n.s)return n.s;const v=n.v;const s=Number.isInteger(v)?String(v):fmtN(v);return v<0&&p>=2?'('+s+')':s}
    case'v':return n.n;
    case'neg':{const s='-'+pr(n.a,2);return p>=2?'('+s+')':s}
    case'+':{const b=n.b;const s=pr(n.a,1)+(b.k==='neg'?' - '+pr(b.a,2):isN(b)&&b.v<0?' - '+fmtN(-b.v):' + '+pr(b,1));return p>1?'('+s+')':s}
    case'-':{const s=pr(n.a,1)+' - '+pr(n.b,2);return p>1?'('+s+')':s}
    case'*':{
      const a=n.a,b=n.b;
      const ng=x=>x.k==='^'&&isN(x.b)&&x.b.v<0&&Number.isInteger(x.b.v);
      if(ng(b)&&!ng(a)){const den=b.b.v===-1?b.a:pow(b.a,N(-b.b.v)),top=isN(a)&&a.v===1?'1':isN(a)&&a.v===-1?'-1':pr(a,2),s2=top+'/'+pr(den,3);return p>2?'('+s2+')':s2}
      if(isN(a)){
        if(a.v===-1){const s='-'+pr(b,2);return p>=2?'('+s+')':s}
        if(!Number.isInteger(a.v)){const r=ratio(Math.abs(a.v));
          if(r&&r[1]>1){const body=pr(b,2),sg=a.v<0?'-':'';const s=sg+(r[0]===1?'':r[0]+(/^[0-9]/.test(body)?'·':''))+body+'/'+r[1];return p>2?'('+s+')':s}}
        const body=pr(b,2);const s=pr(a,2)+(/^[0-9(]/.test(body)&&!/^\(/.test(body)?'·':'')+body;return p>2?'('+s+')':s;
      }
      const s=pr(a,2)+'·'+pr(b,2);return p>2?'('+s+')':s;
    }
    case'/':{const na=isN(n.a)&&n.a.v<0?'-'+fmtN(-n.a.v):pr(n.a,2);const s=na+'/'+pr(n.b,3);return p>2?'('+s+')':s}
    case'^':{const e=n.b;
      if(isN(e)&&e.v<0&&Number.isInteger(e.v))return '1/'+pr(e.v===-1?n.a:pow(n.a,N(-e.v)),3);
      if(isN(e)&&e.v===0.5)return '√('+pr(n.a,0)+')';
      if(isN(e)&&!Number.isInteger(e.v)){const rr=ratio(e.v);if(rr&&rr[1]<=12)return pr(n.a,4)+'^('+rr[0]+'/'+rr[1]+')'}
      const es=(e.k==='n'&&e.v>=0&&!e.s)||e.k==='v'?pr(e,0):'('+pr(e,0)+')';return pr(n.a,4)+'^'+es}
    case'!':return pr(n.a,4)+'!';
    case'f':{
      const a=n.a;
      if(n.n==='exp'){const s=(a.k==='v'||(isN(a)&&a.v>=0))?pr(a):'('+pr(a)+')';return 'e^'+s}
      if(n.n==='sqrt')return '√('+pr(a)+')';
      if(n.n==='cbrt')return '∛('+pr(a)+')';
      const nm={sin:'sen',asin:'arcsen',acos:'arccos',atan:'arctan'}[n.n]||n.n;
      return nm+'('+pr(a)+')';
    }
  }
}
/* ---------- derivada ---------- */
function D(n,v){
  if(!has(n,v))return N(0);
  switch(n.k){
    case'v':return N(1);
    case'neg':return neg(D(n.a,v));
    case'+':return add(D(n.a,v),D(n.b,v));
    case'-':return sub(D(n.a,v),D(n.b,v));
    case'*':return add(mul(D(n.a,v),n.b),mul(n.a,D(n.b,v)));
    case'/':return div(sub(mul(D(n.a,v),n.b),mul(n.a,D(n.b,v))),pow(n.b,N(2)));
    case'^':{
      const a=n.a,b=n.b;
      if(!has(b,v))return mul(mul(b,pow(a,isN(b)?N(b.v-1):sub(b,N(1)))),D(a,v));
      if(!has(a,v))return a.k==='n'&&a.s==='e'?mul(n,D(b,v)):mul(mul(n,fn('ln',a)),D(b,v));
      return mul(n,add(mul(D(b,v),fn('ln',a)),div(mul(b,D(a,v)),a)));
    }
    case'f':{
      const u=n.a,du=D(u,v);let r;
      switch(n.n){
        case'sin':r=fn('cos',u);break;
        case'cos':r=neg(fn('sin',u));break;
        case'tan':r=div(N(1),pow(fn('cos',u),N(2)));break;
        case'ln':r=div(N(1),u);break;
        case'log':r=div(N(1),mul(u,N(Math.LN10)));break;
        case'exp':r=n;break;
        case'sqrt':r=div(N(1),mul(N(2),n));break;
        case'cbrt':r=div(N(1),mul(N(3),pow(n,N(2))));break;
        case'abs':r=div(u,n);break;
        case'asin':r=div(N(1),fn('sqrt',sub(N(1),pow(u,N(2)))));break;
        case'acos':r=neg(div(N(1),fn('sqrt',sub(N(1),pow(u,N(2))))));break;
        case'atan':r=div(N(1),add(N(1),pow(u,N(2))));break;
        case'sinh':r=fn('cosh',u);break;
        case'cosh':r=fn('sinh',u);break;
        case'tanh':r=sub(N(1),pow(n,N(2)));break;
        case'sec':r=mul(n,fn('tan',u));break;
        case'csc':r=neg(mul(n,fn('cot',u)));break;
        case'cot':r=neg(pow(fn('csc',u),N(2)));break;
        default:throw 0;
      }
      return mul(r,du);
    }
  }
  throw 0;
}
/* ---------- integración ---------- */
const SAMP=[0.37,0.91,1.43,2.17,0.63];
const vals=(n,v,pts=SAMP)=>pts.map(x=>{try{return ev(n,{[v]:x})}catch(e){return NaN}});
const close=(a,b)=>Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));
function lin(u,v){
  if(!has(u,v))return null;
  const f=x=>{try{return ev(u,{[v]:x})}catch(e){return NaN}};
  const b=f(0),a=f(1)-b;if(!isFinite(a)||!isFinite(b)||Math.abs(a)<1e-12)return null;
  return[1.7,-2.3,0.45].every(x=>close(f(x),a*x+b))?{a,b}:null;
}
function quad(u,v){
  const f=x=>{try{return ev(u,{[v]:x})}catch(e){return NaN}};
  const C=f(0),A=(f(1)+f(-1))/2-C,B=(f(1)-f(-1))/2;
  if(![A,B,C].every(isFinite)||Math.abs(A)<1e-12)return null;
  return[2.1,-1.7,0.3].every(x=>close(f(x),A*x*x+B*x+C))?{A,B,C}:null;
}
const factors=(n,o=[])=>{
  if(n.k==='*'){factors(n.a,o);factors(n.b,o)}
  else if(n.k==='/'){factors(n.a,o);o.push(pow(n.b,N(-1)))}
  else if(n.k==='neg'){o.push(N(-1));factors(n.a,o)}
  else o.push(n);
  return o;
};
const prod=fs=>fs.reduce((a,b)=>a?mul(a,b):b,null)||N(1);
function expand(n){
  switch(n.k){
    case'+':return add(expand(n.a),expand(n.b));
    case'-':return sub(expand(n.a),expand(n.b));
    case'neg':return neg(expand(n.a));
    case'*':{const a=expand(n.a),b=expand(n.b);
      if(a.k==='+'||a.k==='-'){return a.k==='+'?add(expand(mul(a.a,b)),expand(mul(a.b,b))):sub(expand(mul(a.a,b)),expand(mul(a.b,b)))}
      if(b.k==='+'||b.k==='-'){return b.k==='+'?add(expand(mul(a,b.a)),expand(mul(a,b.b))):sub(expand(mul(a,b.a)),expand(mul(a,b.b)))}
      return mul(a,b)}
    case'^':if(isN(n.b)&&Number.isInteger(n.b.v)&&n.b.v>=2&&n.b.v<=6&&(n.a.k==='+'||n.a.k==='-')){let r=n.a;for(let i=1;i<n.b.v;i++)r=expand(mul(r,n.a));return r}return n;
    default:return n;
  }
}
const hasSum=n=>n.k==='+'||n.k==='-'?true:n.a&&hasSum(n.a)||n.b&&hasSum(n.b)||false;
const absln=u=>fn('ln',fn('abs',u));
const dummy='τ';
function subs(n,target,rep){
  if(JSON.stringify(n)===JSON.stringify(target))return rep;
  if(n.k==='n'||n.k==='v')return n;
  if(n.k==='f'||n.k==='neg'||n.k==='!')return{...n,a:subs(n.a,target,rep)};
  return{...n,a:subs(n.a,target,rep),b:subs(n.b,target,rep)};
}
function inners(n){
  const o=[];
  const w=m=>{if(m.k==='f'){o.push(m.a);w(m.a)}else if(m.k==='^'){if(m.b&&!(isN(m.b))){o.push(m.b);o.push(m.a)}else o.push(m.a);w(m.a);w(m.b)}else if(m.a){w(m.a);if(m.b)w(m.b)}};
  w(n);return o;
}
function integ(n,v,depth=0){
  if(depth>12)return null;
  if(!has(n,v))return mul(n,V(v));
  const I=(m)=>integ(m,v,depth+1);
  switch(n.k){
    case'v':return div(pow(n,N(2)),N(2));
    case'neg':{const r=I(n.a);return r&&neg(r)}
    case'+':{const a=I(n.a),b=I(n.b);return a&&b&&add(a,b)}
    case'-':{const a=I(n.a),b=I(n.b);return a&&b&&sub(a,b)}
    case'f':{
      const u=n.a,L=lin(u,v);
      if(L){
        const k=1/L.a;let G;
        switch(n.n){
          case'sin':G=neg(fn('cos',u));break;
          case'cos':G=fn('sin',u);break;
          case'tan':G=neg(absln(fn('cos',u)));break;
          case'exp':G=n;break;
          case'ln':G=sub(mul(u,n),u);break;
          case'log':G=div(sub(mul(u,fn('ln',u)),u),N(Math.LN10));break;
          case'sqrt':G=mul(N(2/3),pow(u,N(1.5)));break;
          case'sinh':G=fn('cosh',u);break;
          case'cosh':G=fn('sinh',u);break;
          case'atan':G=sub(mul(u,n),mul(N(.5),fn('ln',add(N(1),pow(u,N(2))))));break;
          case'asin':G=add(mul(u,n),fn('sqrt',sub(N(1),pow(u,N(2)))));break;
          case'acos':G=sub(mul(u,n),fn('sqrt',sub(N(1),pow(u,N(2)))));break;
        }
        if(G)return mul(N(k),G);
      }
      return trySub([n],v,depth);
    }
    case'^':{
      const a=n.a,b=n.b;
      if(!has(b,v)){
        const e=num(b);
        if(isFinite(e)){
          const L=lin(a,v);
          if(L){const k=1/L.a;return Math.abs(e+1)<1e-12?mul(N(k),absln(a)):mul(N(k/(e+1)),pow(a,N(e+1)))}
          if(a.k==='f'&&(a.n==='sin'||a.n==='cos')&&e===2){
            const L2=lin(a.a,v);if(L2){const u2=mul(N(2),a.a),s=fn('sin',u2),k=1/L2.a;
              return a.n==='sin'?mul(N(k),sub(div(a.a,N(2)),div(s,N(4)))):mul(N(k),add(div(a.a,N(2)),div(s,N(4))))}}
          if(a.k==='f'&&a.n==='sec'&&e===2){const L2=lin(a.a,v);if(L2)return mul(N(1/L2.a),fn('tan',a.a))}
          if(a.k==='f'&&a.n==='csc'&&e===2){const L2=lin(a.a,v);if(L2)return neg(mul(N(1/L2.a),fn('cot',a.a)))}
          if(a.k==='f'&&a.n==='tan'&&e===2){const L2=lin(a.a,v);if(L2)return mul(N(1/L2.a),sub(a,a.a))}
          const q=quad(a,v);
          if(q&&(e===-1||e===-0.5))return quadInt(a,q,e,v);
          if((a.k==='+'||a.k==='-')&&Number.isInteger(e)&&e>=2&&e<=6)return I(expand(n));
        }
        return trySub([n],v,depth);
      }
      if(!has(a,v)){
        const L=lin(b,v);
        if(L){const an=num(a);if(an===Math.E||(a.k==='n'&&a.s==='e'))return mul(N(1/L.a),n);if(isFinite(an)&&an>0)return div(n,mul(N(Math.log(an)*L.a),N(1)))}
      }
      return trySub([n],v,depth);
    }
    case'*':case'/':return prodInt(n,v,depth);
  }
  return null;
}
function quadInt(u,q,e,v){
  const{A,B,C}=q,Dd=B*B-4*A*C,x=V(v);
  if(e===-1){
    if(Math.abs(Dd)<1e-12)return div(N(-2),add(mul(N(2*A),x),N(B)));
    if(Dd<0){const s=Math.sqrt(-Dd);return mul(N(2/s),fn('atan',div(add(mul(N(2*A),x),N(B)),N(s))))}
    const s=Math.sqrt(Dd);return mul(N(1/s),absln(div(sub(add(mul(N(2*A),x),N(B)),N(s)),add(add(mul(N(2*A),x),N(B)),N(s)))));
  }
  if(Math.abs(B)<1e-12&&A<0&&C>0)return mul(N(1/Math.sqrt(-A)),fn('asin',mul(x,N(Math.sqrt(-A/C)))));
  if(Math.abs(B)<1e-12&&A>0)return mul(N(1/Math.sqrt(A)),fn('ln',add(mul(x,N(Math.sqrt(A))),fn('sqrt',u))));
  return null;
}
function prodInt(n,v,depth){
  const fs=factors(n),I=m=>integ(m,v,depth+1);
  const cs=fs.filter(f=>!has(f,v)),ds=fs.filter(f=>has(f,v));
  if(cs.length){const r=I(prod(ds));return r&&mul(prod(cs),r)}
  if(hasSum(n)&&!(ds.length===2&&ds.some(f=>f.k==='^'&&isN(f.b)&&f.b.v<0))){
    const ex=expand(n);if(JSON.stringify(ex)!==JSON.stringify(n)&&(ex.k==='+'||ex.k==='-'))return I(ex);
  }
  /* racional con denominador cuadrático */
  const di=ds.findIndex(f=>f.k==='^'&&isN(f.b)&&(f.b.v===-1||f.b.v===-0.5)&&quad(f.a,v));
  if(di>=0){
    const den=ds[di],q=quad(den.a,v),rest=prod(ds.filter((_,i)=>i!==di));
    if(!has(rest,v))return mul(rest,quadInt(den.a,q,den.b.v,v));
    if(den.b.v===-1){
      const L=lin(rest,v);
      if(L){const p=L.a,qq=L.b,{A,B}=q;
        const t1=mul(N(p/(2*A)),absln(den.a)),c2=qq-p*B/(2*A);
        const t2=Math.abs(c2)<1e-12?N(0):mul(N(c2),quadInt(den.a,q,-1,v));return add(t1,t2)}
      /* numerador = k*u' */
    }
  }
  /* x^n * g */
  const pi=ds.findIndex(f=>(isV(f,v))||(f.k==='^'&&isV(f.a,v)&&isN(f.b)&&Number.isInteger(f.b.v)&&f.b.v>=1&&f.b.v<=6));
  if(pi>=0&&ds.length===2){
    const px=ds[pi],g=ds[1-pi],m=isV(px,v)?1:px.b.v,L=g.k==='f'?lin(g.a,v):g.k==='^'?(has(g.b,v)&&!has(g.a,v)?lin(g.b,v):null):null;
    if(g.k==='f'&&g.n==='ln'&&isV(g.a,v)){const p=m+1;return sub(mul(div(pow(V(v),N(p)),N(p)),g),div(pow(V(v),N(p)),N(p*p)))}
    if(L&&((g.k==='f'&&['sin','cos','exp'].includes(g.n))||g.k==='^')){
      const G=I(g);if(G){const rest=I(mul(m===1?N(1):pow(V(v),N(m-1)),G));if(rest)return sub(mul(pow(V(v),N(m)),G),mul(N(m),rest))}
    }
  }
  /* sen*cos, exp*trig */
  if(ds.length===2){
    const[a,b]=ds;
    const trig=(a.k==='f'&&b.k==='f'&&((a.n==='sin'&&b.n==='cos')||(a.n==='cos'&&b.n==='sin')))&&JSON.stringify(a.a)===JSON.stringify(b.a)?lin(a.a,v):null;
    if(trig)return div(pow(fn('sin',a.a),N(2)),N(2*trig.a));
    const e=[a,b].find(f=>f.k==='^'&&!has(f.a,v)&&num(f.a)===Math.E)||[a,b].find(f=>f.k==='f'&&f.n==='exp'),t=[a,b].find(f=>f.k==='f'&&(f.n==='sin'||f.n==='cos'));
    if(e&&t){
      const ke=e.k==='f'?lin(e.a,v):lin(e.b,v),kt=lin(t.a,v);
      if(ke&&kt&&Math.abs(ke.b)<1e-12&&Math.abs(kt.b)<1e-12){
        const p=ke.a,q=kt.a,d=p*p+q*q,s=fn('sin',t.a),c=fn('cos',t.a);
        const body=t.n==='sin'?sub(mul(N(p),s),mul(N(q),c)):add(mul(N(p),c),mul(N(q),s));
        return mul(N(1/d),mul(e,body));
      }
    }
  }
  return trySub(fs,v,depth);
}
function trySub(fs,v,depth){
  const whole=prod(fs),cands=[],seen=new Set();
  inners(whole).concat(factors(whole).filter(f=>has(f,v)&&!isV(f,v))).forEach(u=>{const k=JSON.stringify(u);if(!seen.has(k)&&has(u,v)&&!isV(u,v)){seen.add(k);cands.push(u)}});
  for(const u of cands){
    let du;try{du=D(u,v)}catch(e){continue}
    const ws=factors(whole),ds=factors(du);
    let kw=1,kd=1;const wr=[],dr=[];
    ws.forEach(f=>{if(isN(f))kw*=f.v;else wr.push(f)});ds.forEach(f=>{if(isN(f))kd*=f.v;else dr.push(f)});
    let ok=true;const rest=[...wr];
    for(const f of dr){
      let i=rest.findIndex(x=>eq(x,f));
      if(i>=0){rest.splice(i,1);continue}
      const bf=f.k==='^'&&isN(f.b)?{b:f.a,e:f.b.v}:isV(f,v)?{b:f,e:1}:null;
      i=bf?rest.findIndex(x=>{const q=x.k==='^'&&isN(x.b)?{b:x.a,e:x.b.v}:isV(x,v)?{b:x,e:1}:null;return q&&eq(q.b,bf.b)}):-1;
      if(i<0){ok=false;break}
      const q=rest[i].k==='^'&&isN(rest[i].b)?rest[i].b.v:1,ne=q-bf.e;rest.splice(i,1);if(ne!==0)rest.push(ne===1?bf.b:pow(bf.b,N(ne)));
    }
    if(!ok||!isFinite(kw/kd)||kd===0)continue;
    const T=V(dummy),g=subs(prod(rest),u,T);
    if(has(g,v))continue;
    let G;try{G=integ(g,dummy,depth+1)}catch(e){G=null}
    if(G)return mul(N(kw/kd),subs(G,T,u));
  }
  return null;
}
function normT(n){
  switch(n.k){
    case'n':case'v':return n;
    case'neg':return neg(normT(n.a));
    case'f':{const a=normT(n.a);return n.n==='sqrt'&&has(a,'x')||n.n==='sqrt'&&vars(a).size?pow(a,N(.5)):fn(n.n,a)}
    case'/':{const a=normT(n.a),b=normT(n.b);if(!vars(b).size)return div(a,b);const inv=prod(factors(b).map(f=>f.k==='^'&&isN(f.b)?pow(f.a,N(-f.b.v)):pow(f,N(-1))));return mul(a,inv)}
    case'^':{const a=normT(n.a),b=normT(n.b);if(a.k==='^'&&isN(a.b)&&isN(b))return pow(a.a,N(a.b.v*b.v));return pow(a,b)}
    case'!':return n;
    default:return{...n,a:normT(n.a),b:normT(n.b)};
  }
}
/* ---------- numéricos ---------- */
function simpson(f,a,b,n=4000){
  const h=(b-a)/n;let s=f(a)+f(b);
  for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);
  return s*h/3;
}
function limit(f,a){
  const side=d=>{const o=[];for(const h of[1e-4,1e-6,1e-8]){try{o.push(f(a+d*h))}catch(e){o.push(NaN)}}return o};
  if(a===Infinity||a===-Infinity){const o=[1e4,1e6,1e8].map(h=>{try{return f(a>0?h:-h)}catch(e){return NaN}});return fin(o)}
  const l=fin(side(-1)),r=fin(side(1));
  if(l===null||r===null)return null;
  if(Math.abs(l)===Infinity||Math.abs(r)===Infinity){
    if(l===r)return l;return'lat';
  }
  if(!close(l,r)&&Math.abs(l-r)>1e-5)return'lat';
  return(l+r)/2;
}
function fin(o){
  const g=o.filter(isFinite);
  if(g.length<2)return o.every(x=>x>1e6)?Infinity:o.every(x=>x<-1e6)?-Infinity:null;
  if(Math.abs(g[g.length-1])>1e5&&Math.abs(g[g.length-1])>Math.abs(g[0])*5)return g[g.length-1]>0?Infinity:-Infinity;
  const x=g[g.length-1];return Math.abs(x-Math.round(x))<1e-4?Math.round(x):x;
}
/* ---------- polinomios y ecuaciones ---------- */
function polyFit(f,maxDeg=6){
  const xs=[0,1,2,3,4,5,6,7,8].slice(0,maxDeg+3),ys=xs.map(f);
  if(!ys.every(isFinite))return null;
  for(let d=0;d<=maxDeg;d++){
    /* ajuste por Lagrange con d+1 puntos, verificar el resto */
    const c=lagrange(xs.slice(0,d+1),ys.slice(0,d+1));
    const ok=xs.every((x,i)=>close(c.reduce((s,ck,k)=>s+ck*Math.pow(x,k),0),ys[i]))&&[-1.3,0.4,11].every(x=>close(c.reduce((s,ck,k)=>s+ck*Math.pow(x,k),0),f(x)));
    if(ok)return c.map(x=>Math.abs(x)<1e-9?0:Math.round(x*1e9)/1e9);
  }
  return null;
}
function lagrange(xs,ys){
  const n=xs.length;let coef=new Array(n).fill(0);
  for(let i=0;i<n;i++){
    let p=[1],den=1;
    for(let j=0;j<n;j++)if(j!==i){p=mulPoly(p,[-xs[j],1]);den*=xs[i]-xs[j]}
    p.forEach((c,k)=>coef[k]+=ys[i]*c/den);
  }
  return coef;
}
const mulPoly=(a,b)=>{const r=new Array(a.length+b.length-1).fill(0);a.forEach((x,i)=>b.forEach((y,j)=>r[i+j]+=x*y));return r};
function roots(c){const R=roots0(c);return R.sort((p,q)=>p.re-q.re||p.im-q.im)}
function roots0(c){
  while(c.length>1&&Math.abs(c[c.length-1])<1e-12)c.pop();
  const d=c.length-1;if(d<1)return[];
  if(d===1)return[{re:-c[0]/c[1],im:0}];
  if(d===2){
    const[C,B,A]=c,Dd=B*B-4*A*C;
    if(Dd>=0){const s=Math.sqrt(Dd);return[{re:(-B+s)/(2*A),im:0},{re:(-B-s)/(2*A),im:0}]}
    const s=Math.sqrt(-Dd);return[{re:-B/(2*A),im:s/(2*A)},{re:-B/(2*A),im:-s/(2*A)}];
  }
  /* Durand-Kerner */
  const a=c.map(x=>x/c[d]);let z=[];for(let i=0;i<d;i++)z.push({re:Math.cos(2*PI*i/d+.4)*1.2,im:Math.sin(2*PI*i/d+.4)*1.2});
  const cm=(p,q)=>({re:p.re*q.re-p.im*q.im,im:p.re*q.im+p.im*q.re}),cd=(p,q)=>{const m=q.re*q.re+q.im*q.im;return{re:(p.re*q.re+p.im*q.im)/m,im:(p.im*q.re-p.re*q.im)/m}};
  for(let it=0;it<500;it++){
    let mx=0;
    for(let i=0;i<d;i++){
      let pv={re:1,im:0};for(let k=d-1;k>=0;k--)pv={re:cm(pv,z[i]).re+a[k],im:cm(pv,z[i]).im};
      let den={re:1,im:0};for(let j=0;j<d;j++)if(j!==i)den=cm(den,{re:z[i].re-z[j].re,im:z[i].im-z[j].im});
      const dl=cd(pv,den);z[i]={re:z[i].re-dl.re,im:z[i].im-dl.im};mx=Math.max(mx,Math.hypot(dl.re,dl.im));
    }
    if(mx<1e-13)break;
  }
  return z.map(r=>({re:Math.abs(r.re)<1e-9?0:r.re,im:Math.abs(r.im)<1e-9?0:r.im}));
}
const rootStr=r=>{
  if(!r.im)return fmtN(Math.round(r.re*1e9)/1e9);
  const im=Math.abs(r.im),is=(Math.abs(im-1)<1e-9?'':fmtN(im))+'i';
  if(!r.re)return(r.im<0?'−':'')+is;
  return`${fmtN(r.re)} ${r.im>0?'+':'−'} ${is}`;
};
function rad(n){
  /* √n simplificado */
  if(!Number.isInteger(n)||n<0)return null;
  let out=1,rest=n;for(let f=2;f*f<=rest;f++)while(rest%(f*f)===0){rest/=f*f;out*=f}
  if(rest===1)return String(out);
  return(out>1?out:'')+'√'+rest;
}
function gauss(M){
  const n=M.length;
  for(let i=0;i<n;i++){
    let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;
    if(Math.abs(M[p][i])<1e-12)return null;
    [M[i],M[p]]=[M[p],M[i]];
    for(let r=0;r<n;r++)if(r!==i){const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}
  }
  return M.map((r,i)=>r[n]/r[i]);
}
/* ---------- teoría de números ---------- */
const isPrime=n=>{if(n<2||!Number.isInteger(n))return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
function factorize(n){const o=[];for(let f=2;f*f<=n;f++)while(n%f===0){o.push(f);n/=f}if(n>1)o.push(n);return o}
const expStr=a=>{const m={};a.forEach(x=>m[x]=(m[x]||0)+1);return Object.keys(m).map(k=>m[k]>1?k+'^'+m[k]:k).join(' × ')};
/* ---------- preprocesado de lenguaje natural ---------- */
const NUMW='(-?\\d+(?:[.,]\\d+)?|\\([^)]*\\)|[a-z])';
function nat(t){
  let s=' '+t.replace(/\?|¿|¡/g,' ').replace(/([^\d)])!+\s*$/,'$1').replace(/\s+/g,' ')+' ';
  s=s.replace(/\bpi\b/g,'pi').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/×/g,'*').replace(/÷/g,'/').replace(/\*\*/g,'^').replace(/−/g,'-');
  s=s.replace(/(\d)\s*°/g,'$1 grados');
  s=s.replace(/\bra[a-z]?z\b(?= cuadrad| de| \d)/g,'raiz');
  s=s.replace(/raiz cuadrad[ao] (?:de |del )?(?:la |el )?/g,'sqrt ').replace(/\braiz (?:de |del )(?=[\d(a-z])/g,'sqrt ').replace(/raiz cubica (?:de |del )?/g,'cbrt ');
  s=s.replace(/raiz (\d+)(?:-?esima|ava)? (?:de |del )?/g,'root$1 ');
  s=s.replace(/logaritmo natural (?:de |del )?/g,'ln ').replace(/logaritmo (?:neperiano |natural )?(?:de |del )?/g,'log ').replace(/logaritmo en base (\d+) (?:de |del )?/g,'logb$1 ');
  s=s.replace(/\blog (?:en )?base (\d+) (?:de |del )?/g,'logb$1 ');
  s=s.replace(/\bseno (?:de |del )?/g,'sin ').replace(/\bcoseno (?:de |del )?/g,'cos ').replace(/\btangente (?:de |del )?/g,'tan ');
  s=s.replace(/factorial (?:de |del )?(\d+)/g,'$1!');
  s=s.replace(/(\S+) al cuadrado/g,'($1)^2').replace(/(\S+) al cubo/g,'($1)^3');
  s=s.replace(/(\S+) (?:elevado|elevada) (?:a la |al |a )?(\S+)/g,'($1)^($2)').replace(/(\S+) a la (\S+)/g,(m,a,b)=>/^\d/.test(a)&&/^\d/.test(b)?`(${a})^(${b})`:m);
  s=s.replace(/ multiplicado (?:por|x) /g,' * ').replace(/ dividido (?:entre|por|para) /g,' / ').replace(/ \bentre\b /g,' / ').replace(/ \bpor\b /g,' * ').replace(/ \bmas\b /g,' + ').replace(/ \bmenos\b /g,' - ').replace(/(\d)\s+x\s+(\d)/g,'$1 * $2');
  return s.trim();
}
function clean(s){
  s=s.replace(/\b(cuanto|cual|que|como)\s+(es|da|seria|resulta|vale|son)\b/g,' ').replace(/\b(la|el|los|las|un|una)\b(?=\s+(?:sqrt|cbrt|root|ln|log|sin|cos|tan|\d|\())/g,' ').replace(/\b(calcula|calcular|calculame|resuelve|resolver|resuelvo|evalua|evaluar|dime|dame|el resultado de|resultado de|el valor de|valor de|la funcion|funcion|la expresion|expresion|sistema de ecuaciones|sistema|ecuaciones|ecuacion|por favor|porfa|ayudame a|me ayudas con|de la|de el)\b/g,' ');
  return s.replace(/\bf\s*\(\s*x\s*\)\s*=/g,' ').replace(/^\s*y\s*=/,' ').replace(/\s+/g,' ').trim();
}
function rootPre(s){
  s=s.replace(/root(\d+) ?(\([^)]*\)|-?\d+(?:\.\d+)?|[a-z])/g,'($2)^(1/$1)');
  s=s.replace(/logb(\d+) ?(\([^)]*\)|-?\d+(?:\.\d+)?|[a-z])/g,'(ln($2)/ln($1))');
  return s;
}
function degs(s){
  /* sin 30 grados -> sin(30*pi/180) */
  return s.replace(/(sin|cos|tan|sen)\s*\(?\s*(-?\d+(?:\.\d+)?)\s*\)?\s*grados?/g,(m,f,a)=>`${f}(${a}*pi/180)`);
}
/* ---------- formatos de salida ---------- */
const approx=(v)=>{
  const x=fmtN(v);
  return x;
};
function simp(n){
  const L=[];
  const walk=(m,sg)=>{
    if(m.k==='+'){walk(m.a,sg);walk(m.b,sg)}
    else if(m.k==='-'){walk(m.a,sg);walk(m.b,-sg)}
    else if(m.k==='neg')walk(m.a,-sg);
    else if(m.k==='*'&&isN(m.a))L.push([sg*m.a.v,m.b]);
    else if(isN(m)&&!m.s)L.push([sg*m.v,null]);
    else L.push([sg,m]);
  };
  walk(n,1);
  const M=[];
  L.forEach(([c,t])=>{const e=M.find(x=>(x[1]===null&&t===null)||(x[1]&&t&&eq(x[1],t)));if(e)e[0]+=c;else M.push([c,t])});
  let out=null;
  M.filter(x=>Math.abs(x[0])>1e-12).forEach(([c,t])=>{
    const term=t===null?N(Math.abs(c)):mul(N(Math.abs(c)),t);
    out=out===null?(c<0?neg(term):term):(c<0?sub(out,term):add(out,term));
  });
  return out||N(0);
}
function show(n){return pr(n,0)}
/* ---------- resolutor principal ---------- */
const TRIG=/\b(sin|cos|tan|sen|sqrt|ln|log|exp)\s*\(|\b(derivad|deriva|derivar|integra|integral|primitiva|antiderivada|limite|lim\b|resuelve|resolver|ecuacion|sistema|raices|soluciones|raiz|factorial|mcd|mcm|maximo comun|minimo comun|es primo|primos|factoriza|descompon|divisores|binario|hexadecimal|octal|promedio|media|mediana|moda|desviacion|determinante|simplifica|area|volumen|perimetro|hipotenusa|cuanto es|cuanto da|calcula|evalua|resultado|elevado|al cuadrado|al cubo|logaritmo|log\b|seno|coseno|tangente|combinaciones|permutaciones|fibonacci|suma de los|sumatoria|despeja)/;
function solve(text,t){
  try{return solve_(text,t)}catch(e){return null}
}
function solve_(text,t){
  const hasDigit=/\d/.test(t),hasEq=/=/.test(t)&&/[a-z]/.test(t);
  if(!TRIG.test(t)&&!hasEq&&!(hasDigit&&/\d\s*[\+\-\*\/\^]\s*[\d(a-z]/.test(t)&&t.length<60))return null;
  /* --- listas: estadística --- */
  let m;
  if(m=t.match(/\b(promedio|media|mediana|moda|desviacion(?: estandar)?|varianza|rango)\b.*?(?:de|:)\s*((?:-?\d+(?:[.,]\d+)?[\s,;y]*){2,})/)){
    const L=(m[2].match(/-?\d+(?:[.,]\d+)?/g)||[]).map(x=>parseFloat(x.replace(',','.')));
    if(L.length>=2){
      const n=L.length,mean=L.reduce((a,b)=>a+b)/n,srt=[...L].sort((a,b)=>a-b);
      const med=n%2?srt[(n-1)/2]:(srt[n/2-1]+srt[n/2])/2;
      const cnt={};L.forEach(x=>cnt[x]=(cnt[x]||0)+1);const mx=Math.max(...Object.values(cnt)),mo=Object.keys(cnt).filter(k=>cnt[k]===mx);
      const vp=L.reduce((s,x)=>s+(x-mean)**2,0)/n,vm=L.reduce((s,x)=>s+(x-mean)**2,0)/(n-1);
      const k=m[1];
      if(/prom|media$/.test(k)||k==='media')return`Media (promedio) = ${fmtN(mean)}  (suma ${fmtN(L.reduce((a,b)=>a+b))} ÷ ${n} datos).`;
      if(k==='mediana')return`Mediana = ${fmtN(med)}  (datos ordenados: ${srt.map(fmtN).join(', ')}).`;
      if(k==='moda')return mx===1?'No hay moda: ningún valor se repite.':`Moda = ${mo.map(x=>fmtN(+x)).join(', ')}  (aparece ${mx} veces).`;
      if(k==='rango')return`Rango = ${fmtN(srt[n-1]-srt[0])}  (máximo ${fmtN(srt[n-1])} − mínimo ${fmtN(srt[0])}).`;
      if(k==='varianza')return`Varianza poblacional = ${fmtN(vp)}; muestral = ${fmtN(vm)}.`;
      return`Desviación estándar poblacional = ${fmtN(Math.sqrt(vp))}; muestral = ${fmtN(Math.sqrt(vm))}  (media ${fmtN(mean)}).`;
    }
  }
  if(m=t.match(/\b(mcd|mcm|maximo comun divisor|minimo comun multiplo)\b.*?(?:de|:)\s*((?:\d+[\s,;y]*){2,})/)){
    const L=(m[2].match(/\d+/g)||[]).map(Number);
    if(L.length>=2){
      const g=L.reduce(gcd),l=L.reduce((a,b)=>a/gcd(a,b)*b);
      return/mcd|maximo/.test(m[1])?`MCD(${L.join(', ')}) = ${g}.`:`MCM(${L.join(', ')}) = ${l}.`;
    }
  }
  if(m=t.match(/(?:es primo|numero primo)\s*(?:el )?(\d+)|(?:el )?(\d+)\s*(?:es|sera) (?:un )?(?:numero )?primo/)){
    const n=+(m[1]||m[2]);if(n<1e12)return isPrime(n)?`Sí, ${n} es primo.`:n<2?`${n} no es primo.`:`No, ${n} no es primo: ${n} = ${expStr(factorize(n))}.`;
  }
  if(m=t.match(/(?:factoriza|descompon|descomposicion(?: en factores primos)?|factores primos)\w*\s*(?:de |del |:)?\s*(\d+)/)){
    const n=+m[1];if(n>=2&&n<1e13){const f=factorize(n);return f.length===1?`${n} es primo.`:`${n} = ${expStr(f)}.`}
  }
  if(m=t.match(/divisores (?:de |del )?(\d+)/)){
    const n=+m[1];if(n>=1&&n<1e7){const d=[];for(let i=1;i*i<=n;i++)if(n%i===0){d.push(i);if(i*i!==n)d.push(n/i)}d.sort((a,b)=>a-b);return`Divisores de ${n}: ${d.join(', ')}  (${d.length} en total).`}
  }
  if(m=t.match(/primos? (?:hasta|menores (?:que|a)|entre 1 y) (\d+)/)){
    const n=+m[1];if(n<=500){const o=[];for(let i=2;i<=n;i++)if(isPrime(i))o.push(i);return`Primos hasta ${n} (${o.length}): ${o.join(', ')}.`}
  }
  if(m=t.match(/fibonacci (?:de |del |numero |n ?= ?)?(\d+)|(\d+)\s*(?:o |º |er |avo )?(?:numero )?de fibonacci/)){
    const n=+(m[1]||m[2]);if(n<=90){let a=0,b=1;for(let i=0;i<n;i++)[a,b]=[b,a+b];return`Fibonacci(${n}) = ${a}  (serie: 0, 1, 1, 2, 3, 5, 8, 13…).`}
  }
  if(m=t.match(/(?:convierte|pasa|pasar|convertir|transforma)\s+(?:el )?(?:numero )?(\d+)\s+(?:de decimal )?a (binario|hexadecimal|octal)/)){
    const n=+m[1],b={binario:2,hexadecimal:16,octal:8}[m[2]];return`${n} en ${m[2]} es ${n.toString(b).toUpperCase()}.`;
  }
  if(m=t.match(/(?:convierte|pasa|pasar|convertir|transforma)?\s*(?:el )?(?:numero )?([01]+|[0-9a-f]+|[0-7]+)\s+(?:de |en )?(binario|hexadecimal|octal)\s+a decimal/)){
    const b={binario:2,hexadecimal:16,octal:8}[m[2]],n=parseInt(m[1],b);if(!isNaN(n))return`${m[1].toUpperCase()} en base ${b} es ${n} en decimal.`;
  }
  if(m=t.match(/(?:combinaciones|permutaciones|variaciones)\s+de\s+(\d+)\s+(?:elementos\s+)?(?:en|tomados de|de a|tomando)\s+(\d+)/)){
    const n=+m[1],r=+m[2];if(r<=n&&n<=170){const P=FACT(n)/FACT(n-r),C=Math.round(P/FACT(r));return/combinac/.test(t)?`C(${n},${r}) = ${n}!/(${r}!·${n-r}!) = ${fmtN(C)}.`:`P(${n},${r}) = ${n}!/${n-r}! = ${fmtN(P)}.`}
  }
  if(m=t.match(/suma de los (?:primeros )?(?:numeros|enteros|naturales)\s*(?:del |de |desde )?\s*(\d+)\s*(?:al|a|hasta el|hasta)\s*(\d+)/)){
    const a=+m[1],b=+m[2];if(b>=a){const s=(a+b)*(b-a+1)/2;return`La suma de ${a} a ${b} es ${fmtN(s)}  (fórmula n(a+b)/2 con n = ${b-a+1} términos).`}
  }
  if(m=t.match(/simplifica\w*\s*(?:la fraccion\s*)?(-?\d+)\s*\/\s*(\d+)/)){
    const a=+m[1],b=+m[2],g=gcd(a,b);if(b)return g===1?`${a}/${b} ya es irreducible.`:`${a}/${b} = ${a/g}/${b/g}  (dividiendo entre ${g}).`;
  }
  if(m=t.match(/determinante de\s*\[\s*\[([^\]]+)\]\s*,\s*\[([^\]]+)\]\s*(?:,\s*\[([^\]]+)\]\s*)?\]/)){
    const rows=[m[1],m[2],m[3]].filter(Boolean).map(r=>r.split(/[,;\s]+/).filter(Boolean).map(x=>parseFloat(x)));
    if(rows.length===2&&rows.every(r=>r.length===2)){const[[a,b],[c,d]]=rows;return`Determinante = ${fmtN(a*d-b*c)}  (ad − bc).`}
    if(rows.length===3&&rows.every(r=>r.length===3)){const[[a,b,c],[d,e,f],[g,h,i]]=rows;return`Determinante = ${fmtN(a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g))}  (regla de Sarrus/cofactores).`}
  }
  /* --- geometría rápida --- */
  const gnum='(\\d+(?:[.,]\\d+)?)',gv=x=>parseFloat(String(x).replace(',','.'));
  if(m=t.match(new RegExp('area (?:de un |del |de una )?circulo.*?radio (?:de |=)?\\s*'+gnum))){const r=gv(m[1]);return`Área = π·r² = π·${fmtN(r)}² ≈ ${fmtN(PI*r*r)}.`}
  if(m=t.match(new RegExp('(?:perimetro|circunferencia|longitud) (?:de un |del |de una )?(?:circulo|circunferencia).*?radio (?:de |=)?\\s*'+gnum))){const r=gv(m[1]);return`Circunferencia = 2·π·r = 2·π·${fmtN(r)} ≈ ${fmtN(2*PI*r)}.`}
  if(m=t.match(new RegExp('area (?:de un |del |de una )?triangulo.*?base (?:de |=)?\\s*'+gnum+'.*?altura (?:de |=)?\\s*'+gnum))){const b=gv(m[1]),h=gv(m[2]);return`Área = base·altura/2 = ${fmtN(b)}·${fmtN(h)}/2 = ${fmtN(b*h/2)}.`}
  if(m=t.match(new RegExp('area (?:de un |del |de una )?(?:rectangulo|cuadrado).*?'+gnum+'.*?(?:y|por|x|,)\\s*'+gnum))){const a=gv(m[1]),b=gv(m[2]);return`Área = ${fmtN(a)}·${fmtN(b)} = ${fmtN(a*b)}.`}
  if(m=t.match(new RegExp('area (?:de un |del )?cuadrado.*?lado (?:de |=)?\\s*'+gnum))){const a=gv(m[1]);return`Área = lado² = ${fmtN(a)}² = ${fmtN(a*a)}.`}
  if(m=t.match(new RegExp('volumen (?:de una |de la )?esfera.*?radio (?:de |=)?\\s*'+gnum))){const r=gv(m[1]);return`Volumen = 4/3·π·r³ = 4/3·π·${fmtN(r)}³ ≈ ${fmtN(4/3*PI*r**3)}.`}
  if(m=t.match(new RegExp('volumen (?:de un |del )?cubo.*?(?:lado|arista) (?:de |=)?\\s*'+gnum))){const a=gv(m[1]);return`Volumen = lado³ = ${fmtN(a)}³ = ${fmtN(a**3)}.`}
  if(m=t.match(new RegExp('volumen (?:de un |del )?cilindro.*?radio (?:de |=)?\\s*'+gnum+'.*?altura (?:de |=)?\\s*'+gnum))){const r=gv(m[1]),h=gv(m[2]);return`Volumen = π·r²·h ≈ ${fmtN(PI*r*r*h)}.`}
  if(m=t.match(new RegExp('hipotenusa.*?'+gnum+'.*?(?:y|,)\\s*'+gnum))){const a=gv(m[1]),b=gv(m[2]),c=Math.sqrt(a*a+b*b);return`Hipotenusa = √(${fmtN(a)}² + ${fmtN(b)}²) = √${fmtN(a*a+b*b)} ${Number.isInteger(c)?'=':'≈'} ${fmtN(c)}.`}
  if(m=t.match(new RegExp('cateto.*?hipotenusa (?:de |=)?\\s*'+gnum+'.*?cateto (?:de |=)?\\s*'+gnum))){const c=gv(m[1]),a=gv(m[2]);if(c>a)return`Otro cateto = √(${fmtN(c)}² − ${fmtN(a)}²) ≈ ${fmtN(Math.sqrt(c*c-a*a))}.`}
  /* --- cálculo --- */
  let s=degs(rootPre(clean(nat(t))));
  s=s.replace(/\bsen\b/g,'sin');
  /* derivada */
  if(m=s.match(/^(?:la |el )?(?:derivada|deriva|derivar|diferencia|diferenciar)\s*(?:parcial )?(?:de |del |:)?\s*(.+)$/)){
    let body=m[1],at=null,mm;
    if(mm=body.match(/\s+(?:en|cuando|para)\s+(?:x|t)\s*=\s*(-?[\d.]+|pi)\s*$/)){at=mm[1]==='pi'?PI:parseFloat(mm[1]);body=body.slice(0,mm.index)}
    body=body.replace(/\s*(?:respecto a|con respecto a)\s*[a-z]\s*$/,'').replace(/\bdx\b|\bd\/dx\b/g,'').trim();
    if(!body)return null;
    const f=parse(body),vs=[...vars(f)];if(vs.length>1)return null;const v=vs[0]||'x';
    if(!vs.length)return'La derivada de una constante es 0.';
    const d=simp(D(f,v));let out=`f(${v}) = ${show(f)}\nf′(${v}) = ${show(d)}`;
    if(at!==null){const val=ev(d,{[v]:at});out+=`\nEn ${v} = ${fmtN(at)}: f′ = ${fmtN(val)}`}
    return out;
  }
  /* integral */
  if(m=s.match(/^(?:la |el )?(?:integral|integra|integrar|primitiva|antiderivada|calcula la integral)\s*(definida|indefinida)?\s*(?:de |del |:)?\s*(.+)$/)||s.match(/^∫\s*(.+)$/)&&[null,null,s.replace(/^∫\s*/,'')]){
    let body=m[2]||m[1],lim=null,mm;
    if(mm=body.match(/\s+(?:de|desde|entre|from)\s+(-?[\w.]+(?:\s*[\/*^]\s*[\w.]+)?)\s+(?:a|hasta|y)\s+(-?[\w.]+(?:\s*[\/*^]\s*[\w.]+)?)\s*$/)){
      const cv=x=>x==='infinito'?Infinity:x==='-infinito'?-Infinity:ev(parse(x),{});
      lim=[cv(mm[1]),cv(mm[2]),mm[1].replace(/\bpi\b/g,'π'),mm[2].replace(/\bpi\b/g,'π')];body=body.slice(0,mm.index);
    }
    body=body.replace(/\s*d[xt]\s*$/,'').replace(/\*?\s*dx\b/g,'').replace(/\bcon respecto a x\b/,'').trim();
    if(!body)return null;
    const f=parse(body),vs=[...vars(f)];if(vs.length>1)return null;const v=vs[0]||'x';
    let G=null;try{G=integ(normT(f),v)}catch(e){}
    if(G){
      /* verificación numérica: G' = f */
      const chk=(()=>{try{const dG=D(G,v);return vals(dG,v).every((y,i)=>{const z=vals(f,v)[i];return isFinite(z)?close(y,z)||Math.abs(y-z)<1e-6:true})}catch(e){return false}})();
      if(!chk)G=null;
    }
    if(lim){
      const[a,b]=lim;let val=null,exact=false;
      if(G&&isFinite(a)&&isFinite(b)){const Fa=ev(G,{[v]:a}),Fb=ev(G,{[v]:b});if(isFinite(Fa)&&isFinite(Fb)){val=Fb-Fa;exact=true}}
      if(val===null&&isFinite(a)){
        const fF=x=>{try{return ev(f,{[v]:x})}catch(e){return NaN}};
        if(isFinite(b))val=simpson(fF,a,b);
        else{val=simpson(fF,a,a+200,40000)}
        if(!isFinite(val))return'Esa integral no converge o tiene un punto problemático en el intervalo.';
      }
      if(val===null)return null;
      let out=`∫ ${show(f)} d${v}  desde ${lim[2]} hasta ${lim[3]}`;
      if(G)out+=`\nPrimitiva: F(${v}) = ${show(simp(G))} + C`;
      out+=`\nResultado ${exact?'=':'≈'} ${fmtN(val)}`;
      return out;
    }
    if(!G)return'Esa integral se me escapa con métodos simples. Prueba con sustitución o por partes, o dime si es definida (con límites) y la calculo numéricamente.';
    return`∫ ${show(f)} d${v} = ${show(simp(G))} + C`;
  }
  /* límite */
  if(m=s.match(/^(?:el |calcula el )?(?:limite|lim)\s*(?:de |del |:)?\s*(.+?)\s*(?:cuando|si|para|con)?\s*([a-z])\s*(?:tiende a|->|→|tendiendo a|se acerca a)\s*(-?[\d.]+|pi|infinito|-infinito|\+infinito)\s*$/)){
    const f=parse(m[1].replace(/\s*(?:cuando|si|para)\s*$/,'')),v=m[2],a=m[3];
    const at=a==='infinito'||a==='+infinito'?Infinity:a==='-infinito'?-Infinity:a==='pi'?PI:parseFloat(a);
    const r=limit(x=>ev(f,{[v]:x}),at);
    if(r===null)return'No pude estimar ese límite numéricamente.';
    if(r==='lat')return`El límite no existe: por la izquierda y por la derecha de ${a} da valores distintos.`;
    return`lim ${v}→${a.replace('infinito','∞')} de ${show(f)} = ${isFinite(r)?fmtN(r):(r>0?'+∞':'−∞')}`;
  }
  if(!/=\s*(?:-?[\d.]+|pi)\s*$/.test(s)||!/\b(?:cuando|si|para|con|en)\b/.test(s)){}
  if(m=s.match(/^(.+?)\s+(?:cuando|si|para|con|en)\s+([a-z])\s*=\s*(-?[\d.]+|pi)\s*$/)){
    const f=parse(m[1].replace(/^[a-z]\s*=/,'')),v=m[2],a=m[3]==='pi'?PI:parseFloat(m[3]);
    if([...vars(f)].every(x=>x===v)){const val=ev(f,{[v]:a});return`Con ${v} = ${fmtN(a)}: ${show(f)} = ${fmtN(val)}`}
  }
  /* ecuaciones y sistemas */
  if(/=/.test(s)){
    const eqs=s.split(/\s*[,;]\s*|\s+y\s+(?=[^=]*=)/).filter(x=>/=/.test(x));
    const prs=eqs.map(e=>{const p=e.split('=');if(p.length!==2||!p[0].trim()||!p[1].trim())throw 0;return sub(parse(p[0].replace(/^(?:ecuacion|sistema)(?: de ecuaciones)?\s*:?/,'')),parse(p[1]))});
    const VS=[...new Set(prs.flatMap(p=>[...vars(p)]))].sort();
    if(!VS.length)return null;
    if(prs.length===1&&VS.length===1){
      const v=VS[0],f=x=>{try{return ev(prs[0],{[v]:x})}catch(e){return NaN}};
      const c=polyFit(f);
      if(c&&c.length>1){
        const d=c.length-1,rs=roots([...c]);
        let out=`Ecuación de grado ${d}: ${polyStr(c,v)} = 0\n`;
        if(d===2){
          const[C,B,A]=c,Dd=B*B-4*A*C;out+=`Discriminante = (${fmtN(B)})² − 4·(${fmtN(A)})·(${fmtN(C)}) = ${fmtN(Dd)}\n`;
          if(B!==0&&Dd>0&&Number.isInteger(Dd)&&rad(Dd)&&!Number.isInteger(Math.sqrt(Dd)))out+=`${v} = (${fmtN(-B)} ± ${rad(Dd)}) / ${fmtN(2*A)}\n`;
        }
        const real=rs.filter(r=>!r.im);
        const uniq=[];rs.forEach(r=>{if(!uniq.some(u=>Math.abs(u.re-r.re)<1e-6&&Math.abs(u.im-r.im)<1e-6))uniq.push(r)});
        out+=(uniq.length===1&&d>1?`Solución doble: ${v} = ${rootStr(uniq[0])}`:uniq.map((r,i)=>`${v}${uniq.length>1?(i+1>9?'':String.fromCharCode(8321+i)):''} = ${rootStr(r)}`).join('\n'));
        if(!real.length)out+='\n(No tiene soluciones reales; son complejas.)';
        return out;
      }
      if(c&&c.length===1)return Math.abs(c[0])<1e-9?'Se cumple para cualquier valor (infinitas soluciones).':'No tiene solución.';
      /* no polinómica: buscar raíces numéricamente */
      const rs=[];let prev=f(-50);
      for(let x=-49.95;x<=50;x+=0.05){const y=f(x);if(isFinite(prev)&&isFinite(y)&&prev*y<=0&&Math.abs(prev-y)<1e3){let a=x-0.05,b=x;for(let i=0;i<60;i++){const mid=(a+b)/2;if(f(a)*f(mid)<=0)b=mid;else a=mid}const r=(a+b)/2;if(Math.abs(f(r))<1e-6&&!rs.some(q=>Math.abs(q-r)<1e-4))rs.push(r)}prev=y}
      if(!rs.length)return'No encontré soluciones reales entre −50 y 50.';
      return`Soluciones aproximadas: ${rs.slice(0,8).map(r=>`${v} ≈ ${fmtN(Math.round(r*1e6)/1e6)}`).join(';  ')}`;
    }
    if(prs.length===VS.length&&VS.length>=2&&VS.length<=3){
      const n=VS.length,M=[];
      for(const p of prs){
        const f=o=>{const E={};VS.forEach((x,i)=>E[x]=o[i]||0);return ev(p,E)};
        const c0=f([]);const row=VS.map((_,i)=>{const o=Array(n).fill(0);o[i]=1;return f(o)-c0});
        const chk=Array(n).fill(0).map((_,i)=>i+2);if(!close(f(chk),c0+row.reduce((s,a,i)=>s+a*chk[i],0)))return null;
        M.push([...row,-c0]);
      }
      const sol=gauss(M);
      if(!sol)return'El sistema no tiene solución única (puede ser incompatible o tener infinitas).';
      return'Solución del sistema:\n'+VS.map((x,i)=>`${x} = ${fmtN(Math.round(sol[i]*1e9)/1e9)}`).join('\n');
    }
    return null;
  }
  /* evaluación numérica */
  if(/[a-z]/.test(s.replace(/\b(sqrt|cbrt|sin|cos|tan|ln|log|exp|abs|asin|acos|atan|pi|e|sinh|cosh|tanh)\b/g,'').replace(/\d\s*e\s*[+-]?\d/g,'0'))&&/\bx\b|\by\b/.test(s)===false){
    /* palabras sueltas no matemáticas */
    if(/[a-df-wz]{3,}/.test(s.replace(/\b(sqrt|cbrt|sin|cos|tan|ln|log|exp|abs|asin|acos|atan|pi|sinh|cosh|tanh)\b/g,'')))return null;
  }
  const f=parse(s);const vs=[...vars(f)];
  if(vs.length)return null;
  if(/^-?[\d.]+$/.test(s.trim()))return null;
  const val=ev(f,{});
  if(!isFinite(val)||isNaN(val))return'Eso no se puede calcular (división entre cero o fuera del dominio).';
  const disp=s.replace(/\*/g,'×').replace(/sqrt\s*/g,'√').replace(/cbrt\s*/g,'∛').replace(/\bpi\b/g,'π').replace(/\s+/g,' ');
  let out=`${disp.replace(/\((\d+(?:\.\d+)?)\)/g,'$1')} = ${fmtN(val)}`;
  if(f.k==='f'&&f.n==='sqrt'&&isN(f.a)&&Number.isInteger(f.a.v)){
    const r=rad(f.a.v);if(r&&!/^\d+$/.test(r))out=r==='√'+f.a.v?`√${f.a.v} ≈ ${fmtN(val)}`:`√${f.a.v} = ${r} ≈ ${fmtN(val)}`;
    else if(r)out=`√${f.a.v} = ${r}`;
  }else if(!Number.isInteger(val)&&!/\//.test(s)){const r=ratio(val);if(r&&r[1]<=1000&&r[1]>1&&Math.abs(val)<1e6)out+=`  (= ${r[0]}/${r[1]})`}
  return out;
}
function polyStr(c,v){
  const parts=[];
  for(let k=c.length-1;k>=0;k--){
    const a=c[k];if(!a)continue;
    const abs=Math.abs(a),t=k===0?fmtN(abs):(abs===1?'':fmtN(abs))+v+(k>1?'^'+k:'');
    parts.push((parts.length?(a<0?' - ':' + '):(a<0?'-':''))+t);
  }
  return parts.join('')||'0';
}
window.MATH={solve,parse,D,integ,ev,show,_t:{lin,quad,fmtN,vals,close}};
})();
