import {default as chaiHttp, request} from "chai-http";
import * as chai from "chai";
import app from '../src/server.js';

chai.use(chaiHttp);
const {expect} = chai;
describe('GET /api/communities', () => {
  it('Debe devolver una lista de comunidades', async () => {
    const res = await request.execute(app).get('/api/communities');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length(1);
  });
});
