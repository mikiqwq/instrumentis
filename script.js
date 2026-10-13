
const state={cart:JSON.parse(localStorage.getItem('instrumentis-cart')||'[]')};
const $=s=>document.querySelector(s);
const grid=$('#productGrid'), filter=$('#filter'), search=$('#search');

products.forEach(p=>{const o=document.createElement('option');o.value=p.category;o.textContent=p.category;filter.appendChild(o)});

function money(n){return new Intl.NumberFormat('ro-RO').format(n)+' lei'}
function renderProducts(){
 const q=search.value.toLowerCase().trim(), f=filter.value;
 const list=products.filter(p=>(!f||p.category===f)&&(!q||`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q)));
 grid.innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-img"><img src="assets/${p.image}" alt="${p.name}"></div><div class="product-body"><span class="product-cat">${p.category}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><div><button class="add" data-id="${p.id}">+ Coș</button> <button class="add details" data-id="${p.id}">Detalii</button></div></div></div></article>`).join(''):'<p>Nu am găsit produse pentru căutarea ta.</p>';
}
function save(){localStorage.setItem('instrumentis-cart',JSON.stringify(state.cart))}
function add(id){const p=products.find(x=>x.id===id), item=state.cart.find(x=>x.id===id);item?item.qty++:state.cart.push({id,qty:1});save();renderCart();toast(`${p.name} a fost adăugat în coș.`)}
function renderCart(){
 $('#cartCount').textContent=state.cart.reduce((s,x)=>s+x.qty,0);
 $('#cartItems').innerHTML=state.cart.length?state.cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="assets/${p.image}" alt=""><div><b>${p.name}</b><small>${money(p.price)} / buc.</small><div class="qty"><button data-minus="${p.id}">−</button> ${x.qty} <button data-plus="${p.id}">+</button></div></div><b>${money(p.price*x.qty)}</b></div>`}).join(''):'<p style="color:#888">Coșul este gol.</p>';
 $('#cartTotal').textContent=money(state.cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function openCart(){$('#cart').classList.add('open');$('#overlay').classList.add('show')}
function closeCart(){$('#cart').classList.remove('open');$('#overlay').classList.remove('show')}
function details(id){const p=products.find(x=>x.id===id);$('#modalContent').innerHTML=`<div class="modal-content"><img src="assets/${p.image}" alt="${p.name}"><div><span class="product-cat">${p.category}</span><h2>${p.name}</h2><p>${p.desc}</p><div class="specs">${p.specs.map(s=>`<span>${s}</span>`).join('')}</div><h3 class="price">${money(p.price)}</h3><button class="btn gold" onclick="add(${p.id});$('#productModal').classList.remove('show')">Adaugă în coș</button></div></div>`;$('#productModal').classList.add('show')}
grid.addEventListener('click',e=>{const a=e.target.closest('.add');if(a){add(+a.dataset.id)}const d=e.target.closest('.details');if(d)details(+d.dataset.id)});
filter.addEventListener('change',renderProducts);search.addEventListener('input',renderProducts);
document.querySelectorAll('.cat-grid button').forEach(b=>b.addEventListener('click',()=>{filter.value=b.dataset.filter;renderProducts();document.querySelector('#catalog').scrollIntoView({behavior:'smooth'})}));
$('#cartOpen').onclick=openCart;$('#cartClose').onclick=closeCart;$('#overlay').onclick=closeCart;$('#modalClose').onclick=()=>$('#productModal').classList.remove('show');
$('#cartItems').addEventListener('click',e=>{let id=+(e.target.dataset.plus||e.target.dataset.minus);if(!id)return;const i=state.cart.find(x=>x.id===id);e.target.dataset.plus?i.qty++:i.qty--;if(i.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);save();renderCart()});
$('#checkout').onclick=()=>{if(!state.cart.length)return toast('Adaugă cel puțin un produs în coș.');alert('Comandă demonstrativă: în acest proiect educațional nu se efectuează plăți reale.');};
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();$('#formNote').textContent='Mesajul a fost înregistrat pentru demonstrație. Mulțumim!';e.target.reset()});
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('mobile');
renderProducts();renderCart();

/* =========================
   SCROLL REVEAL
   ========================= */

const revealElements = document.querySelectorAll(
    'section, .product, .feature-list article, .org-box, .map-card'
);

revealElements.forEach(element => {
    element.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});