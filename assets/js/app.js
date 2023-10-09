// Modules Imports
import { modalModule } from "./modules/modal.js";
import { apiFetcher } from "./modules/apiFetcher.js";

const app = {
  isCard: true,
  //errorBox: document.querySelector(".error-box"),

  init: function () {
    apiFetcher.fetchAllFromApi();
  
    const newCardButton = document.getElementById("addCardButton");

    // Event Listener
    newCardButton.addEventListener("click", (e) =>
      modalModule.newModalAttributes(e, app.isCard)
    );
  },
};

document.addEventListener("DOMContentLoaded", app.init);
