const info1 = document.getElementById('info-1');
const info2 = document.getElementById('info-2');
const info3 = document.getElementById('info-3');

if (info1) {
  if (window.screen.width > 600) {
    [info1, info2, info3].forEach(info => {
      info.classList.add('info-opacity');
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 109) info1.classList.add('go-right');
      if (window.scrollY > 412) info2.classList.add('go-left');
      if (window.scrollY > 722) info3.classList.add('go-right');
    });
  }
}

const photoInput = document.getElementById('photo-input');
const photoLabel = document.getElementById('photo-label');

if (photoInput) {
  photoInput.addEventListener('change', () => {
    photoLabel.innerHTML = `${photoInput.value.slice(0, 25)}...`;
  });
}

const dateFields = document.querySelectorAll('.date-field');

dateFields.forEach(field => {
  field.innerHTML = field.innerHTML.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$3/$2/$1');
});
