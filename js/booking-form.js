(function ($) {
    "use strict";

    $(function () {
        $('input[name="inOut"]').daterangepicker({ singleDatePicker: true, showDropdowns: true, minYear: 2023, maxYear: 2025, locale: { format: "DD-MMM-YYYY" } }, function (start, end, label) {
            var years = moment().diff(start, "years");
        });
        $('input[name="daterange"]').daterangepicker({ opens: "left", minYear: "2023", maxYear: "2025", locale: { format: "DD-MMM" } }, function (start, end, label) {
            console.log("A new date selection was made: " + start.format("YYYY-MM-DD") + " to " + end.format("YYYY-MM-DD"));
        });
    });

    $(".country-area ul li:first-child").addClass("active");
    $(".country-area").on("mouseleave", function () {
        $(".country-area ul li:not(:first-child)").removeClass("active");
        $(".country-area ul li:first-child").addClass("active");
    });
    $(".country-area ul li").on({
        mouseenter: function () {
            $(this).addClass("active").siblings().removeClass("active");
        },
    });
    $(".quantity__minus").on("click", function (e) {
        e.preventDefault();
        var input = $(this).siblings(".quantity__input");
        var value = parseInt(input.val());
        if (value > 1) {
            value--;
        }
        input.val(value.toString().padStart(2, "0"));
    });
    $(".quantity__plus").on("click", function (e) {
        e.preventDefault();
        var input = $(this).siblings(".quantity__input");
        var value = parseInt(input.val());
        value++;
        input.val(value.toString().padStart(2, "0"));
    });
    $(".guest-quantity__minus").on("click", function (e) {
        let type = $(this).data("type");
        e.preventDefault();
        var input = $(this).siblings(".quantity__input");
        var value = parseInt(input.val());
        if (type == "adult") {
            if (value > 1) {
                value--;
                $("#adult-qty").text(value.toString());
            }
        } else if (type == "child") {
            if (value > 0) {
                value--;
                $("#child-qty").text(value.toString());
            }
        }
        input.val(value == 0 ? value : value.toString());
    });
    $(".guest-quantity__plus").on("click", function (e) {
        e.preventDefault();
        let type = $(this).data("type");
        var input = $(this).siblings(".quantity__input");
        var value = parseInt(input.val());
        value++;
        if (type == "adult") {
            $("#adult-qty").text(value.toString());
        } else if (type == "child") {
            $("#child-qty").text(value.toString());
        }
        input.val(value.toString());
    });
    $(document).ready(function () {
        $(".qty-btn").on("click", function (e) {
            e.stopPropagation();
            $(this).next(".quantity-area").toggleClass("active");
            $(".quantity-area").not($(this).next(".quantity-area")).removeClass("active");
        });
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".quantity-area").length) {
                $(".quantity-area").removeClass("active");
            }
        });
    });
    $(".select-input").on("click", function () {
        $(".custom-select-wrap").toggleClass("active");
    });
    $(document).on("click", ".destination-dropdown-icon", function (e) {
        e.stopPropagation();
        $(this).next(".destination-wrap").toggleClass("active");
        $(this).parents(".destination-column").siblings().children(".destination-dropdown-card").children(".destination-wrap").removeClass("active");
    });
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".destination-wrap").length) {
            $(".destination-wrap").removeClass("active");
        }
    });
    $(".searchbox-input").each(function () {
        var $container = $(this);
        $container.find(".option-list li").on("click", function () {
            var destinationText = $(this).find(".destination h6, h6").text();
            $container.find(".select-input input").val(destinationText);
            $container.find(".custom-select-wrap").removeClass("active");
        });
        $(document).on("click", function (event) {
            if (!$(event.target).closest($container).length) {
                $container.find(".custom-select-wrap").removeClass("active");
            }
        });
        $container.find(".custom-select-search-area input").on("input", function () {
            var searchText = $(this).val().toLowerCase();
            $container.find(".option-list li").each(function () {
                var destinationText = $(this).find(".destination h6").text().toLowerCase();
                if (destinationText.includes(searchText)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    });
    $(".deatination_drop").select2({ closeOnSelect: true, width: "resolve" });
    const element = document.querySelectorAll(".badge__char");
    const step = 360 / element.length;
    element.forEach((elem, i) => {
        elem.style.setProperty("--char-rotate", i * step + "deg");
    });
    const foo = 360 / 7;
    for (let i = 0; i <= 7; i++) {
        console.log(i * foo + "deg");
    }
    $(".location-area").each(function () {
        var dealName = $(this).children(".location-list");
        if (dealName.width() >= $(this).width()) {
            dealName.addClass("scrollTextAni");
        }
    });

})(jQuery);