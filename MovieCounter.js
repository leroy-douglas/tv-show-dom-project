function MovieCounter(_element = null) {
  _element = document.createElement("div");
  _element.setAttribute("id", "ep-count");
  _element.textContent = "0 Shows";

  document.getElementById("root").addEventListener("all-episodes", (event) => {
    let count = event.detail;
     _element.textContent = `${count} Episode${count == 1 ? "" : "s"}`;
    //this.setCount(count, "Episode");
  });
  
  document.getElementById("root").addEventListener("one-episode", (event) => {
    //let count = event.detail.length;
    _element.textContent = "1 Episode";
    //this.setCount(count, "Episode");
  });

  document.getElementById("root").addEventListener("recv-episodes", (event) => {
    let count = event.detail.length;
    _element.textContent = `${count} Episode${count == 1 ? "" : "s"}`;
    //this.setCount(count, "Episode");
  });

  document
    .getElementById("root")
    .addEventListener("shows-counter", function (event) {
      console.log("MovieCounter(): GOT the shows-counter event", event.detail);
      let count = event.detail;
      console.log("value of this", this);
      _element.textContent = `${count} Show${count == 1 ? "" : "s"}`;
      // this.setCount(count, "Show");
    }); // search-counter

  document
    .getElementById("root")
    .addEventListener("search-counter", function (event) {
      console.log("MovieCounter(): GOT the search-counter event", event.detail);
      let count = event.detail.count;
      let type = event.detail.type;
      console.log("value of this", this);
      console.log("count: ", count, "type: ", type);
      _element.textContent = `${count} ${type}${count == 1 ? "" : "s"}`;
      // this.setCount(count, "Show");
    });

  const counterReady = new Event("counter-ready");
  document.getElementById("root").dispatchEvent(counterReady);
  console.log("Counter sending counter-ready EVENT", counterReady);

  this.setCount = function (count, type) {
    _element.textContent = `${count} ${type}${count == 1 ? "" : "s"}`;
  };

  this.getElement = function () {
    return _element;
  };

  console.log("About to leave MovieCounter()", this);
}