const pool = require('../config/db');

async function getSSAcvh(nrp) {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*) / 5 * 100 , 0), 1) AS "AcvhSS" FROM db_qiagent.tb_ssplt2 WHERE NRP = ?;',[nrp]);
    //return rows;
    const [LastUpdate] = await pool.execute('SELECT `update` FROM db_qiagent.tb_ssplt2 ORDER BY `update` DESC LIMIT 1;');
    const [nama] = await pool.execute('SELECT Nama, NRP FROM db_qiagent.tb_manpower_new WHERE NRP = ?;',[nrp];

    const result = {
        nama: nama.Nama,
        lastUpdate: LastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getJarvisAcvh(nrp) {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*)/1 * 100, 0), 1) as "AcvhJarvis" FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE ESIC = 1 AND NRP = ?;', [nrp]);
    //return rows;
    //const lastUpdate = await getLastUpdate();

    const result = {
        //lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getIpeakAcvh(nrp) {
  try {
    const [rows] = await pool.execute('select ROUND(COALESCE(Count(*) / 1 * 100, 0), 1) as "AcvhIpeak" from (SELECT tb_manpower_new.NRP as "mp_nrp", tb_manpower_new.Nama as "mp_nama", tb_manpower_new.Section as "mp_section", COUNT(tb_ipeak.Judul) as "jumlah_judul", SUM(tb_ipeak.Poin) as "total_poin" FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Status = "Aktif" AND NRP = ? GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub;', [nrp]);
    //return rows;
    //const lastUpdate = await getLastUpdate();

    const result = {
        //lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSAPAcvh() {
  try {
    const [rows] = await pool.execute('SELECT Ach_SAP FROM db_qiagent.tb_sap_plt2 WHERE NRP = ?', [nrp]);
    //return rows;
    //const lastUpdate = await getLastUpdate();

    const result = {
        //lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


module.exports = {
  getSSAcvh,
  getJarvisAcvh,
  getIpeakAcvh,
  getSAPAcvh,
};
