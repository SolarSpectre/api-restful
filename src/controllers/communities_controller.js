import communityModel from "../models/communities.js";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

const getAllCommunities = async (req, res) => {
    try {
        const communities = await communityModel.getAllCommunities();
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener comunidades", details: error });
    }
};

const getCommunityById = async (req, res) => {
    const { id } = req.params;
    try {
        const community = await communityModel.getCommunityById(id);
        const status = community.error ? 404 : 200;
        res.status(status).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la comunidad", details: error });
    }
};

const createCommunity = async (req, res) => {
    const newCommunityData = {
        id: uuidv4(),
        ...req.body,
    };
    try {
        if (req.files?.imagen) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: "communities" });
            newCommunityData.imagen = cloudinaryResponse.secure_url;
            newCommunityData.public_id = cloudinaryResponse.public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }
        const community = await communityModel.createCommunity(newCommunityData);
        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la comunidad", details: error });
        console.error(error);
    }
};

const updateCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCommunityData = { ...req.body };
        if (req.files?.imagen) {
            const oldCommunity = await communityModel.getCommunityById(id);
            if (oldCommunity.public_id) {
                await cloudinary.uploader.destroy(oldCommunity.public_id);
            }
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: "communities" });
            updatedCommunityData.imagen = cloudinaryResponse.secure_url;
            updatedCommunityData.public_id = cloudinaryResponse.public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }
        const community = await communityModel.updateCommunity(id, updatedCommunityData);
        const status = community.error ? 404 : 200;
        res.status(status).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la comunidad", details: error });
    }
};

const deleteCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        const community = await communityModel.getCommunityById(id);
        if (community.public_id) {
            await cloudinary.uploader.destroy(community.public_id);
        }
        const deletionResult = await communityModel.deleteCommunity(id);
        const status = deletionResult.error ? 404 : 200;
        res.status(status).json(deletionResult);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la comunidad", details: error });
    }
};

export {
    getAllCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity
};
