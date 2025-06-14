import { NextRequest, NextResponse } from 'next/server';

// Fix: Use the correct environment variable names
const AIRTABLE_BASE_ID = process.env.AIRTABLE_CMS_BASE_ID || process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_CMS_API_KEY || process.env.AIRTABLE_API_KEY;

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  console.error('Missing Airtable configuration for Membership Plans API');
}

export interface MembershipPlan {
  id: string;
  planName: string;
  planSubtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: string;
  planDescription: string;
  features: string;
  planOrder: number;
  active: boolean;
  featured?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      console.error('Airtable configuration missing for Membership Plans API');
      return NextResponse.json(
        { error: 'Airtable configuration missing' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    // Build filter formula
    let filterFormula = '';
    if (activeOnly) {
      filterFormula = 'AND({Active} = TRUE())';
    }

    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Membership%20Plans`);
    if (filterFormula) {
      url.searchParams.append('filterByFormula', filterFormula);
    }
    url.searchParams.append('sort[0][field]', 'Plan Order');
    url.searchParams.append('sort[0][direction]', 'asc');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { error: 'Failed to fetch membership plans' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const plans: MembershipPlan[] = data.records.map((record: any) => ({
      id: record.id,
      planName: record.fields['Plan Name'] || '',
      planSubtitle: record.fields['Plan Subtitle'] || '',
      monthlyPrice: record.fields['Monthly Price'] || 0,
      annualPrice: record.fields['Annual Price'] || 0,
      annualSavings: record.fields['Annual Savings'] || '',
      planDescription: record.fields['Plan Description'] || '',
      features: record.fields['Features'] || '',
      planOrder: record.fields['Plan Order'] || 0,
      active: record.fields['Active'] || false,
      featured: record.fields['Featured'] || false,
    }));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}