//You can edit ALL of the code here

function addErrorPage(){

}

function createTitle(title, rElement){
    titleElem = document.createElement("h3");
    titleElem.className = "ep-title";
    titleElem.textContent = title;
  rElement.appendChild(titleElem);
}

function createImage(url, rElement){
  img = document.createElement("img");
  img.className = "ep-image";
  img.src = url;
  rElement.appendChild(img);
}

function createSummary(summary, rElement){
  div = document.createElement("div");
  div.className = "ep-summary";
  div.innerHTML = summary;
  rElement.appendChild(div);
}

function getEpisodeText(ep){
  let season = ep.season.toString().padStart(2, "0");
  let episode = ep.number.toString().padStart(2, "0")
  return `S${season}E${episode} - ${ep.name}`;
}

function selectEventListener( select, epList ) {
  
  select.addEventListener("change",  event => {
    let episodeCounter = document.querySelector("#ep-count");
    const rootElem = document.getElementById("root");
    let selectOptionIndex = event.target.options[event.target.selectedIndex].index;
    const ALL_EPISODES = 0;
    rootElem.innerHTML = "";
    if(selectOptionIndex === ALL_EPISODES) {    // All Episodes
      addEpisodesContent(epList, rootElem);
      episodeCounter.textContent = `${epList.length} Episodes`;
  }
  else {
    let selectedEpisode = epList[selectOptionIndex - 1];
    let div = document.createElement("div");
    rootElem.appendChild(div);
    addEpisodeContent(selectedEpisode, div);
    episodeCounter.textContent = "1 Episode";
  }
  });
}

function addFooter() {
  let footer = document.createElement("footer");
  let body = document.querySelector("body");
  footer.setAttribute("id", "footer");
  let a = document.createElement("a");
  a.setAttribute("href","https://www.tvmaze.com/");
  a.setAttribute("target", "_blank");
  a.textContent = "The data on this site was provided by TVMaze.com"; 
  footer.appendChild(a);
  body.appendChild(footer);
}

function addEpisodeContent(ep, element) {
  let episodeText = getEpisodeText(ep);
  element.className = "ep-container";
  createTitle(episodeText, element);
  createImage(ep.image.medium, element);
  createSummary(ep.summary, element);
}

function addEpisodesContent(episodeList){
  const rootElem = document.getElementById("root");
  episodeList.forEach(episode => {
  let div = document.createElement("div");
  rootElem.appendChild(div);
  addEpisodeContent(episode, div);
  });
}

function addEpisodeCounter(epList, parent){
  let movieCounter = document.createElement("div");
  movieCounter.setAttribute("id", "ep-count");
  movieCounter.textContent = `${epList.length} Episode${(epList.length == 1) ? "" : "s"}`;
  parent.appendChild(movieCounter);
}

function addSelectOptions(epList, select) {
  let option = document.createElement("option");
  option.defaultSelected = true;
  option.textContent = "All Episodes";
  option.setAttribute("id", -1);
  option.setAttribute("option-index", -1);
  select.appendChild(option);
  epList.forEach((episode, index) => {
    option = document.createElement("option");
    option.setAttribute("id", episode.id);
    option.setAttribute("option-index", index);
    option.textContent = getEpisodeText(episode);
    select.appendChild(option);
  });
}

function addSelectionList(epList, parent, name) {
  let select = document.createElement("select");

  select.setAttribute("id", name);
  select.setAttribute("name", name);
  addSelectOptions(epList, select);
  parent.appendChild(select);
  selectEventListener(select, epList);
  return select;
}

function addMovieSearchBox(epList, parent) {
  const searchBox = document.createElement("input");
  const rootElem = document.getElementById("root");
  searchBox.type = "text";
  searchBox.setAttribute("id", "ep-search");
  searchBox.addEventListener("keyup", (event) => {
    
    let selectInput = document.querySelector("#ep-list");
    selectInput.value = "All Episodes";
    //selectInput.children[0].defaultSelected = true;
    let searchText = event.target.value;
    
    let moviesFound = epList.filter(episode => {
      let lcName = episode.name.toLowerCase();
      let lcSummary = episode.summary.toLowerCase();
      let lcSearchText = searchText.toLowerCase();
      return lcName.includes(lcSearchText) || lcSummary.includes(lcSearchText);
    });

    if (moviesFound) {
      rootElem.innerHTML = "";
      addEpisodesContent(moviesFound);
    }
    let movieCounter = document.querySelector("#ep-count");
    movieCounter.textContent = `${moviesFound.length} Episode${(moviesFound.length == 1) ? "" : "s"}`;
  });
  parent.appendChild(searchBox);
}

function addHeader(epList) {
  const body = document.querySelector("body");
  const header = document.createElement("header");
  header.className = "header";
  const controlsWrapper = document.createElement("div");
  controlsWrapper.className = "controls-wrapper";
  header.appendChild(controlsWrapper);
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-wrapper";
  controlsWrapper.appendChild(searchWrapper);

  addEpisodeCounter(epList, searchWrapper);
  addMovieSearchBox(epList, searchWrapper);
  addSelectionList(epList, controlsWrapper, "ep-list");
  
  
  const rootElem = document.getElementById("root");
  body.insertBefore(header, rootElem); 
}

function makePageForEpisodes(episodeList) {
  addHeader(episodeList);
  addEpisodesContent(episodeList);
  addFooter();
}

function setup() {
  makePageForEpisodes(getAllEpisodes());
}

window.onload = setup;
