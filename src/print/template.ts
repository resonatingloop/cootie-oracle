import type { OracleEdition } from "../content/field-01";
import { CIPHERS } from "../domain/ciphers";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapWords(text: string, width = 27): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 5);
}

function textBlock(text: string, x: number, y: number, rotation: number): string {
  const lines = wrapWords(text);
  const tspans = lines
    .map((line, index) => `<tspan x="0" dy="${index === 0 ? 0 : 12}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<text class="fortune" transform="translate(${x} ${y}) rotate(${rotation})">${tspans}</text>`;
}

export function createPrintTemplate(edition: OracleEdition): string {
  const fortunes = edition.fortunes;
  const fortunePlacements = [
    [130, 170, -45],
    [330, 92, 0],
    [590, 92, 0],
    [730, 250, 45],
    [730, 560, 135],
    [590, 730, 180],
    [330, 730, 180],
    [120, 570, -135],
  ] as const;

  const fortuneText = fortunePlacements
    .map(([x, y, rotation], index) => textBlock(fortunes[index] ?? "", x, y, rotation))
    .join("");

  const zones = Array.from({ length: 8 }, (_, index) => {
    const angle = -67.5 + index * 45;
    const radians = (angle * Math.PI) / 180;
    const x = 400 + Math.cos(radians) * 128;
    const y = 400 + Math.sin(radians) * 128;
    return `<text class="zone" x="${x.toFixed(2)}" y="${y.toFixed(2)}">${index + 1}</text>`;
  }).join("");

  const labels = edition.cipherIds.map((id) => CIPHERS[id].label);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" role="img" aria-labelledby="sheet-title sheet-desc">
  <title id="sheet-title">${escapeXml(edition.name)} printable cootie catcher</title>
  <desc id="sheet-desc">one square with four cipher flaps, eight numbered zones, eight fortunes, and marked fold lines</desc>
  <defs>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#211d24" stroke-opacity=".12" stroke-width="2" />
    </pattern>
    <style>
      .ink { fill: #211d24; }
      .cut { fill: none; stroke: #211d24; stroke-width: 4; }
      .fold { fill: none; stroke: #211d24; stroke-opacity: .5; stroke-width: 1.5; stroke-dasharray: 9 8; }
      .title { font: 900 34px Arial, sans-serif; letter-spacing: -1px; fill: #211d24; }
      .small { font: 700 11px 'Courier New', monospace; letter-spacing: 1px; fill: #211d24; }
      .flap { font: 900 24px Arial, sans-serif; text-anchor: middle; fill: #211d24; }
      .zone { font: 900 23px Arial, sans-serif; text-anchor: middle; dominant-baseline: middle; fill: #fffdf2; paint-order: stroke; stroke: #211d24; stroke-width: 7px; }
      .fortune { font: 700 9px Georgia, serif; text-anchor: middle; fill: #211d24; }
    </style>
  </defs>
  <rect width="850" height="1100" fill="#fffdf2" />
  <text class="title" x="45" y="58">cootie-oracle / ${escapeXml(edition.id)}</text>
  <text class="small" x="45" y="84">cut the square · printed side down · fold every corner to center twice · sharpen every crease</text>
  <text class="small" x="45" y="1030">paper-plex v1 · same cipher + value + edition = same fold-path</text>
  <text class="small" x="45" y="1050">full instructions: resonatingloop.github.io/cootie-oracle/</text>

  <g transform="translate(25 150)">
    <rect width="800" height="800" fill="#f2ecd8" />
    <polygon points="0,0 400,0 400,400" fill="#a990ff" />
    <polygon points="400,0 800,0 400,400" fill="#ff7849" />
    <polygon points="800,0 800,800 400,400" fill="#c9ef5b" />
    <polygon points="0,800 800,800 400,400" fill="#ff9eb5" />
    <polygon points="0,0 800,0 800,800 0,800" fill="url(#hatch)" />

    <polygon points="0,0 200,0 0,200" fill="#fffdf2" />
    <polygon points="800,0 600,0 800,200" fill="#fffdf2" />
    <polygon points="800,800 600,800 800,600" fill="#fffdf2" />
    <polygon points="0,800 200,800 0,600" fill="#fffdf2" />

    <circle cx="400" cy="400" r="167" fill="#211d24" />
    <circle cx="400" cy="400" r="95" fill="#fffdf2" stroke="#211d24" stroke-width="3" />
    <text x="400" y="391" text-anchor="middle" font-family="Georgia,serif" font-size="29" fill="#211d24">☤</text>
    <text x="400" y="425" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" fill="#211d24">fold your fate</text>

    <text class="flap" x="400" y="51">${escapeXml(labels[0] ?? "AQ")}</text>
    <text class="flap" x="749" y="407" transform="rotate(90 749 407)">${escapeXml(labels[1] ?? "Ordinal")}</text>
    <text class="flap" x="400" y="765" transform="rotate(180 400 765)">${escapeXml(labels[2] ?? "QWER")}</text>
    <text class="flap" x="51" y="407" transform="rotate(-90 51 407)">${escapeXml(labels[3] ?? "nQWER")}</text>

    ${zones}
    ${fortuneText}

    <path class="fold" d="M0 0L800 800M800 0L0 800M400 0V800M0 400H800" />
    <rect class="cut" width="800" height="800" />
    <path d="M382 400h36M400 382v36" stroke="#211d24" stroke-width="1.5" />
  </g>
</svg>`.trim();
}
