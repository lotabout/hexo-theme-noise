/* global hexo */

/* Syntax
 * ```[language] [title] [url] [link text] [options]
 * code snippet
 * ```
 *
 * options:
 * - line_number: true|false
 * - line_threshold: number
 * - first_line: number
 * - wrap: true|false
 * - mark: number|number-range e.g. `mark:1,3-5`
 * - language_attr: true|false
 * - fold: true|false|number e.g. `fold:ture` or `fold:300`
 */

'use strict';


/* regex copied from hexo: https://github.com/hexojs/hexo/blob/master/lib/plugins/filter/before_post_render/backtick_code_block.ts */
const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2[^\S\r\n]?(\n+|$)/gm;

const escapeSwigTag = (str) => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

const rLangCaptionUrlTitle = /([^\s]+)\s+(\S[\S\s]*)\s+(https?:\/\/\S+)\s+(.+)/i;
const rLangCaptionUrl = /([^\s]+)\s+(\S[\S\s]*)\s+(https?:\/\/\S+)/i;
const rLangCaption = /([^\s]+)\s+(\S[\S\s]*)/;
const rLang = /([^\s]+)\s*/;

function parseArgs(args) {
  const _else = [];
  const len = args.length;
  let lang, language_attr, line_number, line_threshold, wrap;
  let firstLine = 1;
  let max_height = 0;
  const mark = [];
  for (let i = 0; i < len; i++) {
    const colon = args[i].indexOf(':');

    if (colon === -1) {
      _else.push(args[i]);
      continue;
    }

    const key = args[i].slice(0, colon);
    const value = args[i].slice(colon + 1);

    switch (key) {
      case 'line_number':
        line_number = value === 'true';
        break;
      case 'line_threshold':
        if (!isNaN(Number(value))) line_threshold = +value;
        break;
      case 'first_line':
        if (!isNaN(Number(value))) firstLine = +value;
        break;
      case 'wrap':
        wrap = value === 'true';
        break;
      case 'mark': {
        for (const cur of value.split(',')) {
          const hyphen = cur.indexOf('-');
          if (hyphen !== -1) {
            let a = +cur.slice(0, hyphen);
            let b = +cur.slice(hyphen + 1);
            if (Number.isNaN(a) || Number.isNaN(b)) continue;
            if (b < a) { // switch a & b
              const temp = a;
              a = b;
              b = temp;
            }

            for (; a <= b; a++) {
              mark.push(a);
            }
          }
          if (!isNaN(Number(cur))) mark.push(+cur);
        }
        break;
      }
      case 'language_attr': {
        language_attr = value === 'true';
        break;
      }
      case 'fold': {
        max_height = value === 'false' ? 0 : (value === 'true' ? hexo.theme.config.fold_max_height : +value);
        break;
      }
      default: {
        _else.push(args[i]);
      }
    }
  }

  const arg = _else.join(' ');
  // eslint-disable-next-line one-var
  let match, caption = '';

  if ((match = arg.match(rLangCaptionUrlTitle)) != null) {
    lang = match[1];
    caption = `<span>${match[2]}</span><a href="${match[3]}">${match[4]}</a>`;
  } else if ((match = arg.match(rLangCaptionUrl)) != null) {
    lang = match[1];
    caption = `<span>${match[2]}</span><a href="${match[3]}">link</a>`;
  } else if ((match = arg.match(rLangCaption)) != null) {
    lang = match[1];
    caption = `<span>${match[2]}</span>`;
  } else if ((match = arg.match(rLang)) != null) {
    lang = match[0];
  }

  return {
    lang,
    language_attr,
    firstLine,
    caption,
    line_number,
    line_threshold,
    mark,
    wrap,
    max_height
  };
}


function backtickCodeBlock(post) {

    const config = hexo.config;
    const theme = hexo.theme.config;

    if (!theme.extend_backtick_code) return;

    const dataContent = post.content;

    if ((!dataContent.includes('```') && !dataContent.includes('~~~')) || !hexo.extend.highlight.query(hexo.config.syntax_highlighter)) return;

    post.content = dataContent.replace(rBacktick, ($0, start, $2, _args, _content, end) => {
        let content = _content.replace(/\n$/, '');

        // neither highlight or prismjs is enabled, return escaped content directly.
        if (!hexo.extend.highlight.query(hexo.config.syntax_highlighter)) return escapeSwigTag($0);

        // Extract language and caption of code blocks
        const options = parseArgs(_args.split('=').shift().split(" "));

        // PR #3765
        if (start.includes('>')) {
            // heading of last line is already removed by the top RegExp "rBacktick"
            const depth = start.split('>').length - 1;
            const regexp = new RegExp(`^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`, 'mg');
            content = content.replace(regexp, '');
        }

        options.lines_length = content.split('\n').length;
        content = hexo.extend.highlight.exec(hexo.config.syntax_highlighter, {
            context: hexo,
            args: [content, options]
        });

        if (options.max_height > 0) {
            content = `<div class="noise-code-block" style="--code-block-max-height:${options.max_height}px;">${content}</div>`;
        } else {
            content = `<div class="noise-code-block" style="--code-block-max-height:inherit;">${content}</div>`;
        }

        return start
            + '<hexoPostRenderCodeBlock>'
            + escapeSwigTag(content)
            + '</hexoPostRenderCodeBlock>'
            + end;
    });
};

hexo.extend.filter.register('before_post_render', backtickCodeBlock, 0);
