/*jslint browser: true*/ /*global $*/
(function() {
    "use strict";
    var shuffle = function(array) {
        var tmp, current, top = array.length;

        if (!top) {
            return array;
        }

        while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    };

    var loadColor = function(item) {
        $("#colorName")
            .data("ui-autocomplete")
            ._trigger("select", "autocompleteselect", {
                item: {
                    "value": item.colorcode,
                    "label": item.colorname,
                    "defaultColor": item.defaultcolor
                }
            });
    };

    var parseColors = function(data) {
        return $.map(data, function(item) {
            return {
                "value": item.colorcode,
                "label": item.colorname,
                "defaultColor": item.defaultcolor
            };
        });
    };

    var prepareCloud = function(data) {
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
    };

    var prepareColorBox = function(item) {
        $("#loading").show();
        $("#colorName").val(item.label);
        $("#colorBox").css("background-color", item.value);
        $("#colorCode").text(item.value);
        $("#defaultColor").text(item.defaultColor);
        $("#loading").fadeOut("slow");
        $("#result").show();
    };

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
            }
        });
    });
}());
