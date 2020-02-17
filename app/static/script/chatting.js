var socket;
    
$(document).ready(function(){   
    var $comments = $('.comments');
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    
    socket.on('connect', function() {
        socket.emit('joined', {time: new Date()});
    });

    socket.on('status', function(data) {
        var message = data.msg;

        var $div = $(`<div class="ui log label"></div>`)
            .text(message)
        
        $comments.append($div);
    });

    socket.on('message', function(data) {
        var nickName = $(".content.name").text();
        nickName = nickName.replace(/ /gi, '');
        nickName = nickName.replace(/\n/gi, '');

        var name = data.name;
        var profile_img = data.profile_img;
        var message = data.msg;

        var Now = new Date();
        var date = Now.getHours() + ':' + Now.getMinutes();

        var $name = $('<a class="author">').append(name);
        var $date = $('<span class="date">').append(date);
        var $metadata = $('<div class="metadata" style="margin-right: 10px;">').append($date);
        var $name_date = $('<div>').append($name, $metadata);
        
        if (nickName != name) {
            var $text = $('<div class="ui left pointing label text">')
                .append(message);
        
            var $content = $('<div class="content">')
                .append($name_date, $text);

            if (profile_img != '') {
                var $image = $(`<a class="avatar">`).append(
                    `<img class="ui circular image" src=` + profile_img + `>`
                );
            }
            else {
                var $image = $(`<a class="avatar">`).append(
                    `<img class="ui circular image" src=` + 'static/images/default.png' + `>`
                );
            }

            var $comment = $(`
                <div class="comment">
            `).append($image, $content);
        }
        else {
            var $text = $('<div class="ui right pointing label text">')
            .append(message);
    
            var $content = $('<div class="content">')
                .append($metadata, $text);

            var $comment = $(`
            <div class="comment" style="text-align: right; margin-right: 20px;">
            `).append($content);
        }
        
        
        $comments.append($comment);
        $('.scrolling').scrollTop($('.scrolling')[0].scrollHeight);
    });

    $('#submit').click(function() {
        text = $('#text').val();
        $('#text').val('');
        socket.emit('text', {msg: text, room: 'apple'});
        $('.scrolling').scrollTop($('.scrolling')[0].scrollHeight);
    });

    $('#text').keypress(function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            text = $('#text').val();
            $('#text').val('');
            socket.emit('text', {msg: text, room: 'apple'});
            $('.scrolling').scrollTop($('.scrolling')[0].scrollHeight);
        }
    });

    $('.scrolling').scrollTop($('.scrolling')[0].scrollHeight);
});

function leave_room() {
    socket.emit('left', {}, function() {
        socket.disconnect();

        window.location.href = "/";
    });
}