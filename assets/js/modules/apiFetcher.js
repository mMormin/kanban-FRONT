import { modalModule } from "./modal.js";
import { cardModule } from "./card.js";
import { todoModule } from "./todo.js";
import { tagModule } from "./tag.js";

export const apiFetcher = {
  base_url: "http://localhost:3000/boards/1/cards",

  // To Get all the cards and todos
  fetchAllFromApi: async function () {
    try {
      const response = await fetch(apiFetcher.base_url);
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

        cardModule.createCard(cardData);

        card.todos.forEach((todo) => {
          const todoData = new FormData();

          for (const key in todo) {
            todoData.append(key, todo[key]);
          }

          const cardId = todoData.get("card_id");
          const todoId = todoData.get("id");

          todoModule.createTodo(todoData, cardId);

          todo.tags.forEach((tagData) => {
            tagModule.createTag(tagData, cardId, todoId);
          });
        });
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // To Handle the submission of a new card or todo
  submitCardOrTodoForm: async function (e, isCard, cardTodoIds) {
    e.preventDefault();

    const form = e.target;
    let options = {};
    const formData = new FormData(form);
    const title = formData.get("title");

    try {
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
          const response = await fetch(apiFetcher.base_url, options);
          const json = await response.json();
          if (!response.ok) throw json;

          cardModule.createCard(formData);
        } else {
          const cardId = formData.get("id");

          console.log(cardId);

          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}/todos`,
            options
          );
          if (!response.ok) throw json;
          const json = await response.json();

          todoModule.createTodo(formData, cardId);
        }
      } else {
        const { cardId } = cardTodoIds;
        const cardInDom = document.querySelector(`[data-card-id="${cardId}"]`);
        const titleCard = cardInDom.querySelector("h2");
        const todoInDom = document.querySelector(`[data-todo-id="${todoId}"]`);
        const nameTodo = todoInDom.querySelector(".todo__title");

        options = {
          method: "PATCH",
          body: formData,
        };

        if (isCard === true) {
          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}`,
            options
          );
          const json = await response.json();
          if (!response.ok) throw json;

          titleCard.textContent = json.title;
        } else {
          const { todoId } = cardTodoIds;
          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}/todos/${todoId}`,
            options
            );
            const json = await response.json();
            if (!response.ok) throw json;

            nameTodo.textContent = json.title;
          }
          modalModule.hideModal();
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // To Handle the deletion of a card or a todo
  deleteCardOrTodo: async function (e, cardId, todoId) {
    e.preventDefault();
    const cardInDom = document.querySelector(`[data-card-id="${cardId}"]`);
    const todoInDom = document.querySelector(`[data-todo-id="${todoId}"]`);
    
    const options = {
      method: "DELETE",
    };

    try {
      if (!todoId) {
        cardInDom.remove();
        modalModule.hideModal();

        const response = await fetch(
          `${apiFetcher.base_url}/${cardId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
      } else {
        todoInDom.remove();
        modalModule.hideModal();

        const response = await fetch(
          `${apiFetcher.base_url}/${cardId}/todos/${todoId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
        alert("Impossible de supprimer cette carte...");
      }
    } catch (error) {
      console.log(error);
    }
  },

  // To swap the position between two given cards Id
  swapCardsPositions: async function (movedCardId, isMovedCardId) {
    try {
      const cardOptions = {
        method: "PATCH",
      };
      const response = await fetch(
        `${apiFetcher.base_url}/${movedCardId}?swapped_card=${isMovedCardId}`,
        cardOptions
      );
      const json = await response.json();
      if (!response.ok) throw json;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // To swap the position between two given todos Id in one cardId
  swapTodosPositions: async function (cardId, movedTodoId, isMovedTodoId) {
    try {
      const todoOptions = {
        method: "PATCH",
      };
      const response = await fetch(
        `${apiFetcher.base_url}/${cardId}/todos/${movedTodoId}?swapped_todo=${isMovedTodoId}`,
        todoOptions
      );
      const json = await response.json();
      if (!response.ok) throw json;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
