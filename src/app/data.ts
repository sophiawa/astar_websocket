export class Obstacle {
    start_x: number;
    start_y: number;
    end_x: number;
    end_y: number;

    constructor(start_x, start_y, end_x, end_y) {
      this.start_x = start_x;
      this.start_y = start_y;
      this.end_x = end_x;
      this.end_y = end_y;
    }
}
  
export class Data {
    source: number[];
    dest: number[];
    obstacles: Obstacle[];
    dict;

    constructor(src, dest, obsts) {
      this.source = src;
      this.dest = dest;
      this.obstacles = obsts;
      this.dict = {"source" : src, "dest" : dest, "obstacles" : obsts};
    }
}