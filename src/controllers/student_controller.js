import studentModel from "../models/student.js"
import { v4 as uuidv4 }  from 'uuid'
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
const saltRounds = 10
import {createToken} from '../middlewares/auth.js';


const registerStudent = async(req, res)=> {

    const { password, ...otherDataUser } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
        id: uuidv4(),
        password: hashedPassword,
        ...otherDataUser
    }
    try {
        if (req.files?.imagen) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: "students" });
            userData.imagen = cloudinaryResponse.secure_url;
            userData.public_id = cloudinaryResponse.public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }
        const user = await studentModel.registerStudentModel(userData)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(user)
    }
}

const loginStudent = async(req, res)=> {

    const {username, password}=req.body
    try {
        const user = await studentModel.loginStudentModel(username,password)
        const token = createToken(user)
        delete user.password
        res.status(200).json({user,token})
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateStudent_controller = async (req, res) => {
    const { id } = req.params;
    const { password, ...otherDataUser } = req.body;

    const updatedStudent = { ...otherDataUser };
    if (password) {
        try {
            updatedStudent.password = await bcrypt.hash(password, saltRounds);
        } catch (err) {
            return res.status(500).json({ error: "Error hashing the password" });
        }
    }

    try {
        if (req.files?.imagen) {
            const oldStudent = await studentModel.getStudent_ID(id);
            if (oldStudent.public_id) {
                await cloudinary.uploader.destroy(oldStudent.public_id);
            }

            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: "students" });
                updatedStudent.imagen = cloudinaryResponse.secure_url;
                updatedStudent.public_id = cloudinaryResponse.public_id;
            } finally {
                await fs.unlink(req.files.imagen.tempFilePath);
            }
        }

        const student = await studentModel.updateStudent_model(id, updatedStudent);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const deleteStudent_controller = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.getStudent_ID(id);
        if (student.public_id) {
            await cloudinary.uploader.destroy(student.public_id);
        }
        const deletionResult = await studentModel.deleteStudent_model(id);
        const status = deletionResult.error ? 404 : 200;
        res.status(status).json(deletionResult);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el estudiante", details: error });
    }
};
export{
    registerStudent,
    loginStudent, 
    updateStudent_controller,
    deleteStudent_controller
}