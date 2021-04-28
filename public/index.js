// Populate .xvf content
xvf_content_arr = xvf_content.split(',');
document.querySelectorAll('[data-xvf]').forEach( (elem) => {
  elem.value = Number(xvf_content_arr[elem.getAttribute('data-xvf')]);
});

// Populate .vvf content
const vvf_content_arr = vvf_content.split(',');
document.querySelectorAll('[data-vvf]').forEach( (elem) => {
  elem.value = Number(vvf_content_arr[elem.getAttribute('data-vvf')]);
});

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
const buttons = document.querySelectorAll('input[type=submit]');
// const buttons = document.querySelectorAll('button');

buttons.forEach( (button) => {
  button.addEventListener('click', () => {

    // Add menu selection to form
    const menu_copy = document.createElement('input');
    menu_copy.type = 'hidden';
    menu_copy.name = 'menu';
    menu_copy.value = menu.value;
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

// Up to 100 segments
let num_segments_options = {};
for (i = 1; i <= 100; i++)
  num_segments_options[i] = i;

// Browser back button
window.addEventListener('pageshow', toggle_displays);

const hull_count_e = document.querySelector('#hull-count');

// Hulls div to be populated dynamically
const hulls = document.querySelector('#hulls');

// Fires when a hull count is selected
hull_count_e.addEventListener('change', () => {

  // Start from scratch
  hulls.innerHTML = '';

  // For each hull
  for(i = 0; i < hull_count_e.value; i++){
    
    // Capsule div for each hull, to be populated dynamically
    const hull_capsule_e = create_div('hull-capsule', null);

    const hull_title_e = create_div('hull-title', `Body #${i+1}`)

    const form_floating_e_1 = create_div('form-floating', null);
    
    const form_control_e_1 = create_input('text', 'form-control', 'sequence', null, false);

    const label_e_1 = create_label('name');
    
    const form_floating_e_2 = create_div('form-floating', null);

    const hull_type_e = create_select('form-select', 'sequence', {'axisymetric':'a', 'foil':'f'});

    const label_e_2 = create_label('body type');

    const hull_type_capsule_e = create_div('div');

    const hidden_input = create_input('hidden', null, 'sequence', i === hull_count_e.value - 1 ? 'n' : 'y', false)

    hull_capsule_e.appendChild(hull_title_e);

    form_floating_e_1.appendChild(form_control_e_1);
    form_floating_e_1.appendChild(label_e_1);
    hull_capsule_e.appendChild(form_floating_e_1);

    form_floating_e_2.appendChild(hull_type_e);
    form_floating_e_2.appendChild(label_e_2);
    hull_capsule_e.appendChild(form_floating_e_2);

    hull_capsule_e.appendChild(hull_type_capsule_e);

    hull_capsule_e.appendChild(hidden_input);

    hulls.appendChild(hull_capsule_e);

    // Fires when changing hull type axis <-> foil
    hull_type_e.addEventListener('change', () => {

      // Start from scratch
      hull_type_capsule_e.innerHTML = '';

      // Return if no hull type selected
      if(hull_type_e.value === '')
        return;

      const input_1 = create_input('text', 'form-control', 'sequence', null, true);
      let input_1_label;

      let input_2;
      let input_2_label;

      const ctrl_pts_select = create_select('form-select', null, {1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6'});
      const ctrl_pts_select_label = create_label('# of additional control points');

      const form_floating_1 = create_div('form-floating', null);
      let form_floating_2;
      const form_floating_3 = create_div('form-floating', null);

      if(hull_type_e.value === 'a'){

        input_1_label = create_label('hull nose coordinates');
        
      }
      else if(hull_type_e.value === 'f'){

        input_1_label = create_label('one leading edge coordinates');
        
        input_2 = create_input('text', 'form-control', 'sequence', null, true);
        input_2_label = create_label('other leading edge coordinates');

        form_floating_2 = create_div('form-floating', null)

      }
      
      form_floating_1.appendChild(input_1);
      form_floating_1.appendChild(input_1_label);
      
      if(form_floating_2){
        form_floating_2.appendChild(input_2);
        form_floating_2.appendChild(input_2_label);
      }
      
      form_floating_3.appendChild(ctrl_pts_select);
      form_floating_3.appendChild(ctrl_pts_select_label);
      
      hull_type_capsule_e.appendChild(form_floating_1);
      if(form_floating_2)
        hull_type_capsule_e.appendChild(form_floating_2);
      hull_type_capsule_e.appendChild(form_floating_3);

      const ctrl_pt_capsule = create_div('ctrl-pt-capsule', null);
      hull_type_capsule_e.appendChild(ctrl_pt_capsule);

      // Fires when additional number of control points are selected
      ctrl_pts_select.addEventListener('change', () => {
        ctrl_pt_capsule.innerHTML = '';
        for(j = 0; j < ctrl_pts_select.value; j++){
          const ctrl_pt_title_e = create_div('ctrl-pt-title', `additional control point #${j+1}`);

          const input = create_input('text', 'form-control', 'sequence', null, true);
          const input_label = create_label('next hull control point coordinates');

          const form_floating_1 = create_div('form-floating', null);
          form_floating_1.appendChild(input);
          form_floating_1.appendChild(input_label);

          const segments_select = create_select('form-select', 'sequence', num_segments_options);
          const segments_select_label = create_label('# of segments between control points');

          const form_floating_2 = create_div('form-floating', null);
          form_floating_2.appendChild(segments_select);
          form_floating_2.appendChild(segments_select_label);

          const hidden_input = create_input('hidden', null, 'sequence', j === ctrl_pts_select.value - 1 ? 'n' : 'y', false);

          ctrl_pt_capsule.appendChild(ctrl_pt_title_e);
          ctrl_pt_capsule.appendChild(form_floating_1);
          ctrl_pt_capsule.appendChild(form_floating_2);
          ctrl_pt_capsule.appendChild(hidden_input);
        }
      });
    });
  }
});

function create_div (class_name, inner_html){
  const div = document.createElement('div');
  if(class_name)
    div.className = class_name;
  if(inner_html)
    div.innerHTML = inner_html;
  return div;
}

function create_input (type, class_name, name, default_value, coordinate) {
  const input = document.createElement('input');
  input.required = true;
  if(type)
    input.type = type;
  if(class_name)
    input.className = class_name;
  if(name)
    input.name = name;
  if(default_value)
    input.defaultValue = default_value;
  if(coordinate)
    input.pattern = '-?\\d{1,4}(\\.\\d{1,2})?,-?\\d{1,4}(\\.\\d{1,2})?,-?\\d{1,4}(\\.\\d{1,2})?';
  return input;
}

function create_label (inner_html){
  const label = document.createElement('label');
  if(inner_html)
    label.innerHTML = inner_html;
  return label;
}

function create_select (class_name, name, options) {
  const select = document.createElement('select');
  select.required = true;
  if(class_name)
    select.className = class_name;
  if(name)
    select.name = name;
  // default null option
  select.appendChild(document.createElement('option'));
  for (const [key, value] of Object.entries(options)) {
    const option = document.createElement('option');
    option.innerHTML = key;
    option.value = value;
    select.appendChild(option);
  }
  return select;
}

function create_option (value, inner_html){
  const option = document.createElement('option');
  if(value)
    option.value = value;
  if(inner_html)
    option.innerHTML = inner_html;
  return option;
}