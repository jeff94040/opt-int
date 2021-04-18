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
    add_body_name_and_shape();
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

/////////////////////////////////

const table = document.querySelector('#option-2-table');

function add_body_name_and_shape () {
  table.appendChild(add_input_row('body name: ','body-name','0px'));
  const tr = add_select_row('body shape: ', 'body-shape', {'': '', axisymetric: 'a', foil: 'f'}, '0px');
  table.appendChild(tr);
  const select = tr.querySelector('select');
  select.addEventListener('change', () => {
    select.value === 'a' ? add_axisymetric_body() : console.log('need to code f'); 
  });
}

// Add x4 table rows for axisymetric
function add_axisymetric_body () {
  // Add 1 of 4 table rows for axisymetric
  table.appendChild(add_input_row('hull nose coordinates: ', 'hull-nose-coords', '20px'));
  // Add 2-4 of 4 table rows for axisymetric
  addControlPointCoordinates();
};

// Add 2-4 of 4 table rows for axisymetric
function addControlPointCoordinates(){
  table.appendChild(add_input_row('next hull control point coordinates: ', 'next-hull-ctrl-pt-coords', '20px'));
  table.appendChild(add_input_row('# of segements between control points: ', 'segments-between-ctrl-pts', '20px'));
  const tr = add_select_row('add another control point? :', 'add-ctrl-point', {'': '', no: 'n', yes: 'y'}, '20px');
  table.appendChild(tr);
  const select = tr.querySelector('select');
  select.addEventListener('change', () => {
    select.value === 'n' ? addHullBodyPrompt() : addControlPointCoordinates();
  });
}

function addHullBodyPrompt(){
  const tr = add_select_row('add another hull body? ', 'add-hull-body', {'': '', no: 'n', yes: 'y'}, '0px');
  table.appendChild(tr);

  const select = tr.querySelector('select');
  select.addEventListener('change', () => {
    if(select.value === 'n'){
      add_data_edits();
    }
    else if(select.value === 'y'){
      add_body_name_and_shape();
    }
  });
}

function add_data_edits(){
  table.appendChild(add_input_row(`43. longitudinal center of bouyancy [${xvfContent[42]}]: `, 'xvf', '0px'));
  table.appendChild(add_input_row(`44. ship displacement (long tons) [${xvfContent[43]}]: `, 'xvf', '0px'));
  table.appendChild(add_input_row(`45. opt. param. (1=drag, 2=height, 3=slope) [${xvfContent[44]}]: `, 'xvf', '0px'));
  table.appendChild(add_input_row(`46. reasonablenes factor alpha (0<alpha<1) [${xvfContent[45]}]: `, 'xvf', '0px'));
}

function add_input_row (text_desc, name, padding_left) {
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  td_a.style.paddingLeft = padding_left;
  
  const input = document.createElement('input');
  input.name = name;  
  
  const td_b = document.createElement('td');
  td_b.style.paddingLeft = padding_left;
  td_b.appendChild(input);
  
  const tr = document.createElement('tr');
  tr.appendChild(td_a);
  tr.appendChild(td_b);

  return tr;
}

function add_select_row (text_desc, name, options, padding_left){
  
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  td_a.style.paddingLeft = padding_left;
  
  const select = document.createElement('select');
  select.name = name;
  for (const [key, value] of Object.entries(options)) {
    const option = document.createElement('option');
    option.innerHTML = key;
    option.value = value;
    select.appendChild(option);
  }
  
  const td_b = document.createElement('td');
  td_b.style.paddingLeft = padding_left;
  td_b.appendChild(select);

  const tr = document.createElement('tr');
  tr.appendChild(td_a);
  tr.appendChild(td_b);

  return tr;
}

// Browser back button
window.addEventListener('pageshow', toggleDisplays);