function ShowSelect(_shows = null, _element = null) {
    _element = document.createElement("select");
    _element.setAttribute("id", "show-select");
    _element.setAttribute("name", "show-select");
    _element.style.display = "block";


    console.log("ShowSelect(",_element,")")

    document.getElementById("root").addEventListener("shows-avail", function(event) {
        console.log("GOT the shows-avail event", event.detail);
        _shows = event.detail;
        console.log(_shows);
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
        _element.style.display = "block";
    });


    _element.addEventListener("change", function (event) {
        const showIndex = event.target.options[event.target.selectedIndex].index;
        const options = _element.querySelectorAll("option");
        console.log(options[showIndex].id);
        const showID = options[showIndex].id;
        /*
        const getEpisodes = new CustomEvent("get-episodes", { detail: showID });
        _element.dispatchEvent(getEpisodes);
        */
        const viewEpisodes = new Event("view-episodes");
        document.getElementById("root").dispatchEvent(viewEpisodes);

        //this.hideAllShowsContent();
        const selectEpisodes = new CustomEvent("get-episodes", { detail: showID });
        document.getElementById("root").dispatchEvent(selectEpisodes);
        
        //window.location.hash = `${event.target.options[event.target.selectedIndex].value}`;
    });

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        console.log("GOT new episodes RECIEVED event", event.detail);
        _element.style.display = "none";
    });


    const selectReady = new Event("select-ready");
    document.getElementById("root").dispatchEvent(selectReady);
    console.log("ShowSelect sending shows-select-ready EVENT", _element, selectReady)

    this.getElement = function () {
        return _element;
    };

    return this;
};