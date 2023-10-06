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
            //const todoId = tagData.id;

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
          const response = await fetch(apiFetcher.base_url, options);
          if (!response.ok) throw json;
          const json = await response.json();
        } else {
          const cardId = formData.get("id");
          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}/todos`,
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

          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}`,
            options
          );
          if (!response.ok) throw json;
          const json = await response.json();
        } else {
          const { cardId } = cardTodoIds;
          const { todoId } = cardTodoIds;

          const response = await fetch(
            `${apiFetcher.base_url}/${cardId}/todos/${todoId}`,
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

  // To Handle the deletion of a card or a todo
  deleteCardOrTodo: async function (e, cardId, todoId) {
    e.preventDefault();

    try {
      const options = {
        method: "DELETE",
      };

      location.reload();
      if (!todoId) {
        const response = await fetch(
          `${apiFetcher.base_url}/${cardId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
      } else {
        const response = await fetch(
          `${apiFetcher.base_url}/${cardId}/todos/${todoId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
