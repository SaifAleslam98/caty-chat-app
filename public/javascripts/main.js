function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|;)" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

try {
    var userData = JSON.parse(getCookie('user'));
    var senderId = userData._id;
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
} catch (error) {

}



