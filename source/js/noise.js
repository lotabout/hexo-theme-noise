var nextPage = 2;
var loading = false;
var postsPerPage = $('.post-entry').length
var allPagesFetched = false;

function appendPage() {
  if (allPagesFetched || loading) {
    return;
  }

  loading = true;

  $.get('/page/' + nextPage)
    .fail(function () {
      allPagesFetched = true;
    })
    .done(function (data) {
      nextPage += 1;

      var div = $('<div/>').html(data).contents();
      var posts = div.find('.post-entry');
      $('.entries').append(posts);

      if (posts.length < postsPerPage) {
        allPagesFetched = true;
      }
    })
    .always(function () {
      loading = false;
    })
}

$(window).scroll(function () {
   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
     appendPage();
   }
});
