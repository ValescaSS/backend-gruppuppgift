const views = {
  login: ["#loginFormTemplate", "#registerFormTemplate"],
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

    // Visar hela inlägg och kommentarer till den inlägg
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

        const api2 = {
          ping2() {
            return fetch("/api/comments/entry/" + v[i]["entryID"])
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

        api2.ping2();

        // Visar kommentarer till en inlägg
        function commentsToSelectedEntry(v) {
          let entryComments = document.getElementById("entryComments");
          for (let i = 0; i < v.length; i++) {
            let content = v[i]["content"];
            entryComments.innerHTML += "<p>" + " " + content + "</p>";
          }
        }
        renderView(views.comment);
      });
    }
  }

  /*--------------------------------------------------------------------------*/

  /* --------------- Om användare har loggat in? ----------*/
  fetch("/api/ping").then(response => {
    if (response.ok) {
      hideLogin.classList.add("hidden");
      hideRegister.classList.add("hidden");
      // senasteEntries.classList.add("hidden");
      showEntriesForm.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      // let entriesdata = JSON.parse(localStorage.getItem("entriesdata"));
      // console.log(entriesdata[0].createdBy);

      // renderJournalView();

      const api3 = {
        ping3() {
          return fetch('/entries/userid/{id}')
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
          // senasteEntries.classList.add("hidden");
          // completeEntry.classList.add("hidden");
          // entryComments.classList.add("hidden");
          showEntriesForm.classList.remove("hidden");
          logoutBtn.classList.remove("hidden");

          // renderJournalView();
          return fetch("/entries/userid/{id}");
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
        // localStorage.setItem("entriesdata", JSON.stringify(data));
      })
      .catch(error => {
        console.error(error);
      });
  });

  /*----------------  end of log in ------------*/

  /*----------------- Log out -----------------*/
  logoutBtn.addEventListener("click", () => {
    // event.preventDefault();
    localStorage.removeItem("entriesdata");

    fetch("/api/logout")
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          console.log("logout");
          hideLogin.classList.remove("hidden");
          hideRegister.classList.remove("hidden");
          showEntriesForm.classList.remove("hidden");
          target.classList.add("hidden");
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
    console.log("Hej");

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
      .catch(error => {
        console.error(error);
      });
  });
  /*---------------end of register --------------------*/

  /* ------------------- Entries form ------------------*/
  entriesForm.addEventListener("submit", event => {
    // event.preventDefault();
    console.log("clicked");

    const formData = new FormData(entriesForm);
    fetch("/api/entry/{id}", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return Error(response.statusText);
        } else {
          console.log("skrivit!");
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
};

bindEvents();