window.__ModuleLoader__.load({
  id: 'dsh-ladybug-yoyo-pomodoro',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NAMESPACE = 'ladybug-yoyo-pomodoro';
        const FOCUS_SECONDS = 25 * 60;
        const WIDGET_STORAGE_KEY = 'ladybug-yoyo-pomodoro:widget';
    const WIDGET_MARGIN = 8;
    const WIDGET_SIZE = 240;
    const WIDGET_MIN_SIZE = 190;
    const WIDGET_MAX_SIZE = 420;
    const WIDGET_DEFAULT_OFFSET = 24;
    const FLASH_MS = 1600;
    const DONE_RESET_MS = 5000;
    const TICK_MS = 250;

    const ZH = {
      'timer.start': '开始 25 分钟 Ladybug 专注',
      'timer.pause': '暂停专注',
      'timer.resume': '继续专注',
      'timer.done': 'Pound it!',
      'timer.startFlash': 'Tikki, spots on!',
      'timer.pauseFlash': 'Lucky Charm!',
      'timer.resumeFlash': 'Lucky Charm!',
      'timer.resetFlash': 'Miraculous Ladybug!',
      'timer.remaining': '剩余 {time}',
      'timer.hint': '单击开始或暂停，双击重置',
      'timer.reset': '重置',
      'timer.announce.start': '专注开始，25 分钟',
      'timer.announce.resume': '专注继续',
      'timer.announce.pause': '专注已暂停',
      'timer.announce.done': 'Pound it！专注完成。',
      'timer.announce.reset': '计时已重置为 25 分钟',
      'phase.idle': '准备专注',
      'phase.running': '专注中',
      'phase.paused': '已暂停',
      'phase.done': '完成',
      'widget.title': 'Ladybug 专注',
      'widget.expand': '展开专注小组件',
      'widget.collapse': '收起专注小组件',
      'widget.drag': '拖动悠悠球移动小组件，拖边缘调整大小',
      'widget.start': '开始专注',
      'widget.pause': '暂停',
      'widget.resume': '继续',
      'widget.again': '再来一轮',
      'widget.reset': '重置',
      'widget.hint': '拖动悠悠球移动，拖边缘缩放；收起后计时继续',
      'widget.credit': '粉丝作品 · 非官方出品 · 与 ZAG / Toei Animation 无关',
      'widget.info': '关于这个小组件',
      'widget.infoTitle': '关于小组件',
      'widget.sound': '完成铃声',
      'widget.soundOn': '铃声：开',
      'widget.soundOff': '铃声：关',
      'widget.soundToggle': '切换完成铃声',
      'widget.soundNote': '按 4312 旋律合成的小铃，不含原版录音',
      'widget.mute': '静音完成铃声',
      'widget.unmute': '解除静音',
    };

    const EN = {
      'timer.start': 'Start a 25-minute focus session',
      'timer.pause': 'Pause focus',
      'timer.resume': 'Resume focus',
      'timer.done': 'Pound it!',
      'timer.startFlash': 'Tikki, spots on!',
      'timer.pauseFlash': 'Lucky Charm!',
      'timer.resumeFlash': 'Lucky Charm!',
      'timer.resetFlash': 'Miraculous Ladybug!',
      'timer.remaining': '{time} left',
      'timer.hint': 'Click to start or pause; double-click to reset',
      'timer.reset': 'Reset',
      'timer.announce.start': 'Focus started for 25 minutes',
      'timer.announce.resume': 'Focus resumed',
      'timer.announce.pause': 'Focus paused',
      'timer.announce.done': 'Pound it! Focus complete.',
      'timer.announce.reset': 'Timer reset to 25 minutes',
      'phase.idle': 'Ready',
      'phase.running': 'Focusing',
      'phase.paused': 'Paused',
      'phase.done': 'Done',
      'widget.title': 'Ladybug Focus',
      'widget.expand': 'Open focus widget',
      'widget.collapse': 'Close focus widget',
      'widget.drag': 'Drag the yoyo to move it; drag the edge to resize',
      'widget.start': 'Start focus',
      'widget.pause': 'Pause',
      'widget.resume': 'Resume',
      'widget.again': 'Focus again',
      'widget.reset': 'Reset',
      'widget.hint': 'Drag the yoyo to move; drag the edge to resize. The timer keeps running when closed',
      'widget.credit': 'Fan-made, not official. Not affiliated with ZAG / Toei Animation.',
      'widget.info': 'About this widget',
      'widget.infoTitle': 'About this widget',
      'widget.sound': 'Completion ringtone',
      'widget.soundOn': 'Ringtone: on',
      'widget.soundOff': 'Ringtone: off',
      'widget.soundToggle': 'Toggle completion ringtone',
      'widget.soundNote': 'A synthesized take on the 4312 melody; no official recording.',
      'widget.mute': 'Mute the completion ringtone',
      'widget.unmute': 'Unmute the completion ringtone',
    };

    let fallbackTranslate = (key) => key;

    function translator(t) {
      return typeof t === 'function' ? t : fallbackTranslate;
    }

    function formatTime(totalSeconds) {
      const safe = Math.max(0, totalSeconds);
      const minutes = Math.floor(safe / 60);
      const seconds = safe % 60;
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    const SOUND_STORAGE_KEY = 'ladybug-yoyo-pomodoro:sound';
    // User-provided phrase: 4312~ 0 4312~ 0 43122265 (1 = C4).
    // Equal 0.3s steps; the final 4 is removed, and the closing 5 is held; crescendo from the second 2.
    const CHIME_MELODY = [
      [4, 0, 0.38, 0.46],
      [3, 0.3, 0.38, 0.42],
      [1, 0.6, 0.38, 0.4],
      [2, 0.9, 0.7, 0.46],

      [4, 1.95, 0.38, 0.46],
      [3, 2.25, 0.38, 0.42],
      [1, 2.55, 0.38, 0.4],
      [2, 2.85, 0.7, 0.46],

      [4, 3.9, 0.38, 0.44],
      [3, 4.2, 0.38, 0.42],
      [1, 4.5, 0.38, 0.4],
      [2, 4.8, 0.38, 0.44],
      [2, 5.1, 0.38, 0.48],
      [2, 5.4, 0.38, 0.52],
      [6, 5.7, 0.38, 0.56],
      [5, 6, 0.9, 0.64],
    ];
    const CHIME_DEGREES = {
      1: 261.63,
      2: 293.66,
      3: 329.63,
      4: 349.23,
      5: 392,
      6: 440,
    };
    const CHIME_NOTES = CHIME_MELODY.map(([degree, offset, duration, level]) => [
      CHIME_DEGREES[degree],
      offset,
      duration,
      level,
    ]);

    function readSoundEnabled() {
      try {
        return window.localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';
      } catch {
        return true;
      }
    }

    function writeSoundEnabled(enabled) {
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'on' : 'off');
      } catch {
        // Session-only fallback.
      }
    }

    function createChime() {
      let context = null;
      let enabled = readSoundEnabled();

      function ensureContext() {
        if (context) return context;
        const AudioContextClass =
          typeof window !== 'undefined' &&
          (window.AudioContext || window.webkitAudioContext);
        if (!AudioContextClass) return null;
        try {
          context = new AudioContextClass();
        } catch {
          return null;
        }
        return context;
      }

      function unlock() {
        const audio = ensureContext();
        if (!audio) return;
        if (audio.state === 'suspended') audio.resume().catch(() => {});
      }

      function schedule(audio) {
        const start = audio.currentTime + 0.05;
        const master = audio.createGain();
        master.gain.value = 0.36;
        let tail = audio.destination;
        if (typeof audio.createDynamicsCompressor === 'function') {
          const compressor = audio.createDynamicsCompressor();
          compressor.threshold.value = -22;
          compressor.knee.value = 20;
          compressor.ratio.value = 3;
          compressor.attack.value = 0.006;
          compressor.release.value = 0.3;
          compressor.connect(audio.destination);
          tail = compressor;
        }
        if (typeof audio.createBiquadFilter === 'function') {
          const filter = audio.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1750;
          filter.Q.value = 0.55;
          filter.connect(tail);
          tail = filter;
        }
        master.connect(tail);

        CHIME_NOTES.forEach(([frequency, offset, duration, level]) => {
          const body = audio.createOscillator();
          const bodyGain = audio.createGain();
          body.type = 'sine';
          body.frequency.value = frequency;
          const attack = 0.035;
          const release = 0.11;
          bodyGain.gain.setValueAtTime(0.0001, start + offset);
          bodyGain.gain.exponentialRampToValueAtTime(level, start + offset + attack);
          bodyGain.gain.setValueAtTime(level, start + offset + Math.max(attack, duration - release));
          bodyGain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
          body.connect(bodyGain);
          bodyGain.connect(master);
          body.start(start + offset);
          body.stop(start + offset + duration + 0.02);

          const shimmer = audio.createOscillator();
          const shimmerGain = audio.createGain();
          shimmer.type = 'sine';
          shimmer.frequency.value = frequency * 2;
          shimmerGain.gain.setValueAtTime(0.0001, start + offset);
          shimmerGain.gain.exponentialRampToValueAtTime(level * 0.05, start + offset + 0.06);
          shimmerGain.gain.setValueAtTime(level * 0.05, start + offset + Math.max(0.06, duration * 0.8 - 0.12));
          shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration * 0.8);
          shimmer.connect(shimmerGain);
          shimmerGain.connect(master);
          shimmer.start(start + offset);
          shimmer.stop(start + offset + duration * 0.8 + 0.02);

        });
      }

      function play() {
        if (!enabled) return;
        const audio = ensureContext();
        if (!audio) return;
        if (audio.state === 'suspended') {
          audio.resume().then(() => schedule(audio)).catch(() => {});
          return;
        }
        schedule(audio);
      }

      function toggle() {
        enabled = !enabled;
        writeSoundEnabled(enabled);
        if (enabled) unlock();
        return enabled;
      }

      return {
        play,
        unlock,
        toggle,
        isEnabled: () => enabled,
      };
    }

    const chime = createChime();

    function readWidgetPrefs() {
      try {
        const raw = window.localStorage.getItem(WIDGET_STORAGE_KEY);
        if (!raw) return { open: false, pos: null, size: WIDGET_SIZE };
        const value = JSON.parse(raw);
        const pos =
          value && Number.isFinite(value.x) && Number.isFinite(value.y)
            ? { x: value.x, y: value.y }
            : null;
        const size =
          value && Number.isFinite(value.size)
            ? Math.min(WIDGET_MAX_SIZE, Math.max(WIDGET_MIN_SIZE, value.size))
            : WIDGET_SIZE;
        return { open: value ? !!value.open : false, pos, size };
      } catch {
        return { open: false, pos: null, size: WIDGET_SIZE };
      }
    }

    function writeWidgetPrefs(patch) {
      try {
        const current = readWidgetPrefs();
        const has = (key) => Object.prototype.hasOwnProperty.call(patch, key);
        const pos = has('pos') ? patch.pos : current.pos;
        const open = has('open') ? patch.open : current.open;
        const size = has('size') ? patch.size : current.size;
        window.localStorage.setItem(
          WIDGET_STORAGE_KEY,
          JSON.stringify({
            open,
            x: pos ? pos.x : null,
            y: pos ? pos.y : null,
            size,
          })
        );
      } catch {
        // Position, size, and open state are conveniences; the timer must not fail.
      }
    }

    function clampPosition(x, y, width, height) {
      const viewportWidth = window.innerWidth || 0;
      const viewportHeight = window.innerHeight || 0;
      const maxX = Math.max(WIDGET_MARGIN, viewportWidth - width - WIDGET_MARGIN);
      const maxY = Math.max(WIDGET_MARGIN, viewportHeight - height - WIDGET_MARGIN);
      return {
        x: Math.min(Math.max(x, WIDGET_MARGIN), maxX),
        y: Math.min(Math.max(y, WIDGET_MARGIN), maxY),
      };
    }

    function defaultWidgetPosition(size) {
      const viewportWidth = window.innerWidth || 0;
      const viewportHeight = window.innerHeight || 0;
      return clampPosition(
        viewportWidth - size - WIDGET_DEFAULT_OFFSET,
        viewportHeight - size - 96,
        size,
        size
      );
    }

    function createTimerStore() {
      const initial = readWidgetPrefs();
      let state = {
        phase: 'idle',
        remaining: FOCUS_SECONDS,
        flash: '',
        expanded: initial.open,
      };
      const listeners = new Set();
      let deadline = 0;
      let tickId = 0;
      let flashId = 0;
      let doneId = 0;

      function notify() {
        const snapshot = state;
        listeners.forEach((listener) => {
          try {
            listener(snapshot);
          } catch {
            // A broken consumer must not stop the shared timer.
          }
        });
      }

      function patch(next) {
        state = { ...state, ...next };
        notify();
      }

      function clearTick() {
        if (tickId) {
          window.clearInterval(tickId);
          tickId = 0;
        }
      }

      function clearFlash() {
        if (flashId) {
          window.clearTimeout(flashId);
          flashId = 0;
        }
      }

      function clearDone() {
        if (doneId) {
          window.clearTimeout(doneId);
          doneId = 0;
        }
      }

      function showFlash(key) {
        clearFlash();
        patch({ flash: key });
        flashId = window.setTimeout(() => {
          flashId = 0;
          if (state.flash === key) patch({ flash: '' });
        }, FLASH_MS);
      }

      function startTick() {
        clearTick();
        tickId = window.setInterval(() => {
          if (state.phase !== 'running') return;
          const next = Math.min(
            FOCUS_SECONDS,
            Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
          );
          if (next <= 0) {
            finish();
            return;
          }
          if (next !== state.remaining) patch({ remaining: next });
        }, TICK_MS);
      }

      function finish() {
        clearTick();
        clearDone();
        clearFlash();
        patch({ phase: 'done', remaining: 0, flash: '' });
        chime.play();
        doneId = window.setTimeout(() => {
          doneId = 0;
          if (state.phase === 'done') resetToIdle(true);
        }, DONE_RESET_MS);
      }

      function resetToIdle(withFlash) {
        clearTick();
        clearDone();
        clearFlash();
        patch({ phase: 'idle', remaining: FOCUS_SECONDS, flash: '' });
        if (withFlash) showFlash('timer.resetFlash');
      }

      function start() {
        if (state.phase === 'running') return;
        const resuming = state.phase === 'paused';
        chime.unlock();
        clearDone();
        const base =
          state.phase === 'done' || state.remaining <= 0 ? FOCUS_SECONDS : state.remaining;
        deadline = Date.now() + base * 1000;
        patch({ phase: 'running', remaining: base, flash: '' });
        startTick();
        showFlash(resuming ? 'timer.resumeFlash' : 'timer.startFlash');
      }

      function pause() {
        if (state.phase !== 'running') return;
        const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        if (next <= 0) {
          finish();
          return;
        }
        clearTick();
        patch({ phase: 'paused', remaining: next, flash: '' });
        showFlash('timer.pauseFlash');
      }

      function reset() {
        resetToIdle(true);
      }

      function toggle() {
        if (state.phase === 'running') pause();
        else start();
      }

      function toggleExpanded() {
        const expanded = !state.expanded;
        writeWidgetPrefs({ open: expanded });
        patch({ expanded });
      }

      function dispose() {
        clearTick();
        clearFlash();
        clearDone();
        listeners.clear();
      }

      return {
        get: () => state,
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        start,
        pause,
        reset,
        toggle,
        toggleExpanded,
        dispose,
      };
    }

    const timerStore = createTimerStore();

    function useTimerStore() {
      const [snapshot, setSnapshot] = React.useState(timerStore.get());
      React.useEffect(() => {
        setSnapshot(timerStore.get());
        return timerStore.subscribe(setSnapshot);
      }, []);
      return snapshot;
    }

    function LadybugArt() {
      return h(
        'svg',
        {
          className: 'mlb-svg',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', { d: 'M6 18.4 3.4 20.2', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M18 18.4 20.6 20.2', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M5 13.5 2.2 14.4', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M19 13.5 21.8 14.4', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M6.5 9 4 8.1', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M17.5 9 20 8.1', stroke: '#171114', strokeWidth: '1.35', strokeLinecap: 'round' }),
        h('path', { d: 'M9.6 5.7 7.1 4.5', stroke: '#171114', strokeWidth: '1.4', strokeLinecap: 'round' }),
        h('path', { d: 'M14.4 5.7 16.9 4.5', stroke: '#171114', strokeWidth: '1.4', strokeLinecap: 'round' }),
        h('circle', { cx: '7.1', cy: '4.5', r: '0.95', fill: '#171114' }),
        h('circle', { cx: '16.9', cy: '4.5', r: '0.95', fill: '#171114' }),
        h('ellipse', { cx: '12', cy: '14.2', rx: '6.8', ry: '7.3', fill: '#E32C3C' }),
        h('path', { d: 'M12 7v14.4', stroke: '#171114', strokeWidth: '1.5' }),
        h('ellipse', { cx: '8.5', cy: '12.4', rx: '1.35', ry: '1.25', fill: '#171114' }),
        h('ellipse', { cx: '15.5', cy: '12.4', rx: '1.35', ry: '1.25', fill: '#171114' }),
        h('ellipse', { cx: '8.9', cy: '16.5', rx: '1.25', ry: '1.15', fill: '#171114' }),
        h('ellipse', { cx: '15.1', cy: '16.5', rx: '1.25', ry: '1.15', fill: '#171114' }),
        h('ellipse', { cx: '10.3', cy: '19.2', rx: '1.1', ry: '1', fill: '#171114' }),
        h('ellipse', { cx: '13.7', cy: '19.2', rx: '1.1', ry: '1', fill: '#171114' }),
        h('circle', { cx: '12', cy: '7.4', r: '2.7', fill: '#171114' }),
        h('circle', { cx: '10.9', cy: '6.9', r: '0.52', fill: '#FFF8F4' }),
        h('circle', { cx: '13.1', cy: '6.9', r: '0.52', fill: '#FFF8F4' }),
        h('path', { d: 'M9.7 11.1a3.4 3.4 0 0 1 1.2-1.4', stroke: '#FF9AA2', strokeWidth: '1', strokeLinecap: 'round', fill: 'none' })
      );
    }

    function MaskIcon() {
      return h(
        'svg',
        {
          className: 'mlb-mask-icon',
          viewBox: '0 0 40 16',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M3 8C7 2 13 2 20 8 27 2 33 2 37 8 33 14 27 14 20 8 13 14 7 14 3 8Z',
          fill: '#FFF8F4',
          stroke: '#171114',
          strokeWidth: '1.5',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M9 8.4c1.4-1.8 3.6-1.8 5 0',
          fill: 'none',
          stroke: '#171114',
          strokeWidth: '1.2',
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M26 8.4c1.4-1.8 3.6-1.8 5 0',
          fill: 'none',
          stroke: '#171114',
          strokeWidth: '1.2',
          strokeLinecap: 'round',
        }),
        h('circle', { cx: '20', cy: '8', r: '1.15', fill: '#D81E36' })
      );
    }

    function LadybugShellArt() {
      return h(
        'svg',
        {
          className: 'mlb-shell',
          viewBox: '0 0 190 190',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('ellipse', {
          cx: '95',
          cy: '106',
          rx: '75',
          ry: '70',
          fill: '#D81E36',
          stroke: '#171114',
          strokeWidth: '2.6',
        }),
        h('path', {
          d: 'M95 36v140',
          fill: 'none',
          stroke: '#171114',
          strokeWidth: '2.6',
        }),
        h(
          'g',
          { fill: '#171114' },
          h('circle', { cx: '52', cy: '48', r: '7' }),
          h('circle', { cx: '138', cy: '48', r: '7' }),
          h('circle', { cx: '40', cy: '78', r: '6.2' }),
          h('circle', { cx: '150', cy: '78', r: '6.2' }),
          h('circle', { cx: '45', cy: '140', r: '5.6' }),
          h('circle', { cx: '145', cy: '140', r: '5.6' }),
          h('circle', { cx: '70', cy: '172', r: '5' }),
          h('circle', { cx: '120', cy: '172', r: '5' })
        ),
        h('path', {
          d: 'M54 56c9-14 24-22 38-25M136 56c-9-14-24-22-38-25',
          fill: 'none',
          stroke: '#FF9AA2',
          strokeWidth: '4',
          strokeLinecap: 'round',
          opacity: '0.45',
        }),
        h('path', {
          d: 'M76 40C64 26 58 16 54 8M114 40c12-14 18-24 22-32',
          fill: 'none',
          stroke: '#171114',
          strokeWidth: '3.4',
          strokeLinecap: 'round',
        }),
        h('circle', { cx: '53', cy: '7', r: '5', fill: '#171114' }),
        h('circle', { cx: '137', cy: '7', r: '5', fill: '#171114' }),
        h('ellipse', { cx: '95', cy: '40', rx: '19', ry: '15.5', fill: '#171114' }),
        h('circle', { cx: '88', cy: '39', r: '4.6', fill: '#FFF8F4' }),
        h('circle', { cx: '102', cy: '39', r: '4.6', fill: '#FFF8F4' }),
        h('circle', { cx: '88', cy: '39', r: '1.7', fill: '#171114' }),
        h('circle', { cx: '102', cy: '39', r: '1.7', fill: '#171114' })
      );
    }

    function YoyoIcon() {
      return h(
        'svg',
        {
          className: 'mlb-yoyo-icon',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M12 4c2.8-2.2 6.4-1.4 8.2.6',
          fill: 'none',
          stroke: '#171114',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
        }),
        h('circle', { cx: '9.7', cy: '13.4', r: '5.5', fill: '#D81E36', stroke: '#171114', strokeWidth: '1.6' }),
        h('circle', { cx: '14.3', cy: '13.4', r: '5.5', fill: '#D81E36', stroke: '#171114', strokeWidth: '1.6' }),
        h('ellipse', { cx: '12', cy: '13.4', rx: '3', ry: '5.2', fill: '#B3122A', stroke: '#171114', strokeWidth: '1.3' }),
        h('circle', { cx: '12', cy: '13.4', r: '1.4', fill: '#171114' }),
        h('path', {
          d: 'M7.6 10.5c1.1-1.5 2.7-2.2 4.2-2.2',
          fill: 'none',
          stroke: '#FFB1B9',
          strokeWidth: '1.4',
          strokeLinecap: 'round',
          opacity: '0.8',
        })
      );
    }

    function ResetIcon() {
      return h(
        'svg',
        {
          className: 'mlb-reset-icon',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.2v5h5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '1.8',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        })
      );
    }

    function SoundIcon({ muted }) {
      return h(
        'svg',
        {
          className: 'mlb-sound-icon',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M4 9v6h4l5 4V5L8 9H4z',
          fill: 'currentColor',
        }),
        muted
          ? h('path', {
            d: 'M16 9l5 6M21 9l-5 6',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1.8',
            strokeLinecap: 'round',
          })
          : h('path', {
            d: 'M16 8.4a4.8 4.8 0 0 1 0 7.2M18.6 5.8a8.2 8.2 0 0 1 0 12.4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1.7',
            strokeLinecap: 'round',
          })
      );
    }

    function ExpandIcon() {
      return h(
        'svg',
        {
          className: 'mlb-expand-svg',
          viewBox: '0 0 16 16',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M6 2H2v4M10 14h4v-4M2 2l5 5M14 14l-5-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        })
      );
    }

    function CollapseIcon() {
      return h(
        'svg',
        {
          className: 'mlb-expand-svg',
          viewBox: '0 0 16 16',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M9 7h5V2M7 9H2v5M14 2 9 7M2 14l5-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        })
      );
    }

    function FocusTimer({ t }) {
      const tr = translator(t);
      const { phase, remaining, flash, expanded } = useTimerStore();
      const timeText = formatTime(remaining);
      const stateLabel =
        phase === 'running'
          ? tr('timer.pause')
          : phase === 'paused'
            ? tr('timer.resume')
            : phase === 'done'
              ? tr('timer.done')
              : tr('timer.start');
      const remainingText = tr('timer.remaining').replace('{time}', timeText);
      const ariaLabel = phase === 'done' ? tr('timer.done') : `${stateLabel} · ${remainingText}`;
      const title = `${ariaLabel} · ${tr('timer.hint')}`;
      const visibleText = flash ? tr(flash) : phase === 'done' ? tr('timer.done') : timeText;
      const announcement =
        phase === 'running'
          ? remaining === FOCUS_SECONDS
            ? tr('timer.announce.start')
            : tr('timer.announce.resume')
          : phase === 'paused'
            ? tr('timer.announce.pause')
            : phase === 'done'
              ? tr('timer.announce.done')
              : flash === 'timer.resetFlash'
                ? tr('timer.announce.reset')
                : '';

      function handleClick(event) {
        if (event && event.detail > 1) return;
        timerStore.toggle();
      }

      function reset(event) {
        if (event) event.stopPropagation();
        timerStore.reset();
      }

      return h(
        'span',
        { className: 'mlb-control' },
        h(
          'button',
          {
            type: 'button',
            className: 'mlb-timer',
            'data-ladybug-yoyo-pomodoro': '',
            'data-phase': phase,
            'aria-label': ariaLabel,
            title,
            onClick: handleClick,
            onDoubleClick: reset,
          },
          h('span', { className: 'mlb-art', 'aria-hidden': 'true' }, h(LadybugArt)),
          h('span', { className: 'mlb-time', 'aria-hidden': 'true' }, visibleText),
          h('span', { className: 'mlb-sr', 'aria-live': 'polite' }, announcement)
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'mlb-expand',
            'data-expanded': expanded ? 'true' : 'false',
            'aria-expanded': expanded,
            'aria-label': tr(expanded ? 'widget.collapse' : 'widget.expand'),
            title: tr(expanded ? 'widget.collapse' : 'widget.expand'),
            onClick: () => timerStore.toggleExpanded(),
            onPointerDown: (event) => event.stopPropagation(),
          },
          h(expanded ? CollapseIcon : ExpandIcon)
        )
      );
    }

    function FocusWidget({ t }) {
      const state = useTimerStore();
      if (!state.expanded) return null;
      return h(FocusWidgetRound, { t, state });
    }

    function FocusWidgetRound({ t, state }) {
      const tr = translator(t);
      const rootRef = React.useRef(null);
      const dragRef = React.useRef(null);
      const resizeRef = React.useRef(null);
      const posRef = React.useRef(null);
      const sizeRef = React.useRef(WIDGET_SIZE);
      const lidTimerRef = React.useRef(null);
      const initialPrefsRef = React.useRef(null);
      if (!initialPrefsRef.current) initialPrefsRef.current = readWidgetPrefs();
      const initialPrefs = initialPrefsRef.current;
      const [pos, setPos] = React.useState(() => {
        const next = initialPrefs.pos || defaultWidgetPosition(initialPrefs.size);
        posRef.current = next;
        return next;
      });
      const [size, setSize] = React.useState(() => {
        sizeRef.current = initialPrefs.size;
        return initialPrefs.size;
      });
      const [dragging, setDragging] = React.useState(false);
      const [resizing, setResizing] = React.useState(false);
      const [lidOpen, setLidOpen] = React.useState(false);
      const [infoOpen, setInfoOpen] = React.useState(false);
      const [soundOn, setSoundOn] = React.useState(() => chime.isEnabled());

      React.useEffect(() => {
        lidTimerRef.current = window.setTimeout(() => setLidOpen(true), 40);
        return () => {
          if (lidTimerRef.current) window.clearTimeout(lidTimerRef.current);
        };
      }, []);

      React.useEffect(() => {
        if (!lidOpen) setInfoOpen(false);
      }, [lidOpen]);

      React.useEffect(() => {
        function clamp() {
          const el = rootRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const next = clampPosition(posRef.current.x, posRef.current.y, rect.width, rect.height);
          if (next.x !== posRef.current.x || next.y !== posRef.current.y) {
            posRef.current = next;
            setPos(next);
            writeWidgetPrefs({ pos: next });
          }
        }
        clamp();
        window.addEventListener('resize', clamp);
        return () => window.removeEventListener('resize', clamp);
      }, []);

      React.useEffect(() => {
        function onKeyDown(event) {
          if (event.key === 'Escape') timerStore.toggleExpanded();
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
      }, []);

      function applyPosition(x, y) {
        const el = rootRef.current;
        const rect = el ? el.getBoundingClientRect() : null;
        const next = clampPosition(x, y, rect ? rect.width : 240, rect ? rect.height : 240);
        posRef.current = next;
        setPos(next);
        return next;
      }

      function toggleLid() {
        setLidOpen((value) => !value);
      }

      function toggleInfo() {
        setInfoOpen((value) => !value);
      }

      function toggleSound(event) {
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
        setSoundOn(chime.toggle());
      }

      function beginDrag(event) {
        if (event.button !== undefined && event.button !== 0) return;
        const target = event.target;
        if (target && typeof target.closest === 'function' && target.closest('.mlb-string, .mlb-round-primary, .mlb-round-reset, .mlb-round-info, .mlb-round-sound, .mlb-round-credit, .mlb-resize')) return;
        const el = rootRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        const radius = rect.width / 2;
        if (distance > radius - 22 && distance < radius + 12) {
          beginResize(event);
          return;
        }
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: rect.left,
          originY: rect.top,
          width: rect.width,
          height: rect.height,
          moved: false,
        };
        setDragging(true);
        if (event.currentTarget.setPointerCapture) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        applyPosition(rect.left, rect.top);
      }

      function moveDrag(event) {
        const drag = dragRef.current;
        if (!drag) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        drag.moved = true;
        applyPosition(drag.originX + dx, drag.originY + dy);
      }

      function endDrag(event) {
        const drag = dragRef.current;
        if (!drag) return;
        dragRef.current = null;
        setDragging(false);
        if (event.currentTarget.releasePointerCapture) {
          try {
            event.currentTarget.releasePointerCapture(drag.pointerId);
          } catch (error) {
            /* capture may already be released */
          }
        }
        if (!drag.moved) {
          toggleLid();
          return;
        }
        writeWidgetPrefs({ pos: posRef.current });
      }

      function beginResize(event) {
        event.stopPropagation();
        if (event.button !== undefined && event.button !== 0) return;
        const el = rootRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        resizeRef.current = {
          pointerId: event.pointerId,
          startDist: Math.hypot(event.clientX - centerX, event.clientY - centerY),
          centerX,
          centerY,
          startSize: sizeRef.current,
          moved: false,
        };
        setResizing(true);
        if (event.currentTarget.setPointerCapture) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }

      function moveResize(event) {
        const resize = resizeRef.current;
        if (!resize) return;
        const distance = Math.hypot(event.clientX - resize.centerX, event.clientY - resize.centerY);
        const delta = distance - resize.startDist;
        if (!resize.moved && Math.abs(delta) < 4) return;
        resize.moved = true;
        const next = Math.max(WIDGET_MIN_SIZE, Math.min(WIDGET_MAX_SIZE, Math.round(resize.startSize + delta * 2)));
        if (next !== sizeRef.current) {
          sizeRef.current = next;
          setSize(next);
        }
        const clamped = clampPosition(
          resize.centerX - next / 2,
          resize.centerY - next / 2,
          next,
          next
        );
        posRef.current = clamped;
        setPos(clamped);
      }

      function endResize(event) {
        const resize = resizeRef.current;
        if (!resize) return;
        resizeRef.current = null;
        setResizing(false);
        if (event.currentTarget.releasePointerCapture) {
          try {
            event.currentTarget.releasePointerCapture(resize.pointerId);
          } catch (error) {
            /* capture may already be released */
          }
        }
        if (!resize.moved) {
          toggleLid();
          return;
        }
        writeWidgetPrefs({ size: sizeRef.current, pos: posRef.current });
      }

      function onRoundKeyDown(event) {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleLid();
        }
      }

      function toggleTimer() {
        timerStore.toggle();
      }

      const phase = state.phase;
      const progress = Math.max(0, Math.min(1, 1 - state.remaining / FOCUS_SECONDS));
      const timeText = formatTime(state.remaining);
      const actionLabel = phase === 'running'
        ? tr('widget.pause')
        : phase === 'paused'
          ? tr('widget.resume')
          : phase === 'done'
            ? tr('widget.again')
            : tr('widget.start');
      const phaseLabel = tr('phase.' + phase);
      const circumference = 2 * Math.PI * 82;

      return h(
        'div',
        {
          ref: rootRef,
          className: 'mlb-round' + (dragging ? ' is-dragging' : ''),
          role: 'dialog',
          tabIndex: 0,
          'aria-modal': 'false',
          'aria-label': tr('widget.title'),
          'data-surface': 'glass',
          'data-phase': phase,
          'data-lid': lidOpen ? 'open' : 'closed',
          'data-resizing': resizing ? 'true' : 'false',
          style: { left: pos.x, top: pos.y, width: size, height: size },
          onKeyDown: onRoundKeyDown,
        },
        h(
          'div',
          {
            className: 'mlb-yoyo' + (lidOpen ? ' is-open' : '') + (dragging ? ' is-dragging' : ''),
            style: { transform: 'scale(' + (size / WIDGET_SIZE) + ')', transformOrigin: '0 0' },
            onPointerDown: beginDrag,
            onPointerMove: (event) => { moveDrag(event); moveResize(event); },
            onPointerUp: (event) => { endDrag(event); endResize(event); },
            onPointerCancel: (event) => { endDrag(event); endResize(event); },
            title: tr('widget.drag'),
          },
          h(
            'div',
            { className: 'mlb-round-inner' },
            h('div', { className: 'mlb-round-glass', 'aria-hidden': 'true' }),
            h(
              'svg',
              { className: 'mlb-round-face', viewBox: '0 0 240 240', 'aria-hidden': 'true' },
              h('circle', { cx: 120, cy: 120, r: 118, fill: 'rgba(255, 255, 255, .3)' }),
              h('circle', { cx: 120, cy: 120, r: 115.5, fill: 'none', stroke: '#D81E36', strokeWidth: 5 })
            ),
            h(
              'svg',
              { className: 'mlb-round-ring', viewBox: '0 0 180 180', 'aria-hidden': 'true' },
              h('circle', {
                cx: 90, cy: 90, r: 82, fill: 'none',
                stroke: '#F1D2D5', strokeWidth: 5,
              }),
              h('circle', {
                cx: 90, cy: 90, r: 82, fill: 'none',
                stroke: '#D81E36', strokeWidth: 5, strokeLinecap: 'round',
                strokeDasharray: `${circumference} ${circumference}`,
                strokeDashoffset: `${circumference * (1 - progress)}`,
                transform: 'rotate(-90 90 90)',
              })
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'mlb-round-info',
                'aria-expanded': infoOpen ? 'true' : 'false',
                'aria-label': tr('widget.info'),
                title: tr('widget.info'),
                onPointerDown: (event) => event.stopPropagation(),
                onClick: (event) => { event.stopPropagation(); toggleInfo(); },
              },
              h('span', { className: 'mlb-round-info-mark', 'aria-hidden': 'true' }, 'i')
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'mlb-round-sound' + (soundOn ? '' : ' is-muted'),
                'aria-pressed': soundOn ? 'false' : 'true',
                'aria-label': soundOn ? tr('widget.mute') : tr('widget.unmute'),
                title: soundOn ? tr('widget.mute') : tr('widget.unmute'),
                onPointerDown: (event) => event.stopPropagation(),
                onClick: toggleSound,
              },
              h(SoundIcon, { muted: !soundOn })
            ),
            h(
              'div',
              { className: 'mlb-round-readout', 'aria-hidden': 'true' },
              h('span', { className: 'mlb-round-time' }, timeText),
              h('span', { className: 'mlb-round-state' }, state.flash ? tr(state.flash) : phaseLabel)
            ),
            h(
              'div',
              { className: 'mlb-round-actions' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'mlb-round-primary',
                  onPointerDown: (event) => event.stopPropagation(),
                  onClick: (event) => { event.stopPropagation(); toggleTimer(); },
                  'aria-label': tr('widget.start') + ' / ' + tr('widget.pause'),
                },
                actionLabel
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'mlb-round-reset',
                  onPointerDown: (event) => event.stopPropagation(),
                  onClick: (event) => { event.stopPropagation(); timerStore.reset(); },
                  'aria-label': tr('widget.reset'),
                  title: tr('widget.reset'),
                },
                h(ResetIcon)
              )
            )
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'mlb-string',
              'aria-label': tr('widget.collapse'),
              title: tr('widget.collapse'),
              onPointerDown: (event) => event.stopPropagation(),
              onClick: (event) => { event.stopPropagation(); timerStore.toggleExpanded(); },
            },
            h(
              'span',
              { className: 'mlb-string-loop', 'aria-hidden': 'true' },
              h('span', { className: 'mlb-string-icon' }, h(CollapseIcon))
            ),
            h('span', { className: 'mlb-string-thread', 'aria-hidden': 'true' })
          ),
          h(
            'svg',
            { className: 'mlb-shell', viewBox: '0 0 240 240', 'aria-hidden': 'true' },
            h(
              'defs',
              null,
              h('clipPath', { id: 'mlb-shell-left' }, h('path', { d: 'M120 3 A117 117 0 0 0 120 237 Z' })),
              h('clipPath', { id: 'mlb-shell-right' }, h('path', { d: 'M120 3 A117 117 0 0 1 120 237 Z' }))
            ),
            h(
              'g',
              { className: 'mlb-shell-half mlb-shell-half-left', clipPath: 'url(#mlb-shell-left)' },
              h('circle', { cx: 120, cy: 120, r: 117, fill: '#D81E36', stroke: '#B3122A', strokeWidth: 2 }),
              h('ellipse', { cx: 72, cy: 55, rx: 16, ry: 9, fill: 'rgba(255, 255, 255, .28)', transform: 'rotate(-28 72 55)' }),
              h('circle', { cx: 53, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 120, cy: 120, r: 30, fill: '#171114' }),
              h('circle', { cx: 53, cy: 178, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 178, r: 27, fill: '#171114' })
            ),
            h(
              'g',
              { className: 'mlb-shell-half mlb-shell-half-right', clipPath: 'url(#mlb-shell-right)' },
              h('circle', { cx: 120, cy: 120, r: 117, fill: '#D81E36', stroke: '#B3122A', strokeWidth: 2 }),
              h('ellipse', { cx: 72, cy: 55, rx: 16, ry: 9, fill: 'rgba(255, 255, 255, .28)', transform: 'rotate(-28 72 55)' }),
              h('circle', { cx: 53, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 120, cy: 120, r: 30, fill: '#171114' }),
              h('circle', { cx: 53, cy: 178, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 178, r: 27, fill: '#171114' })
            ),
            h(
              'g',
              { className: 'mlb-closed', 'aria-hidden': 'true' },
              h('circle', { cx: 120, cy: 120, r: 117, fill: '#D81E36', stroke: '#B3122A', strokeWidth: 2 }),
              h('ellipse', { cx: 72, cy: 55, rx: 16, ry: 9, fill: 'rgba(255, 255, 255, .28)', transform: 'rotate(-28 72 55)' }),
              h('circle', { cx: 53, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 62, r: 27, fill: '#171114' }),
              h('circle', { cx: 120, cy: 120, r: 30, fill: '#171114' }),
              h('circle', { cx: 53, cy: 178, r: 27, fill: '#171114' }),
              h('circle', { cx: 187, cy: 178, r: 27, fill: '#171114' })
            )
          )
        ),
        infoOpen
          ? h(
            'div',
            { className: 'mlb-round-info-panel', role: 'dialog', 'aria-label': tr('widget.info') },
            h('strong', null, tr('widget.infoTitle')),
            h('p', null, tr('widget.credit'))
          )
          : null
      );
    }

    const STYLE_TEXT = `
      .mlb-control {
        display: inline-flex;
        align-items: center;
        gap: 1px;
      }
      .mlb-timer {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 22px;
        padding: 1px 7px;
        border: 0;
        border-radius: var(--dsw-radius-sm);
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-family: inherit;
        font-size: 12px;
        line-height: 20px;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        cursor: pointer;
        transition: background-color 140ms ease, color 140ms ease, opacity 140ms ease;
      }
      .mlb-timer:hover {
        background: var(--dsw-alias-interactive-bg-hover);
        color: var(--dsw-alias-label-primary);
      }
      .mlb-timer:focus-visible,
      .mlb-expand:focus-visible,
      .mlb-widget button:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
      }
      .mlb-timer:active .mlb-art { transform: scale(.92); }
      .mlb-art {
        display: inline-flex;
        width: 18px;
        height: 18px;
        transition: opacity 160ms ease, transform 120ms ease, filter 160ms ease;
      }
      .mlb-svg { display: block; width: 18px; height: 18px; }
      .mlb-time {
        min-width: 34px;
        text-align: right;
        font-weight: 500;
        letter-spacing: .2px;
      }
      .mlb-sr {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }
      .mlb-timer[data-phase='running'] {
        color: var(--dsw-alias-brand-primary);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);
      }
      .mlb-timer[data-phase='running'] .mlb-art {
        animation: mlb-focus-pulse 2.4s ease-in-out infinite;
      }
      .mlb-timer[data-phase='paused'] { opacity: .78; }
      .mlb-timer[data-phase='done'] {
        color: var(--dsw-alias-brand-primary);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);
        font-weight: 600;
      }
      .mlb-expand {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 22px;
        padding: 0;
        border: 0;
        border-radius: var(--dsw-radius-sm);
        background: transparent;
        color: var(--dsw-alias-label-tertiary);
        cursor: pointer;
        opacity: .65;
        transition: background-color 140ms ease, color 140ms ease, opacity 140ms ease;
      }
      .mlb-expand:hover {
        background: var(--dsw-alias-interactive-bg-hover);
        color: var(--dsw-alias-label-primary);
        opacity: 1;
      }
      .mlb-expand[data-expanded='true'] {
        color: var(--dsw-alias-brand-primary);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);
        opacity: 1;
      }
      .mlb-expand-svg { display: block; width: 12px; height: 12px; }
      .mlb-widget {
        --mlb-red: #D81E36;
        --mlb-red-deep: #B3122A;
        --mlb-ink: #171114;
        --mlb-paper: #FFF8F4;
        --mlb-paper-2: #FFEDE9;
        --mlb-rose: #F1D2D5;
        position: fixed;
        z-index: 60;
        width: min(336px, calc(100vw - 24px));
        padding: 0 0 10px;
        border: 2px solid var(--mlb-ink);
        border-radius: 22px;
        background:
          radial-gradient(circle at 6% 78%, rgba(216, 30, 54, .1) 0 7px, transparent 8px),
          radial-gradient(circle at 94% 28%, rgba(216, 30, 54, .08) 0 10px, transparent 11px),
          var(--mlb-paper);
        box-shadow:
          0 0 0 5px rgba(216, 30, 54, .12),
          0 26px 60px rgba(23, 17, 20, .35);
        color: var(--mlb-ink);
        pointer-events: auto;
        overflow: hidden;
      }
      .mlb-widget * { box-sizing: border-box; }
      .mlb-widget-head {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 13px 11px;
        border-bottom: 2px solid var(--mlb-ink);
        background:
          radial-gradient(circle at 11% 24%, #171114 0 5px, transparent 6px),
          radial-gradient(circle at 82% 16%, #171114 0 4px, transparent 5px),
          radial-gradient(circle at 93% 80%, #171114 0 6px, transparent 7px),
          radial-gradient(circle at 28% 90%, #171114 0 3px, transparent 4px),
          linear-gradient(135deg, #E43A4D, #D81E36 56%, #B80F27);
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .mlb-widget-head.is-dragging { cursor: grabbing; }
      .mlb-widget-orb {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        flex: none;
        border: 2px solid var(--mlb-ink);
        border-radius: 50%;
        background: var(--mlb-paper);
        box-shadow: 0 0 0 2px rgba(255, 248, 244, .42);
      }
      .mlb-widget-orb .mlb-svg { width: 26px; height: 26px; }
      .mlb-widget-heading {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        flex: 1;
      }
      .mlb-widget-kicker {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #FFE7E2;
        font-size: 7.5px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: .18em;
      }
      .mlb-widget-kicker-text { white-space: nowrap; }
      .mlb-mask-icon {
        display: block;
        width: 15px;
        height: 6px;
        flex: none;
      }
      .mlb-widget-title {
        font-size: 15px;
        line-height: 1.15;
        letter-spacing: .2px;
        color: #FFF8F4;
        text-shadow: 0 1px 0 rgba(0, 0, 0, .25);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mlb-widget-phase {
        font-size: 10.5px;
        line-height: 1.2;
        color: #FFD8D4;
      }
      .mlb-widget-grip {
        display: grid;
        grid-template-columns: repeat(2, 3px);
        gap: 2px;
        flex: none;
        opacity: .6;
      }
      .mlb-widget-grip i {
        display: block;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #FFF8F4;
      }
      .mlb-widget-collapse {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        flex: none;
        border: 1px solid rgba(255, 248, 244, .32);
        border-radius: 50%;
        background: rgba(23, 17, 20, .14);
        color: #FFF8F4;
        cursor: pointer;
      }
      .mlb-widget-collapse:hover {
        background: rgba(23, 17, 20, .35);
        color: #FFF8F4;
      }
      .mlb-widget-body {
        display: flex;
        justify-content: center;
        padding: 12px 10px 4px;
      }
      .mlb-widget-ring {
        position: relative;
        width: 190px;
        height: 190px;
      }
      .mlb-shell {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: block;
        width: 190px;
        height: 190px;
        pointer-events: none;
      }
      .mlb-widget[data-phase='running'] .mlb-shell {
        animation: mlb-shell-breathe 4s ease-in-out infinite;
        transform-origin: 50% 50%;
      }
      .mlb-ring {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: block;
        width: 190px;
        height: 190px;
        pointer-events: none;
      }
      .mlb-widget-face {
        position: absolute;
        left: 45px;
        top: 58px;
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100px;
        height: 100px;
        padding: 10px;
        border: 2px solid var(--mlb-ink);
        border-radius: 50%;
        background: var(--mlb-paper);
        text-align: center;
        box-shadow:
          inset 0 0 0 5px rgba(216, 30, 54, .07),
          0 3px 0 rgba(23, 17, 20, .12);
      }
      .mlb-widget-time {
        max-width: 86px;
        font-size: 30px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -.6px;
        font-variant-numeric: tabular-nums;
      }
      .mlb-widget[data-flash='true'] .mlb-widget-time {
        max-width: 84px;
        color: var(--mlb-red);
        font-size: 12.5px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: 0;
      }
      .mlb-widget-state {
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: var(--mlb-red);
      }
      .mlb-widget-actions {
        display: flex;
        gap: 9px;
        padding: 8px 14px 0;
      }
      .mlb-widget-primary {
        flex: 1;
        height: 42px;
        border: 2px solid var(--mlb-ink);
        border-radius: 13px;
        background-color: var(--mlb-red);
        background-image:
          radial-gradient(circle at 15% 28%, rgba(23, 17, 20, .28) 0 3px, transparent 4px),
          radial-gradient(circle at 82% 22%, rgba(23, 17, 20, .22) 0 2.5px, transparent 3.5px),
          radial-gradient(circle at 68% 78%, rgba(23, 17, 20, .25) 0 3.5px, transparent 4.5px),
          radial-gradient(circle at 34% 82%, rgba(23, 17, 20, .18) 0 2px, transparent 3px);
        color: #FFF8F4;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .2px;
        cursor: pointer;
        box-shadow:
          0 3px 0 #8E0E21,
          0 8px 16px rgba(216, 30, 54, .22);
      }
      .mlb-widget-primary:hover { filter: brightness(1.06); }
      .mlb-widget-primary:active {
        transform: translateY(2px);
        box-shadow: 0 1px 0 #8E0E21;
      }
      .mlb-widget-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        min-width: 86px;
        height: 42px;
        padding: 0 12px;
        border: 2px solid var(--mlb-ink);
        border-radius: 13px;
        background: var(--mlb-paper);
        color: var(--mlb-ink);
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 2px 0 rgba(23, 17, 20, .18);
      }
      .mlb-yoyo-icon {
        display: block;
        width: 18px;
        height: 18px;
        flex: none;
      }
      .mlb-widget-secondary:hover {
        background: #FBE3E6;
      }
      .mlb-widget-secondary:active {
        transform: translateY(1px);
        box-shadow: none;
      }
      .mlb-widget-hint {
        margin: 10px 16px 0;
        padding-top: 8px;
        border-top: 1px dashed rgba(23, 17, 20, .22);
        color: #7A5A5F;
        font-size: 10px;
        line-height: 1.35;
        text-align: center;
      }
      @keyframes mlb-shell-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.015); }
      }
      @keyframes mlb-focus-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      /* Restrained card built around the show still, not fan-drawn spots. */
      .mlb-widget {
        width: min(312px, calc(100vw - 24px));
        padding: 0 0 4px;
        border: 1px solid rgba(255, 255, 255, .55);
        border-radius: 34px 34px 40px 40px;
        box-shadow:
          0 18px 48px rgba(29, 17, 19, .18),
          0 2px 6px rgba(29, 17, 19, .06),
          inset 0 1px 0 rgba(255, 255, 255, .8);
        color: #1D1113;
      }
      .mlb-widget[data-surface='glass'] {
        background:
          conic-gradient(
            from 215deg at 30% 18%,
            rgba(255, 214, 229, .28),
            rgba(211, 231, 255, .24) 22%,
            rgba(255, 247, 214, .2) 44%,
            rgba(255, 212, 230, .26) 68%,
            rgba(255, 214, 229, .28)
          ),
          radial-gradient(90% 65% at 12% 0%, rgba(255, 214, 226, .46), transparent 62%),
          radial-gradient(75% 55% at 92% 18%, rgba(211, 225, 255, .42), transparent 66%),
          linear-gradient(
            135deg,
            rgba(255, 255, 255, .72) 0%,
            rgba(255, 246, 250, .58) 36%,
            rgba(238, 247, 255, .56) 68%,
            rgba(255, 251, 246, .7) 100%
          );
        -webkit-backdrop-filter: blur(24px) saturate(150%);
        backdrop-filter: blur(24px) saturate(150%);
      }
      .mlb-widget[data-surface='solid'] {
        border-color: #E6C9CE;
        background:
          linear-gradient(135deg, #FFFDFB 0%, #FFF8F4 52%, #FFFDFB 100%);
      }
      .mlb-widget-head {
        position: relative;
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 132px;
        padding: 0;
        overflow: hidden;
        border-bottom: 1px solid #E6C9CE;
        border-radius: 34px 34px 0 0;
        background: #171114;
      }
      .mlb-widget-head::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(10, 5, 7, .1) 0%,
          rgba(10, 5, 7, .04) 36%,
          rgba(10, 5, 7, .76) 100%
        );
        pointer-events: none;
      }
      .mlb-widget-still {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 34%;
        pointer-events: none;
        user-select: none;
      }
      .mlb-widget-heading {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        flex: 1;
        padding: 0 0 13px 14px;
      }
      .mlb-widget-title {
        font-size: 15px;
        font-weight: 800;
        letter-spacing: .1px;
        color: #FFF8F4;
        text-shadow: 0 1px 6px rgba(20, 8, 10, .65);
      }
      .mlb-widget-phase {
        color: rgba(255, 248, 244, .82);
        font-size: 10.5px;
        text-shadow: 0 1px 4px rgba(20, 8, 10, .65);
      }
      .mlb-widget-grip {
        position: relative;
        z-index: 1;
        align-self: flex-start;
        margin: 12px 0 0 auto;
        opacity: .45;
      }
      .mlb-widget-grip i { background: #FFF8F4; }
      .mlb-surface-toggle {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        flex: none;
        align-self: flex-start;
        height: 24px;
        margin: 10px 6px 0 0;
        padding: 0 7px;
        border: 1px solid rgba(255, 248, 244, .32);
        border-radius: 999px;
        background: rgba(23, 17, 20, .3);
        color: #FFF8F4;
        font-family: inherit;
        font-size: 9px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
      }
      .mlb-surface-toggle:hover {
        background: rgba(23, 17, 20, .52);
      }
      .mlb-surface-toggle:focus-visible {
        outline: 2px solid #FFF8F4;
        outline-offset: 2px;
      }
      .mlb-surface-swatch {
        width: 9px;
        height: 9px;
        flex: none;
        border: 1px solid #FFF8F4;
        border-radius: 50%;
        background: #FFFDFB;
      }
      .mlb-surface-toggle[data-mode='glass'] .mlb-surface-swatch {
        background: linear-gradient(135deg, rgba(255, 255, 255, .95), rgba(196, 222, 255, .8));
        box-shadow: inset 0 0 0 1px rgba(23, 17, 20, .18);
      }
      .mlb-widget-collapse {
        position: relative;
        z-index: 1;
        align-self: flex-start;
        width: 26px;
        height: 26px;
        flex: none;
        margin: 10px 12px 0 0;
        border: 1px solid rgba(255, 248, 244, .3);
        background: rgba(23, 17, 20, .28);
        color: #FFF8F4;
      }
      .mlb-widget-collapse:hover {
        background: rgba(23, 17, 20, .5);
        color: #FFF8F4;
      }
      .mlb-widget-body {
        padding: 18px 12px 6px;
      }
      .mlb-widget-readout {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        margin-top: 10px;
        text-align: center;
      }
      .mlb-widget-ring {
        position: relative;
        box-sizing: border-box;
        width: 176px;
        height: 176px;
        border: 2px solid #B3122A;
        border-radius: 50%;
        background:
          radial-gradient(circle at 29% 28%, rgba(255, 255, 255, .92) 0 2.2%, transparent 3.2%),
          radial-gradient(circle at 65% 28%, rgba(255, 255, 255, .72) 0 1.8%, transparent 2.8%),
          radial-gradient(circle at 47% 46%, rgba(255, 255, 255, .86) 0 2.2%, transparent 3.2%),
          radial-gradient(circle at 29% 66%, rgba(255, 255, 255, .7) 0 1.8%, transparent 2.8%),
          radial-gradient(circle at 65% 66%, rgba(255, 255, 255, .82) 0 2.2%, transparent 3.2%),
          radial-gradient(circle at 32% 31%, #171114 0 9.2%, transparent 10.2%),
          radial-gradient(circle at 68% 31%, #171114 0 9.2%, transparent 10.2%),
          radial-gradient(circle at 50% 50%, #171114 0 11.5%, transparent 12.5%),
          radial-gradient(circle at 32% 69%, #171114 0 9.2%, transparent 10.2%),
          radial-gradient(circle at 68% 69%, #171114 0 9.2%, transparent 10.2%),
          radial-gradient(circle at 38% 28%, #FF6E7D 0%, #F23A4D 22%, #D81E36 58%, #B3122A 100%);
        box-shadow:
          inset 0 9px 18px rgba(255, 255, 255, .18),
          inset 0 -14px 24px rgba(80, 0, 12, .2),
          0 10px 20px rgba(23, 17, 20, .18);
        isolation: isolate;
      }
      .mlb-widget-ring::before {
        content: '';
        position: absolute;
        inset: 7px;
        z-index: 1;
        border: 1px solid rgba(255, 248, 244, .28);
        border-radius: 50%;
        box-shadow: inset 0 2px 6px rgba(255, 255, 255, .12);
        pointer-events: none;
      }
      .mlb-yoyo-string {
        position: absolute;
        z-index: 4;
        left: 50%;
        top: -16px;
        width: 2px;
        height: 26px;
        border-radius: 2px;
        background: #171114;
        box-shadow: 0 0 0 1px rgba(255, 248, 244, .45);
        transform: rotate(14deg);
        transform-origin: bottom center;
        pointer-events: none;
      }
      .mlb-yoyo-string::before {
        content: '';
        position: absolute;
        left: -5px;
        top: -7px;
        width: 12px;
        height: 8px;
        border: 2px solid #D81E36;
        border-radius: 50%;
        background: transparent;
        box-shadow: 0 0 0 1px #171114;
      }
      .mlb-ring {
        position: absolute;
        inset: 0;
        z-index: 2;
        width: 176px;
        height: 176px;
      }
      .mlb-widget-time {
        max-width: 100%;
        color: #1D1113;
        font-size: 34px;
        font-weight: 800;
        letter-spacing: -.8px;
        line-height: 1.05;
        font-variant-numeric: tabular-nums;
      }
      .mlb-widget[data-flash='true'] .mlb-widget-time {
        max-width: 100%;
        color: #D81E36;
        font-size: 13px;
        line-height: 1.3;
      }
      .mlb-widget-state {
        color: #8A6B70;
        font-size: 9px;
        font-weight: 500;
        letter-spacing: .12em;
      }
      .mlb-widget-actions {
        gap: 8px;
        padding: 10px 14px 0;
      }
      .mlb-widget-primary {
        height: 40px;
        border: 1px solid #B3122A;
        border-radius: 10px;
        background-image: none;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 6px 14px rgba(216, 30, 54, .2);
      }
      .mlb-widget-primary:active {
        transform: translateY(1px);
        box-shadow: 0 2px 6px rgba(216, 30, 54, .18);
      }
      .mlb-widget-secondary {
        min-width: 82px;
        height: 40px;
        padding: 0 11px;
        border: 1px solid #E6C9CE;
        border-radius: 10px;
        background: #FFFFFF;
        color: #1D1113;
        font-size: 12.5px;
        font-weight: 600;
        box-shadow: none;
      }
      .mlb-widget-secondary:hover { background: #FFF5F2; }
      .mlb-reset-icon {
        display: block;
        width: 16px;
        height: 16px;
        flex: none;
        color: #D81E36;
      }
      .mlb-widget-hint {
        margin: 10px 16px 0;
        padding-top: 8px;
        border-top: 1px solid #F0DADD;
        color: #8A6B70;
        font-size: 9.5px;
      }
      .mlb-widget-credit {
        margin: 6px 16px 10px;
        color: #8A6B70;
        font-size: 8.5px;
        font-weight: 500;
        line-height: 1.35;
        letter-spacing: .01em;
        text-align: center;
      }
      .mlb-round {
        position: fixed;
        z-index: 70;
        width: 240px;
        height: 240px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        box-shadow: none;
        pointer-events: auto;
        color: #1D1113;
        font-family: inherit;
        overflow: visible;
        outline: none;
      }
      .mlb-round:focus-visible .mlb-yoyo {
        outline: 3px solid rgba(216, 30, 54, .42);
        outline-offset: 5px;
      }
      .mlb-yoyo {
        position: absolute;
        top: 0;
        left: 0;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .mlb-yoyo.is-dragging { cursor: grabbing; }
      .mlb-yoyo.is-open { cursor: default; }
      .mlb-yoyo::before { display: none; }
      .mlb-string {
        position: absolute;
        left: 50%;
        top: -46px;
        width: 24px;
        height: 52px;
        margin-left: -12px;
        padding: 0;
        border: 0;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        z-index: 8;
        pointer-events: auto;
      }
      .mlb-string-loop {
        width: 16px;
        height: 16px;
        border: 1px solid #171114;
        border-radius: 50%;
        background: #FFFFFF;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #171114;
      }
      .mlb-string-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .mlb-string-icon .mlb-expand-svg {
        width: 9px;
        height: 9px;
      }
      .mlb-string-thread {
        width: 4px;
        height: 34px;
        margin-top: -1px;
        border: 1px solid #171114;
        border-radius: 3px;
        background: #FFFFFF;
        box-sizing: border-box;
      }
      .mlb-string:hover .mlb-string-loop {
        border-color: #D81E36;
        background: #FFF3F1;
      }
      .mlb-string:hover .mlb-string-icon { color: #D81E36; }
      .mlb-string:focus-visible {
        outline: 2px solid #D81E36;
        outline-offset: 3px;
        border-radius: 10px;
      }
      .mlb-closed {
        opacity: 0;
        transition: opacity .16s ease;
      }
      .mlb-yoyo:not(.is-open) .mlb-closed {
        opacity: 1;
        transition-delay: .66s;
      }
      .mlb-yoyo.is-open .mlb-closed {
        opacity: 0;
        transition-delay: 0s;
      }
      .mlb-yoyo::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 3;
        border: 2px solid #B3122A;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: #D81E36;
        background-image:
          radial-gradient(circle at 34% 24%, rgba(255, 255, 255, .3) 0 6px, transparent 7px),
          radial-gradient(circle at 22% 26%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 78% 26%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 50% 50%, #171114 0 27px, transparent 27.5px),
          radial-gradient(circle at 22% 74%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 78% 74%, #171114 0 24px, transparent 24.5px),
          linear-gradient(145deg, #F04A5A 0%, #D81E36 46%, #B3122A 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 240, 240, .16);
        opacity: 1;
        transition: opacity .22s ease;
        pointer-events: none;
      }
      .mlb-yoyo.is-open::after { opacity: 0; }
      .mlb-yoyo::after { display: none; }
      .mlb-shell {
        position: absolute;
        inset: 0;
        z-index: 4;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      }
      .mlb-shell-half {
        transform-box: view-box;
        transform-origin: 120px 3px;
        transition: transform .65s cubic-bezier(.22, .9, .26, 1);
        will-change: transform;
      }
      .mlb-yoyo.is-open .mlb-shell-half-left { transform: rotate(84deg); }
      .mlb-yoyo.is-open .mlb-shell-half-right { transform: rotate(-84deg); }
      .mlb-round-inner {
        position: absolute;
        inset: 0;
        z-index: 1;
        border: 0;
        background: transparent;
        border-radius: 50%;
        box-shadow: none;
        overflow: visible;
      }
      .mlb-round-face {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        filter: drop-shadow(0 8px 18px rgba(129, 30, 45, .12));
      }
      .mlb-round-glass {
        position: absolute;
        inset: 0;
        z-index: 0;
        border-radius: 50%;
        clip-path: circle(118px at 50% 50%);
        background: rgba(255, 255, 255, .34);
        backdrop-filter: blur(26px) saturate(140%);
        -webkit-backdrop-filter: blur(26px) saturate(140%);
        pointer-events: none;
        transition: opacity .22s ease;
      }
      .mlb-yoyo:not(.is-open) .mlb-round-inner { pointer-events: none; }
      .mlb-round[data-surface='glass'] .mlb-round-inner {
        background: transparent;
        border-color: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
      }
      .mlb-round-still {
        position: absolute;
        top: 9px;
        left: 50%;
        z-index: 2;
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: 50% 30%;
        border-radius: 50%;
        border: 1.5px solid #FFFFFF;
        box-shadow: 0 2px 7px rgba(90, 22, 32, .24);
        transform: translateX(-50%);
        pointer-events: none;
      }
      .mlb-round-ring {
        position: absolute;
        inset: 2px;
        z-index: 1;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        pointer-events: none;
      }
      .mlb-round-readout {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
        width: 100%;
        transform: translateY(-50%);
        pointer-events: none;
        text-align: center;
      }
      .mlb-round-time {
        color: #1D1113;
        font-size: 36px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -.02em;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 1px 0 rgba(255, 255, 255, .55);
      }
      .mlb-round[data-phase='running'] .mlb-round-time { color: #B3122A; }
      .mlb-round[data-phase='paused'] .mlb-round-time { opacity: .72; }
      .mlb-round[data-phase='done'] .mlb-round-time { color: #D81E36; }
      .mlb-round-state {
        color: #D81E36;
        font-size: 9px;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: .05em;
      }
      .mlb-round-actions {
        position: absolute;
        bottom: 15px;
        left: 50%;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 6px;
        transform: translateX(-50%);
      }
      .mlb-round-primary {
        min-width: 68px;
        height: 25px;
        padding: 0 10px;
        border: 1px solid #B3122A;
        border-radius: 13px;
        background: #D81E36;
        color: #FFF8F4;
        font-family: inherit;
        font-size: 10px;
        font-weight: 700;
        line-height: 23px;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 2px 0 #8E0B1E, 0 4px 8px rgba(110, 12, 28, .2);
      }
      .mlb-round-primary:hover { background: #C4172E; }
      .mlb-round-primary:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-round-reset {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        padding: 0;
        border: 1px solid #E6A6B1;
        border-radius: 50%;
        background: rgba(255, 253, 251, .9);
        color: #D81E36;
        cursor: pointer;
      }
      .mlb-round-reset:hover { background: #FFF1ED; }
      .mlb-round-reset:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-round-reset svg { width: 12px; height: 12px; }
      .mlb-round-surface {
        position: absolute;
        top: 11px;
        left: 11px;
        z-index: 3;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        height: 18px;
        padding: 0 6px 0 4px;
        border: 1px solid rgba(200, 171, 176, .75);
        border-radius: 9px;
        background: rgba(255, 253, 251, .82);
        color: #6E454C;
        font-family: inherit;
        font-size: 8px;
        font-weight: 600;
        line-height: 16px;
        cursor: pointer;
      }
      .mlb-round-surface:hover { background: #FFFFFF; }
      .mlb-round-surface:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-round-surface-dot {
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #F1D2D5;
        box-shadow: inset 0 0 0 1px rgba(179, 18, 42, .22);
      }
      .mlb-round[data-surface='glass'] .mlb-round-surface-dot {
        background: linear-gradient(135deg, #FFFFFF, #E9DADD);
      }
      .mlb-lid {
        position: absolute;
        top: 0;
        width: 50%;
        height: 100%;
        z-index: 2;
        overflow: hidden;
        pointer-events: none;
        transform: rotate(0deg);
        transition: transform .65s cubic-bezier(.22, .9, .26, 1);
        backface-visibility: hidden;
        will-change: transform;
      }
      .mlb-lid-left { left: 0; transform-origin: 100% 0; }
      .mlb-lid-right { right: 0; transform-origin: 0 0; }
      .mlb-lid-skin {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #B3122A;
        border-radius: 120px 0 0 120px;
        box-sizing: border-box;
        background-color: #D81E36;
        background-size: 240px 240px;
        background-repeat: no-repeat;
        background-position: left top;
        background-image:
          radial-gradient(circle at 34% 24%, rgba(255, 255, 255, .3) 0 6px, transparent 7px),
          radial-gradient(circle at 22% 26%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 78% 26%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 50% 50%, #171114 0 27px, transparent 27.5px),
          radial-gradient(circle at 22% 74%, #171114 0 24px, transparent 24.5px),
          radial-gradient(circle at 78% 74%, #171114 0 24px, transparent 24.5px),
          linear-gradient(145deg, #F04A5A 0%, #D81E36 46%, #B3122A 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 240, 240, .16);
      }
      .mlb-lid-right .mlb-lid-skin {
        left: auto;
        right: 0;
        border-radius: 0 120px 120px 0;
        background-position: right top;
      }
      .mlb-yoyo.is-open .mlb-lid-left { transform: rotate(84deg); }
      .mlb-yoyo.is-open .mlb-lid-right { transform: rotate(-84deg); }
      .mlb-round-close {
        position: absolute;
        top: -8px;
        right: -8px;
        z-index: 10;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 1px solid #E6C9CE;
        border-radius: 50%;
        background: #FFFDFB;
        color: #6E454C;
        cursor: pointer;
        box-shadow: 0 3px 8px rgba(94, 20, 30, .18);
      }
      .mlb-round-close:hover { color: #D81E36; border-color: #E3A6B0; }
      .mlb-round-close:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-round-close svg { width: 12px; height: 12px; }
      .mlb-resize {
        position: absolute;
        right: -5px;
        bottom: -5px;
        z-index: 11;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: 1px solid #E3A6B0;
        border-radius: 50%;
        background: #FFFDFB;
        color: #B3122A;
        cursor: nwse-resize;
        touch-action: none;
        box-shadow: 0 3px 8px rgba(94, 20, 30, .2);
      }
      .mlb-resize:hover { border-color: #D81E36; background: #FFF3F1; }
      .mlb-resize:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-resize-grip {
        display: block;
        width: 9px;
        height: 9px;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        border-radius: 0 0 2px 0;
        transform: translate(1px, -1px);
      }
      .mlb-round[data-resizing='true'] .mlb-yoyo { cursor: nwse-resize; }
      .mlb-round-info {
        position: absolute;
        top: 40px;
        left: 40px;
        z-index: 12;
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, .72);
        border-radius: 50%;
        background: rgba(23, 17, 20, .58);
        color: #FFFFFF;
        cursor: pointer;
        backdrop-filter: blur(6px);
      }
      .mlb-round-info:hover { background: rgba(23, 17, 20, .78); }
      .mlb-round-info:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
      .mlb-round-info-mark {
        font-size: 11px;
        font-style: italic;
        font-weight: 700;
        line-height: 1;
        transform: translateY(-1px);
      }
      .mlb-round-sound {
        position: absolute;
        top: 40px;
        left: 68px;
        z-index: 12;
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, .72);
        border-radius: 50%;
        background: rgba(23, 17, 20, .58);
        color: #FFFFFF;
        cursor: pointer;
        backdrop-filter: blur(6px);
      }
      .mlb-round-sound:hover { background: rgba(23, 17, 20, .78); }
      .mlb-round-sound:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
      .mlb-round-sound.is-muted {
        background: rgba(255, 255, 255, .62);
        border-color: rgba(216, 30, 54, .45);
        color: #B3122A;
      }
      .mlb-sound-icon {
        width: 14px;
        height: 14px;
        display: block;
      }
      .mlb-round-info-panel {
        position: absolute;
        top: 62px;
        left: 20px;
        z-index: 13;
        width: 194px;
        padding: 10px 12px;
        border: 1px solid #EBCBD0;
        border-radius: 12px;
        background: #FFFDFB;
        color: #3A2629;
        box-shadow: 0 10px 24px rgba(70, 20, 28, .22);
        font-size: 10px;
        line-height: 1.45;
      }
      .mlb-round-info-panel strong {
        display: block;
        margin-bottom: 3px;
        color: #171114;
        font-size: 11px;
      }
      .mlb-round-info-panel p { margin: 0 0 4px; }
      .mlb-round-info-panel p:last-child { margin-bottom: 0; }
      .mlb-sound {
        display: flex;
        align-items: center;
        gap: 5px;
        width: 100%;
        margin: 6px 0 5px;
        padding: 5px 7px;
        border: 1px solid rgba(23, 17, 20, .16);
        border-radius: 8px;
        background: rgba(255, 255, 255, .58);
        color: #171114;
        font-family: inherit;
        font-size: 10px;
        line-height: 1.2;
        text-align: left;
        cursor: pointer;
      }
      .mlb-sound:hover { background: rgba(255, 255, 255, .88); }
      .mlb-sound:focus-visible { outline: 2px solid #D81E36; outline-offset: 2px; }
      .mlb-sound-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #D81E36;
        color: #FFFFFF;
        font-size: 10px;
        font-weight: 800;
      }
      .mlb-sound-note {
        margin: 0 !important;
        color: rgba(23, 17, 20, .56);
        font-size: 9px;
        line-height: 1.35;
      }
      @media (max-width: 420px) {
        .mlb-widget { width: calc(100vw - 16px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .mlb-timer, .mlb-art, .mlb-expand, .mlb-widget-primary, .mlb-widget-secondary, .mlb-widget-collapse,
        .mlb-lid, .mlb-round-primary, .mlb-round-reset, .mlb-round-close {
          transition: none;
          animation: none;
        }
        .mlb-timer[data-phase='running'] .mlb-art,
        .mlb-widget[data-phase='running'] .mlb-shell { animation: none; }
        .mlb-timer:hover, .mlb-timer:active .mlb-art,
        .mlb-widget-primary:active { transform: none; }
      }
    `;

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => () => timerStore.dispose(),
          'ladybug-yoyo-pomodoro: shared timer'
        );

        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.pluginCss = 'ladybug-yoyo-pomodoro/client.css';
          style.textContent = STYLE_TEXT;
          document.head.appendChild(style);
          return () => style.remove();
        }, 'ladybug-yoyo-pomodoro: styles');

        ctx.effect(() => ctx.locale.register(NAMESPACE, 'zh', ZH), 'ladybug-yoyo-pomodoro: Chinese dictionary');
        ctx.effect(() => ctx.locale.register(NAMESPACE, 'en', EN), 'ladybug-yoyo-pomodoro: English dictionary');
        fallbackTranslate = ctx.locale.bind(NAMESPACE);

        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'ladybug-yoyo-pomodoro',
              order: 3,
              locale: NAMESPACE,
            },
            FocusTimer
          )
        );

        // Frame-wide floating layer, above every column. The widget opts back
        // into pointer events itself; the layer stays click-through.
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'ladybug-yoyo-pomodoro-widget',
              order: 40,
              locale: NAMESPACE,
            },
            FocusWidget
          )
        );
      },
    };
  },
});

