import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// These two lines are needed to recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "GAPP Presentation";

// ─── BRAND TOKENS ───────────────────────────────────────────────
const C = {
  orange:      "FF6B35",
  charcoal:    "1A1A1A",
  darkCard:    "242424",
  medCard:     "2E2E2E",
  white:       "FFFFFF",
  offwhite:    "F0F0F0",
  muted:       "A0A0A0",
  orangeLight: "FF8C5A",
};

const logoPath = path.resolve(__dirname, "gapp_logo.png");
const LOGO_W = 1.4, LOGO_H = 0.55;
const LOGO_X = 8.45, LOGO_Y = 0.08;

function addLogo(slide) {
  slide.addImage({ path: logoPath, x: LOGO_X, y: LOGO_Y, w: LOGO_W, h: LOGO_H });
}

// ─── HELPER: Orange accent bar left of title ─────────────────────
function addSectionTitle(slide, text, y = 0.3, size = 30) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: y, w: 0.07, h: size <= 26 ? 0.45 : 0.55,
    fill: { color: C.orange }, line: { color: C.orange }
  });
  slide.addText(text, {
    x: 0.6, y: y - 0.02, w: 7.5, h: size <= 26 ? 0.5 : 0.65,
    fontSize: size, bold: true, color: C.white, fontFace: "Arial Black",
    charSpacing: 1, margin: 0
  });
}

// ─── HELPER: Stat card ───────────────────────────────────────────
function addStatCard(slide, stat, label, x, y, w = 2.1, h = 1.3) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.darkCard },
    shadow: { type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.4 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: w, h: 0.06, fill: { color: C.orange }, line: { color: C.orange }
  });
  slide.addText(stat, {
    x: x + 0.08, y: y + 0.1, w: w - 0.16, h: 0.7,
    fontSize: 34, bold: true, color: C.orange, fontFace: "Arial Black",
    align: "center", margin: 0
  });
  slide.addText(label, {
    x: x + 0.08, y: y + 0.78, w: w - 0.16, h: 0.45,
    fontSize: 11, color: C.muted, align: "center", fontFace: "Arial", margin: 0
  });
}

// ─── HELPER: Bullet list ─────────────────────────────────────────
function makeBullets(items, color = C.offwhite, size = 14) {
  return items.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "25B6" }, color, fontSize: size, fontFace: "Arial",
      breakLine: i < items.length - 1, paraSpaceAfter: 6
    }
  }));
}

// ─── SLIDE 1: Title ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  // Large orange accent block left
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.5, h: 5.625, fill: { color: C.orange }, line: { color: C.orange } });
  s.addImage({ path: logoPath, x: 0.9, y: 0.5, w: 3.2, h: 1.28 });
  s.addText("The Coordination-Execution\nGap Solution", {
    x: 0.9, y: 2.0, w: 7.5, h: 1.8,
    fontSize: 36, bold: true, color: C.white, fontFace: "Arial Black",
    charSpacing: 0.5
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.85, w: 3.5, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
  s.addText("Bridging commitment and execution in campus ecosystems", {
    x: 0.9, y: 3.95, w: 8, h: 0.5, fontSize: 15, color: C.muted, fontFace: "Arial", italic: true
  });
  s.addText("ECH Dept  •  Digital Electronics  •  25ECH-101", {
    x: 0.9, y: 5.0, w: 8, h: 0.4, fontSize: 11, color: C.muted, fontFace: "Arial"
  });
}

// ─── SLIDE 2: Problem Statement ──────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Problem Statement", 0.28);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.05, w: 9.2, h: 2.8, fill: { color: C.darkCard }, line: { color: C.darkCard } });
  s.addText("Modern coordination systems suffer from a structural gap between expressed commitment and actual execution.", {
    x: 0.7, y: 1.15, w: 8.6, h: 0.9, fontSize: 17, color: C.white, fontFace: "Arial", bold: true
  });
  s.addText("This leads to:", { x: 0.7, y: 2.0, w: 8.5, h: 0.4, fontSize: 14, color: C.orange, fontFace: "Arial", bold: true });
  s.addText([
    { text: "Inefficiencies", options: { bullet: true, color: C.offwhite, fontSize: 14, fontFace: "Arial", breakLine: true, paraSpaceAfter: 5 } },
    { text: "Resource misallocation", options: { bullet: true, color: C.offwhite, fontSize: 14, fontFace: "Arial", breakLine: true, paraSpaceAfter: 5 } },
    { text: "Financial loss", options: { bullet: true, color: C.offwhite, fontSize: 14, fontFace: "Arial", breakLine: true, paraSpaceAfter: 5 } },
    { text: "Reduced systemic reliability across participation-dependent environments", options: { bullet: true, color: C.offwhite, fontSize: 14, fontFace: "Arial" } }
  ], { x: 0.9, y: 2.35, w: 8.3, h: 1.4 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.1, w: 9.2, h: 1.15, fill: { color: "2A1810" }, line: { color: C.orange, pt: 1.5 } });
  s.addText("The Gap between saying and doing is costing campuses time, money, and trust.", {
    x: 0.6, y: 4.2, w: 8.8, h: 0.9, fontSize: 14, color: C.orange, fontFace: "Arial", italic: true, bold: true, align: "center"
  });
}

// ─── SLIDE 3: Detailed Problem / CEG ────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "The Commitment-Execution Gap", 0.28, 26);

  const weaknesses = ["Early stage — no existing user base", "Dependent on college admin buy-in", "Limited brand awareness vs. established apps", "Team capacity for ongoing maintenance", "No offline functionality yet"];
  const opps = ["48% students uninvolved — huge TAM", "Colleges digitizing post-pandemic", "WhatsApp Business API for notifications"];

  const cardY = 1.05;
  // Weaknesses card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: cardY, w: 4.4, h: 3.2, fill: { color: C.darkCard }, line: { color: C.darkCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: cardY, w: 4.4, h: 0.06, fill: { color: "CC4444" }, line: { color: "CC4444" } });
  s.addText("CHALLENGES", { x: 0.5, y: cardY + 0.08, w: 4.2, h: 0.4, fontSize: 13, bold: true, color: "EE6666", fontFace: "Arial" });
  s.addText(weaknesses.map((t, i) => ({ text: t, options: { bullet: true, color: C.offwhite, fontSize: 12.5, fontFace: "Arial", breakLine: i < weaknesses.length - 1, paraSpaceAfter: 7 } })),
    { x: 0.55, y: cardY + 0.5, w: 4.1, h: 2.55 });

  // Opportunities card
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: cardY, w: 4.4, h: 3.2, fill: { color: C.darkCard }, line: { color: C.darkCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: cardY, w: 4.4, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
  s.addText("OPPORTUNITIES", { x: 5.3, y: cardY + 0.08, w: 4.2, h: 0.4, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial" });
  s.addText(opps.map((t, i) => ({ text: t, options: { bullet: true, color: C.offwhite, fontSize: 12.5, fontFace: "Arial", breakLine: i < opps.length - 1, paraSpaceAfter: 7 } })),
    { x: 5.35, y: cardY + 0.5, w: 4.1, h: 2.55 });

  s.addText("CEG is not a user problem — it is a systems problem.", {
    x: 0.4, y: 4.5, w: 9.2, h: 0.45, fontSize: 14, color: C.orange, bold: true, italic: true, fontFace: "Arial", align: "center"
  });
}

// ─── SLIDE 4: Research Introduction ─────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Bridging the Intent-Action Divide", 0.28, 26);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.0, w: 9.2, h: 2.0, fill: { color: C.darkCard }, line: { color: C.darkCard } });
  s.addText("Our research explores why the ease of clicking a button has not translated into real-world presence.", {
    x: 0.65, y: 1.1, w: 8.7, h: 0.85, fontSize: 17, color: C.white, fontFace: "Arial", bold: true
  });
  s.addText("We investigate the psychology of low-friction digital commitments and how they degrade the reliability of campus ecosystems.", {
    x: 0.65, y: 1.9, w: 8.7, h: 0.85, fontSize: 14, color: C.muted, fontFace: "Arial"
  });

  const pillars = [
    ["🔍", "Psychology", "Why clicking 'Join' feels weightless"],
    ["📊", "Behavioral Econ", "Cost-free RSVPs → non-binding"],
    ["🏫", "Campus Context", "Campus ecosystems hit hardest"],
    ["💡", "Solutions", "Implementation Intentions & stakes"]
  ];
  pillars.forEach(([icon, title, desc], i) => {
    const x = 0.4 + i * 2.35;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.2, w: 2.2, h: 2.1, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.2, w: 2.2, h: 0.05, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(icon, { x, y: 3.25, w: 2.2, h: 0.6, fontSize: 24, align: "center" });
    s.addText(title, { x: x + 0.05, y: 3.85, w: 2.1, h: 0.4, fontSize: 12, bold: true, color: C.orange, fontFace: "Arial", align: "center" });
    s.addText(desc, { x: x + 0.05, y: 4.25, w: 2.1, h: 0.9, fontSize: 11, color: C.muted, fontFace: "Arial", align: "center" });
  });
}

// ─── SLIDE 5: Secondary Research ────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "The Digital Friction Paradox", 0.28, 26);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.05, w: 9.2, h: 1.8, fill: { color: "1E1205" }, line: { color: C.orange, pt: 1.5 } });
  s.addText('"Positive friction" is often necessary to ensure user intent is genuine.', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6, fontSize: 18, color: C.orange, fontFace: "Arial", bold: true, italic: true
  });
  s.addText("— Secondary Research in UX & Behavioral Economics", {
    x: 0.65, y: 1.72, w: 8.7, h: 0.4, fontSize: 12, color: C.muted, fontFace: "Arial"
  });

  const points = [
    ["UX designers remove friction", "Low-friction design makes clicking trivial — leading to casual, non-binding commitments."],
    ["No perceived cost = no commitment", "Without financial or social stakes, digital RSVPs function as placeholders, not promises."],
    ["Behavioral economics insight", "People only value commitments that carry a weight — reputational, social, or financial."]
  ];
  points.forEach(([title, body], i) => {
    const y = 3.05 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.06, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(title, { x: 0.6, y: y - 0.03, w: 3.5, h: 0.35, fontSize: 13, bold: true, color: C.white, fontFace: "Arial", margin: 0 });
    s.addText(body, { x: 0.6, y: y + 0.27, w: 9.0, h: 0.45, fontSize: 12, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 6: Poster Showcase ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Visualizing the Gap", 0.28, 26);

  s.addText("The GAPP poster distills complex behavioral data into actionable insights for student organizers and administrators.", {
    x: 0.4, y: 1.05, w: 9.2, h: 0.65, fontSize: 14, color: C.muted, fontFace: "Arial"
  });

  // Signal vs Noise cards
  [
    { label: "THE SIGNAL", sub: "The RSVP", icon: "✅", color: "2E7D32", bg: "112211" },
    { label: "THE NOISE", sub: "The Ghosting", icon: "👻", color: "CC4444", bg: "221111" }
  ].forEach(({ label, sub, icon, color, bg }, i) => {
    const x = 0.5 + i * 4.75;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.95, w: 4.4, h: 2.8, fill: { color: bg }, line: { color: color, pt: 2 } });
    s.addText(icon, { x, y: 2.05, w: 4.4, h: 0.9, fontSize: 40, align: "center" });
    s.addText(label, { x: x + 0.1, y: 2.95, w: 4.2, h: 0.5, fontSize: 18, bold: true, color, fontFace: "Arial Black", align: "center" });
    s.addText(sub, { x: x + 0.1, y: 3.42, w: 4.2, h: 0.4, fontSize: 14, color: C.muted, fontFace: "Arial", align: "center" });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.5, y: 3.85, w: 3.4, h: 0.06, fill: { color }, line: { color } });
    const desc = i === 0 ? "A genuine commitment from an attendee" : "The gap between RSVP and no-show";
    s.addText(desc, { x: x + 0.1, y: 3.94, w: 4.2, h: 0.55, fontSize: 12, color: C.muted, fontFace: "Arial", align: "center" });
  });

  s.addText("GAPP bridges The Signal and The Noise through accountability mechanics.", {
    x: 0.4, y: 5.08, w: 9.2, h: 0.4, fontSize: 13, color: C.orange, bold: true, fontFace: "Arial", align: "center"
  });
}

// ─── SLIDE 7: Poster Methodology ────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Synthesizing Data into Design", 0.28, 26);

  const methods = [
    { num: "01", title: "Information Hierarchy", body: 'Prioritizing the "Why" behind commitment failure — structure guides the viewer\'s attention to the core insight.' },
    { num: "02", title: "Data Visualization", body: "Turning raw survey percentages into compelling visual narratives that resonate with organizers and administrators." },
    { num: "03", title: "Call to Action", body: 'Providing immediate steps to implement "Implementation Intentions" — turning research into actionable change.' }
  ];

  methods.forEach(({ num, title, body }, i) => {
    const y = 1.1 + i * 1.42;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 1.3, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.06, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(num, { x: 0.6, y: y + 0.05, w: 0.7, h: 0.55, fontSize: 26, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    s.addText(title, { x: 1.4, y: y + 0.05, w: 7.8, h: 0.42, fontSize: 15, bold: true, color: C.white, fontFace: "Arial", margin: 0 });
    s.addText(body, { x: 1.4, y: y + 0.5, w: 8.0, h: 0.65, fontSize: 12.5, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 8: Design Philosophy ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Intentional Accountability", 0.28, 26);

  // Color swatch cards
  [
    { color: C.orange, hex: "#FF6B35", name: "Safety Orange", role: "Urgency & Attention" },
    { color: "2A2A2A", hex: "#1A1A1A", name: "Deep Charcoal", role: "Professional Reliability" },
    { color: C.white, hex: "#FFFFFF", name: "Pure White", role: "Clarity & Contrast" }
  ].forEach(({ color, hex, name, role }, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.05, w: 2.8, h: 1.4, fill: { color }, line: { color: "333333" } });
    s.addText(hex, { x, y: 1.05, w: 2.8, h: 1.4, fontSize: 14, bold: true, color: color === C.white ? C.charcoal : C.white, fontFace: "Consolas", align: "center", valign: "middle" });
    s.addText(name, { x, y: 2.5, w: 2.8, h: 0.38, fontSize: 13, bold: true, color: C.white, fontFace: "Arial", align: "center" });
    s.addText(role, { x, y: 2.85, w: 2.8, h: 0.35, fontSize: 11, color: C.muted, fontFace: "Arial", align: "center" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.4, w: 9.2, h: 1.85, fill: { color: C.darkCard }, line: { color: C.darkCard } });
  s.addText("Design Philosophy", { x: 0.65, y: 3.5, w: 8.8, h: 0.4, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial" });
  s.addText("Every UI element is designed to make the user pause and consider the weight of their \"word.\" Safety Orange signals urgency, Deep Charcoal provides grounded stability — together they communicate that GAPP is serious infrastructure, not another passive app.", {
    x: 0.65, y: 3.88, w: 8.7, h: 1.25, fontSize: 13, color: C.offwhite, fontFace: "Arial"
  });
}

// ─── SLIDE 9: Poster Research ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Iterative Feedback Loops", 0.28, 26);

  // A/B Test cards
  [
    { label: "Punitive Tone", result: "❌ Low Response", desc: "\"You'll be penalized for missing\" — Users felt defensive, reduced engagement.", color: "CC4444", bg: "221111" },
    { label: "Reputational Tone", result: "✅ High Response", desc: '"Your reputation score drops" — Users felt social pressure. Became cornerstone of GAPP Leaderboard.', color: "2E9E50", bg: "112211" }
  ].forEach(({ label, result, desc, color, bg }, i) => {
    const x = 0.4 + i * 4.8;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: 4.5, h: 3.0, fill: { color: bg }, line: { color, pt: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: 4.5, h: 0.06, fill: { color }, line: { color } });
    s.addText(`A/B TEST ${i === 0 ? "A" : "B"}`, { x: x + 0.15, y: 1.18, w: 2, h: 0.38, fontSize: 11, bold: true, color, fontFace: "Arial" });
    s.addText(label, { x: x + 0.15, y: 1.55, w: 4.2, h: 0.5, fontSize: 18, bold: true, color, fontFace: "Arial Black" });
    s.addText(result, { x: x + 0.15, y: 2.05, w: 4.2, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: "Arial" });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 2.5, w: 4.1, h: 0.04, fill: { color: "444444" }, line: { color: "444444" } });
    s.addText(desc, { x: x + 0.15, y: 2.6, w: 4.2, h: 1.3, fontSize: 12, color: C.muted, fontFace: "Arial" });
  });

  s.addText("KEY FINDING: Reputational stakes outperform financial punishment in driving event attendance.", {
    x: 0.4, y: 4.35, w: 9.2, h: 0.55, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial", align: "center"
  });
}

// ─── SLIDE 10: Tools of Research ────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Tools of Research", 0.28, 26);

  const tools = [
    { icon: "🗺️", name: "Empathy Map", desc: "Understand user feelings, thoughts, behaviors and pain points" },
    { icon: "🧠", name: "Mind Map", desc: "Visual brainstorming to connect root causes and solutions" },
    { icon: "📋", name: "User Surveys", desc: "Quantitative data from 100+ students on RSVP behavior" },
    { icon: "🧪", name: "A/B Testing", desc: "Compare punitive vs. reputational messaging effectiveness" },
    { icon: "👤", name: "User Personas", desc: "Archetype modeling for organizers and attendees" },
    { icon: "📊", name: "SWOT Analysis", desc: "Strategic mapping of internal and external factors" }
  ];

  tools.forEach(({ icon, name, desc }, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 3.1;
    const y = 1.1 + row * 2.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.8, h: 1.75, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.75, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(icon, { x: x + 0.1, y: y + 0.1, w: 2.6, h: 0.55, fontSize: 26, align: "left" });
    s.addText(name, { x: x + 0.15, y: y + 0.62, w: 2.55, h: 0.38, fontSize: 13, bold: true, color: C.white, fontFace: "Arial" });
    s.addText(desc, { x: x + 0.15, y: y + 0.98, w: 2.55, h: 0.7, fontSize: 11, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 11: User Persona ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "The Struggling Organizer: Alex", 0.28, 26);

  // Avatar
  s.addShape(pres.shapes.OVAL, { x: 0.4, y: 1.05, w: 1.5, h: 1.5, fill: { color: C.orange }, line: { color: C.orangeLight } });
  s.addText("👤", { x: 0.4, y: 1.1, w: 1.5, h: 1.4, fontSize: 44, align: "center", valign: "middle" });
  s.addText("Alex", { x: 0.4, y: 2.6, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: C.orange, fontFace: "Arial", align: "center" });
  s.addText("Cultural Club Head", { x: 0.4, y: 2.95, w: 1.5, h: 0.35, fontSize: 11, color: C.muted, fontFace: "Arial", align: "center" });

  const attrs = [
    { label: "PAIN POINT", text: "Books a 200-seat auditorium based on 150 RSVPs — only 30 students show up.", color: "CC4444" },
    { label: "GOAL", text: "Reliable \"Core Count\" for resource planning and sponsorship metrics.", color: "2E9E50" },
    { label: "MOTIVATION", text: "High-quality events that reach the intended audience without wasted budget.", color: C.orange }
  ];

  attrs.forEach(({ label, text, color }, i) => {
    const y = 1.05 + i * 1.42;
    s.addShape(pres.shapes.RECTANGLE, { x: 2.2, y, w: 7.4, h: 1.28, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 2.2, y, w: 0.06, h: 1.28, fill: { color }, line: { color } });
    s.addText(label, { x: 2.4, y: y + 0.06, w: 7.0, h: 0.33, fontSize: 11, bold: true, color, fontFace: "Arial", margin: 0 });
    s.addText(text, { x: 2.4, y: y + 0.4, w: 7.0, h: 0.75, fontSize: 13, color: C.offwhite, fontFace: "Arial" });
  });

  s.addText("Alex is why GAPP exists.", {
    x: 0.4, y: 5.1, w: 9.2, h: 0.35, fontSize: 14, color: C.orange, bold: true, italic: true, fontFace: "Arial", align: "center"
  });
}

// ─── SLIDE 12: SWOT Analysis ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "SWOT Analysis", 0.28, 26);

  const swot = [
    { label: "STRENGTHS", color: "2E9E50", bg: "0D2B14", items: ["Free end-to-end — no transaction fees", "India-first: WhatsApp & SMS integrations", "Student-first UI — mobile-first, dark mode", "Two-role architecture (student + organizer)", "Lightweight SPA — <1s load times"] },
    { label: "WEAKNESSES", color: "CC4444", bg: "2B0D0D", items: ["Early stage — no existing user base", "Dependent on college admin buy-in", "Limited brand awareness vs. established apps", "Team capacity for ongoing maintenance", "No offline functionality yet"] },
    { label: "OPPORTUNITIES", color: C.orange, bg: "2B1A0D", items: ["64% students uninvolved — huge TAM", "Colleges digitizing post-pandemic", "WhatsApp Business API for notifications", "Expand to 500+ colleges Tier 1-3", "Sponsorship from clubs / placement cells"] },
    { label: "THREATS", color: "8B5CF6", bg: "1A0D2B", items: ["CU Intranet updates could add features", "Low student adoption if onboarding is hard", "WhatsApp groups too entrenched culturally", "Competing student startup platforms", "Data privacy regulations (DPDP Act 2023)"] }
  ];

  swot.forEach(({ label, color, bg, items }, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.0 + row * 2.35;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.55, h: 2.15, fill: { color: bg }, line: { color, pt: 1.5 } });
    s.addText(label, { x: x + 0.12, y: y + 0.07, w: 4.2, h: 0.35, fontSize: 12, bold: true, color, fontFace: "Arial Black" });
    s.addText(items.map((t, ii) => ({ text: t, options: { bullet: true, color: C.offwhite, fontSize: 10.5, fontFace: "Arial", breakLine: ii < items.length - 1, paraSpaceAfter: 4 } })),
      { x: x + 0.12, y: y + 0.44, w: 4.3, h: 1.65 });
  });
}

// ─── SLIDE 13: User Surveys ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "User Surveys", 0.28, 26);

  const stats = [
    { pct: "30%", label: "Registered 1-2 times and did not attend" },
    { pct: "30%", label: "Simply forgot about the event" },
    { pct: "50%", label: 'Said it\'s "Too Easy" to click Join / Sign Up' },
    { pct: "50%", label: "Cited no financial or social penalty for skipping" }
  ];

  stats.forEach(({ pct, label }, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.05 + row * 2.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.55, h: 1.9, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.55, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(pct, { x: x + 0.1, y: y + 0.1, w: 1.4, h: 1.1, fontSize: 46, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    s.addText(label, { x: x + 1.55, y: y + 0.25, w: 2.85, h: 1.2, fontSize: 13, color: C.offwhite, fontFace: "Arial" });
  });

  s.addText("n = 100+ campus students surveyed across cultural & technical events", {
    x: 0.4, y: 5.2, w: 9.2, h: 0.3, fontSize: 11, color: C.muted, fontFace: "Arial", align: "center", italic: true
  });
}

// ─── SLIDE 14: Conclusions of User Study ────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Conclusions of User Study", 0.28, 26);

  const conclusions = [
    { icon: "❌", text: "Users do not fail because they are malicious or lazy." },
    { icon: "⚠️", text: "They fail because the modern digital ecosystem provides zero stakes." },
    { icon: "🔕", text: "Standard reminders are ignored without social or financial weight." },
    { icon: "📉", text: "Organizers are punished for being inclusive (over-booking) and pre-planning." },
    { icon: "🔧", text: 'A system is needed that turns commitment into execution.' }
  ];

  conclusions.forEach(({ icon, text }, i) => {
    const y = 1.1 + i * 0.88;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.75, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addText(icon, { x: 0.5, y, w: 0.6, h: 0.75, fontSize: 22, align: "center", valign: "middle" });
    s.addText(text, { x: 1.15, y: y + 0.08, w: 8.2, h: 0.58, fontSize: 13.5, color: C.offwhite, fontFace: "Arial", valign: "middle" });
  });
}

// ─── SLIDE 15: Conclusions of Problem Study ──────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Conclusions of Problem Study", 0.28, 26);

  const pts = [
    ["The Accountability Crisis", "The Commitment-Execution Gap is fundamentally an accountability crisis — not a technology or UX failure."],
    ["To-Do Lists Fall Short", "Traditional lists track what to do, but provide no penalty or reward for doing it. Tracking ≠ accountability."],
    ["Manual Intervention Required", "Currently, organizers must manually chase attendees, send reminders, and absorb no-show costs."]
  ];

  pts.forEach(([title, body], i) => {
    const y = 1.1 + i * 1.45;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 1.3, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.07, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(`${i + 1}`, { x: 0.6, y: y + 0.05, w: 0.55, h: 0.55, fontSize: 26, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    s.addText(title, { x: 1.25, y: y + 0.06, w: 8.1, h: 0.38, fontSize: 15, bold: true, color: C.white, fontFace: "Arial", margin: 0 });
    s.addText(body, { x: 1.25, y: y + 0.48, w: 8.1, h: 0.72, fontSize: 12.5, color: C.muted, fontFace: "Arial" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 5.1, w: 9.2, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
}

// ─── SLIDE 16: Research Insights ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Research Insights", 0.28, 26);

  const insights = [
    { num: "01", title: "Financial Stakes Work — But Deter Casual Users", detail: "Monetary commitment increases attendance, but creates a barrier to entry that excludes low-engagement students from even signing up.", tag: "BEHAVIORAL ECONOMICS" },
    { num: "02", title: "Reputation is Powerful Social Currency", detail: "Social standing matters deeply to students. A public reputation score creates accountability without requiring financial risk.", tag: "SOCIAL PSYCHOLOGY" },
    { num: "03", title: "Implementation Intentions Cut Ghosting in Half", detail: 'Forcing users to type "how/when" they plan to attend — not just click — reduces no-shows by up to 50%. Specificity = commitment.', tag: "COGNITIVE SCIENCE" }
  ];

  insights.forEach(({ num, title, detail, tag }, i) => {
    const y = 1.05 + i * 1.48;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 1.33, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.07, h: 1.33, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(num, { x: 0.6, y: y + 0.05, w: 0.65, h: 0.5, fontSize: 22, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    s.addText(title, { x: 1.3, y: y + 0.05, w: 6.5, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: "Arial", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.0, y: y + 0.08, w: 1.5, h: 0.3, fill: { color: "2A1810" }, line: { color: C.orange, pt: 1 } });
    s.addText(tag, { x: 8.0, y: y + 0.08, w: 1.5, h: 0.3, fontSize: 8, bold: true, color: C.orange, fontFace: "Arial", align: "center", valign: "middle" });
    s.addText(detail, { x: 1.3, y: y + 0.5, w: 8.1, h: 0.72, fontSize: 12, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 17: Market Study ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Market Landscape", 0.28, 26);

  const cats = [
    { label: "General Event Platforms", color: "4A6CF7", items: ["Eventbrite", "Whova", "Insider.in", "BookMyShow", "Paytm Insider India"] },
    { label: "India Campus Platforms", color: C.orange, items: ["Unstop", "Knowafest", "StuMagz", "Dare2Compete", "CollEvent"] },
    { label: "Service-Based Platforms", color: "2E9E50", items: ["TeamOrange", "Hire4Event", "Gradnet", "Just Attend", "Pathify"] },
    { label: "International Campus Tools", color: "8B5CF6", items: ["CampusGroups", "Symplicity Engage", "Presence.io", "Eventify"] }
  ];

  cats.forEach(({ label, color, items }, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.05 + row * 2.2;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.55, h: 2.05, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 2.05, fill: { color }, line: { color } });
    s.addText(label, { x: x + 0.15, y: y + 0.08, w: 4.25, h: 0.38, fontSize: 12.5, bold: true, color, fontFace: "Arial" });
    s.addText(items.map((t, ii) => ({ text: t, options: { bullet: true, color: C.offwhite, fontSize: 11.5, fontFace: "Arial", breakLine: ii < items.length - 1, paraSpaceAfter: 4 } })),
      { x: x + 0.18, y: y + 0.48, w: 4.25, h: 1.5 });
  });
}

// ─── SLIDE 18: Competitor Matrix ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Competitor Matrix", 0.28, 26);

  const headers = ["Platform", "Free?", "Campus Focus", "RSVP Mgmt", "Mobile-First", "India Context", "Our Edge"];
  const rows = [
    ["Eventbrite", "Paid", "Corporate", "Yes", "Partial", "No", "Free + student-first"],
    ["Unstop", "Free", "Competitions", "No", "Partial", "Yes", "All event types + RSVP"],
    ["CU Intranet", "Free", "Yes", "Manual", "Desktop", "Yes", "Unified dash + auto-remind"],
    ["CampusGroups", "$5K+/yr", "Yes", "Yes", "Yes", "No", "Zero cost + WhatsApp"],
    ["Insider.in", "10%+ fees", "Commercial", "Basic", "Yes", "Yes", "No fees + college-verified"],
    ["gapp ★", "FREE", "College-First", "Automatic", "Mobile PWA", "WhatsApp+SMS", "END-TO-END SOLUTION"]
  ];

  const checkColor = (val) => val === "Yes" || val === "Free" || val === "Yes" || val === "Automatic" || val === "Mobile PWA" ? "2E9E50" : val === "No" || val === "Manual" || val === "Partial" || val === "Desktop" ? "CC4444" : C.muted;

  const tableData = [
    headers.map(h => ({ text: h, options: { bold: true, color: C.orange, fill: { color: "1E1E1E" }, fontSize: 10.5, fontFace: "Arial" } })),
    ...rows.map((row, ri) => row.map((cell, ci) => ({
      text: cell,
      options: {
        color: ri === rows.length - 1 ? (ci === 0 ? C.orange : C.white) : ci === 0 ? C.white : checkColor(cell),
        fill: { color: ri === rows.length - 1 ? "2A1810" : ri % 2 === 0 ? "242424" : "1E1E1E" },
        bold: ri === rows.length - 1,
        fontSize: 10,
        fontFace: "Arial"
      }
    })))
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.0, w: 9.4, h: 4.35,
    border: { pt: 0.5, color: "333333" },
    colW: [1.3, 0.85, 1.2, 1.1, 1.1, 1.15, 2.7]
  });
}

// ─── SLIDE 19: Conclusions of Market Study ───────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Conclusions of Market Study", 0.28, 26);

  const pts = [
    { icon: "🔬", label: "Process Used", text: "Feature comparison, UI analysis, and friction-testing across 15+ platforms in India and internationally." },
    { icon: "📈", label: "Trends Identified", text: 'Tools are either too soft (To-do lists that track but don\'t enforce) or too punishing (Beeminder-style financial stakes that deter casual users).' },
    { icon: "🎯", label: "Key Insight", text: 'There is a "missing middle" market — an app using Reputational Stakes (a public score) rather than money or passivity.' }
  ];

  pts.forEach(({ icon, label, text }, i) => {
    const y = 1.1 + i * 1.45;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 1.3, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.07, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(icon, { x: 0.55, y, w: 0.65, h: 1.3, fontSize: 24, align: "center", valign: "middle" });
    s.addText(label, { x: 1.3, y: y + 0.07, w: 8.1, h: 0.4, fontSize: 14, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });
    s.addText(text, { x: 1.3, y: y + 0.5, w: 8.1, h: 0.72, fontSize: 12.5, color: C.offwhite, fontFace: "Arial" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 5.35, w: 9.2, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
}

// ─── SLIDE 20: Differentiation Factor ───────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Differentiation Factor", 0.28, 26);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.05, w: 9.2, h: 1.1, fill: { color: "2A1810" }, line: { color: C.orange, pt: 2 } });
  s.addText('We treat a person\'s "word" as quantifiable currency.', {
    x: 0.6, y: 1.15, w: 8.8, h: 0.85, fontSize: 20, bold: true, color: C.orange, fontFace: "Arial Black", align: "center", valign: "middle"
  });

  const diff = [
    { label: "Behavioral Science", icon: "🧠", desc: '"Implementation Intentions" — making users specify how and when they will attend reduces ghosting by 50%.' },
    { label: "Social Mechanics", icon: "🏆", desc: "The GAPP Leaderboard turns reputation into currency — public accountability without financial risk." },
    { label: "No Financial Risk", icon: "🛡️", desc: "Unlike Beeminder or pledge-based apps, GAPP uses reputational stakes only. Inclusive by design." }
  ];

  diff.forEach(({ label, icon, desc }, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.35, w: 2.85, h: 2.8, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.35, w: 2.85, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(icon, { x, y: 2.42, w: 2.85, h: 0.75, fontSize: 32, align: "center" });
    s.addText(label, { x: x + 0.1, y: 3.18, w: 2.65, h: 0.45, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial", align: "center" });
    s.addText(desc, { x: x + 0.1, y: 3.65, w: 2.65, h: 1.35, fontSize: 11.5, color: C.muted, fontFace: "Arial", align: "center" });
  });
}

// ─── SLIDE 21: Branding Strategy ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "The Power of the Bold", 0.28, 26);

  s.addText("GAPP's branding is designed to disrupt the passivity of modern apps.", {
    x: 0.4, y: 1.05, w: 9.2, h: 0.45, fontSize: 14, color: C.muted, fontFace: "Arial"
  });

  const brand = [
    { swatch: C.orange, text: "SAFETY ORANGE signals urgency — the user's commitment matters. Not another grey, forgettable productivity app." },
    { swatch: "2A2A2A", text: "DEEP CHARCOAL provides grounded, stable foundation — GAPP is reliable infrastructure, not a gimmick." },
    { swatch: C.white, text: "HIGH-CONTRAST WHITE ensures legibility — dark mode aesthetic resonates with Gen Z, reducing eye strain." }
  ];

  brand.forEach(({ swatch, text }, i) => {
    const y = 1.65 + i * 1.18;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 1.4, h: 0.95, fill: { color: swatch }, line: { color: "444444" } });
    s.addShape(pres.shapes.RECTANGLE, { x: 2.0, y, w: 7.6, h: 0.95, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addText(text, { x: 2.15, y: y + 0.1, w: 7.25, h: 0.72, fontSize: 13, color: C.offwhite, fontFace: "Arial", valign: "middle" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 5.1, w: 9.2, h: 0.3, fill: { color: C.orange }, line: { color: C.orange } });
  s.addText("Every element designed to make users pause and consider the weight of their word.", {
    x: 0.4, y: 5.1, w: 9.2, h: 0.3, fontSize: 11, color: C.charcoal, bold: true, fontFace: "Arial", align: "center", valign: "middle"
  });
}

// ─── SLIDE 22: Naming Logic ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Mind the GAPP", 0.28, 26);

  // Large GAPP text
  s.addText("G", { x: 0.4, y: 1.1, w: 2.0, h: 2.0, fontSize: 120, bold: true, color: C.orange, fontFace: "Arial Black", align: "center", margin: 0 });
  s.addText("A", { x: 2.2, y: 1.1, w: 2.0, h: 2.0, fontSize: 120, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  s.addText("P", { x: 4.1, y: 1.1, w: 2.0, h: 2.0, fontSize: 120, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  s.addText("P", { x: 5.9, y: 1.1, w: 2.0, h: 2.0, fontSize: 120, bold: true, color: C.orange, fontFace: "Arial Black", align: "center", margin: 0 });

  const meanings = [
    ["NOUN", "The problem", "The gap between saying and doing — the Commitment-Execution Gap."],
    ["VERB", "The solution", 'To "Gapp" — to bridge the distance between commitment and execution.'],
    ["BRAND", "The identity", "Short, punchy, memorable for the student demographic."]
  ];

  meanings.forEach(([type, title, desc], i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.35, w: 2.85, h: 1.95, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.35, w: 0.06, h: 1.95, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(type, { x: x + 0.12, y: 3.4, w: 2.65, h: 0.35, fontSize: 11, bold: true, color: C.orange, fontFace: "Arial" });
    s.addText(title, { x: x + 0.12, y: 3.73, w: 2.65, h: 0.38, fontSize: 14, bold: true, color: C.white, fontFace: "Arial" });
    s.addText(desc, { x: x + 0.12, y: 4.1, w: 2.65, h: 1.1, fontSize: 11, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 23: Logo Breakdown ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Symbolizing Connection", 0.28, 26);

  // Large logo display
  s.addImage({ path: logoPath, x: 0.5, y: 1.1, w: 5.0, h: 2.0 });

  const elements = [
    { title: "The Font", desc: "Thick, blocky lettering represents strength and reliability — GAPP is infrastructure, not an app." },
    { title: "The Bridge", desc: "The connection between 'A' and 'P' symbolizes the Execution path — bridging gap to action." },
    { title: "The Color", desc: "Safety Orange ensures visibility in crowded mobile app environments and signals urgency." }
  ];

  elements.forEach(({ title, desc }, i) => {
    const y = 1.1 + i * 1.45;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.85, y, w: 3.75, h: 1.3, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.85, y, w: 0.06, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(title, { x: 6.0, y: y + 0.07, w: 3.5, h: 0.38, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });
    s.addText(desc, { x: 6.0, y: y + 0.48, w: 3.5, h: 0.75, fontSize: 11, color: C.muted, fontFace: "Arial" });
  });

  s.addText("Every pixel of the GAPP logo carries intent.", {
    x: 0.4, y: 5.15, w: 9.2, h: 0.35, fontSize: 13, color: C.orange, italic: true, bold: true, fontFace: "Arial", align: "center"
  });
}

// ─── SLIDE 24: Visual Language ───────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "High Contrast, High Accountability", 0.28, 26);

  s.addText("Our visual language avoids the soft pastels of productivity apps. We use high-contrast white-on-charcoal.", {
    x: 0.4, y: 1.05, w: 9.2, h: 0.52, fontSize: 13.5, color: C.muted, fontFace: "Arial"
  });

  // Contrast demo
  [
    { bg: C.charcoal, fg: C.white, label: "White on Charcoal", note: "Primary text style" },
    { bg: C.charcoal, fg: C.orange, label: "Orange on Charcoal", note: "Highlight & accent" },
    { bg: C.orange, fg: C.charcoal, label: "Charcoal on Orange", note: "CTA buttons" }
  ].forEach(({ bg, fg, label, note }, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.7, w: 2.85, h: 1.3, fill: { color: bg }, line: { color: "444444" } });
    s.addText(label, { x: x + 0.1, y: 1.8, w: 2.65, h: 0.55, fontSize: 14, bold: true, color: fg, fontFace: "Arial", align: "center" });
    s.addText(note, { x: x + 0.1, y: 2.35, w: 2.65, h: 0.35, fontSize: 10.5, color: fg, fontFace: "Arial", align: "center" });
  });

  const principles = [
    ["Gen Z Resonance", "Dark mode aesthetic — preferred by the student demographic and reduces eye strain during long sessions."],
    ["High-Tech Feel", "Premium, professional aesthetic that signals GAPP is serious technology, not a side project."],
    ["Accessibility", "WCAG-compliant contrast ratios ensure the app is usable by all students, including those with visual impairments."]
  ];

  principles.forEach(([title, body], i) => {
    const y = 3.2 + i * 0.75;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.06, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(title, { x: 0.6, y: y - 0.02, w: 2.5, h: 0.38, fontSize: 12.5, bold: true, color: C.white, fontFace: "Arial", margin: 0 });
    s.addText(body, { x: 3.2, y: y - 0.02, w: 6.4, h: 0.58, fontSize: 12, color: C.muted, fontFace: "Arial" });
  });
}

// ─── SLIDE 25: Prototyping ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Prototyping", 0.28, 26);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.05, w: 9.2, h: 3.5, fill: { color: C.darkCard }, line: { color: "333333" } });
  s.addText("🖥️", { x: 0.4, y: 1.15, w: 9.2, h: 1.5, fontSize: 72, align: "center" });
  s.addText("Interactive Prototype", { x: 0.4, y: 2.6, w: 9.2, h: 0.55, fontSize: 22, bold: true, color: C.white, fontFace: "Arial Black", align: "center" });
  s.addText("Full end-to-end prototype available at the GAPP website", { x: 0.4, y: 3.15, w: 9.2, h: 0.42, fontSize: 14, color: C.muted, fontFace: "Arial", align: "center" });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: 3.7, w: 3.8, h: 0.65, fill: { color: C.orange }, line: { color: C.orange } });
  s.addText("VISIT PROTOTYPE →", { x: 3.1, y: 3.7, w: 3.8, h: 0.65, fontSize: 14, bold: true, color: C.charcoal, fontFace: "Arial Black", align: "center", valign: "middle" });

  const features = ["Mobile PWA — no app store required", "WhatsApp + SMS notification integration", "Real-time RSVP + attendance tracking", "GAPP Leaderboard — live reputation scores"];
  s.addText(features.map((t, i) => ({ text: t, options: { bullet: true, color: C.offwhite, fontSize: 13, fontFace: "Arial", breakLine: i < features.length - 1, paraSpaceAfter: 6 } })),
    { x: 0.6, y: 4.55, w: 9.0, h: 0.95 });
}

// ─── SLIDE 26: Future Potential ──────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.charcoal };
  addLogo(s);
  addSectionTitle(s, "Scaling the Reputation Economy", 0.28, 26);

  s.addText("Beyond the campus, the GAPP framework has the potential to revolutionize coordination across sectors.", {
    x: 0.4, y: 1.05, w: 9.2, h: 0.52, fontSize: 13.5, color: C.muted, fontFace: "Arial"
  });

  const sectors = [
    { icon: "🤝", title: "Professional Networking", desc: "Reliable \"Coffee Chat\" scheduling — no more ghosted meetings between professionals." },
    { icon: "🌍", title: "Volunteer Coordination", desc: "Ensuring non-profits have the manpower they're promised — accountability for causes that matter." },
    { icon: "🏢", title: "Corporate Training", desc: "Increasing completion rates for professional development modules through reputational stakes." }
  ];

  sectors.forEach(({ icon, title, desc }, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w: 2.85, h: 2.65, fill: { color: C.darkCard }, line: { color: C.darkCard } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w: 2.85, h: 0.06, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(icon, { x, y: 1.82, w: 2.85, h: 0.75, fontSize: 32, align: "center" });
    s.addText(title, { x: x + 0.1, y: 2.58, w: 2.65, h: 0.5, fontSize: 13, bold: true, color: C.white, fontFace: "Arial", align: "center" });
    s.addText(desc, { x: x + 0.1, y: 3.1, w: 2.65, h: 1.2, fontSize: 11, color: C.muted, fontFace: "Arial", align: "center" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.65, w: 9.2, h: 0.8, fill: { color: "2A1810" }, line: { color: C.orange, pt: 1.5 } });
  s.addText("VISION: To become the global standard for Reputational Verification in the digital age.", {
    x: 0.6, y: 4.72, w: 8.8, h: 0.65, fontSize: 15, bold: true, color: C.orange, fontFace: "Arial Black", align: "center", valign: "middle"
  });
}

// ─── SAVE ────────────────────────────────────────────────────────
const outputPath = path.join(__dirname, "GAPP_Presentation.pptx");

pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`✅ Done: Saved to ${outputPath}`))
  .catch(e => { 
    console.error("❌ Error saving file:", e.message); 
    process.exit(1); 
  });