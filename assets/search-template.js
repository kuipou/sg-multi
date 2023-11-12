/* eslint-disable babel/no-invalid-this */
/* eslint-disable babel/camelcase */
/* eslint-disable no-undef */

$(document).ready(() => {
  $('.productCard__imageWrap').tilt({
    perspective: 2000,
    maxGlare: 0.6,
    glare: true,
    speed: 500,
    scale: 1.01,
  });
});

const variableElement = $('#search-template-js');
const _COLLECTION = variableElement.attr('data-collection');
const COLLECTION = _COLLECTION === 'null' ? null : JSON.parse(_COLLECTION);
const ADD_TO_CART = variableElement.attr('data-add-to-cart');
const SOLD_OUT = variableElement.attr('data-sold-out');
const PREORDER = variableElement.attr('data-preorder');

const getVariantStatus = (variant, product, collection) => {
  let status;
  if (variant.available === false) {
    status = SOLD_OUT;
  } else if (
    collection?.title.includes('pre-order') ||
    collection?.title.includes('preorder') ||
    product.collectionsTitles.some((title) => title.includes('pre-order')) ||
    product.collectionsTitles.some((title) => title.includes('preorder')) ||
    product.tags.includes('preorder')
  ) {
    status = PREORDER;
  } else if (
    product.type !== 'Event Ticket' && variant.quantity <= 0 && variant.inventory_policy === 'continue'
  ) {
    status = 'Back-order';
  } else {
    status = ADD_TO_CART;
  }
  return status;
};

const variantSelect = (productId, variantId) => {
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
};

const addToCartBtn = (id) => {
  const btn = document.querySelector(`.productCard__button[data-selectedId='${id}']`);
  const itemTitle = btn.getAttribute("data-selectedProductTitle");
  const maxStock = btn.getAttribute("data-selectedMax");
  const variantTitle = btn.getAttribute("data-selectedVariantTitle");
  btn.parentNode.querySelector('input[name="id"]').value = id;
  addToCart(id, itemTitle, maxStock, 1, variantTitle);
};
