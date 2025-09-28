const pool = require('../config/db');

// Cari user berdasarkan NRP + password
async function getRoleByNRP(nrp, password) {
  try {
    const result = await pool.query(
      `SELECT * FROM tb_users WHERE "NRP" = $1 AND "Password" = $2`,
      [nrp, password]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Cari user berdasarkan NRP + password + androidID
async function getRoleByNRPandID(nrp, password, androidID) {
  try {
    const result = await pool.query(
      `SELECT * FROM tb_users WHERE "NRP" = $1 AND "Password" = $2 AND "android_id" = $3`,
      [nrp, password, androidID]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Login admin (tanpa androidId)
async function getRoleByNRPandPassADM(nrp, password) {
  try {
    const result = await pool.query(
      `SELECT * FROM tb_users WHERE "NRP" = $1 AND "Password" = $2`,
      [nrp, password]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Cari user berdasarkan androidID
async function getRoleByAndroidID(devID) {
  try {
    const result = await pool.query(
      `SELECT * FROM tb_users WHERE "android_id" = $1`,
      [devID]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Catat aktivitas login
async function logLoginActivity(android_id, nama, nrp) {
  try {
    const query = `INSERT INTO tb_qi_apps_log_users ("android_id", "nama", "nrp") VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [android_id, nama, nrp]);
    return result.rows[0];
  } catch (error) {
    console.error('Error logging login activity:', error);
    throw error;
  }
}

// Ambil log login terakhir tiap user
async function getLogLoginActivity() {
  try {
    const query = `
      SELECT "nrp", "nama", "waktu_akses" AS last_seen
      FROM (
        SELECT "nrp", "nama", "waktu_akses",
               ROW_NUMBER() OVER (PARTITION BY "nrp" ORDER BY "waktu_akses" DESC) AS rn
        FROM tb_qi_apps_log_users
      ) AS subquery
      WHERE rn = 1
      ORDER BY last_seen DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error get logging login activity:', error);
    throw error;
  }
}

// Cek default password
async function checkDefaultPassword(id) {
  try {
    const result = await pool.query(
      `SELECT "is_default_password" FROM tb_users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Registrasi device by Android ID
async function regDevByAndroidID(nrp, name, password, def_password, androidID) {
  try {
    // Cek apakah Android ID sudah terdaftar
    const checkResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM tb_users WHERE "android_id" = $1`,
      [androidID]
    );
    if (checkResult.rows[0].count > 0) {
      throw new Error('Android ID sudah terdaftar.');
    }

    // Update data user
    const result = await pool.query(
      `UPDATE tb_users
       SET "Nama" = $1,
           "Password" = $2,
           "android_id" = $3,
           "is_default_password" = '0'
       WHERE "NRP" = $4 AND "Def_Password" = $5
       RETURNING *`,
      [name, password, androidID, nrp, def_password]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

module.exports = {
  getRoleByNRP,
  getRoleByNRPandID,
  getRoleByNRPandPassADM,
  getRoleByAndroidID,
  logLoginActivity,
  getLogLoginActivity,
  checkDefaultPassword,
  regDevByAndroidID,
};
