/**
 * Static geometry for the decorative Poland map: city pins, the country
 * outline, and the dashed "routes" radiating from Warszawa to other
 * cities. Kept out of the React component so the markup stays a pure
 * render of this data — no inline coordinate noise.
 *
 * Coordinates are tuned for the parent `<svg viewBox="0 0 500 480">` and are
 * projected from real lat/lon so the layout matches an actual map of Poland.
 * Warszawa (329, 219) is the origin of every route.
 */

export interface City {
  cx: number;
  cy: number;
  name: string;
}

/**
 * City coordinates derived from real geographic latitude/longitude, projected
 * onto the viewBox so the relative layout matches an actual map of Poland
 * (Gdańsk north on the coast, Kraków/Katowice in the south, Szczecin west,
 * Lublin/Białystok east). Warszawa stays the route origin.
 */
export const CITIES: City[] = [
  { cx: 329, cy: 219, name: 'Warszawa' },
  { cx: 284, cy: 367, name: 'Kraków' },
  { cx: 230, cy: 74, name: 'Gdańsk' },
  { cx: 163, cy: 295, name: 'Wrocław' },
  { cx: 158, cy: 206, name: 'Poznań' },
  { cx: 264, cy: 251, name: 'Łódź' },
  { cx: 246, cy: 354, name: 'Katowice' },
  { cx: 394, cy: 286, name: 'Lublin' },
  { cx: 59, cy: 137, name: 'Szczecin' },
  { cx: 419, cy: 157, name: 'Białystok' },
];

export const POLAND_PATH =
  'M59,150 L90,120 L130,108 L175,95 L210,82 L235,72 L258,80 L240,100 L270,108 L310,100 L345,95 L380,105 L410,120 L425,145 L419,160 L400,168 L420,185 L415,210 L394,230 L405,260 L385,285 L370,300 L375,330 L360,355 L335,368 L300,372 L284,372 L270,360 L246,360 L220,372 L195,360 L175,345 L163,300 L150,280 L140,255 L160,230 L150,206 L120,200 L100,185 L70,170 Z';

export interface Route {
  x2: number;
  y2: number;
  delayS: number;
}

/** Dashed routes from Warszawa (329, 219) to five other cities. */
export const ROUTES: Route[] = [
  { x2: 284, y2: 367, delayS: 0 },
  { x2: 163, y2: 295, delayS: 0.5 },
  { x2: 230, y2: 74, delayS: 1 },
  { x2: 158, y2: 206, delayS: 1.5 },
  { x2: 394, y2: 286, delayS: 2 },
];
