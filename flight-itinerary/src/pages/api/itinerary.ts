import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Flight {
  from: string;
  to: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      console.log("---------------------------", req.body);
      const itinerary: Flight[] = req.body;

      if (!validateItinerary(itinerary)) {
        return res.status(400).json({ error: "Invalid itinerary" });
      }

      const sortedItinerary = sortItinerary(itinerary);

      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await prisma.itinerary.create({
        data: {
          flights: JSON.stringify(sortedItinerary), // Convert to JSON string
          ip: ip as string,
        },
      });

      res.status(200).json(sortedItinerary);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export function validateItinerary(itinerary: Flight[]): boolean {
  const destinations = new Set<string>();
  const origins = new Set<string>();

  for (const flight of itinerary) {
    if (destinations.has(flight.to)) {
      return false;
    }
    destinations.add(flight.to);
    origins.add(flight.from);
  }

  // Check for orphan flights
  for (const flight of itinerary) {
    if (
      !origins.has(flight.to) &&
      flight.to !== itinerary[itinerary.length - 1].to
    ) {
      return false;
    }
  }

  return true;
}

export function sortItinerary(itinerary: Flight[]): Flight[] {
  const flightMap = new Map<string, Flight>();
  const startSet = new Set<string>();
  const endSet = new Set<string>();

  for (const flight of itinerary) {
    flightMap.set(flight.from, flight);
    startSet.add(flight.from);
    endSet.add(flight.to);
  }

  const start = Array.from(startSet).find((airport) => !endSet.has(airport));
  if (!start) {
    throw new Error("Invalid itinerary: no starting point found");
  }

  const sortedItinerary: Flight[] = [];
  let currentAirport = start;

  while (flightMap.has(currentAirport)) {
    const flight = flightMap.get(currentAirport)!;
    sortedItinerary.push(flight);
    currentAirport = flight.to;
  }

  return sortedItinerary;
}
