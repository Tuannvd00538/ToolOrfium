$(document).ready(() => {
    function youtube_validate(url) {

        var regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
        return url.match(regExp) && url.match(regExp).length > 0;

    }

    function youtube_playlist_parser(url) {

        var reg = new RegExp("[&?]list=([a-z0-9_]+)", "i");
        var match = reg.exec(url);

        if (match && match[1].length > 0 && youtube_validate(url)) {
            return match[1];
        } else {
            return "nope";
        }

    }

    var key = "AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
    var pllfetch = (id) => { return `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${id}&part=snippet,id&maxResults=50&key=${key}` };

    $('#get').click(() => {
        var pll = $('#pll').val();
        var channel = $('#channel').val();
        if (pll == "" && channel == "") alert("Chưa nhập url CHANNEL hoặc url PLAYPLIST");

        if (pll != "" && channel == "") {
            if (youtube_playlist_parser(pll) != "nope") {
                $.ajax({
                    url: pllfetch(youtube_playlist_parser(pll)),
                    type: "GET",
                    success: (data) => {
                        console.log(data);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            } else {
                alert("Bạn chưa nhập đúng url của playlist! Vui lòng kiểm tra lại.")
            }
        }
    });
});