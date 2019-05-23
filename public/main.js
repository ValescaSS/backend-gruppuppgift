
const views = {
  login: ['#loginFormTemplate', '#registerFormTemplate'],
  loginFail: ['#loginFailTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  registerSuccess: ['#registerSuccessTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  loggedIn: ['#createEntryFormTemplate'],
  entrySuccess: ['#createEntrySuccessTemplate', '#createEntryFormTemplate'],
  entryFail: ['#createEntryFailTemplate', '#createEntryFormTemplate'],
  entryEdit: ['#editEntry']

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
          <th scope="col">Edit</th>
      </tr>
  </thead>
   
  <tbody>
    
  </tbody>`;

  target.append(tableDiv);
}

const bindEvents = () => {
  const loginForm = document.querySelector('#loginForm');
  const hideLogin = document.querySelector('#hideLoginForm');
  const hideRegister = document.querySelector('#hideRegisterForm');
  const showEntriesForm = document.querySelector('#showEntriesForm');
  const logoutBtn = document.querySelector('#logout');
  const createEntryFormTemplate = document.getElementById('createEntryFormTemplate');
  const registerForm = document.querySelector('#registerForm');
  const entriesForm = document.querySelector('#entriesForm');



  function showEntry(entries) {
    let target = document.querySelector('table');
    let entryTable = document.createElement('tbody');

    entryTable.innerHTML = '';
    entries.forEach(element => {
      entryTable.innerHTML += `<tr>
           <td>${element.createdAt}</td>
           <td>${element.title}</td>
           <td>${element.content}</td>
             <td><button data-value=${element.entryID} role="button" class ="deleteBtn">DELETE</button></td>
             <td><button data-value=${element.entryID} role="button" class ="editBtn">Edit</button></td>

             </tr>
         `;
    });
    target.append(entryTable);

    // Delete knappen
    const deleteBtnArray = document.querySelectorAll('.deleteBtn');
    for (let i = 0; i < deleteBtnArray.length; i++) {

      deleteBtnArray[i].addEventListener('click', event => {
        event.preventDefault();
        let entryID = deleteBtnArray[i].getAttribute('data-value');

        deleteEntry(entryID);
      })
    }

    //Edit knappen
    const editBtnArray = document.querySelectorAll('.editBtn');
    for (let i = 0; i < editBtnArray.length; i++) {

      editBtnArray[i].addEventListener('click', event => {
        event.preventDefault();
        let entryID = editBtnArray[i].getAttribute('data-value');
        renderView(views.entryEdit);
        fetch('/api/entry/' + entryID, {
          method: 'GET'
        })
          .then(response => {
            if (!response.ok) {
              return Error(response.statusText);
            } else {
              return response.json();
            }
          }).then(data => {
            console.log(data[0].title);
            console.log(data[0].content);
            document.getElementById("edit-title").value = data[0].title;
            document.getElementById("edit-content").value = data[0].content;
            editEntry(entryID);
          })
          .catch(error => {
            console.error(error);
          })


      }) // editBtnArray[i].addEventListner
    }

  }
  /*------------------end of show journal -----------------*/

  /* --------------- Om användare har loggat in? ----------*/
  fetch('/api/ping')
  .then(response => {
    if(response.ok) {
      hideLogin.classList.add('hidden');
      hideRegister.classList.add('hidden');
      showEntriesForm.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');
      renderJournalView();
    }
  });


  /*----------------  Login  ------------*/
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
        return fetch('/entries/userid/{id}')
      }
    }).then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        return response.json();
      }
    })
      .then(data => {
        // Skicka alla inlägg innehåll till showEntry funktion
        showEntry(data);
      })
      .catch(error => {
        console.error(error);
      })
  })


  /*----------------  end of log in ------------*/




  /*----------------- Log out -----------------*/
  logoutBtn.addEventListener('click',() => {
    // event.preventDefault();

    fetch('/api/logout').then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        console.log('logout');
        hideLogin.classList.remove('hidden');
        hideRegister.classList.remove('hidden');
        showEntriesForm.classList.remove('hidden');
        target.classList.add('hidden');
        return response.json();
      }
    })
      .catch(error => {
        console.error(error);
      })
  })


  /*---------------end of Log out -----------------*/





  /*--------------- register --------------------*/
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

  function deleteEntry(entryID) {

    fetch('/api/entry/' + entryID, {
      method: 'DELETE'
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
  }

  /* ------------------- Edit entry ----------------------- */
   

  function editEntry(entryID) {

    const editEntryForm = document.querySelector('#editEntryForm');
    editEntryForm.addEventListener('submit', event => {
      event.preventDefault();
      let formData = new FormData(editEntryForm);
      const formJson = {};
      formData.forEach((value, key) => {formJson[key] = value});
      fetch('/api/entry/' + entryID, {
        method: 'PUT',
        body: JSON.stringify(formJson),
        headers: {
          'Content-Type': 'application/json'
        }
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
    })

  }
}

bindEvents();


