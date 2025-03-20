const axios = require("axios");

const url = "https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv";

let dataWilayah = null;

const parseCSV = (csv) => {
  return csv.split("\n").map((line) => {
    const [kode, nama] = line.split(",");
    return { kode: kode.trim(), nama: nama?.trim() };
  });
};

const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    dataWilayah = parseCSV(data);
    console.log("Data berhasil di-fetch dan di-parse.");
  } catch (error) {
    console.error("Error fetching CSV:", error);
  }
};

const search = async (query) => {
  if (!dataWilayah) {
    console.log("Data wilayah belum di-fetch. Melakukan fetchData() terlebih dahulu...");
    await fetchData();
  }

  const queryWords = query.toLowerCase().split(" ");
  return dataWilayah.filter((item) => {
    const searchString = `${item.kode} ${item.nama}`.toLowerCase();
    return queryWords.every((word) => searchString.includes(word));
  });
};

const main = async () => {

  const query = "kesesi";
  const results = await search(query);

  console.log(`\nHasil pencarian untuk "${query}":`);
  results.forEach(async (result) => {
    if (result.kode.split('.').length!==4) return;
    const { data } = await axios.get("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=" + result.kode);
    console.log('Cuaca', result.nama, JSON.stringify(data, null, 2));
  });
};

main();
