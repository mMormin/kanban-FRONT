export const tagModule = {
  // To Create and Set the tag in the DOM
  makeTag: function (tag, cardId, todoId) {
    const template = document.getElementById("tag");
    const tagsContainer = document.querySelector(
      `[data-card-id="${cardId}"] [data-todo-id="${todoId}"] .tag__container`
    );
    const clone = document.importNode(template.content, true);

    const tagSpan = clone.querySelector(".tag");
    tagSpan.style.backgroundColor = tag.color;

    tagsContainer.insertBefore(clone, tagsContainer.firstChild);
  },

  // TO DO
  associateTagToCard: async function (event) {
    // empêcher le rechargement de la page
    event.preventDefault();
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    try {
      // faire un call API en POST sur /cars/:id/tags pour associer un tag à sa carte
      const response = await fetch(
        `${utilsModule.base_url}/cards/${formData.get("card_id")}/tags`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (!response.ok) throw json;
      // on récupère une carte avec ses tags, il faut donc aller chercher le tag à ajouter dans le DOM
      // attention pour rappel : les données des inputs sont des chaines de caractères !
      const tag = json.tags.find(
        (tag) => tag.id === Number(formData.get("tag_id"))
      );
      // afficher dans le DOM le tag à sa carte
      tagModule.makeTagInDOM(tag);
    } catch (error) {
      alert("Impossible d'associer le tag à la carte");
      console.log(error);
    }
    // dans tous les cas, on ferme la modale
    utilsModule.hideModals();
  },

  deleteTag: async function (event) {
    // on récupère l'id de la carte du label
    const cardId = event.target.closest(".box").dataset.cardId;
    // on récupère l'id du label
    const tagId = event.target.dataset.tagId;
    try {
      // on fait un call API en DELETE sur /cards/:idCard/tags/:idTag pour dissocier le tag de sa carte
      const response = await fetch(
        `${utilsModule.base_url}/cards/${cardId}/tags/${tagId}`,
        {
          method: "DELETE",
        }
      );
      const json = await response.json();
      // si il y a une erreur il ne faut pas poursuivre le code
      if (!response.ok) throw json;
      // on supprime le tag de la carte dans le DOM
      event.target.remove();
    } catch (error) {
      alert("Impossible de supprimer ce tag");
      console.log(error);
    }
  },
};
