const views = {
  login: ["#loginFormTemplate", "#registerFormTemplate"],
  serch: ["#searchFormTemplate"],
  loggedIn: ["#createEntryFormTemplate"],
  entrySuccess: ["#createEntrySuccessTemplate", "#createEntryFormTemplate"],
  entryFail: ["#createEntryFailTemplate", "#createEntryFormTemplate"],
  entryEdit: ["#editEntry"],
  entry: ["#lastTwentyEntriesTemplate"],
  completeEntry: ["#showCompleteEntryTemplate"],
  individualComment: ["#showIndividualCommentAndEntry"],
  comment: ["#entryCommentsTemplates"],
  entryComment: ["#moreentryCommentsTemplates", "#createCommentFormTemplate"],
  editEntryComment: ["#editCommentTemplate"],
  allEntries: ["#createAllEntryTemplate"],
  allUsers: ["#showAllUsersTemplate"]
};

function renderView(view) {
  const target = document.querySelector("main");


  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;

    const div = document.createElement("div");

    div.innerHTML = templateMarkup;

    target.append(div);
  });
}

function lastTwentyEntryrenderView(view) {
  const target = document.querySelector("aside");


  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;

    const div = document.createElement("div");

    div.innerHTML = templateMarkup;

    target.append(div);
  });
}

function showAllUsers(view) {
  const target = document.querySelector("section");

  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;

    const div = document.createElement("div");

    div.innerHTML = templateMarkup;

    target.append(div);
  });
}

function searchView(view) {
  const target = document.querySelector("header");

  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;

    const div = document.createElement("div");

    div.innerHTML = templateMarkup;

    target.append(div);
  });
}
searchView(views.serch);
renderView(views.login);
renderView(views.loggedIn);
lastTwentyEntryrenderView(views.entry);
renderView(views.completeEntry);
showAllUsers(views.allUsers);

const bindEvents = () => {
  const loginForm = document.querySelector("#loginForm");
  const hideLogin = document.querySelector("#hideLoginForm");
  const hideRegister = document.querySelector("#hideRegisterForm");
  const showEntriesForm = document.querySelector("#showEntriesForm");
  const logoutBtn = document.querySelector("#logout");
  const registerForm = document.querySelector("#registerForm");
  const entriesForm = document.querySelector("#entriesForm");
  const senasteEntries = document.querySelector("#senasteEntries");
  const completeEntry = document.querySelector("#completeEntry");
  const showAllEntriesBtn = document.querySelector("#showAllEntriesBtn");
  const hideSearchForm = document.querySelector("#hideSearchForm");
  const showAllUsersBtn = document.querySelector("#showAllUsersBtn");
  const allUserList = document.querySelector("#allUserList");

  /*-----------------Show all users-------------------*/

  showAllUsersBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const api = {
      ping() {
        return fetch("/users")
          .then(respons => {
            return !respons.ok ? new Error(respons.statusText) : respons.json();
          })
          .then(data => {
            registeredUser(data);
          })
          .catch(error => console.error(error));
      }
    };
    api.ping();

    function registeredUser(users) {
      let allUsers = document.getElementById("allUsers");
      users.forEach(element => {
        allUsers.innerHTML += "<p>" + element["username"] + "</p>";
      });
    }
  });

  /*----------- Show journal---------------*/
  function showEntry(entries) {
    const target1 = document.querySelector("article");

    let entryTable = document.createElement("div");

    target1.innerHTML = '';
    entryTable.innerHTML = "";
    entries.forEach(element => {
      entryTable.innerHTML += `
      <div class="container mt-5" id='userEntries'>
      <div class="row">
        <div class=mx-5>${element.createdAt}</div>
        <h3>${element.title}</h3>
      </div>
      <p>${element.content}</p>
      <div class="row justify-content-end">
        <div class="mx-5"><a data-value=${
        element.entryID
        } role="button" class ="deleteBtn btn btn-danger" type="submit"><i class="far fa-trash-alt"></i></a></div>
        <div><button data-value=${
        element.entryID
        } role="button" class ="editBtn btn btn-info">Edit<i class="far fa-edit"></i></button></div>
      </div>
        <div><button data-value=${
        element.entryID
        } role="button" class ="showCommentsBtn btn btn-info">Comment<i class="far fa-comments"></i></button></div>
      </div>
      </div>
    </div>
     `;
    });
    target1.append(entryTable);

    //Show comment knappen
    const showCommentsBtnArray = document.querySelectorAll(".showCommentsBtn");
    for (let i = 0; i < showCommentsBtnArray.length; i++) {
      showCommentsBtnArray[i].addEventListener("click", event => {
        event.preventDefault();
        let entryID = showCommentsBtnArray[i].getAttribute("data-value");
        showEntriesForm.classList.add("hidden");
        entryTable.classList.add("hidden");
        showAllEntriesBtn.classList.add("hidden");
        showUserComment(entryID);
        renderView(views.individualComment);
      });
    }

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
        showEntriesForm.classList.add("hidden");
        entryTable.classList.add("hidden");
        showAllEntriesBtn.classList.add("hidden");
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
            document.getElementById("edit-title").value = data[0].title;
            document.getElementById("edit-content").value = data[0].content;
            editEntry(entryID);
          })
          .catch(error => {
            console.error(error);
          });
      }); // editBtnArray[i].addEventListner
    }

    //Show all users entries


    showAllEntriesBtn.addEventListener('click', event => {
      event.preventDefault();
      showEntriesForm.classList.add("hidden");
      entryTable.classList.add("hidden");
      showAllEntriesBtn.classList.add("hidden");
      renderView(views.allEntries);
      fetch("/api/like") // Hämta all users inlägg, username och likes
        .then(response => {
          return !response.ok
            ? new Error(response.statusText)
            : response.json();
        })
        .then(data => {
          showAllUsersEntries(data);
        })
        .catch(error => console.error(error));
    });
  }
  /*------------------end of show journal -----------------*/

  /*--------------------Twenty entries---------------------*/

  const api = {
    ping() {
      return fetch("/entries/last/20")
        .then(response => {
          return !response.ok
            ? new Error(response.statusText)
            : response.json();
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
          return !response.ok
            ? new Error(response.statusText)
            : response.json();
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
        '</p><button class="showalltxt-btn btn btn-outline-success">Visa hela inlägg</button>';
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

  /*-------------------End twenty entries------------------*/

  /* --------------- Om användare har loggat in? ----------*/
  fetch("/api/ping").then(response => {
    if (response.ok) {
      hideLogin.classList.add("hidden");
      hideRegister.classList.add("hidden");
      senasteEntries.classList.add("hidden");
      showEntriesForm.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      showAllEntriesBtn.classList.remove("hidden");
      hideSearchForm.classList.remove("hidden");
      allUserList.classList.add('hidden');
      showAllUsersBtn.classList.add('hidden')

      const api3 = {
        ping3() {
          return fetch("/api/entries")
            .then(response => {
              return !response.ok
                ? new Error(response.statusText)
                : response.json();
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
          return response.json();
        }
      })
      .then(data => {
        let wrongPassAndUserErrorMsg = document.getElementById(
          "wrongPassAndUserErrorMsg"
        );
        let noRegisteredNameErrorMsg = document.getElementById(
          "noRegisteredNameErrorMsg"
        );
        let wrongPassErrorMsg = document.getElementById("wrongPassErrorMsg");
        wrongPassAndUserErrorMsg.innerHTML = "";
        noRegisteredNameErrorMsg.innerHTML = "";
        wrongPassErrorMsg.innerHTML = "";

        if (data === "Write your password and your name") {
          wrongPassAndUserErrorMsg.innerHTML = data;
        } else if (
          data === "We can not find your name" ||
          data === "Write your name"
        ) {
          noRegisteredNameErrorMsg.innerHTML = data;
        } else if (
          data === "Wrong password" ||
          data === "Write your password"
        ) {
          wrongPassErrorMsg.innerHTML = data;
        } else {
          hideLogin.classList.add("hidden");
          hideRegister.classList.add("hidden");
          senasteEntries.classList.add("hidden");
          showEntriesForm.classList.remove("hidden");
          logoutBtn.classList.remove("hidden");
          showAllEntriesBtn.classList.remove("hidden");
          hideSearchForm.classList.remove("hidden");
          showAllUsersBtn.classList.add('hidden')
          return fetch("/api/entries", {
            method: "GET"
          });
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

    fetch('/api/logout').then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
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
      })
      .then(data => {
        let nameAndPassErrorMsg = document.querySelector(
          "#nameAndPassErrorMsg"
        );
        let alreadyRegisteredErrorMsg = document.querySelector(
          "#alreadyRegisteredErrorMsg"
        );
        let nameErrorMsg = document.querySelector("#nameErrorMsg");
        let passErrorMsg = document.querySelector("#passErrorMsg");
        let successRegister = document.querySelector("#successMsg");

        if (data === "Write your password and your name") {
          alreadyRegisteredErrorMsg.classList.add('hidden');
          nameErrorMsg.classList.add('hidden');
          passErrorMsg.classList.add('hidden');
          nameAndPassErrorMsg.classList.remove('hidden');
        }
        else if (data === "You have already registered") {
          nameAndPassErrorMsg.classList.add('hidden');
          nameErrorMsg.classList.add('hidden');
          passErrorMsg.classList.add('hidden');
          alreadyRegisteredErrorMsg.classList.remove('hidden');
        }
        else if (data === "Write your name") {
          nameAndPassErrorMsg.classList.add('hidden');
          alreadyRegisteredErrorMsg.classList.add('hidden');
          passErrorMsg.classList.add('hidden');
          nameErrorMsg.classList.remove('hidden');
        } else if (data === "Write your password") {
          nameAndPassErrorMsg.classList.add('hidden');
          alreadyRegisteredErrorMsg.classList.add('hidden');
          nameErrorMsg.classList.add('hidden');
          passErrorMsg.classList.remove('hidden');
        } else if (data === "Thank you for your registration") {
          nameAndPassErrorMsg.classList.add('hidden');
          alreadyRegisteredErrorMsg.classList.add('hidden');
          nameErrorMsg.classList.add('hidden');
          passErrorMsg.classList.add('hidden');
          successRegister.classList.remove('hidden');
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
  /*---------------end of register --------------------*/

  /* ------------------- Posta Entries form ------------------*/
  entriesForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(entriesForm);
    fetch("/api/entry", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          return fetch("/api/entries", {
            method: "GET"
          });
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
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
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
          // return response.json();
          return fetch("/api/entries", {
            method: 'GET'
          });
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

  /* ------------------- Show user comment & Entry ----------------------- */

  function showUserComment(entryID) {
    console.log(entryID);
    fetch('/api/entry/' + entryID, {
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
        let target = document.querySelector("#individualComment");
        let entry = document.createElement("div");
        entry.innerHTML = "";
        entry.innerHTML += `
        <div class="my-5 text-center">
        <h3>${data[0].title}</h3>
        </div>
        <div class="my-5"><p>${data[0].content}</p></div>
        `;
        target.append(entry);
        return fetch("/api/comment/user/" + entryID, {
          method: "GET"
        });
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(data => {
        let target = document.querySelector("#individualComment");
        let entry = document.createElement("div");
        if (data.length == 0) {
          entry.innerHTML += "<h4>No comment</h4>";
          target.append(entry);
        } else {
          entry.innerHTML = "<h3>Comment</h3>";
          data.forEach(comment => {
            entry.innerHTML += `
             <div class="container">
             <div class="row justify-content-between my-4 borderbottom">
             <div>${comment.content}</div>
             <div><span class="mx-4">By</span>${comment.username}</div>
             </div>
             </div>
             `;
            target.append(entry);
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* ------------------- End of show user comment & Entry ----------------------- */

  /*---------------------- Show all users entries ------------------*/

  // OBS!!! In this function we get all the entries and the number of likes for evry entry
  // Line nummber 179
  function showAllUsersEntries(entries) {
    let target = document.querySelector('#showAllUsersEntries');
    let entryTable = document.createElement('div');
    entryTable.innerHTML = '';
    target.innerHTML = '';
    // console.log(entries);
    entries.forEach(element => {
      entryTable.innerHTML += `
      <div class="container mt-5" id='userEntries'>
      <div class="row">
        <div class="mx-5">${element.createdAt}</div>
        <h3 class="mx-5">${element.title}</h3>
        <div class="mx-5">${element.username}</div>
      </div>
      <p>${element.content}</p>
      <div class="row justify-content-end">
       
        <button data-value=${
        element.entryID
        } role="button" class ="more btn btn-outline-secondary">Comment<i class="far fa-comments"></i></button></div>
      
        <div><a data-value=${
        element.entryID
        } role="button" class ="likeBtn"><i class="far fa-thumbs-up"></i></a>${
        element.likes
        }</div>
      </div>
      </div>
    </div>

         `;
    });
    target.append(entryTable);

    // show comment form
    let hideBtn = document.querySelector('#hideBtn');
    const moreBtnArray = document.querySelectorAll(".more");
    for (let i = 0; i < moreBtnArray.length; i++) {
      moreBtnArray[i].addEventListener("click", event => {
        event.preventDefault();
        let entryID = moreBtnArray[i].getAttribute("data-value");
        console.log(entryID);
        showEntriesForm.classList.add("hidden");
        entryTable.classList.add("hidden");
        hideBtn.classList.add('hidden');
        renderView(views.entryComment);
        commentMore(entryID); // Visa komment
        commentForm(entryID); // Visa komment form
      });
    }

    const likeBtnArray = document.querySelectorAll(".likeBtn");
    for (let i = 0; i < likeBtnArray.length; i++) {
      likeBtnArray[i].addEventListener("click", event => {
        event.preventDefault();
        let entryID = likeBtnArray[i].getAttribute("data-value");
        // console.log(entryID);
        addLike(entryID);
      });
    }



  }
  /*------------------end of show journal -----------------*/

  /* ------------------- Comments ----------------------- */

  //Hämta komment
  function commentMore(entryID) {
    fetch('/api/comments/users/' + entryID, {
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
      target.innerHTML = '';
      entryMoreComment.innerHTML = '';
      data.forEach(comment => {
        entryMoreComment.innerHTML += `
             <div class="container">
                <div class = "row">
                 <div class="col-4 align-self-center"><p>${comment.content}</p></div>
                 <div class="col-4">
                 <div class="mx-5"><p>By ${comment.username}</p></div>
                 <div class="mx-5"><p>${comment.createdAt}</p></div>
                 </div>
                 <div class="col-4 align-self-center">
                 <div class="row">
                   <div class="row"><button data-value=${comment.commentID} class ="deleteCommentBtn btn btn-danger mx-5">Delete</button></div>
                   <div class="row"><button data-value=${comment.commentID} class ="editCommentBtn btn btn-info">Edit</button></div>
                </div>
                </div>
                </div>
             
             </div>
          `;
      })
      target.append(entryMoreComment); //Visa kommenterar på skärmen


      const deleteCommentBtnArray = document.querySelectorAll('.deleteCommentBtn');
      for (let i = 0; i < deleteCommentBtnArray.length; i++) {
        deleteCommentBtnArray[i].addEventListener('click', event => {
          event.preventDefault();

          let commentID = deleteCommentBtnArray[i].getAttribute('data-value');
          deleteComment(commentID); // SKicka den specifika commentID till deleteComment funktion
          commentMore(entryID);
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
            console.log(data);
            console.log(data.content);
            document.getElementById("editCommentContent").value = data.content; // Visa comment som skrev innan på textarea
            let editCommentBtn = document.getElementById('editCommentForm');
            editCommentBtn.addEventListener('submit', event => {
              event.preventDefault();

              const formData = new FormData(editCommentBtn);
              const formJson = {};
              formData.forEach((value, key) => {
                formJson[key] = value
              });
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
                  hideCommentForm.classList.remove('hidden');
                  document.getElementById("editCommentContent").value = '';
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
      });
  }

  window.commentMore = commentMore;

  // Visa komment form och skriva kommentera
  function commentForm(entryID) {
    const commentForm = document.querySelector("#commentForm");
    commentForm.addEventListener("submit", event => {
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
          return response.json();
        }
      }).catch(error => {
        console.error(error);
      });
      document.getElementById('content').value = '';
      commentMore(entryID);
    });
  }

  // Ta bort sina kommentarer
  function deleteComment(commentID) {
    console.log(commentID);
    fetch("/api/comment/" + commentID, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          /* console.log('GET'); */
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

  // Add like to an entry

  function addLike(entryID) {

    fetch('/api/like/' + entryID, {
      method: 'POST'
    }).then(response => {
      if (!response.ok) {
        return Error(response.statusText);
      } else {
        // console.log('I like you!');
        return fetch('/api/like', {
          method: 'GET'
        })
      }
    }).then(response => {
      return !response.ok ?
        new Error(response.statusText) :
        response.json();
    })
      .then(data => {
        showAllUsersEntries(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* -------------Search-------------- */

  document.querySelector(".searchBtn").addEventListener("click", event => {
    event.preventDefault();
    let searchWord = document.getElementById("search").value;
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
        target.innerHTML = '';
        target.append(searchEntry);
        return searchEntry.innerHTML = 'Type something in the search bar!!!';

      } else {
        return response.json();
      }
    }).then(data => {
      // console.log(data) // skriver ut objekt som innehåller searches
      if (data.length == 0) {
        let target = document.getElementById("searchFormDiv");
        let searchEntry = document.createElement('div');
        target.innerHTML = '';
        target.append(searchEntry);
        return searchEntry.innerHTML = 'Sorry, no results found for ' + searchWord + ".";
      } else {


        let target = document.getElementById("searchFormDiv");
        let searchEntry = document.createElement('div');
        searchEntry.innerHTML = '';
        target.innerHTML = '';
        data.forEach(element => {
          /* console.log(element); */
          searchEntry.innerHTML += '<p>' + ' ' + element.title + '</p>' + '<p>' + ' ' + element.title + '</p>';
        })
        target.append(searchEntry); //Visa kommenterar på skärmen
      }

    })

  }
};
bindEvents();
