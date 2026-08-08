# Cassava UI Engineering & Design Skills Profile

This document details the core competencies, philosophies, and professional engineering standards required to build, maintain, and expand the **Cassava UI Design System**.

---

## 1. Core Philosophy: Polynomial Design Systems
Cassava UI operates under the fundamental hypothesis that **"the fewer visual decisions to be made, the more consistent the resulting interface can be."** An engineer working with Cassava UI must be skilled in translating this mathematical and structured mindset into code.

### Competencies:
- **Constraint-Based Engineering**: Design and build components with strict token-based boundaries rather than arbitrary values.
- **Polynomial Equation Reasoning**: Understand components as:
  $$\text{Component} = \text{Constant} + \text{Variable} + (\text{Coefficient} \times \text{Exponent})$$
  - *Constants*: Layout grids, spacing principles, accessibility guidelines, motion standards.
  - *Variables*: Accent colors, corner radiuses, blurs, and typography families.
  - *Coefficients*: Standard multipliers (e.g., $8\text{px} \times n$ grids).
  - *Exponents*: Priority levels determining emphasis (e.g., Level 0 to Level 4 hierarchy).

---

## 2. Spatial Layout & Tokenized Customization
Cassava UI places layout and space above surface decoration. An interface must be structural and fully comprehensible even in monochrome.

### Competencies:
- **Grid & Flexible Grid System Mastery**: Competently managing fluid column spans, flexible alignment structures, and responsive layouts without breaking horizontal and vertical rhythms.
- **Dynamic Variable Controller Integration**: Building and styling real-time variables such as:
  - *Density*: Compact, Default, Comfortable.
  - *Radius*: Sharp, Small, Medium, Large, Pill.
- **Micro-alignment over Manual Offsets**: Prioritizing unified CSS Gap, Flexbox Alignment (Start, Center, End, Stretch), and Flex/Grid Distributions over fragile absolute positioning or arbitrary pixel-pushing.

---

## 3. Micro-Motion, Spring Physics & Feedback
Cassava UI interfaces are responsive, physical, and fast. Every animation is communicative and bounded by a micro-motion performance budget.

### Competencies:
- **Translational Motion**: Direct horizontal/vertical transitions that follow the user's intent.
- **Spring-Elastic Physics**: Implementing realistic but subtle micro-motion curves instead of linear or exaggerated ease-in-out animations.
- **Multimodal Feedback Design**: Orchestrating synchronized feedback loops:
  - *Visual*: Rapid active states, border changes, micro-scaling, elevation leaps.
  - *Haptic*: Light, targeted haptic ticks for tactile validation of critical actions.
  - *Audio*: Non-obtrusive functional sound cues for feedback verification.

---

## 4. Multi-Language & Internationalization (i18n)
A truly global design system handles localization natively, adjusting text flow, reading directions, and cultural nuances across diverse writing systems.

### Competencies:
- **Multi-Locale Architecture**: Structuring application content utilizing robust dictionary structures to support multiple localized environments seamlessly. For example:
  - **US**: English (Neutral, concise, professional)
  - **ID**: Bahasa Indonesia (Spesifik, formal, terstruktur)
  - **JP**: Japanese (Polite, vertical/horizontal alignment sensitivity)
  - **CN**: Chinese (Compact character presentation, high information density)
- **Fluid Layout Reflow**: Designing defensive layouts where container widths and spacing dynamically reflow to accommodate varied word lengths and character sizes without clipping text.

---

## 5. Personalization & Color Customization
While Cassava UI defaults to a cold slate/grey aesthetic, it acknowledges the necessity for brand personality and accessibility adaptation.

### Competencies:
- **Flexible Accent Coloring**: Implementing design structures where a single Accent Palette consisting of exactly 4 specialized shades (Surface Accent, Hover, Core/Primary, Pressed/Active) is swapped dynamically via CSS variables.
- **Adaptive Schemes**: Supporting dark, light, and personalized ambient backgrounds while maintaining strict contrast levels and WCAG accessibility standards.
