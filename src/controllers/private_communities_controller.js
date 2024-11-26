import privateCommunityModel from "../models/privateCommunities.js";
import { v4 as uuidv4 } from "uuid";

const getAllPrivateCommunities = async (req, res) => {
    try {
        const communities = await privateCommunityModel.getAllPrivateCommunities();
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener comunidades privadas", details: error });
    }
};

const getPrivateCommunityById = async (req, res) => {
    const { id } = req.params;
    try {
        const community = await privateCommunityModel.getPrivateCommunityById(id);
        const status = community.error ? 404 : 200;
        res.status(status).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la comunidad privada", details: error });
    }
};

const createPrivateCommunity = async (req, res) => {
    const newCommunityData = {
        id: uuidv4(),
        ...req.body,
    };
    try {
        const community = await privateCommunityModel.createPrivateCommunity(newCommunityData);
        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la comunidad privada", details: error });
    }
};

const updatePrivateCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCommunityData = { ...req.body };
        const community = await privateCommunityModel.updatePrivateCommunity(id, updatedCommunityData);
        const status = community.error ? 404 : 200;
        res.status(status).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la comunidad privada", details: error });
    }
};

const deletePrivateCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        const deletionResult = await privateCommunityModel.deletePrivateCommunity(id);
        const status = deletionResult.error ? 404 : 200;
        res.status(status).json(deletionResult);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la comunidad privada", details: error });
    }
};

export {
    getAllPrivateCommunities,
    getPrivateCommunityById,
    createPrivateCommunity,
    updatePrivateCommunity,
    deletePrivateCommunity
};
