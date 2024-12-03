const privateCommunityModel = {

    async getAllPrivateCommunities() {
        const response = await fetch("https://community.free.beeceptor.com/private-communities");
        const communities = await response.json();
        return communities;
    },

    async getPrivateCommunityById(communityId) {
        const response = await fetch(`https://community.free.beeceptor.com/private-communities/${communityId}`);
        if (!response.ok) {
            return { error: "Comunidad privada no encontrada" };
        }
        const data = await response.json();
        return data;
    },

    async createPrivateCommunity(newCommunity) {
        const url = "https://community.free.beeceptor.com/private-communities";
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newCommunity),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    },

    async updatePrivateCommunity(communityId, updatedCommunity) {
        const url = `https://community.free.beeceptor.com/private-communities/${communityId}`;
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
        const url = `https://community.free.beeceptor.com/private-communities/${communityId}`;
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
