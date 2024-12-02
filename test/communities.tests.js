import {default as chaiHttp, request} from "chai-http";
import * as chai from "chai";
import app from '../src/server.js';

chai.use(chaiHttp);
const {expect} = chai;
describe('GET /api/communities', () => {
  let communityId;
  let token;
  before(async () => {
    // Inicia sesión para obtener el token
    const loginData = {
      username: "joseph",
      password: "qwerty",
    };

    const res = await request.execute(app)
      .post("/api/users/login")
      .send(loginData);

    expect(res).to.have.status(200);
    expect(res.body).to.include.keys("token");

    token = res.body.token; // Guardar el token para usarlo en las siguientes pruebas
  });
  it('Debe devolver una lista de comunidades', async () => {
    const res = await request.execute(app).get('/api/communities');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });
  it("Debe crear una nueva comunidad (POST /api/communities)", async () => {
    const communityData = {
      nombre: "Comunidad de Prueba",
      descripcion: "Una descripción de prueba",
    };

    const res = await request.execute(app)
      .post("/api/communities")
      .set("Authorization", `Bearer ${token}`)
      .send(communityData);
      

    expect(res).to.have.status(201);
    expect(res.body).to.include.keys("id", "nombre", "descripcion");
    expect(res.body.name).to.equal(communityData.name);

    communityId = res.body.id; // Guardar el ID para pruebas posteriores
  });
  it("Debe obtener una comunidad por ID (GET /api/communities/:id)", async () => {
    const res = await request.execute(app).get(`/api/communities/${communityId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.include.keys("id", "nombre", "descripcion");
    expect(res.body.id).to.equal(communityId);
  });

  it("Debe actualizar una comunidad (PUT /api/communities/:id)", async () => {
    const updatedData = {
      nombre: "Comunidad Actualizada",
      descripcion: "Descripción actualizada",
    };

    const res = await request.execute(app)
      .put(`/api/communities/${communityId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res).to.have.status(200);
    expect(res.body).to.include.keys("id", "nombre", "descripcion");
    expect(res.body.nombre).to.equal(updatedData.nombre);
  });

  it("Debe eliminar una comunidad (DELETE /api/communities/:id)", async () => {
    const res = await request.execute(app).delete(`/api/communities/${communityId}`).set("Authorization", `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.include.keys("msg");

    // Verificar que la comunidad ya no existe
    const verifyRes = await request.execute(app).get(`/api/communities/${communityId}`);
    expect(verifyRes).to.have.status(404);
  });
});
