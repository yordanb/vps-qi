const pool = require('../config/db');


async function getSSById(posisi) {
  try {
    const [rows] = await pool.execute(SELECT 
    ANY_VALUE(`tb_manpower_new`.`NRP`) AS NRP, 
    ANY_VALUE(`tb_manpower_new`.`Nama`) AS Nama, 
    ANY_VALUE(`tb_manpower_new`.`Crew`) AS Crew,
    
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_202501' THEN 1 ELSE 0 END), 0) AS Jan,
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_202502' THEN 1 ELSE 0 END), 0) AS Feb,
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_202503' THEN 1 ELSE 0 END), 0) AS Mar,
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_202504' THEN 1 ELSE 0 END), 0) AS Apr,
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_202505' THEN 1 ELSE 0 END), 0) AS Mei,
    COALESCE(SUM(CASE WHEN ss_table = 'tb_ssplt2_506' THEN 1 ELSE 0 END), 0) AS Jun,
    
    -- Menampilkan total RewardSS dalam format angka dengan titik sebagai pemisah ribuan
    -- FORMAT(COALESCE(SUM(RewardSS), 0), 0, 'de_DE') AS Total_RewardSS,

    -- Total RewardSS dalam format angka asli untuk keperluan pengurutan
    COALESCE(SUM(RewardSS), 0) AS Total_RewardSS

FROM 
    db_qiagent.tb_manpower_new 
LEFT JOIN (
    SELECT 'tb_ssplt2_202501' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202501
    UNION ALL
    SELECT 'tb_ssplt2_202502' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202502
    UNION ALL
    SELECT 'tb_ssplt2_202503' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202503
    UNION ALL
    SELECT 'tb_ssplt2_202504' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202504
    UNION ALL
    SELECT 'tb_ssplt2_202505' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202505
    UNION ALL
    SELECT 'tb_ssplt2_202506' AS ss_table, NomorSS, NRP, RewardSS FROM db_qiagent.tb_ssplt2_202506
) AS all_ss ON tb_manpower_new.NRP = all_ss.NRP
WHERE 
    tb_manpower_new.Posisi = "Mekanik" 
    AND tb_manpower_new.Status = "Aktif"
GROUP BY 
    tb_manpower_new.Nama  
ORDER BY 
    Total_RewardSS DESC;);

    //return rows;
    //const [nama] = await pool.execute('SELECT Nama, NRP FROM tb_manpower_new WHERE NRP = ?', [id]);
    //const lastUpdate = await getLastUpdate();

    //const modifiedRows = rows.map(row => ({
    //  ...row,
    //  Judul: toBeginningOfSentenceCase(row.Judul) // Terapkan fungsi kapitalisasi
    //}));

    const result = {
        //name: nama.Nama,
        //lastUpdate: lastUpdate,
        //data: modifiedRows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getSSById,

};
