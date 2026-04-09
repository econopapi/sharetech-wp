(function () {
  "use strict";

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function shouldReduceMotion() {
    return !!reduceMotionQuery && reduceMotionQuery.matches;
  }

  function triggerProductEnterAnimation(productItem) {
    if (shouldReduceMotion()) {
      return;
    }

    productItem.classList.remove("is-filter-enter");
    void productItem.offsetWidth;
    productItem.classList.add("is-filter-enter");
  }

  function productMatchesFilter(productItem, filterSlug) {
    if (!filterSlug || filterSlug === "all") {
      return true;
    }

    return productItem.classList.contains("product_cat-" + filterSlug);
  }

  function applyFilter(section, filterSlug, animateVisibleItems) {
    var products = section.querySelectorAll(".sharetech-shop-products-grid li.product");
    var buttons = section.querySelectorAll(".sharetech-shop-subcategory-card[data-filter]");
    var emptyState = section.querySelector(".sharetech-shop-products-grid__empty");
    var visibleCount = 0;

    products.forEach(function (product) {
      var isVisible = productMatchesFilter(product, filterSlug);
      product.hidden = !isVisible;
      product.style.display = isVisible ? "" : "none";

      if (isVisible) {
        visibleCount += 1;
        if (animateVisibleItems) {
          triggerProductEnterAnimation(product);
        }
      }
    });

    buttons.forEach(function (button) {
      var isActive = button.getAttribute("data-filter") === filterSlug;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  function setupCategorySection(section) {
    var buttons = section.querySelectorAll(".sharetech-shop-subcategory-card[data-filter]");

    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var selectedFilter = button.getAttribute("data-filter") || "all";

        if (!shouldReduceMotion()) {
          section.classList.add("is-filtering");
          window.setTimeout(function () {
            applyFilter(section, selectedFilter, true);
            section.classList.remove("is-filtering");
          }, 90);
          return;
        }

        applyFilter(section, selectedFilter, false);
      });
    });

    var activeButton = section.querySelector(".sharetech-shop-subcategory-card.is-active[data-filter]");
    var defaultFilter = section.getAttribute("data-default-filter") || "all";
    var initialFilter = activeButton ? activeButton.getAttribute("data-filter") : defaultFilter;

    applyFilter(section, initialFilter || "all", false);
  }

  function setupInitialRenderAnimation(sections) {
    var mainWrapper = document.querySelector(".sharetech-shop-wrapper--main");

    if (!mainWrapper || shouldReduceMotion()) {
      return;
    }

    mainWrapper.classList.add("is-anim-ready");

    window.requestAnimationFrame(function () {
      sections.forEach(function (section, index) {
        window.setTimeout(function () {
          section.classList.add("is-in-view");
        }, index * 90);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sections = document.querySelectorAll(".sharetech-shop-category[data-default-filter]");

    setupInitialRenderAnimation(sections);

    sections.forEach(function (section) {
      setupCategorySection(section);
    });
  });
})();
