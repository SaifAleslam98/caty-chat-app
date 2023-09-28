var btn = document.getElementsByName('send');
$(document).on('click','.btn-send', function() {

    var id = $('.btn-send').attr('id');
    console.log(id);
})
