import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.airtable.com/v0/appznJPpAPzTYzoI2";

// Question record IDs in Airtable (mapped by question ID 1-12)
const QUESTION_RECORD_IDS: Record<number, string> = {
  1: "recP8yi0IvueTsyKe",  // Privacy Officer
  2: "recExb6X6VPeuGqqD",  // Privacy Policy
  3: "rec9gCpVrqXAMtCEe",  // Consent Practices
  4: "recQjN7dZz3fGzLfT",  // Data Inventory
  5: "recAyvK4FV3kVbHqP",  // Breach Response Plan
  6: "recW5mNf5tVxJHfzK",  // Breach Record Keeping
  7: "rec2vFqMn7kEfDxPa",  // MFA
  8: "recLpN8rTqY5wJc3R",  // Endpoint Protection
  9: "recHdK6mXvR4sFn2Q",  // Backup & Recovery
  10: "recJ3wQpTkY8nMd5V", // Employee Training
  11: "recN9xRfUmW6vKg4S", // Vendor Management
  12: "recF7yShVnX2tLb8P", // Access Requests
};

// Map principle text to PIPEDA Principle multi-select values
function parsePrinciples(principle: string): string[] {
  const principles: string[] = [];
  if (principle.includes("1")) principles.push("P1 Accountability");
  if (principle.includes("2")) principles.push("P2 Identifying Purposes");
  if (principle.includes("3")) principles.push("P3 Consent");
  if (principle.includes("4")) principles.push("P4 Limiting Collection");
  if (principle.includes("5")) principles.push("P5 Limiting Use, Disclosure & Retention");
  if (principle.includes("7")) principles.push("P7 Safeguards");
  if (principle.includes("8")) principles.push("P8 Openness");
  if (principle.includes("9")) principles.push("P9 Individual Access");
  if (principle.includes("10.1") || principle.includes("10.3") || principle.includes("s.10")) {
    principles.push("Mandatory Breach Reporting");
  }
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
