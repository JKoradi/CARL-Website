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
