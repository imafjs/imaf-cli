import { request } from "../../src";

test('', async ()=> console.log( await request.getJSON('http://c.3g.163.com/nc/video/list/VAP4BFR16/y/0-10.html', {})))