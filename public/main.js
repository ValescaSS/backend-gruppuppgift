const views = {
    login: ["#loginFormTemplate", "#registerFormTemplate", "#searchFormTemplate"],
  loginFail: [
    "#loginFailTemplate",
    "#loginFormTemplate",
    "#registerFormTemplate"
  ],
  registerSuccess: [
    "#registerSuccessTemplate",
    "#loginFormTemplate",
    "#registerFormTemplate"
  ],
  loggedIn: ["#createEntryFormTemplate"],
  entrySuccess: ["#createEntrySuccessTemplate", "#createEntryFormTemplate"],
  entryFail: ["#createEntryFailTemplate", "#createEntryFormTemplate"],
  entryEdit: ["#editEntry"],
  entry: ["#lastTwentyEntriesTemplate"],
  completeEntry: ["#showCompleteEntryTemplate"],
  comment: ["#entryCommentsTemplates"]
};

function renderView(view) {
  const target = document.querySelector("main");

  // Rensa innehållet eftersom innehållet bara växer om vi kör flera renderView()
  // target.innerHTML = '';

  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;

    const div = document.createElement("div");

    div.innerHTML = templateMarkup;

    target.append(div);
  });
}

renderView(views.login);
renderView(views.loggedIn);
renderView(views.entry);
renderView(views.completeEntry);
// renderView(views.entrySuccess);

const bindEvents = () => {
  const loginForm = document.querySelector("#loginForm");
  const hideLogin = document.querySelector("#hideLoginForm");
  const hideRegister = document.querySelector("#hideRegisterForm");
  const showEntriesForm = document.querySelector("#showEntriesForm");
  const logoutBtn = document.querySelector("#logout");
  // const entrySuccess = document.querySelector("#createEntrySuccessTemplate")
  const createEntryFormTemplate = document.getElementById(
    "createEntryFormTemplate"
  );
  const registerForm = document.querySelector("#registerForm");
  const entriesForm = document.querySelector("#entriesForm");
  const senasteEntries = document.querySelector("#senasteEntries");
  const completeEntry = document.querySelector("#completeEntry");
  // const entryComments = document.querySelector("#entryComments");





  /*----------- Show journal---------------*/
  function showEntry(entries) {
    const target1 = document.querySelector("main");
    let tableDiv = document.createElement("table");

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

    target1.append(tableDiv);

    let target2 = document.querySelector("table");
    let entryTable = document.createElement("tbody");

    entryTable.innerHTML = "";
    entries.forEach(element => {
      entryTable.innerHTML += `<tr>
           <td>${element.createdAt}</td>
           <td>${element.title}</td>
           <td>${element.content}</td>
             <td><a href="" data-value=${
               element.entryID
             } role="button" class ="deleteBtn" type="submit">DELETE</a></td>
             <td><button data-value=${
               element.entryID
             } role="button" class ="editBtn">Edit</button></td>
             </tr>
         `;
    });
    target2.append(entryTable);

    // Delete knappen
    const deleteBtnArray = document.querySelectorAll(".deleteBtn");
    for (let i = 0; i < deleteBtnArray.length; i++) {
      deleteBtnArray[i].addEventListener("click", event => {
        // event.preventDefault();
        let entryID = deleteBtnArray[i].getAttribute("data-value");

        deleteEntry(entryID);
      });
    }

    //Edit knappen
    const editBtnArray = document.querySelectorAll(".editBtn");
    for (let i = 0; i < editBtnArray.length; i++) {
      editBtnArray[i].addEventListener("click", event => {
        event.preventDefault();
        let entryID = editBtnArray[i].getAttribute("data-value");
        renderView(views.entryEdit);
        fetch("/api/entry/" + entryID, {
            method: "GET"
          })
          .then(response => {
            if (!response.ok) {
              return Error(response.statusText);
            } else {
              return response.json();
            }
          })
          .then(data => {
            console.log(data[0].title);
            console.log(data[0].content);
            document.getElementById("edit-title").value = data[0].title;
            document.getElementById("edit-content").value = data[0].content;
            editEntry(entryID);
          })
          .catch(error => {
            console.error(error);
          });
      }); // editBtnArray[i].addEventListner
    }
  }
  /*------------------end of show journal -----------------*/

  /*--------------------Twenty entries---------------------*/

  const api = {
    ping() {
      return fetch("/entries/last/20")
        .then(response => {
          return !response.ok ?
            new Error(response.statusText) :
            response.json();
        })
        .then(data => {
          twentyEntries(data);
        })
        .catch(error => console.error(error));
    }
  };

  api.ping();

  const api2 = {
    ping2(x) {
      return fetch("/api/comments/entry/" + x)
        .then(response => {
          return !response.ok ?
            new Error(response.statusText) :
            response.json();
        })
        .then(data => {
          commentsToSelectedEntry(data);
        })
        .catch(error => console.error(error));
    }
  };

  function twentyEntries(v) {
    // Visar en sammanfattning av de 20 senaste inlägg
    for (let i = 0; i < v.length; i++) {
      let entryID = v[i]["entryID"];
      let str = v[i]["content"];
      senasteEntries.innerHTML +=
        "<p>" +
        entryID +
        " " +
        str.substr(0, 200) +
        "..." +
        '</p><button class="showalltxt-btn">Visa hela inlägg</button>';
    }
    showCompleteEntry(v);
  }

  // Visar hela inlägg
  function showCompleteEntry(v) {
    let showalltxt = document.querySelectorAll(".showalltxt-btn");

    for (let i = 0; i < v.length; i++) {
      showalltxt[i].addEventListener("click", function () {
        senasteEntries.classList.add("hidden");
        hideLogin.classList.add("hidden");
        hideRegister.classList.add("hidden");
        completeEntry.innerHTML =
          "<h2>" +
          v[i]["title"] +
          "</h2><p>" +
          v[i]["entryID"] +
          " " +
          v[i]["content"] +
          "</p>";

        api2.ping2(v[i]["entryID"]);
      });
    }
  }

  // Visar kommentarer till ett inlägg
  function commentsToSelectedEntry(v) {
    renderView(views.comment);
    let entryComments = document.getElementById("entryComments");
    for (let i = 0; i < v.length; i++) {
      let content = v[i]["content"];
      entryComments.innerHTML += "<p>" + " " + content + "</p>";
    }
  }

  /*--------------------------------------------------------------------------*/

  /* --------------- Om användare har loggat in? ----------*/
  fetch("/api/ping").then(response => {
    if (response.ok) {
      hideLogin.classList.add("hidden");
      hideRegister.classList.add("hidden");
      senasteEntries.classList.add("hidden");
      showEntriesForm.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");

      const api3 = {
        ping3() {
          return fetch("/api/entries")
            .then(response => {
              return !response.ok ?
                new Error(response.statusText) :
                response.json();
            })
            .then(data => {
              showEntry(data);
            })
            .catch(error => console.error(error));
        }
      };
      api3.ping3();
    }
  });

  /*----------------  Login  ------------*/
  loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    fetch("/api/login", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          hideLogin.classList.add("hidden");
          hideRegister.classList.add("hidden");
          senasteEntries.classList.add("hidden");
          // completeEntry.classList.add("hidden");
          // entryComments.classList.add("hidden");
          showEntriesForm.classList.remove("hidden");
          logoutBtn.classList.remove("hidden");

          // renderJournalView();
          return fetch("/api/entries");
        }
      })
      .then(response => {
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
      });
  });

  /*----------------  end of log in ------------*/

  /*----------------- Log out -----------------*/
  logoutBtn.addEventListener("click", () => {
    // event.preventDefault();
    // localStorage.removeItem("entriesdata");

    fetch('/api/logout').then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          console.log('logout');
          hideLogin.classList.remove('hidden');
          hideRegister.classList.remove('hidden');
          showEntriesForm.classList.add('hidden');
          target.classList.add('hidden');
          return response.json();
        }
      })
      .catch(error => {
        console.error(error);
      });
  });

  /*---------------end of Log out -----------------*/

  /*--------------- register --------------------*/
  registerForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(registerForm);


    fetch("/api/register", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          return response.json();
        }
      }).then(data => {
        const nameAndPassErrorMsg = document.getElementById('nameAndPassErrorMsg');
        const nameErrorMsg = document.getElementById('nameErrorMsg');
        const passErrorMsg = document.getElementById('passErrorMsg');
        nameAndPassErrorMsg.innerHTML = '';
        nameErrorMsg.innerHTML = '';
        passErrorMsg.innerHTML = '';

        if (data === 'Write your password and your name' || data === 'You have already registered') {
          nameAndPassErrorMsg.innerHTML = data;
        } else if (data === 'Write your name') {
          nameErrorMsg.innerHTML = data;
        } else if (data === 'Write your password') {
          passErrorMsg.innerHTML = data;
        } else if (data === 'User registred') {
          nameAndPassErrorMsg.innerHTML = 'Thank you for your registration!';

        }
      })
      .catch(error => {
        console.error(error);
      });
  });
  /*---------------end of register --------------------*/

  /* ------------------- Posta Entries form ------------------*/
  entriesForm.addEventListener("submit", event => {
    // event.preventDefault();
    console.log("clicked");

    const formData = new FormData(entriesForm);
    fetch("/api/entry", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(data); //Skrivit inlägg!
        showEntry();
      })
      .catch(error => {
        console.error(error);
      });
  });

  /* -------------------end of Entries form ------------------*/

  /* ------------------- Delete entry ----------------------- */

  function deleteEntry(entryID) {
    fetch("/api/entry/" + entryID, {
        method: "DELETE"
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  /* ------------------- Edit entry ----------------------- */

  function editEntry(entryID) {
    const editEntryForm = document.querySelector("#editEntryForm");
    editEntryForm.addEventListener("submit", event => {
      // event.preventDefault();
      let formData = new FormData(editEntryForm);
      const formJson = {};
      formData.forEach((value, key) => {
        formJson[key] = value;
      });
      fetch("/api/entry/" + entryID, {
          method: "PUT",
          body: JSON.stringify(formJson),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (!response.ok) {
            return Error(response.statusText);
          } else {
            return response.json();
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    });
  }












  /* ------------------- Comments ----------------------- */



  //Hämta komment 
//   function commentMore(entryID) {
//     fetch('/api/comments/' + entryID, {
//         method: 'GET'
//       }).then(response => {
//         if (!response.ok) {
//           return Error(response.statusText);
//         } else {
//           return response.json();
//         }
//       }).then(data => {
//         console.log(data) // skriver ut objekt som innehåller komenterar
//         let target = document.getElementById("moreentryComments");
//         let entryMoreComment = document.createElement('div');
//         entryMoreComment.innerHTML = '';
//         data.forEach(comment => {
//           // console.log(comment.commentID);
//           // console.log(comment.content);
//           entryMoreComment.innerHTML += '<p>' + ' ' + comment.content + '</p>' + `<button data-value=${comment.commentID} class ="deleteCommentBtn">Delete</button>` + `<button data-value=${comment.commentID} class ="editCommentBtn">Edit</button>`;
//         })
//         target.append(entryMoreComment); //Visa kommenterar på skärmen
//         const deleteCommentBtnArray = document.querySelectorAll('.deleteCommentBtn');
//         for (let i = 0; i < deleteCommentBtnArray.length; i++) {
//           deleteCommentBtnArray[i].addEventListener('click', event => {
//             event.preventDefault();
//             let commentID = deleteCommentBtnArray[i].getAttribute('data-value');
//             // console.log(commentID); // Hämta commentID
//             deleteComment(commentID); // SKicka den specifika commentID till deleteComment funktion
//           })
//         }
//         const editCommentBtnArray = document.querySelectorAll('.editCommentBtn');
//         for (let i = 0; i < editCommentBtnArray.length; i++) {
//           editCommentBtnArray[i].addEventListener('click', event => {
//             event.preventDefault();
//             let hideCommentForm = document.getElementById('commentForm'); //Dölja comment form
//             hideCommentForm.classList.add('hidden');
//             renderView(views.editEntryComment); // Visa edit comment form
//             let commentID = editCommentBtnArray[i].getAttribute('data-value');
//             console.log(commentID); // Hämta commentID
//             // Först hämta den specifika komment för att kunna visa på textarea 
//             // Och sedan skicka Edit comment
//             fetch('/api/comment/' + commentID, {
//               method: 'GET'
//             }).then(response => {
//               if (!response.ok) {
//                 return Error(response.statusText);
//               } else {
//                 return response.json();
//               }
//             }).then(data => {
//               console.log(data.content);
//               document.getElementById("editCommentContent").value = data.content; // Visa comment som skrev innan på textarea
//               let editCommentBtn = document.getElementById('editCommentForm');
//               editCommentBtn.addEventListener('submit', event => {
//                 event.preventDefault();
//                 const formData = new FormData(editCommentBtn);
//                 const formJson = {};
//                 formData.forEach((value, key) => {
//                   formJson[key] = value
//                 });
//                 fetch('/api/comment/' + commentID, {
//                   method: 'PUT',
//                   body: JSON.stringify(formJson),
//                   headers: {
//                     'Content-Type': 'application/json'
//                   }
//                 }).then(response => {
//                   if (!response.ok) {
//                     return Error(response.statusText);
//                   } else {
//                     editCommentBtn.classList.add('hidden');
//                     hideEntriesForm.classList.remove('hidden');
//                     return commentMore(entryID);
//                   }
//                 })
//               })
//             })
//           })
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       })
//   }

//   // Visa komment form
//   function commentForm(entryID) {
//     const commentForm = document.querySelector('#commentForm');
//     commentForm.addEventListener('submit', event => {
//       event.preventDefault();
//       /* alert('Hej'); */
//       const formData = new FormData(commentForm);
//       fetch('/api/comment/' + entryID, {
//           method: 'POST',
//           body: formData
//         }).then(response => {
//           if (!response.ok) {
//             return Error(response.statusText);
//           } else {
//             /* console.log('skrivit!'); */
//             return response.json();
//           }
//         }).then(data => {
//           console.log(data);
//         })
//         .catch(error => {
//           console.error(error);
//         })
//     })

//   }

//   // Ta bort sina kommentarer
//   function deleteComment(commentID) {

//     fetch('/api/comment/' + commentID, {
//         method: 'DELETE'
//       }).then(response => {
//         if (!response.ok) {
//           return Error(response.statusText);
//         } else {
//           /* console.log('GET'); */
//           return response.json();

//         }
//       }).then(data => {
//         console.log(data);
//       })
//       .catch(error => {
//         console.error(error);
//       })
//   }
};

bindEvents();



/* -------------Search-------------- */

document.querySelector('.searchBtn').addEventListener('click', event=>{

  event.preventDefault()
  let searchWord = document.getElementById('search').value;
  /* console.log(searchWord); */
  
   search(searchWord);

});


function search(searchWord) {
    fetch('/api/search/' + searchWord, {
        method: 'GET'
    }).then(response => {
        if (!response.ok) {
            // return Error(response.statusText);
          let target = document.getElementById("searchFormDiv");
          let searchEntry = document.createElement('div'); 
          target.append(searchEntry);
          return searchEntry.innerHTML = 'Type something in the search bar!!!';
            
        } else {
            return response.json();
        }
    }).then(data => {
        /* console.log(data) */ // skriver ut objekt som innehåller searches
        if (data.length == 0){
          let target = document.getElementById("searchFormDiv");
          let searchEntry = document.createElement('div');
          target.append(searchEntry);
          return searchEntry.innerHTML = 'Sorry, no results found for ' + searchWord +".";
        }else{

          
          let target = document.getElementById("searchFormDiv");
            let searchEntry = document.createElement('div');
            searchEntry.innerHTML = '';
            data.forEach(element => {
              /* console.log(element.entryID); */
              
              let entryID = element.entryID

              // console.log(entryID);

              fetch("/api/entry/" + entryID, {
                method: "GET"
              })
                .then(response => {
                  if (!response.ok) {
                    return Error(response.statusText);
                  } else {
                    return response.json();
                  }
                })
                .then(data => {
                   console.log(data);
                  // console.log(data[0].title);
                  
                  searchEntry.innerHTML += '<p>' + ' ' + element.title + '</p>' + '<p>' + ' ' + element.content + '</p>' ;





                })
                .catch(error => {
                  console.error(error);
                });
            















            // searchEntry.innerHTML += '<p>' + ' ' + element.title + '</p>' + '<p>' + ' ' + element.title + '</p>' ;
            })
          target.append(searchEntry); //Visa kommenterar på skärmen
        }

      })

    }
  