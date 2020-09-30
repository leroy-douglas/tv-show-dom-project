const displayFooter = _ => {
  let footer = document.createElement("footer");
  let body = document.querySelector("body");
  let script = document.querySelector("script");
  footer.setAttribute("id", "footer");
  let a = document.createElement("a");
  a.setAttribute("href", "https://www.tvmaze.com/");
  a.setAttribute("target", "_blank");
  a.textContent = "The data on this site was provided by TVMaze.com";
  footer.appendChild(a);
  body.insertBefore(footer, script);
};

const setup = _ => {
  new Shows().addShowsContent(); // create shows data for shows & update view
  new Episodes(); // At this time we only need to set up the episodes object...no data required right
  // now
  new UIPanel().createUIPanel(); // create all UI components - imput selectors for shows & episodes
  //                                          - search bar
  //                                          - shows view button - Allows user to return to shows
  //                                             view
  //                                          - counter to show how many shows / episodes
  displayFooter();
};

window.onload = setup();