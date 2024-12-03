const studentCommunityModel = {

    async getAllCommunities() {
        const response = await fetch("https://community.free.beeceptor.com/communities");
        const communities = await response.json();
        console.log(communities);
        return communities;
    },

    async getCommunityById(communityId) {
        const response = await fetch(`https://community.free.beeceptor.com/communities/${communityId}`);
        if (!response.ok) {
            return { error: "Comunidad no encontrada" };
        }
        const data = await response.json();
        return data;
    },

    async createCommunity(newCommunity) {
        const url = "https://community.free.beeceptor.com/communities";
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newCommunity),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
    },

    async updateCommunity(communityId, updatedCommunity) {
        const url = `https://community.free.beeceptor.com/communities/${communityId}`;
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
        const url = `https://community.free.beeceptor.com/communities/${communityId}`;
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
};

export default studentCommunityModel;
