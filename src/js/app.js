import "../css/style.css";
import "./plugins";
import locations from "./store/location";
import formUI from "./views/form";
import currencyUI from "./views/currency";
import ticketsUI from "./views/tickets";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  const form = formUI.form;

  //Events
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onFornSubmit();
  });

  // handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFornSubmit() {
    // inputs data
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;


    //CODE,CODE, 2019-9, 2019-10
    await locations.fatchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });
    ticketsUI.renderTickets(locations.lastSearch)
  }
});
