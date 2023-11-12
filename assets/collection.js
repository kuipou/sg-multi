/* eslint-disable babel/no-invalid-this */
/* eslint-disable babel/camelcase */
/* eslint-disable no-undef */

const variableElement = $('#collection-js');

const COLLECTION = JSON.parse(variableElement.attr('data-collection'));
const CURRENT_TAGS = JSON.parse(variableElement.attr('data-current-tags')) || [];
const ALL_TYPES = JSON.parse(variableElement.attr('data-collection-all-types')) || [];
const ALL_TAGS = JSON.parse(variableElement.attr('data-collection-all-tags')) || [];
const COLLECTION_URL = variableElement.attr('data-collection-url');
const SORT_BY = variableElement.attr('data-sort-by');

const TAG1_PREFIX = variableElement.attr('data-tag1Prefix') || null;
const TAG2_PREFIX = variableElement.attr('data-tag2Prefix') || null;
const TAG3_PREFIX = variableElement.attr('data-tag3Prefix') || null;

const PRODUCT_FORM_PRE_ORDER = variableElement.attr('data-product-form-pre-order');
const PRODUCT_FORM_ADD_TO_CART = variableElement.attr('data-product-form-add-to-card');
const PRODUCT_FORM_SOLD_OUT = variableElement.attr('data-product-form-sold-out');

async function fetchAvailableFiltersForGame(gameSelection) {
  const [setsResponse, colorsResponse, monsterTypesResponse, raritiesResponse, typeResponse] = await Promise.all([
    fetch(`https://portal.binderpos.com/api/cards/${gameSelection}/sets`, {method: 'GET', headers: {'Content-Type': 'application/json'}}),
    fetch(`https://portal.binderpos.com/api/cards/${gameSelection}/colors`, {method: 'GET', headers: {'Content-Type': 'application/json'}}),
    fetch(`https://portal.binderpos.com/api/cards/${gameSelection}/monsterTypes`, {method: 'GET', headers: {'Content-Type': 'application/json'}}),
    fetch(`https://portal.binderpos.com/api/cards/${gameSelection}/rarities`, {method: 'GET', headers: {'Content-Type': 'application/json'}}),
    fetch(`https://portal.binderpos.com/api/cards/${gameSelection}/types`, {method: 'GET', headers: {'Content-Type': 'application/json'}}),
  ]);
  const sets = await setsResponse.json();
  const colors = await colorsResponse.json();
  const monsterTypes = await monsterTypesResponse.json();
  const rarities = await raritiesResponse.json();
  const types = await typeResponse.json();

  return {sets, colors, monsterTypes, rarities, types};
}

function selectActiveGameType(allTypes) {
  if (allTypes && allTypes.length === 1) {
    const type = allTypes[0];
    if (type.toLowerCase().includes("mtg single")) {
      return "mtg";
    }
    if (type.toLowerCase().includes("pokemon single")) {
      return "pokemon";
    }
    if (type.toLowerCase().includes("flesh and blood single")) {
      return "fleshandblood";
    }
    if (type.toLowerCase().includes("dragon ball super single")) {
      return "dragonballsuper";
    }
    if (type.toLowerCase().includes("yugioh single")) {
      return "yugioh";
    }
  }
  return null;
}

if ($(window).width() > 1024) {
  $(document).ready(() => {
    $('.productCard__imageWrapTarget').tilt({
      perspective: 2000,
      maxGlare: 0.6,
      glare: true,
      speed: 500,
      scale: 1.01,
    });
  });
}

function convertArrayToOptions(arr) {
  return arr.reduce((acc, set) => {
    return acc + convertTagToOption(set);
  }, '');
}

function convertTagToOption(tag) {
  if (tag) {
    return `<option value="${Shopify.handleize(tag)}">${tag}</option>`;
  }
  return '';
}

function handleSelectActiveOptions(currentTags) {
  let i;
  for (i = 0; i < currentTags.length; i++) {
    if (currentTags[i] !== "") {
      const foundOption = document.querySelector(`.cardFilter__item select option[value='${Shopify.handleize(currentTags[i])}']`);
      if (foundOption) {
        foundOption.selected = true;
      }
    }
  }
}

function getCustomFiltersOptions(customFilter) {
  if (customFilter && customFilter.options.length > 0) {
    return customFilter.options;
  }
  return null;
}

function setSelect2Options({edition, type, color, rarity, customFilters = null}) {
  // Each key in is an array of strings
  if (edition) {
    $(".cardFilter__select2--edition").append(convertArrayToOptions(edition));
  }
  if (type || customFilters?.type) {
    const options = getCustomFiltersOptions(customFilters?.type) || type;
    $(".cardFilter__select2--type").append(convertArrayToOptions(options));
  }
  if (color || customFilters?.color) {
    const options = getCustomFiltersOptions(customFilters?.color) || color;
    $(".cardFilter__select2--color").append(convertArrayToOptions(options));
  }
  if (rarity || customFilters?.rarity) {
    const options = getCustomFiltersOptions(customFilters?.rarity) || rarity;
    $(".cardFilter__select2--rarity").append(convertArrayToOptions(options));
  }
}

function getCustomFiltersLabel(customFilter) {
  if (customFilter && customFilter.options.length > 0) {
    return customFilter.label;
  }
  return null;
}

function setSelect2Labels({edition, type, color, rarity, customFilters = null}) {
  // Each key in is an object: { placeholder: "Rarity", maximumSelectionLength: 1 }
  if (edition) {
    $(".cardFilter__select2--edition").select2(edition);
  }
  if (type || customFilters?.type) {
    const label = getCustomFiltersLabel(customFilters?.type) || type;
    $(".cardFilter__select2--type").select2(label);
  }
  if (color || customFilters?.color) {
    const label = getCustomFiltersLabel(customFilters?.color) || color;
    $(".cardFilter__select2--color").select2(label);
  }
  if (rarity || customFilters?.rarity) {
    const label = getCustomFiltersLabel(customFilters?.rarity) || rarity;
    $(".cardFilter__select2--rarity").select2(label);
  }
}

function createCustomSelect2Label(label) {
  if (label) {
    return {
      placeholder: label,
      maximumSelectionLenght: 1,
    };
  }
  return null;
}

function setCustomFilters() {
  if (TAG1_PREFIX || TAG2_PREFIX || TAG3_PREFIX) {
    return ALL_TAGS.reduce((acc, tag) => {
      if (TAG1_PREFIX && tag.includes(TAG1_PREFIX)) {
        acc.type.options = [...acc.type.options, tag.split(':')[1].trim()];
      }
      if (TAG2_PREFIX && tag.includes(TAG2_PREFIX)) {
        acc.color.options = [...acc.color.options, tag.split(':')[1].trim()];
      }
      if (TAG3_PREFIX && tag.includes(TAG3_PREFIX)) {
        acc.rarity.options = [...acc.rarity.options, tag.split(':')[1].trim()];
      }
      return acc;
    }, {
      type: TAG1_PREFIX ? {
        label: createCustomSelect2Label(TAG1_PREFIX),
        options: [],
      } : null,
      color: TAG2_PREFIX ? {
        label: createCustomSelect2Label(TAG2_PREFIX),
        options: [],
      } : null,
      rarity: TAG3_PREFIX ? {
        label: createCustomSelect2Label(TAG3_PREFIX),
        options: [],
      } : null,
    });
  }
  return null;
}

$(document).ready(() => {
  const currentTags = CURRENT_TAGS.map((val) => val.toLowerCase());
  const allTypes = ALL_TYPES || [];
  const allTags = ALL_TAGS || [];

  const activeGameType = selectActiveGameType(allTypes);

  if (activeGameType) {
    // Due to Shopify's 1000 item collection limit, some sets may not be visible
    fetchAvailableFiltersForGame(activeGameType).then((res) => {
      const {sets, colors, monsterTypes, rarities, types} = res;

      // Set Edition DDL
      let filterOptions = '';
      if (allTags.length >= 1000) {
        // If allTags is longer than 1000, we've hit the limit and sets may be missing, so we should list all sets
        filterOptions = sets;
      } else {
        // If allTags is not over limit, we should filter existing collection tags against valid sets
        const lowerCaseSets = sets.map((set) => set.toLowerCase());
        filterOptions = allTags.filter((entry) => lowerCaseSets.includes(entry.toLowerCase()));
      }

      setSelect2Options({
        edition: filterOptions,
      });

      const customFilters = setCustomFilters();

      switch (activeGameType) {
        case 'mtg':
          setSelect2Options({
            type: types.filter((val) => val && val.id && !val.id.includes(' ') && !val.id.includes('`')).map((val) => val.id),
            color: colors.map((val) => val.value),
            rarity: rarities,
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Set Name", maximumSelectionLenght: 1},
            type: {placeholder: "Type"},
            color: {placeholder: "Color"},
            rarity: {placeholder: "Rarity", maximumSelectionLength: 1},
            customFilters,
          });
          break;
        case 'pokemon':
          // Pokemon Columns
          setSelect2Options({
            type: types.filter((val) => val.id && !val.id.includes(',')).map((val) => val.id),
            color: [
              "Basic",
              "Stage 1",
              "Stage 2",
              "Stage 3",
              "Gigantamax",
              "Mega Evolution",
              "Trainer",
              "Pokemon Tool",
            ],
            rarity: rarities,
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Set Name", maximumSelectionLength: 1},
            type: {placeholder: "Type"},
            color: {placeholder: "Stage"},
            rarity: {placeholder: "Rarity", maximumSelectionLength: 1},
            customFilters,
          });
          break;
        case 'fleshandblood':
          // Flesh and Blood Columns
          setSelect2Options({
            type: types.map((val) => val.id),
            color: [
              "Ninja",
              "Guardian",
              "Brute",
              "Warrior",
              "Wizard",
              "Runeblade",
              "Ranger",
              "Mechanologist",
              "Generic",
            ],
            rarity: rarities,
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Edition", maximumSelectionLenght: 1},
            type: {placeholder: "Type"},
            color: {placeholder: "Hero"},
            rarity: {placeholder: "Rarity", maximumSelectionLength: 1},
            customFilters,
          });
          break;
        case 'yugioh':
          setSelect2Options({
            type: monsterTypes.map((val) => val.value),
            color: colors.map((val) => val.value),
            rarity: rarities,
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Set Name", maximumSelectionLenght: 1},
            type: {placeholder: "Monster Type"},
            color: {placeholder: "Color"},
            rarity: {placeholder: "Rarity", maximumSelectionLength: 1},
            customFilters,
          });
          break;
        case 'dragonballsuper':
          setSelect2Options({
            type: types.map((val) => val.value),
            color: rarities,
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Set Name", maximumSelectionLenght: 1},
            type: {placeholder: "Type"},
            color: {placeholder: "Rarity", maximumSelectionLength: 1},
            rarity: null,
            customFilters,
          });
          break;
        default:
          setSelect2Options({
            customFilters,
          });

          handleSelectActiveOptions(currentTags);

          setSelect2Labels({
            edition: {placeholder: "Other Filters", maximumSelectionLength: 1},
            type: {placeholder: TAG1_PREFIX},
            color: {placeholder: TAG2_PREFIX},
            rarity: {placeholder: TAG3_PREFIX},
            customFilters,
          });
      }

    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  } else {
    handleSelectActiveOptions(currentTags);

    setSelect2Labels({
      edition: {placeholder: "Other Filters", maximumSelectionLength: 1},
      type: {placeholder: TAG1_PREFIX},
      color: {placeholder: TAG2_PREFIX},
      rarity: {placeholder: TAG3_PREFIX},
    });
  }


});

// Handlesize
Shopify.handleize = function(val) {
  let str = val.toLowerCase();
  const toReplace = [
    "\"",
    "'",
    "\\",
    "(",
    ")",
    "[",
    "]",
  ];
  // For the old browsers
  for (let i = 0; i < toReplace.length; ++i) {
    str = str.replace(toReplace[i], "");
  }
  // Replaces non-standard characters aside from é for things like pokémon go
  str = str.replace(/[^a-z^A-Z^0-9^é]+/g, "-");
  // eslint-disable-next-line eqeqeq
  if (str.charAt(str.length - 1) == "-") {
    // eslint-disable-next-line no-useless-escape
    str = str.replace(/-+\z/, "");
  }
  // eslint-disable-next-line eqeqeq
  if (str.charAt(0) == "-") {
    // eslint-disable-next-line no-useless-escape
    str = str.replace(/\A-+/, "");
  }
  return str;
};

/**
 * TODO: Bind the button in JS rather than inline, ~185: <button class="button" onclick="filter()">{{ 'collection.filter.title' | t }}</button>
 */
// eslint-disable-next-line no-unused-vars
function filter() {
  const options = document.querySelectorAll(".cardFilter__item select option");
  let filterString = "";
  let i;
  for (i = 0; i < options.length; i++) {
    if (options[i].selected) {
      // eslint-disable-next-line eqeqeq
      if (filterString == "") {
        filterString = options[i].value.toLowerCase();
      } else {
        filterString += `+${options[i].value.toLowerCase()}`;
      }
    }
  }
  window.location.href = `${COLLECTION_URL}/${filterString}`;
}

const getVariantStatus = (variant, product, collection) => {
  let status;
  if (variant.available === false) {
    status = PRODUCT_FORM_SOLD_OUT;
  } else if (
    collection?.title.includes('pre-order') ||
    collection?.title.includes('preorder') ||
    product.collectionsTitles.some((title) => title?.includes('pre-order')) ||
    product.collectionsTitles.some((title) => title?.includes('preorder')) ||
    product.tags.includes('preorder')
  ) {
    status = PRODUCT_FORM_PRE_ORDER;
  } else if (
    product.type !== 'Event Ticket' && variant.quantity <= 0 && variant.inventory_policy === 'continue'
  ) {
    status = 'Back-order';
  } else {
    status = PRODUCT_FORM_ADD_TO_CART;
  }
  return status;
};

function variantSelect(productId, variantId) {
  const productElement = document.querySelector(`.productCard__card[data-productid="${productId}"]`);
  const productCtaBtn = productElement.querySelector(".product-item__action-button");
  const productTags = JSON.parse(productElement.getAttribute('data-productTags'));
  const productCollectionsTitles = JSON.parse(productElement.getAttribute('data-productCollectionsTitles'));
  const productType = productElement.getAttribute('data-productType');
  const productFormInput = productElement.querySelector('input[name="id"]');

  const allVariantElements = productElement.querySelectorAll('li');
  const selectedVariantElement = productElement.querySelector(`li[data-variantid="${variantId}"]`);
  const selectedVariantTitle = selectedVariantElement.getAttribute("data-variantTitle");
  const selectedVariantAvailable = (selectedVariantElement.getAttribute("data-variantAvailable") === 'true');
  const selectedVariantQty = selectedVariantElement.getAttribute("data-variantQty");
  const selectedVariantPolicy = selectedVariantElement.getAttribute("data-variantPolicy");
  const selectedVariantPrice = selectedVariantElement.getAttribute("data-variantPrice");

  if (!productFormInput) {
    return;
  }

  productFormInput.value = variantId;

  const productBtnText = getVariantStatus(
    {
      available: selectedVariantAvailable,
      quantity: selectedVariantQty,
      inventory_policy: selectedVariantPolicy,
    },
    {
      tags: productTags,
      type: productType,
      collectionsTitles: productCollectionsTitles,
    },
    COLLECTION,
  );

  productCtaBtn.innerText = productBtnText;

  if (productBtnText === "Sold out") {
    productCtaBtn.classList.remove("button--primary");
    productCtaBtn.classList.add("productCard__button--outOfStock");
  } else {
    productCtaBtn.classList.add("button--primary");
    productCtaBtn.classList.remove("productCard__button--outOfStock");
  }

  allVariantElements.forEach((variant) => {
    // eslint-disable-next-line eqeqeq
    if (variant.getAttribute("data-variantid") == variantId) {
      variant.classList.add('productChip__active');
      if (selectedVariantTitle.includes("Foil")) {
        productElement.classList.add("foiled");
      } else {
        productElement.classList.remove("foiled");
      }
    } else {
      variant.classList.remove('productChip__active');
    }
  });
  const productPrice = productElement.querySelector('.productCard__price');
  productPrice.innerHTML = Shopify.formatMoney(selectedVariantPrice, window.theme.moneyWithCurrencyFormat);
}

const allProducts = document.querySelector('.collectionGrid').querySelectorAll('.productCard__card');
allProducts.forEach((product) => {
  const productId = product.getAttribute('data-productId');
  // const variants = product.querySelectorAll('li');
  product.querySelectorAll('li').forEach((variant) => {
    if (variant.classList.contains('productChip__active')) {
      variantId = variant.getAttribute('data-variantId');
    }
  });
  variantSelect(productId, variantId);
});

Shopify.queryParams = {};
if (location.search.length) {
  for (let aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
    aKeyValue = aCouples[i].split('=');
    if (aKeyValue.length > 1) {
      Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
    }
  }
}

jQuery('#sort-by')
  .val(SORT_BY)
  .bind('change', function() {
    Shopify.queryParams.sort_by = jQuery(this).val();
    location.search = jQuery.param(Shopify.queryParams).replace(/\+/g, '%20');
  });

jQuery('#sort-by1')
  .val(SORT_BY)
  .bind('change', function() {
    Shopify.queryParams.sort_by = jQuery(this).val();
    location.search = jQuery.param(Shopify.queryParams).replace(/\+/g, '%20');
  });

const handleMobileFiltersToggle = () => {
  const modal = document.querySelector(".cardFilterMobile");
  const trigger = document.querySelector(".cardFilterMobile__trigger");
  const closeX = document.querySelector(".cardFilterMobile__closeX");

  trigger.addEventListener("click", () => modal.classList.toggle("cardFilterMobile__showModal"));
  closeX.addEventListener("click", () => modal.classList.toggle("cardFilterMobile__showModal"));
};

handleMobileFiltersToggle();

