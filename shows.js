function Shows(_shows = null, _allShowsContainer = null) {
    this.renderElement = document.getElementById("root");
    console.log("compare: ", typeof compare, compare)
    _shows = getAllShows().sort(compare);
    console.log(_shows)
    _allShowsContainer = document.createElement("div");
    _allShowsContainer.setAttribute("id", "all-shows");
    _allShowsContainer.style.display = "block";
    //let allShowsContainer = null;
    
    document.getElementById("root").appendChild(_allShowsContainer);

    document.getElementById("root").addEventListener("display-shows", (event) => {
        console.log("allShowsContainer: (event received)", _allShowsContainer)
        console.log("GOT request to display shows event");
        const sendShowsCount = new CustomEvent("shows-counter", { detail: _shows.length });
        document.getElementById("root").dispatchEvent(sendShowsCount);
        this.showAllShowsContent();
    });


    document.getElementById("root").addEventListener("view-episodes", (event) => {
        console.log("received view-episodes EVENT")
        this.hideAllShowsContent();
    });

    document.getElementById("all-shows").addEventListener("click", (event) => {
        // console.log(event.composedPath())
        //console.log(event.composedPath().includes("show-container"))
        if( _allShowsContainer.style.display === "none"){
            return;
        }
        let eventElements = event.composedPath().find(path => path.className === "show-container")
        let showID = eventElements.children[0].id;
        //console.log(ids.id, showID)
        //console.log(eventElements.children);
        //console.log(showID)
        //console.log(event.composedPath()[2].id)
        //let showID = showTitle.getAttribute("id");
        //console.log("showID", showID);
        //getAllEpisodes(showID);
        this.hideAllShowsContent();
        const getEpisodes = new CustomEvent("get-episodes", { detail: showID });
        document.getElementById("root").dispatchEvent(getEpisodes);
    });

    document.getElementById("root").addEventListener("select-ready", (event) => {
        console.log("select-ready: (event received)")
        const sendShows = new CustomEvent("shows-avail", { detail: _shows });
        document.getElementById("root").dispatchEvent(sendShows);
    }); 

    document.getElementById("root").addEventListener("search-ready", (event) => {
        console.log("search-ready: (event received)")
        const sendShows = new CustomEvent("shows-search", { detail: _shows });
        document.getElementById("root").dispatchEvent(sendShows);
    });

    document.getElementById("root").addEventListener("counter-ready", (event) => {
        console.log("counter-ready: (event received)")
        const sendShowsCount = new CustomEvent("shows-counter", { detail: _shows.length });
        document.getElementById("root").dispatchEvent(sendShowsCount);
    });

    this.createStats = function(stats) {
        //console.log(stats)
        const statsContainer = document.createElement("div");
        statsContainer.className = "show-stats";
        const status = document.createElement("p");
        status.className = "show-status";
        status.classList.add("status");
        status.textContent = `Status: ${stats.status}`;
        statsContainer.appendChild(status);
        const rating = document.createElement("p");
        rating.className = "show-rating";
        rating.classList.add("status");
        rating.textContent = `Rating: ${stats.rating}`;
        statsContainer.appendChild(rating);
        const runtime = document.createElement("p");
        runtime.className = "show-runtime";
        runtime.classList.add("status");
        runtime.textContent = `Runtime: ${stats.runtime}`;
        statsContainer.appendChild(runtime);
        const genres = document.createElement("p");
        genres.className = "show-genres";
        genres.classList.add("status");
        //console.log(stats.genres)
        genres.textContent = `Genres: ${stats.genres.join(" / ")}`;
        statsContainer.appendChild(genres);
        return statsContainer;
    }

    this.createImage = function(url){
        const showImage = document.createElement("img");
        showImage.className = "show-image";

        if (url === "no-image") {
            showImage.src = "";
        }
        else {
            if (url.slice(0, 5) === "https")
                showImage.src = url;
            else {
                showImage.src = "https:" + url.slice(5);
            }
        }

        return showImage;
    }

    this.createSummary = function(summary){
        let showSummary = document.createElement("div");
        showSummary.className = "show-summary";
        showSummary.innerHTML = summary;
        return showSummary;
    }

    this.createTitle = function(title){
        let showTitle = document.createElement("h2");
        //showTitle.setAttribute("id", title);
        showTitle.className = "show-title";
        showTitle.textContent = title;

        /* showTitle.addEventListener("click", (event) => {
            let showID = showTitle.getAttribute("id");
            console.log("showID", showID)
            getAllEpisodes(showID) ;
        }); */
        return showTitle;
    }

    this.hideAllShowsContent = function(){
        /* showContainers.forEach((container) => {
          if (container.style.display === "block") {
            container.style.display = "none";
          }
        }); */
        _allShowsContainer.style.display = 'none';
    }

    this.showAllShowsContent = function(){
        showContainers.forEach((container) => {
            if (container.style.display === "none") {
                container.style.display = "block";
            }
        });
        _allShowsContainer.style.display = "block";
    }

    this.addShowsContent = function() {
        document.getElementById("root").appendChild(_allShowsContainer);

        _shows.forEach(show => {
            //console.log(show);
            /* if( ( 'image' in show)  === false)
              return;
            if ( (show.image === null) || ('medium' in show.image)  === false )
              return; */
            //console.log(show);
            const showContainer = document.createElement("div");
            showContainer.className = "show-container";
            showContainer.setAttribute("id", show.name);
            showContainer.setAttribute("display", "block");
            showContainer.setAttribute("show-id", show.id);
            _allShowsContainer.appendChild(showContainer);

            const showTitle = this.createTitle(show.name);
            showTitle.setAttribute("id", show.id);
            showContainer.appendChild(showTitle);

            const showContentContainer = document.createElement("div");
            showContentContainer.className = "show-content-container";
            showContainer.appendChild(showContentContainer);

            const imageStatsContainer = document.createElement("div");
            imageStatsContainer.className = "image-stats-container";
            showContentContainer.appendChild(imageStatsContainer);

            let showImage = null;

            if (
                "image" in show === false ||
                show.image === null ||
                "medium" in show.image === false
            ) {
                showImage = this.createImage("no-image");
            } else showImage = this.createImage(show.image.medium);

            //showImage = this.createImage(show.image.medium);
            imageStatsContainer.appendChild(showImage);

            let stats = {
                genres: show.genres,
                status: show.status,
                rating: show.rating.average,
                runtime: show.runtime
            };

            const statsContainer = this.createStats(stats);
            imageStatsContainer.appendChild(statsContainer);

            const showSummary = this.createSummary(show.summary);
            showContentContainer.appendChild(showSummary);
        });

        showContainers = document.querySelectorAll(".show-container");
        //setCount("Show", this.showList.length);
    //return this;
    }
}