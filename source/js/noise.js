var nextPage = 2;
var loading = false;
var postsPerPage = $('.post-entry').length;
var allPagesFetched = false;
var loadingHTML = '<div class="loading"><div class="spinner"><div></div><div></div><div></div></div></div>';
var loading = false;

function startLoading() {
  loading = true;
  $('.entries').parent().append(loadingHTML)
}

function stopLoading() {
  loading = false;
  if ($('.loading')) {
    $('.loading').remove()
  }
}

function isLoading() {
  return loading;
}

function appendPage() {
  if (allPagesFetched || isLoading()) {
    return;
  }

  startLoading();

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
      stopLoading();
    });
}

$(window).scroll(function () {
   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 16) {
     appendPage();
   }
});
