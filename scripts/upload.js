window.addEventListener('load', function()
{
    document.getElementById('files').addEventListener('change', function(ev)
    {
        var files = ev.target.files;
        var num_of_pictures = 0;

        for (var i = 0; i < files.length; i++)
        {
            var file = files[i];

            if (!file.type.match('image.*'))
                continue;

            var reader = new FileReader();
            var picture_srcs = [];
            num_of_pictures++;

            reader.onload = (function(curr_file)
            {
                return function(e)
                {
                    picture_srcs.push(e.target.result);

                    // If all of the uploaded pictures are ready, create a new album from them
                    if (num_of_pictures == picture_srcs.length)
                        gallery.addAlbum('Local', picture_srcs);
                };
            })(file);

            reader.readAsDataURL(file);
        }
    }, false);
}, true);