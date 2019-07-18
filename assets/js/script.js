$(document).ready(function() {
    $.ajaxSetup({
        cache: false
    });
    route();
    $(window).on('hashchange', route);
});

function list() {
    $.getJSON("posts/list.json", function(data) {
        var content = '<div class="card border-0 text-center"><ul class="list-group list-group-flush">';
        $.each(data, function(key, val) {
            val.forEach(function(data) {
                content += '<li class="list-group-item"><a href="#' + data['slug'] + '" class="link" id="list-item-slug"><h5 class="display-4"><strong id="list-item-title">' + data['title'] + '</strong></h5></a><small class="text-muted">Posted on <span id="list-item-date">' + data['date'] + '</span></small></li>';
            });
        });
        content += '</ul></div>';
        $('#content').append(content);
        document.title = "///";
    });
}

function route() {
    $('#content').html('');
    var file = (location.hash ? location.hash : "#index").slice(1);
    (file == "index") ? list(): read(file);
}

function read(name) {
    $.ajax({
        url: 'raw.githubusercontent.com/noeramadhan/noeramadhan.github.io/master/posts/' + name + '.md',
        success: function(data) {
            var converter = new showdown.Converter({
                    metadata: true
                }),
                html = converter.makeHtml(data),
                meta = converter.getMetadata();
            if (meta['title'] !== undefined) {
                $('#content').append('<h1 id="title" class="mb-0"><strong>' + meta['title'] + '</strong></h1><small class="text-muted">Posted on <span id="list-item-date">' + meta['date'] + '</span></small>');
            }
            $('#content').append(html);
            document.title = "/// | " + meta['title'];
        },
        error: function() {
            read("404");
        }
    });
}