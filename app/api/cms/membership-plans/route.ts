import { NextRequest, NextResponse } from 'next/server';

// Fix: Use the correct environment variable names
const AIRTABLE_BASE_ID = process.env.AIRTABLE_CMS_BASE_ID || process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_CMS_API_KEY || process.env.AIRTABLE_API_KEY;

// Enhanced logging for debugging
console.log('🔍 Membership Plans API - Environment Check:');
console.log('- AIRTABLE_CMS_BASE_ID:', process.env.AIRTABLE_CMS_BASE_ID ? 'SET' : 'MISSING');
console.log('- AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? 'SET' : 'MISSING');
console.log('- AIRTABLE_CMS_API_KEY:', process.env.AIRTABLE_CMS_API_KEY ? 'SET' : 'MISSING');
console.log('- AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'SET' : 'MISSING');
console.log('- Using Base ID:', AIRTABLE_BASE_ID);

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  console.error('❌ Missing Airtable configuration for Membership Plans API');
  console.error('- Base ID:', AIRTABLE_BASE_ID ? 'SET' : 'MISSING');
  console.error('- API Key:', AIRTABLE_API_KEY ? 'SET' : 'MISSING');
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
  console.log('🚀 Membership Plans API - Request started');
  
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      console.error('❌ Configuration check failed');
      return NextResponse.json(
        {
          error: 'Airtable configuration missing',
          debug: {
            baseId: AIRTABLE_BASE_ID ? 'SET' : 'MISSING',
            apiKey: AIRTABLE_API_KEY ? 'SET' : 'MISSING'
          }
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    console.log('📋 Query parameters:', { activeOnly });

    // Build filter formula
    let filterFormula = '';
    if (activeOnly) {
      filterFormula = 'AND({Active} = TRUE())';
    }
    console.log('🔍 Filter formula:', filterFormula || 'None');

    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Membership%20Plans`);
    if (filterFormula) {
      url.searchParams.append('filterByFormula', filterFormula);
    }
    url.searchParams.append('sort[0][field]', 'Plan Order');
    url.searchParams.append('sort[0][direction]', 'asc');

    console.log('🌐 Airtable API URL:', url.toString());
    console.log('🔑 Using Base ID:', AIRTABLE_BASE_ID);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Airtable response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Airtable API error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.toString()
      });
      
      return NextResponse.json(
        {
          error: 'Failed to fetch membership plans',
          debug: {
            status: response.status,
            statusText: response.statusText,
            airtableError: errorText,
            baseId: AIRTABLE_BASE_ID,
            tableName: 'Membership Plans'
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📊 Airtable response data:', {
      recordCount: data.records?.length || 0,
      hasRecords: !!data.records,
      firstRecordFields: data.records?.[0]?.fields ? Object.keys(data.records[0].fields) : []
    });

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

    console.log('✅ Successfully processed', plans.length, 'membership plans');
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('💥 Unexpected error in membership plans API:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      baseId: AIRTABLE_BASE_ID,
      apiKeySet: !!AIRTABLE_API_KEY
    });
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error',
          baseId: AIRTABLE_BASE_ID,
          apiKeySet: !!AIRTABLE_API_KEY
        }
      },
      { status: 500 }
    );
  }
}