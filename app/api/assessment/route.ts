import { NextRequest, NextResponse } from "next/server";

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

    // Parse UTM params
    const utmSource = body.utmSource || "";
    const utmMedium = body.utmMedium || "";
    const utmCampaign = body.utmCampaign || "";

    const record = {
      records: [
        {
          fields: {
            "Company Name": body.companyName || "",
            "Contact First Name": body.firstName || "",
            "Contact Last Name": body.lastName || "",
            "Contact Email": body.email || "",
            Industry: body.industry || "",
            "Company Size": body.companySize || "",
            "PIPEDA Score": body.pipedaScore || 0,
            "PIPEDA Grade": body.pipedaGrade || "",
            "Insurance Score": body.insuranceScore || 0,
            "Insurance Grade": body.insuranceGrade || "",
            "Total Gaps": body.totalGaps || 0,
            "Assessment Date": today,
            Source: utmSource ? `${utmSource}` : "Website",
            "UTM Campaign": utmCampaign,
            "UTM Source": utmSource,
            "UTM Medium": utmMedium,
            "Lead Status": "New",
            "Lead Temperature": temperature,
            "Follow-Up Date": followUpDate,
          },
        },
      ],
    };

    const airtableRes = await fetch(
      "https://api.airtable.com/v0/appznJPpAPzTYzoI2/Leads",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    );

    if (!airtableRes.ok) {
      const errorText = await airtableRes.text();
      console.error("Airtable error:", errorText);
      return NextResponse.json(
        { error: "Failed to save assessment" },
        { status: 500 }
      );
    }

    const data = await airtableRes.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Assessment API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
