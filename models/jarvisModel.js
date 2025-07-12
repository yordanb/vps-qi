const pool = require('../config/db');

// Mendapatkan bulan dan tahun saat ini
const tglHariIni = new Date();
const year = tglHariIni.getFullYear();
const month = tglHariIni.getMonth() + 1;

// Format bulan saat ini sebagai 'YYYYMM' dan bulan sebelumnya
const currentMonthFormatted = `${year}${month < 10 ? '0' : ''}${month}`;
const previousMonthDate = new Date(year, month - 2); // Mengambil bulan sebelumnya
const previousMonthFormatted = `${previousMonthDate.getFullYear()}${(previousMonthDate.getMonth() + 1).toString().padStart(2, '0')}`;

// Menggunakan format bulan untuk mengubah string
//let db_current_mth = `db_qiagent.tb_esictm_plt2_${currentMonthFormatted}`;
let db_previous_mth = `db_qiagent.tb_esictm_plt2_${previousMonthFormatted}`;
let db_current_mth = `db_qiagent.tb_esictm_plt2`;

async function getJarvisById(id) {
  try {
    // Execute both queries in parallel
    const [resultRows, additionalDataRows] = await Promise.all([pool.execute(`SELECT * FROM ${db_current_mth} WHERE NRP = ?`, [id]), 
    pool.execute(`SELECT m.NRP, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e1.NRP AS NRPDocPrevMth, e1.NamaDoc AS NamaDocPrevMth, e1.JmlDoc AS JmlDocPrevMth, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDocCurrMth FROM db_qiagent.tb_manpower_new m LEFT JOIN ${db_previous_mth} e1 ON m.NRP = e1.NRP LEFT JOIN ${db_current_mth} e2 ON m.NRP = e2.NRP WHERE m.NRP = ?`, [id])]);
    //pool.execute(`SELECT m.NRP, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e1.NRP AS NRPDocPrevMth, e1.NamaDoc AS NamaDocPrevMth, e1.JmlDoc AS JmlDocPrevMth, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDocCurrMth FROM db_qiagent.tb_manpower_new m LEFT JOIN db_qiagent.tb_esictm_plt2_202411 e1 ON m.NRP = e1.NRP LEFT JOIN db_qiagent.tb_esictm_plt2 e2 ON m.NRP = e2.NRP WHERE m.NRP = ?`, [id])]);
    const [rows] = resultRows;
    const [additionalData] = additionalDataRows;
    const lastUpdate = await getLastUpdate();

    // Combine both datasets into the result object
    const result = {
      lastUpdate,
      data: rows,
      data2: additionalData // add additional data as a separate property
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getJarvisStaff(section) {
  try {
      //const [rows] = await pool.execute(`SELECT m.NRP, m.Section AS Section, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e1.NRP AS NRPDocPrevMth, e1.NamaDoc AS NamaDocPrevMth, e1.JmlDoc AS JmlDocPrevMth, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDocCurrMth FROM db_qiagent.tb_manpower_new m LEFT JOIN  ${db_previous_mth} e1 ON m.NRP = e1.NRP LEFT JOIN  ${db_current_mth} e2 ON m.NRP = e2.NRP WHERE m.Section = ?`, [section]);
      //const [rows] = await pool.execute(`SELECT m.NRP, m.Section AS Section, m.Crew AS Crew, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e1.NRP AS NRPDocPrevMth, e1.NamaDoc AS NamaDocPrevMth, e1.JmlDoc AS JmlDocPrevMth, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDocCurrMth FROM db_qiagent.tb_manpower_new m LEFT JOIN ${db_previous_mth} e1 ON m.NRP = e1.NRP LEFT JOIN  ${db_current_mth} e2 ON m.NRP = e2.NRP WHERE m.Posisi = "Staff" AND m.Section = ?`, [section]);
      const [rows] = await pool.execute(`SELECT m.NRP, m.Section AS Section, m.Crew AS Crew, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDoc FROM db_qiagent.tb_manpower_new m LEFT JOIN  db_qiagent.tb_esictm_plt2 e2 ON m.NRP = e2.NRP WHERE m.Posisi = "Staff" AND m.Section =? ORDER BY JmlDoc ASC`, [section]);
      const lastUpdate = await getLastUpdate();

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      }; //console.log(result);
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
}

async function getJarvisMekanik(id) {
  switch (id) {
    case "pch":
      section = "mekanik pch";
      break;
    case "mobile":
      section = "mekanik mobile";
      break;
    case "big wheel":
      section = "mekanik big wheel";
      break;
    case "lighting":
      section = "mekanik lighting";
      break;
    case "pumping":
      section = "mekanik pumping";
      break;
}
  try { 
      //const [rows] =  await pool.execute(`SELECT m.NRP, m.Crew AS Crew, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e1.NRP AS NRPDocPrevMth, e1.NamaDoc AS NamaDocPrevMth, e1.JmlDoc AS JmlDocPrevMth, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDocCurrMth FROM db_qiagent.tb_manpower_new m LEFT JOIN ${db_previous_mth} e1 ON m.NRP = e1.NRP LEFT JOIN  ${db_current_mth} e2 ON m.NRP = e2.NRP WHERE m.Crew = ? AND m.NRP NOT LIKE "MM%"`, [section]);
      const [rows] = await pool.execute(`SELECT m.NRP, m.Section AS Section, m.Crew AS Crew, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDoc FROM db_qiagent.tb_manpower_new m LEFT JOIN  db_qiagent.tb_esictm_plt2 e2 ON m.NRP = e2.NRP WHERE m.Posisi = "Mekanik" AND m.Crew = ? AND m.NRP NOT LIKE "21%%" ORDER BY JmlDoc ASC`, [section]);
      const lastUpdate = await getLastUpdate(); //console.log(lastUpdate);

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      }; //console.log(result);
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
}

async function getAcvhJarvisById(id) {
  try {
    const [rows] = await pool.execute('SELECT JmlDoc AS "AcvhJarvis" FROM tb_esictm_plt2 WHERE NRP = ?', [id]); //console.log;
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Gauge KPI
async function getAcvhJarvisPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 27.0 * 100, 0), 1) AS value, "Lighting" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE (Crew = "Staff SSE Lighting" OR Crew = "Mekanik Lighting") AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 41.0 * 100, 0), 1) AS value, "Mobile" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE (Crew = "Staff SSE Mobile" OR Crew = "Mekanik Mobile") AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 66.0 * 100, 0), 1) AS value, "Pumping" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE (Crew = "Staff SSE Pumping" OR Crew = "Mekanik Pumping") AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 44.0 * 100, 0), 1) AS value, "PCH" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE section = "PCH" AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 40.0 * 100, 0), 1) AS value, "Big Wheel" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE section = "Big Wheel" AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 6.0 * 100, 0), 1) AS value, "LCE" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE section = "LCE" AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) / 5.0 * 100, 0), 1) AS value, "MTE" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE section = "TERE" AND JmlDoc NOT LIKE 0) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_ESICTM) * 100, 0), 1) AS value, "PSC" AS label FROM (SELECT COUNT(*) AS Jml_ESICTM FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE section = "PSC" AND JmlDoc NOT LIKE 0) AS subquery ORDER BY value DESC;'); //console.log;
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//All Staff Plant 2
async function getAcvhJarvisStaffPlt2() {
  try {
    //const [rows] = await pool.execute('SELECT tb_manpower_new.NRP AS "NRP", tb_manpower_new.Nama AS "Nama", tb_manpower_new.Crew AS "Crew" , JmlDoc,ESIC FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_esictm_plt2 USING (NRP) WHERE tb_manpower_new.Posisi = "Staff" ORDER BY JmlDoc ASC');
    const [rows] = await pool.execute('SELECT m.NRP, m.Section AS Section, m.Crew AS Crew, m.Nama AS NamaManpower, m.Posisi AS PosisiManpower, e2.NRP AS NRPDocCurrMth, e2.NamaDoc AS NamaDocCurrMth, e2.JmlDoc AS JmlDoc FROM db_qiagent.tb_manpower_new m LEFT JOIN  db_qiagent.tb_esictm_plt2 e2 ON m.NRP = e2.NRP WHERE m.Posisi = "Staff" ORDER BY JmlDoc ASC');
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getLastUpdate() {
  try {
      const [dataUpdate] = await pool.execute('SELECT `tb_esictm_plt2`.`Update` FROM db_qiagent.tb_esictm_plt2 LIMIT 1'); //console.log(dataUpdate);
      return dataUpdate.length > 0 ? dataUpdate[0].Update : null;
  } catch (error) {
      console.error('Error fetching LastUpdate:', error);
      throw error;
  }
}

module.exports = {
  getJarvisById,
  getJarvisStaff,
  getJarvisMekanik,
  getAcvhJarvisById,
  getAcvhJarvisPlt2,
  getAcvhJarvisStaffPlt2,
};
