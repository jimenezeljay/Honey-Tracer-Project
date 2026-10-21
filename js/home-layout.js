// Temporary homepage layout switch for the customer review (Layout A vs B).
// ?layout=a or ?layout=b picks one; the corner buttons switch live and update the URL
// so a specific layout can be shared as a link. Delete this file and the switch
// markup in index.html once the customer chooses.
(function () {
  const main = document.querySelector('.home-hero');
  const buttons = document.querySelectorAll('[data-layout-choice]');
  if (!main || !buttons.length) return;

  function setLayout(choice, updateUrl) {
    if (choice !== 'a' && choice !== 'b') choice = 'a';
    main.dataset.layout = choice;
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.layoutChoice === choice));
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('layout', choice);
      history.replaceState(null, '', url);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLayout(btn.dataset.layoutChoice, true); });
  });

  const fromUrl = new URLSearchParams(window.location.search).get('layout');
  setLayout(fromUrl ? fromUrl.toLowerCase() : 'a', false);
})();
