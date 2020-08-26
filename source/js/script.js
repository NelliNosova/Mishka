(function () {
  var order = document.querySelector(".js-order");
  var modalOrder = document.querySelector(".js-modal");

  order.addEventListener("click", function (evt) {
    evt.preventDefault();
    modalOrder.classList.remove("none");
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
    if (!modalOrder.classList.contains("none")) {
      evt.preventDefault();
      modalOrder.classList.add("none");
    }
  }
}) ();
