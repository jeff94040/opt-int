// Default menu to previous menu selection if received from server reply
if(previous_menu)
  document.querySelector('#menu').options[previous_menu].selected = true;

// Toggle section displays based on menu selection
const menu = document.querySelector('#menu');

menu.addEventListener('change', toggle_displays);

function toggle_displays () {
  document.querySelectorAll('[data-menu]').forEach( (elem) => {
    if(elem.dataset.menu.includes(menu.value))
      elem.removeAttribute('style');
    else
      elem.style.display = 'none';
  });
};

// Button event listeners
// const buttons = document.querySelectorAll('input[type=submit]');
const buttons = document.querySelectorAll('button');

buttons.forEach( (button) => {
  button.addEventListener('click', () => {

    // Add menu selection to form
    const menu_copy = document.createElement('input');
    menu_copy.type = 'hidden';
    menu_copy.name = 'menu';
    menu_copy.defaultValue = menu.value;
    button.form.appendChild(menu_copy);

    // Check to ensure all required form fields are populated
    let all_set = true;
    button.form.querySelectorAll('[required]').forEach( (elem) => {
      if(!elem.value)
        all_set = false;
    });

    // If all required fields are populated, disable all buttons and submit form
    if(all_set){
      buttons.forEach( (button) => { button.disabled = true; });
      button.form.submit();
    }
  });
});

/* Remaining code dynamically populates sequence for option #2 */

// Add event listener to # hull bodies dropdown menu
const hull_body_count = document.querySelector('#hull-body-count');

hull_body_count.addEventListener('change', () => {

  // Select hull bodies table where all dynamic content will be populated
  const hull_bodies_table = document.querySelector('#hull-bodies-table');

  // Remove all table children (start from scratch)
  while(hull_bodies_table.firstChild)
    hull_bodies_table.removeChild(hull_bodies_table.firstChild);

  // Return if blank menu option selected
  if(!hull_body_count.value)
    return;

  // For each body
  for(i = 0; i < hull_body_count.value; i++){

    // Add body # text row in bold
    hull_bodies_table.appendChild(add_text_row(`body # ${i + 1}`, '', 'bold'));

    // Add body name input row
    hull_bodies_table.appendChild(add_input_row('body name: ', 'one-tab', true, false, null));
    
    // Add body type select row
    const body_type_tr = add_select_row(`body type: `, 'sequence', {axisymetric: 'a', foil: 'f'}, 'one-tab');
    hull_bodies_table.appendChild(body_type_tr);
    
    // Add tbody to be further populated and provide reference to delete all child elements
    const body_tbody = document.createElement('tbody');
    hull_bodies_table.appendChild(body_tbody);

    // Added to satisfy optjm.exe sequence for another hull body (y/n)
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'sequence';
    i === (hull_body_count.value - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
    hull_bodies_table.appendChild(input);

    // Add event listener to body type (a/f) dropdown menu
    body_type_tr.querySelector('select').addEventListener('change', (event) => {

      // First remove all child elements from tbody (start from scratch)
      while(body_tbody.firstChild)
        body_tbody.removeChild(body_tbody.firstChild);

      // Populate elements depending on a/f selection, exit if blank
      if(event.target.value === 'a'){
        body_tbody.appendChild(add_input_row('hull nose coordinates: ', 'one-tab', true, true, null));
      }
      else if(event.target.value === 'f'){
        body_tbody.appendChild(add_input_row('one leading edge coordinates: ', 'one-tab', true, true, null));
        body_tbody.appendChild(add_input_row('other leading edge coordinates: ', 'one-tab', true, true, null));
      }
      else{
        return;
      }

      // Add # of control points row
      const ctrl_pts_tr = add_select_row('# of control points? ', null, {1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6'}, 'one-tab');
      body_tbody.appendChild(ctrl_pts_tr);

      // Add event listener to control points dropdown menu
      ctrl_pts_tr.querySelector('select').addEventListener('change', (event) => {

        // Remove all elems with data-ctr attribute (start from scratch)
        body_tbody.querySelectorAll('[data-ctr]').forEach( (ctr_point_tr) => { 
          ctr_point_tr.remove(); 
        });

        // For each control point
        for (i = 0; i < event.target.value ; i++){
          
          // Add control point # text row
          const tr_one = add_text_row(`control point # ${i+1}`, '', 'one-tab');
          tr_one.dataset.ctr = '';
          tr_one.className = 'two-tabs-bold';
          body_tbody.appendChild(tr_one);

          // Add control point coords row
          const tr_two = add_input_row('next hull control point coordinates: ', 'two-tabs', true, true, null);
          tr_two.dataset.ctr = '';
          body_tbody.appendChild(tr_two);

          // Add control point # of segments row
          const tr_three = add_select_row('# of segements between control points: ', 'sequence', num_segments_options, 'two-tabs');
          tr_three.dataset.ctr = '';
          body_tbody.appendChild(tr_three);

          // Added to satisfy optjm.exe sequence for another ctrl pt coord (y/n)
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'sequence';
          input.dataset.ctr = '';
          i === (event.target.value - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
          body_tbody.appendChild(input);

        }
      });
    });
  }
  // After all dynamic inputs are populated, add vector data inputs
  hull_bodies_table.appendChild(add_data_edits());
});

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