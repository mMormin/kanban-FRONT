export const modal = {
  base_url: "http://localhost:3000/boards/1/cards",

  // Modal Strings
  modalConstants: {
    cardNameEn: "card",
    sufixCardFr: "carte",
    todoNameEn: "todo",
    sufixTodoFr: "tâche",
    inputSufix: "Input",
  },

  // To get the first letter of the string uppercased
  capzFirstLetter: function (value) {
    const upperIt = value.charAt(0).toUpperCase() + value.slice(1);
    return upperIt;
  },

  // New Modal Initialization
  newModalAttributes: function (e, isCard) {
    const data = {
      isCard,
      method: "add",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Ajouter une ",
      placeholderValue: "Ma nouvelle ",
      submitValue: "Créer",
    };

    modal.fillModalWithAttributes(e, data);
  },

  // Edit Modal Initialization
  editModalAttributes: function (e, isCard, cardId, todoId) {
    console.log(isCard);

    const data = {
      isCard,
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

    console.log(data);

    modal.fillModalWithAttributes(e, data);
  },

  // Modals Data Definition
  fillModalWithAttributes: function (e, data) {
    if (data.isCard === true) {
      data.titleValue += modal.modalConstants.sufixCardFr;
      data.placeholderValue += modal.modalConstants.sufixCardFr;
      data.formValue =
        modal.modalConstants.cardNameEn + modal.capzFirstLetter(data.method);
      data.inputValue = data.method + modal.modalConstants.inputSufix;
      data.idValue =
        data.method +
        modal.capzFirstLetter(modal.modalConstants.cardNameEn) +
        "Modal";
    } else {
      data.titleValue += modal.modalConstants.sufixTodoFr;
      data.placeholderValue += modal.modalConstants.sufixTodoFr;
      data.formValue =
        modal.modalConstants.todoNameEn + modal.capzFirstLetter(data.method);
      data.inputValue = data.method + modal.modalConstants.inputSufix;
      data.idValue =
        data.method +
        modal.capzFirstLetter(modal.modalConstants.todoNameEn) +
        "Modal";
      console.log("hello");
    }

    modal.createModal(e, data);
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

    console.log(cardTodoIds);

    form.addEventListener("submit", (ev) =>
      modal.handleFormModalSubmission(ev, isCard, cardTodoIds)
    );
    const closeModalButtons = form.querySelectorAll(".close");
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", modal.hideModal);
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
          const response = await fetch(modal.base_url, options);
          if (!response.ok) throw json;
          const json = await response.json();
        } else {
          const cardId = formData.get("id");
          const response = await fetch(
            `${modal.base_url}/${cardId}/todos`,
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
          const { cardId } = cardTodoIds;

          const response = await fetch(`${modal.base_url}/${cardId}`, options);
          if (!response.ok) throw json;
          const json = await response.json();
        } else {
          const { cardId } = cardTodoIds;
          const { todoId } = cardTodoIds;

          const response = await fetch(
            `${modal.base_url}/${cardId}/todos/${todoId}`,
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

  // Hide all modals
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },
};
