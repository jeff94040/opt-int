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
    //add_body_name_and_shape();
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

const hull_body_count = document.querySelector('#hull-body-count');

hull_body_count.addEventListener('change', () => {

  populate_bodies(hull_body_count.value);

});

function populate_bodies(body_count){

  const hull_bodies_table = document.querySelector('#hull-bodies-table');

  while(hull_bodies_table.firstChild)
    hull_bodies_table.removeChild(hull_bodies_table.firstChild);

  for(i = 0; i < body_count; i++){
    hull_bodies_table.appendChild(add_body_group_header(i));
    hull_bodies_table.appendChild(add_body_name());
    
    const body_type_tr = add_body_type();
    hull_bodies_table.appendChild(body_type_tr);
    
    const body_tbody = add_body_tbody();
    hull_bodies_table.appendChild(body_tbody);
    
    const body_type_select = body_type_tr.querySelector('select');
    body_type_select.addEventListener('change', () => {
      //console.log('got here');
      while(body_tbody.firstChild)
        body_tbody.removeChild(body_tbody.firstChild);

      if(body_type_select.value === 'a'){
        body_tbody.appendChild(add_input_row('hull nose coordinates: ', 'one-tab'));
      }
      else if(body_type_select.value === 'f'){
        body_tbody.appendChild(add_input_row('one leading edge coordinates: ', 'one-tab'));
        body_tbody.appendChild(add_input_row('other leading edge coordinates: ', 'one-tab'));
      }
      else{
        return;
      }
      const ctrl_pts_tr = add_select_row('# of control points? ', null, {0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6'}, 'one-tab');
      body_tbody.appendChild(ctrl_pts_tr);

      const ctrl_pts_select = ctrl_pts_tr.querySelector('select');
      ctrl_pts_select.addEventListener('change', () => {

        const ctr_point_trs = body_tbody.querySelectorAll('[data-ctr]');

        ctr_point_trs.forEach( (ctr_point_tr) => { ctr_point_tr.remove(); });

        for (i = 0; i < ctrl_pts_select.value ; i++){
          
          const tr_one = add_text_row(`control point # ${i+1}`, 'one-tab');
          tr_one.dataset.ctr = '';
          tr_one.className = 'two-tabs-bold';
          body_tbody.appendChild(tr_one);

          const tr_two = add_input_row('next hull control point coordinates: ', 'two-tabs');
          tr_two.dataset.ctr = '';
          body_tbody.appendChild(tr_two);

          const tr_three = add_select_row('# of segements between control points: ', 'sequence', num_segments_options, 'two-tabs');
          tr_three.dataset.ctr = '';
          body_tbody.appendChild(tr_three);

          // Added to satisfy optjm.exe sequence for another ctrl pt coord (y/n)
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'sequence';
          i === (ctrl_pts_select.value - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
          body_tbody.appendChild(input);

        }
      });
    });

    // THIS NEEDS TO BE MOVED / FIXED!!!
    // Added to satisfy optjm.exe sequence for another hull body (y/n)
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'sequence';
    i === (body_count - 1) ? input.defaultValue = 'n' : input.defaultValue = 'y';
    body_tbody.appendChild(input);
  }
}

function add_body_group_header(body_number){

  return add_text_row(`body # ${body_number+1}`, 'bold');

}

function add_body_name(){

  return add_input_row('body name: ', 'one-tab');

}

function add_body_type(){

  return add_select_row(`body type: `, 'sequence', {'': '', axisymetric: 'a', foil: 'f'}, 'one-tab');

}

function add_body_tbody(){

  return document.createElement('tbody');

}

function add_data_edits(){
  table.appendChild(add_input_row(`43. longitudinal center of bouyancy [${xvfContent[42]}]: `));
  table.appendChild(add_input_row(`44. ship displacement (long tons) [${xvfContent[43]}]: `));
  table.appendChild(add_input_row(`45. opt. param. (1=drag, 2=height, 3=slope) [${xvfContent[44]}]: `));
  table.appendChild(add_input_row(`46. reasonablenes factor alpha (0<alpha<1) [${xvfContent[45]}]: `));
}

function add_input_row (text_desc, css_class_name) {
  const td_a = document.createElement('td');
  td_a.innerText = text_desc;
  td_a.className = css_class_name;
  
  const input = document.createElement('input');
  input.name = 'sequence';  
  
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
  if(name)
    select.name = name;
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

function add_text_row (text, css_class_name) {

  const td_a = document.createElement('td');
  td_a.innerText = text;
  td_a.className = css_class_name;
  
  const td_b = document.createElement('td');
  
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
window.addEventListener('pageshow', toggleDisplays);