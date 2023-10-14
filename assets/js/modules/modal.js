import { apiFetcher } from "./apiFetcher.js";

export const modalModule = {
  // Constants Strings
  constants: {
    cardNameEn: "card",
    sufixCardFr: "carte",
    todoNameEn: "todo",
    sufixTodoFr: "tâche",
    tagNameEn: "tag",
    sufixTagFr: "catégorie",
    inputSufix: "Input",
  },

  // To Capitalize the first letter of the given string
  capzFirstLetter: function (value) {
    const upperIt = value.charAt(0).toUpperCase() + value.slice(1);
    return upperIt;
  },

  // To Initialize the New modal Attributes
  newModalAttributes: async function (e, dataType) {
    let data = {
      type: dataType,
      method: "add",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Ajouter une ",
      placeholderValue: "Ma nouvelle ",
      submitValue: "Créer",
    };

    if (dataType === isTodo || dataType === isTag) {
      try {
        const tags = await apiFetcher.getAllTags();
        data.tags = tags;
      } catch (error) {
        data.tags = null;
      }
    }

    modalModule.fillModalWithAttributes(e, data);
  },

  // To Initialize the Edit modal Attributes
  editModalAttributes: async function (e, dataType, cardId, todoId) {
    let data = {
      type: dataType,
      method: "edit",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Editer une ",
      placeholderValue: "edit",
      submitValue: "Editer",
      ids: {
        cardId,
        todoId,
      },
    };

    if (dataType === isTodo) {
      try {
        const tags = await apiFetcher.getTagsByTodo(
          data.ids.cardId,
          data.ids.todoId
        );

        data.tags = tags;
      } catch (error) {
        data.tags = null;
      }
    }

    modalModule.fillModalWithAttributes(e, data);
  },

  // To Fill the Modal with the Attributes
  fillModalWithAttributes: function (e, data) {
    if (data.type === "isCard") {
      data.titleValue += modalModule.constants.sufixCardFr;
      data.placeholderValue += modalModule.constants.sufixCardFr;
      data.formValue =
        modalModule.constants.cardNameEn +
        modalModule.capzFirstLetter(data.method);
      data.inputValue = data.method + modalModule.constants.inputSufix;
      data.idValue =
        data.method +
        modalModule.capzFirstLetter(modalModule.constants.cardNameEn) +
        "Modal";
    } else if (data.type === "isTodo") {
      data.titleValue += modalModule.constants.sufixTodoFr;
      data.placeholderValue += modalModule.constants.sufixTodoFr;
      data.formValue =
        modalModule.constants.todoNameEn +
        modalModule.capzFirstLetter(data.method);
      data.inputValue = data.method + modalModule.constants.inputSufix;
      data.idValue =
        data.method +
        modalModule.capzFirstLetter(modalModule.constants.todoNameEn) +
        "Modal";
    } else if (data.type === "isTag") {
      data.titleValue += modalModule.constants.sufixTagFr;
      data.placeholderValue += modalModule.constants.sufixTagFr;
      data.formValue =
        modalModule.constants.tagNameEn +
        modalModule.capzFirstLetter(data.method);
      data.inputValue = data.method + modalModule.constants.inputSufix;
      data.idValue =
        data.method +
        modalModule.capzFirstLetter(modalModule.constants.tagNameEn) +
        "Modal";
    }

    modalModule.createModal(e, data);
  },

  // To Create and Set the new Modal in the DOM
  createModal: async function (e, data) {
    const { type } = data;
    const { ids } = data;
    const template = document.getElementById("modal");
    const section = document.querySelector(".section");

    // Clone Selection
    const clone = document.importNode(template.content, true);

    // Clone Elements
    const form = clone.querySelector("form");
    const title = clone.querySelector(".modal-card-title");
    const label = clone.querySelector(".label");
    const tagsLabel = clone.querySelector(".label__tags");
    const input = clone.querySelector(".input");
    const modal = clone.querySelector(".modal");
    const submit = clone.querySelector(".is-success");
    const idInput = clone.querySelector(".input-card-id");
    const deleteCardButton = clone.querySelector(".card-delete-button");
    const tagsDiv = clone.querySelector(".tags");
    const modalBackground = clone.querySelector(".modal-background");

    const closeModalButtons = form.querySelectorAll(".close");

    // Defaults Values
    modal.setAttribute("id", data.idValue);
    form.setAttribute("id", data.formValue);
    title.textContent = data.titleValue;
    label.setAttribute("for", data.inputValue);
    input.setAttribute("id", data.inputValue);
    input.setAttribute("placeholder", data.placeholderValue);
    input.value = input.placeholder;
    submit.textContent = data.submitValue;

    // Default Events Listeners
    // On Submit
    if (data.method === "add") {
      form.addEventListener("submit", (e) =>
        apiFetcher.submitAddFormData(e, type, ids)
      );
    } else {
      form.addEventListener("submit", (e) =>
        apiFetcher.submitEditFormData(e, type, ids)
      );
    }
    // On Click
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", modalModule.hideModal);
    });
    modalBackground.addEventListener("click", modalModule.hideModal);
    // On Keypress
    document.addEventListener("keyup", function (e) {
      if (e.key == "Escape") {
        modalModule.hideModal();
      }
    });

    // Specifics Values and Events Listeners
    if (data.type === "isTodo") {
      const { tags } = data;
      const { cardId } = e.target.closest(".card").dataset;
      idInput.value = cardId;

      if (!tags) {
        tagsDiv.parentNode.classList.add("is-hidden");
      } else {
        if (data.method === "add") {
          tags.forEach((tag) => {
            const select = clone.querySelector("select");
            const liOption = document.createElement("option");
            liOption.textContent = tag.name;

            select.appendChild(liOption);
          });

          tagsDiv.nextSibling.nextSibling.classList.remove("is-hidden");
          tagsDiv.parentNode.classList.remove("is-hidden");

          tagsLabel.textContent =
            modalModule.capzFirstLetter(modalModule.constants.sufixTagFr) +
            "(s)";
        } else if (data.method === "edit") {
          tags.forEach((tag) => {
            const li = document.createElement("li");
            li.classList.add("tag--big");
            li.style.backgroundColor = tag.color;
            if (li.style.backgroundColor === "yellow") {
              li.classList.toggle("tag--big-variant");
            }
            li.textContent = tag.name;

            tagsDiv.appendChild(li);
          });

          tagsDiv.parentNode.classList.remove("is-hidden");
          tagsLabel.textContent = "Associé au(x) catégorie(s) :";
        }
      }
    } else if (data.type === "isTag") {
      const { tags } = data;

      if (!tags) {
        tagsDiv.textContent = "Aucune catégorie trouvée.";
      } else {
        tags.forEach((tag) => {
          const li = document.createElement("li");

          li.classList.add("tag--big");
          li.style.backgroundColor = tag.color;
          if (li.style.backgroundColor === "yellow") {
            li.classList.toggle("tag--big-variant");
          }
          li.textContent = tag.name;
          tagsDiv.appendChild(li);
        });

        tagsDiv.classList.remove("is-hidden");
        tagsDiv.parentNode.classList.remove("is-hidden");
        tagsLabel.textContent = "Catégories ajoutées :";
      }
    } else if (data.type === "isCard" && data.method === "edit") {
      const { cardId } = e.target.closest(".card").dataset;

      deleteCardButton.classList.remove("is-hidden");

      deleteCardButton.addEventListener("click", (ev) =>
        apiFetcher.deleteCardOrTodo(ev, cardId)
      );
    }

    // Modal Show
    modal.classList.add("is-active");
    // Inserting the modal into the DOM
    section.parentNode.insertBefore(clone, section.nextSibling);
  },

  // To Hide all modals
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },
};
