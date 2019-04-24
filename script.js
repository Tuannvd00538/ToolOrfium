$(document).ready(() => {

    var apiUrl = "https://www.googleapis.com/youtube/v3/";
    var key = "AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
    var pllfetch = (id, token) => { return `${apiUrl}playlistItems?playlistId=${id}&part=snippet,id&maxResults=50&key=${key}&pageToken=${token}` };
    var channelfetch = (id, token) => { return `${apiUrl}search?channelId=${id}&videoEmbeddable=true&maxResults=50&type=video&part=snippet&key=${key}&pageToken=${token}` }

    var sum = 0;
    var nextPageToken;
    var pid = "";
    var dataArr = [];

    function getVidsPll(pid, PageToken) {
        $.get(pllfetch(pid, PageToken), (data) => {
            planPll(data);
        }
        );
    }

    function planPll(data) {
        total = data.pageInfo.totalResults;
        if (data.nextPageToken == undefined) {
            nextPageToken = "";
        } else {
            nextPageToken = data.nextPageToken;
        }
        dataArr = dataArr.concat(data.items);
        for (i = 0; i < data.items.length; i++) {
            sum++;
            if (sum == (total - 1)) {
                sum = 0;
                dataArr.forEach(item => {
                    let title = item.snippet.title;
                    let thumb = item.snippet.thumbnails.medium.url;
                    let source = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
                    $('#results').append(generateBlockContent(thumb, title, source));
                });
                $("#overlay").fadeOut(300);
                return;
            }
        }
        if (sum < (total - 1)) {
            getVidsPll(pid, nextPageToken);
        }
    }

    function getVidsChannel(pid, PageToken) {
        $.get(channelfetch(pid, PageToken), (data) => {
            planChannel(data);
        }
        );
    }

    function planChannel(data) {
        total = data.pageInfo.totalResults;
        if (data.nextPageToken == undefined) {
            nextPageToken = "";
        } else {
            nextPageToken = data.nextPageToken;
        }
        dataArr = dataArr.concat(data.items);
        for (i = 0; i < data.items.length; i++) {
            sum++;
            if (sum == (total - 1)) {
                sum = 0;
                dataArr.forEach(item => {
                    let title = item.snippet.title;
                    let thumb = item.snippet.thumbnails.medium.url;
                    let source = `https://www.youtube.com/watch?v=${item.id.videoId}`;
                    $('#results').append(generateBlockContent(thumb, title, source));
                });
                $("#overlay").fadeOut(300);
                return;
            }
        }
        if (sum < (total - 1)) {
            getVidsChannel(pid, nextPageToken);
        }
    }

    function generateBlockContent(thumb, title, source) {
        var output = "";
        output += '<div class="col-md-4">';
        output += '<div class="col-md-12">';
        output += `<img src="${thumb}" alt="${title}" width="100%">`;
        output += '</div>';
        output += '<div class="col-md-12">';
        output += '<div class="form-group">';
        output += `<input type="text" class="form-control" value="${title}"/>`;
        output += `<input type="text" class="form-control" value="${thumb}"/>`;
        output += `<input type="text" class="form-control" value="${source}"/>`;
        output += '</div>';
        output += '</div>';
        output += '</div>';
        return output;
    }

    $('#get').click(() => {
        var pll = $('#pll').val();
        var channel = $('#channel').val();
        if (pll == "" && channel == "") {
            swal("Lỗi rùiiiii!", "Chưa nhập url CHANNEL hoặc url PLAYPLIST!", "error");
            return;
        }
        if (pll != "" && channel != "") {
            swal("Lỗi rùiiiii!", "Để đảm bảo DATA được chính xác, vui lòng chỉ nhập url CHANNEL hoặc url PLAYLIST!", "error");
            return;
        }

        $("#overlay").fadeIn(300);

        if (pll != "" && channel == "") {
            var reg = new RegExp("[&?]list=([a-z0-9_-]+)", "i");
            var match = reg.exec(pll);
            if (match == null) {
                swal("Lỗi rùiii!", "Có vẻ có gì đấy không đúng :< Vui lòng kiểm tra lại!", "error");
                $("#overlay").fadeOut(300);
                return;
            }
            pid = match[1];
            getVidsPll(pid, "");
        }

        if (pll == "" && channel != "") {
            var pattern = /^(?:(http|https):\/\/[a-zA-Z-]*\.{0,1}[a-zA-Z-]{3,}\.[a-z]{2,})\/channel\/([a-zA-Z0-9_]{3,})$/;
            var matchs = channel.match(pattern);
            if (matchs == null) {
                swal("Lỗi rùiii!", "Có vẻ có gì đấy không đúng :< Vui lòng kiểm tra lại!", "error");
                $("#overlay").fadeOut(300);
                return;
            }
            pid = matchs[2];
            getVidsChannel(pid, "");
        }
    });
});