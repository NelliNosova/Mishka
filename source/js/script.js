(function () {
  var order = document.querySelectorAll(".js-order");
  var modalOrder = document.querySelector(".js-modal");

  order.forEach(function(open) {
    open.addEventListener("click", function (evt) {
      evt.preventDefault();
      modalOrder.classList.remove("none");
    })
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if (!modalOrder.classList.contains("none")) {
        evt.preventDefault();
        modalOrder.classList.add("none");
      }
    }
  });

})();
