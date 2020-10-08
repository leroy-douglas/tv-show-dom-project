function viewShowsButton() {
    let viewShowsBtn = document.createElement("button");
    viewShowsBtn.textContent = "View Shows";
    viewShowsBtn.setAttribute("id", "view-shows-btn");
    viewShowsBtn.style.display = "none";
    
    viewShowsBtn.addEventListener("click", event => {
        const displayShows = new Event("display-shows");
        document.getElementById("root").dispatchEvent(displayShows);
        viewShowsBtn.style.display = "none";
    });

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        viewShowsBtn.style.display = "block";  // show button
    });

    return viewShowsBtn;
}


function UIPanel(_showSelect = null, _episodeSelect = null, _searchBox = null, _counter = null, _viewShowsBtn = null) {
_viewShowsBtn
    _viewShowsBtn = new viewShowsButton();
    _showSelect = new ShowSelect().getElement();
    _episodeSelect = new EpisodeSelect().getElement();
    _searchBox = new Search();
    _counter = new MovieCounter().getElement();

    (this.createUIPanel = function () {
        const rootElement = document.getElementById("root");
        const body = document.querySelector("body");
        body.setAttribute("id", "body");

        const header = document.createElement("header");
        header.className = "ui-panel";

        const uiContainer = document.createElement("div");
        uiContainer.className = "ui-container";
        header.appendChild(uiContainer);

        const selectContainer = document.createElement("div");
        selectContainer.className = "select-container";

        selectContainer.appendChild(_viewShowsBtn);
        selectContainer.appendChild(_showSelect);
        selectContainer.appendChild(_episodeSelect);
        uiContainer.appendChild(selectContainer);

        const searchContainer = document.createElement("div");
        searchContainer.className = "search-container";
        searchContainer.appendChild(_searchBox);
        searchContainer.appendChild(_counter);
        uiContainer.appendChild(searchContainer);

        body.insertBefore(header, rootElement);
        return [ this, _showSelect ];
    })

    this.getShowSelect = function () { return _showSelect; }

    return this;
}