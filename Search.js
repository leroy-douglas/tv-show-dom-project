function Search(_searchBox = null, _movies = [], _shows = [], itemContainer=[]){
    _searchBox = document.createElement("input");
    _searchBox.type = "text";
    _searchBox.setAttribute("id", "ep-search");
    //parent.appendChild(_searchBox);
    let searchType = "Show";
    console.log("Search(): ENTERED...")
    document.getElementById("root").addEventListener("shows-search",  (event) => {
        console.log("Search(): shows-search event")
        _searchBox.value = "";
        _movies = _shows = event.detail;
        itemContainer = document.querySelectorAll(".show-container");
        console.log("shows search: ", itemContainer)
    });

    document.getElementById("root").addEventListener("display-shows", (event) => {
        _searchBox.value = "";
        searchType = "Show";
        _movies = _shows;
        itemContainer = document.querySelectorAll(".show-container");
    });

    document.getElementById("root").addEventListener("episodes-search", (event) => {
        _searchBox.value = "";
        searchType = "Episode";
        _movies = event.detail;
        itemContainer = document.querySelectorAll(".ep-container");
        console.log("episodes search: ", itemContainer)
    });

    _searchBox.addEventListener("keyup", (event) => {
console.log("_movies: ", _movies)
        //console.log("searchBox.addEventListener()", episodeSelect.style.display, showSelect.style.display )
        /* if (episodeSelect.style.display === "none") {
            //console.log("searchBox.addEventListener(shows)",shows.showList)
            movies = shows.showList; //.showList;
            itemContainer = document.querySelectorAll(".show-container");
            selectInput = showSelect;
            type = "Show";
        }
        else {
            //console.log("searchBox.addEventListener(episodes)", episodes.episodeList, searchEpisodes)
            movies = episodes.episodeList; //.espisodeList;
            itemContainer = document.querySelectorAll(".ep-container");
            selectInput = episodeSelect;
            type = "Episode";

            //let selectInput = document.querySelector("#ep-list");
        } */
        //console.log("itemContainer", itemContainer)
        //selectInput.value = "All Episodes";
        //selectInput.children[0].defaultSelected = true;
        let searchText = event.target.value;

        let movieCount = 0;
        //console.log("map", episodes.espisodeList, typeof episodes.espisodeList)
     _movies.map((movie, index) => {
            
            // console.log("check value of movie", movie);

            let lcName = movie.name.toLowerCase();
            if (('summary' in movie) === false || movie.summary === null) {
                movie.summary = "";
                //console.log("added summary", movie)
            }

            let lcSummary = movie.summary.toLowerCase();
            let lcSearchText = searchText.toLowerCase();
            if (lcName.includes(lcSearchText) || lcSummary.includes(lcSearchText)) {
                itemContainer[index].style.display = "block";
                movieCount++;
                //console.log("found: ", itemContainer[index])
            }
            else {
                //console.log("not found: ", movie.image, itemContainer[index])
                itemContainer[index].style.display = "none";
            }
        });

        //this.setEpisodeCount(episodeCounter);
        //setCount(type, movieCounter);
        const searchCount = new CustomEvent("search-counter", { detail: { 
            count: movieCount, 
            type: searchType } });
        document.getElementById("root").dispatchEvent(searchCount);
    });

    const searchReady = new Event("search-ready");
    document.getElementById("root").dispatchEvent(searchReady);
    console.log("Search sending search-ready EVENT", searchReady)

    return _searchBox;
}