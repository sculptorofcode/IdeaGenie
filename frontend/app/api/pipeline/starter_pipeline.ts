 const prompt_Gemini = `You are an expert SEO analyst with deep understanding of keyword ranking, CPC dynamics, search trends, and competition analysis.

I want you to assign a ranking score from 0 to 10 (lower is better) for the following keyword data.
Use the following logic:
Step-by-Step Ranking Framework:
Step 1: Understand CPC (Cost per Click)

High CPC (> 2.0) = high commercial value

Mid CPC (1.0 – 2.0) = medium value

Low CPC (< 1.0) = weak intent

Step 2: Analyze Volume

High Volume (> 5000) = highly searched

Mid Volume (1500 – 5000) = decent reach

Low Volume (< 1500) = niche or low interest

Step 3: Examine Trend (avg_monthly_searches)

Consistently high or increasing → boost score

Sudden drop or consistent decline → penalize

Fluctuating trend → analyze stability

Step 4: Consider Competition

LOW → boost score

MEDIUM → neutral

HIGH → penalize slightly (unless CPC is very high)

Step 5: Combine All Factors into a Final Rank Score
Use this guideline to finalize:

Composite Strength	Rank
Excellent	0–3
Moderate	4–6
Weak/Niche	7–10

Final Output JSON Format:
Return a JSON object like this:

{
    "keyword": "<keyword>",
    "cpc": <float>,
    "search_volume": <int>,
    "ranking": <int (0 to 10)>
}

Think through each step. Judge all elements. Then output a single, final JSON with:

the keyword string
its CPC
overall monthly search volume
your final calculated ranking (0 = very high rank; 10 = low rank)

Analyze this Keyword:
{JSON.stringify(organizedData)}`;