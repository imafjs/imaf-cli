/// <reference types="node" />
import * as events from 'events';
export declare const eventEmitter: events.EventEmitter;
export declare function log(msg?: string, tag?: any): void;
export declare function info(msg: any, tag?: any): void;
export declare function done(msg: any, tag?: any): void;
export declare function warn(msg: any, tag?: any): void;
export declare function error(msg: any, tag?: any): void;
export declare function clearConsole(title: any): void;
