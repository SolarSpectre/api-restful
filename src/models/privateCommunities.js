const privateCommunityModel = {

    async getAllPrivateCommunities() {
        const response = await fetch("http://localhost:3000/private-communities");
        const communities = await response.json();
        return communities;
    },

    async getPrivateCommunityById(communityId) {
        const response = await fetch(`http://localhost:3000/private-communities/${communityId}`);
        if (!response.ok) {
            return { error: "Comunidad privada no encontrada" };
        }
        const data = await response.json();
        return data;
    },

    async createPrivateCommunity(newCommunity) {
        const url = "http://localhost:3000/private-communities";
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newCommunity),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    },

    async updatePrivateCommunity(communityId, updatedCommunity) {
        const url = `http://localhost:3000/private-communities/${communityId}`;
        const response = await fetch(url);
        if (!response.ok) {
            return { error: "Comunidad privada no encontrada" };
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

    async deletePrivateCommunity(communityId) {
        const url = `http://localhost:3000/private-communities/${communityId}`;
        const response = await fetch(url);
        if (!response.ok) {
            return { error: "Comunidad privada no encontrada" };
        } else {
            const request = await fetch(url, {
                method: 'DELETE',
            });
            await request.json();
            return { msg: "Comunidad privada eliminada correctamente" };
        }
    }
};

export default privateCommunityModel;
