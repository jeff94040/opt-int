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