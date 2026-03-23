"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, AlertTriangle, Shield, FileCheck } from "lucide-react";

// ─── Question Data ───────────────────────────────────────────────────────────

interface QuestionOption {
  label: string;
  text: string;
  value: number;
}

interface Question {
  id: number;
  topic: string;
  principle: string;
  question: string;
  options: QuestionOption[];
  pipedaWeight: number;
  insuranceWeight: number;
  gapText: string;
}

const questions: Question[] = [
  {
    id: 1,
    topic: "Privacy Officer",
    principle: "Principle 1: Accountability",
    question:
      "Has your organization designated a Privacy Officer responsible for PIPEDA compliance?",
    options: [
      {
        label: "A",
        text: "Yes — named individual with documented responsibilities, communicated on our website or in publications",
        value: 3,
      },
      {
        label: "B",
        text: "Someone handles privacy informally but there's no formal designation or documentation",
        value: 1,
      },
      {
        label: "C",
        text: "No one is specifically responsible for privacy compliance",
        value: 0,
      },
    ],
    pipedaWeight: 1.0,
    insuranceWeight: 0.3,
    gapText:
      "PIPEDA Principle 1 (Accountability) requires every organization to designate a specific individual accountable for compliance. The OPC expects this person's name or title to be communicated both internally and on your website. This is one of the first things checked in a complaint investigation.",
  },
  {
    id: 2,
    topic: "Privacy Policy",
    principle: "Principles 1 & 8: Accountability & Openness",
    question:
      "Does your business have a written Privacy Policy that explains how you collect, use, and disclose personal information?",
    options: [
      {
        label: "A",
        text: "Yes — reviewed or updated within the last 12 months, and publicly available on our website",
        value: 3,
      },
      {
        label: "B",
        text: "We have one but it hasn't been reviewed or updated in over a year",
        value: 2,
      },
      {
        label: "C",
        text: "We have a generic template we found online but never customized it",
        value: 1,
      },
      {
        label: "D",
        text: "We don't have a written privacy policy",
        value: 0,
      },
    ],
    pipedaWeight: 1.0,
    insuranceWeight: 0.5,
    gapText:
      "PIPEDA's Openness principle (Principle 8) requires you to make your privacy practices readily available in a form that's easy to understand. Your policy needs to cover: what personal information you collect, why you collect it, how it's used, who it's shared with, how it's protected, and how individuals can access or challenge it.",
  },
  {
    id: 3,
    topic: "Consent Practices",
    principle: "Principle 3: Consent",
    question:
      "How does your business obtain and document consent when collecting personal information from customers or users?",
    options: [
      {
        label: "A",
        text: "We track consent with timestamps, record the specific purpose, and allow withdrawal — all logged in a system",
        value: 3,
      },
      {
        label: "B",
        text: "We have consent checkboxes on forms but no centralized record of who consented to what",
        value: 1,
      },
      {
        label: "C",
        text: "We collect personal information without a formal consent process",
        value: 0,
      },
    ],
    pipedaWeight: 1.0,
    insuranceWeight: 0.4,
    gapText:
      "PIPEDA Principle 3 requires meaningful consent — people need to understand what they're agreeing to before you collect their data. The OPC has made clear that buried consent in Terms of Service doesn't count. You need to identify the purpose at or before collection time, get affirmative consent, and be able to prove it.",
  },
  {
    id: 4,
    topic: "Data Inventory",
    principle: "Principles 2, 4 & 5",
    question:
      "Do you maintain an inventory of what personal information your business collects, where it's stored, and how long you keep it?",
    options: [
      {
        label: "A",
        text: "Yes — we have a documented data inventory with storage locations, retention periods, and a data destruction policy",
        value: 3,
      },
      {
        label: "B",
        text: "We have a general idea of what we collect but nothing formally documented",
        value: 1,
      },
      {
        label: "C",
        text: "We don't track what personal information we hold or where it lives",
        value: 0,
      },
    ],
    pipedaWeight: 0.9,
    insuranceWeight: 0.6,
    gapText:
      "Three PIPEDA principles depend on knowing what data you have. Principle 2 says you must identify purposes before or at collection. Principle 4 says you can only collect what's necessary. Principle 5 says you can only keep it as long as needed and must have a destruction policy. If you don't have an inventory, you can't comply with any of these.",
  },
  {
    id: 5,
    topic: "Breach Response Plan",
    principle: "Mandatory Breach Reporting (s.10.1)",
    question:
      "Does your business have a documented breach response procedure that includes notification to the Privacy Commissioner and affected individuals?",
    options: [
      {
        label: "A",
        text: "Yes — we have a written incident response plan covering OPC notification, individual notification, timelines, and roles",
        value: 3,
      },
      {
        label: "B",
        text: "We have a general incident response plan but it doesn't specifically address PIPEDA notification requirements",
        value: 2,
      },
      {
        label: "C",
        text: "We don't have a documented breach response procedure",
        value: 0,
      },
    ],
    pipedaWeight: 1.0,
    insuranceWeight: 1.0,
    gapText:
      "Since 2018, PIPEDA mandatory breach reporting is law — not optional. If a breach creates a 'real risk of significant harm' you must notify the OPC, notify affected individuals, and keep records of every breach for 24 months. Failure to report is an offence that can result in fines up to $100,000 per violation. On the insurance side, an incident response plan is the single most common qualifying gate.",
  },
  {
    id: 6,
    topic: "Breach Record Keeping",
    principle: "Mandatory Record Keeping (s.10.3)",
    question:
      "Do you keep a log of all security incidents and data breaches, even minor ones, retained for at least 24 months?",
    options: [
      {
        label: "A",
        text: "Yes — all incidents are logged with dates, details, and assessment of harm, retained for 24+ months",
        value: 3,
      },
      {
        label: "B",
        text: "We log significant incidents but not minor ones",
        value: 1,
      },
      {
        label: "C",
        text: "We don't maintain a breach or incident log",
        value: 0,
      },
    ],
    pipedaWeight: 1.0,
    insuranceWeight: 0.7,
    gapText:
      "This isn't a best practice — it's a legal requirement. Section 10.3 of PIPEDA says you must keep a record of every breach of security safeguards for at least 24 months, and the Privacy Commissioner can demand to see them at any time. 'Every breach' means every breach, including ones that didn't meet the threshold for OPC notification.",
  },
  {
    id: 7,
    topic: "Multi-Factor Authentication",
    principle: "Principle 7: Safeguards",
    question:
      "Is multi-factor authentication (MFA) enabled across your business email, remote access, and admin accounts?",
    options: [
      {
        label: "A",
        text: "Yes — MFA is enforced on email, remote access (VPN/RDP), and all admin/privileged accounts",
        value: 3,
      },
      {
        label: "B",
        text: "MFA is enabled on some systems but not all three of those categories",
        value: 1,
      },
      {
        label: "C",
        text: "MFA is not enabled or we're not sure",
        value: 0,
      },
    ],
    pipedaWeight: 0.5,
    insuranceWeight: 1.0,
    gapText:
      "MFA is the #1 control insurers look for — more than half of carriers require it as a minimum condition to even issue a quote. They specifically ask about three areas: email accounts, remote network access, and privileged admin accounts. Missing MFA on any of these is a leading reason applications get rejected.",
  },
  {
    id: 8,
    topic: "Endpoint Protection (EDR)",
    principle: "Principle 7: Safeguards",
    question:
      "Do all company devices (laptops, desktops, servers) have endpoint detection and response (EDR) or managed antivirus installed?",
    options: [
      {
        label: "A",
        text: "Yes — EDR or advanced antivirus is deployed and monitored on all endpoints",
        value: 3,
      },
      {
        label: "B",
        text: "We have traditional antivirus on most devices but not EDR, or not on all devices",
        value: 2,
      },
      {
        label: "C",
        text: "Some devices have protection, others don't, or we're not sure",
        value: 1,
      },
      {
        label: "D",
        text: "No endpoint protection in place",
        value: 0,
      },
    ],
    pipedaWeight: 0.4,
    insuranceWeight: 1.0,
    gapText:
      "Insurers have moved beyond asking about basic antivirus. The standard underwriting question now is whether you have endpoint detection and response (EDR) deployed across all devices. EDR catches ransomware and zero-day attacks that traditional antivirus misses. Not having it either disqualifies your application or significantly increases your premium.",
  },
  {
    id: 9,
    topic: "Backup & Recovery",
    principle: "Principle 7: Safeguards",
    question:
      "Does your business maintain regular data backups that are tested and stored offline or in an immutable format?",
    options: [
      {
        label: "A",
        text: "Yes — regular backups with tested recovery procedures, stored offline or immutable",
        value: 3,
      },
      {
        label: "B",
        text: "We have backups but they haven't been tested, or they're only stored online/in the same network",
        value: 2,
      },
      {
        label: "C",
        text: "We have some form of backup but we're not sure of the details",
        value: 1,
      },
      {
        label: "D",
        text: "No formal backup process",
        value: 0,
      },
    ],
    pipedaWeight: 0.4,
    insuranceWeight: 1.0,
    gapText:
      "Backup is a top-3 underwriting requirement. Carriers don't just want to hear 'yes we have backups.' They want to know: Are backups tested regularly? Are they stored offline or in an immutable format that ransomware can't encrypt? Industry data shows 94% of ransomware attacks specifically target backup systems.",
  },
  {
    id: 10,
    topic: "Employee Training",
    principle: "Principles 1 & 7: Accountability & Safeguards",
    question:
      "Do your employees receive cybersecurity and privacy awareness training, including phishing simulations?",
    options: [
      {
        label: "A",
        text: "Yes — at least annually, with documented completion records and phishing simulations",
        value: 3,
      },
      {
        label: "B",
        text: "We've done some informal training but it's not regular and we don't track completion",
        value: 1,
      },
      {
        label: "C",
        text: "No employee training program for cybersecurity or privacy",
        value: 0,
      },
    ],
    pipedaWeight: 0.6,
    insuranceWeight: 1.0,
    gapText:
      "The OPC expects your staff to know your privacy policies and how to handle personal information. On the insurance side, phishing is the entry point for most breaches, and carriers know it. They ask specifically whether you run annual training with phishing simulations and whether you can show completion records.",
  },
  {
    id: 11,
    topic: "Vendor Management",
    principle: "Principle 1: Accountability (third-party)",
    question:
      "Do you assess the privacy and security practices of third-party vendors who handle personal information on your behalf?",
    options: [
      {
        label: "A",
        text: "Yes — we have a vendor assessment process with contractual privacy obligations and we monitor compliance status",
        value: 3,
      },
      {
        label: "B",
        text: "We check some basics before signing up a vendor but have no formal or ongoing process",
        value: 1,
      },
      {
        label: "C",
        text: "We don't assess vendor privacy or security practices",
        value: 0,
      },
    ],
    pipedaWeight: 0.8,
    insuranceWeight: 0.7,
    gapText:
      "Under PIPEDA Principle 1, you're responsible for personal information even after you hand it to a third party. The OPC says you must 'use contractual or other means' to make sure vendors provide a comparable level of protection. If your vendor gets breached and they were handling your customers' data, the OPC holds you accountable.",
  },
  {
    id: 12,
    topic: "Access Requests",
    principle: "Principle 9: Individual Access",
    question:
      "If a customer asked to see what personal information you hold about them, could you fulfill that request within 30 days?",
    options: [
      {
        label: "A",
        text: "Yes — we have a documented process for handling access requests and can locate an individual's data across our systems",
        value: 3,
      },
      {
        label: "B",
        text: "We could probably find it but we don't have a formal process and it would take significant effort",
        value: 1,
      },
      {
        label: "C",
        text: "We wouldn't know where to start or what data we hold about a specific individual",
        value: 0,
      },
    ],
    pipedaWeight: 0.8,
    insuranceWeight: 0.3,
    gapText:
      "PIPEDA Principle 9 gives every individual the right to ask what personal information you hold about them, how you got it, and who you've shared it with. You have 30 days to respond. Under the incoming CPPA (Bill C-27), individual rights are expected to get stronger, including the right to data portability and disposal.",
  },
];

const PIPEDA_MAX = 28.2;
const INSURANCE_MAX = 25.5;

// ─── Airtable Config ──────────────────────────────────────────────────────────

const AIRTABLE_BASE_URL = "https://api.airtable.com/v0/appznJPpAPzTYzoI2";
const AIRTABLE_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN || "";

const QUESTION_RECORD_IDS: Record<number, string> = {
  1: "recP8yi0IvueTsyKe",
  2: "recExb6X6VPeuGqqD",
  3: "recR0OqxpcMLMCQ0R",
  4: "recpnKp20oWnvDOIQ",
  5: "rec6IsQpoHhUserfB",
  6: "rec5RBwviOUWlJXDJ",
  7: "recACi4Vlxy9ECGLU",
  8: "rec7ZSvGae4Ire8Pa",
  9: "rechCGxiDAu3ertxb",
  10: "reciEdSeEaFKCFSYN",
  11: "recItIWbahLo6ArSW",
  12: "rec0cstUG77jib2oO",
};

function parsePrinciples(principle: string): string[] {
  const principles: string[] = [];
  if (principle.includes("10.1") || principle.includes("s.10.1")) {
    principles.push("S10.1 Breach Reporting");
  }
  if (principle.includes("10.3") || principle.includes("s.10.3")) {
    principles.push("S10.3 Record Keeping");
  }
  if (/\b1\b/.test(principle) && !principle.includes("10")) principles.push("P1 Accountability");
  if (/\b2\b/.test(principle) && !principle.includes("10")) principles.push("P2 Purposes");
  if (/\b3\b/.test(principle)) principles.push("P3 Consent");
  if (/\b4\b/.test(principle)) principles.push("P4 Limiting Collection");
  if (/\b5\b/.test(principle)) principles.push("P5 Limiting Use");
  if (/\b7\b/.test(principle)) principles.push("P7 Safeguards");
  if (/\b8\b/.test(principle)) principles.push("P8 Openness");
  if (/\b9\b/.test(principle)) principles.push("P9 Individual Access");
  return principles;
}

function getGrade(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}

function getGradeLabel(grade: string): string {
  switch (grade) {
    case "A": return "Strong";
    case "B": return "Moderate";
    case "C": return "Gaps Present";
    case "D": return "At Risk";
    case "F": return "Critical";
    default: return "";
  }
}

function getScoreInterpretation(score: number, type: "pipeda" | "insurance"): string {
  if (type === "pipeda") {
    if (score >= 85) return "Your PIPEDA compliance posture is strong. You have the core documentation and processes in place. Focus on maintaining and updating your policies as the law evolves.";
    if (score >= 70) return "You have a reasonable compliance foundation but there are gaps that could expose you during an OPC investigation. Addressing the gaps below will bring you to full compliance.";
    if (score >= 50) return "You have some compliance elements in place but significant gaps remain. Under the incoming Bill C-27, these gaps could result in administrative monetary penalties.";
    if (score >= 30) return "Your PIPEDA compliance is well below what the OPC expects. Multiple core requirements are missing. This level of non-compliance creates real legal and financial risk.";
    return "Your business has almost no PIPEDA compliance documentation in place. This is unfortunately common — but it means you're exposed to complaint investigations, breach reporting failures, and incoming fines under the new privacy law.";
  } else {
    if (score >= 85) return "Your security controls are strong and well-documented. You should have no trouble qualifying for cyber insurance at competitive rates.";
    if (score >= 70) return "You meet most carrier requirements but have a few gaps that could result in higher premiums or coverage exclusions. Closing these gaps will strengthen your application.";
    if (score >= 50) return "You have some controls in place but are missing key requirements that carriers use as qualifying gates. You may face rejection or significantly limited coverage.";
    if (score >= 30) return "Your controls are below what most carriers require to issue a policy. Without addressing these gaps, your application is likely to be rejected.";
    return "Your business lacks the baseline security controls that insurers require. 41% of SMB applications get rejected — your current posture puts you squarely in that group.";
  }
}

// ─── Score Ring Component ────────────────────────────────────────────────────

function ScoreRing({
  score,
  grade,
  label,
  type,
}: {
  score: number;
  grade: string;
  label: string;
  type: "pipeda" | "insurance";
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const strokeColor =
    score >= 85
      ? "stroke-green-500"
      : score >= 70
      ? "stroke-blue-500"
      : score >= 50
      ? "stroke-yellow-500"
      : score >= 30
      ? "stroke-orange-500"
      : "stroke-red-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-foreground/10"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${strokeColor} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display">{animatedScore}</span>
          <span className="text-sm text-muted-foreground font-mono">/100</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-medium mb-1">{label}</div>
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-foreground/10 text-sm font-mono">
          Grade: {grade} — {getGradeLabel(grade)}
        </div>
      </div>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-mono text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm font-mono text-muted-foreground">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="h-px bg-foreground/10 overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Assessment Page ────────────────────────────────────────────────────

type Phase = "intro" | "questions" | "email-gate" | "results";

export default function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Email gate fields
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scoring
  const calculateScores = useCallback(() => {
    let pipedaRaw = 0;
    let insuranceRaw = 0;

    answers.forEach((answer, i) => {
      const val = answer ?? 0;
      pipedaRaw += val * questions[i].pipedaWeight;
      insuranceRaw += val * questions[i].insuranceWeight;
    });

    const pipedaScore = Math.round((pipedaRaw / PIPEDA_MAX) * 100);
    const insuranceScore = Math.round((insuranceRaw / INSURANCE_MAX) * 100);

    return { pipedaScore, insuranceScore };
  }, [answers]);

  const getGaps = useCallback(() => {
    return questions.filter((q, i) => {
      const maxVal = Math.max(...q.options.map((o) => o.value));
      return (answers[i] ?? 0) < maxVal;
    });
  }, [answers]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (answers[currentQuestion] === null) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPhase("email-gate");
      }
      setIsTransitioning(false);
    }, 300);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (!companyName || !email || !firstName) return;
    setIsSubmitting(true);

    const { pipedaScore, insuranceScore } = calculateScores();
    const gaps = getGaps();

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || "";
    const utmMedium = params.get("utm_medium") || "";
    const utmCampaign = params.get("utm_campaign") || "";

    const headers = {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    };

    const today = new Date().toISOString().split("T")[0];
    const followUpDate = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

    let temperature = "Warm";
    if (pipedaScore <= 50 || insuranceScore <= 50) {
      temperature = "Hot";
    } else if (pipedaScore >= 80 && insuranceScore >= 80) {
      temperature = "Cold";
    }

    // Build response data for each question
    const responseData = questions.map((q, i) => {
      const answerVal = answers[i] ?? 0;
      const selectedOption = q.options.find((o) => o.value === answerVal);
      const maxScore = Math.max(...q.options.map((o) => o.value));
      const isGap = answerVal < maxScore;
      return {
        questionId: q.id,
        questionTopic: q.topic,
        answer: selectedOption?.text || "No answer",
        answerValue: answerVal,
        maxPossible: maxScore,
        pipedaWeight: q.pipedaWeight,
        insuranceWeight: q.insuranceWeight,
        pipedaPoints: answerVal * q.pipedaWeight,
        insurancePoints: answerVal * q.insuranceWeight,
        isGap,
        gapText: isGap ? q.gapText : "",
        principle: q.principle,
      };
    });

    // Build notes from gaps
    const gapItems = responseData.filter((r) => r.isGap);
    const notes = gapItems.length > 0
      ? `Gaps: ${gapItems.map((r) => `${r.questionTopic} (${r.answerValue}/${r.maxPossible})`).join(", ")}`
      : "";

    try {
      // Step 1: Create Lead record
      const leadFields: Record<string, unknown> = {
        "Company Name": companyName,
        "Contact First Name": firstName,
        "Contact Email": email,
        "PIPEDA Score": pipedaScore,
        "PIPEDA Grade": getGrade(pipedaScore),
        "Insurance Score": insuranceScore,
        "Insurance Grade": getGrade(insuranceScore),
        "Total Gaps": gaps.length,
        "Assessment Date": today,
        Source: utmSource || "Website",
        "Lead Status": "New",
        "Lead Temperature": temperature,
        "Follow-Up Date": followUpDate,
      };

      if (lastName) leadFields["Contact Last Name"] = lastName;
      if (phone) leadFields["Contact Phone"] = phone;
      if (jobTitle) leadFields["Contact Job Title"] = jobTitle;
      if (website) leadFields["Website"] = website;
      if (industry) leadFields["Industry"] = industry;
      if (companySize) leadFields["Company Size"] = companySize;
      if (province) leadFields["Province"] = province;
      if (city) leadFields["City"] = city;
      if (utmCampaign) leadFields["UTM Campaign"] = utmCampaign;
      if (utmSource) leadFields["UTM Source"] = utmSource;
      if (utmMedium) leadFields["UTM Medium"] = utmMedium;
      if (notes) leadFields["Notes"] = notes;

      const leadRes = await fetch(`${AIRTABLE_BASE_URL}/Leads`, {
        method: "POST",
        headers,
        body: JSON.stringify({ typecast: true, records: [{ fields: leadFields }] }),
      });

      if (!leadRes.ok) {
        console.error("Airtable Lead error:", await leadRes.text());
      } else {
        const leadData = await leadRes.json();
        const leadRecordId = leadData.records[0].id;

        // Step 2: Create Response records
        const responseRecords = responseData.map((r) => {
          const fields: Record<string, unknown> = {
            Lead: [leadRecordId],
            "Company Name": companyName,
            "Question Topic": r.questionTopic,
            "Answer Value": r.answerValue,
            "Max Possible": r.maxPossible,
            "Answer Text": r.answer,
            "PIPEDA Weight": r.pipedaWeight,
            "Insurance Weight": r.insuranceWeight,
            "PIPEDA Points": r.pipedaPoints,
            "Insurance Points": r.insurancePoints,
            "Is Gap": r.isGap ? "YES" : "NO",
          };

          const questionRecordId = QUESTION_RECORD_IDS[r.questionId];
          if (questionRecordId) fields["Question"] = [questionRecordId];
          if (r.isGap && r.gapText) fields["Gap Text"] = r.gapText;

          const principles = parsePrinciples(r.principle);
          if (principles.length > 0) fields["PIPEDA Principle"] = principles;

          return { fields };
        });

        // Airtable max 10 records per request
        for (let i = 0; i < responseRecords.length; i += 10) {
          const batch = responseRecords.slice(i, i + 10);
          const respRes = await fetch(`${AIRTABLE_BASE_URL}/Responses`, {
            method: "POST",
            headers,
            body: JSON.stringify({ typecast: true, records: batch }),
          });
          if (!respRes.ok) {
            console.error("Airtable Responses batch error:", await respRes.text());
          }
        }
      }
    } catch (e) {
      console.error("Failed to submit to Airtable:", e);
    }

    setSubmitted(true);
    setIsSubmitting(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase("results");
      setIsTransitioning(false);
    }, 300);
  };

  // ─── Intro Screen ─────────────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <main className="relative min-h-screen noise-overlay">
        {/* Nav */}
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="font-display text-2xl tracking-tight">
            syneOps
          </a>
        </nav>

        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Free Tool
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-8">
              Readiness
              <br />
              Assessment
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
              Get your PIPEDA Compliance Score and Cyber Insurance Readiness
              Score in under 5 minutes. See exactly where you stand and what to
              fix. No credit card. No sales call. Just answers.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-16 pb-16 border-b border-foreground/10">
              {[
                { value: "12", label: "Questions" },
                { value: "2", label: "Compliance Scores" },
                { value: "~5 min", label: "to Complete" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl lg:text-4xl font-display mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setPhase("questions");
                  setIsTransitioning(false);
                }, 300);
              }}
            >
              Start Free Assessment
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4 font-mono">
              No credit card required. Your data stays private.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ─── Questions Screen ──────────────────────────────────────────────────────

  if (phase === "questions") {
    const q = questions[currentQuestion];

    return (
      <main className="relative min-h-screen noise-overlay">
        {/* Nav */}
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="font-display text-2xl tracking-tight">
            syneOps
          </a>
          <span className="text-sm font-mono text-muted-foreground">
            Readiness Assessment
          </span>
        </nav>

        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <ProgressBar current={currentQuestion + 1} total={questions.length} />

          <div
            className={`mt-16 transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Topic badge */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
                <span className="w-8 h-px bg-foreground/30" />
                {q.principle}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-12 leading-[1.1]">
              {q.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-16">
              {q.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-6 border transition-all duration-300 group ${
                    answers[currentQuestion] === option.value
                      ? "border-foreground bg-foreground/[0.03]"
                      : "border-foreground/10 hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`shrink-0 w-8 h-8 flex items-center justify-center border font-mono text-sm transition-all duration-300 ${
                        answers[currentQuestion] === option.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 group-hover:border-foreground/40"
                      }`}
                    >
                      {answers[currentQuestion] === option.value ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        option.label
                      )}
                    </span>
                    <span className="text-base leading-relaxed">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevQuestion}
                className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${
                  currentQuestion === 0
                    ? "opacity-0 pointer-events-none"
                    : ""
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <Button
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background px-8 h-12 rounded-full group"
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === null}
              >
                {currentQuestion === questions.length - 1
                  ? "View Results"
                  : "Next"}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Email Gate ────────────────────────────────────────────────────────────

  if (phase === "email-gate") {
    return (
      <main className="relative min-h-screen noise-overlay">
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="font-display text-2xl tracking-tight">
            syneOps
          </a>
        </nav>

        <div className="max-w-xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="mb-12">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Assessment Complete
              </span>
              <h2 className="text-4xl lg:text-5xl font-display tracking-tight mb-6">
                Your scores
                <br />
                are ready.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Enter your details to see your PIPEDA Compliance Score, Insurance
                Readiness Score, and personalized gap report.
              </p>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    First name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="Tariq"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="Hassan"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Work email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="tariq@company.ca"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="403-555-0142"
                  />
                </div>
              </div>

              {/* Company + Job Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Company name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="Apex Drilling Ltd"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Job title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="Operations Manager"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Company website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                  placeholder="apexdrilling.ca"
                />
              </div>

              {/* Industry + Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground appearance-none"
                  >
                    <option value="">Select industry</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Technology/SaaS">Technology / SaaS</option>
                    <option value="Energy & Resources">Energy & Resources</option>
                    <option value="Construction & Trades">Construction & Trades</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Number of employees
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground appearance-none"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>

              {/* Province + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground appearance-none"
                  >
                    <option value="">Select province</option>
                    <option value="Alberta">Alberta</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors text-foreground"
                    placeholder="Calgary"
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-foreground hover:bg-foreground/90 text-background h-14 text-base rounded-full group mt-4"
                onClick={handleSubmit}
                disabled={!companyName || !email || !firstName || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "View My Scores"}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <p className="text-sm text-muted-foreground text-center font-mono">
                Your data stays private. We practice what we preach.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Results Screen ────────────────────────────────────────────────────────

  const { pipedaScore, insuranceScore } = calculateScores();
  const pipedaGrade = getGrade(pipedaScore);
  const insuranceGrade = getGrade(insuranceScore);
  const gaps = getGaps();

  return (
    <main className="relative min-h-screen noise-overlay">
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="font-display text-2xl tracking-tight">
          syneOps
        </a>
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to home
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Your Results
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h1 className="text-4xl lg:text-6xl font-display tracking-tight">
            Assessment Complete
          </h1>
        </div>

        {/* Score Rings */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 pb-20 border-b border-foreground/10">
          <ScoreRing
            score={pipedaScore}
            grade={pipedaGrade}
            label="PIPEDA Compliance"
            type="pipeda"
          />
          <ScoreRing
            score={insuranceScore}
            grade={insuranceGrade}
            label="Insurance Readiness"
            type="insurance"
          />
        </div>

        {/* Interpretations */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 pb-20 border-b border-foreground/10">
          <div className="p-8 border border-foreground/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-medium">PIPEDA Compliance</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {getScoreInterpretation(pipedaScore, "pipeda")}
            </p>
          </div>
          <div className="p-8 border border-foreground/10">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-5 h-5" />
              <h3 className="text-lg font-medium">Insurance Readiness</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {getScoreInterpretation(insuranceScore, "insurance")}
            </p>
          </div>
        </div>

        {/* Priority Gaps */}
        {gaps.length > 0 && (
          <div className="mb-20">
            <div className="mb-8">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                Priority Gaps
              </span>
              <h2 className="text-3xl lg:text-4xl font-display tracking-tight">
                {gaps.length} gap{gaps.length !== 1 ? "s" : ""} identified
              </h2>
            </div>

            <div className="space-y-4">
              {gaps.map((gap, i) => (
                <details
                  key={gap.id}
                  className="group border border-foreground/10 hover:border-foreground/20 transition-colors"
                >
                  <summary className="flex items-start gap-4 p-6 cursor-pointer list-none">
                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                          {gap.topic}
                        </h3>
                        <span className="text-sm font-mono text-muted-foreground">
                          {gap.principle}
                        </span>
                      </div>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pl-[52px]">
                    <p className="text-muted-foreground leading-relaxed">
                      {gap.gapText}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="border border-foreground p-8 lg:p-16 text-center">
          <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-6">
            Close every gap.
            <br />
            Get compliant in 30 minutes.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            syneOps generates every document you need — privacy policies, breach
            response plans, consent frameworks, and insurance evidence packages.
            All customized to your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://calendly.com/staqtech/30min?month=2026-03" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
              >
                Get a demo
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
              onClick={() => (window.location.href = "/#pricing")}
            >
              View pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 border-t border-foreground/10 mt-20">
        <p className="text-sm text-muted-foreground text-center">
          &copy; 2026 Staqtech Inc. All rights reserved.
        </p>
      </div>
    </main>
  );
}
