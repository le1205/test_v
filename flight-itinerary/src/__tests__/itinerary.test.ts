import { validateItinerary, sortItinerary } from "../pages/api/itinerary";

describe("Flight Itinerary", () => {
  test("validateItinerary should return true for valid itinerary", () => {
    const validItinerary = [
      { from: "EZE", to: "MIA" },
      { from: "MIA", to: "SFO" },
      { from: "SFO", to: "GRU" },
      { from: "GRU", to: "SCL" },
    ];
    expect(validateItinerary(validItinerary)).toBe(true);
  });

  test("validateItinerary should return false for itinerary with duplicate destination", () => {
    const invalidItinerary = [
      { from: "EZE", to: "MIA" },
      { from: "MIA", to: "SFO" },
      { from: "SFO", to: "MIA" },
    ];
    expect(validateItinerary(invalidItinerary)).toBe(false);
  });

  test("sortItinerary should correctly sort the itinerary", () => {
    const unsortedItinerary = [
      { from: "MIA", to: "SFO" },
      { from: "EZE", to: "MIA" },
      { from: "GRU", to: "SCL" },
      { from: "SFO", to: "GRU" },
    ];
    const expectedSortedItinerary = [
      { from: "EZE", to: "MIA" },
      { from: "MIA", to: "SFO" },
      { from: "SFO", to: "GRU" },
      { from: "GRU", to: "SCL" },
    ];
    expect(sortItinerary(unsortedItinerary)).toEqual(expectedSortedItinerary);
  });
});
