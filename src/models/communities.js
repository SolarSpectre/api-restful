const studentCommunityModel = {

    async getAllCommunities() {
        const response = await fetch("http://localhost:3000/communities");
        const communities = await response.json();
        console.log(communities);
        return communities;
    },

    async getCommunityById(communityId) {
        const response = await fetch(`http://localhost:3000/communities/${communityId}`);
        if (!response.ok) {
            return { error: "Comunidad no encontrada" };
        }
        const data = await response.json();
        return data;
    },

    async createCommunity(newCommunity) {
        const url = "http://localhost:3000/communities";
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newCommunity),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    },

    async updateCommunity(communityId, updatedCommunity) {
        const url = `http://localhost:3000/communities/${communityId}`;
        const response = await fetch(url);
        if (!response.ok) {
            return { error: "Comunidad no encontrada" };
        } else {
            const request = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(updatedCommunity),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await request.json();
            return data;
        }
    },

    async deleteCommunity(communityId) {
        const url = `http://localhost:3000/communities/${communityId}`;
        const response = await fetch(url);
        if (!response.ok) {
            return { error: "Comunidad no encontrada" };
        } else {
            const request = await fetch(url, {
                method: 'DELETE',
            });
            await request.json();
            return { msg: "Comunidad eliminada correctamente" };
        }
    },

    async addStudentToCommunity(communityId, student) {
        const url = `http://localhost:3000/communities/${communityId}/students`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(student),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    },

    async getStudentsInCommunity(communityId) {
        const url = `http://localhost:3000/communities/${communityId}/students`;
        const response = await fetch(url);
        if (!response.ok) {
            return { error: "Estudiantes no encontrados" };
        }
        const students = await response.json();
        return students;
    }
};

export default studentCommunityModel;
