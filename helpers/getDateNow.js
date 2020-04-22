const getDateNow = () => {
  let dateNow = new Date();
  let yearNow = dateNow.getFullYear();
  let monthNow = dateNow.getMonth();
  let dayNow = dateNow.getDate();

  if (monthNow < 10) monthNow = `0${monthNow}`;
  if (dayNow < 10) dayNow = `0${dayNow}`;

  return `${yearNow}-${monthNow}-${dayNow}`;
};

module.exports = helper = { getDateNow };
