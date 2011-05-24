var gallery = new Gallery();

function Gallery()
{
}

Gallery.prototype.init = function(settings)
{
    this.settings = settings;
    this.surface = document.getElementById('surface');
    this.albums_button = document.getElementById('albums');
    this.gallery_title = document.getElementById('gallery_title');
    this.prev_nav = document.getElementById('prev_nav');
    this.next_nav = document.getElementById('next_nav');

    this.detectWindowDimensions();

    this.prev_nav.style.top = this.settings.nav_bar_height + 'px';
    this.next_nav.style.top = this.settings.nav_bar_height + 'px';
    this.prev_nav.style.height = this.window_height + 'px';
    this.next_nav.style.height = this.window_height + 'px';

    this.albums = [];

    var album_seq_num = 0;
    for (var album_name in this.settings.albums)
    {
        var album = new Album(album_seq_num, album_name, this.settings.albums[album_name]);
        this.albums.push(album);
        album_seq_num++;
    }

    var that = this;

    this.albums_button.addEventListener('click', function()
    {
        that.albumsClicked.call(that);
        return false;
    }, true);

    window.addEventListener('resize', function()
    {
        that.resized.call(that);
    }, true);
}

Gallery.prototype.addAlbum = function(name, picture_srcs)
{
    this.showAlbums();

    var last_album = this.albums[this.albums.length-1];
    var sequence_num = last_album.sequence_num + 1;

    this.albums.push(new Album(sequence_num, name, picture_srcs));
}

Gallery.prototype.detectWindowDimensions = function()
{
    this.window_width = this.getWindowSize('Width');
    this.window_height = this.getWindowSize('Height') - gallery.settings.nav_bar_height;
}

Gallery.prototype.getWindowSize = function(dimension)
{
    return Math.max(
        document.documentElement['client' + dimension],
        document.body['offset' + dimension], document.documentElement['offset' + dimension]
    );
}

Gallery.prototype.redraw = function()
{
    this.detectWindowDimensions();
    for (var i = 0; i < this.albums.length; i++)
    {
        this.albums[i].redraw();
    }
}

Gallery.prototype.showAlbums = function()
{
    for (var i = 0; i < this.albums.length; i++)
    {
        this.albums[i].close(false);
    }

    this.setTitle();
}

Gallery.prototype.setTitle = function(title)
{
    if (typeof title == 'undefined')
        title = 'Albums';

    this.gallery_title.innerHTML = title;
}

Gallery.prototype.getNumOfCols = function()
{
    var width_with_padding = gallery.settings.thumbnail_size + 2 * gallery.settings.thumbnail_padding;
    return Math.floor(this.window_width / width_with_padding);
}

Gallery.prototype.hideAlbums = function()
{
    for (var i = 0; i < this.albums.length; i++)
    {
        this.albums[i].hide();
    }
}

Gallery.prototype.showPrevNav = function(callback_this, callback)
{
    this.prev_nav.setAttribute('class', 'active_nav');

    // We want to override the click event on purpose
    this.prev_nav.onclick = function()
    {
        callback.call(callback_this);
    }
}

Gallery.prototype.showNextNav = function(callback_this, callback)
{
    this.next_nav.setAttribute('class', 'active_nav');

    // We want to override the click event on purpose
    this.next_nav.onclick = function()
    {
        callback.call(callback_this);
    }
}

Gallery.prototype.hideNav = function(callback_this, callback)
{
    this.prev_nav.setAttribute('class', 'inactive_nav');
    this.next_nav.setAttribute('class', 'inactive_nav');
}

Gallery.prototype.albumsClicked = function()
{
    this.showAlbums();
}

Gallery.prototype.resized = function()
{
    this.redraw();
}
