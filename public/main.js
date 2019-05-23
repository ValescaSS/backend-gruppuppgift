
const views = {
  login: ['#loginFormTemplate', '#registerFormTemplate'],
  loginFail: ['#loginFailTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  registerSuccess: ['#registerSuccessTemplate', '#loginFormTemplate', '#registerFormTemplate'],
  loggedIn: ['#createEntryFormTemplate'],
  entryComment: ['#moreentryCommentsTemplates', '#createCommentFormTemplate'],
  editEntryComment: ['#editCommentTemplate'],
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


function showEntry(entries) {
  let target = document.querySelector('table');
  let entryTable = document.createElement('tbody');
  entryTable.innerHTML = '';
  entries.forEach(element => {
    entryTable.innerHTML += `<tr>
           <td>${element.createdAt}</td>
           <td>${element.title}</td>
           <td>${element.content}</td>
             <td><a data-value=${element.entryID} role="button" class ="deleteBtn">DELETE</a></td>
             <td><a data-value=${element.entryID} role="button" class ="more">More</a></td>
             </tr>
         `;
  });
  target.append(entryTable);

  const deleteBtnArray = document.querySelectorAll('.deleteBtn');
  for (let i = 0; i < deleteBtnArray.length; i++) {

    deleteBtnArray[i].addEventListener('click', event => {
      event.preventDefault();
      let entryID = deleteBtnArray[i].getAttribute('data-value');

      deleteEntry(entryID);
    })
  }


  const moreBtnArray = document.querySelectorAll('.more');
  for (let i = 0; i < moreBtnArray.length; i++) {

    moreBtnArray[i].addEventListener('click', event => {
      event.preventDefault();
      let entryID = moreBtnArray[i].getAttribute('data-value');

      /* console.log(entryID); */
      const hideEntriesForm = document.querySelector('#hideEntriesForm');
      hideEntriesForm.classList.add('hidden');
      const hideTable = document.querySelector('table');
      hideTable.classList.add('hidden');
      renderView(views.entryComment);
      commentMore(entryID); // Visa komment
      commentForm(entryID); // Visa komment form

    })
  }
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
      //Hämta alla inlägg
      return fetch('/entries/userid/{id}')
    })
    .then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(data => {
      showEntry(data);

    })
    .catch(error => {
      console.error(error);
    })
})
/*----------------  end of log in ------------*/




/*----------------- Log out -----------------*/
logoutBtn.addEventListener('click', event => {
  event.preventDefault();

  fetch('/api/logout').then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      console.log('logout');
      hideLogin.classList.remove('hidden');
      hideRegister.classList.remove('hidden');
      showEntriesForm.classList.add('hidden');
      return response.json();
    }
  })
    .catch(error => {
      console.error(error);
    })
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
// const deleteBtnArray = document.querySelectorAll('.deleteBtn');
// deleteBtnArray[i].addEventListener('click', event =>{
//   event.preventDefault();

function deleteEntry(entryID) {

  const formData = new FormData(deleteEntry);
  fetch('/api/entry/' + entryID, {
    method: 'DELETE',
    body: formData
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      console.log('GET');
      return response.json();
    }
  }).then(data => {
    console.log(data);
  })
    .catch(error => {
      console.error(error);
    })
}


/* ------------------- Comments ----------------------- */



//Hämta komment 
function commentMore(entryID) {
  fetch('/api/comments/' + entryID, {
    method: 'GET'
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      return response.json();
    }
  }).then(data => {
    console.log(data) // skriver ut objekt som innehåller komenterar
    let target = document.getElementById("moreentryComments");
    let entryMoreComment = document.createElement('div');
    entryMoreComment.innerHTML = '';
    data.forEach(comment => {
      // console.log(comment.commentID);
      // console.log(comment.content);
      entryMoreComment.innerHTML += '<p>' + ' ' + comment.content + '</p>' + `<button data-value=${comment.commentID} class ="deleteCommentBtn">Delete</button>` + `<button data-value=${comment.commentID} class ="editCommentBtn">Edit</button>`;
    })
    target.append(entryMoreComment); //Visa kommenterar på skärmen
    const deleteCommentBtnArray = document.querySelectorAll('.deleteCommentBtn');
    for (let i = 0; i < deleteCommentBtnArray.length; i++) {
      deleteCommentBtnArray[i].addEventListener('click', event => {
        event.preventDefault();
        let commentID = deleteCommentBtnArray[i].getAttribute('data-value');
        // console.log(commentID); // Hämta commentID
        deleteComment(commentID); // SKicka den specifika commentID till deleteComment funktion
      })
    }
    const editCommentBtnArray = document.querySelectorAll('.editCommentBtn');
    for (let i = 0; i < editCommentBtnArray.length; i++) {
      editCommentBtnArray[i].addEventListener('click', event => {
        event.preventDefault();
        let hideCommentForm = document.getElementById('commentForm'); //Dölja comment form
        hideCommentForm.classList.add('hidden');
        renderView(views.editEntryComment); // Visa edit comment form
        let commentID = editCommentBtnArray[i].getAttribute('data-value');
        console.log(commentID); // Hämta commentID
        // Först hämta den specifika komment för att kunna visa på textarea 
        // Och sedan skicka Edit comment
        fetch('/api/comment/' + commentID, {
          method: 'GET'
        }).then(response => {
          if (!response.ok) {
            return Error(response.statusText);
          } else {
            return response.json();
          }
        }).then(data => {
          console.log(data.content);
          document.getElementById("editCommentContent").value = data.content;  // Visa comment som skrev innan på textarea
          let editCommentBtn = document.getElementById('editCommentForm');
          editCommentBtn.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(editCommentBtn);
            const formJson = {};
            formData.forEach((value, key) => { formJson[key] = value });
            fetch('/api/comment/' + commentID, {
              method: 'PUT',
              body: JSON.stringify(formJson),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(response => {
              if (!response.ok) {
                return Error(response.statusText);
              } else {
                editCommentBtn.classList.add('hidden');
                hideEntriesForm.classList.remove('hidden');
                return commentMore(entryID);
              }
            })
          })
        })
      })
    }
  })
    .catch(error => {
      console.error(error);
    })
}

// Visa komment form
function commentForm(entryID) {
  const commentForm = document.querySelector('#commentForm');
  commentForm.addEventListener('submit', event => {
    event.preventDefault();
    /* alert('Hej'); */
    const formData = new FormData(commentForm);
    fetch('/api/comment/' + entryID, {
      method: 'POST',
      body: formData
    }).then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        /* console.log('skrivit!'); */
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

// Ta bort sina kommentarer
function deleteComment(commentID) {

  fetch('/api/comment/' + commentID, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      return Error(response.statusText);
    } else {
      /* console.log('GET'); */
      return response.json();

    }
  }).then(data => {
    console.log(data);
  })
    .catch(error => {
      console.error(error);
    })
}