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
  new Shows().addShowsContent(); // create shows data for all shows (Shows.js) & update view
  new Episodes();                             // At this time we only need to set up the episodes (Episodes.js) object...
                                                         // no data required as we only need to view the available shows
  new UIPanel().createUIPanel();    // create all UI components (UIPanel.js)
                                                         // - imput selectors for shows (ShowSelect.js) & episodes (EpisodeSelect.js)
                                                         // - search bar (Search.js)
                                                         // - shows view button (UIPanel.js) - Allows user to return to shows view
                                                         // - counter (MovieCounter.js) to show how many shows / episodes are being displayed
  displayFooter();
};

window.onload = setup();