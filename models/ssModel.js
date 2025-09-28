const pool = require('../config/db');

async function getSSById(id) {
  try {
    // Query SS berdasarkan NRP
    const result = await pool.query(
      'SELECT * FROM tb_ssplt2 WHERE "NRP" = $1 ORDER BY "TanggalLaporanPoin" DESC',
      [id]
    );
    const rows = result.rows;

    // Ambil lastUpdate (pastikan getLastUpdate sudah pakai Postgres juga)
    const lastUpdate = await getLastUpdate();

    // Modifikasi judul (capitalize sentence case)
    const modifiedRows = rows.map(row => ({
      ...row,
      Judul: toBeginningOfSentenceCase(row.Judul)
    }));

    return {
      lastUpdate,
      data: modifiedRows
    };
  } catch (error) {
    console.error('Error getSSById:', error);
    throw error;
  }
}

async function getSSStaff(section) {
  try {
    const result = await pool.query(
      `SELECT MIN(m."NRP") AS "mp_nrp",
              MIN(m."Nama") AS "mp_nama",
              MIN(m."Crew") AS "mp_crew",
              COUNT(s."NomorSS") AS "JmlSS"
       FROM tb_manpower_new m
       LEFT JOIN tb_ssplt2 s ON m."NRP" = s."NRP"
       WHERE m."Posisi" = 'staff'
         AND m."Status" = 'aktif'
         AND m."Section" = $1
       GROUP BY m."Nama"
       ORDER BY COUNT(s."NomorSS") ASC`,
      [section]
    );

    const lastUpdate = await getLastUpdate();

    return {
      lastUpdate,
      data: result.rows
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function getSSMekanik(id) {
  let section;
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
    default:
      section = null;
  }

  if (!section) {
    throw new Error("Invalid section id");
  }

  try {
    const result = await pool.query(
      `SELECT MIN(m."NRP") AS "mp_nrp",
              MIN(m."Nama") AS "mp_nama",
              MIN(m."Crew") AS "mp_crew",
              COUNT(s."NomorSS") AS "JmlSS"
       FROM tb_manpower_new m
       LEFT JOIN tb_ssplt2 s ON m."NRP" = s."NRP"
       WHERE m."Posisi" = 'mekanik'
         AND m."Status" = 'aktif'
         AND m."Crew" = $1
       GROUP BY m."Nama"
       ORDER BY COUNT(s."NomorSS") ASC`,
      [section]
    );

    const lastUpdate = await getLastUpdate();

    return {
      lastUpdate,
      data: result.rows
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


async function getAcvhSSById(id) {
  try {
    const [nama] = await pool.execute('SELECT Nama, NRP FROM tb_manpower_new WHERE NRP = ?', [id]);
    const [rows] = await pool.execute('SELECT COUNT(*) AS "AcvhSS" FROM tb_ssplt2 WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        name: nama[0].Nama,
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAcvhSSPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 135.0 * 100, 0), 1) AS value, "Lighting" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Lighting" OR Crew = "Mekanik Lighting") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 210.0 * 100, 0), 1) AS value, "Mobile" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Mobile" OR Crew = "Mekanik Mobile") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 330.0 * 100, 0), 1) AS value, "Pumping" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Pumping" OR Crew = "Mekanik Pumping") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 220.0 * 100, 0), 1) AS value, "PCH" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "PCH" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 200.0 * 100, 0), 1) AS value, "Big Wheel" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "Big Wheel" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 30.0 * 100, 0), 1) AS value, "LCE" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "LCE" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 20.0 * 100, 0), 1) AS value, "MTE" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "TERE" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 5.0 * 100, 0), 1) AS value, "PSC" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "PSC" GROUP BY Nama, section) AS subquery ORDER BY value DESC;');
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

async function getSSStaffRank() {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Posisi ="Staff" and tb_manpower_new.Status ="Aktif"  GROUP by tb_manpower_new.Nama  ORDER BY COUNT(tb_ssplt2.NomorSS) ASC');
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

async function getAcvhSSMechZeroPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Lighting" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Lighting" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Mobile" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Mobile" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Pumping" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Pumping" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PCH" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik PCH" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1), "Big Wheel" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Big Wheel" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery ORDER BY value DESC;');
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

async function getAcvhSSMechZeroCrew(id) {
  switch (id) {
        case "pch":
          crew = "mekanik pch";
          break;
        case "mobile":
          crew = "mekanik mobile";
          break;
        case "grader":
          crew = "mekanik big wheel";
          break;
        case "lighting":
          crew = "mekanik lighting";
          break;
        case "pumping":
          crew = "mekanik pumping";
          break;
    }

  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE(`tb_ssplt2`.`NRP`) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new LEFT JOIN db_qiagent.tb_ssplt2 ON tb_manpower_new.NRP = tb_ssplt2.NRP WHERE tb_manpower_new.Status = "Aktif" AND tb_manpower_new.Crew = ? AND `tb_ssplt2`.`NRP` is null GROUP BY tb_manpower_new.Nama ORDER BY COUNT(tb_ssplt2.NomorSS) ASC', [crew]);
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

async function getAcvhSSStaffZeroPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Lighting" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Lighting" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Mobile" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Mobile" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Pumping" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Pumping" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PCH" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff PCH" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1), "Big Wheel" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff Big Wheel" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "LCE" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="LCE" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "MTE" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="TERE" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PSC" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="PSC" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery ORDER BY value DESC;');
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

async function getAcvhSSMech5Plt2() {
  try {
    const [rows] = await pool.execute('SELECT mp_crew AS label , COUNT(*) as value FROM (SELECT ANY_VALUE (`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE (`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE (`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE (`tb_manpower_new`.`Posisi`) as "mp_posisi", ANY_VALUE (`tb_ssplt2`.`NRP`) as "ss_nrp", COUNT(`tb_ssplt2`.`NomorSS`) as "JmlSS" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_ssplt2` on `tb_manpower_new`.`NRP` = `tb_ssplt2`.`NRP` where `tb_manpower_new`.`Posisi`="Mekanik" GROUP by `tb_manpower_new`.`Nama` HAVING COUNT(`tb_ssplt2`.`NomorSS`) < 5  ORDER BY COUNT(*) ASC) subq group by mp_crew order by value DESC;');
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

async function getAcvhSSStaff5Plt2() {
  try {
    const [rows] = await pool.execute('SELECT mp_crew AS label , COUNT(*) as value FROM (SELECT ANY_VALUE (`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE (`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE (`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE (`tb_manpower_new`.`Posisi`) as "mp_posisi", ANY_VALUE (`tb_ssplt2`.`NRP`) as "ss_nrp", COUNT(`tb_ssplt2`.`NomorSS`) as "JmlSS" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_ssplt2` on `tb_manpower_new`.`NRP` = `tb_ssplt2`.`NRP` where `tb_manpower_new`.`Posisi`="Staff" GROUP by `tb_manpower_new`.`Nama` HAVING COUNT(`tb_ssplt2`.`NomorSS`) < 5  ORDER BY COUNT(*) ASC) subq group by mp_crew order by value DESC;');
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


async function getSSABPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE(`tb_manpower_new`.`Status`) as "mp_status", ANY_VALUE(`tb_ssplt2_ab`.`NRP`) as "ss_nrp", COUNT(`tb_ssplt2_ab`.`NomorSS`) AS "JmlSS" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_ssplt2_ab` on `tb_manpower_new`.`NRP` = `tb_ssplt2_ab`.`NRP` where `tb_manpower_new`.`Posisi` ="Staff" and `tb_manpower_new`.`Status` ="Aktif"  GROUP by `tb_manpower_new`.`Nama`  ORDER BY COUNT(`tb_ssplt2_ab`.`NomorSS`) ASC');
    const lastUpdate = await getLastUpdateSSAB();

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


async function getSSAcvhYearlyByID(nrp) {
  try {
    const [jan] = await pool.execute('SELECT "Jan" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202501 WHERE NRP = ?;',[nrp]);
    const [feb] = await pool.execute('SELECT "Feb" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202502 WHERE NRP = ?;',[nrp]);
    const [mar] = await pool.execute('SELECT "Mar" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202503 WHERE NRP = ?;',[nrp]);
    const [apr] = await pool.execute('SELECT "Apr" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202504 WHERE NRP = ?;',[nrp]);
    const [mei] = await pool.execute('SELECT "Mei" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202505 WHERE NRP = ?;',[nrp]);
    const [jun] = await pool.execute('SELECT "Jun" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202506 WHERE NRP = ?;',[nrp]);
    const [jul] = await pool.execute('SELECT "Jul" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202507 WHERE NRP = ?;',[nrp]);
    const [agu] = await pool.execute('SELECT "Agu" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202508 WHERE NRP = ?;',[nrp]);
    const [sep] = await pool.execute('SELECT "Sep" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202509 WHERE NRP = ?;',[nrp]);
    const [okt] = await pool.execute('SELECT "Okt" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202510 WHERE NRP = ?;',[nrp]);
    const [nov] = await pool.execute('SELECT "Nov" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202511 WHERE NRP = ?;',[nrp]);
    const [des] = await pool.execute('SELECT "Des" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202512 WHERE NRP = ?;',[nrp]);
    const lastUpdate = await getLastUpdate(); //console.log(jan[0]);

    const result = {
        lastUpdate: lastUpdate,
        data: [
      {
       "jan": jan[0].JmlSS.toString(),},{
       "feb": feb[0].JmlSS.toString(),},{
       "mar": mar[0].JmlSS.toString(),},{
       "apr": apr[0].JmlSS.toString(),},{
       "mei": mei[0].JmlSS.toString(),},{
       "jun": jun[0].JmlSS.toString(),},{
       "jul": jul[0].JmlSS.toString(),},{
       "agu": agu[0].JmlSS.toString(),},{
       "sep": sep[0].JmlSS.toString(),},{
       "okt": okt[0].JmlSS.toString(),},{
       "nov": nov[0].JmlSS.toString(),},{
       "des": des[0].JmlSS.toString()
      }
    ]
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getOustandingApproval() {
  try {
    const [rows] = await pool.execute('SELECT Approval AS "label", COUNT(*) AS "value" FROM db_qiagent.tb_ssplt2 WHERE KategoriSS = "Open" GROUP BY Approval ORDER BY value DESC;');
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

async function getLastUpdateSSAB() {
    try {
        const [dataUpdate] = await pool.execute('SELECT tb_ssplt2_ab.update FROM db_qiagent.tb_ssplt2_ab LIMIT 1');
        return dataUpdate.length > 0 ? dataUpdate[0].update : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}

async function getLastUpdate() {
  try {
    // Ambil waktu update terakhir dari tabel
    const result = await pool.query(
      'SELECT MAX("LastUpdate") AS last_update FROM tb_ssplt2'
    );

    return result.rows.length > 0 ? result.rows[0].last_update : null;
  } catch (error) {
    console.error('Error fetching LastUpdate:', error);
    throw error;
  }
}

/*
async function getLastUpdate() {
    try {
        const [dataUpdate] = await pool.execute('SELECT tb_ssplt2.update FROM db_qiagent.tb_ssplt2 LIMIT 1');
        return dataUpdate.length > 0 ? dataUpdate[0].update : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}
*/

function toBeginningOfSentenceCase(text) {
  if (!text) return '';  // Jika text null atau undefined, kembalikan string kosong
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

module.exports = {
  getSSById,
  getSSStaff,
  getSSMekanik,
  getAcvhSSById,
  getAcvhSSPlt2,
  getSSStaffRank,
  getAcvhSSMechZeroPlt2,
  getAcvhSSStaffZeroPlt2,
  getSSABPlt2,
  getSSAcvhYearlyByID,
  getOustandingApproval,
  getAcvhSSMech5Plt2,
  getAcvhSSStaff5Plt2,
  getAcvhSSMechZeroCrew,
};
