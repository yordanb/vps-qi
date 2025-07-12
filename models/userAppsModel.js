const pool = require('../config/db');

async function getAllUser(){
    try{
        const [rows] = await pool.execute('SELECT * FROM tb_users WHERE Role is not null ORDER BY NRP ASC');
        const result = {
            data: rows
        };
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function getUserById(nrp){
    try{
        const [rows] = await pool.execute('SELECT * FROM tb_users WHERE NRP = ?', [nrp]);
        const result = {
            data: rows
        };
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function updateUserById(data, nrp) {
    try {
        let idKey = "NRP";
        let table = "tb_users";
        
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

async function deleteUserById(nrp){
    try{
        const [rows] = await pool.execute('DELETE FROM tb_users WHERE NRP = ?', [nrp]);
        const result = {
            data: rows
        }; //console.log(result);
        return result
    } catch (error) {
      console.error(error);
      throw error;
    }
}

async function addUser(data){
    console.log(data);
    try{ 
        let table = "tb_users";
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

  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idKey}='${idValue}'`; //console.log(query);
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
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
    addUser,
  };
  
