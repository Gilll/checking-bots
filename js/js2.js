$(document).ready(() => {


    $('.rating').each(function () {
        let el = $(this),
            rating = el.attr('rating') || 0;
        el.children().eq(0).css('width', parseFloat(rating)*3 + 'rem')
    })

    $('.js-choise .star').mouseenter((e) => {
        let el = $(e.target);
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