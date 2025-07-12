const {getLogLoginActivity} = require('../models/userModel')

async function getLogLoginActivityHandler(req, res){
    try{
        const rows = await getLogLoginActivity(); //console.log(rows);
        if (rows.length > 0) {
            const response = rows.map((row, index) => ({
                no: index + 1,
                nrp: row.nrp,
                nama: row.nama,
                seen: row.last_seen,
            }));
            res.json({ status: 200, error: null, posisi: "all", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
          }
        }
     catch(err){
            res.status(500).json({message: err.message});
        }
}


module.exports = {
    getLogLoginActivityHandler,
}
