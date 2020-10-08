function MovieCounter(_element = null) {
  _element = document.createElement("div");
  _element.setAttribute("id", "ep-count");
  _element.textContent = "0 Shows";

  document.getElementById("root").addEventListener("all-episodes", (event) => {
    let count = event.detail;
     _element.textContent = `${count} Episode${count == 1 ? "" : "s"}`;
  });
  
  document.getElementById("root").addEventListener("one-episode", (event) => {
    _element.textContent = "1 Episode";
  });

  document.getElementById("root").addEventListener("recv-episodes", (event) => {
    let count = event.detail.length;
    _element.textContent = `${count} Episode${count == 1 ? "" : "s"}`;
  });

  document
    .getElementById("root")
    .addEventListener("shows-counter", function (event) {
      let count = event.detail;
      _element.textContent = `${count} Show${count == 1 ? "" : "s"}`;
    });

  document
    .getElementById("root")
    .addEventListener("search-counter", function (event) {
      let count = event.detail.count;
      let type = event.detail.type;
      _element.textContent = `${count} ${type}${count == 1 ? "" : "s"}`;
    });

  const counterReady = new Event("counter-ready");
  document.getElementById("root").dispatchEvent(counterReady);

  this.setCount = function (count, type) {
    _element.textContent = `${count} ${type}${count == 1 ? "" : "s"}`;
  };

  this.getElement = function () {
    return _element;
  };

}