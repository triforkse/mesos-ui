import { jsdom } from 'jsdom';

global.chai = require('chai');
global.expect = global.chai.expect;
global.spyOn = global.expect.spyOn;

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.location = global.window.location;
