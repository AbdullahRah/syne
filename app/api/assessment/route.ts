import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.airtable.com/v0/appznJPpAPzTYzoI2";

// Question record IDs in Airtable (mapped by question ID 1-12)
const QUESTION_RECORD_IDS: Record<number, string> = {
  1: "recP8yi0IvueTsyKe",  // Privacy Officer
  2: "recExb6X6VPeuGqqD",  // Privacy Policy
  3: "recR0OqxpcMLMCQ0R",  // Consent Practices
  4: "recpnKp20oWnvDOIQ",  // Data Inventory
  5: "rec6IsQpoHhUserfB",  // Breach Response Plan
  6: "rec5RBwviOUWlJXDJ",  // Breach Record Keeping
  7: "recACi4Vlxy9ECGLU",  // MFA
  8: "rec7ZSvGae4Ire8Pa",  // Endpoint Protection
  9: "rechCGxiDAu3ertxb",  // Backup & Recovery
  10: "reciEdSeEaFKCFSYN", // Employee Training
  11: "recItIWbahLo6ArSW", // Vendor Management
  12: "rec0cstUG77jib2oO", // Access Requests
};

// Map principle text from assessment questions to Airtable multi-select values
function parsePrinciples(principle: string): string[] {
  const principles: string[] = [];
  // Check for section 10 references first (before generic number matching)
  if (principle.includes("10.1") || principle.includes("s.10.1")) {
    principles.push("S10.1 Breach Reporting");
  }
  if (principle.includes("10.3") || principle.includes("s.10.3")) {
    principles.push("S10.3 Record Keeping");
  }
  // Only match principle numbers if not part of section 10
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

interface ResponseItem {
  questionId: number;
  questionTopic: string;
  answer: string;
  answerValue: number;
  maxPossible: number;
  pipedaWeight: number;
  insuranceWeight: number;
  pipedaPoints: number;
  insurancePoints: number;
  isGap: boolean;
  gapText: string;
  principle: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const airtableToken = process.env.AIRTABLE_API_TOKEN;
    if (!airtableToken) {
      return NextResponse.json(
        { error: "Airtable API token not configured" },
        { status: 500 }
      );
    }

    const headers = {
      Authorization: `Bearer ${airtableToken}`,
      "Content-Type": "application/json",
    };

    const today = new Date().toISOString().split("T")[0];
    const followUpDate = new Date(Date.now() + 3 * 86400000)
      .toISOString()
      .split("T")[0];

    // Determine lead temperature based on scores
    let temperature = "Warm";
    if (body.pipedaScore <= 50 || body.insuranceScore <= 50) {
      temperature = "Hot";
    } else if (body.pipedaScore >= 80 && body.insuranceScore >= 80) {
      temperature = "Cold";
    }

    const utmSource = body.utmSource || "";
    const utmMedium = body.utmMedium || "";
    const utmCampaign = body.utmCampaign || "";

    // Build notes from gaps
    let notes = "";
    if (body.responses && Array.isArray(body.responses)) {
      const gapItems = body.responses.filter(
        (r: ResponseItem) => r.isGap
      );
      if (gapItems.length > 0) {
        notes = `Gaps: ${gapItems
          .map(
            (r: ResponseItem) =>
              `${r.questionTopic} (${r.answerValue}/${r.maxPossible})`
          )
          .join(", ")}`;
      }
    }

    // ── Step 1: Create Lead record ──────────────────────────────────────────
    const leadFields: Record<string, unknown> = {
      "Company Name": body.companyName || "",
      "Contact First Name": body.firstName || "",
      "Contact Last Name": body.lastName || "",
      "Contact Email": body.email || "",
      Industry: body.industry || undefined,
      "Company Size": body.companySize || undefined,
      "PIPEDA Score": body.pipedaScore || 0,
      "PIPEDA Grade": body.pipedaGrade || undefined,
      "Insurance Score": body.insuranceScore || 0,
      "Insurance Grade": body.insuranceGrade || undefined,
      "Total Gaps": body.totalGaps || 0,
      "Assessment Date": today,
      Source: utmSource || "Website",
      "Lead Status": "New",
      "Lead Temperature": temperature,
      "Follow-Up Date": followUpDate,
    };

    if (body.phone) leadFields["Contact Phone"] = body.phone;
    if (body.jobTitle) leadFields["Contact Job Title"] = body.jobTitle;
    if (body.website) leadFields["Website"] = body.website;
    if (body.province) leadFields["Province"] = body.province;
    if (body.city) leadFields["City"] = body.city;
    if (utmCampaign) leadFields["UTM Campaign"] = utmCampaign;
    if (utmSource) leadFields["UTM Source"] = utmSource;
    if (utmMedium) leadFields["UTM Medium"] = utmMedium;
    if (notes) leadFields["Notes"] = notes;

    // Remove undefined/empty values
    Object.keys(leadFields).forEach((key) => {
      if (leadFields[key] === undefined || leadFields[key] === "") {
        delete leadFields[key];
      }
    });

    const leadRes = await fetch(`${BASE_URL}/Leads`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        typecast: true,
        records: [{ fields: leadFields }],
      }),
    });

    if (!leadRes.ok) {
      const errorText = await leadRes.text();
      console.error("Airtable Lead error:", errorText);
      return NextResponse.json(
        { error: "Failed to save lead", details: errorText },
        { status: 500 }
      );
    }

    const leadData = await leadRes.json();
    const leadRecordId = leadData.records[0].id;

    // ── Step 2: Create Response records ─────────────────────────────────────
    if (body.responses && Array.isArray(body.responses)) {
      const responseRecords = body.responses.map((r: ResponseItem) => {
        const responseFields: Record<string, unknown> = {
          Lead: [leadRecordId],
          "Company Name": body.companyName || "",
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

        // Link to Question record if we have the ID
        const questionRecordId = QUESTION_RECORD_IDS[r.questionId];
        if (questionRecordId) {
          responseFields["Question"] = [questionRecordId];
        }

        // Add gap text only if there's a gap
        if (r.isGap && r.gapText) {
          responseFields["Gap Text"] = r.gapText;
        }

        // Parse PIPEDA principles into multi-select
        const principles = parsePrinciples(r.principle);
        if (principles.length > 0) {
          responseFields["PIPEDA Principle"] = principles;
        }

        return { fields: responseFields };
      });

      // Airtable allows max 10 records per request, so batch if needed
      for (let i = 0; i < responseRecords.length; i += 10) {
        const batch = responseRecords.slice(i, i + 10);
        const respRes = await fetch(`${BASE_URL}/Responses`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            typecast: true,
            records: batch,
          }),
        });

        if (!respRes.ok) {
          const errorText = await respRes.text();
          console.error(`Airtable Responses batch error:`, errorText);
          // Don't fail the whole request if responses fail - lead is already saved
        }
      }
    }

    return NextResponse.json({ success: true, leadId: leadRecordId });
  } catch (error) {
    console.error("Assessment API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
