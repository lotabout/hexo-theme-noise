# Noise

[Demo](http://lotabout.github.io/hexo-theme-noise/)

Noise theme is based on very-simple, creatd by [lotabout](https://github.com/lotabout).

A little preview:

![noise-index](https://cloud.githubusercontent.com/assets/1527040/17722037/97b09bd2-6461-11e6-81f7-990c0bc269f1.png)

![noise-hello](https://cloud.githubusercontent.com/assets/1527040/17722048/b50f6af0-6461-11e6-9169-f3ed402161f3.png)


## Installation

Install theme and renderers:

```
git clone https://github.com/lotabout/hexo-theme-noise themes/noise
npm install hexo-renderer-less --save
npm install hexo-renderer-pug --save
```

Edit `_config.yml` in hexo root, change `theme` to `noise`.

## Configuration
Default config:

```
# noise/_config.yml
menu:
  Home: /
  Archives: archives
social:
  email:
  twitter:
  github:
  googleplus:
  rss: /atom.xml
fancybox: true
infinite_scroll: false
show_toc: true
toc_words: "Table of Contents"
compact_index: false
duoshuo: #duoshuo_shortname
disqus: #disqus _shortname
google_analytics: #Google Analytics Tracking Code
google_adsense_page_level_ads: #Google Adsense Page Level Ads Code
```

- menu - The navigation links on the header
- social - Social icons such as email/github/twitter etc. to show on the footer
  - email - Email address
  - twitter - twitter account
  - github - github account
  - googleplus - Google Plus account
  - rss - RSS subscription link, learn more in [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)
- fancybox - Enable [Fancybox](http://fancyapps.com/fancybox/)
- infinite_scroll - Enable infinite scroll on index page
- show_toc - To show ToC if no `toc:` is specified in post
- toc_words - The words to show in the TOC line
- compact_index - Use "archive" style index page
- duoshuo - [Duoshuo](http://duoshuo.com) shortname
- disqus - [Disqus](https://disqus.com) shortname
- google_analytics - Google Analytics Tracking Code
- google_adsense_page_level_ads - Google Adsense Page Level Ads Code

If you want to contain this theme only as a submodule, then you may be
unwilling to keep all configuration inside theme
folder(`noise/_config.yml`). In this case, you can keep the
configurations in root configuration file `/_config.yml` by:

```
# /_config.yml
noise:
  menu:
    Home: /
    Archives: archives
  social:
    email:
    twitter:
    github:
    googleplus:
    rss: /atom.xml
  fancybox: true
  infinite_scroll: false
  show_toc: true
  toc_words: "Table of Contents"
  compact_index: false
  duoshuo: #duoshuo_shortname
  disqus: #disqus _shortname
  google_analytics: #Google Analytics Tracking Code
  google_adsense_page_level_ads: #Google Adsense Page Level Ads Code
```

## Features

#### Logo
You can set a **favicon.ico** for your website, please put it into  `source` folder of hexo directory, recommended size: 32px*32px.

#### Pages

To customize pages, such as traditional 'About' page, follow the following
steps:

1. create a directory `about/` under `/source`
2. create a corresponding index page `index.md` under directory `about/`.
3. add link to the page to `menu` configuration:

    menu:
      About: about

Note that you don't need to add directory and create `about.md` under
`/source`. But the configuration should changed to:

```
    menu:
      About: about.html
```

#### Comments

You can control whether to show comment system(default to enabled) in pages.
Just add `comments: true` or `comments: false` in `front-matter` section of
page. i.e.

```
title: About
date: 2013-12-26 22:52:56
layout: page
comments: true
---
```

#### Excerpt
You can control the abstract of a post shown at index, by:

1. Filling a `description:` item in `front-matter` of the `post.md`
2. Just inserting a `<!--more-->` before your hidden content.
3. Otherwise it will fetch the first paragraph as excerpt.
