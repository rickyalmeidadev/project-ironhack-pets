console.log('linked');

const info1 = document.getElementById('info-1');
const info2 = document.getElementById('info-2');
const info3 = document.getElementById('info-3');

if (window.screen.availWidth > 600) {
  [info1, info2, info3].forEach(info => {
    info.classList.add('info-opacity')
  })
  window.addEventListener('scroll', () => {
    if (window.screen.availWidth > 600) if (window.scrollY > 109) info1.classList.add('go-right');
    if (window.scrollY > 412) info2.classList.add('go-left');
    if (window.scrollY > 722) info3.classList.add('go-right');
  });
}
