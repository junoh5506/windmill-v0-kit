"use client";

// Vendored from packages/ui/src/components/ThinkingAnimation/{GridThinkingAnimation,WindmillThinkingAnimation}.tsx. Verbatim animation; @wind/Remix deps stripped for v0.

import type { AnimationSequence } from "framer-motion";
import { useAnimate } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* GridThinkingAnimation                                              */
/* ------------------------------------------------------------------ */

const DEFAULT_SIZE = 24;
const DEFAULT_GAP = 0.3;
const DEFAULT_BORDER_RADIUS = 0.2;
const DEFAULT_PAUSE_BETWEEN = 100;
const DEFAULT_OPACITY = 0.15;

export interface GridAnimationPhase {
  type: "wave" | "heartbeat" | "build" | "spin" | "snake";
  duration: number;
  intensity: number;
  tailLength?: number; // snake only
  repeats?: number; // snake only
}

export interface GridThinkingAnimationProps {
  sequence?: GridAnimationPhase[];
  size?: number;
  gap?: number;
  borderRadius?: number;
  pauseBetween?: number;
  className?: string;
}

// Wave pattern delays (diagonal)
const WAVE_DELAYS = [
  [0, 1, 2],
  [1, 2, 3],
  [2, 3, 4],
];

const SNAKE_PATH = [0, 1, 2, 5, 4, 3, 6, 7, 8, 5, 4, 3];

const GRID_DEFAULT_SEQUENCE: GridAnimationPhase[] = [
  { type: "wave", duration: 1.2, intensity: 1 },
  { type: "snake", duration: 2, intensity: 1, tailLength: 3, repeats: 2 },
  { type: "heartbeat", duration: 1, intensity: 1 },
  { type: "spin", duration: 1.5, intensity: 1 },
  { type: "build", duration: 1.5, intensity: 1 },
];

export const GridThinkingAnimation = ({
  sequence = GRID_DEFAULT_SEQUENCE,
  size = DEFAULT_SIZE,
  gap = DEFAULT_GAP,
  borderRadius = DEFAULT_BORDER_RADIUS,
  pauseBetween = DEFAULT_PAUSE_BETWEEN,
  className,
}: GridThinkingAnimationProps) => {
  const [scope, animate] = useAnimate();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const cellSize = size / 3;
  const squareSize = cellSize * (1 - gap);
  const offset = (cellSize - squareSize) / 2;
  const actualBorderRadius = squareSize * borderRadius;

  const resetGrid = useCallback(async () => {
    if (!mountedRef.current) {
      return;
    }
    const resets: AnimationSequence = [];
    for (let i = 0; i < 9; i++) {
      resets.push([`.box-${i}`, { opacity: DEFAULT_OPACITY, scale: 1 }, { duration: 0.1 }]);
    }
    resets.push([".grid-wrapper", { transform: "rotate(0deg) scale(1)" }, { duration: 0 }]);
    await animate(resets);
  }, [animate]);

  const runAnimation = useCallback(
    async (item: GridAnimationPhase) => {
      if (!mountedRef.current) {
        return;
      }
      const { type, duration, intensity, tailLength = 3 } = item;

      switch (type) {
        case "wave": {
          const animations: AnimationSequence = [];
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              const idx = row * 3 + col;
              const delay = WAVE_DELAYS[row][col] * (duration * 0.15);
              animations.push([
                `.box-${idx}`,
                { opacity: [DEFAULT_OPACITY, intensity, DEFAULT_OPACITY] },
                { duration: duration * 0.4, ease: "easeOut", at: delay },
              ]);
            }
          }
          await animate(animations);
          break;
        }

        case "heartbeat": {
          const pulseSize = 0.2 * intensity;
          const scales = [1, 1 + pulseSize, 1, 1 + pulseSize * 0.6, 1];
          await animate(
            ".grid-wrapper",
            { transform: scales.map((s) => `scale(${s})`) },
            { duration, ease: "easeOut", times: [0, 0.2, 0.4, 0.6, 1] }
          );
          break;
        }

        case "build": {
          const stepDuration = duration / 9;
          for (let i = 0; i < 9; i++) {
            if (!mountedRef.current) {
              return;
            }
            await animate(
              `.box-${i}`,
              { opacity: intensity },
              { duration: stepDuration * 0.5, ease: "easeOut" }
            );
            if (i < 8) {
              await new Promise((r) => setTimeout(r, stepDuration * 500 * 0.5));
            }
          }
          if (!mountedRef.current) {
            return;
          }
          await new Promise((r) => setTimeout(r, 200));
          if (!mountedRef.current) {
            return;
          }
          await animate(
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [
              `.box-${i}`,
              { opacity: DEFAULT_OPACITY },
              { duration: 0.3, at: 0 },
            ])
          );
          break;
        }

        case "spin": {
          await animate(
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [
              `.box-${i}`,
              { opacity: 0.8 },
              { duration: 0.1, at: 0 },
            ])
          );
          if (!mountedRef.current) {
            return;
          }
          await animate(
            ".grid-wrapper",
            {
              transform: [
                "rotate(0deg)",
                "rotate(200deg)",
                "rotate(175deg)",
                "rotate(185deg)",
                "rotate(180deg)",
              ],
            },
            { duration, ease: "easeOut", times: [0, 0.5, 0.7, 0.85, 1] }
          );
          if (!mountedRef.current) {
            return;
          }
          await animate(".grid-wrapper", { transform: "rotate(0deg)" }, { duration: 0 });
          await resetGrid();
          break;
        }

        case "snake": {
          const repeats = item.repeats || 2;
          const stepDuration = duration / SNAKE_PATH.length;
          const litBoxes: number[] = [];

          for (let rep = 0; rep < repeats; rep++) {
            for (let i = 0; i < SNAKE_PATH.length; i++) {
              if (!mountedRef.current) {
                return;
              }
              const boxIdx = SNAKE_PATH[i];
              litBoxes.push(boxIdx);

              await animate(
                `.box-${boxIdx}`,
                { opacity: intensity },
                { duration: stepDuration * 0.3, ease: "easeOut" }
              );

              if (litBoxes.length > tailLength && mountedRef.current) {
                const fadeIdx = litBoxes[litBoxes.length - tailLength - 1];
                void animate(
                  `.box-${fadeIdx}`,
                  { opacity: DEFAULT_OPACITY },
                  { duration: stepDuration * 2, ease: "easeOut" }
                );
              }

              if (i < SNAKE_PATH.length - 1 || rep < repeats - 1) {
                await new Promise((r) => setTimeout(r, stepDuration * 1000 * 0.7));
              }
            }
          }

          if (!mountedRef.current) {
            return;
          }
          await new Promise((r) => setTimeout(r, 100));
          if (!mountedRef.current) {
            return;
          }
          const uniqueTail = [...new Set(litBoxes.slice(-tailLength))];
          await animate(
            uniqueTail.map((i) => [
              `.box-${i}`,
              { opacity: DEFAULT_OPACITY },
              { duration: 0.3, at: 0 },
            ])
          );
          break;
        }
      }
    },
    [animate, resetGrid]
  );

  useEffect(() => {
    if (sequence.length === 0) {
      return;
    }

    let cancelled = false;

    const runSequence = async () => {
      while (!cancelled && mountedRef.current) {
        for (const phase of sequence) {
          if (cancelled || !mountedRef.current) {
            break;
          }
          await runAnimation(phase);
          if (cancelled || !mountedRef.current) {
            break;
          }
          if (pauseBetween > 0) {
            await new Promise((r) => setTimeout(r, pauseBetween));
          }
        }
      }
    };

    void runSequence();
    return () => {
      cancelled = true;
    };
  }, [sequence, pauseBetween, runAnimation]);

  return (
    <div
      ref={scope}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        className="grid-wrapper"
        style={{
          display: "block",
          width: size,
          height: size,
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const idx = row * 3 + col;
              return (
                <rect
                  key={idx}
                  className={`box-${idx}`}
                  x={cellSize * col + offset}
                  y={cellSize * row + offset}
                  width={squareSize}
                  height={squareSize}
                  rx={actualBorderRadius}
                  fill="currentColor"
                  opacity={DEFAULT_OPACITY}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* WindmillThinkingAnimation                                          */
/* ------------------------------------------------------------------ */

export interface WindmillAnimationPhase {
  type: "ringChase" | "breathingSpin" | "heartbeat" | "elasticBounce";
  duration: number;
  intensity: number;
  iterations?: number; // ringChase only
  overshoot?: number; // elasticBounce only
}

export interface WindmillThinkingAnimationProps {
  sequence?: WindmillAnimationPhase[];
  size?: number;
  pauseBetween?: number;
  className?: string;
}

const paths = {
  ring1: {
    d: "M150.073 180.5C151.433 182.569 152.827 184.561 154.248 186.479C147.657 189.302 140.474 191.008 132.936 191.358C132.371 189.028 131.868 186.667 131.425 184.293C137.996 184.127 144.278 182.796 150.073 180.5ZM99.3098 174.824C104.533 178.4 110.411 181.088 116.728 182.674C116.616 185.145 116.576 187.575 116.603 189.959C109.291 188.333 102.468 185.407 96.3909 181.436C97.2989 179.216 98.2764 177.008 99.3098 174.824ZM175.844 159.29C178.163 160.166 180.465 160.959 182.744 161.676C178.938 167.969 174.037 173.526 168.305 178.082C166.478 176.526 164.684 174.908 162.93 173.245C168.006 169.389 172.385 164.664 175.844 159.29ZM78.7415 148.195C80.9359 154.333 84.2011 159.962 88.3118 164.856C86.773 166.793 85.3151 168.737 83.9397 170.685C79.0704 165.192 75.1687 158.822 72.5002 151.842C74.5365 150.575 76.6232 149.36 78.7415 148.195ZM191.387 124.822C191.522 126.484 191.592 128.165 191.592 129.862C191.592 135.677 190.785 141.303 189.279 146.636C186.882 146.452 184.477 146.197 182.077 145.884C183.635 140.818 184.474 135.438 184.474 129.862C184.474 128.888 184.447 127.919 184.397 126.957C186.79 126.299 189.12 125.586 191.387 124.822ZM70.6067 113.687C73.0006 113.854 75.4052 114.093 77.8059 114.393C76.3555 119.296 75.5774 124.488 75.5774 129.862C75.5774 131.117 75.6208 132.361 75.7043 133.595C73.3198 134.263 70.9973 134.985 68.7395 135.758C68.5552 133.817 68.4602 131.851 68.4602 129.862C68.4602 124.265 69.2068 118.841 70.6067 113.687ZM176.733 89.7529C181.51 95.3108 185.312 101.73 187.874 108.747C185.829 110.011 183.734 111.223 181.609 112.384C179.52 106.218 176.357 100.549 172.343 95.5977C173.888 93.6553 175.352 91.706 176.733 89.7529ZM91.6848 81.6904C93.5247 83.2334 95.3312 84.8408 97.0989 86.4951C91.9277 90.4275 87.4808 95.2631 83.9944 100.768C81.669 99.9084 79.3624 99.1292 77.0784 98.4297C80.9025 92.0018 85.8637 86.3297 91.6848 81.6904ZM144.104 69.9141C151.462 71.6353 158.312 74.6759 164.392 78.7734C163.485 81.0011 162.506 83.216 161.472 85.4082C156.254 81.7102 150.356 78.9082 144.003 77.2256C144.106 74.7447 144.14 72.3064 144.104 69.9141ZM127.609 68.3428C128.188 70.6757 128.703 73.0409 129.159 75.4209C122.461 75.5254 116.057 76.8387 110.155 79.1533C108.777 77.0891 107.368 75.1009 105.93 73.1904C112.63 70.338 119.939 68.6389 127.609 68.3428Z",
    opacity: 0.4,
  },
  ring2: {
    d: "M89.7041 213.546C99.5464 218.292 110.354 221.353 121.752 222.356C122.617 224.929 123.579 227.377 124.627 229.692C113.02 229.078 101.939 226.484 91.7129 222.242C90.7051 219.91 89.9538 217.109 89.7041 213.546ZM177.428 209.712C179.638 211.29 181.855 212.711 184.062 213.975C174.642 220.04 164.138 224.567 152.904 227.199C150.751 225.881 148.533 224.033 146.275 221.297C157.482 219.316 167.994 215.326 177.428 209.712ZM48.2871 174.033C53.6359 183.901 60.7196 192.692 69.1299 199.995C68.3265 202.591 67.674 205.143 67.1709 207.637C58.4009 200.545 50.8543 192.002 44.8965 182.371C45.4097 179.86 46.4072 177.113 48.2871 174.033ZM223.103 166.4C218.897 177.1 212.901 186.898 205.483 195.428C202.969 195.612 200.093 195.405 196.666 194.508C204.4 186.537 210.717 177.185 215.211 166.855C217.934 166.832 220.568 166.678 223.103 166.4ZM37.9258 117.534C37.3932 121.559 37.1172 125.665 37.1172 129.836C37.1172 137.075 37.9458 144.122 39.5127 150.885C37.338 152.526 35.3131 154.22 33.4453 155.955C31.1985 147.629 30 138.872 30 129.836C30 127.345 30.0925 124.876 30.2715 122.432C32.153 120.653 34.5689 118.966 37.9258 117.534ZM226.843 104.813C228.903 112.811 230 121.195 230 129.836C230 132.822 229.868 135.778 229.611 138.698C227.688 140.347 225.24 141.894 221.926 143.202C222.555 138.838 222.883 134.375 222.883 129.836C222.883 122.975 222.137 116.288 220.726 109.851C222.916 108.221 224.957 106.538 226.843 104.813ZM53.7725 65.1084C56.3558 64.7534 59.3221 64.7894 62.9131 65.5996C55.1914 73.6618 48.9088 83.1129 44.4775 93.541C41.7469 93.5981 39.1081 93.7887 36.5732 94.1035C40.6537 83.4412 46.5071 73.6561 53.7725 65.1084ZM193.562 52.6338C202.335 59.8647 209.853 68.5622 215.743 78.3506C215.194 80.8489 214.154 83.5789 212.245 86.6377C206.99 76.6536 199.972 67.7425 191.603 60.3203C192.408 57.7083 193.061 55.1417 193.562 52.6338ZM106.724 32.5605C109.019 33.8 111.393 35.5835 113.817 38.3594C102.512 40.3456 91.9115 44.3758 82.4102 50.0557C80.166 48.4963 77.9179 47.0986 75.6807 45.8633C85.0627 39.7818 95.5277 35.2297 106.724 32.5605ZM135.771 30.002C147.415 30.6645 158.527 33.318 168.77 37.6299C169.855 39.9812 170.682 42.8155 170.979 46.4609C161.093 41.5931 150.217 38.4313 138.733 37.3604C137.84 34.7766 136.849 32.3205 135.771 30.002Z",
    opacity: 1,
  },
  ring3: {
    d: "M90.9636 198.945C99.2442 203.632 108.45 206.873 118.24 208.328C118.681 210.872 119.204 213.337 119.805 215.717C109.092 214.459 98.9785 211.243 89.8308 206.436C90.04 204.18 90.4083 201.694 90.9636 198.945ZM166.349 200.399C168.2 202.203 170.071 203.893 171.955 205.47C162.922 210.492 152.895 213.942 142.244 215.452C141.096 213.496 139.941 211.265 138.783 208.713C148.626 207.63 157.927 204.746 166.349 200.399ZM57.8298 162.885C61.9106 171.782 67.5876 179.794 74.4949 186.554C73.362 188.876 72.3428 191.182 71.4373 193.463C63.7012 186.339 57.2663 177.824 52.533 168.312C54.0178 166.601 55.7672 164.795 57.8298 162.885ZM200.743 165.834C203.305 166.207 205.818 166.474 208.273 166.643C203.754 176.236 197.524 184.863 189.976 192.131C187.899 191.219 185.654 190.09 183.22 188.704C190.364 182.241 196.326 174.498 200.743 165.834ZM52.2126 114.042C51.1818 119.146 50.6404 124.428 50.6404 129.836C50.6404 134.359 51.0202 138.792 51.7468 143.108C49.4653 144.33 47.2858 145.605 45.2136 146.928C44.1059 141.403 43.5232 135.688 43.5232 129.836C43.5232 124.899 43.9374 120.058 44.7322 115.347C46.9375 114.825 49.4158 114.383 52.2126 114.042ZM214.987 113.777C215.964 118.981 216.477 124.349 216.477 129.836C216.477 135.092 216.007 140.237 215.109 145.234C212.89 145.722 210.407 146.132 207.617 146.445C208.758 141.089 209.36 135.533 209.36 129.836C209.36 125.664 209.036 121.566 208.416 117.567C210.71 116.356 212.901 115.09 214.987 113.777ZM189.289 66.8843C196.964 74.1154 203.318 82.7335 207.947 92.3394C206.446 94.0473 204.68 95.8468 202.605 97.7515C198.634 88.7791 193.05 80.6809 186.219 73.8247C187.357 71.4923 188.38 69.1764 189.289 66.8843ZM69.7312 67.8208C71.8267 68.6922 74.096 69.792 76.5662 71.1606C69.3611 77.7259 63.3699 85.6003 58.9685 94.4077C56.4001 94.0595 53.8832 93.8154 51.4255 93.6733C55.9096 83.9464 62.1461 75.1937 69.7312 67.8208ZM140.743 44.021C151.542 45.359 161.722 48.6883 170.908 53.6294C170.711 55.8956 170.352 58.3952 169.802 61.1655C161.493 56.3396 152.229 52.9784 142.362 51.4351C141.904 48.8805 141.363 46.4069 140.743 44.021ZM118.02 44.1831C119.202 46.1256 120.392 48.3537 121.585 50.9185C111.599 51.9709 102.166 54.8745 93.6345 59.2808C91.7595 57.4878 89.8644 55.8103 87.9578 54.2495C97.0882 49.1601 107.236 45.6776 118.02 44.1831Z",
    opacity: 0.8,
  },
  ring4: {
    d: "M157.371 190.513C158.951 192.469 160.56 194.336 162.191 196.112C154.317 199.944 145.658 202.414 136.52 203.216C135.68 200.953 134.918 198.626 134.232 196.251C142.437 195.736 150.239 193.735 157.371 190.513ZM94.5688 186.177C101.258 190.392 108.75 193.449 116.764 195.066C116.897 197.577 117.106 200.031 117.386 202.425C108.372 200.869 99.9192 197.676 92.3442 193.162C92.987 190.836 93.734 188.504 94.5688 186.177ZM187.645 163.107C190.078 163.763 192.482 164.33 194.85 164.809C190.579 172.712 184.905 179.747 178.162 185.578C176.153 184.238 174.169 182.799 172.219 181.278C178.386 176.211 183.626 170.056 187.645 163.107ZM68.2271 154.635C71.2612 162.186 75.6394 169.052 81.0659 174.937C79.7025 177.049 78.4355 179.162 77.2603 181.267C71.0158 174.864 65.9285 167.329 62.3335 158.998C64.2152 157.487 66.1872 156.033 68.2271 154.635ZM203.042 120.213C203.452 123.363 203.666 126.575 203.666 129.837C203.665 135.709 202.976 141.421 201.677 146.896C199.261 146.996 196.808 146.999 194.333 146.917C195.777 141.466 196.548 135.742 196.548 129.837C196.548 127.558 196.433 125.306 196.209 123.087C198.565 122.183 200.843 121.222 203.042 120.213ZM58.1479 113.525C60.5603 113.402 63.0125 113.379 65.4878 113.441C64.159 118.686 63.4517 124.179 63.4517 129.837C63.4517 132.44 63.6014 135.007 63.8921 137.532C61.5469 138.447 59.2793 139.417 57.0923 140.436C56.5936 136.975 56.3345 133.436 56.3345 129.837C56.3345 124.232 56.9619 118.772 58.1479 113.525ZM183.441 79.1357C189.6 85.6253 194.589 93.2354 198.071 101.629C196.177 103.136 194.195 104.588 192.144 105.982C189.224 98.3812 184.951 91.4519 179.618 85.4893C180.987 83.3686 182.261 81.2482 183.441 79.1357ZM81.6802 74.2314C83.7074 75.5493 85.7082 76.9717 87.6772 78.4775C81.4209 83.6391 76.1246 89.9224 72.0942 97.0186C69.6547 96.3831 67.2466 95.8365 64.8745 95.3789C69.1432 87.3277 74.8606 80.1626 81.6802 74.2314ZM143.253 57.3604C152.337 59.0106 160.839 62.327 168.433 66.9805C167.795 69.317 167.05 71.66 166.216 73.998C159.518 69.6444 151.987 66.4634 143.915 64.7461C143.769 62.2254 143.547 59.7621 143.253 57.3604ZM123.912 56.4199C124.775 58.682 125.555 61.013 126.261 63.3926C117.913 63.8549 109.975 65.8552 102.726 69.1162C101.125 67.1666 99.4964 65.3078 97.8452 63.542C105.834 59.6601 114.629 57.1794 123.912 56.4199Z",
    opacity: 0.6,
  },
};

const originalOpacities = {
  ring1: 0.4,
  ring4: 0.6,
  ring3: 0.8,
  ring2: 1.0,
};

const WINDMILL_DEFAULT_SEQUENCE: WindmillAnimationPhase[] = [
  { type: "ringChase", duration: 1.2, intensity: 1, iterations: 2 },
  { type: "breathingSpin", duration: 2, intensity: 1 },
  { type: "elasticBounce", duration: 1.5, intensity: 1, overshoot: 1.3 },
  { type: "heartbeat", duration: 1.2, intensity: 1 },
];

export const WindmillThinkingAnimation = ({
  sequence = WINDMILL_DEFAULT_SEQUENCE,
  size = 24,
  pauseBetween = 100,
  className,
}: WindmillThinkingAnimationProps) => {
  const [scope, animate] = useAnimate();

  const resetOpacities = useCallback(async () => {
    await animate([
      [".ring1", { opacity: originalOpacities.ring1 }, { duration: 0.15 }],
      [".ring4", { opacity: originalOpacities.ring4 }, { duration: 0.15, at: 0 }],
      [".ring3", { opacity: originalOpacities.ring3 }, { duration: 0.15, at: 0 }],
      [".ring2", { opacity: originalOpacities.ring2 }, { duration: 0.15, at: 0 }],
    ]);
  }, [animate]);

  const runAnimation = useCallback(
    async (item: WindmillAnimationPhase) => {
      const { type, duration, intensity, overshoot = 1.3, iterations = 1 } = item;

      switch (type) {
        case "ringChase":
          for (let i = 0; i < iterations; i++) {
            await animate([
              [
                ".ring1",
                { opacity: [0.2, intensity, 0.2] },
                { duration: duration * 0.3, ease: "easeOut" },
              ],
              [
                ".ring4",
                { opacity: [0.2, intensity * 0.9, 0.2] },
                { duration: duration * 0.3, ease: "easeOut", at: duration * 0.15 },
              ],
              [
                ".ring3",
                { opacity: [0.2, intensity * 0.85, 0.2] },
                { duration: duration * 0.3, ease: "easeOut", at: duration * 0.3 },
              ],
              [
                ".ring2",
                { opacity: [0.2, intensity * 0.8, 0.2] },
                { duration: duration * 0.3, ease: "easeOut", at: duration * 0.45 },
              ],
            ]);
          }
          await resetOpacities();
          break;

        case "elasticBounce": {
          await resetOpacities();
          const overAmount = 360 + 20 * overshoot;
          await animate(
            ".spinner-wrapper",
            { rotate: [0, overAmount, 360] },
            { duration, ease: [0.34, overshoot, 0.64, 1] }
          );
          await animate(".spinner-wrapper", { rotate: 0 }, { duration: 0 });
          break;
        }

        case "breathingSpin":
          await animate(
            ".spinner-wrapper",
            {
              rotate: [0, 180, 360],
              scale: [1, 1 + 0.08 * intensity, 1],
            },
            { duration, ease: "easeInOut" }
          );
          await animate(".spinner-wrapper", { rotate: 0 }, { duration: 0 });
          break;

        case "heartbeat": {
          await resetOpacities();
          const pulseSize = 0.15 * intensity;
          await animate(
            ".spinner-wrapper",
            { scale: [1, 1 + pulseSize, 1, 1 + pulseSize * 0.7, 1] },
            { duration, ease: "easeOut", times: [0, 0.2, 0.4, 0.6, 1] }
          );
          break;
        }
      }
    },
    [animate, resetOpacities]
  );

  useEffect(() => {
    if (sequence.length === 0) {
      return;
    }

    let cancelled = false;

    const runSequence = async () => {
      while (!cancelled) {
        for (const item of sequence) {
          if (cancelled) {
            break;
          }
          await runAnimation(item);
          if (cancelled) {
            break;
          }
          if (pauseBetween > 0) {
            await new Promise((r) => setTimeout(r, pauseBetween));
          }
        }
      }
    };

    void runSequence();
    return () => {
      cancelled = true;
    };
  }, [sequence, pauseBetween, runAnimation]);

  return (
    <div ref={scope} className={className} style={{ display: "inline-block" }}>
      <div className="spinner-wrapper" style={{ transformOrigin: "center" }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="ring1"
            d={paths.ring1.d}
            fill="currentColor"
            opacity={paths.ring1.opacity}
          />
          <path
            className="ring4"
            d={paths.ring4.d}
            fill="currentColor"
            opacity={paths.ring4.opacity}
          />
          <path
            className="ring3"
            d={paths.ring3.d}
            fill="currentColor"
            opacity={paths.ring3.opacity}
          />
          <path
            className="ring2"
            d={paths.ring2.d}
            fill="currentColor"
            opacity={paths.ring2.opacity}
          />
        </svg>
      </div>
    </div>
  );
};

export default WindmillThinkingAnimation;
