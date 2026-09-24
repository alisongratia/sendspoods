// Sign-in (emailed link, no password) and spood-sender names, shared by index.html and collection.html.
// Usage: var acct = SpoodAccount.init(supabaseClient); acct.onChange(fn); acct.open(); acct.bindButton(el)
(function(){
  var css = [
    '.acct{border:3px solid var(--line,#2A1636);border-radius:26px;padding:28px 26px 24px;max-width:min(440px,calc(100vw - 32px));width:100%;background:var(--paper,#FFFDF3);color:var(--ink,#2A1636);box-shadow:10px 10px 0 var(--shadow,#2A1636)}',
    '.acct::backdrop{background:rgba(42,22,54,.45)}',
    '.acct h2{font-family:var(--display,sans-serif);font-weight:400;font-size:32px;line-height:1.05;margin:0 0 8px}',
    '.acct p{margin:0 0 14px;color:var(--ink-soft,#5B4768)}',
    '.acct form{background:none;border:0;padding:0;margin:0;display:block;color:inherit}',
    '.acct label{display:grid;gap:6px;font-weight:800;font-size:14px;margin-bottom:14px;color:var(--ink,#2A1636)}',
    '.acct input{border:2px solid #2A1636;border-radius:12px;padding:11px 14px;background:#fff;color:#2A1636;font:inherit;width:100%}',
    '.acct .handle-in{display:flex;align-items:center;border:2px solid #2A1636;border-radius:12px;background:#fff;padding-left:12px;color:#2A1636;font-weight:800}',
    '.acct .handle-in input{border:0;border-radius:0 12px 12px 0;padding-left:4px}',
    '.acct .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}',
    '.acct .status{font-family:var(--hand,cursive);font-weight:700;font-size:19px;min-height:1.3em;margin:12px 0 0;color:var(--ink,#2A1636)}',
    '.acct .linkish{background:none;border:0;padding:0;font:inherit;font-weight:700;color:var(--ink,#2A1636);text-decoration:underline;cursor:pointer}',
    '.acct .x{position:absolute;top:12px;right:14px;background:none;border:0;font-size:26px;line-height:1;cursor:pointer;color:var(--ink,#2A1636)}',
    '.acct{position:fixed}',
    '.acct-btn{font:inherit;font-weight:600;background:none;border:0;cursor:pointer;color:inherit;padding:6px 12px;border-radius:999px}',
    '.acct-btn:hover{background:var(--ground-2,#FFF4B8)}'
  ].join('\n');

  var html =
    '<dialog class="acct" id="acct" aria-labelledby="acctTitle">' +
      '<button class="x" type="button" data-close aria-label="Close">×</button>' +
      '<div data-step="email">' +
        '<h2 id="acctTitle">Sign in to sendspoods</h2>' +
        '<p>Get your own spood collection page. We’ll email you a sign-in link, no password needed.</p>' +
        '<form data-form="email" novalidate><label for="acctEmail">Your email<input type="email" id="acctEmail" autocomplete="email" required></label>' +
        '<button class="btn" type="submit">Email me a sign-in link</button></form>' +
        '<p class="status" role="status" aria-live="polite"></p>' +
      '</div>' +
      '<div data-step="sent" hidden>' +
        '<h2>Check your email</h2>' +
        '<p>We sent a sign-in link to <b data-sent-to></b>. Open it on the phone or computer you want to use sendspoods on.</p>' +
        '<button class="linkish" type="button" data-back>Use a different email</button>' +
      '</div>' +
      '<div data-step="name" hidden>' +
        '<h2>Pick your spood-sender name</h2>' +
        '<p>It goes on every spood you send and on your collection page. Once it’s yours, nobody else can use it.</p>' +
        '<form data-form="name" novalidate><label for="acctHandle">Sender name<span class="handle-in"><span aria-hidden="true">@</span><input type="text" id="acctHandle" maxlength="24" placeholder="mothqueen" autocapitalize="none" spellcheck="false"></span></label>' +
        '<button class="btn" type="submit">Claim this name</button></form>' +
        '<p class="status" role="status" aria-live="polite"></p>' +
      '</div>' +
      '<div data-step="done" hidden>' +
        '<h2>You’re signed in</h2>' +
        '<p>Spoods you send now go straight into your collection as <b data-me></b>.</p>' +
        '<div class="row"><a class="btn" data-mine href="collection.html">See my collection</a><button class="btn" type="button" data-signout>Sign out</button></div>' +
      '</div>' +
    '</dialog>';

  function cleanHandle(v){
    v = (v || '').trim().replace(/^@/, '').toLowerCase();
    return /^[a-z0-9_]{2,24}$/.test(v) ? v : '';
  }

  window.SpoodAccount = {
    cleanHandle: cleanHandle,
    init: function(sb){
      var state = { user: null, profile: null, ready: false };
      var listeners = [], buttons = [];

      var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
      document.body.insertAdjacentHTML('beforeend', html);
      var dlg = document.getElementById('acct');
      function step(name){
        dlg.querySelectorAll('[data-step]').forEach(function(s){ s.hidden = s.getAttribute('data-step') !== name; });
        dlg.querySelectorAll('.status').forEach(function(s){ s.textContent = ''; });
      }
      function status(name, msg){ dlg.querySelector('[data-step="' + name + '"] .status').textContent = msg; }
      function show(){ if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } } }
      function close(){ if (dlg.open) dlg.close(); }

      function emit(){
        buttons.forEach(paintButton);
        listeners.forEach(function(fn){ fn(state); });
      }
      function paintButton(b){
        b.textContent = state.profile ? '@' + state.profile.handle : state.user ? 'Pick your name' : 'Sign in';
      }
      function open(){
        if (!state.user) step('email');
        else if (!state.profile) step('name');
        else {
          step('done');
          dlg.querySelector('[data-me]').textContent = '@' + state.profile.handle;
          dlg.querySelector('[data-mine]').href = 'collection.html?by=' + encodeURIComponent(state.profile.handle);
        }
        show();
      }

      function loadProfile(){
        if (!state.user) { state.profile = null; state.ready = true; emit(); return; }
        sb.from('spood_profiles').select('handle,created_at').eq('id', state.user.id).maybeSingle().then(function(r){
          state.profile = r.data || null; state.ready = true; emit();
          // just arrived from the email link without a name yet: ask for one
          if (!state.profile) open();
        });
      }

      sb.auth.getSession().then(function(r){ state.user = r.data.session ? r.data.session.user : null; loadProfile(); });
      sb.auth.onAuthStateChange(function(evt, session){
        var was = state.user && state.user.id, now = session ? session.user : null;
        state.user = now;
        if ((now && now.id) !== was) loadProfile();
        // tidy the sign-in tokens out of the address bar
        if (location.hash.indexOf('access_token') > -1) history.replaceState(null, '', location.pathname + location.search);
      });

      dlg.querySelector('[data-close]').addEventListener('click', close);
      dlg.addEventListener('click', function(e){ if (e.target === dlg) close(); });
      dlg.querySelector('[data-back]').addEventListener('click', function(){ step('email'); });

      dlg.querySelector('[data-form="email"]').addEventListener('submit', function(e){
        e.preventDefault();
        var email = document.getElementById('acctEmail').value.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status('email', 'That email doesn’t look quite right.'); return; }
        status('email', 'Sending your link…');
        var back = location.origin + location.pathname + location.search;
        sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: back, shouldCreateUser: true } }).then(function(r){
          if (r.error) {
            console.warn('sign-in', r.error);
            status('email', /rate|seconds/i.test(r.error.message || '') ? 'Too many links sent. Please wait a minute and try again.' : 'We couldn’t send the link right now. Please try again later.');
            return;
          }
          dlg.querySelector('[data-sent-to]').textContent = email;
          step('sent');
        });
      });

      // Tidy the name as it's typed: lowercase, spaces become _, anything else not allowed is dropped.
      var handleIn = document.getElementById('acctHandle');
      handleIn.addEventListener('input', function(){
        var v = handleIn.value.replace(/^@/, '').toLowerCase().replace(/[\s.\-]+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 24);
        if (v !== handleIn.value) handleIn.value = v;
      });
      dlg.querySelector('[data-form="name"]').addEventListener('submit', function(e){
        e.preventDefault();
        var h = cleanHandle(document.getElementById('acctHandle').value);
        if (!h) { status('name', 'Names need at least 2 letters or numbers (you can use _ too).'); return; }
        status('name', 'Claiming @' + h + '…');
        sb.from('spood_profiles').insert({ id: state.user.id, handle: h }).then(function(r){
          if (r.error) {
            status('name', r.error.code === '23505' ? '@' + h + ' is taken. Try another.' : 'That didn’t work. Please try again.');
            return;
          }
          state.profile = { handle: h }; emit(); open();
        });
      });

      dlg.querySelector('[data-signout]').addEventListener('click', function(){
        sb.auth.signOut().then(function(){ state.user = null; state.profile = null; emit(); close(); });
      });

      return {
        state: function(){ return state; },
        onChange: function(fn){ listeners.push(fn); if (state.ready) fn(state); },
        open: open,
        bindButton: function(b){ buttons.push(b); paintButton(b); b.addEventListener('click', open); }
      };
    }
  };
})();
