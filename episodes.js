function Episodes(_episodes = null, _allEpisodesContainer = null) {
     _allEpisodesContainer = document.createElement("div");
    _allEpisodesContainer.setAttribute("id", "all-episodes");
    _allEpisodesContainer.style.display = "flex";
    let episodeContainers = null;

    document.getElementById("root").appendChild(_allEpisodesContainer);
    console.log("allEpisodesContainer: ", _allEpisodesContainer)

    document.getElementById("root").addEventListener("show-all-episodes", (event) => {
        this.showAllEpisodesContent();
        const allEpisodes = new CustomEvent("all-episodes", { detail: _episodes.length });
        document.getElementById("root").dispatchEvent(allEpisodes);
    });

    document.getElementById("root").addEventListener("show-one-episode", (event) => {
        let episodeID = event.detail;
        console.log("show-one-episode EVENT - episode id", episodeID)
        this.showIndividualEpisodeContent(episodeID);
        const oneEpisode = new Event("one-episode");
        document.getElementById("root").dispatchEvent(oneEpisode);
    });

    document.getElementById("root").addEventListener("display-shows", (event) => {
        this.hideAllEpisodesContent();
        /* const displayShows = new CustomEvent("display-shows");
        document.getElementById("all-episodes").dispatchEvent(displayShows); */
    });

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        console.log("Episodes() GOT new episodes RECIEVED event", event.detail);
        _episodes = event.detail;
        
        

        console.log(_episodes);
        this.removeEpisodeContent();
        this.addEpisodesContent();
        console.log("Episodes() sending episodes search event");
        const sendEpisodes = new CustomEvent("episodes-search", { detail: _episodes });
        document.getElementById("root").dispatchEvent(sendEpisodes);
    });

    document.getElementById("root").addEventListener("get-episodes", (event) => {
        console.log("allEpisodesContainer: (event received)", _allEpisodesContainer)
        console.log("GOT request for new episodes event", event.detail);
        let showID = event.detail;
        console.log("show ID:", showID);
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

        //setCount("Episode", 1);
    }

    this.showAllEpisodesContent = function(){
        episodeContainers.forEach((container) => {
            if (container.style.display === "none") {
                container.style.display = "block";
            }
        });
        _allEpisodesContainer.style.display = "flex";
        //setCount("Episode", episodes.episodeList.length);
    }

    this.hideAllEpisodesContent = function() {
        _allEpisodesContainer.style.display = "none";
        //setCount("Episode", episodes.episodeList.length);
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
       // _allEpisodesContainer.setAttribute("display", "flex");
        _allEpisodesContainer.style.display = "flex";

        documentFragment.appendChild(_allEpisodesContainer);
        let summaryCount = 0;
        console.log("addEpisodesContent", _episodes)
        _episodes.forEach(episode => {
            if ("summary" in episode === false || episode.summary === null) {
                //console.log("summary does not exist",episode)
                return;
            }

            if (episode.summary.length < 1) {
                /* console.log(episode)
                console.log("summary",episode.summary) */
                return;
            }

            summaryCount++;

            let episodeContainer = document.createElement("div");
            _allEpisodesContainer.appendChild(episodeContainer);
            episodeContainer.className = "ep-container";
            episodeContainer.style.display = "block";
            let titleElement = this.createTitle(this.getEpisodeText(episode));

            let imageElement = null;  //this.createImage(episode.image.medium);
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
            //this.setEpisodeCount(this.episodeList.length);
        });

        //_allEpisodesContainer.setAttribute("display", "flex");
        document.getElementById("root").appendChild(documentFragment);
        episodeContainers = document.querySelectorAll(".ep-container");
        console.log(_allEpisodesContainer)
        /* console.log("Episode Count = ", summaryCount)
        console.log("addEpisodesContent()", episodeContainers); */
        //setCount("Episode", this.episodeList.length);

        return this;
    }

    this.getAllEpisodes = function (showID) {
        //let showID = allShows[0].id;
        //("getAllEpisodes(GETTING EPISODES)");
        fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
            .then((response) => response.json().then((data) => data))
            .then((allEpisodes) => {
                console.log(allEpisodes)

                allEpisodes = allEpisodes.filter((episode) => {
                    if ("summary" in episode === false || episode.summary === null) {
                        //console.log("summary does not exist", episode);
                        return false;
                    }

                    if (episode.summary.length < 1) {
                        //console.log(episode);
                        //console.log("summary", episode.summary);
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

                //episodes.episodeList = allEpisodes;
                //console.log("getAllEpisodes(EPISODES RETRIEVED)");
                const episodesReceived = new CustomEvent("recv-episodes", {
                    detail: allEpisodes,
                });
                //document.getElementById("all-episodes").dispatchEvent(episodesReceived);
                document
                    .getElementById("root")
                    .dispatchEvent(episodesReceived);

                console.log("getAllEpisodes(): ", allEpisodes)
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