/*jslint browser: true*/ /*global $*/
(function() {
    "use strict";

    function shuffle(array) {
        var tmp, current, top = array.length;

        if (!top) {
            return array;
        }

        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    }

    function itemDict(item) {
        return {
            "value": item.colorname,
            "label": item.colorname,
            "colorCode": item.colorcode,
            "defaultColor": item.defaultcolor
        };
    }

    function loadColor(item) {
        $("#colorName")
            .data("ui-autocomplete")
            ._trigger("select", "autocompleteselect", {
                item: itemDict(item)
            });
    }

    function parseColors(data) {
        return $.map(data, function(item) {
            return itemDict(item);
        });
    }

    function prepareCloud(data) {
        var words = shuffle(data);
        words = words.slice(0, 15);
        var cloud = $("#cloud");
        $(words).each(function(index, item) {
            var a = $(
                    "<a />", {
                        href: "#",
                        title: "szukano " + item.clicks + " razy",
                        text: item.colorname + " "
                    }
                )
                .css("color", item.colorcode)
                .css("font-size", Math.random() * (30 - 12) + 12)
                .click(function(e) {
                    e.preventDefault();
                    loadColor(item);
                });
            cloud.append(a);
        });
    }

    function prepareColorBox(item) {
        $("#loading").show();
        $("#colorName").val(item.label);
        $("#colorBox").css("background-color", item.colorCode);
        $("#colorCode").text(item.colorCode);
        $("#defaultColor").text(item.defaultColor);
        $("#loading").fadeOut("slow");
        $("#result").show();
    }

    $().ready(function() {
        var colors;
        $.getJSON("db/colors_pl.json").done(function(data) {
            colors = parseColors(data);
            prepareCloud(data);
            $("#colorsCount").text(colors.length);
        });
        $("#colorName").autocomplete({
            source: function(request, response) {
                var filteredArray = $.ui.autocomplete.filter(colors, request.term);
                response(filteredArray.slice(0, 10));
            },
            select: function(e, ui) {
                e.preventDefault();
                prepareColorBox(ui.item);
            },
            response: function(event, ui) {
                if (ui.content.length === 1) {
                    $(this).data("ui-autocomplete")._trigger("select", "autocompleteselect", {
                        item: ui.content[0]
                    });
                    $(this).autocomplete("close");
                }
            }
        });
    });
}());