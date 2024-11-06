import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "us-east-1" }); // Specify your AWS region

const getParkingData = async (tableName) => {
  try {
    const command = new ScanCommand({ TableName: tableName });
    const data = await dynamodb.send(command);
    console.log("hi")
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const calculateAreaStats = (lots) => {
  const totalSpots = lots.length;
  const availableSpots = lots.reduce((count, lot) => (lot.status === "False" ? count + 1 : count), 0);
  return { totalSpots, availableSpots };
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Only GET requests allowed" });
    return;
  }

  const areaMappings = {
    ParkSmart_DB_East: "East",
    ParkSmart_DB_West: "West",
    ParkSmart_DB_Central: "Central",
  };

  position_mappings = {
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
}

location_mappings = {
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
}

  const areasData = await Promise.all(
    Object.entries(areaMappings).map(async ([tableName, areaName], i) => {
      const lots = await getParkingData(tableName);
      const stats = calculateAreaStats(lots);

      return {
        id: i + 1,
        name: areaName,
        totalSpots: stats.totalSpots,
        availableSpots: stats.availableSpots,
        status: "active",
        location: locationMappings[areaName],
        infoPosition: positionMappings[areaName].infoPosition,
        indicatorPosition: positionMappings[areaName].indicatorPosition,
      };
    })
  );
  console.json({ areas: areasData, lastUpdated: new Date().toISOString() });
  res.status(200).json({ areas: areasData, lastUpdated: new Date().toISOString() });
}
