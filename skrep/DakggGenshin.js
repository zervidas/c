const DakggGenshin = async (id) => {
  const url = "https://r.jina.ai/https://genshin.dakgg.io/roles/"+id;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Return-Format': 'application/json',
      'Accept': 'application/json'
    }
  });
  const json = await response.json();
  return JSON.parse(json.data.content.replace(/\\/g, ''));
};

// Guan
fetchData().then(console.log);
