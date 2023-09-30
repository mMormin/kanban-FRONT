var app = {
  // Global variables
  cardModal: document.getElementById("addCardModal"),
  todoModal: document.getElementById("addTodoModal"),
  cardForm: document.getElementById("cardAdd"),
  todoForm: document.getElementById("todoAdd"),

  // Executed functions after initialization
  init: function () {
    const newCardButton = document.getElementById("addCardButton");
    const closeModalButtons = document.querySelectorAll(".close");

    // Globals events listeners
    newCardButton.addEventListener("click", app.showModalCard);
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", app.hideModal);
    });
    app.todoForm.addEventListener("submit", app.handleNewTodo);
    app.cardForm.addEventListener("submit", app.handleNewCard);

    // Reset inputs function call
    app.resetInputs();
  },

  // Resets all modals inputs values by the placeholders
  resetInputs: function () {
    const cardInput = app.cardForm.querySelector("input");
    const todoInput = app.todoForm.querySelector("input");
    cardInput.value = cardInput.placeholder;
    todoInput.value = todoInput.placeholder;
  },

  // Show Card modal
  showModalCard: function () {
    app.cardModal.classList.add("is-active");
  },

  // Show Todo modal
  showModalTodo: function (e) {
    const idInput = document.getElementById("todoId");

    // data-card-id's value of HTML .panel element
    const cardId = e.target.closest(".panel").dataset.cardId;

    idInput.value = cardId;

    app.todoModal.classList.add("is-active");
  },

  // Hide all opened modal
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },

  // Getting the new card form's data on submission
  handleNewCard: function (e) {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(app.cardForm));
    const { input_value } = formData;

    if (!input_value) {
      alert("Impossible de créer une carte sans nom !");
      return;
    }

    app.makeCard(input_value);
  },

  // Getting the new todo form's datas on submission
  handleNewTodo: function (e) {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(app.todoForm));
    const { input_value, id } = formData;

    if (!input_value) {
      alert("Impossible de créer une todo sans nom !");
      return;
    } else if (!id) {
      throw new Error("Cannot get the card_id");
    }

    app.makeTodo(input_value, id);
  },

  // Creating and adding the card to the DOM
  makeCard: function (inputValue) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");
    const clone = document.importNode(template.content, true);

    clone
      .getElementById("addTodoButton")
      .addEventListener("click", app.showModalTodo);

    const title = clone.querySelector("h2");
    title.textContent = inputValue;

    cardsContainer.appendChild(clone);
    app.hideModal();
    app.resetInputs();
  },

  // Creating and adding the todo to the DOM
  makeTodo: function (inputValue, cardId) {
    const template = document.getElementById("todo");
    const todosContainer = document.querySelector(
      `[data-list-id="${cardId}"] .todos-list`
    );

    const clone = document.importNode(template.content, true);
    const title = clone.querySelector(".todo__title");
    title.textContent = inputValue;

    todosContainer.appendChild(clone);
    app.hideModal();
    app.resetInputs();
  },
};

document.addEventListener("DOMContentLoaded", app.init);
