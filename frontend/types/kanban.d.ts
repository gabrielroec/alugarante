export interface Card {
  id: string;
  title: string;
  details: string;
}

export interface Board {
  id: string;
  name: string;
  cards: Card[];
}

export interface Pipelines {
  [key: string]: Board[];
}
