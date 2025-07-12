const pool = require('../config/db');

async function getAllManpower(){
    try{
        const [rows] = await pool.execute('SELECT * FROM tb_manpower_new ORDER BY NRP ASC');
        const result = {
            data: rows
        };
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function getManpowerById(nrp){
    try{
        const [rows] = await pool.execute('SELECT * FROM tb_manpower_new WHERE NRP = ?', [nrp]);
        const result = {
            data: rows
        };
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function updateManpowerById(data, nrp) {
    try {
        let idKey = "NRP";
        let table = "tb_manpower_new";
        
        // Panggil createUpdateQuery untuk membuat query
        let dataQuery = createUpdateQuery(table, data, idKey, nrp);
        
        // Eksekusi query dengan pool.execute dan aman dari SQL Injection
        const [rows] = await pool.execute(dataQuery);
        
        const result = {
            data: rows
        };
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteManpowerById(nrp){
    try{
        const [rows] = await pool.execute('DELETE FROM tb_manpower_new WHERE NRP = ?', [nrp]);
        const result = {
            data: rows
        }; console.log(result);
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function addManpower(data){
    console.log(data);
    try{ 
        let table = "tb_manpower_new";
        let dataQuery = createInsertQuery(table, data); //console.log(dataQuery);
        const [rows] = await pool.execute(dataQuery);
        const result = {
            data: rows
        };
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

const createInsertQuery = (tableName, data) => {
  const columns = Object.keys(data).join(', '); // Mengambil key sebagai kolom
  const values = Object.values(data).map(value => typeof value === 'string' ? `'${value}'` : value).join(', '); // Mengambil value dengan penanganan untuk string (pakai tanda kutip)
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
  return query;
};

const createUpdateQuery = (tableName, data, idKey, idValue) => {
  const setClause = Object.keys(data).map(key => {
    const value = data[key];
    return typeof value === 'string' ? `${key}='${value}'` : `${key}=${value}`;
  }).join(', '); // Buat klausa SET

  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idKey}='${idValue}'`;
  return query;
};

/*
const createUpdateQuery = (tableName, data, idKey, idValue) => {
  const setClause = Object.keys(data).map(key => {
    const value = data[key];
    return typeof value === 'string' ? `${key}='${value}'` : `${key}=${value}`;
  }).join(', '); // Buat klausa SET

  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idKey}='${idValue}'`;
  return query;
};

*/

module.exports = {
    getAllManpower,
    getManpowerById,
    updateManpowerById,
    deleteManpowerById,
    addManpower,
  };
  
