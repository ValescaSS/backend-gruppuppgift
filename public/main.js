const views = {
  login: ["#loginFormTemplate", "#registerFormTemplate"],
  entry: ["#entriesFormTemplate", "#lastTwentiethEntriesTemplate"]
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
  entriesLast() {
    return fetch("/entries/last/5")
      .then(response => {
        return !response.ok ? new Error(response.statusText) : response.json();
      })
      .catch(error => console.error(error));
  }
};
let data = api.entriesLast();

let p = Promise.resolve(data);

p.then(function(v) {
  let div = document.getElementById("senasteEntries");
  for (let i = 0; i < v.length; i++) {
    let entryID = v[i]["entryID"];
    let str = v[i]["content"];
    div.innerHTML +=
      '<p>' +
      entryID +
      ' ' +
      str.substr(0, 150) +
      '</p><button class="showalltxt-btn">Läss hela inlägg</button>';
  }

  let arr = document.querySelectorAll('.showalltxt-btn');
  for (let i = 0; i < v.length; i++) {
    arr[i].addEventListener('click', function(){
      div.innerHTML = '<p>' + v[i]["entryID"] + ' ' + v[i]["content"] + '</p>';
    });
  }
});

