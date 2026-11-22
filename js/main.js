const menuButton = document.querySelector('.menu-toggle');
const menuLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const isOpen = menuLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuLinks.classList.remove('open');
    menuLinks.querySelectorAll('.nav-dropdown[open]').forEach(d => d.open = false);
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Close grouped navigation menus when another opens, when clicking away, or on Escape.
const navDropdowns = [...document.querySelectorAll('.nav-dropdown')];
navDropdowns.forEach(dropdown => dropdown.addEventListener('toggle', () => {
  if (dropdown.open) navDropdowns.forEach(other => { if (other !== dropdown) other.open = false; });
}));
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) navDropdowns.forEach(d => d.open = false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navDropdowns.forEach(d => d.open = false);
    menuLinks?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('year').textContent = String(new Date().getFullYear());

/* Embedded control architecture */
(()=>{

const details={
xbox:{tag:"OPERATOR INPUT",title:"Xbox controller",body:"The operator interface connects to the Raspberry Pi over Bluetooth. Python reads button and stick events using evdev.",items:["Controller input is mapped to robot commands.","The control stack can translate operator requests into motion targets.","This diagram represents the current manual-control pathway."]},
pi:{tag:"MAIN COMPUTER",title:"Raspberry Pi 4",body:"CARL's Python control stack runs on the Raspberry Pi 4 (8 GB) and coordinates the leg motors through the Pi3Hat.",items:["Modular Moteus interface and motor mapping.","Automated staged homing with stall-based endstop detection.","Analytical leg inverse kinematics; full 3D coordinated integration is in development."]},
hat:{tag:"COMMUNICATION",title:"mjbots Pi3Hat",body:"The Pi3Hat bridges the Raspberry Pi to four CAN-FD buses and also provides an IMU.",items:["One CAN-FD bus per leg.","Motor communication through Moteus controllers.","IMU is available in hardware; no autonomous balance capability is claimed here."]},
b1:{tag:"CAN-FD BUS 1",title:"Front right leg",body:"Three Moteus motor controllers share CAN-FD bus 1.",items:["Abduction/adduction — motor ID 3","Hip — motor ID 2","Knee — motor ID 1"]},
b2:{tag:"CAN-FD BUS 2",title:"Back right leg",body:"Three Moteus motor controllers share CAN-FD bus 2.",items:["Abduction/adduction — motor ID 6","Hip — motor ID 5","Knee — motor ID 4"]},
b3:{tag:"CAN-FD BUS 3",title:"Front left leg",body:"Three Moteus motor controllers share CAN-FD bus 3.",items:["Abduction/adduction — motor ID 9","Hip — motor ID 7","Knee — motor ID 8"]},
b4:{tag:"CAN-FD BUS 4",title:"Back left leg",body:"Three Moteus motor controllers share CAN-FD bus 4.",items:["Abduction/adduction — motor ID 12","Hip — motor ID 10","Knee — motor ID 11"]},
motors:{tag:"ACTUATION",title:"Moteus + BLDC motors",body:"Each of CARL's four legs has three actuated degrees of freedom. Each motor is controlled by its own Moteus servo controller.",items:["12 BLDC motors and 12 Moteus controllers.","Custom capstan transmissions at the joints.","Coordinated homing has been tested; locomotion control is ongoing."]}
};
const root=document.getElementById('architecture');const buttons=[...root.querySelectorAll('[data-id]')];function select(id){const d=details[id];buttons.forEach(b=>{const on=b.dataset.id===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});root.querySelector('#detailTag').textContent=d.tag;root.querySelector('#detailTitle').textContent=d.title;root.querySelector('#detailBody').textContent=d.body;root.querySelector('#detailList').replaceChildren(...d.items.map(t=>{const li=document.createElement('li');li.textContent=t;return li}))}
buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));select('pi');

})();

/* Photo gallery: add images by editing the list below and uploading to assets/gallery/. */
(()=>{
  const photos = [
    // { src: "assets/gallery/robot-assembly.jpg", caption: "CARL mechanical assembly", alt: "CARL quadruped mechanical assembly" },
    // { src: "assets/gallery/capstan-drive.jpg", caption: "Capstan drive detail", alt: "Close-up of a capstan transmission" },
  ];
  const root=document.querySelector("#gallery");if(!root)return;
  const img=root.querySelector("#gallery-image"),empty=root.querySelector("#gallery-empty");
  const caption=root.querySelector("#gallery-caption"),counter=root.querySelector("#gallery-counter");
  const thumbs=root.querySelector("#gallery-thumbnails");
  const prev=root.querySelector(".gallery-prev"),next=root.querySelector(".gallery-next");
  let index=0;
  function show(i){
    if(!photos.length)return;
    index=(i+photos.length)%photos.length;
    const p=photos[index];
    img.src=p.src;img.alt=p.alt||p.caption||"CARL project photograph";
    caption.textContent=p.caption||"CARL project photo";
    counter.textContent=(index+1)+" / "+photos.length;
    [...thumbs.children].forEach((button,n)=>button.setAttribute("aria-current",String(n===index)));
  }
  if(photos.length){
    img.hidden=false;empty.hidden=true;
    prev.disabled=next.disabled=photos.length<2;
    photos.forEach((p,i)=>{
      const button=document.createElement("button");button.type="button";button.className="gallery-thumb";
      button.setAttribute("aria-label","Show photo "+(i+1)+(p.caption?": "+p.caption:""));
      const thumbnail=document.createElement("img");thumbnail.src=p.src;thumbnail.alt="";thumbnail.loading="lazy";
      button.appendChild(thumbnail);button.addEventListener("click",()=>show(i));thumbs.appendChild(button);
    });
    img.addEventListener("error",()=>{img.hidden=true;empty.hidden=false;empty.querySelector("strong").textContent="PHOTO NOT FOUND";empty.querySelector("p").textContent="Check the filename and path in js/main.js.";});
    img.addEventListener("load",()=>{img.hidden=false;empty.hidden=true;});
    prev.addEventListener("click",()=>show(index-1));next.addEventListener("click",()=>show(index+1));
    root.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();show(index-1)}if(e.key==="ArrowRight"){e.preventDefault();show(index+1)}});
    show(0);
  }
})();
