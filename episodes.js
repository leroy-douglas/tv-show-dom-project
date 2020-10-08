/*
 * Episodes(_episodes, _allEpisodesContainer)
 *          - _episodes: reference to the episodes array
 *          - _allEpisodesContainer: the DOM element that holds all the individual episode DOM elements
 *
 *  Episodes() is normally called without arguments...declare both variables as closure items for the event handlers
 *
 * This object responds to the following events:
 *      "show-all-episodes": a request to display all the episodes, and then request the counter to show # of episodes
 *      "show-one-episode": a request to display one episode, and then request the counter to show 1 episode
 *       "view-episodes"     : hides shows as episodes data is about to be displayed
 *       "display-shows"     : shows data about to be displayed, let's hide the episodes
 *       "recv-episodes"      : request from search bar element to send shows data
 *       "counter-ready"     : request from counter element to send shows data
 *
 */


function Episodes(_episodes = null, _allEpisodesContainer = null) {
     _allEpisodesContainer = document.createElement("div");
    _allEpisodesContainer.setAttribute("id", "all-episodes");
    _allEpisodesContainer.style.display = "flex";
    let episodeContainers = null;

    document.getElementById("root").appendChild(_allEpisodesContainer);

    document.getElementById("root").addEventListener("show-all-episodes", (event) => {
        this.showAllEpisodesContent();
        const allEpisodes = new CustomEvent("all-episodes", { detail: _episodes.length });
        document.getElementById("root").dispatchEvent(allEpisodes);
    });

    document.getElementById("root").addEventListener("show-one-episode", (event) => {
        let episodeID = event.detail;
        this.showIndividualEpisodeContent(episodeID);
        const oneEpisode = new Event("one-episode");
        document.getElementById("root").dispatchEvent(oneEpisode);
    });

    document.getElementById("root").addEventListener("display-shows", (event) => {
        this.hideAllEpisodesContent();
    });

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        _episodes = event.detail;
        this.removeEpisodeContent();
        this.addEpisodesContent();
        const sendEpisodes = new CustomEvent("episodes-search", { detail: _episodes });
        document.getElementById("root").dispatchEvent(sendEpisodes);
    });

    document.getElementById("root").addEventListener("get-episodes", (event) => {
        let showID = event.detail;
        this.getAllEpisodes(showID);
    });

    this.showIndividualEpisodeContent = function(id){
        let episodeContainers = document.querySelectorAll(".ep-container");
        episodeContainers.forEach((container, index) => {
            if (index === id) {
                container.style.display = "block";
            }
            else {
                container.style.display = "none";
            }
        });
    }

    this.showAllEpisodesContent = function(){
        episodeContainers.forEach((container) => {
            if (container.style.display === "none") {
                container.style.display = "block";
            }
        });
        _allEpisodesContainer.style.display = "flex";
    }

    this.hideAllEpisodesContent = function() {
        _allEpisodesContainer.style.display = "none";
    }

    this.getEpisodeText = function(ep) {
        let season = ep.season.toString().padStart(2, "0");
        let episode = ep.number.toString().padStart(2, "0")
        return `S${season}E${episode} - ${ep.name}`;
    }


    this.createTitle = function(title) {
        let titleElement = document.createElement("h3");
        titleElement.className = "ep-title";
        titleElement.textContent = title;

        return titleElement;
    }

    this.createImage = function(url) {
        let imageElement = document.createElement("img");
        imageElement.className = "ep-image";
        if (url === "no-image")
            imageElement.src = "";
        else
            imageElement.src = url;

        return imageElement;
    }

    this.createSummary = function(summary) {
        let summaryElement = document.createElement("div");
        summaryElement.className = "ep-summary";
        summaryElement.innerHTML = summary;

        return summaryElement;
    }

    this.removeEpisodeContent = function(){
        _allEpisodesContainer.innerHTML = "";
    }

    this.addEpisodesContent = function() {
        let documentFragment = document.createDocumentFragment();
        _allEpisodesContainer.style.display = "flex";

        documentFragment.appendChild(_allEpisodesContainer);
        let summaryCount = 0;

        _episodes.forEach(episode => {
            if ("summary" in episode === false || episode.summary === null) {
                return;
            }

            if (episode.summary.length < 1) {
                return;
            }

            summaryCount++;

            let episodeContainer = document.createElement("div");
            _allEpisodesContainer.appendChild(episodeContainer);
            episodeContainer.className = "ep-container";
            episodeContainer.style.display = "block";
            let titleElement = this.createTitle(this.getEpisodeText(episode));

            let imageElement = null;
            if ((('image' in episode) === false) || (episode.image === null) ||
                (('medium' in episode.image) === false) || (episode.image.medium === null)
            )
                imageElement = this.createImage("no-image");
            else
                imageElement = this.createImage(episode.image.medium);

            if (episode.imageUnavailable) {
                imageElement.style.width = "70%";
            }

            let summaryElement = this.createSummary(episode.summary);
            episodeContainer.appendChild(titleElement);
            episodeContainer.appendChild(imageElement);
            episodeContainer.appendChild(summaryElement);
        });

        document.getElementById("root").appendChild(documentFragment);
        episodeContainers = document.querySelectorAll(".ep-container");

        return this;
    }

    this.getAllEpisodes = function (showID) {
        fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
            .then((response) => response.json().then((data) => data))
            .then((allEpisodes) => {
                allEpisodes = allEpisodes.filter((episode) => {
                    if ("summary" in episode === false || episode.summary === null) {
                        return false;
                    }

                    if (episode.summary.length < 1) {
                        return false;
                    }
                    return true;
                });

                allEpisodes.map((episode) => {
                    if (
                        "image" in episode === false ||
                        episode.image === null ||
                        "medium" in episode.image === false ||
                        episode.image.medium === null
                    ) {
                        episode.image = { medium: "./images/no-image-available.png" };
                        episode.imageUnavailable = true;
                    } else {
                        episode.imageUnavailable = false;
                    }
                });

                const episodesReceived = new CustomEvent("recv-episodes", {
                    detail: allEpisodes,
                });

                document
                    .getElementById("root")
                    .dispatchEvent(episodesReceived);
            })
            .catch((error) => {
                console.log("Yep we caught an ERROR", error);
                addErrorPage("error: 404");
            });
    };

    this.getContainer = function () {
        return _allEpisodesContainer;
    }

}