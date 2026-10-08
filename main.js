(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Hero typing
  const typed = document.querySelector('.typed');
  if (typed && !reduce) {
    const text = typed.dataset.type;
    typed.textContent = '';
    let i = 0;
    const tick = () => {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 90);
      else setTimeout(() => typed.classList.add('done'), 1200);
    };
    setTimeout(tick, 400);
  } else if (typed) typed.classList.add('done');

  // Reveal blocks on scroll
  const blocks = [...document.querySelectorAll('.block')];
  if (!reduce && 'IntersectionObserver' in window) {
    blocks.slice(1).forEach(b => b.classList.add('pending'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.remove('pending'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    blocks.forEach(b => io.observe(b));
  }

  // Active tab
  const tabs = [...document.querySelectorAll('.tabs a')];
  const sections = tabs.map(a => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      tabs.forEach(t => t.removeAttribute('aria-current'));
      const t = tabs[sections.indexOf(e.target)];
      if (t) t.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => s && spy.observe(s));

  // Interactive shell
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
    help: () => print(
`available commands:
  whoami     who is this guy
  about      jump to about
  skills     list the stack
  services   what I can do for you
  security   rules of engagement
  contact    get in touch
  clear      clear the terminal`),
    whoami: () => print('Okan Mustafa — senior developer · agentic AI · SQL · mobile integration · forward applied engineer · white-hat hacker', 'acc'),
    about: () => go('about'),
    skills: () => print('agentic-ai/  sql/  mobile-integration/  forward-applied/  security/', 'acc'),
    stack: () => go('stack'),
    ls: () => commands.skills(),
    services: () => go('services'),
    security: () => go('security'),
    contact: () => { print('opening channel... → hello@okanmustafa.dev', 'acc'); go('contact'); },
    clear: () => { out.innerHTML = ''; },
    date: () => print(new Date().toString()),
    pwd: () => print('/home/okan/portfolio'),
    exit: () => print('nice try. there is no escape from great engineering.'),
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    print('okan@mustafa:~$ ' + raw);
    const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
    if (cmd === 'sudo') {
      if (args.join(' ').startsWith('hire')) { print('[sudo] permission granted. great choice.', 'acc'); go('contact'); }
      else print('okan is not in the sudoers file. This incident will be reported. (just kidding — white hat.)', 'err');
    } else if (commands[cmd]) commands[cmd](args);
    else print(`zsh: command not found: ${cmd} — try 'help'`, 'err');
    input.scrollIntoView({ block: 'nearest' });
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
    if (e.key === 'Tab' && input.value) {
      const m = Object.keys(commands).find(c => c.startsWith(input.value));
      if (m) { input.value = m; e.preventDefault(); }
    }
  });
})();
