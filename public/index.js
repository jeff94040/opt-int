// Pull previous menu selection from server reply and set selected attribute
if(previous_menu)
  document.querySelector('#menu').options[previous_menu].selected = true;

const menu = document.querySelector('#menu');

// Add event listeners to all buttons. When a button is clicked, disable all buttons and submit the button's form.
const buttons = document.querySelectorAll('input[type=submit]');

buttons.forEach( (button) => {
  button.addEventListener('click', () => {

    // Add menu selection to form post
    const menu_copy = document.createElement('input');
    menu_copy.type = 'hidden';
    menu_copy.name = 'menu';
    menu_copy.defaultValue = menu.value;
    button.form.appendChild(menu_copy);

    let all_set = true;
    button.form.querySelectorAll('[required]').forEach( (elem) => {
      if(!elem.value)
        all_set = false;
    });
    if(all_set){
      buttons.forEach( (button) => { button.disabled = true; });
      button.form.submit();
    }
  });
});

menu.addEventListener('change', toggle_displays);

function toggle_displays () {
  document.querySelectorAll('[data-menu]').forEach( (elem) => {
    if(elem.dataset.menu === menu.value)
      elem.style.display = 'inline';
    else
      elem.style.display = 'none';
  });
};

const hull_body_count = document.querySelector('#hull-body-count');

hull_body_count.addEventListener('change', () => {

  const hull_bodies_table = document.querySelector('#hull-bodies-table');

  while(hull_bodies_table.firstChild)
    hull_bodies_table.removeChild(hull_bodies_table.firstChild);

  if(!hull_body_count.value)
    return;
  
  for(i = 0; i < hull_body_count.value; i++){
    hull_bodies_table.appendChild(add_body_group_header(i));
    hull_bodies_table.appendChild(add_body_name());
    
    const body_type_tr = add_body_type();
    hull_bodies_table.appendChild(body_type_tr);
    
    const body_tbody = add_body_tbody();
    hull_bodies_table.appendChild(body_tbody);

    // Added to satisfy optjm.exe sequence for another hull body (y/n)
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'sequence';
    i === (hull_body_count.value - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
    hull_bodies_table.appendChild(input);

    const body_type_select = body_type_tr.querySelector('select');
    body_type_select.addEventListener('change', () => {
      //console.log('got here');
      while(body_tbody.firstChild)
        body_tbody.removeChild(body_tbody.firstChild);

      if(body_type_select.value === 'a'){
        body_tbody.appendChild(add_input_row('hull nose coordinates: ', 'one-tab', true, true, null));
      }
      else if(body_type_select.value === 'f'){
        body_tbody.appendChild(add_input_row('one leading edge coordinates: ', 'one-tab', true, true, null));
        body_tbody.appendChild(add_input_row('other leading edge coordinates: ', 'one-tab', true, true, null));
      }
      else{
        return;
      }
      const ctrl_pts_tr = add_select_row('# of control points? ', null, {1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6'}, 'one-tab');
      body_tbody.appendChild(ctrl_pts_tr);

      const ctrl_pts_select = ctrl_pts_tr.querySelector('select');
      ctrl_pts_select.addEventListener('change', () => {

        const ctr_point_trs = body_tbody.querySelectorAll('[data-ctr]');

        ctr_point_trs.forEach( (ctr_point_tr) => { ctr_point_tr.remove(); });

        for (i = 0; i < ctrl_pts_select.value ; i++){
          
          const tr_one = add_text_row(`control point # ${i+1}`, '', 'one-tab');
          tr_one.dataset.ctr = '';
          tr_one.className = 'two-tabs-bold';
          body_tbody.appendChild(tr_one);

          const tr_two = add_input_row('next hull control point coordinates: ', 'two-tabs', true, true, null);
          tr_two.dataset.ctr = '';
          body_tbody.appendChild(tr_two);

          const tr_three = add_select_row('# of segements between control points: ', 'sequence', num_segments_options, 'two-tabs');
          tr_three.dataset.ctr = '';
          body_tbody.appendChild(tr_three);

          // Added to satisfy optjm.exe sequence for another ctrl pt coord (y/n)
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'sequence';
          input.dataset.ctr = '';
          i === (ctrl_pts_select.value - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
          body_tbody.appendChild(input);

        }
      });
    });
  }
  hull_bodies_table.appendChild(add_data_edits());
});

function add_body_group_header(body_number){

  return add_text_row(`body # ${body_number+1}`, '', 'bold');

}

function add_body_name(){

  return add_input_row('body name: ', 'one-tab', true, false, null);

}

function add_body_type(){

  return add_select_row(`body type: `, 'sequence', {axisymetric: 'a', foil: 'f'}, 'one-tab');

}

function add_body_tbody(){

  return document.createElement('tbody');

}

function add_data_edits(){
  const tbody = document.createElement('tbody');
  tbody.appendChild(add_text_row('testit.xvf - edit vector data', 'current value', 'bold'));
  tbody.appendChild(add_input_row(`43. longitudinal center of bouyancy: `, null, false, false, Number(xvf_content_arr[42])));
  tbody.appendChild(add_input_row(`44. ship displacement (long tons): `, null, false, false, Number(xvf_content_arr[43])));
  tbody.appendChild(add_input_row(`45. opt. param. (1=drag, 2=height, 3=slope): `, null, false, false, Number(xvf_content_arr[44])));
  tbody.appendChild(add_input_row(`46. reasonablenes factor alpha (0<alpha<1): `, null, false, false, Number(xvf_content_arr[45])));
  return tbody;
}

function add_input_row (text_desc, css_class_name, required, coordinate, value) {
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  if(css_class_name)
    td_a.className = css_class_name;
  
  const input = document.createElement('input');
  input.name = 'sequence';
  input.required = required;
  if(value)
    input.defaultValue = value; 
  if(coordinate){
    input.placeholder = 'X,Y,Z';
    input.pattern = '-?\\d{1,4}(\\.\\d{1,2})?,-?\\d{1,4}(\\.\\d{1,2})?,-?\\d{1,4}(\\.\\d{1,2})?';    
  }
  
  const td_b = document.createElement('td');
  td_b.className = css_class_name;
  td_b.appendChild(input);
  
  const tr = document.createElement('tr');
  tr.appendChild(td_a);
  tr.appendChild(td_b);

  return tr;
}

function add_select_row (text_desc, name, options, css_class_name){
  
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  td_a.className = css_class_name;
  
  const select = document.createElement('select');
  select.required = true;
  if(name)
    select.name = name;
  // Default null option
  select.appendChild(document.createElement('option'));
  for (const [key, value] of Object.entries(options)) {
    const option = document.createElement('option');
    option.innerHTML = key;
    option.value = value;
    select.appendChild(option);
  }
  
  const td_b = document.createElement('td');
  td_b.className = css_class_name;
  td_b.appendChild(select);

  const tr = document.createElement('tr');
  tr.appendChild(td_a);
  tr.appendChild(td_b);

  return tr;
}

function add_text_row (td_1_text, td_2_text, css_class_name) {

  const td_a = document.createElement('td');
  td_a.innerText = td_1_text;
  td_a.className = css_class_name;
  
  const td_b = document.createElement('td');
  td_b.innerText = td_2_text;
  td_b.className = css_class_name;
  
  const tr = document.createElement('tr');
  tr.appendChild(td_a);
  tr.appendChild(td_b);

  return tr;
}

// Up to 100 segments
let num_segments_options = {};
for (i = 1; i <= 100; i++)
  num_segments_options[i] = i;

// Browser back button
window.addEventListener('pageshow', toggle_displays);