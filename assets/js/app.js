var app = {
  // Global variables
  modal: document.getElementById("addListModal"),
  form: document.getElementById("cardAdd"),

  // Init Function
  init: function () {
    app.listeners();
  },

  // Events listener Function
  listeners: function () {
    const newCardButton = document.getElementById("addListButton");
    const closeModalButtons = document.querySelectorAll(".close");

    newCardButton.addEventListener("click", app.showModal);

    for (let i = 0; i < closeModalButtons.length; i++) {
      closeModalButtons[i].addEventListener("click", app.hideModal);
    }

    app.form.addEventListener("submit", app.hundleFormSubmit);
  },

  // Show modal Function
  showModal: function () {
    app.modal.classList.add("is-active");
  },

  // Hide modal Function
  hideModal: function () {
    app.modal.classList.remove("is-active");
  },

  // Hundle form submission Function
  hundleFormSubmit: function (e) {
    e.preventDefault();

    const formData = new FormData(app.form);

    if (!formData.get("name")) {
      alert("Impossible de créer une carte sans nom !")
      return;
    }

    app.makeDomCard(formData);
  },

  // Make a card in the DOM Function
  makeDomCard: function (formData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".card-lists");
    const input = app.form.querySelector("input");

    const clone = document.importNode(template.content, true);
    const title = clone.querySelector("h2");
    title.textContent = formData.get("name");

    cardsContainer.appendChild(clone);
    app.hideModal();
    input.value = "";
  },
};

document.addEventListener("DOMContentLoaded", app.init);
