function Album(sequence_num, name, picture_srcs)
{
    this.sequence_num = sequence_num;
    this.name = name;

    this.opened = false;
    this.visible = true;

    this.calculatePosition();

    this.pictures = [];
    for (var i = 0; i < picture_srcs.length; i++)
    {
        var last = (i == picture_srcs.length - 1);
        var picture = new Picture(this, i, picture_srcs[i], last);
        this.pictures.push(picture);
    }
}

Album.prototype.calculatePosition = function()
{
    var num_of_cols = gallery.getNumOfCols();
    var size_with_padding = gallery.settings.thumbnail_size + 2 * gallery.settings.thumbnail_padding;

    this.x = this.sequence_num % num_of_cols * size_with_padding;
    this.y = Math.floor(this.sequence_num / num_of_cols) * size_with_padding;
}

Album.prototype.redraw = function()
{
    this.calculatePosition();

    for (var i = 0; i < this.pictures.length; i++)
    {
        this.pictures[i].redraw();
    }
}

Album.prototype.close = function(animating)
{
    this.opened = false;
    this.visible = true;

    for (var i = 0; i < this.pictures.length; i++)
    {
        var pic = this.pictures[i];
        pic.close(animating);
    }

    gallery.setTitle();
}

Album.prototype.open = function(animating)
{
    this.opened = true;
    this.visible = true;

    for (var i = 0; i < this.pictures.length; i++)
    {
        var pic = this.pictures[i];
        pic.open(animating);
    }

    gallery.setTitle(this.name);
}

Album.prototype.getPicture = function(sequence_num)
{
    for (var i = 0; i < this.pictures.length; i++)
    {
        if (this.pictures[i].sequence_num == sequence_num)
        {
            return this.pictures[i];
        }
    }

    return null;
}

Album.prototype.hide = function()
{
    this.visible = false;
    this.redraw();
}

Album.prototype.show = function()
{
    this.visible = false;
    this.redraw();
}

Album.prototype.clicked = function()
{
    gallery.hideAlbums();

    this.open(true);
}
