(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var form = document.getElementById("update-signup");
  var status = document.getElementById("signup-status");
  if (!form || !status || !window.fetch) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var submit = form.querySelector("[type=submit]");
    var email = form.querySelector("[name=email]");
    status.textContent = "";
    status.classList.remove("is-ok", "is-error");
    if (email) email.removeAttribute("aria-invalid");
    if (submit) submit.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (response.ok) {
        form.reset();
        status.textContent = "Got it. One email when it ships.";
        status.classList.add("is-ok");
        return;
      }
      return response.json().catch(function () { return {}; }).then(function (data) {
        var message = "Could not sign you up. Please try again.";
        if (data && Array.isArray(data.errors) && data.errors.length) {
          var joined = data.errors.map(function (error) { return error.message; }).filter(Boolean).join(" ");
          if (joined) message = joined;
        }
        status.textContent = message;
        status.classList.add("is-error");
        if (email) email.setAttribute("aria-invalid", "true");
      });
    }).catch(function () {
      status.textContent = "Could not sign you up. Please try again.";
      status.classList.add("is-error");
    }).then(function () {
      if (submit) submit.disabled = false;
    });
  });
})();
