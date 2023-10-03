var app = {
  base_url: "http://localhost:3000/boards/1/cards",
  errorBox: document.querySelector(".error-box"),

  // Modal Strings
  modalConstants: {
    cardNameEn: "card",
    sufixCardFr: "carte",
    todoNameEn: "todo",
    sufixTodoFr: "tâche",
    inputSufix: "Input",
  },

  // Executed functions after initialization
  init: function () {
    app.getData();

    const isCard = true;
    const newCardButton = document.getElementById("addCardButton");

    newCardButton.addEventListener("click", (e) => app.makeNewModal(e, isCard));
  },

  upperFirstLetter: function (value) {
    const upperIt = value.charAt(0).toUpperCase() + value.slice(1);
    return upperIt;
  },

  // Get all the cards and todos
  getData: async function () {
    try {
      const response = await fetch(app.base_url);
      const json = await response.json();
      if (!response.ok) throw json;

      json.forEach((card) => {
        if (!card) {
          errorBox.classList.remove("is-hidden");
        }

        const cardData = new FormData();

        for (const key in card) {
          cardData.append(key, card[key]);
        }

        app.createCard(cardData);

        card.todos.forEach((todo) => {
          const todoData = new FormData();

          for (const key in todo) {
            todoData.append(key, todo[key]);
          }

          const cardId = todoData.get("card_id");

          app.createTodo(todoData, cardId);
        });
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // New Modal Definition
  makeNewModal: function (e, isCard) {
    let data = {
      isCard,
      method: "add",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Ajouter une ",
      placeholderValue: "Ma nouvelle ",
      submitValue: "Créer",
    };

    // Modal Data Definition
    if (isCard === true) {
      data.titleValue += app.modalConstants.sufixCardFr;
      data.placeholderValue += app.modalConstants.sufixCardFr;
      data.formValue =
        app.modalConstants.cardNameEn + app.upperFirstLetter(data.method);
      data.inputValue = data.method + app.modalConstants.inputSufix;
      data.idValue =
        data.method +
        app.upperFirstLetter(app.modalConstants.cardNameEn) +
        "Modal";
    } else {
      data.titleValue += app.modalConstants.sufixTodoFr;
      data.placeholderValue += app.modalConstants.sufixTodoFr;
      data.formValue =
        app.modalConstants.todoNameEn + app.upperFirstLetter(data.method);
      data.inputValue = data.method + app.modalConstants.inputSufix;
      data.idValue =
        data.method +
        app.upperFirstLetter(app.modalConstants.todoNameEn) +
        "Modal";
    }

    app.createModal(e, data);
  },

  // EDIT Todo Modal Initialization
  makeEditTodoModal: function (e, cardId, todoId) {
    let data = {
      isCard: false,
      method: "edit",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Editer une ",
      submitValue: "Editer",
      placeholderValue: "edit",
      cardTodoIds: {
        cardId,
        todoId,
      },
    };

    data.titleValue += app.modalConstants.sufixTodoFr;
    data.placeholderValue += app.modalConstants.sufixTodoFr;
    data.formValue =
      app.modalConstants.todoNameEn + app.upperFirstLetter(data.method);
    data.inputValue = data.method + app.modalConstants.inputSufix;
    data.idValue =
      data.method +
      app.upperFirstLetter(app.modalConstants.todoNameEn) +
      "Modal";

    app.createModal(e, data);
  },

  // Creating and adding the wanted modal to the DOM
  createModal: function (e, data) {
    const template = document.getElementById("modal");
    const section = document.querySelector(".section");

    // Clone selection
    const clone = document.importNode(template.content, true);

    // Clone Variables
    const form = clone.querySelector("form");
    const title = clone.querySelector(".modal-card-title");
    const label = clone.querySelector(".label");
    const input = clone.querySelector(".input");
    const modal = clone.querySelector(".modal");
    const submit = clone.querySelector(".is-success");

    // Clone Values setting
    modal.setAttribute("id", data.idValue);
    form.setAttribute("id", data.formValue);
    title.textContent = data.titleValue;
    label.setAttribute("for", data.inputValue);
    input.setAttribute("id", data.inputValue);
    input.setAttribute("placeholder", data.placeholderValue);
    input.value = input.placeholder;
    submit.textContent = data.submitValue;

    // Getting cardId with data-card-id's value of HTML .panel element
    if (!data.isCard) {
      const idInput = clone.getElementById("todoId");
      const cardId = e.target.closest(".panel").dataset.cardId;
      idInput.value = cardId;
    }

    // Show Modal with class add
    modal.classList.add("is-active");

    // Insertion of the Modal clone after section div
    section.parentNode.insertBefore(clone, section.nextSibling);

    // Events listeners
    const { isCard } = data;
    const { cardTodoIds } = data;

    form.addEventListener("submit", (ev) =>
      app.handleFormModalSubmission(ev, isCard, cardTodoIds)
    );
    const closeModalButtons = form.querySelectorAll(".close");
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", app.hideModal);
    });
  },

  // Getting the new card form's data on submission
  handleFormModalSubmission: async function (e, isCard, cardTodoIds) {
    e.preventDefault();

    try {
      const form = e.target;
      let options = {};
      const formData = new FormData(form);
      const title = formData.get("title");

      if (!title) {
        alert(
          `Impossible de publier une ${isCard ? "carte" : "todo"} sans nom !`
        );
        return;
      }

      if (!cardTodoIds) {
        options = {
          method: "POST",
          body: formData,
        };

        if (isCard === true) {
          const response = await fetch(app.base_url, options);
          if (!response.ok) throw json;
          const json = await response.json();
        } else {
          const cardId = formData.get("id");
          const response = await fetch(
            `${app.base_url}/${cardId}/todos`,
            options
          );

          if (!response.ok) throw json;

          const json = await response.json();
        }
      } else {
        formData.delete("id");
        options = {
          method: "PATCH",
          body: formData,
        };

        if (isCard === true) {
          // const response = await fetch(app.base_url, options);
          // if (!response.ok) throw json;
          // const json = await response.json();
          console.log("C'est une carte");
        } else {
          const { cardId } = cardTodoIds;
          const { todoId } = cardTodoIds;

          const response = await fetch(
            `${app.base_url}/${cardId}/todos/${todoId}`,
            options
          );

          if (!response.ok) throw json;

          const json = await response.json();
        }
      }

      location.reload();
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // Hide all opened modal
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },

  // Creating and adding the card to the DOM
  createCard: function (cardData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");
    const isCard = false;

    const clone = document.importNode(template.content, true);

    clone
      .getElementById("addTodoButton")
      .addEventListener("click", (e) => app.makeNewModal(e, isCard));

    const title = clone.querySelector("h2");
    const cardId = clone.querySelector(".panel");

    cardId.dataset.cardId = cardData.get("id");
    title.textContent = cardData.get("title");

    cardsContainer.appendChild(clone);
    app.hideModal();
  },

  // Creating and adding the todo to the DOM
  createTodo: function (todo, cardId) {
    const template = document.getElementById("todo");
    const todosContainer = document.querySelector(
      `[data-card-id="${cardId}"] .todos-list`
    );

    const clone = document.importNode(template.content, true);

    const title = clone.querySelector(".todo__title");
    const todoDiv = clone.querySelector(".box");
    const todoId = todo.get("id");
    todoDiv.dataset.todoId = todoId;
    title.textContent = todo.get("title");

    clone
      .querySelector(".todo-delete")
      .addEventListener("click", (e) =>
        app.handleDeleteTodo(e, cardId, todoId)
      );

    clone
      .querySelector(".todo-edit")
      .addEventListener("click", (e) =>
        app.makeEditTodoModal(e, cardId, todoId)
      );

    todosContainer.appendChild(clone);
    app.hideModal();
  },

  handleEditTodo: async function (e, cardId, todoId) {
    e.preventDefault();
    try {
      const options = {
        method: "UPDATE",
      };

      const response = await fetch(
        `${app.base_url}/${cardId}/todos/${todoId}`,
        options
      );

      location.reload();
      const json = await response.json();
      if (!response.ok) throw json;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  handleDeleteTodo: async function (e, cardId, todoId) {
    e.preventDefault();
    try {
      const options = {
        method: "DELETE",
      };

      const response = await fetch(
        `${app.base_url}/${cardId}/todos/${todoId}`,
        options
      );

      location.reload();
      const json = await response.json();
      if (!response.ok) throw json;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};

document.addEventListener("DOMContentLoaded", app.init);
