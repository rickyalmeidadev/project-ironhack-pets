if ($('#errorMessageSignUp').text() !== '') {
  $('#modalCadastrar-se').modal('show');
}

if ($('#errorMessageLogin').text() !== '') {
  $('#modalEntrar').modal('show');
}

const info1 = document.getElementById('info-1');
const info2 = document.getElementById('info-2');
const info3 = document.getElementById('info-3');

if (info1) {
  if (window.screen.width > 600) {
    [info1, info2, info3].forEach(info => {
      info.classList.add('info-opacity');
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) info1.classList.add('go-right');
      if (window.scrollY > 430) info2.classList.add('go-left');
      if (window.scrollY > 750) info3.classList.add('go-right');
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

const speciesSelect = document.querySelectorAll('#species option');
const speciesLi = document.querySelector('#speciesLi');

if (speciesSelect.length > 0) {
  const species = speciesLi.innerText.replace('Tipo: ', '');
  speciesSelect.forEach(option => {
    if (option.value === species) {
      option.selected = 'selected';
    }
  });
}

const typeSelects = document.querySelectorAll('.type-select');

if (typeSelects) {
  const typesH6 = document.querySelectorAll('.type-h6');
  typeSelects.forEach((typeSelect, i) => {
    typeSelect.querySelectorAll('option').forEach(option => {
      let type = typesH6[i].innerText.replace('Tipo: ', '');
      if (option.value === type) {
        option.selected = 'selected';
      }
    });
  });
}

const eventCards = document.querySelectorAll('.event-card');
const iconDiv = document.querySelectorAll('.icon-div');
const typeH6 = document.querySelectorAll('.type-h6');

eventCards.forEach((_, i) => {
  let type = typeH6[i].innerText.replace('Tipo: ', '')

  switch (type) {
    case 'Vacina':
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/syringe.svg" alt="">
      `;
      break;
    case 'Consulta':
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/user-md.svg" alt="">
      `;
      break;
    case 'Cirurgia':
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/hospital-alt.svg" alt="">
      `;
      break;
    case 'Banho/Tosa':
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/shower.svg" alt="">
      `;
      break;
    case 'Aniversario':
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/birthday-cake.svg" alt="">
      `;
      break;
    default:
      iconDiv[i].innerHTML = `
        <img class="event-icon" src="/images/calendar-check.svg" alt="">
      `;
      break;
  }
});



