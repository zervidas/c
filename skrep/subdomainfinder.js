const { exec } = require('child_process');
const cheerio = require('cheerio');

function runCurl(domain, callback) {
    const curlCommand = `curl -s 'https://subdomainfinder.c99.nl/scans/2025-03-21/${domain}' \
  -H 'Referer: https://subdomainfinder.c99.nl/scans/2025-03-17/google.com' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36' \
  -H 'sec-ch-ua: "Not A(Brand";v="8", "Chromium";v="132"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  --compressed`;

    exec(curlCommand, (error, stdout, stderr) => {
        if (error) return callback(error);
        if (stderr) return callback(new Error(stderr));

        const $ = cheerio.load(stdout);

        const result = {
            scanDate: $('td:contains("Scan date")').next().text().trim(),
            domainCountry: $('td:contains("Domain Country")').next().text().trim(),
            subdomainsFound: $('td:contains("Subdomains found")').next().text().trim(),
            mostUsedIP: $('td:contains("Most used IP")').next().text().trim(),
            tldOrganization: $('td:contains("TLD Organization")').next().text().trim() || 'N/A',
            tokens: $('span#token')
                .map((i, el) => $(el).text().trim())
                .get(),
            whoisCheckLink: $('a:contains("Whois Check")').attr('href') || 'N/A',
            downloadJsonLink: $('a:contains("Download JSON")').attr('onclick') || 'N/A',
            downloadCsvLink: $('a:contains("Download CSV")').attr('onclick') || 'N/A',
            subdomains: [],
            ipCounts: []
        };

        // Ekstrak subdomains
        $('#result_table tr').each((i, row) => {
            const subdomain = $(row).find('td:eq(1)').text().trim();
            const ip = $(row).find('td:eq(2)').text().trim();
            const cloudflare = $(row).find('td.cf img').attr('title') || 'Cloudflare is off';
            if (subdomain && ip) {
                result.subdomains.push({ subdomain, ip, cloudflare });
            }
        });
        if (!result.subdomains.length) return runCurl(domain, callback);

        // Ekstrak IP counts
        $('#tableau_des_resultats.mt-5 tbody tr').each((i, row) => {
            const ip = $(row).find('td').eq(0).text().trim();
            const count = $(row).find('td').eq(1).text().trim();
            if (ip && count) {
                result.ipCounts.push({ ip, count });
            }
        });

        callback(null, result);
    });
}

// Contoh penggunaan
const domain = 'Fusions.my.id';
runCurl(domain, (error, result) => {
    if (error) return console.error('Error:', error);
    console.log(JSON.stringify(result, null, 2));
});
