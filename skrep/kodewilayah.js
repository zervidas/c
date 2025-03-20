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
  const query1 = "wa barat";
  const results1 = await search(query1);

  console.log(`Hasil pencarian untuk "${query1}":`);
  results1.forEach((result) => {
    console.log(`- Kode: ${result.kode}, Nama: ${result.nama}`);
  });

  const query2 = "sragi";
  const results2 = await search(query2);

  console.log(`\nHasil pencarian untuk "${query2}":`);
  results2.forEach((result) => {
    console.log(`- Kode: ${result.kode}, Nama: ${result.nama}`);
  });
};

main();
