(async _=>{

const query = "calculator";

const res = await fetch(`https://www.apple.com/us/search/${encodeURIComponent(query)}?src=globalnav`);
const html = await res.text();
const obj = html.split('window.pageLevelData.searchResults.searchData = ')[1].split('};\n')[0];
const data = JSON.parse(obj + '}');

console.log('Hasil akhir mentah:', data)

const search = data.results.explore.exploreCurated.tiles.items;
console.log('Hasil search:', search)
console.log('Link hasil search 1:', search[0].value.navLinks[0].url)

})();
