function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|;)" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
var userData = JSON.parse(getCookie('user'));
var senderId = userData._id;
var receiver_id = $('.user-list').attr('id');

var socket = io('/user-namespace', {
    auth: {
        token: userData._id 
    }
});
socket.on('getOnlineUser', function (data) {
    $('#' + data.user_id + '-status').text('online');
    $('#' + data.user_id + '-status').removeClass('offline');
    $('#' + data.user_id + '-status').addClass('online');
});
socket.on('getOfflineUser', function (data) {
    $('#' + data.user_id + '-status').text('offline');
    $('#' + data.user_id + '-status').removeClass('online');
    $('#' + data.user_id + '-status').addClass('offline');
});
//chat save of user
$('#chat-form').submit(function (event) {
    event.preventDefault();
    var message = $('#message').val();
    $.ajax({
        url: '/save-chat',
        type: 'POST',
        data: {
            sender_id: senderId,
            receiver_id: receiver_id,
            message: message
        },
        success: function (response) {
            if (response.success) {
                $('#message').val('');
                let chat = response.data.message;
                let html = `
                <div class="current-user-chat" id='`+ response.data._id + `'>
                    <h6>
                        <i class="fa fa-trash" aria-hidden="true" data-id='` + response.data._id + `' ></i>
                        `+ chat + `</h6>
                </div>
                `;
                $('#chat-container').append(html);
                socket.emit('newChat', response.data);
                scrollChat();
            } else {
                alert(data.msg)
            }
        }
    });
});
//  load new chat
socket.on('loadNewChat', function (data) {
    if (senderId == data.receiver_id && receiver_id == data.sender_id) {
        let html = `
                <div class="distance-user-chat" id='`+ data._id + `'>
                    <h6>
                    
                    `+ data.message + `
                    </h6>
                    
                </div>
                `;
        $('#chat-container').append(html);
    }
    scrollChat();
});

//load old chats
socket.emit('existsChat', { sender_id: senderId, receiver_id: receiver_id });
socket.on('loadChats', function (data) {
    $('#chat-container').html('');
    var chats = data.chats;
    let html = '';
    for (let counter = 0; counter < chats.length; counter++) {
        let addClass = '';
        if (chats[counter]['sender_id'] == senderId) {
            addClass = 'current-user-chat';
        } else {
            addClass = 'distance-user-chat';
        }
        html += `
                <div class='`+ addClass + `'>
                    <h6>`
        if (chats[counter]['sender_id'] == senderId) {
            html += `<i class="fa fa-trash" aria-hidden="true" data-id='` + chats[counter]['_id'] + `' ></i>`
        }
        html += `
                        `+ chats[counter]['message'] + `
                        
                    </h6>
                    
                </div>
                `;
    }
    $('#chat-container').append(html);
    scrollChat();

});
function scrollChat() {
    $('#chat-container').animate({
        scrollTop: $('#chat-container').offset().top + $('#chat-container')[0].scrollHeight
    }, 0)
}
//function to delete message
$(document).on('click', '.fa-trash', function () {

    $('#delete-message-id').val($(this).attr('data-id'));
    var id = $('#delete-message-id').val();
    $.ajax({
        url: '/delete-chat',
        type: 'POST',
        data: { id: id },
        success: function (res) {
            if (res.success == true) {
                $('#'+id).remove();
                socket.emit('chatDeleted', id);
            }
            else {
                alert(res.msg);
            }
        }
    });
  
});


socket.on('chatMessageDeleted', function (id) {
    $('#'+id).remove();
});