const {getAllUser, getUserById, updateUserById, deleteUserById, addUser} = require('../models/userAppsModel');

async function getAllUserHandler(req, res){
    try{
        const rows = await getAllUser(); 
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.NRP,
                nama: row.Nama,
                level: row.Role,
                androidID: row.android_id,
                //isDefPass: row.is_default_password,
                //status: row.Status,
                //update: row.LastUpdate
            }));
            res.json({ status: 200, error: null, posisi: "all", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }

        //res.status(200).json(manpower);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

async function getUserByIdHandler(req, res){
    const nrp = req.params.id; 
    try{
        const rows = await getUserById(nrp);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.NRP,
                nama: row.Nama,
                level: row.Role,
                androidID: row.android_id,
                isDefPass: row.is_default_password,
                //posisi: row.Posisi,
                //targetss: row.TargetSS,
                //status: row.Status,
                //update: row.LastUpdate
            }));
            res.json({ status: 200, error: null, posisi: "person", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }

        //res.status(200).json(manpower);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

async function updateUserByIdHandler(req, res){
    let nrp = req.params.id; //console.log(nrp);
    const data  = req.body; //console.log(req.body);
    try{
        const user = await updateUserById(data, nrp);
        res.status(200).json(user);
        }
    catch(err){
            res.status(500).json({message: err.message});
        }
}

async function deleteUserByIdHandler(req, res){
    let nrp = req.params.id;
    try{
        const user = await deleteUserById(nrp);
        res.status(200).json(user);
        }
    catch(err){
            res.status(400).json({message: err.message});
        }
}

async function addUserHandler(req, res){
    const data  = req.body; //console.log(req.body);
    try{
        const user = await addUser(data); //console.log(manpower);
        res.status(200).json(user);
        }
    catch(err){
            res.status(500).json({message: err.message});
        }
}

module.exports = {
    getAllUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    addUserHandler,
  };
  
