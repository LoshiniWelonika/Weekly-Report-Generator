const Project = require("../models/Project");


// Create Project
const createProject = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        const project = await Project.create({
            name,
            description
        });


        res.status(201).json({
            message: "Project created successfully",
            project
        });


    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Get All Projects
const getProjects = async (req,res)=>{

    try {

        const projects = await Project.find();


        res.json(projects);


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Get Single Project
const getProjectById = async(req,res)=>{

    try{

        const project = await Project.findById(
            req.params.id
        );


        if(!project){

            return res.status(404).json({
                message:"Project not found"
            });

        }


        res.json(project);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Update Project
const updateProject = async(req,res)=>{

    try{

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true
            }
        );


        res.json({
            message:"Project updated",
            project
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Delete Project
const deleteProject = async(req,res)=>{

    try{

        await Project.findByIdAndDelete(
            req.params.id
        );


        res.json({
            message:"Project deleted"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};