/* Minimal CSV -> Chart.js helpers */
(function(){
  function parseCSV(text){
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h=>h.trim());
    return lines.slice(1).map(line=>{
      // naive CSV split; input files are simple (no commas in fields)
      const cols = line.split(',');
      const obj = {}; headers.forEach((h,i)=> obj[h]= (cols[i]||'').trim());
      return obj;
    });
  }
  async function loadCSV(url){
    const res = await fetch(url, {cache:'no-cache'});
    const txt = await res.text();
    return parseCSV(txt);
  }
  function toNumber(x){
    if(!x) return NaN;
    const s = x.replace(/\s/g,'');
    if(/e\+?\d+$/i.test(s) || /e\d+$/i.test(s)) return Number(s);
    if(/^[\d.]+$/.test(s)) return Number(s);
    if(/^-?\d+(?:\.\d+)?[eE]-?\d+$/.test(s)) return Number(s);
    if(s.includes('-')){ // range -> midpoint
      const [a,b]=s.split('-').map(Number);
      if(!isNaN(a) && !isNaN(b)) return (a+b)/2;
    }
    return Number(s);
  }

  async function chartCompute(){
    const rows = await loadCSV('/assets/data/demand_compute.csv');
    const data = rows.map(r=>({y: toNumber(r.training_flops_scientific), x: Number(r.year)})).sort((a,b)=>a.x-b.x);
    const ctx = document.getElementById('pbpCompute'); if(!ctx) return;
    new Chart(ctx, { type:'line', data:{ datasets:[{ label:'Training FLOPs', data, borderColor:'#1f77b4', tension:0.2 }] },
      options:{ scales:{ x:{ type:'linear', ticks:{ stepSize:1 } }, y:{ type:'logarithmic', ticks:{ callback:(v)=> v.toExponential? v.toExponential():v } } }, plugins:{ legend:{ display:false } } });
  }

  async function chartPower(){
    const rows = await loadCSV('/assets/data/data_centre_power_projection.csv');
    const g = rows.filter(r=>r.region==='Global' && r.metric==='consumption_twh').sort((a,b)=>Number(a.year)-Number(b.year));
    const labels = g.map(r=>r.year);
    const vals = g.map(r=>Number(r.twh));
    const ctx = document.getElementById('pbpPower'); if(!ctx) return;
    new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'TWh', data: vals, backgroundColor:'#10b981' }] }, options:{ plugins:{ legend:{ display:false } } } });
  }

  async function chartCoWoS(){
    const rows = await loadCSV('/assets/data/packaging_capacity.csv');
    const tsmc = rows.filter(r=>r.company==='TSMC' && r.technology==='CoWoS');
    const labels = tsmc.map(r=>r.period);
    const low = tsmc.map(r=>{ const v=(r.value||'').replace(/\s/g,''); return v.includes('-')? Number(v.split('-')[0]): Number(v); });
    const high = tsmc.map(r=>{ const v=(r.value||'').replace(/\s/g,''); return v.includes('-')? Number(v.split('-')[1]): Number(v); });
    const ctx = document.getElementById('pbpCoWoS'); if(!ctx) return;
    new Chart(ctx, { type:'bar', data:{ labels, datasets:[
      { label:'Low', data: low, backgroundColor:'#6b7280' },
      { label:'High', data: high, backgroundColor:'#374151' }
    ] }, options:{ scales:{ y:{ title:{ display:true, text:'wafers/month' } } } } });
  }

  async function chartPPAs(){
    const rows = await loadCSV('/assets/data/power_deals.csv');
    const buyers = {};
    rows.forEach(r=>{ const b=r.buyer; const mw=Number(r.capacity_mw||0); buyers[b]=(buyers[b]||0)+mw; });
    const labels = Object.keys(buyers);
    const vals = labels.map(k=>buyers[k]);
    const ctx = document.getElementById('pbpPPAs'); if(!ctx) return;
    new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'MW', data: vals, backgroundColor:'#f59e0b' }] }, options:{ plugins:{ legend:{ display:false } } } });
  }

  window.addEventListener('DOMContentLoaded', async ()=>{
    await Promise.all([chartCompute(), chartPower(), chartCoWoS(), chartPPAs()]);
  });
})();

