const views = {
  login: ["#loginFormTemplate", "#registerFormTemplate"],
  entry: ["#entriesFormTemplate", "#lastTwentiethEntriesTemplate"],
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
renderView(views.entry);

const loginForm = document.querySelector("#loginForm");
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
    .catch(error => {
      console.error(error);
    });
});

const registerForm = document.querySelector("#registerForm");
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

// const entriesForm = document.querySelector('#entriesForm');
// entriesForm.addEventListener('submit', event => {
//   event.preventDefault();
//   console.log('Hej');

//   const formData = new FormData(entriesForm);
//   fetch('/api/newentry/user', {
//     method: 'POST',
//     body: formData
//   }).then(response => {
//     if(!response.ok){
//       return Error(response.statusText);
//     } else {
//       return response.json();
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   })
// })

const api = {
  ping() {
    return fetch("/entries/last/5")
      .then(response => {
        return !response.ok ? new Error(response.statusText) : response.json();
      }).then(data => {
        entry(data);
      })
      .catch(error => console.error(error));
  }
};

api.ping();

function entry(v) {
  // Visar en sammanfattning av de 20 senaste inlägg
  let div = document.getElementById("senasteEntries");
  for (let i = 0; i < v.length; i++) {
    let entryID = v[i]["entryID"];
    let str = v[i]["content"];
    div.innerHTML +=
      '<p>' +
      entryID +
      ' ' +
      str.substr(0, 200) +
      '...' +
      '</p><button class="showalltxt-btn">Visa hela inlägg</button>';
  }
  // Visar hela inlägg och kommentarer till den inlägg 
  let arr = document.querySelectorAll('.showalltxt-btn');
  for (let i = 0; i < v.length; i++) {
    arr[i].addEventListener('click', function () {
      div.innerHTML = '<p>' + v[i]["entryID"] + ' ' + v[i]["content"] + '</p>';
      const api2 = {
        ping2() {
          return fetch('/api/comments/entry/'+ v[i]["entryID"])
            .then(response => {
              return !response.ok ? new Error(response.statusText) : response.json();
            }).then(data => {
              entry2(data);
            })
            .catch(error => console.error(error));
        }
      };
      
      api2.ping2();
      
      function entry2(v){
        let div = document.getElementById("entryComments");
        for (let i = 0; i < v.length; i++) {
          let content = v[i]['content'];
          div.innerHTML += '<p>' + ' ' + content + '</p>'
        }
      };
      
      renderView(views.comment);
    });
  }
};




