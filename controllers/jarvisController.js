const { getJarvisById, getJarvisStaff, getJarvisMekanik, getAcvhJarvisPlt2, getAcvhJarvisStaffPlt2 } = require('../models/jarvisModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getJarvis(req, res) {
  let name,nrp,jmlDoc,data2;
  let data2raw = [];
  try {
    const rows = await getJarvisById(req.params.id); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    name = capitalizeWords(rows.data[0].Nama, capitalizeFirstLetter),
    nrp = rows.data[0].NRP;
    jmlDoc = String(rows.data[0].JmlDoc);
    //jmlDoc = String(data2raw[0].JmlDoc); //String(rows.data[0].JmlDoc);
    judulDocPrevMth = rows.data2[0].NamaDocPrevMth;
    //judulDocCurrMth = rows.data2[0].NamaDocCurrMth;
    if(rows.data2[0].NamaDocCurrMth == "Tidak Ada"){
       judulDocCurrMth = "belum akses jarvis";
    } else {
       judulDocCurrMth = rows.data2[0].NamaDocCurrMth;
    } 
    msgWA = formatDocumentTitles(judulDocPrevMth, name, nrp, jmlDoc);
    data2raw = processAdditionalData(rows.data2); //console.log(data2raw);
    //jmlDoc = String(data2raw[0].JmlDoc);
    if(data2raw[0].key == true){
       data2 = concatenateArray(data2raw[0].NewDocs); //console.log(data2);
    } else {
       data2 = 'belum akses jarvis';
    }
    if (rows.data && rows.data.length > 0) {
      res.json({ status: 200, 
                 error: null, 
                 nama: name, 
                 nrp: nrp, 
                 update: update, 
                 response: { doc: jmlDoc, 
                             judul: judulDocPrevMth, 
                             //judul: "Tidak ada data. Awal tahun, data dimulai dari nol.",
                             data2: judulDocCurrMth, 
                             wa: msgWA }
                }); //, response });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//------------staff area---------------------//
async function getJarvisStaffHandler(req, res) {
  try {
    const rows = await getJarvisStaff(req.params.id); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) { //console.log(rows);
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.NRP,
        nama: row.NamaManpower,
        //nama: capitalizeWords(row.Nama, capitalizeFirstLetter),
        crew: row.Crew,
        doc: row.JmlDoc //=== 0 ? 'belum akses' : row.JmlDoc + " doc"
      }));

      let msgWA = `🥇🥈🥉\n*Achv Jarvis Staff ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        nrp = row.NRP;
        crew = row.Crew,
        nama = row.NamaManpower,
        //nama = capitalizeWords(row.Nama, capitalizeFirstLetter);
        jmlDocJarvis = row.JmlDoc;
        if(jmlDocJarvis != 0){
             msgWA += `${i + 1}. ${nama}\n       ${crew}\n       ${jmlDocJarvis} doc dibaca\n`;
          }
          else{
             msgWA += `${i + 1}. ${nama}\n       ${crew}\n       belum akses Jarvis\n`;
          }
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



function hitungJmlDoc(dataRaw){
  let jmlDoc = String(dataRaw);
    if(data2raw[0].key == true){
       data2 = concatenateArray(data2raw[0].NewDocs); //console.log(data2);
    } else {
       data2 = 0;
    }

}

//---------area mekanik-----------//
async function getJarvisMekanikHandler(req, res) {
  try {
    const rows = await getJarvisMekanik(req.params.id); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) { //console.log(rows);
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.NRP,
        nama: row.NamaManpower,
        //nama: capitalizeWords(row.Nama, capitalizeFirstLetter),
        crew: row.Crew,
        doc: row.JmlDoc //=== 0 ? 'belum akses' : row.JmlDoc + " doc"
      }));

      let msgWA = `🥇🥈🥉\n*Achv Jarvis Mekanik ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        nrp = row.NRP;
        crew = row.Crew,
        nama = row.NamaManpower,
        //nama = capitalizeWords(row.Nama, capitalizeFirstLetter);
        jmlDocJarvis = row.JmlDoc;
        if(jmlDocJarvis != 0){
             msgWA += `${i + 1}. ${nama}\n       (${nrp})\n       ${jmlDocJarvis} doc dibaca\n`;
          }
          else{
             msgWA += `${i + 1}. ${nama}\n       (${nrp})\n       belum akses Jarvis\n`;
          }
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



async function getJarvisAcvhPlt2Handler(req, res) {
  try {
    const rows = await getAcvhJarvisPlt2(); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        label: row.label,
        value: row.value,
      }));
      res.json({ status: 200, error: null, update: update, kpi: "Jarvis Acvh", response});
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// menu jarvis all staff plant 2
async function getJarvisStaffPlt2Handler(req, res) {
  try {
    const rows = await getAcvhJarvisStaffPlt2(); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) { //console.log(rows);
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.NRP,
        nama: row.NamaManpower,
        //nama: capitalizeWords(row.Nama, capitalizeFirstLetter),
        crew: row.Crew,
        doc: row.JmlDoc //=== 0 ? 'belum akses' : row.JmlDoc + " doc"
      }));

      let msgWA = `🥇🥈🥉\n*Achv Jarvis Staff Plant 2*\n`;
      rows.data.forEach((row, i) => {
        nrp = row.NRP;
        crew = row.Crew,
        nama = row.NamaManpower,
        //nama = capitalizeWords(row.Nama, capitalizeFirstLetter);
        jmlDocJarvis = row.JmlDoc;
        if(jmlDocJarvis != 0){
             msgWA += `${i + 1}. ${nama}\n       ${crew}\n       ${jmlDocJarvis} doc dibaca\n`;
          }
          else{
             msgWA += `${i + 1}. ${nama}\n       ${crew}\n       belum akses Jarvis\n`;
          }
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

//rubah huruf menjadi kecil semua
function capitalizeWords(name, callback) {
  const result = name.toLowerCase().split(' ').map(callback).join(' ');
  return result;
}

//rubah awal kata menjadi huruf besar
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDocumentTitles(data, name, nrp, jmlDoc) {
    // Split data berdasarkan karakter "|"
    const titles = data.split('|');
    let result = "";
    // Format simbol medali di bagian atas
    if(jmlDoc > 0){
      result = `🥇🥈🥉\n*Achv akses Jarvis*\n${name} (${nrp}) = ${jmlDoc} doc\nJudul doc Jarvis :\n`;
    } else {
      result = `🥇🥈🥉\n*${name} (${nrp})*\nStatus : *belum mengakses Jarvis.*\nSilahkan baca dokumen selain judul di bawah ini :\n`;
    }
    // Iterasi dan tambahkan setiap judul ke dalam hasil
    titles.forEach((title, index) => {
        result += `${index + 1}. ${title.trim()}\n`; // Trim untuk menghapus spasi yang tidak perlu
    });
    
    return result;
}


function concatenateArray(dataArray, index = 0, result = "") {
    // Base case: if we've reached the end of the array, return the result string
    if (index >= dataArray.length) {
        return result;
    }
    // Add the current element to the result, with "|" separator if it's not the first element
    result += (index > 0 ? "|" : "") + dataArray[index];
    // Recursive call for the next element in the array
    return concatenateArray(dataArray, index + 1, result);
}


function processAdditionalData(dataArray, index = 0, result = []) {
    //fungsi tanggal
    // Mendapatkan bulan dan tahun saat ini
    const tglHariIni = new Date();
    const year = tglHariIni.getFullYear();
    const month = tglHariIni.getMonth() + 1;

    // Format bulan saat ini sebagai 'YYYYMM' dan bulan sebelumnya
    const currentMonthFormatted = `${year}${month < 10 ? '0' : ''}${month}`;
    const previousMonthDate = new Date(year, month - 2); // Mengambil bulan sebelumnya
    const previousMonthFormatted = `${previousMonthDate.getFullYear()}${(previousMonthDate.getMonth() + 1).toString().padStart(2, '0')}`; //console.log(dataArray);

    // Base case: if index reaches the length of dataArray, return the result
    if (index >= dataArray.length) {
        return result;
    }

    // Current data item to process
    const data = dataArray[index]; //console.log(data);

    // Ensure NamaDocCurrMth and NamaDocPrevMth are not undefined or null
    const docsPrevMth = data.NamaDocPrevMth ? data.NamaDocPrevMth.split('|') : [];
    const docsCurrMth = data.NamaDocCurrMth ? data.NamaDocCurrMth.split('|') : [];

    // Find new documents in docs_202410 that are not in docs_202409
    //const newDocs = docsCurrMth.filter(doc => !docsPrevMth.includes(doc)); //console.log(newDocs); 

    // Determine if there are new docs based on JmlDoc difference
    if (data.JmlDocCurrMth && data.JmlDocPrevMth && data.JmlDocCurrMth > 0) {
        let vDoc = data.JmlDocCurrMth; //console.log(vDoc);
        result.push({
            key: true,
            JmlDoc: vDoc,
            Crew: data.Crew,
            NRP: data.NRP,
            NamaManpower: data.NamaManpower,
            PosisiManpower: data.PosisiManpower,
            NewDocs: newDocs
        }); //console.log(result.push);
    } else {
        result.push({
            key: false,
            JmlDoc : 0,
            Crew: data.Crew,
            NRP: data.NRP,
            NamaManpower: data.NamaManpower,
            PosisiManpower: data.PosisiManpower,
            NewDocs: 'belum akses jarvis'
        }); 
    } //console.log(result);

    // Recursive call to process the next item
    return processAdditionalData(dataArray, index + 1, result);
}

module.exports = {
  getJarvis,
  getJarvisStaffHandler,
  getJarvisMekanikHandler,
  getJarvisAcvhPlt2Handler,
  getJarvisStaffPlt2Handler,
};
