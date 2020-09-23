import { IGraph } from '../interface/graph';
import { Matrix } from '../types';
declare const floydWarshall: (graph: IGraph, directed?: boolean) => Matrix[];
export default floydWarshall;
