import { modalModule } from "./modal.js";
import { cardModule } from "./card.js";
import { todoModule } from "./todo.js";
import { tagModule } from "./tag.js";

export const apiFetcher = {
  base_url: "http://localhost:3000",

  // To Get all the cards and todos
  fetchAllFromApi: async function () {
    try {
      const response = await fetch(`${apiFetcher.base_url}/boards/1/cards`);
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

        cardModule.makeCard(cardData);

        card.todos.forEach((todo) => {
          const todoData = new FormData();

          for (const key in todo) {
            todoData.append(key, todo[key]);
          }

          const cardId = todoData.get("card_id");
          const todoId = todoData.get("id");

          todoModule.makeTodo(todoData, cardId);

          todo.tags.forEach((tagData) => {
            tagModule.makeTag(tagData, cardId, todoId);
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  getAllTags: async function () {
    try {
      const response = await fetch(`${apiFetcher.base_url}/tags`);
      const json = await response.json();
      if (!response.ok) throw json;
      
      return json;
    } catch (error) {
      console.log(error);
    }
  },

  getTagsByTodo: async function (cardId, todoId) {
    try {
      const response = await fetch(`${apiFetcher.base_url}/board/1/cards/${cardId}/todos/${todoId}/tags`);
      const json = await response.json();
      if (!response.ok) throw json;
      
      return json;
    } catch (error) {
      console.log(error);
    }
  },

  // To Handle the submission of a new card, todo or tag
  submitAddFormData: async function (e, dataType) {
    e.preventDefault();

    const form = e.target;
    const options = {
      method: "POST",
      body: formData,
    };
    const formData = new FormData(form);
    const title = formData.get("title");

    try {
      if (!title) {
        alert(`Impossible de publier sans nom !`);
        return;
      }

      if (dataType === "isCard") {
        const response = await fetch(
          `${apiFetcher.base_url}/boards/1/cards`,
          options
        );
        const json = await response.json();
        if (!response.ok) throw json;

        cardModule.makeCard(formData);
      } else if (dataType === "isTodo") {
        const cardId = formData.get("id");

        const response = await fetch(
          `${apiFetcher.base_url}/boards/1/cards/${cardId}/todos`,
          options
        );
        if (!response.ok) throw json;
        const json = await response.json();

        todoModule.makeTodo(formData, cardId);
      } 
      // else if (dataType === "isTag") {
      //   const response = await fetch(`${apiFetcher.base_url}/tags`, options);
      //   const json = await response.json();
      //   if (!response.ok) throw json;
      // }

      return modalModule.hideModal();
    } catch (error) {
      console.log(error);
      alert("L'ajout n'est pas possible.");
    }
  },

  // To Handle the edition of a card, todo or tag
  submitEditFormData: async function (e, dataType, ids) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const { cardId } = ids;
    const options = {
      method: "PATCH",
      body: formData,
    };

    if (!title) {
      alert(`Impossible de publier sans nom !`);
      return;
    }

    try {
      if (dataType === "isCard") {
        console.log(cardId);

        const cardInDom = document.querySelector(`[data-card-id="${cardId}"]`);
        const titleCard = cardInDom.querySelector("h2");

        const response = await fetch(
          `${apiFetcher.base_url}/${cardId}`,
          options
        );
        const json = await response.json();
        if (!response.ok) throw json;

        titleCard.textContent = json.title;
      } else if (dataType === "isTodo") {
        const { cardId } = ids;
        const { todoId } = ids;
        const todoInDom = document.querySelector(`[data-todo-id="${todoId}"]`);
        const nameTodo = todoInDom.querySelector(".todo__title");

        const response = await fetch(
          `${apiFetcher.base_url}/boards/1/cards/${cardId}/todos/${todoId}`,
          options
        );
        const json = await response.json();
        if (!response.ok) throw json;

        nameTodo.textContent = json.title;
      } else if (dataType === "isTag") {
        const { tagId } = ids;
        const response = await fetch(
          `${apiFetcher.base_url}/tags/${tagId}`,
          options
        );
        const json = await response.json();
        if (!response.ok) throw json;
      }

      return modalModule.hideModal();
    } catch (error) {
      console.log(error);
      alert("L'édition n'est pas possible.");
    }
  },

  // To Handle the deletion of a card, todo or tag
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
          `${apiFetcher.base_url}/boards/1/cards/${cardId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
      } else {
        todoInDom.remove();
        modalModule.hideModal();

        const response = await fetch(
          `${apiFetcher.base_url}/boards/1/cards${cardId}/todos/${todoId}`,
          options
        );

        const json = await response.json();
        if (!response.ok) throw json;
      }
    } catch (error) {
      console.log(error);
      alert("La suppression n'est pas possible.");
    }
  },

  // To swap the position between two given cards Id
  swapCardsPositions: async function (movedCardId, isMovedCardId) {
    try {
      const cardOptions = {
        method: "PATCH",
      };
      const response = await fetch(
        `${apiFetcher.base_url}/boards/1/cards/${movedCardId}?swapped_card=${isMovedCardId}`,
        cardOptions
      );
      const json = await response.json();
      if (!response.ok) throw json;
    } catch (error) {
      console.log(error);
    }
  },

  // To swap the position between two given todos Id in one cardId
  swapTodosPositions: async function (cardId, movedTodoId, isMovedTodoId) {
    try {
      const todoOptions = {
        method: "PATCH",
      };
      const response = await fetch(
        `${apiFetcher.base_url}/boards/1/cards/${cardId}/todos/${movedTodoId}?swapped_todo=${isMovedTodoId}`,
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
