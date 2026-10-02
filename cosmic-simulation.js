const canvas = document.querySelector("#cosmic-canvas");

if (canvas) {
  const context = canvas.getContext("2d");
  const countInput = document.querySelector("#star-count");
  const speedInput = document.querySelector("#rotation-speed");
  const countOutput = document.querySelector("#star-count-value");
  const speedOutput = document.querySelector("#rotation-speed-value");
  const particleCount = document.querySelector("#particle-count");
  const status = document.querySelector("#simulation-status");
  const toggleButton = document.querySelector("#toggle-simulation");
  const stars = [];
  const backgroundStars = [];
  const state = {
    mode: "spiral",
    color: "#f1d48e",
    count: Number(countInput.value),
    speed: Number(speedInput.value),
    arms: 4,
    rotation: 0,
    running: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    width: 0,
    height: 0,
    pixelRatio: 1,
    seed: Math.random() * 10000,
    dragging: false,
    pointerX: 0
  };

  function random() {
    state.seed = (state.seed * 16807) % 2147483647;
    return (state.seed - 1) / 2147483646;
  }

  function buildStars() {
    stars.length = 0;
    for (let index = 0; index < state.count; index += 1) {
      const radialPosition = Math.sqrt(random());
      const arm = Math.floor(random() * state.arms);
      const armOffset = (arm / state.arms) * Math.PI * 2;
      const angle = state.mode === "spiral"
        ? armOffset + radialPosition * 5.2 + (random() - .5) * .55
        : random() * Math.PI * 2;
      const radius = state.mode === "ring"
        ? .54 + (random() - .5) * .16
        : radialPosition;

      stars.push({
        angle,
        radius,
        size: .35 + random() * 1.35,
        alpha: .25 + random() * .75,
        phase: random() * Math.PI * 2,
        direction: random() > .5 ? 1 : -1
      });
    }
    countOutput.value = state.count.toLocaleString();
    particleCount.textContent = `${state.count.toLocaleString()} stars`;
  }

  function buildBackground() {
    backgroundStars.length = 0;
    const count = Math.max(80, Math.round((state.width * state.height) / 5200));
    for (let index = 0; index < count; index += 1) {
      backgroundStars.push({
        x: random() * state.width,
        y: random() * state.height,
        size: .3 + random() * .9,
        alpha: .12 + random() * .45
      });
    }
  }

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    state.width = bounds.width;
    state.height = bounds.height;
    state.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.width * state.pixelRatio);
    canvas.height = Math.round(state.height * state.pixelRatio);
    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    buildBackground();
  }

  function drawFrame() {
    const { width, height } = state;
    if (!width || !height) {
      requestAnimationFrame(drawFrame);
      return;
    }

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#05070b";
    context.fillRect(0, 0, width, height);

    for (const star of backgroundStars) {
      context.globalAlpha = star.alpha;
      context.fillStyle = "#d8e2f2";
      context.fillRect(star.x, star.y, star.size, star.size);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radiusLimit = Math.min(width, height) * .46;
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusLimit);
    glow.addColorStop(0, `${state.color}20`);
    glow.addColorStop(.42, `${state.color}0a`);
    glow.addColorStop(1, `${state.color}00`);
    context.globalAlpha = 1;
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    for (const star of stars) {
      if (state.running) {
        star.angle += state.speed * .00016 * star.direction / Math.sqrt(star.radius + .08);
      }
      const angle = star.angle + state.rotation;
      const radius = star.radius * radiusLimit;
      const verticalScale = state.mode === "elliptical" ? .45 : state.mode === "ring" ? .64 : .56;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * verticalScale;
      const twinkle = .72 + Math.sin(star.phase + star.angle * 2) * .28;
      context.globalAlpha = star.alpha * twinkle;
      context.fillStyle = state.color;
      context.beginPath();
      context.arc(x, y, star.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
    requestAnimationFrame(drawFrame);
  }

  function updateStatus() {
    status.textContent = state.running ? "Simulation running" : "Simulation paused";
    status.dataset.paused = String(!state.running);
    toggleButton.textContent = state.running ? "Pause simulation" : "Resume simulation";
    toggleButton.setAttribute("aria-pressed", String(!state.running));
  }

  for (const button of document.querySelectorAll("[data-mode]")) {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      for (const option of document.querySelectorAll("[data-mode]")) {
        const active = option === button;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      }
      buildStars();
    });
  }

  for (const button of document.querySelectorAll("[data-color]")) {
    button.addEventListener("click", () => {
      state.color = button.dataset.color;
      for (const option of document.querySelectorAll("[data-color]")) {
        const active = option === button;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      }
    });
  }

  countInput.addEventListener("input", () => {
    state.count = Number(countInput.value);
    buildStars();
  });

  speedInput.addEventListener("input", () => {
    state.speed = Number(speedInput.value);
    speedOutput.value = `${state.speed}%`;
  });

  toggleButton.addEventListener("click", () => {
    state.running = !state.running;
    updateStatus();
  });

  document.querySelector("#randomize-simulation").addEventListener("click", () => {
    state.seed = Math.random() * 10000;
    state.rotation = 0;
    buildStars();
  });

  document.querySelector("#export-simulation").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "cosmic-simulation.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    state.rotation += (event.clientX - state.pointerX) * .004;
    state.pointerX = event.clientX;
  });

  canvas.addEventListener("pointerup", () => {
    state.dragging = false;
  });

  canvas.addEventListener("pointercancel", () => {
    state.dragging = false;
  });

  new ResizeObserver(resizeCanvas).observe(canvas);
  countOutput.value = state.count.toLocaleString();
  speedOutput.value = `${state.speed}%`;
  buildStars();
  resizeCanvas();
  updateStatus();
  requestAnimationFrame(drawFrame);
}