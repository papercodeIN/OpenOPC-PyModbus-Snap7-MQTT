import { Namespace } from "../source/namespace";
import { NodeEntry1, NodeIdManager } from "./nodeid_manager";
export declare function getNodeIdManager(ns: Namespace): NodeIdManager;
export declare function setSymbols(ns: Namespace, symbols: NodeEntry1[]): void;
export declare function getSymbols(ns: Namespace): NodeEntry1[];
