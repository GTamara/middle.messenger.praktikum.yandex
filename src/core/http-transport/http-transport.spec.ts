import { expect } from 'chai';
import sinon from 'sinon';
import { EHttpMethod, HTTPTransport } from './http-transport';
import { API_URL } from '../../app-config';

describe('HTTPTransport', () => {
    let http: HTTPTransport;
    let fetchStub: sinon.SinonStub;

    beforeEach(() => {
        http = new HTTPTransport();
        fetchStub = sinon.stub(global, 'fetch')
            .resolves(
                new Response(
                    '{}',
                    {
                        // status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                ),
            );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Request methods', () => {

        it(`get() should use http method ${EHttpMethod.GET}`, async () => {
            await http.get('/test');
            const [, options] = fetchStub.firstCall.args;
            expect(options.method).to.equal(EHttpMethod.GET);
        });

        it(`post() should use http method ${EHttpMethod.POST}`, async () => {
            await http.post('/test');
            const [, options] = fetchStub.firstCall.args;
            expect(options.method).to.equal(EHttpMethod.POST);
        });

        it(`put() should use http method ${EHttpMethod.PUT}`, async () => {
            await http.put('/test');
            const [, options] = fetchStub.firstCall.args;
            expect(options.method).to.equal(EHttpMethod.PUT);
        });

        it(`delete() should use http method ${EHttpMethod.DELETE}`, async () => {
            await http.delete('/test');
            const [, options] = fetchStub.firstCall.args;
            expect(options.method).to.equal(EHttpMethod.DELETE);
        });
    });

    describe('Payload processing', () => {
        it('Should send JSON with correct headers', async () => {
            const payload = { key: 'value' };
            await http.post('/test', payload);

            const [, options] = fetchStub.firstCall.args;
            expect(options.headers).to.include({
                'Content-Type': 'application/json'
            });
            expect(options.body).to.equal(JSON.stringify(payload));
        });

        it('Should send FormData without Content-Type http header', async () => {
            const formData = new FormData();
            formData.append('field', 'value');

            await http.post('/test', formData);

            const [, options] = fetchStub.firstCall.args;
            expect(options.headers).not.to.have.property('Content-Type');
            expect(options.body).to.equal(formData);
        });

        it('Should send Blob с binary with Content-Type header', async () => {
            const blob = new Blob(['test']);
            await http.post('/test', blob);

            const [, options] = fetchStub.firstCall.args;
            expect(options.headers).to.include({
                'Content-Type': 'application/octet-stream'
            });
            expect(options.body).to.equal(blob);
        });

        it('Should send plain text with text/plain Content-Type', async () => {
            await http.post('/test', 'plain text');

            const [, options] = fetchStub.firstCall.args;
            expect(options.headers).to.include({
                'Content-Type': 'text/plain'
            });
            expect(options.body).to.equal('plain text');
        });
    });

    describe('Response handling', () => {
        it('Should parse JSON response', async () => {
            const responseData = { success: true };
            fetchStub.resolves(new Response(JSON.stringify(responseData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));

            const result = await http.get('/test');
            expect(result).to.deep.equal(responseData);
        });

        it('Should return play text for text/plain in Content-Type request header', async () => {
            fetchStub.resolves(new Response('plain text', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            }));

            const result = await http.get('/test');
            expect(result).to.equal('plain text');
        });

        it('Should throw an error for status >= 400', async () => {
            const errorResponse = new Response('Error', { status: 500 });
            fetchStub.resolves(errorResponse);

            try {
                await http.get('/error');
                expect.fail('Should throw an error');
            } catch (err) {
                expect(err).to.equal(errorResponse);
            }
        });
    });

    describe('Integration checks', () => {
        it('Should prepend base url URL', async () => {
            await http.get('/endpoint');
            expect(fetchStub.calledWith(`${API_URL}/endpoint`)).to.be.true;
        });

        it('Should include credentials and cors mode', async () => {
            await http.get('/test');
            const [, options] = fetchStub.firstCall.args;
            expect(options.credentials).to.equal('include');
            expect(options.mode).to.equal('cors');
        });

        it('Should combine http headings', async () => {
            await http.get('/test', null, {
                headers: { 'X-Custom': 'value' }
            });

            const [, options] = fetchStub.firstCall.args;
            expect(options.headers).to.include({
                'X-Custom': 'value'
            });
        });
    });
});
