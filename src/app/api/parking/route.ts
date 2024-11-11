import { NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "us-east-1" });

const getParkingData = async (tableName: string) => {
  try {
    const command = new ScanCommand({ TableName: tableName });
    const data = await dynamodb.send(command);
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const calculateAreaStats = (lots: any[]) => {
  const totalSpots = lots.length;
  const availableLots: string[] = [];
  
  lots.forEach(lot => {
    if (lot.status.S === "True") {
      availableLots.push(lot.lot_id.S);
    }
  });

  const availableSpots = availableLots.length;

  return { totalSpots, availableSpots, availableLots };
};

const areaMappings = {
  ParkSmart_DB_East: "East",
  ParkSmart_DB_West: "West",
  ParkSmart_DB_Central: "Central",
} as const;

const positionMappings = {
  'Central': {
    'infoPosition': {'x': 200, 'y': 50},
    'indicatorPosition': {
      'start': {'x': 275, 'y': 130},
      'end': {'x': 210, 'y': 250}
    }
  },
  'East': {
    'infoPosition': {'x': 240, 'y': 350},
    'indicatorPosition': {
      'start': {'x': 240, 'y': 390},
      'end': {'x': 205, 'y': 390}
    }
  },
  'West': {
    'infoPosition': {'x': 600, 'y': 350},
    'indicatorPosition': {
      'start': {'x': 600, 'y': 390},
      'end': {'x': 515, 'y': 405}
    }
  }
} as const;

const locationMappings = {
  'Central': {
    'lat': 1.347075756148789,
    'lng': 103.9313338869917
  },
  'East': {
    'lat': 1.3456335152740582,
    'lng': 103.93454627540778
  },
  'West': {
    'lat': 1.3445904632624452,
    'lng': 103.93353543295807
  }
} as const;

export async function GET() {
  try {
    const areasData = await Promise.all(
      Object.entries(areaMappings).map(async ([tableName, areaName], i) => {
        const lots = await getParkingData(tableName);
        const stats = calculateAreaStats(lots);
        
        return {
          id: i + 1,
          name: areaName,
          totalSpots: stats.totalSpots,
          availableSpots: stats.availableSpots,
          availableLots: stats.availableLots,
          status: "active",
          location: locationMappings[areaName],
          infoPosition: positionMappings[areaName].infoPosition,
          indicatorPosition: positionMappings[areaName].indicatorPosition,
        };
      })
    );

    return NextResponse.json(
      { 
        areas: areasData, 
        lastUpdated: new Date().toISOString() 
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parking data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}