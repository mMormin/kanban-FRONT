var app = {
  // Global variables
  cardModal: document.getElementById("addCardModal"),
  todoModal: document.getElementById("addTodoModal"),
  cardForm: document.getElementById("cardAdd"),
  todoForm: document.getElementById("todoAdd"),

  // Init Function
  init: function () {
    const input = app.form.querySelector("input");
    app.listeners();
    input.value = "Nouvelle carte";
  },

  // Events listener Function
  listeners: function () {
    const newCardButton = document.getElementById("addCardButton");
    const newTodoButton = document.getElementById("addTodoButton");
    const closeModalButtons = document.querySelectorAll(".close");

    newCardButton.addEventListener("click", app.cardModalShow);
    for (let i = 0; i < closeModalButtons.length; i++) {
      closeModalButtons[i].addEventListener("click", app.hideModal);
    }

    newTodoButton.addEventListener("click", app.todoModalShow);

    app.cardForm.addEventListener("submit", app.hundleCardSubmit);
    app.todoForm.addEventListener("submit", app.hundleTodoSubmit);
  },

  // Show card modal Function
  cardModalShow: function () {
    app.cardModal.classList.add("is-active");
  },

  // Show todo modal Function
  todoModalShow: function () {
    app.todoModal.classList.add("is-active");
  },

  // Hide card modal Function
  modalHide: function () {
    const modal = document.querySelector(".modal");
    modal.classList.remove("is-active");
  },

  // Hundle form submission Function
  hundleCardSubmit: function (e) {
    e.preventDefault();

    const formData = new FormData(app.cardForm);

    if (!formData.get("name")) {
      alert("Impossible de créer une carte sans nom !");
      return;
    }

    app.makeCard(formData);
  },

  hundleTodoSubmit: function (e) {
    e.preventDefault();

    const formData = new FormData(app.todoForm);

    if (!formData.get("name")) {
      alert("Impossible de créer une carte sans nom !");
      return;
    }

    app.makeTodo(formData);
  },

  // Make a card in the DOM Function
  makeCard: function (formData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-lists");
    const input = app.form.querySelector("input");

    // Card clone append
    const clone = document.importNode(template.content, true);
    const title = clone.querySelector("h2");
    title.textContent = formData.get("name");

    cardsContainer.appendChild(clone);
    app.hideModal();
    input.value = "Nouvelle carte";
  },

  // Make a todo in the DOM Function
  makeTodo: function () {
    const template = document.getElementById("todo");
    const todosContainer = document.querySelector(".todos-list");
    const input = app.form.querySelector("input");

    // Todo clone append
    const clone = document.importNode(template.content, true);
    const title = clone.querySelector("h2");
    title.textContent = formData.get("name");

    todosContainer.appendChild(clone);
    app.hideModal();
    input.value = "Nouveau todo";
  },
};

document.addEventListener("DOMContentLoaded", app.init);
