import { IGraph } from '../interface/graph';
import { Matrix } from '../types';
declare const adjMatrix: (graph: IGraph, directed?: boolean) => Matrix[];
export default adjMatrix;
