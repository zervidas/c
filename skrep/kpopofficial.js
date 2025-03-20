
const axios = require('axios');
const cheerio = require('cheerio');

function extractDataSequentially(htmlArray) {
  const result = [];

  htmlArray.forEach(html => {
    const $ = cheerio.load(html);

    if ($('hr').length > 0) {
      result.push({
        type: 'separator',
        class: $('hr').attr('class')
      });
    }

    if ($('figure.wp-block-image').length > 0) {
      const img = $('img');
      result.push({
        type: 'image',
        src: img.attr('src'),
        alt: img.attr('alt'),
        width: img.attr('width'),
        height: img.attr('height')
      });
    }

    if ($('figure.wp-block-table').length > 0) {
      const tableData = [];
      $('tr').each((i, row) => {
        const rowData = [];
        $(row).find('td').each((j, cell) => {
          rowData.push($(cell).text().trim());
        });
        tableData.push(rowData);
      });
      result.push({
        type: 'table',
        data: tableData
      });
    }

    if ($('p').length > 0) {
      $('p').each((i, p) => {
        result.push({
          type: 'paragraph',
          text: $(p).text().trim()
        });
      });
    }

    if ($('h2').length > 0) {
      $('h2').each((i, h2) => {
        result.push({
          type: 'heading',
          text: $(h2).text().trim(),
          level: 2
        });
      });
    }

    if ($('iframe').length > 0) {
      result.push({
        type: 'iframe',
        src: $('iframe').attr('src'),
        width: $('iframe').attr('width'),
        height: $('iframe').attr('height')
      });
    }

    if ($('ol').length > 0 || $('ul').length > 0) {
      const listItems = [];
      $('li').each((i, li) => {
        listItems.push($(li).text().trim());
      });
      result.push({
        type: 'list',
        items: listItems
      });
    }
  });

  return result;
}

function extractData(htmlArray) {
  const result = {
    separators: [],
    images: [],
    tables: [],
    paragraphs: [],
    headings: [],
    iframes: [],
    lists: []
  };

  htmlArray.forEach(html => {
    const $ = cheerio.load(html);
    
    if ($('hr').length > 0) {
      result.separators.push($('hr').attr('class'));
    }

    if ($('figure.wp-block-image').length > 0) {
      const img = $('img');
      result.images.push({
        src: img.attr('src'),
        alt: img.attr('alt'),
        width: img.attr('width'),
        height: img.attr('height')
      });
    }

    if ($('figure.wp-block-table').length > 0) {
      const tableData = [];
      $('tr').each((i, row) => {
        const rowData = [];
        $(row).find('td').each((j, cell) => {
          rowData.push($(cell).text().trim());
        });
        tableData.push(rowData);
      });
      result.tables.push(tableData);
    }

    if ($('p').length > 0) {
      $('p').each((i, p) => {
        result.paragraphs.push($(p).text().trim());
      });
    }

    if ($('h2').length > 0) {
      $('h2').each((i, h2) => {
        result.headings.push($(h2).text().trim());
      });
    }

    if ($('iframe').length > 0) {
      result.iframes.push({
        src: $('iframe').attr('src'),
        width: $('iframe').attr('width'),
        height: $('iframe').attr('height')
      });
    }

    if ($('ol').length > 0 || $('ul').length > 0) {
      const listItems = [];
      $('li').each((i, li) => {
        listItems.push($(li).text().trim());
      });
      result.lists.push(listItems);
    }
  });

  return result;
}

const Kpop = {
    async search(q) {
       const { data } = await axios.get('https://kpopofficial.com/?post_type=post&s='+q);
       const $ = cheerio.load(data);
       const res = [];
       $('article.small_post').each((i, e)=>{
           let obj = {};
           obj.title = $(e).find('h2.mb15').text().trim();
           obj.link = $(e).find('a').attr('href');
           obj.image = $(e).find('img.nolazyftheme').attr('src');
           obj.desc = $(e).find('div.wrap_thing > div > p').text().trim();
           obj.comment = $(e).find('span.post_thumbs_comm').text().trim();
           obj.likes = $(e).find('span.thumbscount').text().trim();
           res.push(obj);
       });
       
       return res;
    },
    async detail(url) {
       const { data } = await axios.get(url);
       const $ = cheerio.load(data);
       const res = [];
       $('article.post > *').each((i, e)=>{
          if (i==0) return;
          res.push($(e).prop('outerHTML'));
       });
       
       return { raw: extractData(res), data: extractDataSequentially(res) };
    },
};

// Contoh penggunaan
(async () => {
  try {
    const search = await Kpop.search('exo');
    console.log(search);
    const detail = await Kpop.detail('https://kpopofficial.com/exo-let-me-in-lyrics-meaning-and-song-credits/');
    console.log(detail);
  } catch (error) {
    console.error('Error:', error);
  }
})();
