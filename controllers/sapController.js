const { getSAPById, getSAPStaff, getSAPMekanik } = require('../models/sapModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getSAP(req, res) {
    let name,nrp;
  try {
    const rows = await getSAPById(req.params.id); console.log("ini bagian controller");console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data.length != 0) {
        name = rows.data.mp_nama;
        //name = name.toLowerCase().split(' ').map(function(word) {
        //    return word.charAt(0).toUpperCase() + word.slice(1);
        //}).join(' ');
        nrp = rows.data.mp_nrp; //console.log(nrp);
      const response = {
        hari_hadir: rows.data.sap_hadir,
        kta_acvh: rows.data.KTAAcvh,
        kta_comp: rows.data.KTACompleted,
        tta_acvh: rows.data.TTAAcvh,
        tta_comp: rows.data.TTACompleted,
        ta: rows.data.TA,
        ka: rows.data.KA,
        acvh_sap: String(parseFloat(rows.data.AcvhSAP.toFixed(1))), //row.AcvhSAP
      }; console.log(response);
      res.json({ status: 200, error: null, nama: name, nrp: nrp, update: update, response });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getSAPStaffHandler(req, res) {
    try {
        const rows = await getSAPStaff(req.params.id); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                sap: String(parseFloat(row.AcvhSAP.toFixed(1))), //row.AcvhSAP
            }));

        let msgWA = `🥇🥈🥉\n*Achv SAP Staff ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _sap = String(parseFloat(rows.AcvhSAP.toFixed(1))); //rows.AcvhSAP;
          msgWA += `${i + 1}. ${_nama}\n       (${_nrp}) = ${_sap}%\n`;
        });
        msgWA += 'Last update :\n' + update + '\n';
        msgWA += `Terima kasih atas kontribusi aktifnya.`;

            res.json({ status: 200, error: null, update: update, response, wa: msgWA });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSAPMekanikHandler(req, res) {
    try {
        const rows = await getSAPMekanik(req.params.id);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                sap: String(parseFloat(row.AcvhSAP.toFixed(1))), //row.AcvhSAP
            }));

        let msgWA = `🥇🥈🥉\n*Achv SAP Mekanik ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _sap = parseFloat(rows.AcvhSAP.toFixed(1)); //rows.AcvhSAP;
          msgWA += `${i + 1}. ${_nama}\n       (${_nrp}) = ${_sap}%\n`;
        });
        msgWA += 'Last update :\n' + update + '\n';
        msgWA += `Terima kasih atas kontribusi aktifnya.`;


            res.json({ status: 200, error: null, update: update, response, wa: msgWA });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
  getSAP,
  getSAPStaffHandler,
  getSAPMekanikHandler,
};
