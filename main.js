(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Intro: "hello" handwriting, once per session
  const intro = document.getElementById('intro');
  let seen = false;
  try { seen = sessionStorage.getItem('intro') === '1'; } catch (e) {}
  const finishIntro = () => {
    intro.classList.add('gone');
    root.classList.add('loaded');
    try { sessionStorage.setItem('intro', '1'); } catch (e) {}
  };
  if (reduce || seen) { intro.remove(); root.classList.add('loaded'); }
  else {
    setTimeout(finishIntro, 2400);
    intro.addEventListener('click', finishIntro);
  }

  // Clock
  const clock = document.getElementById('clock');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false }); };
  tick(); setInterval(tick, 1000);

  // Header background on scroll
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  // Active nav link
  const links = [...document.querySelectorAll('.nav a')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.remove('active'));
    links[targets.indexOf(e.target)]?.classList.add('active');
  }), { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(t => t && spy.observe(t));

  // Mini shell
  const out = document.getElementById('out');
  const form = document.getElementById('prompt');
  const input = document.getElementById('cmd');
  const history = [];
  let hIdx = 0;
  const print = (text, cls = '') => {
    const p = document.createElement('p');
    p.className = 'line ' + cls;
    p.textContent = text;
    out.appendChild(p);
  };
  const go = id => document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  const commands = {
    help: () => print('commands: whoami  skills  work  process  contact  clear  sudo hire okan'),
    whoami: () => print('Okan Mustafa — senior dev · agentic AI · SQL · mobile integration · forward applied engineer · white-hat', 'acc'),
    skills: () => print('agentic-ai/  sql/  mobile-integration/  forward-applied/  security/', 'acc'),
    ls: () => commands.skills(),
    work: () => go('work'),
    process: () => go('process'),
    contact: () => { print('opening channel → hello@okanmustafa.dev', 'acc'); go('contact'); },
    clear: () => { out.innerHTML = ''; },
    exit: () => print('nice try.'),
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    print('$ ' + raw);
    const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
    if (cmd === 'sudo') {
      if (args[0] === 'hire') { print('[sudo] permission granted. great choice.', 'acc'); go('contact'); }
      else print('not in the sudoers file. this incident will be reported. (kidding — white hat.)', 'err');
    } else if (commands[cmd]) commands[cmd]();
    else print(`command not found: ${cmd} — try 'help'`, 'err');
    out.parentElement.scrollTop = out.parentElement.scrollHeight;
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
  });
})();
