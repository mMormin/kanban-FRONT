import { apiFetcher } from "./apiFetcher.js";
import { modalModule } from "./modal.js";
import { cardModule } from "./card.js";

export const todoModule = {
  // To Create and Set the todo in the DOM
  createTodo: function (todo, cardId) {
    const template = document.getElementById("todo");
    const todosContainer = document.querySelector(
      `[data-card-id="${cardId}"] .todos-list`
    );
    const todoId = todo.get("id");

    const clone = document.importNode(template.content, true);

    const title = clone.querySelector(".todo__title");
    const todoDiv = clone.querySelector(".box");
    todoDiv.dataset.todoId = todoId;
    title.textContent = todo.get("title");

    // Events Listeners
    clone
      .querySelector(".todo-delete-button")
      .addEventListener("click", (e) =>
        apiFetcher.deleteCardOrTodo(e, cardId, todoId)
      );

    clone
      .querySelector(".todo-edit-button")
      .addEventListener("click", (e) =>
        modalModule.editModalAttributes(e, cardModule.isNotCard, cardId, todoId)
      );

    todosContainer.appendChild(clone);

    const dragAndDropOnTodo = Sortable.create(todosContainer, {
      ghostClass: "ghost-todo",
      chosenClass: "chosen-todo",
      swapClass: "highlight-todo",
      swap: true,
      animation: 300,
    });

    dragAndDropOnTodo.option("onUpdate", function (evt) {
      const movedTodoId = evt.item.dataset.todoId;
      const isMovedTodoId = evt.from.children[evt.oldIndex].dataset.todoId;

      apiFetcher.swapTodosPositions(cardId, movedTodoId, isMovedTodoId);
    });

    modalModule.hideModal();
  },
};
