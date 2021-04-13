// Pull previous menu selection from server reply and set selected attribute
if(previousMenu)
  document.querySelector('#menu').options[previousMenu].selected = true;

const menu = document.querySelector('#menu');

// Add event listeners to all buttons. When a button is clicked, disable all buttons and submit the button's form.
const buttons = document.querySelectorAll("button");

buttons.forEach( (button) => {
  button.addEventListener('click', () => {
    buttons.forEach( (button) => { button.disabled = true; });
    menu.style.display='none';
    button.form.appendChild(menu);
    button.form.submit();
  });
});

const dataMenuOne = document.querySelectorAll('[data-menu-1]');
const dataMenuTwo = document.querySelectorAll('[data-menu-2]');
const dataMenuThree = document.querySelectorAll('[data-menu-3]');

menu.addEventListener('change', toggleDisplays);

function toggleDisplays () {
  if(menu.value === '1'){
    dataMenuOne.forEach( (elem) => { elem.style.display='inline'; });
    dataMenuTwo.forEach( (elem) => { elem.style.display='none'; });
    dataMenuThree.forEach( (elem) => { elem.style.display='none'; });
  }
  else if(menu.value === '2'){
    dataMenuOne.forEach( (elem) => { elem.style.display='none'; });
    dataMenuTwo.forEach( (elem) => { elem.style.display='inline'; });
    dataMenuThree.forEach( (elem) => { elem.style.display='none'; });
  }
  else if(menu.value === '3'){
    dataMenuOne.forEach( (elem) => { elem.style.display='none'; });
    dataMenuTwo.forEach( (elem) => { elem.style.display='none'; });
    dataMenuThree.forEach( (elem) => { elem.style.display='inline'; });    
  }
  else {
    dataMenuOne.forEach( (elem) => { elem.style.display='none'; });
    dataMenuTwo.forEach( (elem) => { elem.style.display='none'; });
    dataMenuThree.forEach( (elem) => { elem.style.display='none'; });    
  }
};

const body_shape_elem = document.querySelector('#body-shape');
body_shape_elem.addEventListener('change', () => {
  if(body_shape_elem.value === 'a'){
    add_input_row('hull nose coordinates: ', 'hull-nose-coords');
    add_input_row('next hull control point coordinates: ', 'next-hull-ctrl-pt-coords');
    add_input_row('# of segements between control points: ', 'segments-between-ctrl-pts');
  }
  else if(body_shape_elem.value === 'f'){

  }
});

function add_input_row (text_desc, input_name) {
  const tr = document.createElement('tr');
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  const td_b = document.createElement('td');
  const input = document.createElement('input');
  input.name = input_name;
  td_b.appendChild(input);
  tr.appendChild(td_a);
  tr.appendChild(td_b);
  body_shape_elem.form.querySelector('table').appendChild(tr);
}

// Browser back button
window.addEventListener('pageshow', toggleDisplays);