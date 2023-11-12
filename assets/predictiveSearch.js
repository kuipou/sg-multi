/* eslint-disable id-length */
/* eslint-disable babel/camelcase */
/* eslint-disable babel/no-invalid-this */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */

class PredictiveSearchStore {
  constructor() {
    this.showPrices = true;
    this.showPriceRange = true;
    this.initalized = false;
    this.getStoreValues();
  }

  getStoreValues() {
    const predictiveSearchData = document.getElementById('predictiveSearch-js');

    if (this.initialized || !predictiveSearchData) {
      return {
        showPrices: this.showPrices,
        showPriceRange: this.showPriceRange,
      };
    }
    const showPriceRangeString = predictiveSearchData.getAttribute('data-show-price-range');
    this.showPriceRange = (showPriceRangeString !== 'false');

    const showPricesString = predictiveSearchData.getAttribute('data-show-prices');
    this.showPrices = (showPricesString !== 'false');

    this.initalized = true;

    return {
      showPrices: this.showPrices,
      showPriceRange: this.showPriceRange,
    };
  }
}

(function() {
  let globalTimeout = null;

  const predictiveSearchStore = new PredictiveSearchStore();

  $('.sd_pro-search').click(() => {
    const value = $(".sd_pro-search").val();
    if (value === "") {
      $('.sd_dropdown').show();
      $('.sd_dropdown').html('');
    } else {
      $('.sd_dropdown').show();
    }
  });

  $(document).on('mouseup', 'body', (event) => {
    const container = $(".sd_product-search");
    const submit = $(".searchBar__submit");
    const icon = $(".fa-search");
    // If the target of the click isn't the container

    if (!container.is(event.target) && container.has(event.target).length === 0 && (!submit.is(event.target)) && (!icon.is(event.target))) {
      $('.sd_dropdown').hide();
      $('.sd_pro-search').val('');
    }
  });

  $("<div class='sd_fixsearch' style='font-family: arial;border-radius: 2px 0 0 2px;box-sizing: border-box;height: 38px;max-width: 400px;position:fixed;top: 150px;z-index: 9999999999;width: 100%;transition: all 0.6s ease-in 0s;visibility:hidden;opacity:0;'><div class='sd_fixinner' style='font-family: arial;'><img alt='Search Icon' loading='lazy' src='https://storage.googleapis.com/binderpos-libraries/white-search.png' class='sd_searchicon' style='font-family: arial;cursor:pointer;background:#494c50 none repeat scroll 0 0;width: 38px; border-radius: 5px 0 0 5px;padding: 5px;float: left;'><div class='sd_product-search' style='float: left;height: 38px;position: relative;transition: all 0.5s ease 0s;max-width: auto;margin-top:0;'><input type='text' class='sd_pro-search' style='background:white!important;height: 38px!important;width:90%!important;padding: 5px!important;z-index:9999999999;'><div class='sd_dropdown'></div></div></div></div><input type='hidden' class='fullval'>").insertAfter("body");

  if ($(window).width() < 767) {
    $('.sd_fixinner .sd_product-search').css({margin: '0', 'max-width': '100%', 'font-family': 'arial', height: '38px', width: '88%', position: 'relative'});
    $('.sd_fixsearch').css({right: '-362px'});
  } else {
    $('.sd_fixinner .sd_product-search').css({margin: '0', 'max-width': '100%', 'font-family': 'arial', height: '38px', width: '90%', position: 'relative'});
    $('.sd_fixsearch').css({right: '-362px'});
  }

  let sizeee = "-362px";

  if ($(window).width() == 375) {
    $('.sd_fixsearch').css({right: '-337px'});
    sizeee = "-337px";
  }

  if ($(window).width() == 360) {
    $('.sd_fixsearch').css({right: '-322px'});
    sizeee = "-322px";
  }

  if ($(window).width() == 320) {
    $('.sd_fixsearch').css({right: '-282px'});
    sizeee = "-282px";
  }

  const searchtext = null;
  const prccolor = null;

  function titleMatchesSearch(title, search) {
    return title.toLowerCase().includes(search.toLowerCase());
  }

  function highlightMatchingTitle(title, search) {
    const matchStart = title.toLowerCase().indexOf(`${String(search.toLowerCase())}`);

    const matchEnd = matchStart + search.length - 1;

    const beforeMatch = title.slice(0, matchStart);

    const matchText = title.slice(matchStart, matchEnd + 1);

    const afterMatch = title.slice(matchEnd + 1);

    return `${beforeMatch}<span style='color:${searchtext}!important; font-weight:700!important;'>${matchText}</span>${afterMatch}`;
  }

  function highlight(string) {
    $(".sd_dropdownresult li, .sd_dropdown_default li").each(function() {
      const matchStart = $(this).find('.sd_title').text()
        .toLowerCase()
        .indexOf(`${String(string.toLowerCase())}`);

      const matchEnd = matchStart + string.length - 1;

      const beforeMatch = $(this).find('.sd_title').text()
        .slice(0, matchStart);

      const matchText = $(this).find('.sd_title').text()
        .slice(matchStart, matchEnd + 1);

      const afterMatch = $(this).find('.sd_title').text()
        .slice(matchEnd + 1);

      const finalMatch = `${beforeMatch}<span style='color:${searchtext}!important; font-weight:700!important;'>${matchText}</span>${afterMatch}`;
      $(this).find('.sd_title').html(finalMatch);
    });
  }

  function colHighlight(string) {
    $(".sd_dropdownresult_collection li, .sd_dropdown_default li").each(function() {
      const matchStart = $(this).find('.sd_title').text()
        .toLowerCase()
        .indexOf(`${String(string.toLowerCase())}`);

      const matchEnd = matchStart + string.length - 1;
      const beforeMatch = $(this).find('.sd_title').text()
        .slice(0, matchStart);

      const matchText = $(this).find('.sd_title').text()
        .slice(matchStart, matchEnd + 1);

      const afterMatch = $(this).find('.sd_title').text()
        .slice(matchEnd + 1);

      const finalMatch = `${beforeMatch}<span style='color:${searchtext}!important; font-weight:700!important;'>${matchText}</span>${afterMatch}`;

      $(this).find('.sd_title').html(finalMatch);
    });
  }

  function pageHighlight(string) {
    $(".sd_dropdownresult_page li, .sd_dropdown_default li").each(function() {
      const matchStart = $(this).find('.sd_title').text()
        .toLowerCase()
        .indexOf(`${String(string.toLowerCase())}`);
      const matchEnd = matchStart + string.length - 1;
      const beforeMatch = $(this).find('.sd_title').text()
        .slice(0, matchStart);
      const matchText = $(this).find('.sd_title').text()
        .slice(matchStart, matchEnd + 1);
      const afterMatch = $(this).find('.sd_title').text()
        .slice(matchEnd + 1);
      const finalMatch = `${beforeMatch}<span style='color:${searchtext}!important; font-weight:700!important;'>${matchText}</span>${afterMatch}`;
      $(this).find('.sd_title').html(finalMatch);
    });
  }

  $(document).on("click", ".sd_searchicon", () => {
    $('.sd_fixsearch').toggleClass('sd_fixactive');
    if ($('.sd_fixsearch').hasClass('sd_fixactive')) {
      $('.sd_fixsearch').css('right', '-2px');
      $(document).on("click", "body", () => {
        $('.sd_fixsearch').css({right: sizeee});
        $('.sd_fixsearch').removeClass('sd_fixactive');
        $('.sd_pro-search').val('');
        $('.sd_dropdown').empty();
      });
    } else {
      $('.sd_fixsearch').css({right: sizeee});
      $('.sd_pro-search').val('');
      $('.sd_dropdown').empty();
    }
  });

  $('.sd_product-search').css('display', 'none');
  $('.sd_pro-search').attr("placeholder", "Search..");


  /* Default search starts here */
  const resvalue = {defaultwidth: null, product_tab: null, collection_tab: null, page_tab: null, article_tab: null, stock_res: null, foot_text: null, footer_noresult: null};
  const defull = $.trim(resvalue.defaultwidth);
  const product = window.theme.searchMode.includes("product") ? "yes" : "no";
  const collection = 'no';
  const page = window.theme.searchMode.includes("page") ? "yes" : "no";
  const article = window.theme.searchMode.includes("article") ? "yes" : "no";
  const footer_text = $.trim(resvalue.foot_text);

  let footer_noresult = $.trim(resvalue.footer_noresult);

  if (footer_noresult == '' || footer_noresult == null) {
    footer_noresult = "No Results Found";
  }

  let footer_boxtext = footer_text;
  if (footer_text == '' || footer_text == null) {
    footer_boxtext = "Show More Results";
  }

  let out_stock = "last";
  if (resvalue.stock_res != null) {
    out_stock = $.trim(resvalue.stock_res);
  }

  function calculatePriceDisplay(productSuggest) {
    const {price_min, price_max, price} = productSuggest;

    const {
      showPrices,
      showPriceRange,
    } = predictiveSearchStore.getStoreValues();

    if (showPrices === false) {
      return '';
    }

    if (showPriceRange === false || price_min === price_max || price === '0.00') {
      return Shopify.formatMoney((price_max), window.theme.moneyWithCurrencyFormat);
    }
    if (price_min !== price_max) {
      return `${Shopify.formatMoney((price_min), window.theme.moneyWithCurrencyFormat)} - ${Shopify.formatMoney((price_max), window.theme.moneyWithCurrencyFormat)}`;
    }
    return Shopify.formatMoney((price), window.theme.moneyWithCurrencyFormat);
  }

  function handleFetchSearch(searchval) {
    globalTimeout = null;

    const searchstring = searchval.toUpperCase();
    const hostname = window.location.hostname;
    let proarray = null;

    jQuery.getJSON("/search/suggest.json", {
      q: searchval,
      resources: {
        type: "product,page,article,collection",
        options: {
          unavailable_products: out_stock,
          fields: "title,variants.title,product_type",
        },
      },
    }).done((response) => {
      if (product == '' && collection == '' && page == '' && article == '') {
        $('.sd_dropdown').html('<div class="sd_tab"><button class="tablinks1">Products</button><button class="tablinks2">Collection</button><button class="tablinks3">Pages</button><button class="tablinks4">Articles</button></div><div class="sd_tabs"></div>');
      } else {
        let tab_html = '<div class="sd_tab">';
        if (product == 'yes' || product == '') {
          tab_html += '<button class="tablinks1">Products</button>';
        }
        if (collection == 'yes' || collection == '') {
          tab_html += '<button class="tablinks2">Collection</button>';
        }
        if (page == 'yes' || page == '') {
          tab_html += '<button class="tablinks3">Pages</button>';
        }
        if (article == 'yes' || article == '') {
          tab_html += '<button class="tablinks4">Articles</button>';
        }
        tab_html += '</div><div class="sd_tabs"></div>';
        $('.sd_dropdown').html(tab_html);
      }
      const rex = /(<([^>]+)>)/ig;

      proarray = [];

      const data = response.resources.results;

      // Articles tab
      if (data.articles.length > 0) {
        let appendToResult3 = '<div class="pagelist"><ul class="sd_dropdownresult_page">';
        $.each(data.articles, (index, articles) => {
          const prodvals = articles.title;
          const prods = prodvals.toUpperCase();
          if (prods.indexOf(searchstring) >= 0) {
            appendToResult3 = appendToResult3.concat(`<li id="${articles.id}"><a href="${articles.url}"><div class="sd_span"><div class="sd_title"> &#9679; ${articles.title}</div></div></a></li>`);
          }
        });

        appendToResult3 = appendToResult3.concat(`</ul><div class="sd_more_result"><span class="sd_show_all"><a class="showproduct" href="https://${hostname}/search?article=1&q=%2A${searchval}%2A&type=article">${footer_boxtext}</a></span></div></div>`);

        $(".tablinks4").click((e) => {
          e.preventDefault();
          $(".tablinks4").addClass("active");
          $(".tablinks2").removeClass("active");
          $(".tablinks3").removeClass("active");
          $(".tablinks1").removeClass("active");
          $('.sd_tabs').html(appendToResult3);
          pageHighlight(searchval);
        });
      } else {
        $(".tablinks4").click((e) => {
          e.preventDefault();
          $('.sd_tabs').html(`</ul><div class="sd_more_result"><span class="sd_show_all noresult">${footer_noresult}</span></div></div>`);
          $(".tablinks4").addClass("active");
          $(".tablinks3").removeClass("active");
          $(".tablinks2").removeClass("active");
          $(".tablinks1").removeClass("active");
        });
      }

      // Pages tab
      if (data.pages.length > 0) {
        let appendToResult2 = '<div class="pagelist"><ul class="sd_dropdownresult_page"><li class=""></li>';
        $.each(data.pages, (index, pages) => {
          const prodvals = pages.title;
          const prods = prodvals.toUpperCase();

          if (prods.indexOf(searchstring) >= 0) {
            appendToResult2 = appendToResult2.concat(`<li id="${pages.id}"><a href="https://${hostname}/pages/${pages.handle}"><div class="sd_span"><div class="sd_title"> &#9679; ${pages.title}</div></div></a></li>`);
          }
        });

        appendToResult2 = appendToResult2.concat(`</ul><div class="sd_more_result"><span class="sd_show_all"><a class="showproduct" href="https://${hostname}/search?page=1&q=%2A${searchval}%2A&type=page">${footer_boxtext}</a></span></div></div>`);
        $(".tablinks3").click(() => {
          $('.tablinks3').addClass("active");
          $('.tablinks2').removeClass("active");
          $('.tablinks1').removeClass("active");
          $('.tablinks4').removeClass("active");
          $('.sd_tabs').html(appendToResult2);
          pageHighlight(searchval);
        });
      } else {
        $(".tablinks3").click(() => {
          $('.tablinks3').addClass("active");
          $('.tablinks2').removeClass("active");
          $('.tablinks1').removeClass("active");
          $('.tablinks4').removeClass("active");
          $('.sd_tabs').html(`</ul><div class="sd_more_result"><span class="sd_show_all noresult">${footer_noresult}</span></div></div>`);
        });
      }

      // Collections tab
      if (data.collections.length > 0) {
        const proarray1 = [];
        let appendToResult1 = '<div class="collectionpanel"><ul class="sd_dropdownresult_collection"><li class=""></li>';
        $.each(data.collections, (index, collections) => {
          const prodvals = collections.title;
          const prods = prodvals.toUpperCase();

          if (prods.indexOf(searchstring) >= 0) {
            appendToResult1 = appendToResult1.concat(`<li id="${collections.id}"><a href="https://${hostname}/collections/${collections.handle}"><div class="sd_span"><div class="sd_title"> &#9679; ${collections.title}</div></div></a></li>`);
            proarray1.push({
              pid: collections.id,
              ptitel: collections.title,
              phandle: collections.handle,
            });
          }
        });

        appendToResult1 = appendToResult1.concat(`</ul><div class="sd_more_result"><span class="sd_show_all"><a class="showproduct" href="https://${hostname}/collections">View All Collections</a></span></div></div>`);
        if (proarray1.length > 0) {
          $(".tablinks2").click(() => {
            $('.tablinks2').addClass("active");
            $('.tablinks1').removeClass("active");
            $('.tablinks3').removeClass("active");
            $('.tablinks4').removeClass("active");
            $('.sd_tabs').html(appendToResult1);
            colHighlight(searchval);
          });
        }
      } else {

        $(".tablinks2").click(() => {
          $('.tablinks2').addClass("active");
          $('.tablinks1').removeClass("active");
          $('.tablinks3').removeClass("active");
          $('.tablinks4').removeClass("active");
          $('.sd_tabs').html(`</ul><div class="sd_more_result"><span class="sd_show_all noresult">${footer_noresult}</span></div></div>`);
        });
      }

      // Products tab
      if (data.products.length > 0) {
        let appendToResult = '';
        $.each(data.products, (index, products) => {
          const prodval = products.title;
          const productSuggestions = response.resources.results.products;
          const productsuggest = productSuggestions[index];

          const prod = prodval.toUpperCase();

          let imagesrc = '<div class="sd_searchimage"><img alt="Defualt Image" loading="lazy" class="sd_noimg prdimg" width="50px" src="https://storage.googleapis.com/binderpos-libraries/NoPicAvailable.png" /></div>';
          if (productsuggest.image != null) {
            imagesrc = `<div class="sd_searchimage"><img alt="Product Image" loading="lazy" class="prdimg" width="50px" src="${productsuggest.image}"></div>`;
          }

          if (titleMatchesSearch(products.title, searchstring)) {
            appendToResult = `<li id="${products.id}">
                                <a href="https://${hostname}/products/${products.handle}">
                                  ${imagesrc}
                                  <div class="sd_span">
                                    <div class="sd_title">
                                      ${highlightMatchingTitle(products.title, searchstring)}
                                    </div>
                                    <div class="sd_price binder_predictiveSearch_price" style=color:${prccolor}!important;>
                                      ${calculatePriceDisplay(productsuggest)}
                                    </div>
                                  </div>
                                </a>
                              </li>${appendToResult}`;
            proarray.push({
              pid: products.id,
              ptitel: products.title,
              phandle: products.handle,
            });
          } else {
            appendToResult = appendToResult.concat(`<li id="${products.id}"><a href="https://${hostname}/products/${products.handle}">${imagesrc}</div><div class="sd_span"><div class="sd_title">${products.title}</div><div class="sd_price binder_predictiveSearch_price" style=color:${prccolor}!important;>${productsuggest.price_min === productsuggest.price_max ? Shopify.formatMoney((productsuggest.price), window.theme.moneyWithCurrencyFormat) : `${Shopify.formatMoney((productsuggest.price_min), window.theme.moneyWithCurrencyFormat)} - ${Shopify.formatMoney((productsuggest.price_max), window.theme.moneyWithCurrencyFormat)}`}</div></div></a></li>`);
            proarray.push({
              pid: products.id,
              ptitel: products.title,
              phandle: products.handle,
            });
          }

        });
        appendToResult = `<ul class="sd_dropdownresult"><li class=""></li>${appendToResult}</ul><div class="sd_more_result"><span class="sd_show_all"><a class="showproduct" href="https://${hostname}/search?page=1&q=%2A${searchval}%2A&type=product">${footer_boxtext}</a></span></div></div>`;

        if (proarray.length > 0) {
          $('.sd_tabs').html(appendToResult);
          $('.tablinks1').addClass("active");
        }

        $(".tablinks1").click(() => {
          $('.tablinks1').addClass("active");
          $('.tablinks2').removeClass("active");
          $('.tablinks3').removeClass("active");
          $('.tablinks4').removeClass("active");
          $('.sd_tabs').html(appendToResult);
        });
      } else {
        $('.tablinks1').addClass("active");
        $('.sd_tabs').html(`</ul><div class="sd_more_result"><span class="sd_show_all noresult">${footer_noresult}</span></div></div>`);
        $(".tablinks1").click(() => {
          $('.tablinks1').addClass("active");
          $('.tablinks2').removeClass("active");
          $('.tablinks3').removeClass("active");
          $('.tablinks4').removeClass("active");
          $('.sd_tabs').html(`</ul><div class="sd_more_result"><span class="sd_show_all noresult">${footer_noresult}</span></div></div>`);
        });
      }
    });
  }


  $(() => {
    $('.sd_product-search').css({position: 'relative', 'max-width': '280px'});
    $('.sd_dropdown').css({position: 'absolute', width: '100%', 'z-index': '999999', top: '29px'});
    $('.sd_product-search').fadeIn('fast');
    $('.sd_fixinner .sd_pro-search').css({'font-family': 'arial', height: '38px', margin: '0', padding: '5px', 'max-width': '100%', background: '#fff'});

    if ($(window).width() < 767) {
      $('.sd_fixinner .sd_product-search').css({margin: '0', 'max-width': '100%', 'font-family': 'arial', height: '38px', width: '88%', position: 'relative'});
    } else {
      $('.sd_fixinner .sd_product-search').css({margin: '0', 'max-width': '100%', 'font-family': 'arial', height: '38px', width: '90%', position: 'relative'});
    }

    const productTypeDDL = $('#sd_pro-product-type-ddl');

    const handleSearch = (searchVal) => {
      $('.sd_dropdown').show();

      if (searchVal.length > 1) {
        if (globalTimeout != null) {
          clearTimeout(globalTimeout);
        }

        const searchQuery = (productTypeDDL && productTypeDDL.val() !== '' && productTypeDDL.val() !== undefined) ? `product_type:${productTypeDDL.val()} AND ${searchVal}` : searchVal;

        globalTimeout = setTimeout(() => handleFetchSearch(searchQuery), 200);
      } else {
        $('.sd_dropdown').html(' ');
      }

    };

    if (productTypeDDL) {
      productTypeDDL.on('change', (event) => {
        event.target.closest('.search-bar__filter').querySelector('.search-bar__filter-active').innerText = event.target.options[event.target.selectedIndex].innerText;
        const searchVal = $(".sd_pro-search").val();
        handleSearch(searchVal);
      });
    }


    // fixed search start here
    $(".sd_pro-search").keyup(function(e) {
      const searchVal = $(this).val();
      handleSearch(searchVal);
    });
  });

  $(document).on('mouseenter', '.sd_dropdownresult li a', function() {
    $(this).css({background: 'rgb(242,242,242)'});
  });
  $(document).on('mouseleave', '.sd_dropdownresult li a', function() {
    $(this).css({background: '#fff'});
  });
  $(document).on('mouseenter', '.sd_dropdownresult_collection li a', function() {
    $(this).css({background: 'rgb(242,242,242)'});
  });
  $(document).on('mouseleave', '.sd_dropdownresult_collection li a', function() {
    $(this).css({background: '#fff'});
  });

})();
