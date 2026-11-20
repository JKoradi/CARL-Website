const menuButton = document.querySelector('.menu-toggle');
const menuLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const isOpen = menuLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
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
