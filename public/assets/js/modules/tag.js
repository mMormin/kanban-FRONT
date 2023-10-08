export const tagModule = {
  // To Create and Set the tag in the DOM
  createTag: function (tag, cardId, todoId) {
    const template = document.getElementById("tag");
    const tagsContainer = document.querySelector(
      `[data-card-id="${cardId}"] [data-todo-id="${todoId}"] .tag__container`
    );
    const clone = document.importNode(template.content, true);

    const tagSpan = clone.querySelector(".tag");
    tagSpan.style.backgroundColor = tag.color;
    //tagSpan.textContent = tag.name;

    tagsContainer.insertBefore(clone, tagsContainer.firstChild);
  },
};
