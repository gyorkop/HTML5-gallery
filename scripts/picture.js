function Picture(album, sequence_num, src, last)
{
    this.album = album;
    this.sequence_num = sequence_num;
    this.src = src;
    this.last = last;

    this.enlarged = false;

    this.img = new Image();
    this.img.parent = this;

    this.img.onload = function()
    {
        this.parent.width  = this.width;
        this.parent.height = this.height;
        this.parent.loaded.call(this.parent);
    }

    this.img.src = this.src;
    document.getElementById('invisible').appendChild(this.img);
}

Picture.prototype.loaded = function()
{
    this.addClass('picture');

    this.orig_width = this.width;
    this.orig_height = this.height;

    this.calculatePosition();
    this.close();

    gallery.surface.appendChild(this.img);

    var that = this;
    this.img.addEventListener('click', function()
    {
        that.clicked.call(that);
    }, true);
}

Picture.prototype.redraw = function()
{
    this.calculatePosition();

    if (this.album.visible)
    {
        if (this.album.opened)
            this.open(true);
        else
            this.close(true);
    }
    else
    {
        if (this.enlarged)
            this.enlarge(true);
        else
            this.hide();
    }
}

Picture.prototype.calculatePosition = function()
{
    var ratio = Math.min(
        gallery.settings.thumbnail_size / this.orig_width,
        gallery.settings.thumbnail_size / this.orig_height
    );

    this.thumb_width = ratio * this.orig_width;
    this.thumb_height = ratio * this.orig_height;

    var num_of_cols = gallery.getNumOfCols();
    var size_with_padding = gallery.settings.thumbnail_size + 2 * gallery.settings.thumbnail_padding;

    var col = this.sequence_num % num_of_cols;
    var row = Math.floor(this.sequence_num / num_of_cols);

    this.offset_x = (gallery.settings.thumbnail_size - this.thumb_width) / 2;
    this.offset_y = (gallery.settings.thumbnail_size - this.thumb_height) / 2;

    this.thumb_x = col * size_with_padding + this.offset_x;
    this.thumb_y = row * size_with_padding + this.offset_y;
}

Picture.prototype.applyChanges = function(animating)
{
    if (animating)
        this.addClass('animating');
    else
        this.removeClass('animating');

    this.img.style.left   = Math.floor(this.x) + 'px';
    this.img.style.top    = Math.floor(this.y) + 'px';
    this.img.style.width  = Math.floor(this.width) + 'px';
    this.img.style.height = Math.floor(this.height) + 'px';
}

Picture.prototype.enlarge = function(animating)
{
    this.enlarged = true;

    var scale = Math.min(
        gallery.window_width / this.orig_width,
        gallery.window_height / this.orig_height
    );

    this.width = scale * this.orig_width;
    this.height = scale * this.orig_height;
    this.x = (gallery.window_width - this.width) / 2;
    this.y = (gallery.window_height - this.height) / 2;

    this.removeClass('hidden');
    this.addClass('enlarged');
    this.removeClass('rotate_left');
    this.removeClass('rotate_right');

    this.applyChanges(animating);
    this.showNav();
}

Picture.prototype.reduce = function(animating)
{
    this.enlarged = false;

    this.width = this.thumb_width;
    this.height = this.thumb_height;
    this.x = this.thumb_x;
    this.y = this.thumb_y;

    this.removeClass('enlarged');
    this.removeClass('rotate_left');
    this.removeClass('rotate_right');

    this.applyChanges(animating);
    this.hideNav();
}

Picture.prototype.open = function(animating)
{
    this.x = this.thumb_x;
    this.y = this.thumb_y;

    this.removeClass('hidden');
    this.removeClass('rotate_left');
    this.removeClass('rotate_right');
    this.addClass('opened');

    this.applyChanges(animating);
}

Picture.prototype.close = function()
{
    this.enlarged = false;

    this.hideNav();

    if (this.last)
    {
        var additional_class = this.album.sequence_num % 2 ? 'rotate_left' : 'rotate_right';
        this.addClass(additional_class);
    }

    this.removeClass('hidden');
    this.removeClass('opened');

    this.removeClass('enlarged');

    this.x = this.album.x + this.offset_x;
    this.y = this.album.y + this.offset_y;
    this.width  = this.thumb_width;
    this.height = this.thumb_height;

    this.applyChanges(true);
}

Picture.prototype.hide = function()
{
    this.addClass('hidden');
}

Picture.prototype.show = function()
{
    this.removeClass('hidden');
}

Picture.prototype.showNav = function()
{
    if (this.sequence_num > 0)
    {
        gallery.showPrevNav(this, this.prev);
    }

    if (!this.last)
    {
        gallery.showNextNav(this, this.next);
    }
}

Picture.prototype.prev = function()
{
    this.reduce(false);
    this.hide();
    this.hideNav();

    var prev_pic = this.album.getPicture(this.sequence_num - 1);
    prev_pic.enlarge(false);
}

Picture.prototype.next = function()
{
    this.reduce(false);
    this.hide();
    this.hideNav();

    var next_pic = this.album.getPicture(this.sequence_num + 1);
    next_pic.enlarge(false);
}

Picture.prototype.hideNav = function()
{
    gallery.hideNav();
}

Picture.prototype.hasClass = function(class_name)
{
    var classes = String(this.img.getAttribute('class'));
    return (classes.indexOf(class_name) != -1);
}

Picture.prototype.addClass = function(class_name)
{
    if (!this.hasClass(class_name))
    {
        var classes = this.img.getAttribute('class');
        var classes_str = (classes === null) ? '' : String(classes);

        this.img.setAttribute('class', classes_str + ' ' + class_name);
    }
}

Picture.prototype.removeClass = function(class_name)
{
    var classes = String(this.img.getAttribute('class'));
    classes = classes.replace(class_name, '');
    this.img.setAttribute('class', classes);
}

Picture.prototype.clicked = function(x, y)
{
    if (this.album.opened)
    {
        if (this.enlarged)
        {
            this.album.open(false);
            this.reduce(true);
        }
        else
        {
            this.album.hide();
            this.enlarge(true);
        }
    }
    else
    {
        this.album.clicked();
    }
}
