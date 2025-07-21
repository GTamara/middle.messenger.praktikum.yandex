import { JSDOM } from 'jsdom';
import { register } from 'ts-node';

// Конфигурация ts-node для ESM
register({
    transpileOnly: true,
    esm: true,
    experimentalSpecifierResolution: 'node'
});

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    runScripts: 'dangerously'
});
global.document = jsdom.window.document;
global.window = jsdom.window;
// global.navigator = jsdom.window.navigator;
global.location = jsdom.window.location;
global.history = jsdom.window.history;
global.MouseEvent = jsdom.window.MouseEvent;
global.PopStateEvent = jsdom.window.PopStateEvent;
global.Node = jsdom.window.Node;
