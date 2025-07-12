const { getSSAcvh, getJarvisAcvh, getIpeakAcvh, getEIICTMAcvh } = require('../models/kpiAcvhModel');
const { formatTimestamp } = require('../utils/dateUtils');

let dataSSAcvh, dataJarvisAcvh, dataIpeakAcvh, dataEIICTMAcvh, update;

async function getAllKPIData(req, res) {
  try {

    const rowsSS = await getSSAcvh(); //console.log(rowsSS);
    if (rowsSS.data && rowsSS.data.length > 0) {
        dataSSAcvh = rowsSS.data[0].AcvhSS;
        update = rowsSS.lastUpdate[0].update;
    } else {
        dataSSAcvh = null;
    }
    const rowsJarvis = await getJarvisAcvh();
    if (rowsJarvis.data && rowsJarvis.data.length > 0) {
        dataJarvisAcvh = rowsJarvis.data[0].AcvhJarvis;
    } else {
        dataJarvisAcvh = null;
    }
    const rowsIpeak = await getIpeakAcvh();
    if (rowsIpeak.data && rowsIpeak.data.length > 0) {
        dataIpeakAcvh = rowsIpeak.data[0].AcvhIpeak;
    } else {
        dataIpeak = null;
    }
    const rowsEIICTM = await getEIICTMAcvh();
    if (rowsEIICTM.data && rowsEIICTM.data.length > 0) {
        dataEIICTMAcvh = rowsEIICTM.data[0].AcvhEIICTM;
    } else {
        dataEIICTMAcvh = null;
    }

    let Update = await formatTimestamp(update);
    //let updateSAP = await formatTimestamp(rowsSAP.lastUpdate);
    //let updateIpeak = await formatTimestamp(rowsIpeak.lastUpdate);
    //let updateJarvis = await formatTimestamp(rowsJarvis.lastUpdate);

    // Menyesuaikan data response
    const respon = {
      status: 200,
      error: null,
      crew: "all plant 2",
      update: Update, 
      response:
      [
      {
        no: 1,
        label: "SS Acvh",
        value: dataSSAcvh
      },
      {
        no: 2,
        label: "Jarvis Acvh",
        value: dataJarvisAcvh
      },
      {
        no: 3,
        label: "Ipeak Acvh",
        value: dataIpeakAcvh
      },
      {
        no: 4,
        label: "EIICTM",
        value: dataEIICTMAcvh
      }
      ]
    };

    res.json(respon); //console.log(respon);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllKPIData
};
