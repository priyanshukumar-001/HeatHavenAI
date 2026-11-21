# HeatHaven AI: 3-Minute Hackathon Demo Script

> **Goal**: Demonstrate a life-saving, zero-friction relief tool for outdoor gig workers in under 3 minutes.
> **Note**: All seeded/sample metrics are labelled as **simulated pilot data**.

---

## Act 1: The Human Problem (0:00 – 0:35)

- **Context**: 
  - *"It's 2:30 PM in June. The temperature on your phone says 41°C, but standing next to a hot motorcycle exhaust in Sector 18 Noida, the apparent heat index feels like 47°C."*
  - *"A delivery rider is dehydrated. In this heat, they cannot download an app, create an account, or read tiny complex maps."*
- **Action**: Open `http://localhost:5173?demo=1` on mobile viewport (390px).
- **Key Visual**:
  - Show the 4px Google brand color sweep.
  - The screen opens **directly on the map** (zero login, zero onboarding slop).
  - High-contrast card displays the nearest cold water: *"Atta Market Pyau, 180 m away"*.

---

## Act 2: Bilingual Voice Assistant (0:35 – 1:15)

- **Action**: Tap the floating blue microphone button in the bottom right corner.
- **Voice Query (Hindi)**:
  - Speak or trigger: *"Paas mein thanda pani kahan milega?"* (Where can I find cold water nearby?)
- **Outcome**:
  - Gemini AI processes the audio/text via `hi-IN` Web Speech API.
  - The response appears in 2 short, crisp sentences:
    > *"Sabse paas thanda pani 'Atta Market Pyau' par hai (180m door), aur doosra vikalp 'Sector 18 Metro Gate 2' hai."*
  - (If offline/unstable network, show the instant deterministic fallback response.)
- **Action**: Tap the recommended spot chip -> Map pans smoothly and opens the Spot Detail Sheet with the animated Trust Ring (`94/100`).

---

## Act 3: Live Crowd-Trust Report ("The Wow Moment") (1:15 – 2:00)

- **Scenario**:
  - *"How do we know the water is actually running today? Municipal water points often break down without notice."*
- **Live Action**:
  - Tap the red/amber button: **"Sukha hai" (Dry)**.
- **Instant Reaction**:
  - The button ripples.
  - The map pin ring turns amber/red.
  - The trust score ring animates down from `94` to `82` (-12 points).
  - A toast notification confirms: *"Report recorded: Status updated."*
- **Technical Note to Judges**:
  - Protected by a 200m GPS fence and 1-report/device/hour rate limiting (zero login, anonymous hash).

---

## Act 4: Officials' Heat-Gap Dashboard (2:00 – 2:40)

- **Action**: Switch view to **Heat-Gap Dashboard** (`/dashboard`).
- **Key Visuals**:
  - **4 KPI Row**: Peak Heat (42°C), Total Relief Spots, 84% Verified, 3 Heat Deserts.
  - **Zone Matrix (`GapGrid`)**: Red cell pulses for *Sector 18 Market North-West* (`Gap Score: 4.8`).
  - **Optimal Placement Card**: Shows green-yellow recommendation card:
    > *"Next Kiosk Recommendation: Sector 18 North-West (28.574°N, 77.322°E) - Covers estimated 350+ workers daily."*
  - **Terminal Activity Feed**: Shows real-time simulated telemetry log streaming live reports.

---

## Act 5: Emergency SOS & Closing (2:40 – 3:00)

- **Action**: Tap the red **SOS** button in the header.
- **Display**: Shows 4 clear first-aid heatstroke steps in Hindi + direct one-tap `Call 108 Ambulance`.
- **Closing Punchline**:
  - *"HeatHaven AI bridges the gap between ground-level humanitarian relief for gig workers and algorithmic decision infrastructure for city authorities. Find Shade. Find Water. Find Relief."*

