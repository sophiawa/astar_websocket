export class Obstacle {
    start_x: number;
    start_y: number;
    end_x: number;
    end_y: number;
}
  
export interface Data {
    source: number[];
    dest: number[];
    obstacles: Obstacle[];
}