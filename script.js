//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function createTitle(title, ep, rElement){
    titleElem = document.createElement("h3");
    titleElem.className = "ep-title";
    titleElem.textContent = `${title} - ${ep}`;
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

function displayEpisodeContent(ep, rElement) {
  let episode = `S${ep.season.toString().padStart(2, "0")}E${ep.number.toString().padStart(2,"0")}`;
  createTitle(ep.name, episode, rElement);
  createImage(ep.image.medium, rElement);
  createSummary(ep.summary, rElement);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodeList.forEach(episode => {
    let div = document.createElement("div");
    div.className = "ep-container";
    rootElem.appendChild(div);
    displayEpisodeContent(episode, div);
  });
}

window.onload = setup;
