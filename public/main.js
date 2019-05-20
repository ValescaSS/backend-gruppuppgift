// (function(){
//   console.log('Hello World!');
// })();

const views = {
  login: ['#loginFormTemplate', '#registerFormTemplate']
}

function renderView(view){
  // Definiera ett target
  const target = document.querySelector('main');

  // Loopa igenom våran "view"
  view.forEach(template => {

    // Hämta innehållet i template
    const templateMarkup = document.querySelector(template).innerHTML;
    // console.log(templateMarkup);

    // skapa en div
    const div = document.createElement('div');

    // Fill den diven i target (main-element)
    div.innerHTML = templateMarkup;

    // Lägg in den diven i
    target.append(div);
  })
  
  // Skriva ut innehållet i target

  // console.log(view);
}

renderView(views.login);

const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  console.log('Hej');

  const formData = new FormData(loginForm);
  fetch('/api/login', {
    method: 'POST',
    body: formData
  }).then(response => {
    if(!response.ok){
      return Error(response.statusText);
    } else {
      return response.json();
    }
  })
  .catch(error => {
    console.error(error);
  })
})



// fetch('/api/users')
//   .then (response => response.json())
//   .then (data => {

//    console.log(data)
//   })



