/* BuildWave — seed content & data
 * Plain script (no build step) so it runs on file:// and GitHub Pages alike.
 * Everything the UI reads lives on window.BW.
 */
window.BW = (function () {
  "use strict";

  // What a student can build in 60 minutes — the personalization hook.
  // Each is concrete, resume-worthy, and achievable with AI help.
  const PROJECTS = [
    {
      key: "web",
      label: "Web development",
      build: "an AI résumé reviewer that scores a résumé and suggests fixes",
      stack: "React + a language model API",
      resumeLine: "Built and deployed an AI résumé-scoring web app (React, LLM API).",
    },
    {
      key: "ml",
      label: "AI / Machine learning",
      build: "a review sentiment analyzer that labels any product review positive or negative",
      stack: "Python + Hugging Face",
      resumeLine: "Built a sentiment-analysis model on real review data (Python, Transformers).",
    },
    {
      key: "data",
      label: "Data science",
      build: "a placement-trends dashboard that predicts which skills get you hired",
      stack: "Python + Streamlit",
      resumeLine: "Built a predictive placement-trends dashboard (Python, Streamlit).",
    },
    {
      key: "app",
      label: "App development",
      build: "a study-buddy chatbot that answers questions from your own notes",
      stack: "Flutter + a RAG pipeline",
      resumeLine: "Built a notes-aware study chatbot with retrieval-augmented generation.",
    },
    {
      key: "cyber",
      label: "Cybersecurity",
      build: "a phishing detector that flags scam emails before you open them",
      stack: "Python + scikit-learn",
      resumeLine: "Built an ML phishing-email classifier (Python, scikit-learn).",
    },
    {
      key: "core",
      label: "IoT / Core / ECE",
      build: "a smart-attendance system that recognizes faces from a webcam",
      stack: "Python + OpenCV",
      resumeLine: "Built a face-recognition attendance system (Python, OpenCV).",
    },
    {
      key: "unsure",
      label: "Not sure yet",
      build: "a personal assistant that summarizes any lecture video in 60 seconds",
      stack: "Python + Whisper + an LLM",
      resumeLine: "Built an AI lecture-summarizer (speech-to-text + LLM).",
    },
  ];

  // Seeded leaderboard so the page looks alive before real data exists.
  // Names/colleges are illustrative placeholders for the prototype.
  const SEED_LEADERS = [
    { name: "Aarav M.", college: "VIT Vellore", invites: 23, seed: true },
    { name: "Divya R.", college: "Amrita, Amritapuri", invites: 19, seed: true },
    { name: "Karthik S.", college: "SRM Chennai", invites: 17, seed: true },
    { name: "Sneha P.", college: "COEP Pune", invites: 14, seed: true },
    { name: "Rahul V.", college: "NIT Trichy", invites: 12, seed: true },
    { name: "Meghana T.", college: "BITS Hyderabad", invites: 11, seed: true },
    { name: "Imran K.", college: "Anna University", invites: 9, seed: true },
    { name: "Priya N.", college: "IIIT Bangalore", invites: 8, seed: true },
  ];

  // Scarcity: total seats and where the counter starts before real signups.
  const SEATS_TOTAL = 500;
  const SEATS_SEED = 341; // already "taken" when the campaign is mid-flight

  // How many friends a registrant must invite to unlock the starter kit.
  const UNLOCK_AT = 2;

  // Workshop goes live 7 days out (keeps the countdown honest whenever viewed).
  function workshopDate() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(19, 0, 0, 0); // 7:00 PM IST
    return d;
  }

  // WhatsApp share copy — the message that actually travels through groups.
  function shareText(name, link) {
    const who = name ? name.split(" ")[0] : "Hey";
    return (
      `${who} here 👋 I just grabbed a seat for a *free* live workshop — ` +
      `"Build Your First AI Project in 60 Minutes". It's for final-year students, ` +
      `you walk out with a real project for your résumé.\n\n` +
      `Seats are limited. Grab yours: ${link}`
    );
  }

  return {
    PROJECTS,
    SEED_LEADERS,
    SEATS_TOTAL,
    SEATS_SEED,
    UNLOCK_AT,
    workshopDate,
    shareText,
  };
})();
