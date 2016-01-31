  var map = new Array();
  var columns = 0;

$(document).ready(function(){

  /// 1.创建一个回调，等枚举出所有书签后执行
  var sync = function(){
      // 创建所有 书签的 html
      var folders = addBookmarkToHtml();
      // 清空 html 中所有书签
      $('#tsel .column').empty();  
      // 获取有多少列
      columns = $('#tsel').find('.column').size();
      //将书签均匀加到每列中
      var j = 0;
      for(var i = 0;i < folders.length;++i)
      {
        var text = folders[i];
        $('#tsel .column').eq(j).append(text);
        j = (++j) % columns;
        icurmzFun();
      }
  }
  /// 2.从 chrome 中获取 书签
  dumpBookmarks(map,sync); 
});

  // for(var i = 0;i < folders.length;++i) {
  // }
function addBookmarkToHtml()
{
  var folders = new Array();

  for(var folder in map) {
    
    var text = "<li class=\"fwrap\"><div class=\"fldr\" data-stat=\"0\"><span>" + folder + "</span></div>";
    //text += "<ul style=\"overflow: hidden; display: none;\">";
    text += "<ul>";
    for(var j = 0;j < map[folder].length;++j) {
      var item = map[folder][j];

      text += "<li><div class=\"itm\"><a href=\"https://icrumz.com/icrumz/edit?id=136482&amp;form=1\"><img src=\"img/136482.png\" alt=\"edit\" title=\"edit\"></a>";
      text += "<a href=\"" + item.url + "\" target=\"_blank\">" + item.title + "</a></div></li>";
    }

    text += "</ul></li>";
    folders.push(text)
    //$('#tsel .column').append(fwrap);
    //var overlay = fwrap.appendTo($('#tsel').find('.column').eq(i));
    //overlay.appendTo('body');
  }
  return folders;
}


// function addBookmarkToHtml()
// {
//   var folders = new Array();

//   for(var folder in map) {
    
//     var fwrap = $("<li>");
//     fwrap.addClass('fwrap');
    
//     var div = $("<div>");
//     div.addClass('fldr');
//     div.attr('data-stat','0');
//     div.appendTo(fwrap);

//     var span = $("<span>");
//     span.text(folder);
//     span.appendTo(div);

//     var ul = $("<ul>");
//     ul.attr('style','overflow: hidden;');
    
//         //ul.attrib('style','overflow: hidden; display: block;');
//     for(var j = 0;j < map[folder].length;++j) {
//       var item = map[folder][j];
//       var li = $('<li>');
  
//       var div2 = $('<div>');
//       div2.addClass('itm');
      

//       var a1 = $('<a>');
//       a1.attr('href','https://icrumz.com/icrumz/edit?id=136482&form=1');
      
//       var img = $('<img>');
//       img.attr('src','https://icrumz.com/icrumz/icon/136482.png');
//       img.attr('alt','edit');
//       img.attr('title','edit');
      

//       var a2 = $('<a>');
//       a2.attr('href',item.url);
//       a2.attr('target','_blank');
//       a2.text(item.title);
      
//       img.appendTo(a1);
//       a1.appendTo(div2);
//       a2.appendTo(div2);
//       div2.appendTo(li);
//       li.appendTo(ul);

//     }
//     ul.appendTo(fwrap);
//     folders.push(fwrap);
//     //$('#tsel .column').append(fwrap);
//     //var overlay = fwrap.appendTo($('#tsel').find('.column').eq(i));
//     //overlay.appendTo('body');
//   }
//   return folders;
// }





function dumpBookmarks(map,sync) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      dumpTreeNodes(bookmarkTreeNodes, map,bookmarkTreeNodes.title);
      sync();
    });
}
function dumpTreeNodes(bookmarkNodes, map,parentTitle) {
  for (var i = 0; i < bookmarkNodes.length; i++) {
    dumpNode(bookmarkNodes[i], map, parentTitle);
  }
}
function dumpNode(bookmarkNode, map, parentTitle) {
  
  // 是一个目录
  if(bookmarkNode.children)
  {
    
    if(bookmarkNode.children.length > 0)
    {
      return dumpTreeNodes(bookmarkNode.children, map,bookmarkNode.title);
    }
  }
  // 是一个书签
  else
  {
    var folder = parentTitle;
    var title = "";
    var url = "";

    if(bookmarkNode.title)
    {
      title = bookmarkNode.title;
    }
    if(bookmarkNode.url)
    {
      url = bookmarkNode.url;
    }
    if(!map[folder])
    {
      map[folder] = new Array();
    }
    // 定义 bookMark 类
    var BookMark = {
      create : function(){
        var bookmark = {};
        bookmark.folder = folder;
        bookmark.url = url;
        bookmark.title = title;
        return bookmark;
      }
    }
    var bookmark = BookMark.create();

    map[folder].push(bookmark);
  }
}

// Traverse the bookmark tree, and print the folder and nodes.
// function dumpBookmarks(query) {
//   var bookmarkTreeNodes = chrome.bookmarks.getTree(
//     function(bookmarkTreeNodes) {
//       $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
//     });
// }
// function dumpTreeNodes(bookmarkNodes, query) {
//   var list = $('<ul>');
//   var i;
//   for (i = 0; i < bookmarkNodes.length; i++) {
//     list.append(dumpNode(bookmarkNodes[i], query));
//   }
//   return list;
// function dumpNode(bookmarkNode, query) {
//   if (bookmarkNode.title) {
//     if (query && !bookmarkNode.children) {
//       if (String(bookmarkNode.title).indexOf(query) == -1) {
//         return $('<span></span>');
//       }
//     }
//     var anchor = $('<a>');
//     anchor.attr('href', bookmarkNode.url);
//     anchor.text(bookmarkNode.title);
//     /*
//      * When clicking on a bookmark in the extension, a new tab is fired with
//      * the bookmark url.
//      */
//     anchor.click(function() {
//       chrome.tabs.create({url: bookmarkNode.url});
//     });
//     var span = $('<span>');
//     var options = bookmarkNode.children ?
//       $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
//       $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
//         'href="#">Delete</a>]</span>');
//     var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
//       '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
//       '</td></tr></table>') : $('<input>');
//     // Show add and edit links when hover over.
//         span.hover(function() {
//         span.append(options);
//         $('#deletelink').click(function() {
//           $('#deletedialog').empty().dialog({
//                  autoOpen: false,
//                  title: 'Confirm Deletion',
//                  resizable: false,
//                  height: 140,
//                  modal: true,
//                  overlay: {
//                    backgroundColor: '#000',
//                    opacity: 0.5
//                  },
//                  buttons: {
//                    'Yes, Delete It!': function() {
//                       chrome.bookmarks.remove(String(bookmarkNode.id));
//                       span.parent().remove();
//                       $(this).dialog('destroy');
//                     },
//                     Cancel: function() {
//                       $(this).dialog('destroy');
//                     }
//                  }
//                }).dialog('open');
//          });
//         $('#addlink').click(function() {
//           $('#adddialog').empty().append(edit).dialog({autoOpen: false,
//             closeOnEscape: true, title: 'Add New Bookmark', modal: true,
//             buttons: {
//             'Add' : function() {
//                chrome.bookmarks.create({parentId: bookmarkNode.id,
//                  title: $('#title').val(), url: $('#url').val()});
//                $('#bookmarks').empty();
//                $(this).dialog('destroy');
//                window.dumpBookmarks();
//              },
//             'Cancel': function() {
//                $(this).dialog('destroy');
//             }
//           }}).dialog('open');
//         });
//         $('#editlink').click(function() {
//          edit.val(anchor.text());
//          $('#editdialog').empty().append(edit).dialog({autoOpen: false,
//            closeOnEscape: true, title: 'Edit Title', modal: true,
//            show: 'slide', buttons: {
//               'Save': function() {
//                  chrome.bookmarks.update(String(bookmarkNode.id), {
//                    title: edit.val()
//                  });
//                  anchor.text(edit.val());
//                  options.show();
//                  $(this).dialog('destroy');
//               },
//              'Cancel': function() {
//                  $(this).dialog('destroy');
//              }
//          }}).dialog('open');
//         });
//         options.fadeIn();
//       },
//       // unhover
//       function() {
//         options.remove();
//       }).append(anchor);
//   }
//   var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
//   if (bookmarkNode.children && bookmarkNode.children.length > 0) {
//     li.append(dumpTreeNodes(bookmarkNode.children, query));
//   }
//   return li;
// }


function icurmzFun()
{
    "use strict";

    var DEBUG = false,
        hideFolderClick = false, // Suppress click from folder drag
        key = "key=" + $('#key').val(),
        hostDomain = window.location.protocol + "//" + window.location.host,
        hostUrl = hostDomain + "/icrumz",
        hostMsgUrl = hostDomain + "/icrumz/messages/text",
        hostDataUrl = hostDomain + "/icrumz/messages/data",
        hostLogoutUrl = hostDomain + "/logout",

        updTimer = '',
        animationDelay = 200,
        //updTimeOut = animationDelay + 10,  // Server update delay, must wait for folder animation to complete
        updTimeOut = 0,
        inProcess = false,
        activeCollection = $('#tsel').find('.column'),
        textObj = {  // Dialog messages
            newAccWelcomeMsg: "Welcome to iCrumz!",
            bkDeleteMsg: "Deleteing bookmark '{0}.'",
            flDeleteMsg: "Deleteing folder '{0}' and {1} bookmark{2}.",
            noSessionMsg: "Changes could not be saved. Try again.",
            commErrorMsg: "Communications error try again."
        },
        dataObj = {  // Application data
            newAccLogin: false,
            uid: "1",
            cnm: "Main",
            cid: "1",
            ver: "0"
        };

    // if ($.browser.mozilla) {
    //     // Bust Firefox's ornery, aggressive  cache
    //     hostLogoutUrl = hostLogoutUrl + '?' + key.split('-')[4]
    // }

    // $('#logout').click(function () {
    //     window.location.reset(hostLogoutUrl);
    //     return false;
    // })

    // Log bookmark clicks to Universal Analytics (GA)
    // $('.itm > a:nth-child(2)').on('click', function () {
    //     ga('send', 'event', 'bookmark', 'click', dataObj.uid, 1);
    // });

    // Load dialog messages
    //TODO: Optimization opportunity - Load dialog messages on 1st session call only
    // ajaxCall(hostMsgUrl, key, function (cbData) {

    //     DEBUG ? console.log("loadTextObj") : '';
    //     textObj = cbData.json;

    //     // Load application data
    //     // Asynchronous order of JS execution must agree with OTU token 
    //     // processing server-side. see IcrumzController.message
    //     ajaxCall(hostDataUrl, key, function (cbData) {

    //         DEBUG ? console.log("loadDataObj") : '';
    //         dataObj = cbData.json;

    //         // Display welcome message to first-time user
    //         if (dataObj.newAccLogin === 'true') {
    //             // Delay allows time for server call to complete
    //             // TODO: A delay is not the best solution to put order into async calls
    //             // This will break if server response is too slow, but this is a bigger 
    //             // issue than this one instance. e.g 'spaming' on Cmd-R in Safari = errors
    //             DEBUG ? console.log("newAccWelcomeMsg") : '';
    //             alert(textObj.newAccWelcomeMsg);
    //         } else {
    //             DEBUG ? console.log("search.focus") : '';
    //             $('input#search').focus();
    //         }
    //     });
    // });

    /**
     * Initialize jQuery.ui.droppable plugin
     */
    $("#trash").droppable({
        hoverClass: "trash-hover",
        tolerance: 'pointer',
        drop: function (event, ui) {
            deleteTrash(event, ui);
        }
    });

    /**
     * Initialize jQuery.ui.sortable plugin
     */
    activeCollection.sortable({
        forcePlaceholderSize: true,
        handle: '.fldr, .itm',
        helper: 'original', //default - 'clone' hogs cpu
        items: '.x',
        opacity: 0.6,
        placeholder: 'placeholder',
        revert: 250,
        tolerance: 'pointer',
        toleranceElement: '> div',
        scrollSpeed: 10,
        dropOnEmpty: false,
        connectWith: activeCollection,
        start: function () {
            // Suppress click from folder drag
            hideFolderClick = true;
            DEBUG ? console.log("hideFolderClick set - start:event") : '';
        },
        update: function (event, ui) {
            // Clear new folder state
            if (!inProcess && ui.item.children('div').hasClass('new')) {
                setNewFolderState(ui.item.children('div'), false);
                DEBUG ? console.log("New folder status cleared - update:event -- class new?:" +
                    ui.item.children('div').hasClass('new') + " inProcess: " + inProcess) : '';
            }
            // Update server after a delay - avoids double update when moving between columns
            // e.g. move out of column A :: Update, move into column B :: Update
            eventDelay(updateServer, updTimer, updTimeOut);
        },
        stop: function () {
            hideFolderClick = false;
            DEBUG ? console.log("hideFolderClick clear - stop:event") : '';
        }
    }).disableSelection(); // prevent selection of bookmark text

    /**
     * Configure sortable 'items' property based on current selection
     */
    $('.fldr').mouseenter(function () {
        DEBUG ? console.log("enter folder") : '';
        // Allow subfolders
//        activeCollection.sortable("option", "items", $('.fldr, .itm').parent());
        // Prohibit subfolders
        activeCollection.sortable("option", "items", $('.fldr').parent());
        activeCollection.sortable("option", "dropOnEmpty", true);
    }).mouseleave(function () {
            DEBUG ? console.log("leave folder") : '';
            activeCollection.sortable("option", "items", '.x');
        });

    $(".itm").mouseenter(function () {
        DEBUG ? console.log("enter bookmark") : '';
        activeCollection.sortable("option", "items", $('.itm').parent());
        activeCollection.sortable("option", "dropOnEmpty", false);
    }).mouseleave(function () {
            DEBUG ? console.log("leave bookmark") : '';
            activeCollection.sortable("option", "items", '.x');
        });

    /**
     * Prepare and display page on initial load
     */
    $(function () {

        // Set folder state according data-stat attribute
        var saveAd = animationDelay;
        animationDelay = 0;
        $('.fldr').each(function () {

            showHideFolder($(this), $(this).data('stat'));
        });
        animationDelay = saveAd;

        // Show page content when Javascript execution completes. Prevents flash of
        // hidden bookmarks under collapsed folders. See top of icrumz.html
        // This should always be the last code executed on page load/refresh
        DEBUG ? console.log("showPage") : '';
        document.body.style.display = "";
        $('html').removeClass("no-js");

        // Must be executed with a visible page or folders will have 0 height
        setColHeight();

        // Set focus to Search on page load
        // happens in ajaxCall(hostDataUrl...
    });

    /**
     * window onResize
     *
     * Set dynamic column height on window resize
     */
    $(window).on("resize", function () {

        setColHeight();

    });

    /**
     * .itm onClick
     *
     * Bind .itm click event to suppress following link on item drag
     */
    $('.itm').children('a').bind('click', function () {

        DEBUG ? console.log(".itm a click") : '';

        // Suppress click from folder drag - set by sortable:sort event
        if (hideFolderClick) {
            DEBUG ? console.log("hideFolderClick suppressed - click:event") : '';
            return false;
        }

        return true;
    });

    /**
     * .fldr onClick
     *
     * Bind folder click event to showHideFolder()
     */
    $('.fldr span').bind('click', function () {

        DEBUG ? console.log(".fldr span click") : '';

        // Suppress click from folder drag - set by sortable:sort event
        if (hideFolderClick) {
            DEBUG ? console.log("hideFolderClick suppressed - click:event") : '';
            return false;
        }

        // Toggle folder state
        showHideFolder($(this).parent());

        // Update server
        eventDelay(updateServer, updTimer, updTimeOut);

        return true;
    });

    /**
     * .itm img onClick (favicon)
     *
     * Bind .itm img click event and update edited bookmark's URL with folder name
     */
    $('.itm img').bind('click', function () {

        // Suppress click from folder drag - set by sortable:sort event
        if (hideFolderClick) {
            DEBUG ? console.log("hideFolderClick suppressed - click:event") : '';
            return false;
        }

        // Update bookmark edit URL with folder name parameter
        var folderName,
            favicon,
            editUrl;

        favicon = $(this);
        folderName = favicon.parents('.fwrap').find('.fldr > span').text();
        editUrl = favicon.parent().prop('href') + '&folder=' + folderName;
        favicon.parent().prop('href', editUrl);

        return true;
    });

    /**
     * Show/hide Settings menu
     */
    $("#settings").mouseenter(
        function () {
            $(this).addClass("settings-hover");
            showSettingsMenu(true);
        }
    ).mouseleave(
        function () {
            $(this).removeClass("settings-hover");
            eventDelay(function () {
                if (!$('#settings-menu').is(":hover")) {
                    showSettingsMenu(false);
                }
            }, updTimer, 4 * updTimeOut);
        }
    );

    $("#settings-menu").mouseleave(
        function () {
            eventDelay(function () {
                if (!$('#settings').is(":hover")) {
                    showSettingsMenu(false);
                }
            }, updTimer, 2 * updTimeOut);
        }
    );

    function showSettingsMenu(show) {
        if (show === true) {
            $('#settings-menu').show(animationDelay, "swing");
        } else {
            $('#settings-menu').hide(animationDelay, "swing");
        }
    }

    /**
     * deleteEmptyFolders
     *
     * Delete empty folders from collection
     */
    function deleteEmptyFolders() {

        DEBUG ? console.log("deleteEmptyFolders") : '';

        //var EMPTY_HEIGHT = 30;

        // Loop through each column
        activeCollection.each(function () {

            // Examine the number of items in each folder
            $(this).children('li').each(function () {
                if ($(this).find('.itm').length === 0) {
                    DEBUG ? console.log("h: " + $(this).height()) : '';
                    DEBUG ? console.log("l: " + $(this).find('.itm').length) : '';
                    $(this).remove();
                }
            });
        });
    }

    /**
     * showHideFolder
     *
     * Toggle open/collapsed folder state
     *
     * @param folder - jQuery object - the folder to operate on
     * @param status - optional integer 0 - 3
     *          0 = existing collapsed folder
     *          1 = existing expanded folder
     *          2 = new collapsed folder
     *          3 = new expanded folder
     *          not 0 - 3 = toggle folder expanded/collapsed state
     */
    function showHideFolder(folder, status) {

        DEBUG ? console.log("showHideFolder") : '';

        switch (status) {
            // existing collapsed
        case 0:
            folder.next().hide(animationDelay, "swing");
            folder.data('stat', 0);
            DEBUG ? console.log("fStat: " + folder.data('stat')) : '';
            break;
            // existing expanded
        case 1:
            folder.next().show(animationDelay, "swing");
            folder.data('stat', 1);
            DEBUG ? console.log("fStat: " + folder.data('stat')) : '';
            break;
            // new collapsed
        case 2:
            folder.next().hide(animationDelay, "swing");
            folder.data('stat', 2);
            setNewFolderState(folder, true);
            DEBUG ? console.log("fStat: " + folder.data('stat')) : '';
            break;
            // new expanded
        case 3:
            folder.next().show(animationDelay, "swing");
            folder.data('stat', 3);
            setNewFolderState(folder, true);
            DEBUG ? console.log("fStat: " + folder.data('stat')) : '';
            break;
        default:
            // toggle expanded/collapsed state - preserve new/existing state
            folder.next().slideToggle(animationDelay, "swing");
            switch (folder.data('stat')) {
                // existing collapsed
            case 0:
                folder.data('stat', 1);
                break;
                // existing expanded
            case 1:
                folder.data('stat', 0);
                break;
                // new collapsed
            case 2:
                //new collapsed
                folder.data('stat', 3);
                break;
                // new expanded
            case 3:
                folder.data('stat', 2);
                break;
            }
            DEBUG ? console.log("fStat: " + folder.data('stat')) : '';
        }
    }

    /**
     * setupNewFolder
     *
     * Set or Clear new folder display state
     */
    function setNewFolderState(folder, setNewState) {

        var fstat;

        if (setNewState === true) {
            folder.addClass("new");
            folder.children('span').after('<sup>new</sup>');
            DEBUG ? console.log("set new folder state") : '';
        } else if (setNewState === false) {
            fstat = folder.data('stat');
            folder.removeClass("new")
                .data('stat', ((fstat > 1) ? fstat - 2 : fstat))
                .children('sup').remove();
            DEBUG ? console.log("clear new folder state") : '';
        }
    }

    /**
     * eventDelay
     *
     *  Limit event handling during a specified delay
     *
     * @param callBack - An event handler
     * @param timeoutID - A setTimeout instance
     * @param delay - Time period to ignore further event calls
     *
     * @requires function global variable inProcess
     */
    function eventDelay(callBack, timeoutID, delay) {

        DEBUG ? console.log("eventDelay ") : '';

        if (!inProcess) {
            // Disable events
            inProcess = true;
            timeoutID = window.setTimeout(function () {
                callBack.apply();
                // Enable events
                inProcess = false;
            }, delay);
        }
    }

    /**
     * setColHeight
     *
     * Set column height to the greater of:
     * Available screen space or longest column plus a reasonable dropzone
     */
    function setColHeight() {

        var VIEW_CHROME = 210, // Window space used by header + footer
            COL_DROP_ZN = 30, // Min empty dropzone at the bottom of each column
            FOLDER_MARGIN = 5, // Combine top and bottom folder margin

            winHeight,
            maxCol,
            colHeight = [],
            fldrHeight;

        DEBUG ? console.log("setColHeight") : '';

        // Get view port height
        winHeight = ($(window).height() - VIEW_CHROME);
        DEBUG ? console.log("W: " + winHeight) : '';

        // Get height of each column
        activeCollection.each(function () {
            fldrHeight = 0;

            // Add the height of all folders in column
            $(this).children('li').each(function () {
                fldrHeight += ($(this).height() + FOLDER_MARGIN);
                DEBUG ? console.log("f: " + ($(this).height())) : '';
            });

            DEBUG ? console.log("F: " + fldrHeight) : '';

            colHeight.push(fldrHeight);
            DEBUG ? console.log("C: " + fldrHeight) : '';
        });

        // Find the longest column
        maxCol = Math.max.apply(null, colHeight) + COL_DROP_ZN;
        DEBUG ? console.log("L " + maxCol) : '';

        // Set column length
        activeCollection.each(function () {

            if (maxCol <= winHeight) {
                $(this).height(winHeight);
            } else if (maxCol > winHeight) {
                $(this).height(maxCol);
            }
        });
    }

    /**
     * updateServer
     *
     * Send serialized UI status to server and handle response
     */
//     function updateServer() {

//         var json;

//         DEBUG ? console.log("updateServer") : '';

//         // prepare display for server update
//         deleteEmptyFolders();
//         setColHeight();

//         // Encode page state as serialized JSON string
//         json = ($("#cc").find("#tsel").iczSerialize());

//         // Write to the server
//         $.post(hostUrl, {
//             _method: "PUT",
//             uid: dataObj.uid,
//             name: dataObj.cnm,
//             items: json,
//             id: dataObj.cid,
//             Version: dataObj.ver
//             // icrumz_collection version field prevents lost data
//             // caused by out of sequence updates.

//         }, function (data, status) {

//             // Valid server response should be less than 500 characters
//             if (data.length > 500) {
//                 alert(textObj.noSessionMsg);
//                 window.location.reset(hostLogoutUrl);
//             }

//             // Parse JSON contained in response body to JQuery object
//             //TODO: Refactor message transfer to use standard AJAX protocol.
//             //Requires refactoring of IcrumzController.update() as well.            
//             var resultObj = $.parseJSON($($.parseXML(data)).find("body").text());

//             // Update client's data version value to match server
//             dataObj.ver = resultObj.version;

//             DEBUG ? console.log("Status: " + resultObj.status + " :: Version: " + resultObj.version + " :: Mesage: " + resultObj.message) : '';

// // Better to alter IcrumzController.refreshMsg than silently refresh page
//             if (resultObj.status !== "success") {
// //                alert(resultObj.message);
//                 window.location.reload(true);
//             }
//         });

//         DEBUG ? console.log(json) : '';
//     }

    function deleteTrash(event, ui) {

        var folder = '',
            items = [],
            deleteMsg = '';

        // Delete items (bookmarks) contained in a folder
        if (ui.draggable.children().hasClass('fldr')) {
            folder = ui.draggable.children().children('span').text();

            // Get all items in the selected folder
            ui.draggable.find(".itm").each(function () {

                // Fill items[] with bookmark IDs
                items.push(parseInt($(this).children("a:first").attr("href").split('=')[1], 10));
            });

            // Delete a single item (bookmark)
        } else if (ui.draggable.children().hasClass('itm')) {
            folder = '';
            items.push(parseInt(ui.draggable.find("a:first").attr("href").split('=')[1], 10));
        }

        // Perform delete or cancel after confirm
        if (folder.length > 0) {
            DEBUG ? console.log("Delete Folder") : '';
            deleteMsg = textObj.flDeleteMsg
                .replace("{0}", folder)
                .replace("{1}", items.length)
                .replace("{2}", items.length > 1 ? 's' : '');
            if (confirm(deleteMsg)) {
                ui.draggable.remove();
                // updateServer() called by sortable update event;
            }
        } else {
            DEBUG ? console.log("Delete Bookmark") : '';
            deleteMsg = textObj.bkDeleteMsg
                .replace("{0}", ui.draggable.children().find('a:nth-child(2)').text());
            if (confirm(deleteMsg)) {
                // Suppress the click that will propagate when the bookmark is removed
                ui.draggable.find('a').each(function () {
                    $(this).attr('onclick', 'return false;');
                });
                ui.draggable.remove();
                // updateServer() called by sortable update event;
            }
        }
    }

    /**
     * communicationsError
     *
     * Display and log client to server communications errors
     *
     * @param error - String, error name
     * @param message - String, error description
     *
     */
        //TODO: Refactor to Jquery plugin - used in multiple places
    // function communicationsError(message, error) {

    //     DEBUG ? console.log("error: " + error) : '';
    //     DEBUG ? console.log("message: " + message) : '';

    //     if (error === undefined || error.length === 0) {

    //         error = "Error: ";
    //     }

    //     alert(error + " " + message);
    // }

    /**
     * ajaxCall
     *
     * Make the actual AJAX call to the server, handle errors and process a result callback
     *
     * @param hostUrl - String the host Url to call, may be a relative Url
     * @param data - String, serialized data in the format expected by the server
     * @param successCallback - function, called when the communication succeeds
     *
     */
        //TODO: Refactor to Jquery plugin - used in multiple places
    // function ajaxCall(hostUrl, data, successCallback) {

    //     if (window.staticMode !== undefined) {
    //         //alert('StaticMode: Server communication is disabled!');
    //         DEBUG ? console.log("StaticMode - ajaxCall aborted") : '';

    //         return false;
    //     }

    //     DEBUG ? console.log("ajaxCall") : '';

    //     var successProp = function (data, statusText, jqXHR) {

    //         DEBUG ? console.log("successProp: Status: " + statusText) : '';
    //         DEBUG ? console.log("successProp: Data: " + data) : '';

    //         // Validate response
    //         var statusCode,
    //             svrResponse,
    //             json,
    //             resultObj;

    //         try {
    //             statusCode = jqXHR.status;
    //             svrResponse = jqXHR.responseText;
    //             json = $.parseJSON(data);

    //             resultObj = {
    //                 "status": statusCode,
    //                 "statusText": statusText,
    //                 "json": json
    //             };

    //             // Process response
    //             DEBUG ? console.log("AJAX call: status: '" + statusCode + "' statusText: '" + statusText +
    //                 "'" + "' data: '" + data + "'" + "' svrResponse: '" + svrResponse) : '';

    //             successCallback(resultObj);
    //             return true;

    //         } catch (e) {
    //             DEBUG ? console.log("AJAX call: Communications error - " + e) : '';
    //             communicationsError(textObj.commErrorMsg);
    //             return false;
    //         }
    //     };

    //     $.ajax({
    //         type: "POST",
    //         url: hostUrl,
    //         data: data,
    //         dataType: "json",
    //         converters: {
    //             'text json': true
    //         },
    //         success: successProp,
    //         error: function (jqXHR, statusText, error) {

    //             // Log error
    //             var statusCode = jqXHR.status,
    //                 svrResponse = jqXHR.responseText,
    //                 errorMsg = "status: '" + statusCode + "' statusText: '" + statusText +
    //                     "' svrResponse: '" + svrResponse + "' error: '" + error + "'";

    //             DEBUG ? console.log("AJAX call worker: calling: " + hostUrl, errorMsg) : '';
    //             communicationsError(textObj.commErrorMsg);
    //             return false;

    //         }
    //     });

    //     return true;
    // }
  }





