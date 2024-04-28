
function sliderInit() {
    $('#carousel-sponsors-id').carouFredSel({
        width: '100%',
        auto: {
            pauseOnHover: 'immediate'
        },
        duration: 3000,
        scroll: {
            items: 'page'
        },
        items: {
            visible: {
                min: 1,
                max: 10
            }
        },
        pagination: {
            container: $("#sponsorPagination"),
            anchorBuilder: function (nr, item) {
                return '<li rel="' + nr + '"></li>';
            }
        }
    });

    $('#reviewsSliderId').carouFredSel({
        width: '100%',
        auto: {
            pauseOnHover: 'immediate'
        },
        duration: 3000,
        scroll: {
            items: 'page'
        },
        items: {
            visible: {
                min: 1,
                max: 1
            }
        },
        pagination: {
            container: $("#reviewsPagination"),
            anchorBuilder: function (nr, item) {
                return '<li rel="' + nr + '"></li>';
            }
        }
    });

    $('#authorsSlider').carouFredSel({
        width: '100%',
        auto: {
            pauseOnHover: 'immediate'
        },
        duration: 3000,
        scroll: {
            items: 'page'
        },
        items: {
            visible: {
                min: 1,
                max: 3
            }
        },
        pagination: {
            container: $("#authorPagination"),
            anchorBuilder: function (nr, item) {
                return '<li rel="' + nr + '"></li>';
            }
        }
    });

    $('#nextEvents').carouFredSel({
        width: '100%',
        auto: {
            pauseOnHover: 'immediate'
        },
        duration: 3000,
        scroll: {
            items: 'page'
        },
        items: {
            visible: {
                min: 1,
                max: 2
            }
        },
        pagination: {
            container: $("#nextEvPagination"),
            anchorBuilder: function (nr, item) {
                return '<li rel="' + nr + '"></li>';
            }
        }
    });

    $('#endEvents').carouFredSel({
        width: '100%',
        auto: {
            pauseOnHover: 'immediate'
        },
        duration: 3000,
        scroll: {
            items: 'page'
        },
        items: {
            visible: {
                min: 1,
                max: 2
            }
        },
        pagination: {
            container: $("#endEvPagination"),
            anchorBuilder: function (nr, item) {
                return '<li rel="' + nr + '"></li>';
            }
        }
    });
}

$(document).ready(function() {
    $(".slideList .title").click(function() {
       $(this).parent().toggleClass('open');
    });

    $(".menuCont").click(function() {
        $(this).parent().parent().toggleClass('open');
        $("html").toggleClass('fixed');
    });

    $(".vote .cRadio").click(function() {
        var el = $(this);
        el.addClass('act');
        if (el.hasClass('end')) {
            $(".cMusicVote").addClass('anim').next().show();
            $(".cMusicVote").fadeOut(500);
        } else {
            el.parent().parent().addClass('anim').next().addClass('act');
            el.parent().parent().fadeOut(500);
        }
    });

    $(".cCheck").click(function() {
        var el = $(".icon-checkmark", $(this));
        el.toggleClass('hide');
        $('input', $(this)).prop("checked", el.hasClass('hide') ? false : true );
        return false
    });

    $(".listStyleBts li").click(function() {
        var el = $(this);
        if (!el.hasClass('act')) {
            el.addClass('act').siblings().removeClass('act');
            $(".topListWrap").toggleClass('cards', el.hasClass('sCards'));
        }
    });
});

$(window).load(function() {
    sliderInit();
});

var resizeTimer;

$(window).resize(function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sliderInit, 100);
});

$(document).ready(() => {

    $('.rating').each(function () {
        let el = $(this),
            rating = el.attr('rating') || 0;
        el.children().eq(0).css('width', parseFloat(rating)*3 + 'rem')
    })

    $('.js-choise .star').mouseenter(function () {
        let el = $(this);
        el.siblings('input').val(el.index() + 1);
        changeColor(el.parent(), el.index())
    })

    const changeColor = (wrap, index) => {
        wrap.find('.star').each(function (stIndex) {
            let st = $(this);
            stIndex <= index ? $(this).addClass('active') : $(this).removeClass('active')
        })
    }

    $('.js-choise .star').click(function () {
        let el = $(this);
        $.post('/url', {rating: el.index() + 1}).then((resp) => {

        })
        $('h1').html('<div>your rating ' + (el.index() + 1) + '</div>')
        $(this).parent().parent().addClass('hide');
    })

    $('.rating').mouseleave(function () {
        $(this).find('.js-choise').removeClass('hide');
    })
})