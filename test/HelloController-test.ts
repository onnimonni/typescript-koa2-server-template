import * as Chai from 'chai';
import * as R from 'ramda';
import { SuperTest, Test } from 'supertest';
import * as supertest from 'supertest-as-promised';

import conf from '../src/config';
import IBApi from '../src/index';

/* tslint:disable-next-line:no-var-requires no-require-imports */
Chai.use(require('chai-as-promised'));
Chai.should();

const app: IBApi = new IBApi(conf);
const request: SuperTest<Test> = supertest.agent(app.listen());

describe('Hello API', () => {

  it('lists hellos', () =>
    request
      .get('/api/hellos')
      .expect(200)
      .then(R.props(['body']))
      .then(R.head)
      .should.eventually.be.fulfilled
      .and.have.length.of.at.least(1));
});
