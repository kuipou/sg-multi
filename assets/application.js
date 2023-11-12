 /* eslint-disable */

let permanent_domain = Shopify.shop;
let currencyFormatter = Shopify.money_format

// Buylist link Loader
document.addEventListener('DOMContentLoaded', (event) => {

  var buylistItems = document.body.querySelectorAll('*[href="#buylist"]');
  // TODO remove old buylist
  buylistItems.forEach(function (buylistItem) {
    buylistItem.addEventListener("click", function (e) {
      e.preventDefault();
      buildBuylistOverlay();
    });
  });

  var decklistItems = document.body.querySelectorAll('*[href="#decklist"]');
  decklistItems.forEach(function (decklistItem) {
    decklistItem.addEventListener("click", function (e) {
      e.preventDefault();
      showDecklist()
    });
  });
});
/// End Loaders

function text_truncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};


//Buylist
var overlayStyle = 'position: fixed; top: 0; right: 0; z-index: 999999999; width: 85%; height: 100%; background: rgba(0,0,0,0.75);';
var iframeDivStyle = 'text-align: center; position: absolute; width: 100%; height: 100%;';
var closeStyle = 'color:white; position: absolute; top: 8px; left: 3px; height: 3rem; width:3rem; cursor: pointer; font-size: 22px';

function buylistIsInstalled() {
  return window.binderPOSBuylist && window.binderPOSBuylist.portalUrl && window.binderPOSBuylist.portalUrl.length > 0;
}

function buildBuylistOverlay() {
  var currentOverlay = document.querySelector("binderpos-buylist-overlay");
  if (!currentOverlay && buylistIsInstalled()) {
    var buylistOverlay = document.createElement('div');
    buylistOverlay.id = 'binderpos-buylist-overlay';
    buylistOverlay.setAttribute('style', overlayStyle);

    buylistOverlay.addEventListener('click', e => {
      if (e.target == buylistOverlay) {
        removeElement(buylistOverlay);
      }
    });

    var iframeContainer = document.createElement('div');
    iframeContainer.id = 'binderpos-buylist-iframe-container';
    iframeContainer.setAttribute('style', iframeDivStyle);

    iframeContainer.addEventListener('click', e => {
      if (e.target == iframeContainer) {
        removeElement(buylistOverlay);
      }
    })

    var iframeClose = document.createElement('div');
    iframeClose.setAttribute('style', closeStyle);

    var iframeIcon = document.createElement("i");
    iframeIcon.className = "fa fa-times-circle";
    iframeClose.appendChild(iframeIcon);

    iframeClose.addEventListener('click', e => {
      if (e.target == iframeClose || e.target == iframeIcon) {
        removeElement(buylistOverlay);
      }
    })

    iframeContainer.appendChild(iframeClose);

    var iframeContent = document.createElement('iframe');
    iframeContent.className = "binderpos-buylist-iframe";
    iframeContent.setAttribute('style', 'width: 1px !important; min-width: 100%;');
    iframeContent.setAttribute('height', '100%');
    iframeContent.setAttribute('scrolling', 'no');
    iframeContent.setAttribute('frameborder', 0);
    iframeContent.setAttribute('allowfullscreen', 'true');
    iframeContent.src = window.binderPOSBuylist.portalUrl;

    iframeContainer.appendChild(iframeContent);

    buylistOverlay.appendChild(iframeContainer);

    document.body.appendChild(buylistOverlay);
  } else {
    console.log("Buylist not installed");
  }

  function removeElement(node) {
    node.parentNode.removeChild(node);
  }
}

//show Decklist

function showDecklist(oldSearch, auto) {
  var body = document.body
  body.classList.add('noscroll');
  var decklistOverlay = document.querySelector('#decklistOpened');
  var clostBtn = document.querySelector('#decklist-close-button');
  var deckListBody = document.querySelector('#deckListBody');
  if (oldSearch) {
    deckListBody.innerHTML = "";
    var buttonText = decklistOverlay.querySelector('#decklistAction button');
    buttonText.innerHTML = "Submit deck list";
  }
  var decklistBtnAction = document.querySelector('#decklistAction button');
  decklistOverlay.classList.remove('hide');
  decklistOverlay.addEventListener("click", function (e) {
    if (e.target == decklistOverlay || e.target == clostBtn) {
      decklistOverlay.classList.add('hide');
      deckListBody.innerHTML = "";
      decklistBtnAction.innerHTML = "Submit deck list"
      var body = document.body;
      body.classList.remove('noscroll');
    }
  });
  $.ajax({
    url: "https://portal.binderpos.com/external/shopify/supportedGames?storeUrl=" + permanent_domain,
    type: "GET",
    dataType: "json",
    success: function (games) {
      var gameSelector = document.createElement('select');
      gameSelector.id = "gameType";
      deckListBody.appendChild(gameSelector);
      games.forEach(game => {
        var gameSelect = document.querySelector('#gameType');
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(game.gameName.substring(0, 24)));
        opt.value = game.gameId;
        if (game.gameId == "mtg") {
          opt.selected = true;
        }
        gameSelect.appendChild(opt);
      });
    }
  });
  var deckListInput = document.createElement('textarea');
  deckListInput.id = "deck-builder";
  if (oldSearch) {
    deckListInput.value = oldSearch;
    if (deckListInput.value.length > 0) {
      deckListInput.style.background = "white";
    } else {
      deckListInput.style.background = "transparent";
    }
  }
  var decklistTextImgWrapper = document.createElement('div');
  decklistTextImgWrapper.className = "textImgWrapper";
  var decklistTextImg = document.createElement('img');
  decklistTextImg.src = "https://storage.googleapis.com/binderpos-libraries/buylistCards.png";
  var decklistText = document.createElement('span');
  decklistText.innerHTML = "Paste your decklist here using MTGGoldfish format <br><br>Example<br>------------------<br>3 Beanstalk Giant<br>  4 Fae of Wishes<br>   3 Hydroid Krasis<br>   4 Golos, Tireless Pilgrim<br>  2 Kenrith, the Returned King<br>   2 Forest";
  deckListInput.addEventListener('input', () => {
    var textLn = deckListInput.value.length;
    if (textLn >= 1) {
      deckListInput.style.background = "white";
    } else {
      deckListInput.style.background = "transparent";
    }
  });
  decklistTextImgWrapper.appendChild(decklistTextImg);
  decklistTextImgWrapper.appendChild(decklistText);
  deckListBody.appendChild(decklistTextImgWrapper);
  deckListBody.appendChild(deckListInput);
  decklistBtnAction.onclick = processDeckList;
  if (auto) {
    deckListInput.style.background = "white";
    deckListInput.innerHTML = auto.join('\r\n').replace(/\//gm, " // ");
    processDeckList()
  }
}

// Process Deck List
function processDeckList() {
  var backData = $('#deck-builder').val()
  var deckList = $('#deck-builder').val().split('\n');
  var deckBody = document.querySelector('#deckListBody');
  var loader = document.querySelector('#savedLoader');
  var type = "mtg";
  var gameSelector = document.querySelector('#gameType');
  if (gameSelector) {
    type = document.querySelector('#gameType option:checked').value;
  }
  deckBody.innerHTML = loader.innerHTML;
  deckList = parseDeckList(deckList)
  return $.ajax({
    url: "https://portal.binderpos.com/external/shopify/decklist?storeUrl=" + permanent_domain + "&type=" + type,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(deckList),
    success: function (result) {
      deckBody.innerHTML = "";
      var backBtn = document.createElement('span');
      backBtn.className = "backBtn";
      backBtn.innerHTML = "<i class='fas fa-long-arrow-alt-left'></i> Re-enter list";
      backBtn.addEventListener("click", function () {
        showDecklist(backData);
      });
      deckBody.appendChild(backBtn);
      var decklistBtnAction = document.querySelector('#decklistAction button');
      decklistBtnAction.innerHTML = "Add selected cards to cart"
      decklistBtnAction.onclick = compileDeckList;
      var decklistActions = document.createElement('div');
      decklistActions.className = "decklistActions";
      var checkboxallLabel = document.createElement('label');
      checkboxallLabel.className = "checkbox";
      var checkboxallInput = document.createElement('input');
      checkboxallInput.type = "checkbox";
      checkboxallInput.onclick = toggleall;
      checkboxallInput.checked = true
      var checkboxallSpan = document.createElement('span');
      checkboxallSpan.className = "checkmark";
      var labelText = document.createElement('p');
      labelText.innerHTML = "Select all"
      checkboxallLabel.appendChild(checkboxallInput);
      checkboxallLabel.appendChild(checkboxallSpan);
      checkboxallLabel.appendChild(labelText);
      var totals = document.createElement('div');
      totals.className = "totals";
      totals.innerHTML = "Total:"
      var totalAmount = document.createElement('em');
      totalAmount.className = "totalAmmount";
      totalAmount.innerHTML = Shopify.formatMoney(0, window.theme.moneyWithCurrencyFormat);
      totals.appendChild(totalAmount);
      decklistActions.appendChild(checkboxallLabel);
      decklistActions.appendChild(totals);
      deckBody.appendChild(decklistActions);
      var notFoundList = [];
      result.forEach(function (resultLine) {
        if (resultLine.found == 0) {
          notFoundList.push(resultLine);
        }
        var options;
        if (resultLine.products.length > 0) {
          options = resultLine.products;
        }
        var added = 0;
        resultLine.products.forEach(function (item) {
          var requested = resultLine.requested;
          var avaialable = item.variants[0].quantity;
          if (added < requested) {
            var itemMax = 0;
            if ((requested - added) < avaialable) {
              itemMax = avaialable;
            } else {
              itemMax = avaialable;
            }
            if (avaialable > requested) {
              itemMax = requested - added;
            }
            added += avaialable;
            decklistItem(item, deckBody, itemMax, avaialable, options);
          }
        })
      });
      // Activate swap toggle
      swapToggle()
      toggleall()
      notFoundList.forEach(function (element) {
        noDeckListItem(deckBody, element.searchName, element.validName, element.imageUrl, element.requested);
      });
    },
    error: function (result) {
      console.log("Error below")
      console.log(result);
    }
  });
}
//Decklist No Stock & Failed Items
function noDeckListItem(deckBody, name, valid, imgUrl, requested) {
  var deckListItem = document.createElement('div')
  deckListItem.id = "deckItem";
  if (valid == false) {
    deckListItem.style.background = "#efeeee";
  }
  deckListItem.className = "decklistItem nostockAvail";
  deckBody.appendChild(deckListItem);
  var blank = document.createElement('div');
  deckListItem.appendChild(blank);
  var img = document.createElement('img');
  img.className = "decklistImg";
  if (valid) {
    img.src = imgUrl;
  } else {
    img.src = "https://storage.googleapis.com/binderpos-libraries/cardNoImage.png";
  }
  deckListItem.appendChild(img);
  var ammountDiv = document.createElement('div');
  ammountDiv.className = "required";
  var selectedAmmount = document.createElement('span');
  selectedAmmount.className = "selectedAmount";
  selectedAmmount.innerHTML = "0";
  var requestedAmmount = document.createElement('span');
  requestedAmmount.className = "requestedAmount";
  requestedAmmount.innerHTML = "/" + requested;
  ammountDiv.appendChild(selectedAmmount);
  ammountDiv.appendChild(requestedAmmount);
  deckListItem.appendChild(ammountDiv);
  var info = document.createElement('div');
  info.className = "decklistTitleNoStock";
  info.innerHTML = text_truncate(name, 35, "...");
  deckListItem.appendChild(info);
  if (valid) {
    var price = document.createElement('div');
    price.className = "linePrice";
    price.innerHTML = "?";
    price.style.marginLeft = "16px";
    deckListItem.appendChild(price);
    var noStock = document.createElement('div');
    noStock.className = "noStock";
    noStock.innerHTML = "No stock";
    deckListItem.appendChild(noStock);
  } else {
    var unknownCard = document.createElement('div');
    unknownCard.className = "unknown";
    unknownCard.innerHTML = "Unknown card";
    deckListItem.appendChild(unknownCard);
  }
}


//Decklist Line Items
function decklistItem(item, deckBody, itemMax, avaialable, options, swap) {
  var currentLine = item.variants[0]
  if (swap != "true") {
    // New Item
    var deckListItem = document.createElement('div')
    deckListItem.id = "deckItem" + currentLine.shopifyId;
    deckListItem.className = "decklistItem";
    deckBody.appendChild(deckListItem);
  } else {
    // If item already exists, dont create a new div. Swap the details
    deckListItem = document.querySelector("#deckItem" + currentLine.shopifyId);
  }
  var checkboxLabel = document.createElement('label');
  checkboxLabel.className = "checkbox";
  var checkboxInput = document.createElement('input');
  checkboxInput.type = "checkbox";
  checkboxInput.onclick = toggleOne;
  var checkboxSpan = document.createElement('span');
  checkboxSpan.className = "checkmark";
  checkboxLabel.appendChild(checkboxInput);
  checkboxLabel.appendChild(checkboxSpan);
  var img = document.createElement('img');
  img.className = "decklistImg";
  img.src = item.img;
  var price = document.createElement('div');
  price.className = "linePrice";
  price.setAttribute("data-price", currentLine.price);
  price.innerHTML = Shopify.formatMoney(((currentLine.price) * 100), window.theme.moneyWithCurrencyFormat);
  if (options.length == 1) {
    price.style.marginLeft = "16px";
  }
  var ammountDiv = document.createElement('div');
  ammountDiv.className = "required";
  var selectedAmmount = document.createElement('span');
  selectedAmmount.className = "selectedAmount";
  selectedAmmount.innerHTML = itemMax;
  var requestedAmmount = document.createElement('span');
  requestedAmmount.className = "requestedAmount";
  requestedAmmount.innerHTML = "/" + itemMax;
  ammountDiv.appendChild(selectedAmmount);
  ammountDiv.appendChild(requestedAmmount);
  var info = document.createElement('div');
  info.className = "decklistTitle";
  var cardName = item.name;
  info.innerHTML = text_truncate(cardName, 35, "...") + "<br> <em class='setName'>" + text_truncate(item.setName, 35, "...") + "</em><br><em>- " + currentLine.title + "</em>";
  var qtyWrapper = document.createElement('div');
  qtyWrapper.className = "qtyWrapper";
  var addAmount = document.createElement('input');
  addAmount.type = "number";
  addAmount.min = "0";
  addAmount.max = avaialable;
  addAmount.value = itemMax;
  addAmount.addEventListener("change", function () {
    decklistQty(currentLine.shopifyId);
  });
  var plusBtn = document.createElement('span');
  plusBtn.className = "addQty";
  plusBtn.innerHTML = "+";
  var minusBtn = document.createElement('span');
  minusBtn.className = "minusQty";
  minusBtn.innerHTML = "-";
  plusBtn.addEventListener("click", function () {
    decklistQty(currentLine.shopifyId, "add");
  });
  minusBtn.addEventListener("click", function () {
    decklistQty(currentLine.shopifyId, "remove");
  });
  deckListItem.appendChild(checkboxLabel);
  deckListItem.appendChild(img);
  deckListItem.appendChild(ammountDiv);
  deckListItem.appendChild(info);

  // If other Card Options then show switcher
  if (options.length > 1) {
    var swapIcon = document.createElement('i');
    swapIcon.className = "fas fa-exchange-alt";
    deckListItem.appendChild(swapIcon);
    // Add event listener to new replaced Item
    if (swap == "true") {
      swapIcon.addEventListener("click", function (e) {
        var lineItem = e.target.parentNode;
        var menuDiv = lineItem.querySelector('.optionsWrapper');
        if (menuDiv.style.display == "block") {
          menuDiv.style.display = "none";
        }
        else {
          menuDiv.style.display = "block";
        }
      });
    }
    var optionsDiv = document.createElement('div');
    optionsDiv.className = "optionsWrapper";
    var headerLine = document.createElement('div');
    headerLine.className = "optionsHeaders";
    headerLine.innerHTML = "<div class='optionTitle'><div>Card Title</div><div>Condtion</div><div>Price</div><div>Availability</div></div>"
    optionsDiv.appendChild(headerLine);

    options.forEach(function (element) {
      // Show card options that not the Current or current condtion
      if (element.title != item.title) {
        var optionLine = document.createElement('div');
        optionLine.id = "option-" + element.shopifyId;
        var fullName = element.name + " [" + element.setName + "]";
        optionLine.innerHTML = "<div class='optionStyle'><div class='cardFields'><div>" + text_truncate(fullName, 37, "...") + "</div><div>" + element.variants[0].title + "</div><div>" + Shopify.formatMoney(((element.variants[0].price) * 100), window.theme.moneyWithCurrencyFormat) + "</div><div>" + element.variants[0].quantity + "  in Stock</div></div></div>";
        optionsDiv.appendChild(optionLine);
        optionLine.addEventListener("click", function () {
          swapLineItem(currentLine.shopifyId, element, itemMax, options);
        });
      } else if (element.variants[0].title != currentLine.title) {
        // If set did match, show other conditions available.
        var optionLine = document.createElement('div');
        optionLine.id = "option-" + element.shopifyId;
        optionLine.innerHTML = "<div class='optionStyle'><div class='cardFields'><div>" + element.name + " [" + element.setName + "]</div><div>" + element.variants[0].title + "</div><div>" + Shopify.formatMoney(((element.variants[0].price) * 100), window.theme.moneyWithCurrencyFormat) + "</div><div>" + element.variants[0].quantity + "  in Stock</div></div></div>";
        optionsDiv.appendChild(optionLine);
        optionLine.addEventListener("click", function () {
          swapLineItem(currentLine.shopifyId, element, itemMax, options);
        });
      }
    });

    deckListItem.appendChild(optionsDiv);
  }
  deckListItem.appendChild(price);
  deckListItem.appendChild(qtyWrapper);
  qtyWrapper.appendChild(minusBtn);
  qtyWrapper.appendChild(addAmount);
  qtyWrapper.appendChild(plusBtn);
  if (itemMax == avaialable) {
    plusBtn.classList.add("maxed");
  }
}

//Swap Decklist Items menu toggle
function swapToggle() {
  var list = [];
  list = document.querySelectorAll('.fa-exchange-alt');
  if (list) {
    list.forEach(function (element) {
      element.addEventListener("click", function (e) {
        var lineItem = e.target.parentNode;
        var menuDiv = lineItem.querySelector('.optionsWrapper');
        if (menuDiv.style.display == "block") {
          menuDiv.style.display = "none";
        }
        else {
          menuDiv.style.display = "block";
        }
      });
    });
  }


}
//Swap Decklist items
function swapLineItem(oldLineId, newLineData, requestQty, options) {
  var deckBody = document.querySelector('#deckListBody');
  var oldDiv = document.querySelector("#deckItem" + oldLineId);
  var state = document.querySelector('.decklistActions input');
  oldDiv.id = "deckItem" + newLineData.variants[0].shopifyId;
  oldDiv.innerHTML = "";
  state.checked = false;
  decklistTotals()
  decklistItem(newLineData, deckBody, requestQty, newLineData.variants[0].quantity, options, "true")
}

// Parse Decklist
function parseDeckList(list) {
  var result = [];
  var i = 0;
  for (i = 0; i < list.length; i++) {
    if (list[i] && !list[i].includes('Pokémon Trading Card Game Deck List') && !list[i].includes('##') && !list[i].includes('Total Cards')) {
      var parsedLine = list[i].match(/([0-9]+) (.+)/)
      // Fix is Qty not inputted with decklist
      if (!parsedLine) {
        parsedLine = [null, 1, list[i]];
      }
      if (parsedLine) {
        const regex1 = /(\d+)(?!.*\d+)/g;
        const regex2 = /(.[A-z]+.)(?!.*[A-z]+)/g;
        if (list[0].includes('Pokémon Trading Card Game Deck List')) {
          result.push({ card: parsedLine[2].replace(regex1, '').replaceAll('\'', '').replaceAll('&', 'and').replace('-GX', ' GX').replace('PR-', '').replace(regex2, ''), quantity: parsedLine[1] });
        } else {
          result.push({ card: parsedLine[2], quantity: parsedLine[1] });
        }
      }
    }
  }
  return result;
}

function decklistTotals() {
  var total = document.querySelector('.totals em');
  var list = document.querySelectorAll('.decklistItem input:checked');
  var parentlist = [];
  for (var i = 0; i < list.length; i++) {
    parentlist.push(list[i].parentNode.parentNode.querySelector('.linePrice').getAttribute('data-price') * list[i].parentNode.parentNode.querySelector('input[type="number"]').value);
  }
  var sum = 0;
  for (var i = 0; i < parentlist.length; i++) {
    sum += parentlist[i]
  }
  total.innerHTML = Shopify.formatMoney(((sum) * 100), window.theme.moneyWithCurrencyFormat)
}

// Decklist Qty Change
function decklistQty(item, action) {
  var lineEdit = document.querySelector('#deckItem' + item).querySelector('input[type="number"]');
  var selectedQty = document.querySelector('#deckItem' + item).querySelector('.selectedAmount');
  var checkbox = document.querySelector('#deckItem' + item).querySelector('input[type="checkbox"]');
  var plusBtn = document.querySelector('#deckItem' + item).querySelector('.addQty');
  var minusBtn = document.querySelector('#deckItem' + item).querySelector('.minusQty');
  var state = document.querySelector('.decklistActions input');
  var maxAvail = parseInt(lineEdit.max);
  var qty = parseInt(lineEdit.value);
  if (action == "add") {
    qty = qty + 1;
    lineEdit.value = qty;
    minusBtn.classList.remove("maxed");
  }
  if (action == "remove") {
    qty = qty - 1;
    lineEdit.value = qty;
    plusBtn.classList.remove("maxed");
  }
  if (qty >= maxAvail) {
    lineEdit.value = maxAvail;
    plusBtn.classList.add("maxed");
  }
  if (qty <= 0 || isNaN(qty)) {
    lineEdit.value = 0;
    checkbox.checked = false;
    minusBtn.classList.add("maxed");
    plusBtn.classList.remove("maxed");
    state.checked = false;
  }
  selectedQty.innerHTML = lineEdit.value;
  decklistTotals();
}
//Toggle Selectall
function toggleall() {
  var state = document.querySelector('.decklistActions input');
  var list = document.querySelectorAll('.decklistItem input');
  if (state.checked == true) {
    list.forEach(function (item) {
      item.checked = true;
    });
    decklistTotals()
  } else {
    list.forEach(function (item) {
      item.checked = false;
    });
    decklistTotals()
  }
}

function toggleOne() {
  var state = document.querySelector('.decklistActions input');
  state.checked = false;
  decklistTotals();
  var state = document.querySelector('.decklistActions input');
  if (state.checked == true) {
    state.checked = false;
  }
}

/// Compile / Build Array for processing
function compileDeckList() {
  var list = document.querySelectorAll('.decklistItem input:checked');
  var parentlist = [];
  for (var i = 0; i < list.length; i++) {
    parentlist.push({ id: list[i].parentNode.parentNode.id.substr(8), quantity: list[i].parentNode.parentNode.querySelector('input[type="number"]').value, properties: {} });
  }
  var deckBody = document.querySelector('#deckListBody');
  var loader = document.querySelector('#savedLoader');
  deckBody.innerHTML = loader.innerHTML;
  var message = deckBody.querySelector('.custom-loader p')
  message.innerHTML = "Processing... Please wait"
  addAllItems(parentlist);
}
// Process Deck List

function addAllItems(array) {
  var queue = [];
  for (var i = 0; i < array.length; i++) {
    queue.push(array[i]);
  }
  jQuery.post('/cart/add.js', {
    items: queue
  }, function () {
    Toastify({
      text: "Decklist items added to cart",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      backgroundColor: '#eb7c00',
      stopOnFocus: true // Prevents dismissing of toast on hover
    }).showToast();
    var decklistOverlay = document.querySelector('#decklistOpened');
    decklistOverlay.classList.add('hide');
    var loader = decklistOverlay.querySelector('.custom-loader');
    loader.parentNode.removeChild(loader);
    var buttonText = decklistOverlay.querySelector('#decklistAction button');
    buttonText.innerHTML = "Submit deck list";
    var body = document.body
    body.classList.remove('noscroll');
    updateItemCount();
  }, 'json');
};


// After decklist has processed . Update Cart quantity
function addAllItemsCallback(value) {
  if (value) {
    var cartCount = document.querySelector('.cart-overview span');
    var mobileCount = document.querySelector('.mobileCartIcon').querySelector('span');
    var cartTotalItems = value.item_count;
    cartCount.innerHTML = cartTotalItems;
    mobileCount.innerHTML = cartTotalItems;
  }
}


function addToCart(item, itemTitle, maxStock, qty, variantTitle) {
  return $.ajax({
    url: "/cart/add.js",
    type: "POST",
    dataType: "json",
    data: 'quantity=' + qty + '&id=' + item,
    success: function () {
      Toastify({
        text: qty + " x " + itemTitle + (variantTitle != "Default Title" ? (" - " + variantTitle) : "") + " added to cart",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        backgroundColor: "#eb7c00",
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
      updateItemCount()
    },
    error: function () {
      Toastify({
        text: "All " + maxStock + " of " + itemTitle + (variantTitle != "Default Title" ? (" - " + variantTitle) : "") + " are in the Cart",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        backgroundColor: "red",
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
    }
  });
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function getTimezone() {
  var currentTime = new Date();
  var currentTimezone = currentTime.getTimezoneOffset();
  currentTimezone = (currentTimezone / 60) * -1;
  var gmt = 'GMT';
  if (currentTimezone !== 0) {
    gmt += currentTimezone > 0 ? '+' : ' ';
    gmt += currentTimezone;
  }
  return gmt
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

Shopify.handleize = function (str) {
  str = str.toLowerCase();

  var toReplace = ['"', "'", "\\", "(", ")", "[", "]"];

  // For the old browsers
  for (var i = 0; i < toReplace.length; ++i) {
    str = str.replace(toReplace[i], "");
  }

  // Replaces non-standard characters aside from é for things like pokémon go
  str = str.replace(/[^a-z^A-Z^0-9^é]+/g, "-");

  if (str.charAt(str.length - 1) == "-") {
    str = str.replace(/-+\z/, "");
  }

  if (str.charAt(0) == "-") {
    str = str.replace(/\A-+/, "");
  }

  return str
};


function lazyLoading() {
  var lazyloadImages;

  if ("IntersectionObserver" in window) {
    lazyloadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function (image) {
      imageObserver.observe(image);
    });
  } else {
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");

    function lazyload() {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function () {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function (img) {
          if (img.offsetTop < (window.innerHeight + scrollTop)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
          }
        });
        if (lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  lazyLoading()
})

function updateItemCount() {
  var url = '';
  let cartIconCount = document.querySelectorAll('.cart-icon-count');

  if (window.theme.pageType !== 'cart') {
    url = "".concat(window.routes.cartUrl, "?view=mini-cart&timestamp=").concat(Date.now());
  } else {
    url = "".concat(window.routes.cartUrl, "?timestamp=").concat(Date.now());
  }
  return fetch(url, {
    credentials: 'same-origin',
    method: 'GET'
  }).then(function (content) {
    content.text().then(function (html) {
      // We extract the data-item-count from the returned element
      var myDiv = document.createElement('div');
      myDiv.innerHTML = html;
      if (myDiv.querySelector('.cart-icon-count')) {
        var newCount = parseInt(myDiv.querySelector('.cart-icon-count').innerHTML);
        cartIconCount.forEach(function (cart) {
          cart.innerHTML = newCount
          if (parseInt(newCount) > 0) {
            cart.style = ""
          } else {
            cart.style = "display:none"
          }
        })
      }
    })
  })
};


// 2/3/22 TODO: refactor naming when prem in monorepo
window.Shopify.adjustCartDropDown = () => {
  const themeThreeHeader = document.querySelector('#mini-cart')
  const themeTwoHeader = document.querySelector('.topBar__cart')
  

  if(themeThreeHeader) {
    return fetch("".concat(window.routes.cartUrl, "?timestamp=").concat(Date.now()), {
      credentials: 'same-origin',
      method: 'GET'
    }).then((content) => { 
      content.text().then((html) => { 
        const placeholderDiv = document.createElement('div')
        placeholderDiv.innerHTML = html

        const newMiniCart = placeholderDiv.querySelector('#mini-cart')
        const newMiniCartContent = newMiniCart.innerHTML
        const newMiniCartCount = newMiniCart.getAttribute("data-item-count")
        
        const curMiniCart = document.querySelector('#mini-cart')
        const curMiniCartCountContainer = document.querySelector('.header__cart-count')

        curMiniCart.innerHTML = newMiniCartContent
        curMiniCart.setAttribute("data-item-count", newMiniCartCount)
        curMiniCartCountContainer.innerText = newMiniCartCount
      })
    })
  } else if (themeTwoHeader) {
    Shopify.getCart(cartData => {
      const curCartCountElement = document.querySelector('.cart-icon-count')
      const newCartCount = cartData.item_count

      if(curCartCountElement) {
        curCartCountElement.innerText = `(${newCartCount})`
      } else {
        const parent = document.querySelector('.topBar__cart')
        const newContainer = document.createElement('div')
        const newCartCountElement = document.createElement('div')

        newContainer.className = "topBar__cartQuantity"
        newCartCountElement.className = "cart-icon-count"
        newCartCountElement.innerText = `(${newCartCount})`

        newContainer.appendChild(newCartCountElement)
        parent.appendChild(newContainer)
      }
    })
  } else {
    updateItemCount();
  }
}

// Wishlist


function wishlistItem(storeUrl, customerId, callback) {
  return $.ajax({
    url: "https://portal.binderpos.com/external/shopify/wishlist/forMe?storeUrl=" + storeUrl + "&shopifyCustomerId=" + customerId,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (callback) {
        callback(result);
      }
    },
    error: function () {
      if (callback) {
        callback(false);
      }
    }
  });
}

//function addToWishlist
function wishlistAdd(id, customer, storeUrl, qty, callback) {
  var obj = JSON.stringify({
    "customerId": customer,
    "variantId": id,
    "quantity": qty,
  });
  return $.ajax({
    url: "https://portal.binderpos.com/external/shopify/wishlist/add?storeUrl=" + storeUrl,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: obj,
    success: function (result) {
      Toastify({
        text: "Added to Wishlist",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
      if (callback) {
        callback(result);
      }
    },
    error: function (result) {
      Toastify({
        text: result.responseJSON.detailedMessage,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        backgroundColor: "red",
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
    }
  });
}

//function Remove from wishlist
function wishlistRemove(id, customer, storeUrl, callback) {
  return $.ajax({
    url: "https://portal.binderpos.com/external/shopify/wishlist/delete/item/forMe?storeUrl=" + storeUrl + "&shopifyCustomerId=" + customer + "&shopifyVariantId=" + id,
    type: "DELETE",
    dataType: "json",
    success: function (result) {
      Toastify({
        text: "Removed from Wishlist",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
      if (callback) {
        callback(result);
      }
    },
    error: function (result) {
      console.log(result);
    }
  });
}