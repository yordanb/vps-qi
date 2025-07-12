const { getAcvhSSById, getSSAcvhYearlyByID } = require('../models/ssModel');
const { getAcvhIpeakById } = require('../models/ipeakModel');
const { getAcvhJarvisById } = require('../models/jarvisModel');
const { getAcvhSAPById } = require('../models/sapModel');

const { formatTimestamp } = require('../utils/dateUtils');
let dataSS, dataSAP, dataIpeak, dataJarvis, nama, dataSSSetahun;

/*
async function getSSAcvhYearlyByIDHandler(req, res){
  try {
    const rowsSS = await getSSAcvhYearlyByID(req.params.id);
    if (rowsSS && rowsSS.length > 0) {
        const responseData = rows.map((row, index) => ({
           //no: index + 1,
           label: row.Bulan,
           value: row.JmlSS,
        }));
        console.log(responseData);
        return responseData;
    } else {
        dataSSSetahun = null;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
*/


async function getAllData(req, res) {
  let responseData = [];
  try {
    const rowsSS1 = await getSSAcvhYearlyByID(req.params.id); //console.log(rowsSS1);
/*
    if (rowsSS1 && rowsSS1.length > 0) {
        responseData = rowsSS1[0].map((row, index) => ({
           //no: index + 1,
           label: row.Bulan,
           value: row.JmlSS,
        }));
        console.log(responseData); 
    } else {
        responseData = null;
    }
*/
    if (rowsSS1 && rowsSS1.data && rowsSS1.data.length > 0) {
        // Mengiterasi setiap objek di dalam array rowsSS1.data
        responseData = rowsSS1.data.map((monthData) => {
            // Mengambil key dan value dari setiap objek dalam array monthData
            const [label, value] = Object.entries(monthData)[0];
            return { label, value};
        });

        //console.log(responseData);
    }   
 
    const rowsSS2 = await getAcvhSSById(req.params.id);
    if (rowsSS2.data != null && rowsSS2.data.length > 0) {
        dataSS = rowsSS2.data[0].AcvhSS / 5 * 100;
        nama = rowsSS2.name;
        //console.log(rowsSS);
    } else {
        dataSS = '0';
    }
    const rowsSAP = await getAcvhSAPById(req.params.id);
    if (rowsSAP.data != null && rowsSAP.data.length > 0) {
        dataSAP = rowsSAP.data[0].AcvhSAP;
    } else {
        dataSAP = '0';
    }
    const rowsIpeak = await getAcvhIpeakById(req.params.id);
    if (rowsIpeak.data != null && rowsIpeak.data.length > 0) {
        dataIpeak = rowsIpeak.data[0].AcvhIpeak / 1 * 100;
    } else {
        dataIpeak = '0';
    }
    const rowsJarvis = await getAcvhJarvisById(req.params.id);
    if (rowsJarvis.data != null && rowsJarvis.data.length > 0) {
        dataJarvis = rowsJarvis.data[0].AcvhJarvis / 1 * 100;
    } else {
        dataJarvis = '0';
    }

    let updateSS = await formatTimestamp(rowsSS2.lastUpdate);
    let updateSAP = await formatTimestamp(rowsSAP.lastUpdate);
    let updateIpeak = await formatTimestamp(rowsIpeak.lastUpdate);
    let updateJarvis = await formatTimestamp(rowsJarvis.lastUpdate);

    // Menyesuaikan data response
    const respon = {
      status: 200,
      error: null,
      name: nama,
      nrp: req.params.id,
      update: updateSS,
      response: //{ 
       //kpi:
      [
      //ss: 
      	{
          label: "SS Acvh",
          value: (dataSS ?? 0).toString()
      	},
      //sap: {
      	{
          label: "SAP Acvh",
          value: (dataSAP ?? 0).toString()
      	},
      //ipeak: {
      	{
          label: "Ipeak Acvh",
          value: (dataIpeak ?? 0).toString()
      	},
      //jarvis: {
      	{
          label: "Jarvis Acvh",
          value: (dataJarvis ?? 0).toString()
      	}
      ],
      barChart: responseData,
     //}
    };

    res.json(respon); 
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllData,
  //getSSAcvhYearlyByIDHandler,
};
