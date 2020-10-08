/*
 * EpisodeSelect(_episodes, _element)
 *          - _episodes: reference to the episodes array
 *          - _element: the DOM element for input select
 *
 *  EpisodeSelect() is normally called without arguments...declare both variables as closure items for the event handlers
 *
 * This object responds to the following events:
 *      "display-shows": a request to hide all the episodes, as we are about to display the shows
 *      "change": standard event for a select input
 * 
 */

function EpisodeSelect(_episodes = null, _element = null) {
    _element = document.createElement("select");
    _element.setAttribute("id", "ep-select");
    _element.setAttribute("name", "ep-select");
    _element.style.display = "none";

    document.getElementById("root").addEventListener("recv-episodes", (event) => {
        _episodes = event.detail;
        this.removeOptions();
        this.addOptions();
        _element.style.display = "block";
    });

    document.getElementById("root").addEventListener("display-shows", (event) => {
        _element.style.display = "none";
    });

    _element.addEventListener("change", (event) => {
            let selectOptionIndex =
                event.target.options[event.target.selectedIndex].index;
            const ALL_EPISODES = 0;

            if (selectOptionIndex === ALL_EPISODES) {
                // All Episodes
                const showAllEpisodes = new Event("show-all-episodes");
                document.getElementById("root").dispatchEvent(showAllEpisodes);
            } else {
                const showOneEpisode = new CustomEvent(
                    "show-one-episode", {
                    detail: (selectOptionIndex - 1),
                });
                document.getElementById("root").dispatchEvent(showOneEpisode);
            }
        });
    
    this.getEpisodeText = function (ep) {
      let season = ep.season.toString().padStart(2, "0");
      let episode = ep.number.toString().padStart(2, "0");
      return `S${season}E${episode} - ${ep.name}`;
    };
    
    this.removeOptions = function () {
        if (_element.options.length === 0) return;

        let lastOption = _element.options.length - 1;

        for (let option = lastOption; option >= 0; option--) {
            _element.remove(option);
        }
    };

    this.addOptions = (function () {
        let option = document.createElement("option");
        option.defaultSelected = true;
        option.textContent = "All Episodes";
        option.setAttribute("id", -1);
        option.setAttribute("option-index", -1);
        _element.appendChild(option);
        _episodes.forEach((episode, index) => {
            option = document.createElement("option");
            option.setAttribute("id", episode.id);
            option.setAttribute("option-index", index);
            option.textContent = this.getEpisodeText(episode);
            _element.appendChild(option);
        });

        return this;
    })

    this.getElement = function () {
        return _element;
    };
}