# Introduction to Java

This your copy of the code for the java-course. The course itself is located in the issues of this repository.

## Weight Training Tracker

`weight-tracker/` contains a single-page PWA for logging weight training sets.

- Enter exercise, reps, and weight; tap **Add Set** to log each set as you go.
- Tap **Finish Workout** to save the day's sets to history.
- View past workouts under the **History** tab. Data is stored in browser localStorage.
- Works offline once installed (service worker caches the app shell).

### Run locally

Open `weight-tracker/index.html` in any browser.

### Install on your phone

1. Enable GitHub Pages: repo **Settings → Pages →** *Deploy from a branch* → **master**, **/(root)**.
2. Visit `https://<your-user>.github.io/java-course/weight-tracker/` on your phone.
3. **iOS Safari:** Share → *Add to Home Screen*. **Android Chrome:** menu → *Install app* (or *Add to Home Screen*).
4. Launch from the home screen icon — runs full-screen, works offline.
