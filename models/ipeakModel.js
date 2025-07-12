const pool = require('../config/db');

async function getIpeakById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_ipeak WHERE NRP = ? ORDER BY LastAccess ASC', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; 

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getIpeakStaff(section) {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", COUNT(tb_ipeak.Nama) AS "FrekAkses" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ipeak on tb_manpower_new.NRP = tb_ipeak.NRP where tb_manpower_new.Status ="Aktif" and tb_manpower_new.Posisi="Staff" and tb_manpower_new.Section = ? GROUP by tb_manpower_new.Nama  ORDER BY FrekAkses ASC', [section]);
      const lastUpdate = await getLastUpdate(); 

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      };
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
}

async function getIpeakMekanik(id) {
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
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", COUNT(tb_ipeak.Nama) AS "FrekAkses" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ipeak on tb_manpower_new.NRP = tb_ipeak.NRP where tb_manpower_new.Status ="Aktif" and tb_manpower_new.NRP NOT LIKE "MM%" and tb_manpower_new.Posisi="Mekanik" and tb_manpower_new.Crew = ? GROUP by tb_manpower_new.Nama  ORDER BY FrekAkses ASC', [section]);
      const lastUpdate = await getLastUpdate(); 

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      };
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
}

async function getAcvhIpeakById(id) {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS "AcvhIpeak" FROM tb_ipeak WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    };  //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Gauge KPI
async function getAcvhIpeakPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 27.0) * 100, 0), 1) AS value, "Lighting" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff SSE Lighting" OR Crew = "Mekanik Lighting" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 44.0) * 100, 0), 1) AS value, "PCH" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff PCH" OR Crew = "Mekanik PCH" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 41.0) * 100, 0), 1) AS value, "Mobile" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff SSE Mobile" OR Crew = "Mekanik Mobile" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 66.0) * 100, 0), 1) AS value, "Pumping" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff SSE Pumping" OR Crew = "Mekanik Pumping" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 40.0) * 100, 0), 1) AS value, "Big Wheel" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff Big Wheel" OR Crew = "Mekanik Big Wheel" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 6.0) * 100, 0), 1) AS value, "LCE" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff LCE" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 5.0) * 100, 0), 1) AS value, "MTE" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "Staff TERE" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery UNION SELECT ROUND(COALESCE((SUM(subquery.Jml_ipeak) / 1.0) * 100, 0), 1) AS value, "PSC" AS label FROM (select Count(*) as Jml_ipeak from (SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Section as mp_section, COUNT(tb_ipeak.Judul) as jumlah_judul, SUM(tb_ipeak.Poin) as total_poin FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ipeak USING (NRP) WHERE Crew = "PSC" GROUP BY tb_manpower_new.Nama, tb_manpower_new.NRP, tb_manpower_new.Section) as sub) AS subquery ORDER BY value DESC;');
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    };  //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//All staff plant 2
async function getAcvhIpeakStaffPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", COUNT(`tb_ipeak`.`Nama`) AS "FrekAkses" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_ipeak` on `tb_manpower_new`.`NRP` = `tb_ipeak`.`NRP` where `tb_manpower_new`.`Status` ="Aktif" and `tb_manpower_new`.`Posisi`="Staff" GROUP by `tb_manpower_new`.`Nama`  ORDER BY FrekAkses ASC');
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    };  //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function getLastUpdate() {
  try {
      const [dataUpdate] = await pool.execute(`SELECT tb_ipeak.LastUpdate FROM db_qiagent.tb_ipeak LIMIT 1`); 
      return dataUpdate.length > 0 ? dataUpdate[0].LastUpdate : null;
  } catch (error) {
      console.error('Error fetching LastUpdate:', error);
      throw error;
  }
}

module.exports = {
  getIpeakById,
  getIpeakStaff,
  getIpeakMekanik,
  getAcvhIpeakById,
  getAcvhIpeakPlt2,
  getAcvhIpeakStaffPlt2,
};
