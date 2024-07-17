import { useState } from "react";

export default function Home() {
  const [itinerary, setItinerary] = useState("");
  const [sortedItinerary, setSortedItinerary] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: itinerary,
      });
      const data = await response.json();
      setSortedItinerary(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flight Itinerary Sorter</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={5}
          value={itinerary}
          onChange={(e) => setItinerary(e.target.value)}
          placeholder="Enter flight itinerary JSON"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sort Itinerary
        </button>
      </form>
      {sortedItinerary && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Sorted Itinerary:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(sortedItinerary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
