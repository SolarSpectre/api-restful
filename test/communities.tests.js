const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /api/communities', () => {
  it('Debe devolver una lista de comunidades', async () => {
    
  });
});
