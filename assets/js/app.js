var app = {
  // Modal
  modal: document.getElementById("addListModal"),

  // Init Function
  init: function () {
    app.listeners();
  },

  // Events listener Function
  listeners: function () {
    const newCardButton = document.getElementById("addListButton");
    const closeModalButtons = document.querySelectorAll(".close");
    const validFormButton = document.querySelector(".input");

    newCardButton.addEventListener("click", app.showModal);

    for (let i = 0; i < closeModalButtons.length; i++) {
      closeModalButtons[i].addEventListener("click", app.hideModal);
    }

    validFormButton.addEventListener("submit", app.hundleFormSubmit);
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

    const formData = new FormData(form);

    for (let data of formData) {
      let name = data[0];
      let value = data[1];

      formData.append(name, value);
    }

    app.makeDomCard(formData);
  },

  // Make a card in the DOM Function
  makeDomCard: function () {},
};

document.addEventListener("DOMContentLoaded", app.init);
