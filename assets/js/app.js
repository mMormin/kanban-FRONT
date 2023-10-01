var app = {
  // Global variables
  modal: document.querySelector(".modal"),
  cardForm: document.getElementById("cardAdd"),
  todoForm: document.getElementById("todoAdd"),

  // Executed functions after initialization
  init: function () {
    const newCardButton = document.getElementById("addCardButton");


    // Globals events listeners
    newCardButton.addEventListener("click", app.makeModal);


  },

  makeModal: function (e) {
    const { id } = e.target;
    const template = document.getElementById("modal");
    const section = document.querySelector(".section");
    const clone = document.importNode(template.content, true);
    
    // Clone Variables
    const title = clone.querySelector(".modal-card-title");
    const form = clone.querySelector("form");
    const label = clone.querySelector(".label");
    const input = clone.querySelector(".input");
    const modal = clone.querySelector(".modal");

    // Clone Strings
    let modalId = "";
    let formValue = "Add";
    let titleValue = "Ajouter une ";
    let placeholderValue = "Nom de la nouvelle ";
    let idValue = "Input";

    // Clone Seeding
    if (id === "addCardButton") {
      const nameEn = "card";
      const nameFr = "carte";
      
      modalId = "addCardModal";
      titleValue = titleValue + nameFr;
      formValue = nameEn + formValue;
      idValue = nameEn + idValue;
      placeholderValue = placeholderValue + nameFr;

      form.addEventListener("submit", app.handleNewCard);

    } else {
      const nameEn = "todo";
      const nameFr = "tâche";
      const idInput = document.getElementById("todoId");
      const cardId = e.target.closest(".panel").dataset.cardId;
      
      modalId = "addTodoModal";
      titleValue = titleValue + nameFr;
      formValue = nameEn + formValue;
      idValue = nameEn + idValue;
      placeholderValue = placeholderValue + nameFr;;

      // data-card-id's value of HTML .panel element
      idInput.value = cardId;

      form.addEventListener("submit", app.handleNewTodo);
    }

    // Seeding
    modal.setAttribute("id", modalId);
    form.setAttribute("id", formValue);
    title.textContent = titleValue;
    label.setAttribute("for", idValue);
    input.setAttribute("id", idValue);
    input.setAttribute("placeholder", placeholderValue);

    // Show modal
    modal.classList.add("is-active");

    // Append modal after section div
    section.parentNode.insertBefore(clone, section.nextSibling);

    const closeModalButtons = document.querySelectorAll(".close");

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", app.hideModal);
    });

    //section.appendChild(clone);
    //app.showModal();
  },

  // Resets all modals inputs values by the placeholders
  resetInputs: function () {
    const cardInput = app.cardForm.querySelector("input");
    const todoInput = app.todoForm.querySelector("input");
    cardInput.value = cardInput.placeholder;
    todoInput.value = todoInput.placeholder;
  },

  // Show Card modal
  showModal: function () {
    app.modal.classList.add("is-active");
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
      .addEventListener("click", app.makeModal);

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
