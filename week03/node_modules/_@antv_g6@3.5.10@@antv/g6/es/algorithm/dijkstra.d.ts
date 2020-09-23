import { IGraph } from '../interface/graph';
declare const dijkstra: (graph: IGraph, source: string, directed?: boolean, weightPropertyName?: string) => any[];
export default dijkstra;
