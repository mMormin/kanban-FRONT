// Modules Imports
import { modalModule } from "./modules/modal.js";
import { apiFetcher } from "./modules/apiFetcher.js";

const app = {
  isCard: "isCard",
  isTag: "isTag",
  //errorBox: document.querySelector(".error-box"),

  init: function () {
    apiFetcher.fetchAllFromApi();
  
    const newCardButton = document.getElementById("addCardButton");
    const newTagButton = document.getElementById("addTagButton");

    // Event Listener
    newCardButton.addEventListener("click", (e) =>
      modalModule.newModalAttributes(e, app.isCard)
    );

    newTagButton.addEventListener("click", (e) =>
    modalModule.newModalAttributes(e, app.isTag)
  );
  },
};

document.addEventListener("DOMContentLoaded", app.init);
