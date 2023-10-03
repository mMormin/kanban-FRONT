export const modal = {
  // Card Modal Initialization
  makeCard: function (e) {
    const nameEn = "card";
    const nameFr = "carte";
    const isCard = true;
    app.createModal(e, nameEn, nameFr, isCard);
  },

  // Todo Modal Initialization
  makeTodo: function (e) {
    const nameEn = "todo";
    const nameFr = "tâche";
    const isCard = false;
    app.createModal(e, nameEn, nameFr, isCard);
  },

  // Creating and adding the wanted modal to the DOM
  createModal: function (e, nameEn, nameFr, isCard) {
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

    // Clone Values definiton
    const modalIdValue = isCard
      ? app.modalConstants.cardModalIdValue
      : app.modalConstants.cardTodoIdValue;
    const titleValue = `${app.modalConstants.titlePrefix}${nameFr}`;
    const formIdValue = `${nameEn}${app.modalConstants.formSufix}`;
    const inputIdValue = `${nameEn}${app.modalConstants.inputSufix}`;
    const placeholderValue = `${app.modalConstants.placeholderPrefix}${nameFr}`;

    // Clone Values setting
    modal.setAttribute("id", modalIdValue);
    form.setAttribute("id", formIdValue);
    title.textContent = titleValue;
    label.setAttribute("for", inputIdValue);
    input.setAttribute("id", inputIdValue);
    input.setAttribute("placeholder", placeholderValue);
    input.value = input.placeholder;

    // Getting cardId with data-card-id's value of HTML .panel element
    if (!isCard) {
      const idInput = clone.getElementById("todoId");
      const cardId = e.target.closest(".panel").dataset.cardId;
      idInput.value = cardId;
    }

    // Show Modal with class add
    modal.classList.add("is-active");

    // Insertion of the Modal clone after section div
    section.parentNode.insertBefore(clone, section.nextSibling);

    // Events listeners
    form.addEventListener("submit", (e) =>
      app.handleFormModalSubmission(e, isCard)
    );
    const closeModalButtons = document.querySelectorAll(".close");
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", app.hideModal);
    });
  },
};
