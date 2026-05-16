/**
 * Static geometry for the decorative Poland map: city pins, the country
 * outline, and the four dashed "routes" radiating from Warszawa to other
 * cities. Kept out of the React component so the markup stays a pure
 * render of this data — no inline coordinate noise.
 *
 * Coordinates are tuned for the parent `<svg viewBox="0 0 500 480">`.
 * Warszawa (270, 190) is the origin of every route.
 */

export interface City {
  cx: number;
  cy: number;
  name: string;
}

export const CITIES: City[] = [
  { cx: 270, cy: 190, name: 'Warszawa' },
  { cx: 290, cy: 330, name: 'Kraków' },
  { cx: 340, cy: 110, name: 'Gdańsk' },
  { cx: 190, cy: 230, name: 'Wrocław' },
  { cx: 210, cy: 130, name: 'Poznań' },
  { cx: 240, cy: 220, name: 'Łódź' },
  { cx: 250, cy: 320, name: 'Katowice' },
  { cx: 350, cy: 260, name: 'Lublin' },
];

export const POLAND_PATH =
  'M180,60 L220,55 L260,50 L300,48 L340,52 L370,60 L400,80 L420,100 L430,130 L440,160 L430,200 L420,240 L400,270 L380,300 L360,330 L340,360 L310,380 L280,390 L250,400 L220,395 L190,380 L160,360 L140,330 L120,300 L110,270 L100,240 L95,210 L100,180 L110,150 L120,120 L140,90 L160,70 Z';

export interface Route {
  x2: number;
  y2: number;
  delayS: number;
}

/** Dashed routes from Warszawa (270, 190) to four other cities. */
export const ROUTES: Route[] = [
  { x2: 290, y2: 330, delayS: 0 },
  { x2: 190, y2: 230, delayS: 0.5 },
  { x2: 340, y2: 110, delayS: 1 },
  { x2: 210, y2: 130, delayS: 1.5 },
];
