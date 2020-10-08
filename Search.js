/*
 * Search(_searchBox, _movies, _shows, _itemContainer)
 *          - _searchBox      : the DOM element for serach box
 *          - _movies            : reference to either shows / episodes array
 *          - _shows             : on startup we'll be pointing to the shows data
 *          - _itemContainer: the DOM element for either the allShowsContainer, or the allEpisodesContainer
 * 
 *  Search() is normally called without arguments...declare all variables as closure items for the event handlers
 *
 * This object responds to the following events:
 *      "shows-search"     : a request to hide all the episodes, as we are about to display the shows
 *      "episodes-search" :
 *      "display-shows"    :
 *      "keyup"                 : standard event for a select input
 *
 */

function Search(_searchBox = null, _movies = [], _shows = [], itemContainer=[]){
    _searchBox = document.createElement("input");
    _searchBox.type = "text";
    _searchBox.setAttribute("id", "ep-search");

    let searchType = "Show";
    document.getElementById("root").addEventListener("shows-search",  (event) => {
        _searchBox.value = "";
        _movies = _shows = event.detail;
        itemContainer = document.querySelectorAll(".show-container");
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
    });

    _searchBox.addEventListener("keyup", (event) => {
        let searchText = event.target.value;

        let movieCount = 0;
     _movies.map((movie, index) => {
            let lcName = movie.name.toLowerCase();
            if (('summary' in movie) === false || movie.summary === null) {
                movie.summary = "";
            }

            let lcSummary = movie.summary.toLowerCase();
            let lcSearchText = searchText.toLowerCase();
            if (lcName.includes(lcSearchText) || lcSummary.includes(lcSearchText)) {
                itemContainer[index].style.display = "block";
                movieCount++;
            }
            else {
                itemContainer[index].style.display = "none";
            }
        });

        const searchCount = new CustomEvent("search-counter", { detail: { 
            count: movieCount, 
            type: searchType } });
        document.getElementById("root").dispatchEvent(searchCount);
    });

    const searchReady = new Event("search-ready");
    document.getElementById("root").dispatchEvent(searchReady);

    return _searchBox;
}