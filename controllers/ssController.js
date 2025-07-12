const { getSSById, getSSStaff, getSSMekanik, getAcvhSSPlt2, getSSStaffRank, getAcvhSSMechZeroPlt2, getAcvhSSStaffZeroPlt2, getSSABPlt2, getOustandingApproval,getAcvhSSMech5Plt2, getAcvhSSStaff5Plt2, getAcvhSSMechZeroCrew } = require('../models/ssModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getSS(req, res) {
    let name,nrp;
  try {
    const rows = await getSSById(req.params.id); console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
        name = rows.data[0].PencetusIde;
        name = name.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        nrp = rows.data[0].NRP;
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        judul: row.Judul,
        create: row.TanggalLaporan,
        status: row.KategoriSS
      }));
      res.json({ status: 200, error: null, nama: name, nrp: nrp, update: update, response });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getSSStaffHandler(req, res) {
    try {
        const rows = await getSSStaff(req.params.id); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            }));

        let msgWA = `🥇🥈🥉\n*Achv SS Staff ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _jmlSS = rows.JmlSS;
          msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlSS} SS\n`;
          //msgWA += `${i + 1}. ${_nama}\n       ${_jmlSS} SS\n`;
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

async function getSSMekanikHandler(req, res) {
    try {
        const rows = await getSSMekanik(req.params.id);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            }));
       
        let msgWA = `🥇🥈🥉\n*Achv SS Mekanik ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _jmlSS = rows.JmlSS;
          msgWA += `${i + 1}. ${_nama}\n       (${_nrp}) = ${_jmlSS} SS\n`;
          //msgWA += `${i + 1}. ${_nama}\n       ${_jmlSS} SS\n`;
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

async function getSSAcvhPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSPlt2(); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value,
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Acvh", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSSStaffRankHandler(req, res) {
    try {
        const rows = await getSSStaffRank();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            })); //console.log(response);

        let msgWA = `🥇🥈🥉\n*Achv SS Staff Plant 2*\n`;
        rows.data.forEach((row, i) => {
          let _nrp = row.mp_nrp;
          let _nama = row.mp_nama;
          let _jmlSS = row.JmlSS;
          let _crew = row.mp_crew;
          //msgWA += `${i + 1}. ${_nama}\n    (${_nrp})\n     ${_crew}\n     ${_jmlSS} SS\n`;
          msgWA += `${i + 1}. ${_nama}\n       ${_crew}\n       ${_jmlSS} SS\n`;
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

async function getAcvhSSMechZeroPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSMechZeroPlt2();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Zero Mech", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAcvhSSMechZeroCrewHandler(req,res) {
    try {
        const rows = await getAcvhSSMechZeroCrew(req.params.id); console.log(rows);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            }));

        let msgWA = `🥇🥈🥉\n*Mekanik ${req.params.id}* Belum Membuat SS\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          //let _jmlSS = rows.JmlSS;
          msgWA += `${i + 1}. ${_nama}\n       (${_nrp})\n`;
          //msgWA += `${i + 1}. ${_nama}\n       ${_jmlSS} SS\n`;
        });
        msgWA += 'Last update :\n' + update + '\n';
        msgWA += `SS Anda berkontribusi ke KPI EIICTM PLT2.`;

            res.json({ status: 200, error: null, update: update, response, wa: msgWA });

            //res.json({ status: 200, error: null, update: update, kpi: "SS Zero Mech Crew", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAcvhSSStaffZeroPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSStaffZeroPlt2();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Zero Staff", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function  getAcvhSSMech5Plt2Handler(req, res) {
    try {
        const rows = await getAcvhSSMech5Plt2();
        let update = await formatTimestamp(rows.lastUpdate);

        // Map untuk mengganti label sesuai kebutuhan
        const labelMap = {
            'Mekanik Pumping': 'Pumping',
            'Mekanik PCH': 'PCH',
            'Mekanik Big Wheel': 'Big Wheel',
            'Mekanik Mobile': 'Mobile',
            'Mekanik Lighting': 'Lighting'
        };

        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: labelMap[row.label] || row.label,  // Ganti label jika ada di dalam map
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS <5 Mech", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function  getAcvhSSStaff5Plt2Handler(req, res) {
    try {
        const rows = await getAcvhSSStaff5Plt2();
        let update = await formatTimestamp(rows.lastUpdate);
        
        // Map untuk mengganti label sesuai kebutuhan
        const labelMap = {
            'Staff SSE Pumping': 'Pumping',
            'Staff PCH': 'PCH',
            'Staff LCE': 'LCE',
            'Staff Big Wheel': 'Big Wheel',
            'Staff TERE': 'TERE',
            'PSC': 'PSC',
            'Staff SSE Mobile': 'Mobile',
            'Driver Tadano': 'Opt Tadano',
            'Staff SSE Lighting': 'Lighting'
        };

        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: labelMap[row.label] || row.label,  // Ganti label jika ada di dalam map
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS <5 Staff", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getOustandingApprovalHandler(req, res) {
    try {
        const rows = await getOustandingApproval();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            //console.log(rows);
            const response = rows.data.map((row, index) => {
                let label = row.label;
                // Memodifikasi label sesuai dengan kondisi
                switch (label) {
                    case "HENRI NOERRAMAHE":
                        label = "HENRI N";
                        break;
                    case "ANOM BAYU AJI":
                        label = "ANOM BA";
                        break;
                    case "ABU SALEH":
                        label = "ABU S";
                        break;
                    case "EDI TAUFIK":
                        label = "EDI T";
                        break;
                    case "WASONO KUMPUL":
                        label = "WASONO K";
                        break;
                    case "MUHAMMAD SULTON":
                        label = "M SULTON";
                        break;
                    case "NANANG YUSANTO":
                        label = "NANANG Y";
                        break;
                    case "RACHMAD RIZKY NUR FABIYANTO":
                        label = "R RIZKY NF";
                        break;
                    case "MOCH. ANDRE KURNIAWAN":
                        label = "M ANDRE K";
                        break;
                }
                return {
                    no: index + 1,
                    label: label,
                    value: row.value.toString(),
                };
            });

            res.json({ status: 200, error: null, update: update, kpi: "Pending Approval", response });
        } else {
            let response = [{no: 1, label: "All Done", value: '1'}];
            //res.status(404).json({ error: 'Data not found' });
            res.json({ status: 200, error: 'Data not found', update: update, kpi: "Pending Approval", response });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSSABPlt2Handler(req,res) {
    try {
        const rows = await getSSABPlt2(); //console.log(rows);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            })); 
            
            res.json({ status: 200, error: null, update: update, kpi: "SS AB Staff", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
  getSS,
  getSSStaffHandler,
  getSSMekanikHandler,
  getSSAcvhPlt2Handler,
  getSSStaffRankHandler,
  getAcvhSSMechZeroPlt2Handler,
  getAcvhSSStaffZeroPlt2Handler,
  getSSABPlt2Handler,
  getOustandingApprovalHandler,
  getAcvhSSMech5Plt2Handler, 
  getAcvhSSStaff5Plt2Handler,
  getAcvhSSMechZeroCrewHandler,
};
