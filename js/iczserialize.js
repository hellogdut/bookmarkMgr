(function ($) {

    "use strict";

    $.fn.iczSerialize = function process() {

        // TODO: Intermittent inclusion of uid and ver properties in serialized JSON
        // e.g. Table icrumz_collection.items may end with "...,228]}]}],"uid":1,"ver":2575}]"
        // Some time with "...,533]}]}]}]". Investigated and correct any anomalies found.

        var DEBUG = false,
            out = [],
            recurse = 0,
            MAX_NEST = "100";

        /**
         * #cc = collections container
         * #cc > li = single collection container
         * #cc > li > ul = single collection
         * #cc > li > ul > li > div > a:[href] = collectionID - text = collection name,
         * .fldr <span>text</span> = folder name, + ul = folder contents
         * .itm > a:[first][href] = bookmarkID, img = bookmark favicon
         * .itm > a:[second][href] = bookmark link, text = bookmark description
         */

        /**
         * Set maximum nesting level to process
         * Does not prevent nesting, only saving to server beyond MAX_NEST
         *
         * @param maxNest - Nesting level, or undefined to keep default
         * @return {Boolean}
         */
            //TODO: Fix SetMaxNest, or don't use it
        function setMaxNest(maxNest) {

            DEBUG ? console.log("setMaxNest " + maxNest) : '';
            // Accept optional (undefined) parameter
            maxNest = (maxNest === undefined) ? MAX_NEST : maxNest;

            // Require numeric parameter
            if ($.isNumeric(maxNest)) {

                MAX_NEST = maxNest;

                return true;
            }

            return false;

        }

        function processSubFolders(node) {

            DEBUG ? console.log("processSubFolders") : '';
            // node = the li representing an item (.itm)
            // Return a single folder object
            var folder = {
                "f": "",
                "s": "",
                "its": ""
            };


            // Process each folder
            node.children(".fldr").each(function () {

                // Populate a folder with items
                folder = {
                    "f": $.trim($(this).children('span').text()),
                    "s": $.trim($(this).data('stat')),
                    "its": $.trim(processItems($(this)))
                };
            });

            return folder;

        }

        function processItems(node) {

            DEBUG ? console.log("processItems") : '';
            // node = the div representing the current folder (.fldr)
            // Return an array of item objects
            var items = [],
                item;

            // Get all items in the selected folder
            node.siblings().find(".itm").each(function () {

                // Get each bookmark item's ID
                item = parseInt($(this).children("a:first").attr("href").split('=')[1], 10);

                // Current item is not a bookmark, it must be a sub-folder
                if (!item && (recurse < MAX_NEST)) {

                    // avoid potential endless loop
                    recurse++;

                    // Process subfolders and their items
                    item = processSubFolders($(this));
                    recurse--;
                }

                items.push(item);

            });

            return items;

        }

        function processFolders(node) {

            DEBUG ? console.log("processFolders") : '';
            // node = the ul representing a column (.column)
            // Return an array of folder objects
            var folders = [],
                folder = {
                    "f": "",
                    "s": "",
                    "its": ""
                };

            // Process each folder
            node.find(".fldr").each(function () {

                // Populate a folder with items
                folder = {
                    "f": $.trim($(this).children('span').text()),
                    "s": $.trim($(this).data('stat')),
                    "its": processItems($(this))
                };

                // Populate folders array
                folders.push(folder);

            });

            return folders;

        }

        function processColumns(node) {

            DEBUG ? console.log("processColumns") : '';
            // node = the ul containing the current collection (or tab)
            // Return an array of column objects
            var columns = [],
                column = {
                    cl: ""
                };

            // Process each column
            node.find(".column").each(function () {

                // Create a column and populate it with folders
                column = {
                    cl: processFolders($(this))
                };

                columns.push(column);

            });

            return columns;

        }

        function processCollection(node) {

            DEBUG ? console.log("processCollection") : '';
            // node = the ul containing the selected collection (or tab)
            // Return an array of collection objects
            var collection,

            // Get collection ID and Name
                pcNode = node.find("a:first");

            // CollectionID, CollectionNaMe, ColuMnS
            collection = {
                "cid": parseInt(pcNode.attr("href").split("?")[1].split("=")[1], 10),
                "cnm": pcNode.text(),
                "cls": processColumns(node)
            };

            return collection;
        }

        /*
         * Main
         */

        // Set maximum nesting level
        // Serialize iCrumz arrangement for valid parameter
        // Valid: 'falsy' = keep default, set for valid $.isNumeric()
//        if (setMaxNest(maxNest)) {

        // the JQuery object 'this' is now native to the immediate context - no need for $(this)
        this.each(function () {

            out.push(processCollection($(this)));

        });

//        }

        return JSON.stringify(out);

    };

}(jQuery));
