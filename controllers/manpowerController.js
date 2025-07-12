const {getAllManpower, getManpowerById, updateManpowerById, deleteManpowerById, addManpower} = require('../models/manpowerModel');

async function getAllManpowerHandler(req, res){
    try{
        const rows = await getAllManpower(); 
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.NRP,
                nama: row.Nama,
                crew: row.Crew,
                //posisi: row.Posisi,
                //targetss: row.TargetSS,
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

async function getManpowerByIdHandler(req, res){
    const nrp = req.params.id; 
    try{
        const rows = await getManpowerById(nrp);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.NRP,
                nama: row.Nama,
                crew: row.Crew,
                posisi: row.Posisi,
                targetss: row.TargetSS,
                status: row.Status,
                update: row.LastUpdate
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

async function updateManpowerByIdHandler(req, res){
    let nrp = req.params.id; //console.log(nrp);
    const data  = req.body; console.log(req.body);
    try{
        const manpower = await updateManpowerById(data, nrp);
        res.status(200).json(manpower);
        }
    catch(err){
            res.status(500).json({message: err.message});
        }
}

async function deleteManpowerByIdHandler(req, res){
    let nrp = req.params.id;
    try{
        const manpower = await deleteManpowerById(nrp);
        res.status(200).json(manpower);
        }
    catch(err){
            res.status(400).json({message: err.message});
        }
}

async function addManpowerdHandler(req, res){
    const data  = req.body; //console.log(req.body);
    try{
        const manpower = await addManpower(data); //console.log(manpower);
        res.status(200).json(manpower);
        }
    catch(err){
            res.status(500).json({message: err.message});
        }
}

module.exports = {
    getAllManpowerHandler,
    getManpowerByIdHandler,
    updateManpowerByIdHandler,
    deleteManpowerByIdHandler,
    addManpowerdHandler,
  };
  
