import type { PaperPlexRoute } from "../domain/paper-plex";

export interface CatcherAnimationOptions {
  shell: HTMLElement;
  route: PaperPlexRoute;
  reducedMotion: boolean;
  onStep: (step: number) => void;
}

function pause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function animateCatcher({
  shell,
  route,
  reducedMotion,
  onStep,
}: CatcherAnimationOptions): Promise<void> {
  shell.dataset.state = "addressed";
  onStep(0);

  if (reducedMotion) {
    onStep(route.gate);
    shell.dataset.state = "revealed";
    return;
  }

  await pause(220);
  for (let step = 1; step <= route.gate; step += 1) {
    shell.dataset.state = step % 2 === 1 ? "axis-x" : "axis-y";
    onStep(step);
    await pause(360);
  }

  shell.dataset.state = "settling";
  await pause(240);
  shell.dataset.state = "revealed";
  await pause(360);
}
