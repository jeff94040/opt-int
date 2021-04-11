console.log(previousMenu);

// Pull previous menu selection from server reply and set selected attribute
if(previousMenu)
  document.querySelector('#menu').options[previousMenu].selected = true;

const menu = document.querySelector('#menu');

// Add event listeners to all buttons. When a button is clicked, disable all buttons and submit the button's form.
const buttons = document.querySelectorAll("button");

buttons.forEach( (button) => {
  button.addEventListener('click', () => {
    buttons.forEach( (button) => {
      button.disabled = true;
    });
    menu.style.display='none';
    button.form.appendChild(menu);
    button.form.submit();
  });
});

menu.addEventListener('change', toggleDisplays);

function toggleDisplays () {
  if(menu.value === '1'){
    document.querySelector('#option-2-input-files-form').style.display='inline';
    document.querySelector('#option-5-input-files-form').style.display='none';
    document.querySelector('#option-2-output-files-table').style.display='inline';
    document.querySelector('#option-5-output-files-table').style.display='none';
    document.querySelector('#option-2-edit-data-form').style.display='inline';
    document.querySelector('#option-5-edit-data-form').style.display='none';
  }
  else if(menu.value === '3'){
    document.querySelector('#option-2-input-files-form').style.display='none';
    document.querySelector('#option-5-input-files-form').style.display='inline';
    document.querySelector('#option-2-output-files-table').style.display='none';
    document.querySelector('#option-5-output-files-table').style.display='inline';
    document.querySelector('#option-2-edit-data-form').style.display='none';
    document.querySelector('#option-5-edit-data-form').style.display='inline';
  }
  else {
    document.querySelector('#option-2-input-files-form').style.display='none';
    document.querySelector('#option-5-input-files-form').style.display='none';
    document.querySelector('#option-2-output-files-table').style.display='none';
    document.querySelector('#option-5-output-files-table').style.display='none'; 
    document.querySelector('#option-2-edit-data-form').style.display='none';   
    document.querySelector('#option-5-edit-data-form').style.display='none';   
  }
};

// Browser back button
window.addEventListener('pageshow', toggleDisplays);


// Show or hide sections based on main menu selection

//const main_menu_elem = document.querySelector("[name='main-menu']");

//main_menu_elem.addEventListener('change', () => {

  

  //console.log(main_menu_elem.value);


  /*
  // Replace existing tables with blank slate
  const files_table_elem = document.createElement('table');
  files_table_elem.id = 'files-table';

  const inputs_table_elem = document.createElement('table');
  inputs_table_elem.id = 'inputs-table';

  document.body.replaceChild(files_table_elem, document.querySelector('#files-table'));
  document.body.replaceChild(inputs_table_elem, document.querySelector('#inputs-table'));
  */

//});

const yn_map = new Map([['y', 'yes'], ['n', 'no']]);

// Helper method designed to construct tr element containing input element
function buildInputsInputRow(name, value, description){
    const input_elem = document.createElement('input');
    input_elem.name = name;
    input_elem.defaultValue = value;

    const td_elem_one = document.createElement('td');
    td_elem_one.innerText = description;

    const td_elem_two = document.createElement('td');
    td_elem_two.innerHTML = input_elem.outerHTML;

    const tr_elem = document.createElement('tr');
    tr_elem.appendChild(td_elem_one);
    tr_elem.appendChild(td_elem_two);

    return tr_elem;
}

// Helper method designed to construct tr element containing select element 
function buildInputsSelectRow(name, map, description){
  const select_elem = document.createElement('select');
  select_elem.name = name;
  
  map.forEach(function(value, key){
    const opt = document.createElement('option');
    opt.value = key;
    opt.text = value;
    select_elem.add(opt, null);
  });

  const td_elem_one = document.createElement('td');
  td_elem_one.innerText = description;

  const td_elem_two = document.createElement('td');
  td_elem_two.innerHTML = select_elem.outerHTML;

  const tr_elem = document.createElement('tr');
  tr_elem.appendChild(td_elem_one);
  tr_elem.appendChild(td_elem_two);

  return tr_elem;
}

// Helper method designed to construct tr element containing text element
function buildInputsTextRow(text){
  const td_elem_one = document.createElement('td');
  td_elem_one.innerText = text;

  const td_elem_two = document.createElement('td');
  
  const tr_elem = document.createElement('tr');
  tr_elem.appendChild(td_elem_one);
  tr_elem.appendChild(td_elem_two);

  return tr_elem;
}

// Helper method designed to construct tr element containing filename and actions
function buildFileRow(filename){
  const tr_elem = document.createElement('tr');

  const td_elem_one = document.createElement('td');
  td_elem_one.innerText = filename;
  const td_elem_two = document.createElement('td');
  td_elem_two.innerHTML = '<a href=\'\'>view</a>';
  const td_elem_three = document.createElement('td');
  td_elem_three.innerHTML = '<a href=\'\'>download</a>';
  const td_elem_four = document.createElement('td');
  td_elem_four.innerHTML = '<a href=\'\'>upload</a>';

  tr_elem.appendChild(td_elem_one);
  tr_elem.appendChild(td_elem_two);
  tr_elem.appendChild(td_elem_three);
  tr_elem.appendChild(td_elem_four);

  return tr_elem;
}