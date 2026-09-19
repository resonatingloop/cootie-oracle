import "./style.css";
import { animateCatcher } from "./catcher/animation";
import { FIELD_01 } from "./content/field-01";
import { CIPHERS, type CipherId } from "./domain/ciphers";
import {
  consultOracle,
  formatReceipt,
  type OracleReading,
  UnmappableOfferingError,
  ZeroValueOfferingError,
} from "./domain/oracle";
import { createPrintTemplate } from "./print/template";

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`missing required element: ${selector}`);
  return element;
}

const form = requiredElement<HTMLFormElement>("#oracle-form");
const offeringInput = requiredElement<HTMLInputElement>("#offering");
const cipherGrid = requiredElement<HTMLDivElement>("#cipher-grid");
const formError = requiredElement<HTMLParagraphElement>("#form-error");
const shell = requiredElement<HTMLDivElement>("#catcher-shell");
const machineStatus = requiredElement<HTMLSpanElement>("#machine-status");
const liveStatus = requiredElement<HTMLParagraphElement>("#live-status");
const foldCount = requiredElement<HTMLSpanElement>("#fold-count");
const zoneReadout = requiredElement<HTMLElement>("#zone-readout");
const coreMark = requiredElement<HTMLSpanElement>("#core-mark");
const resultPanel = requiredElement<HTMLElement>("#result-panel");
const actionStatus = requiredElement<HTMLSpanElement>("#action-status");
const submitButton = requiredElement<HTMLButtonElement>(".consult-button");
const printSheet = requiredElement<HTMLElement>("#print-sheet");

let currentReading: OracleReading | null = null;
let consultationNumber = 0;

function renderCipherChoices(): void {
  cipherGrid.replaceChildren(
    ...FIELD_01.cipherIds.map((id, index) => {
      const cipher = CIPHERS[id];
      const label = document.createElement("label");
      label.className = `cipher-choice cipher-choice--${id}`;
      label.innerHTML = `
        <input type="radio" name="cipher" value="${id}" ${index === 0 ? "checked" : ""} />
        <span class="cipher-index">0${index + 1}</span>
        <strong>${cipher.label}</strong>
        <small>${cipher.rule}</small>
        <span class="pair-mark">pair / ${CIPHERS[cipher.pair].label}</span>
      `;
      return label;
    }),
  );
}

function selectedCipher(): CipherId {
  const selected = form.elements.namedItem("cipher");
  if (!(selected instanceof RadioNodeList)) return "aq";
  return (selected.value || "aq") as CipherId;
}

function setFormBusy(busy: boolean): void {
  for (const control of form.elements) {
    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLButtonElement ||
      control instanceof HTMLTextAreaElement
    ) {
      control.disabled = busy;
    }
  }
  submitButton.querySelector("span")!.textContent = busy ? "consulting the hinges" : "fold my fate";
}

function renderReading(reading: OracleReading): void {
  requiredElement<HTMLElement>("#result-zone").textContent = String(reading.route.zone);
  requiredElement<HTMLElement>("#result-offering").textContent = reading.offering;
  requiredElement<HTMLElement>("#result-value").textContent =
    `${reading.calculation.cipher.label} / ${reading.calculation.value}`;
  requiredElement<HTMLElement>("#result-orbit").textContent = String(reading.route.orbit);
  requiredElement<HTMLElement>("#result-numeral").textContent = reading.arcana.numeral;
  requiredElement<HTMLElement>("#result-arcana").textContent = reading.arcana.name;
  requiredElement<HTMLElement>("#result-passage").textContent =
    `${reading.route.passageLabel} · ${reading.route.bearing}`;
  requiredElement<HTMLElement>("#result-fortune").textContent = reading.fortune;
  resultPanel.hidden = false;
}

function readableError(error: unknown): string {
  if (error instanceof UnmappableOfferingError) {
    return "the chosen cipher cannot find a single usable character in that offering.";
  }
  if (error instanceof ZeroValueOfferingError) {
    return "zero has no hinge. add another mapped character and try again.";
  }
  return "the paper jammed somewhere impossible. try the offering again.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  actionStatus.textContent = "";
  resultPanel.hidden = true;
  shell.dataset.state = "ready";

  try {
    currentReading = consultOracle(offeringInput.value, selectedCipher(), FIELD_01);
  } catch (error) {
    currentReading = null;
    formError.textContent = readableError(error);
    offeringInput.focus();
    return;
  }

  consultationNumber += 1;
  const thisConsultation = consultationNumber;
  setFormBusy(true);
  machineStatus.textContent = `${currentReading.calculation.cipher.label} ${currentReading.calculation.value} / addressed`;
  zoneReadout.textContent = `zone ${currentReading.route.zone}`;
  coreMark.textContent = String(currentReading.route.zone);
  liveStatus.textContent =
    `value ${currentReading.calculation.value}; folding ${currentReading.route.zone} times.`;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  await animateCatcher({
    shell,
    route: currentReading.route,
    reducedMotion,
    onStep: (step) => {
      foldCount.textContent = `fold ${step} / ${currentReading?.route.zone ?? "—"}`;
    },
  });

  if (thisConsultation !== consultationNumber || !currentReading) return;
  machineStatus.textContent = "flap lifted / receipt issued";
  liveStatus.textContent =
    `zone ${currentReading.route.zone} reveals ${currentReading.arcana.name}, ${currentReading.route.passageLabel}, ${currentReading.route.bearing}. ${currentReading.fortune}`;
  renderReading(currentReading);
  setFormBusy(false);
  resultPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  resultPanel.focus({ preventScroll: true });
});

requiredElement<HTMLButtonElement>("#copy-receipt").addEventListener("click", async () => {
  if (!currentReading) return;
  const receipt = formatReceipt(currentReading);
  try {
    await navigator.clipboard.writeText(receipt);
    actionStatus.textContent = "receipt copied. the evidence is now portable.";
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = receipt;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    actionStatus.textContent = "receipt copied by older, stranger machinery.";
  }
});

requiredElement<HTMLButtonElement>("#print-sheet-button").addEventListener("click", () => {
  window.print();
});

requiredElement<HTMLButtonElement>("#download-sheet").addEventListener("click", () => {
  const blob = new Blob([createPrintTemplate(FIELD_01)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cootie-oracle-field-01.svg";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  actionStatus.textContent = "the foldable escaped as svg.";
});

requiredElement<HTMLButtonElement>("#reset-oracle").addEventListener("click", () => {
  consultationNumber += 1;
  currentReading = null;
  resultPanel.hidden = true;
  form.reset();
  setFormBusy(false);
  formError.textContent = "";
  actionStatus.textContent = "";
  machineStatus.textContent = "awaiting offering";
  foldCount.textContent = "fold — / —";
  zoneReadout.textContent = "zone —";
  coreMark.textContent = "☤";
  shell.dataset.state = "ready";
  offeringInput.focus();
});

renderCipherChoices();
printSheet.innerHTML = createPrintTemplate(FIELD_01);
