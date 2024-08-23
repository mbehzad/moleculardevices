import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import ffetch from '../../scripts/ffetch.js';
// eslint-disable-next-line object-curly-newline
import { article, a, div, p } from '../../scripts/dom-helpers.js';
import { formatDate, unixDateToString } from '../../scripts/scripts.js';
import { fetchData } from '../news/news.js';

export function buildList(data, block) {
  data.forEach((item, idx) => {
    const thumbImage = item.thumbnail && item.thumbnail !== '0' ? item.thumbnail : item.image;
    let dateLine = formatDate(unixDateToString(item.date));
    if (item.publisher) dateLine += ` | ${item.publisher}`;

    block.append(article({},
      div({ class: 'image' },
        a({ href: item.path, title: item.title },
          createOptimizedPicture(thumbImage, item.title, (idx === 0), [{ width: '500' }]),
        ),
      ),
      div({ class: 'title' },
        p({}, dateLine),
        p({}, a({ href: item.path, title: item.title }, item.title)),
      ),
    ));
  });
}

export default async function decorate(block) {
  const isCuntryCodeZH = document.querySelector('html').getAttribute('lang') === 'zh';
  let data = [];

  if (isCuntryCodeZH) {
    data = await fetchData('china-news');
  } else {
    data = await fetchData('news');
  }

  buildList(data.slice(0, 3), block);
}
