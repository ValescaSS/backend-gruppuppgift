
const views = {
  login: ['#loginFormTemplate', '#registerFormTemplate'],
  loginFail: ['#loginFailTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  registerSuccess: ['#registerSuccessTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  loggedIn: ['#createEntryFormTemplate'],
  entryComment: ['#moreentryCommentsTemplates'],
  entrySuccess: ['#createEntrySuccessTemplate', '#createEntryFormTemplate'],
  entryFail: ['#createEntryFailTemplate', '#createEntryFormTemplate']

}



function renderView(view) {
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
}
renderView(views.login);
renderView(views.loggedIn);

/*----------- Show journal---------------*/
function renderJournalView() {
  const target = document.querySelector('main');
  let tableDiv = document.createElement('table');

  tableDiv.innerHTML = ` 
  <thead>
      <tr class="text-uppercase">
          <th scope="col">Date</th>
          <th scope="col">Title</th>
          <th scope="col">Content</th>
          <th scope="col">Delete</th>
          <th scope="col">More</th>
      </tr>
  </thead>
   
  <tbody>
    
  </tbody>`;

  target.append(tableDiv);
}


function showEntry(entries){
  let target = document.querySelector('table');
  let entryTable = document.createElement('tbody');
  entryTable.innerHTML = '';
  entries.forEach(element => {
     entryTable.innerHTML+=`<tr>
           <td>${element.createdAt}</td>
           <td>${element.title}</td>
           <td>${element.content}</td>
             <td><a href="?entryID=<?=${element.entryID}?>" role="button" id="deleteBtn">Delete</a></td>
             <td><button class="more">More</button></td>
             </tr>
         `;
  });
    target.append(entryTable);
}



/*------------------end of show journal -----------------*/


const hideLogin = document.querySelector('#hideLoginForm');
const hideRegister = document.querySelector('#hideRegisterForm');
const showEntriesForm = document.querySelector('#showEntriesForm');
const logoutBtn = document.querySelector('#logout');
const createEntryFormTemplate = document.getElementById('createEntryFormTemplate');


/*----------------  Login  ------------*/
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  fetch('/api/login', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      hideLogin.classList.add('hidden');
      hideRegister.classList.add('hidden');
      showEntriesForm.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');
      renderJournalView();
      return response.json();
    }
  })
    .then(data => {
      const userID = data;
      console.log(userID);
      return fetch('/entries/userid/{id}')
    })
    .then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(data =>{
        showEntry(data);


      /* ------------------- Comments ----------------------- */



      let more = document.querySelectorAll(".more")
      /* for (let i = 0; i < more.length; i++) {
        console.log(i);

      } */
      more.forEach(element => {
        element.addEventListener("click", function () {
          console.log(element);
          const api3 = {
            ping3() {
              return fetch("/api/comments")
                .then(response => {
                  return !response.ok ? new Error(response.statusText) : response.json();
                }).then(data => {
                  entry3(data);
                })
                .catch(error => console.error(error));
            }
          };
          api3.ping3();

          function entry3(v) {
            let div = document.getElementById("moreentryComments");
            /* for (let i = 0; i < v.length; i++) {
              let content = v[i]['content'];
              div.innerHTML += '<p>' + ' ' + content + '</p>'
            } */

            v.forEach(element => {
              let content = element['content'];
              div.innerHTML += '<p>' + ' ' + content + '</p>'
              console.log(element);
            });
          };

          renderView(views.entryComment);
        })




      })
    })
    .catch(error => {
      console.error(error);
    })
})
/*----------------  end of log in ------------*/




/*----------------- Log out -----------------*/
logoutBtn.addEventListener('click', event => {
  fetch()
})


/*---------------end of Log out -----------------*/





/*--------------- register --------------------*/
const registerForm = document.querySelector('#registerForm');
registerForm.addEventListener('submit', event => {
  event.preventDefault();
  console.log('Hej');
  
  const formData = new FormData(registerForm);
  fetch('/api/register', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      return response.json();
    }
  })
  .catch(error => {
    console.error(error);
  })
})
/*---------------end of register --------------------*/


/* ------------------- Entries form ------------------*/
const entriesForm = document.querySelector('#entriesForm');
entriesForm.addEventListener('submit', event => {
  event.preventDefault();
  
  const formData = new FormData(entriesForm);
  fetch('/api/entry/{id}', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      console.log('skrivit!');
      return response.json();
    }
  }).then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  })
})

/* -------------------end of Entries form ------------------*/


/* ------------------- Delete entry ----------------------- */
/* const deleteEntry = document.querySelector('#deleteBtn');
deleteEntry.addEventListener('click', event =>{
  event.preventDefault();

  const formData = new FormData(deleteEntry);
  fetch('/api/entry/delete/{id}', {
    method: 'DELETE',
    body: formData
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      return response.json();
    }
  }).then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  })
}) */



  


  
  

  /* console.log(api3.ping3()); */










