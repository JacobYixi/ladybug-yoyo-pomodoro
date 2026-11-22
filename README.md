# 瓢虫少女悠悠球番茄钟 · Ladybug Yoyo Pomodoro

A fan-made 25-minute focus timer for DeepSeek Harness. A tiny Ladybug sits below the composer; open it and the yoyo splits vertically to reveal a round frosted-glass dial with the timer in the middle.

![Ladybug Yoyo Pomodoro](docs/preview.svg)

## Features

- **25-minute focus timer** — start, pause, resume, reset, and auto-finish.
- **Yoyo opening animation** — every expansion opens from the top hinge with two Ladybug-spotted halves.
- **Round, not a card** — the closed shell is a true circle; the open dial is centered inside.
- **Drag and resize** — drag the yoyo body to move it; drag its edge to resize from 190px to 420px. Position and size are remembered.
- **Completion chime** — an original Web Audio fanfare plays when the 25 minutes are up. A speaker button on the dial mutes or unmutes it. No official recording or theme melody is included.
- **Frosted glass** — the dial uses the app's backdrop, not an opaque white panel.
- **Collapse from the string** — the white string tip at the top is the close button.
- **Bilingual UI** — Chinese and English, following the DSH locale.
- **Accessible** — keyboard toggles, `aria-live` timer announcements, reduced-motion support.
- **No global theme changes** — this package only contributes the widget; it does not override app colors or composer styles.

## Install

Install from DSH Market, or add the bundle through the DSH plugin manager:

```text
https://github.com/JacobYixi/ladybug-yoyo-pomodoro
```

The package declares a `dsh.bundle` manifest (`cordis.patch.yml`) for installability.

## Fan-made notice

This is a **fan-made, non-commercial** project. It is **not official** and is **not affiliated with or endorsed by ZAG / Toei Animation**. “Miraculous”, “Ladybug”, “Tikki”, and related names are trademarks of their respective owners. The ladybug artwork here is original vector fan art; no official still, logo, recording, or theme melody is included. The completion chime is an original synthesized motif.

## License

MIT. See [LICENSE](LICENSE).
