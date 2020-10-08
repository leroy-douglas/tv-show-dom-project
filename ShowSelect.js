/*
 * ShowSelect(_shows, _element)
 *          - _episodes: reference to the episodes array
 *          - _element: the DOM element for input select
 *
 *  ShowSelect() is normally called without arguments...declare both variables as closure items for the event handlers
 *
 *  This object sends the following events on creation:
 *      "select-ready": send this event to the show object to request data
 * 
 * This object responds to the following events:
 *      "display-shows": a request to hide all the episodes, as we are about to display the shows
 *      "change"           : standard event for a select input
 *      "shows-avail"    : receives the shows data from the shows object
 *      "recv-episodes" : notify the select input that episode data is about to be displayed, so the select input will hide
 *      
 */

function ShowSelect(_shows = null, _element = null) {
    _element = document.createElement("select");
    _element.setAttribute("id", "show-select");
    _element.setAttribute("name", "show-select");
    _element.style.display = "block";

    document.getElementById("root").addEventListener("shows-avail", function(event) {
        _shows = event.detail;
                                            // we now have the shows data, let's use it to populate the list of options
        if (_shows) {
            let option = document.createElement("option");
            _shows.forEach((show, index) => {
                option = document.createElement("option");
                option.setAttribute("id", show.id);
                option.setAttribute("option-index", index);
                option.textContent = show.name;
                _element.appendChild(option);
            });
        }
    });

    document.getElementById("root").addEventListener("display-shows", (event) => {
        _element.style.display = "block";                   // display our shows
    });

    _element.addEventListener("change", function (event) {
        const showIndex = event.target.options[event.target.selectedIndex].index;
        const options = _element.querySelectorAll("option");
        const showID = options[showIndex].id;
        
        const viewEpisodes = new Event("view-episodes");      // tell show object to hide its data
        document.getElementById("root").dispatchEvent(viewEpisodes);

        const selectEpisodes = new CustomEvent("get-episodes", { detail: showID });   // tell episodes object to request all episodes
        document.getElementById("root").dispatchEvent(selectEpisodes);
    });

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        _element.style.display = "none";                   // hide our shows
    });

    const selectReady = new Event("select-ready");
    document.getElementById("root").dispatchEvent(selectReady);  // tell the shows object that the input select is ready
                                                                                                            // to populate itself with the list of shows
    this.getElement = function () {
        return _element;
    };

    return this;
};