// TODO: 'just_logged_in' = true.
// TODO: BUG: if lists has the same name they will be shown and hidden both at the same time.
// TODO: Call calcBoardLayout(); when right menu hidden.

// Trello.com loads lists after whole page loaded and DOM is ready so we need to
// wait for some DOM-elements appear on page and then react on this change.
// Custom jQuery plugin was used to wait while required DOM-element will be created.
// See https://gist.github.com/md55/6565078

// This code was copied from trello's all.js file.
// https://d78fikflryjgj.cloudfront.net/js/0e1c2ed27cb817938de179d9d36a9043/all.js
const calcBoardLayout = () => {
  const f = $(window).height();
  const c = $("#header").outerHeight();
  const b = $(".header-banner:visible").outerHeight();
  const e = this.$(".board-header").outerHeight();
  this.$(".board-canvas").height(f - (c + b + e));
};

const getListName = (list) => {
  return list
    .find(".list-header-name-assist")
    .clone()
    .children()
    .remove()
    .end()
    .text();
};

const restoreListStatus = (_index, listElement) => {
  var listName = getListName($(listElement));
  // There is an empty list (placeholder for new lists) and we should skip it.
  if (listName) {
    // Get previously stored status of this list from LocalStorage.
    var listShowStatus = localStorage.getItem("trellists-" + listName);
    // By default all lists are shown.
    $(listElement).addClass(
      listShowStatus != null ? listShowStatus : "show-list"
    );
    if (listShowStatus == "hide-list") {
      $(listElement).hide();
    } else {
      $(listElement).show();
    }
  }
};

const updateListName = (listHeader) => {
  var list = listHeader.parent().parent();
  var listName = getListName(list);
  var oldListName = listHeader.children(".list-header-name").text();
  // Somehow List title could be empty and we need to pass by this case.
  // Compare old title and new one to run only on title change but not subtree changes or etc.
  if (listName && listName !== oldListName) {
    renderMenu();
    //Remove previous name and store new one.
    var listShowStatus = list.hasClass("show-list") ? "show-list" : "hide-list";
    localStorage.removeItem("trellists-" + oldListName);
    localStorage.setItem("trellists-" + listName, listShowStatus);
  }
};

(function () {
  // http://stackoverflow.com/a/7616484
  String.prototype.hashCode = function () {
    var hash = 0,
      i,
      chr,
      len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  // Add a placeholder for the list of all list in the page header.
  new MutationSummary({
    queries: [
      {
        element: ".list-wrapper",
      },
    ],
    callback: function () {
      if (!$("#trellists").length) {
        $("<ul/>").attr("id", "trellists").appendTo(".board-header");
      }
      $(".list-wrapper").each(restoreListStatus);
      renderMenu();
    },
  });

  // Update  list name on change. Already optimized.
  $(".list-header").waitUntilExists(function () {
    $(".list-header").on("DOMSubtreeModified", updateListName);
  });

  /**
   * Build Top Bar which shows titles of existing lists.
   * Each time new list created ate page we rebuild top bar.
   */
  const renderMenu = () => {
    // This variable will collect all tabs in top menu.
    var li = "";
    // To count shown and hidden tabs we will use separate variables so we could switch 'Show all' and 'Hide all' tab.
    // TODO: store number of hidden and shown tabs in global variable or LocalStorage and update 'All' button depending on those numbers.
    var shownTabs = (hiddenTabs = 0);
    // Get all Lists at board except placeholder for new List creation to add them to the Bar.
    $("#board .list-wrapper").each(function () {
      // Get only List's name without any sub-elements.
      var name = getListName($(this));

      // This check allows to skip 'Add new list' widget.
      if (name) {
        var hash = name.hashCode();
        // Create the tab in Menu for current List.
        var tab = $("<li/>").attr("data-tab-name", hash).text(name);

        // Mark a List to be able to find it later.
        // TODO: find a way to aviod this kind of marking and search by List's name.
        if ($(this).attr("data-list-name") != hash) {
          // Update List name in attribute only if it's necessary.
          $(this).attr("data-list-name", hash);
        }

        // Tabs should duplicate status (hide/show) of actual List.
        // Set default status 'show-list' and change it only if actual List has status.
        if ($(this).hasClass("show-list")) {
          $(tab).addClass("show-list");
          shownTabs++;
        } else if ($(this).hasClass("hide-list")) {
          $(tab).addClass("hide-list");
          hiddenTabs++;
        } else {
          // for just created lists
          $(tab).addClass("show-list");
          shownTabs++;
        }
        li += tab[0].outerHTML;
      }
    });

    // Create the tab in Menu for current List.
    var tab = $("<li/>")
      .attr("data-tab-name", "all")
      .text("Hide all")
      .addClass("show-all");
    if (hiddenTabs == 0 && shownTabs != 0) {
      tab.text("Hide all").removeClass("hide-all").addClass("show-all");
    }
    if (hiddenTabs != 0 && shownTabs == 0) {
      tab.text("Show all").removeClass("show-all").addClass("hide-all");
    }

    li += tab[0].outerHTML;

    // Replace tabs in the Menu.
    $("#trellists").empty().append(li);

    // If number of list are huge we need to manually resize window so 'Add new card...' widget
    // and horizontall scroll bar will be shown at the bottom.
    calcBoardLayout();

    // Hides/shows List on click at tab.
    // We need to attach onClick behaviour for newly created tabs just after they was added to DOM
    // so we can't move out this code.
    $("#trellists li").on("click", function () {
      var button = $(this).attr("data-tab-name");

      if (button == "all") {
        // 'Hide all/Show all' tab was clicked.
        var allButtonPrevStatus = $(this).hasClass("show-all")
          ? "show-all"
          : "hide-all";

        // TODO: think how to avoid code duplication here.
        $("#board .list-wrapper").each(function () {
          var $list = $(this);
          var listName = getListName($list);

          // Check if list has name to avoid 'Add new list...' placeholder.
          if (getListName($(this))) {
            if (allButtonPrevStatus == "show-all") {
              $(this).addClass("hide-list").removeClass("show-list").hide();
              localStorage.setItem("trellists-" + listName, "hide-list");
            } else if (allButtonPrevStatus == "hide-all") {
              $(this).addClass("show-list").removeClass("hide-list").show();
              localStorage.setItem("trellists-" + listName, "show-list");
            }
          }
        });
        // Rebuild menu to set correct status.
        renderMenu();
      } else {
        // List tab was clicked.
        var $list = $("#board .list-wrapper[data-list-name='" + button + "']");
        var listShowStatus = $list.hasClass("show-list")
          ? "show-list"
          : "hide-list";
        var listName = getListName($list);
        var allTab = $("#trellists li[data-tab-name=all]");

        //Revert status of list when it was clicked.
        localStorage.setItem(
          "trellists-" + listName,
          listShowStatus == "show-list" ? "hide-list" : "show-list"
        );

        if (["show-list", "hide-list"].includes(listShowStatus)) {
          $list.toggleClass("hide-list").toggleClass("show-list");
          $(this).toggleClass("hide-list").toggleClass("show-list");
          if (listShowStatus == "show-list") {
            $list.hide();
            allTab
              .text("Show all")
              .toggleClass("hide-all")
              .toggleClass("show-all");
          } else {
            $list.show();
            allTab
              .text("Hide all")
              .toggleClass("hide-all")
              .toggleClass("show-all");
          }
        }
      }
    }); // 'click' event handler ends here
  };
})();
