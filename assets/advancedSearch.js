/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
let localData = {};
let gameSelection;
let sortOrder = document.querySelector('#SortBy').value;
let available = true;
let colors;
let query;
let lowPrice = null;
let highPrice = null;
let searchURL;
let offset = 0;

// Pull Last selected game from storage
if (localStorage.getItem('advancedSearch')) {
    localData = JSON.parse(localStorage.getItem('advancedSearch'));
    if (localData.game) {
        gameSelection = localData.game;
    }
    if (localData.order) {
        sortOrder = localData.order;
    }
    if (localData.availabilty) {
        available = localData.availabilty;
    }
} else {
    localStorage.setItem('advancedSearch', JSON.stringify({ availabilty: true, order: sortOrder }));
    localData['availabilty'] = true;
    localData['order'] = sortOrder;

}

//Fetch the available games for the store
let supportedGames = []
let sidebar
$.ajax({
    url: "https://portal.binderpos.com/external/shopify/supportedGames?storeUrl=" + window.theme.permanentDomain,
    type: "GET",
    dataType: "json",
    success: function (res) {
        supportedGames = res.filter(data => data.gameName != null);
        localStorage.setItem('advancedSearch', JSON.stringify({ "game": supportedGames[0].gameId }));
        createFilterDisplay()
    }
});

// If URL contains a Game param, update the selection
if (new URLSearchParams(window.location.search).get('game')) {
    gameSelection = new URLSearchParams(window.location.search).get('game');
}

if (new URLSearchParams(window.location.search).get('order')) {
    sortOrder = new URLSearchParams(window.location.search).get('order');
}

if (new URLSearchParams(window.location.search).get('availabilty')) {
    available = new URLSearchParams(window.location.search).get('availabilty') == "true" ? true : false;
}

if (new URLSearchParams(window.location.search).get('colors')) {
    colors = new URLSearchParams(window.location.search).get('colors');
}

if (new URLSearchParams(window.location.search).get('q')) {
    query = new URLSearchParams(window.location.search).get('q');
}

if (new URLSearchParams(window.location.search).get('pricemin')) {
    lowPrice = new URLSearchParams(window.location.search).get('pricemin');
}

if (new URLSearchParams(window.location.search).get('pricemax')) {
    highPrice = new URLSearchParams(window.location.search).get('pricemax');
}

if (new URLSearchParams(window.location.search).get('page')) {
    offset = ((new URLSearchParams(window.location.search).get('page')) - 1) * 18;
}


//Add filter to the themes sidebar
function createFilterDisplay() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var sidebar = document.querySelector('.card__section.card__section--tight');
    var filter = document.createElement('div')
    filter.className = "left-column tag-filter";
    filter.innerHTML = `<p class="card__title--small heading">Filter</p>`;
    if (width > 991) {
        sidebar.prepend(filter);
    } else {
        $('.collection-drawer__inner').append(filter)
    }
    var filterContainer = document.createElement('div');
    filterContainer.className = "left-inner collapse left-dropdown";
    filterContainer.id = "filter-container";
    filter.appendChild(filterContainer);
    var filterList = document.createElement('div');
    filterList.className = "filters-toolbar__input filters-toolbar__input--filter";
    filterContainer.appendChild(filterList);
    var label = document.createElement('label');
    label.innerHTML = "Game";
    label.id = "game";
    label.style = "text-transform: capitalize; margin-bottom: 5px; font-size: 10px; color: #27302f; font-weight: 500;"
    var gameSelect = document.createElement('select');
    gameSelect.style = "width: 100%; display: block;"
    gameSelect.id = "game";
    gameSelect.onchange = function (event) {
        document.querySelector('.product-list.product-list--collection').innerHTML = "";
        showLoader(true);
        localData['game'] = event.target.value;
        localStorage.setItem('advancedSearch', JSON.stringify(localData))
        query = "";
        offset = 0
        gameSelection = event.target.value;
        getAvailableFiltersForGame()
        $('label:not(label#game, label#q, label#priceMin, label#priceMax,label#availabilty, .sidebar-title)').remove();
        $('input#q').val('')
    }
    supportedGames.forEach((game, index) => {
        var opt = document.createElement("option");
        opt.value = game.gameId;
        if (index == 0 && gameSelection == undefined) {
            gameSelection = game.gameId;
        }
        opt.innerHTML = game.gameName
        if (game.gameId == gameSelection) {
            opt.selected = true;
        }
        gameSelect.appendChild(opt);
    });
    label.appendChild(gameSelect);
    filterList.appendChild(label);
    var hr = document.createElement('hr');
    hr.style = "margin: 13px 10px;";
    filterList.appendChild(hr);
    var label = document.createElement('label');
    label.innerHTML = "Search Card Name";
    label.style = "text-transform: capitalize; margin-bottom: 10px; font-size: 10px; color: #27302f; font-weight: 500;"
    label.id = "q";
    filterList.appendChild(label)
    var queryInput = document.createElement('input');
    queryInput.id = "q";
    queryInput.placeholder = "Search by Card Name";
    if (query) {
        queryInput.value = query;
    }
    queryInput.style = "width: 100%; display: block; text-transform: capitalize; border: 1px solid rgb(170 170 170); margin-top: 5px; padding: 8px 6px; height: 33px; border-radius: 4px;";
    queryInput.onkeydown = function () { clearTimeout(typingTimer); }
    queryInput.onkeyup = function () { clearTimeout(typingTimer); typingTimer = setTimeout(doneTyping, doneTypingInterval); }
    label.appendChild(queryInput);
    var hr = document.createElement('hr');
    hr.style = "margin: 13px 10px;";
    filterList.appendChild(hr);
    var label = document.createElement('label');
    label.innerHTML = "Availabilty";
    label.id = "availabilty";
    label.style = "text-transform: capitalize; margin-bottom: 5px; font-size: 10px; color: #27302f; font-weight: 500;"
    var availabiltySelect = document.createElement('select');
    availabiltySelect.style = "width: 100%; display: block;"
    availabiltySelect.id = "availabilty";
    availabiltySelect.onchange = function (event) {
        offset = 0
        document.querySelector('.product-list.product-list--collection').innerHTML = "";
        showLoader(true);
        localData['availabilty'] = event.target.value;
        available = event.target.value;
        localStorage.setItem('advancedSearch', JSON.stringify(localData))
        getAvailableFiltersForGame()
        $('label:not(label#game, label#q, label#priceMin, label#priceMax,label#availabilty, .sidebar-title)').remove();
    }
    var opt = document.createElement("option");
    opt.value = true;
    opt.innerHTML = "Instock Only"
    if (available == "true" || available == true) {
        opt.selected = true;
    }
    availabiltySelect.appendChild(opt);
    var opt = document.createElement("option");
    opt.value = false;
    opt.innerHTML = "All Singles"
    if (available == "false" || available == false) {
        opt.selected = true;
    }
    availabiltySelect.appendChild(opt);
    label.appendChild(availabiltySelect);
    filterList.appendChild(label);
    var hr = document.createElement('hr');
    hr.style = "margin: 13px 10px;";
    filterList.appendChild(hr);
    var priceDiv = document.createElement('div')
    priceDiv.style = "display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px;";
    filterList.appendChild(priceDiv);
    var label = document.createElement('label');
    label.innerHTML = "Min Price";
    label.id = "priceMin";
    label.style = "text-transform: capitalize; margin-bottom: 5px; font-size: 10px; color: #27302f; font-weight: 500;";
    priceDiv.append(label)
    var priceMin = document.createElement('input');
    priceMin.id = "priceMin";
    priceMin.type = "number";
    priceMin.placeholder = Shopify.formatMoney(0, window.theme.moneyWithCurrencyFormat)
    if (lowPrice) {
        priceMin.value = lowPrice;
    }
    priceMin.style = "width: 100%; display: block; text-transform: capitalize; border: 1px solid rgb(170 170 170); margin-top: 5px; padding: 8px 6px; height: 33px; border-radius: 4px;";
    priceMin.onkeydown = function () { clearTimeout(typingTimer); }
    priceMin.onkeyup = function () { clearTimeout(typingTimer); typingTimer = setTimeout(doneTyping, doneTypingInterval); }
    label.appendChild(priceMin);
    var label = document.createElement('label');
    label.innerHTML = "Max Price";
    label.id = "priceMax";
    label.style = "text-transform: capitalize; margin-bottom: 5px; font-size: 10px; color: #27302f; font-weight: 500;";
    priceDiv.append(label)
    var priceMax = document.createElement('input');
    priceMax.id = "priceMax";
    priceMax.placeholder = Shopify.formatMoney(0, window.theme.moneyWithCurrencyFormat)
    priceMax.type = "number";
    if (highPrice) {
        priceMax.value = highPrice;
    }
    priceMax.style = "width: 100%; display: block; text-transform: capitalize; border: 1px solid rgb(170 170 170); margin-top: 5px; padding: 8px 6px; height: 33px; border-radius: 4px;";
    priceMax.onkeydown = function () { clearTimeout(typingTimer); }
    priceMax.onkeyup = function () { clearTimeout(typingTimer); typingTimer = setTimeout(doneTyping, doneTypingInterval); }
    label.appendChild(priceMax);
    filterList.appendChild(priceDiv);
    var hr = document.createElement('hr');
    hr.style = "margin: 13px 10px;";
    filterList.appendChild(hr);
    getAvailableFiltersForGame();
    showLoader(true);
}

//Loader Display
function showLoader(state) {
    if (state) {
        var loaderDiv = document.createElement('div');
        loaderDiv.className = "lds-ripple";
        loaderDiv.innerHTML = "<div></div><div></div>"
        document.querySelector('.product-list.product-list--collection').appendChild(loaderDiv)
        var loaderCount = document.createElement('div');
        loaderCount.className = "lds-facebook";
        loaderCount.innerHTML = "<div></div><div></div><div></div>"
        document.querySelector('.filters-toolbar__product-count').innerHTML = '<div class="lds-facebook"><div></div><div></div><div></div></div>'
        $('.collection__products-count').html('<div class="lds-facebook"><div></div><div></div><div></div></div>')
    } else {
        if (document.querySelector('.product-list.product-list--collection .lds-ripple')) {
            document.querySelector('.product-list.product-list--collection .lds-ripple').remove()
        }
    }
}

//Fire this command when updating a field. Rebuilds search params
function updateEventHandlers() {
    sidebar = document.querySelector('.card__section.card__section--tight');
    var filters = sidebar.querySelectorAll('select');
    var sort = document.querySelector('#SortBy');
    window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname }, '', window.location.protocol + "//" + window.location.host + window.location.pathname);
    let queryInput = document.querySelector('input#q');
    let priceMin = document.querySelector('input#priceMin')
    let priceMax = document.querySelector('input#priceMax')
    if (history.pushState) {
        var params = new URLSearchParams(window.location.search);
        params.set("q", queryInput.value);
        query = queryInput.value;
        window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());
    }
    filters.forEach(filter => {
        if (history.pushState) {
            var params = new URLSearchParams(window.location.search);
            if (filter.id != "game") {
                var newParam = ""
                var selected = filter.querySelectorAll("option:checked")
                for (i = 0; i < selected.length; i++) {
                    newParam += (i > 0 ? "+" : "") + encodeURI(selected[i].value);
                }
                params.set(filter.id, newParam);
            } else {
                params.set(filter.id, filter.value);
            }
            window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());
        }
    })
    if (history.pushState) {
        var params = new URLSearchParams(window.location.search);
        params.set("pricemin", priceMin.value);
        lowPrice = priceMin.value;
        window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());
        var params = new URLSearchParams(window.location.search);
        params.set("pricemax", priceMax.value);
        highPrice = priceMax.value;
        window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());
        var params = new URLSearchParams(window.location.search);
        params.set("page", ((offset / 18) + 1));
        window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());

    }
    var params = new URLSearchParams(window.location.search);
    params.set("order", sort.value);
    window.history.pushState({ path: window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString() }, '', window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString());
    searchURL = window.location.search;
    localStorage.setItem('advancedSearch', JSON.stringify(localData))
    renderProducts();
}


async function fetchAvailableFiltersForGame() {
    let [setsResponse, colorsResponse, monsterTypesResponse, raritiesResponse, typeResponse] = await Promise.all([
        fetch('https://portal.binderpos.com/api/cards/' + gameSelection + '/sets', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch('https://portal.binderpos.com/api/cards/' + gameSelection + '/colors', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch('https://portal.binderpos.com/api/cards/' + gameSelection + '/monsterTypes', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch('https://portal.binderpos.com/api/cards/' + gameSelection + '/rarities', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch('https://portal.binderpos.com/api/cards/' + gameSelection + '/types', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    ]);
    let sets = await setsResponse.json();
    let colors = await colorsResponse.json();
    let monsterTypes = await monsterTypesResponse.json();
    let rarities = await raritiesResponse.json();
    let types = await typeResponse.json();

    return [sets, colors, monsterTypes, rarities, types];
}

//Function to collect available filters for selected game
let currentFilters = [];
function getAvailableFiltersForGame() {
    currentFilters = [];
    fetchAvailableFiltersForGame().then(([sets, colors, monsterTypes, rarities, types]) => {
        if (sets.length > 0) {
            currentFilters.push({ 'filter': 'setNames', 'data': sets });
        }
        if (colors.length > 0) {
            currentFilters.push({ 'filter': 'colors', 'data': colors });
        }
        if (monsterTypes.length > 0) {
            currentFilters.push({ 'filter': 'monsterTypes', 'data': monsterTypes });
        }
        if (rarities.length > 0) {
            currentFilters.push({ 'filter': 'rarities', 'data': rarities });
        }
        if (types.length > 0) {
            currentFilters.push({ 'filter': 'types', 'data': types });
        }
        renderFilters(currentFilters);
    }).catch(err => {
        // Error handling
        console.log(err);
    });
}

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 1 second for example

function doneTyping() {
    document.querySelector('.product-list.product-list--collection').innerHTML = "";
    showLoader(true);
    offset = 0
    updateEventHandlers();
}

//Render the filters for the game
function renderFilters(currentFilters) {
    currentFilters.forEach(filter => {
        var label = document.createElement('label');
        label.innerHTML = (filter.filter == "setNames" ? "Sets" : filter.filter == "monsterTypes" ? "Monster Type" : filter.filter);
        label.style = "text-transform: capitalize; margin-bottom: 10px; font-size: 10px; color: #27302f; font-weight: 500;"
        label.id = filter.filter
        var filterSelect = document.createElement('select');
        filterSelect.style = "width: 100%; display: block; text-transform: capitalize;"
        filterSelect.id = filter.filter;
        filterSelect.setAttribute('multiple', 'multiple')
        filterSelect.setAttribute('data-placeholder', 'Browse All ' + (filter.filter == "setNames" ? "Sets" : filter.filter == "monsterTypes" ? "Monster Type" : filter.filter))
        filterSelect.onchange = function (event) {
            document.querySelector('.product-list.product-list--collection').innerHTML = "";
            showLoader(true);
            offset = 0
            localData[filter.filter] = event.target.value;
            localStorage.setItem('advancedSearch', JSON.stringify(localData))
            updateEventHandlers();
        }
        filter.data.forEach(row => {
            let opt = document.createElement("option");
            opt.value = typeof row === 'object' ? row.id.toLowerCase() : row.toLowerCase();
            opt.innerHTML = typeof row === 'object' ? row.value.toLowerCase() : row.toLowerCase();
            if (new URLSearchParams(window.location.search).get(filter.filter)) {
                var results = decodeURI(new URLSearchParams(window.location.search).get(filter.filter)).split('+')
                if (results.includes((typeof row === 'object' ? row.id.toLowerCase() : row.toLowerCase()))) {
                    opt.selected = true
                }
            }
            if (opt.value !== "null") {
                filterSelect.appendChild(opt);
            }
        });
        label.appendChild(filterSelect)
        document.querySelector('.filters-toolbar__input').appendChild(label)
    })
    $("[data-section-id='sidebar'] select:not(#shopify-section-advanced_search select#SortBy, [data-section-id='sidebar'] select#availabilty)").select2();
    $("[data-section-id='sidebar'] select#availabilty").select2({ minimumResultsForSearch: -1 });
    updateEventHandlers();
}

//Retrieve products from the server based off current server
async function fetchProducts() {
    var obj = {
        "storeUrl": window.theme.permanentDomain,
        "game": gameSelection,
        "strict": null,
        "sortTypes": [
            {
                "type": sortOrder.split("-")[0],
                "asc": sortOrder.split("-")[1] == "ascending" ? true : false,
                "order": 1
            }
        ],
        "variants": [],
        "title": query.length > 0 ? query : "",
        "variants": null,
        "priceGreaterThan": lowPrice != "" ? lowPrice : 0,
        "priceLessThan": highPrice != "" ? highPrice : null,
        "instockOnly": available,
        "limit": 18,
        "offset": offset,

    };
    for (var x = 0; x < currentFilters.length; x++) {
        var array = []
        var filter = document.querySelectorAll('select#' + currentFilters[x].filter + " option:checked")
        for (i = 0; i < filter.length; i++) {
            array.push(filter[i].value);
        }
        if (array.length > 0) {
            obj[currentFilters[x].filter] = array;
        }
    }
    obj = JSON.stringify(obj)
    let productsResponse = await $.ajax({
        url: "https://portal.binderpos.com/external/shopify/products/forStore",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: obj,
        success: function (result) {
            updatePagination(result)
            return result
        },
        error: function (result) { // TODO If no results
            console.log(result);
        }
    });
    let products = await productsResponse;

    return products;
}

function updatePagination(data) {
    //var pages = Math.ceil(data.count / 18);
    //var current_page = (data.offset / 18) + 1;
    var current_first_item = (data.offset + 1);
    var current_last_item = data.offset + (data.products.length)
    //var total = data.count;
    var pagination__text = document.querySelector('.pagination__text');
    pagination__text.innerHTML = `Showing ` + current_first_item + ` - ` + current_last_item;

    var pag_previous = document.querySelector('.pag_previous');
    if (data.offset == 0) {
        pag_previous.onclick = null
        pag_previous.innerHTML = `<div class="btn btn--secondary btn--narrow btn--disabled">
            <i class="material-icons">&#xE314;</i>
            <span class="icon__fallback-text">Prev</span>
        </div>`
    } else {
        pag_previous.onclick = function () {
            document.querySelector('.product-list.product-list--collection').innerHTML = "";
            showLoader(true);
            offset = data.offset - 18;
            updateEventHandlers();
        }
        pag_previous.innerHTML = `<a class="btn btn--secondary btn--narrow">
            <i class="material-icons">&#xE314;</i>
            <span class="icon__fallback-text">Prev</span>
       </a>`
    }

    var pag_next = document.querySelector('.pag_next');
    if (data.products.length < 18) {
        pag_next.onclick = null
        pag_next.innerHTML = `<div class="btn btn--secondary btn--narrow btn--disabled">
        <i class="material-icons">&#xE315;</i>
        <span class="icon__fallback-text">Next</span>
        </div>`
    } else {
        pag_next.onclick = function () {
            document.querySelector('.product-list.product-list--collection').innerHTML = "";
            showLoader(true);
            offset = data.offset + 18;
            updateEventHandlers();
        }
        pag_next.innerHTML = `<a " class="btn btn--secondary btn--narrow">
        <i class="material-icons">&#xE315;</i>
         <span class="icon__fallback-text">Next</span>
        </ a > `
    }
}

function renderProducts() {
    fetchProducts()
        .then((products) => {
            showLoader(false);
            var current_first_item = (products.offset + 1);
            var current_last_item = (products.offset + (products.products.length));
            document.querySelector('.filters-toolbar__product-count').innerHTML = `Showing ` + current_first_item + ` - ` + current_last_item;
            $('.collection__products-count').html(`Showing ` + current_first_item + ` - ` + current_last_item);

            products.products.forEach(product => {
                productItem(product)
            })
        });
}

function renderShortTitle(title) {
    if (title.includes("Near Mint")) {
        return "NM"
    } else if (title.includes("Lightly Played")) {
        return "LP"
    }
    else if (title.includes("Moderately Played")) {
        return "MP"
    }
    else if (title.includes("Heavily Played")) {
        return "HP"
    }
    else if (title.includes("Damaged")) {
        return "DM"
    }
    else if (title.includes("Played")) {
        return "PL"
    }
    else {
        return title
    }

}

function variantSelect(productId, variantId) {
    var product = document.querySelector('.productCard__card[data-productid="' + productId + '"]');
    var selection = document.querySelector('li[data-variantid="' + variantId + '"]');
    var price = selection.getAttribute("data-price");
    var id = product.querySelector('input[name="id"]')
    id.value = variantId;
    var priceDisplay = product.querySelector('.productCard__price');
    var variantTitle = selection.getAttribute("data-variantTitle");
    var max = selection.getAttribute("data-variantQuantity");
    var options = product.querySelectorAll('li');
    options.forEach((option) => {
        if (option.getAttribute("data-variantid") == variantId) {
            option.classList.add('productChip__active');
            if (variantTitle.includes("Foil")) {
                product.classList.add("foiled")
            } else {
                product.classList.remove("foiled")
            }
        } else {
            option.classList.remove('productChip__active');
        }
    });
    priceDisplay.innerHTML = Shopify.formatMoney((price * 100), window.theme.moneyWithCurrencyFormat);
}

function addToCartBtn(id) {
    var btn = document.querySelector(".productCard__button[data-selectedId='" + id + "']")
    var itemTitle = btn.getAttribute("data-selectedProductTitle");
    var maxStock = btn.getAttribute("data-selectedMax");
    var variantTitle = btn.getAttribute("data-selectedVariantTitle");
    addToCart(id, itemTitle, maxStock, 1, variantTitle)
}

function productItem(item) {
    var cardName = item.title.match(/(.+) \[(.+)\]/)[1];
    var setName = item.title.match(/(.+) \[(.+)\]/)[2];
    let order = ["Near Mint", "Near Mint Foil", "Lightly Played", "Lightly Played Foil", "Moderately Played", "Moderately Played Foil", "Heavily Played", "Heavily Played Foil", "Damaged", "Damaged Foil"];
    var searchContainer = document.querySelector(".product-list.product-list--collection");
    var addToCartButton = document.createElement('div');
    var productcard = document.createElement("div");

    productcard.className = "productCard__card";
    productcard.setAttribute("data-productid", item.id);
    var productcard_upper = document.createElement("div");
    productcard_upper.className = "productCard__upper";

    var griditem = document.createElement("a")
    griditem.className = "productCard__a";
    griditem.href = "/products/" + item.handle;

    var imageWrap = document.createElement("div");
    imageWrap.className = "productCard__imageWrap productCard__imageWrapTarget";

    var img = document.createElement("img");
    img.className = "productCard__img";
    img.alt = item.title;
    img.src = item.tcgImage;

    var productcard_lower = document.createElement("div");
    productcard_lower.className = "productCard__lower";

    var type = document.createElement("p");
    type.className = "productCard__setName";
    if (gameSelection == "pokemon") {
        type.innerHTML = item.setName;
    } else {
        type.innerHTML = setName;
    }
    productcard_lower.appendChild(type);

    var title = document.createElement("p");
    title.className = "productCard__title";
    if (gameSelection == "pokemon") {
        title.innerHTML = `<a href="/products/${item.handle}" >${cardName} (${item.collectorNumber})</a>`;
    } else {
        title.innerHTML = `<a href="/products/${item.handle}" >${cardName}</a > `;
    }
    productcard_lower.appendChild(title);

    var chipWrapper = document.createElement('ul');
    chipWrapper.className = "productChip__grid";
    productcard_lower.appendChild(chipWrapper);

    var variantFound = 0;
    let sorted = item.variants.sort((a, b) => (order.indexOf(a.title) - order.indexOf(b.title)) || b.price - a.price);

    sorted.forEach(function (variant) {
        if (variant.quantity > 0 && variant.title != "Default Title") {
            var isFoil = variant.title.toLowerCase().includes("foil") == true;
            
            var chip = document.createElement('li');
            chip.className = "productChip";

            if (variantFound == 0) {
                chip.classList.add("productChip__active");
                var price = document.createElement('p');
                price.className = "productCard__price";
                price.innerHTML = Shopify.formatMoney(((variant.price) * 100), window.theme.moneyWithCurrencyFormat);
                productcard_lower.appendChild(price);
                addToCartButton.innerHTML = `<form method="post" action="/cart/add" id="product_form_id_${item.id}_collection-template" accept-charset="UTF-8" class="product-item__action-list button-stack" enctype="multipart/form-data">
                    <input type="hidden" name="form_type" value="product">
                        <input type="hidden" name="utf8" value="✓">
                            <input type="hidden" name="quantity" value="1">
                                <input type="hidden" name="id" value=${variant.shopifyId}>
                                <button aria-label="Add to Cart" title="Add to Cart" type="submit" class="product-item__action-button productCard__button button--primary" data-action="add-to-cart">Add to cart</button>
                            </form>`;
                if (isFoil) {
                    productcard.classList.add("foiled");                
                }
                variantFound = 1;
            };
    
            chip.onclick = function () {
                variantSelect(item.id, variant.shopifyId);
            };
    
            chip.setAttribute("data-parentid", item.id);
            chip.setAttribute("data-variantId", variant.shopifyId);
            chip.setAttribute("data-price", variant.price);
            chip.setAttribute("data-productTitle", item.title);
            chip.setAttribute("data-variantTitle", variant.title);
            chip.setAttribute("title", variant.title);
            chip.setAttribute("data-variantQuantity", variant.quantity);
    
            chip.innerHTML = renderShortTitle(variant.title);
    
            if (isFoil) {
                chip.style.cssText = "background-image: url('//silvergoblin.cards/cdn/shop/t/8/assets/product-card-bg-holo.png?v=112171655733577053801697678808'); background-size: cover;";                  
            };
    
            chipWrapper.appendChild(chip);
        }
    });

    if (variantFound == 0) {
        addToCartButton.innerHTML = `<div class="productCard__button productCard__button--outOfStock">Out of Stock</div>`;
    }

    imageWrap.appendChild(img);
    griditem.appendChild(imageWrap);
    productcard_upper.appendChild(griditem);
    productcard.appendChild(productcard_upper);
    productcard.appendChild(productcard_lower);
    productcard.appendChild(addToCartButton);
    searchContainer.appendChild(productcard);
}

function findFirstAvailablePrice(data) {
    if (data.overallQuantity == null || data.overallQuantity == 0) {
        if (data.variants[0].price && data.variants[0].price > 0) {
            return Shopify.formatMoney((data.variants[0].price * 100), window.theme.moneyWithCurrencyFormat)
        } else {
            return "Price Unavailable"
        }
    } else {
        var hasStock = data.variants.filter(data => data.quantity > 0)
        if (hasStock[0].price > 0) {
            return Shopify.formatMoney((hasStock[0].price * 100), window.theme.moneyWithCurrencyFormat)
        } else {
            return "Price Unavailable"
        }
    }
}

//Add onchange handler to sort
var sort = document.querySelector('#SortBy');
sort.onchange = function (event) {
    document.querySelector('.product-list.product-list--collection').innerHTML = "";
    showLoader(true);
    localData['order'] = event.target.value;
    sortOrder = event.target.value;
    localStorage.setItem('advancedSearch', JSON.stringify(localData))
    $('label:not(label#game, label#q, label#priceMin, label#priceMax,label#availabilty, .sidebar-title)').remove();
    getAvailableFiltersForGame()
}
for (let i = 0; i < sort.options.length; i++) {
    if (sort.options[i].value == sortOrder) {
        sort.options[i].selected = true;
    }
}
