
const dns = require('dns');
const fs = require('fs');

const srvHostname = '_mongodb._tcp.adrms.bitk2qm.mongodb.net';
const txtHostname = 'adrms.bitk2qm.mongodb.net';

const log = [];

function writeLog() {
    fs.writeFileSync('dns_log.json', JSON.stringify(log, null, 2));
}

console.log(`Resolving SRV for ${srvHostname}...`);

dns.resolveSrv(srvHostname, (err, addresses) => {
    if (err) {
        log.push({ type: 'SRV Error', error: err.code });
        writeLog();
    } else {
        log.push({ type: 'SRV Records', data: addresses });

        console.log(`Resolving TXT for ${txtHostname}...`);
        dns.resolveTxt(txtHostname, (err, records) => {
            if (err) {
                log.push({ type: 'TXT Error', error: err.code });
            } else {
                log.push({ type: 'TXT Records', data: records });
            }
            writeLog();
        });
    }
});
