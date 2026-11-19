import fs from 'node:fs';
import postcss from 'postcss';
import prefixer from 'postcss-prefix-selector';
for (const id of ['floral','premium','navy-gold','boxed']) {
 const input = fs.readFileSync(`/tmp/arena-coding-uploads/${id}.html`, 'utf8');
 let css = input.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/@font-face\{[^}]*\}/g, '').replace(/@page\{[^}]*\}/g, '');
 css = postcss([prefixer({prefix: `.tpl-${id}`, transform(prefix, selector, prefixed) { if (selector === 'html,body' || selector === 'html' || selector === 'body') return prefix; return prefixed; }})]).process(css,{from:undefined}).css;
 const html = input.match(/<body>([\s\S]*?)<\/body>/)[1];
 fs.writeFileSync(`src/templates/${id}.json`,JSON.stringify({css,html}));
}
