import React from "react";

const LocationSearchPanel = ({
  suggestions = [],
  onSelectSuggestion,
  setVehiclePanelOpen,
  setPanelOpen,
  onFindTrip,
  searchQuery = "",
  suggestionStatus = "idle",
}) => {
  const list = suggestions && suggestions.length ? suggestions : [];
  const hasTypedQuery = searchQuery.trim().length > 0;
  const showNoLocationMessage =
    hasTypedQuery &&
    (suggestionStatus === "not-found" || suggestionStatus === "error");
  const visibleSuggestions = list.slice(0, 4);
  const hasSuggestions = visibleSuggestions.length > 0;

  return (
    <div className="pl-4 flex h-full flex-col">
      <div
        className={[
          "transition-all duration-300 ease-in-out overflow-hidden",
          hasSuggestions ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="max-h-64 overflow-y-auto pr-2">
          {showNoLocationMessage ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No Location found
            </div>
          ) : (
            visibleSuggestions.map((item, idx) => {
              const display =
                typeof item === "string"
                  ? item
                  : item.displayName || item.display_name || item.display;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (onSelectSuggestion) onSelectSuggestion(item);
                  }}
                  className="flex gap-4 border-2 p-3 border-gray-50 active:border-black items-center my-2 justify-start"
                >
                  <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full ">
                    <i className="ri-map-pin-2-fill"></i>
                  </h2>
                  <h4 className="font-medium">{display}</h4>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 px-3">
        <button
          onClick={() => {
            if (onFindTrip) onFindTrip();
            else {
              setVehiclePanelOpen && setVehiclePanelOpen(true);
              setPanelOpen && setPanelOpen(false);
            }
          }}
          className="w-full bg-[#10b461] text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Find a trip
        </button>
      </div>
    </div>
  );
};

export default LocationSearchPanel;
