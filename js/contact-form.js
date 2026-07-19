(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("contact-form-status");

  if (!form || !status) {
    return;
  }

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.remove("text-muted", "text-success", "text-danger");
    status.classList.add(type === "success" ? "text-success" : type === "error" ? "text-danger" : "text-muted");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var submitButton = form.querySelector('button[type="submit"]');
    var originalButtonText = submitButton ? submitButton.innerHTML : "";
    var payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim()
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setStatus("Please complete all fields before sending.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    }
    setStatus("Sending your message...", "muted");

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().catch(function () {
          return {};
        }).then(function (body) {
          if (!response.ok || !body.ok) {
            throw new Error(body.error || "Message could not be sent right now.");
          }
          return body;
        });
      })
      .then(function (body) {
        setStatus(body.message || "Thanks, your message was sent.", "success");
        form.reset();
      })
      .catch(function (error) {
        setStatus(error.message || "Message could not be sent right now.", "error");
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      });
  });
})();
