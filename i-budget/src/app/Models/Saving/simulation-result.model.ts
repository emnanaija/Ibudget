export interface SimulationResult {
    moyenneSoldeFinal: number;
    intervalleConfianceMin: number;
    intervalleConfianceMax: number;
    simulations: number[];
    simulationsReduites: number[];
  }