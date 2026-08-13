/* =========================================================
   SURABAYA GUIDE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   01. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setCurrentYear();

    setActiveNavigation();

    initializeEntertainmentFilter();

    initializeMobileNavigation();

    initializeScrollReveal();

    initializeSmoothScroll();

    initializeImageFallback();

    initializeSearch();

    initializeBackToTop();

    initializeMapButtons();

    initializeRouteToggle();

    initializeDropdowns();

});


/* =========================================================
   02. CURRENT YEAR
========================================================= */

function setCurrentYear() {

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach(function (element) {

        element.textContent = currentYear;

    });

}


/* =========================================================
   03. ACTIVE NAVIGATION
========================================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const navigationLinks =
        document.querySelectorAll(".main-nav a");

    navigationLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();


        /*
            Remove existing active class
        */

        link.classList.remove("active");


        /*
            Add active class to current page
        */

        if (
            linkPage === currentPage ||
            (
                currentPage === "" &&
                linkPage === "index.html"
            )
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   04. ENTERTAINMENT FILTER
========================================================= */

/*
    HTML EXPECTED:

    <input
        type="checkbox"
        name="entertainment"
        value="cinema"
    >


    CARD EXPECTED:

    <article
        class="place-card entertainment-card"
        data-category="cinema"
    >


    MULTIPLE CATEGORIES:

    <article
        class="place-card entertainment-card"
        data-category="arcade,ice-skating"
    >


    LOGIC:

    No filter selected
        → Show everything

    Cinema selected
        → Show Cinema

    Arcade + Cinema selected
        → Show Arcade OR Cinema
*/


function initializeEntertainmentFilter() {

    const filterCheckboxes =
        document.querySelectorAll(
            'input[name="entertainment"]'
        );

    const entertainmentCards =
        document.querySelectorAll(
            ".entertainment-card"
        );


    /*
        If we're not on the Entertainment page,
        do nothing.
    */

    if (
        filterCheckboxes.length === 0 ||
        entertainmentCards.length === 0
    ) {

        return;

    }


    /*
        Listen for checkbox changes
    */

    filterCheckboxes.forEach(
        function (checkbox) {

            checkbox.addEventListener(
                "change",
                function () {

                    applyEntertainmentFilter(
                        filterCheckboxes,
                        entertainmentCards
                    );

                }
            );

        }
    );


    /*
        Initial state:
        show every entertainment card
    */

    showAllEntertainmentCards(
        entertainmentCards
    );

}


/* =========================================================
   05. APPLY ENTERTAINMENT FILTER
========================================================= */

function applyEntertainmentFilter(
    filterCheckboxes,
    entertainmentCards
) {

    /*
        Find all checked categories
    */

    const selectedCategories =
        Array.from(filterCheckboxes)
            .filter(function (checkbox) {

                return checkbox.checked;

            })
            .map(function (checkbox) {

                return checkbox.value
                    .toLowerCase()
                    .trim();

            });


    /*
        If nothing is selected,
        show everything.
    */

    if (
        selectedCategories.length === 0
    ) {

        showAllEntertainmentCards(
            entertainmentCards
        );

        return;

    }


    /*
        Check every entertainment card
    */

    entertainmentCards.forEach(
        function (card) {

            const categoryData =
                card.getAttribute(
                    "data-category"
                );


            /*
                Card has no category
            */

            if (!categoryData) {

                hideEntertainmentCard(card);

                return;

            }


            /*
                Convert:

                "arcade,ice-skating"

                into:

                ["arcade", "ice-skating"]
            */

            const cardCategories =
                categoryData
                    .toLowerCase()
                    .split(",")
                    .map(function (category) {

                        return category.trim();

                    });


            /*
                Check whether at least one
                selected filter matches.
            */

            const matches =
                selectedCategories.some(
                    function (selectedCategory) {

                        return cardCategories.includes(
                            selectedCategory
                        );

                    }
                );


            if (matches) {

                showEntertainmentCard(card);

            } else {

                hideEntertainmentCard(card);

            }

        }
    );

}


/* =========================================================
   06. SHOW ALL ENTERTAINMENT CARDS
========================================================= */

function showAllEntertainmentCards(cards) {

    cards.forEach(function (card) {

        card.style.display = "";

    });

}


/* =========================================================
   07. SHOW ENTERTAINMENT CARD
========================================================= */

function showEntertainmentCard(card) {

    card.style.display = "";

}


/* =========================================================
   08. HIDE ENTERTAINMENT CARD
========================================================= */

function hideEntertainmentCard(card) {

    card.style.display = "none";

}


/* =========================================================
   09. MOBILE NAVIGATION
========================================================= */

function initializeMobileNavigation() {

    const menuButton =
        document.querySelector(
            ".mobile-menu-button"
        );

    const navigation =
        document.querySelector(
            ".main-nav"
        );


    /*
        If mobile navigation doesn't exist,
        do nothing.
    */

    if (
        !menuButton ||
        !navigation
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "mobile-open"
            );

            menuButton.classList.toggle(
                "active"
            );

        }
    );


    /*
        Close menu after selecting a page
    */

    const navigationLinks =
        navigation.querySelectorAll("a");


    navigationLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navigation.classList.remove(
                        "mobile-open"
                    );

                    menuButton.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   10. SCROLL REVEAL
========================================================= */

function initializeScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".place-card, " +
            ".category-card, " +
            ".transport-card, " +
            ".section-heading, " +
            ".category-header, " +
            ".detail-header, " +
            ".attraction"
        );


    if (elements.length === 0) {

        return;

    }


    /*
        If browser doesn't support
        IntersectionObserver,
        leave elements visible.
    */

    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    elements.forEach(function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.6s ease, " +
            "transform 0.6s ease";

    });


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(function (element) {

        observer.observe(element);

    });

}


/* =========================================================
   11. SMOOTH SCROLL
========================================================= */

function initializeSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetID =
                    link.getAttribute("href");


                /*
                    Ignore empty anchors
                */

                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetID
                    );


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });

}


/* =========================================================
   12. IMAGE FALLBACK
========================================================= */

function initializeImageFallback() {

    const images =
        document.querySelectorAll("img");


    images.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                /*
                    Prevent broken images
                    from causing repeated errors.
                */

                image.removeAttribute("src");

                image.classList.add(
                    "image-error"
                );

                image.alt =
                    "Image unavailable";

            }
        );

    });

}


/* =========================================================
   13. SEARCH
========================================================= */

/*
    OPTIONAL SEARCH INPUT:

    <input
        type="text"
        id="placeSearch"
    >


    Cards can optionally have:

    data-search="Pakuwon Mall cinema arcade"
*/


function initializeSearch() {

    const searchInput =
        document.querySelector(
            "#placeSearch"
        );

    const cards =
        document.querySelectorAll(
            ".place-card"
        );


    /*
        Search isn't present on this page
    */

    if (
        !searchInput ||
        cards.length === 0
    ) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();


            cards.forEach(function (card) {

                const searchableText =
                    (
                        card.dataset.search ||
                        card.textContent
                    )
                        .toLowerCase();


                if (
                    searchableText.includes(
                        searchTerm
                    )
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

}


/* =========================================================
   14. BACK TO TOP
========================================================= */

function initializeBackToTop() {

    const button =
        document.querySelector(
            ".back-to-top"
        );


    if (!button) {

        return;

    }


    /*
        Show button after scrolling
    */

    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 500
            ) {

                button.classList.add(
                    "visible"
                );

            } else {

                button.classList.remove(
                    "visible"
                );

            }

        }
    );


    /*
        Scroll to top
    */

    button.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   15. GOOGLE MAP BUTTON
========================================================= */

/*
    OPTIONAL HTML:

    <a
        href="#"
        class="map-button"
        data-lat="-7.2575"
        data-lng="112.7521"
    >
        Open in Google Maps
    </a>
*/


function initializeMapButtons() {

    const buttons =
        document.querySelectorAll(
            ".map-button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const latitude =
                    button.dataset.lat;

                const longitude =
                    button.dataset.lng;


                if (
                    !latitude ||
                    !longitude
                ) {

                    return;

                }


                const mapURL =
                    "https://www.google.com/maps/search/" +
                    "?api=1&query=" +
                    latitude +
                    "," +
                    longitude;


                window.open(
                    mapURL,
                    "_blank"
                );

            }
        );

    });

}


/* =========================================================
   16. TRANSPORTATION ROUTE TOGGLE
========================================================= */

/*
    BUTTON:

    <button
        class="route-toggle"
        data-target="route-01"
    >
        View Route
    </button>


    CONTENT:

    <div
        id="route-01"
        class="route-details"
    >
        ...
    </div>
*/


function initializeRouteToggle() {

    const buttons =
        document.querySelectorAll(
            ".route-toggle"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetID =
                    button.dataset.target;


                const target =
                    document.getElementById(
                        targetID
                    );


                if (!target) {

                    return;

                }


                target.classList.toggle(
                    "open"
                );

                button.classList.toggle(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   17. DROPDOWNS
========================================================= */

/*
    OPTIONAL STRUCTURE:

    <div class="dropdown">

        <button class="dropdown-button">
            More
        </button>

        <div class="dropdown-menu">
            ...
        </div>

    </div>
*/


function initializeDropdowns() {

    const dropdownButtons =
        document.querySelectorAll(
            ".dropdown-button"
        );


    dropdownButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const dropdown =
                        button.closest(
                            ".dropdown"
                        );


                    if (!dropdown) {

                        return;

                    }


                    dropdown.classList.toggle(
                        "open"
                    );

                }
            );

        }
    );


    /*
        Close dropdowns when clicking elsewhere
    */

    document.addEventListener(
        "click",
        function () {

            const openDropdowns =
                document.querySelectorAll(
                    ".dropdown.open"
                );


            openDropdowns.forEach(
                function (dropdown) {

                    dropdown.classList.remove(
                        "open"
                    );

                }
            );

        }
    );

}


/* =========================================================
   END OF SCRIPT
========================================================= */