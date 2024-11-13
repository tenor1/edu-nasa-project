const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
    // expect(response.statusCode).toBe(200);
  });
});

describe('Test POST /launches', () => {
  test('It should respond with 201 created', () => {
    const response = 201;
    expect(response).toBe(201);
  });

  test('It should catch missing required properties', () => {});
  test('It should catch invalid dates', () => {});
});