import React from "react";

const LocationSearchPanel = ({
  suggestions = [],
  onSelectSuggestion,
  setVehiclePanelOpen,
  setPanelOpen,
  onFindTrip,
}) => {
  const list = suggestions && suggestions.length ? suggestions : [];

  return (
    <div className="pl-4">
      {list.map((item, idx) => {
        const display =
          typeof item === "string"
            ? item
            : item.displayName || item.display_name || item.display;

        return (
          <div
            key={idx}
            onClick={() => {
              if (onSelectSuggestion) onSelectSuggestion(item);
              // setVehiclePanelOpen(true);
              // setPanelOpen(false);
            }}
            className="flex gap-4 border-2 p-3 border-gray-50 active:border-black items-center my-2 justify-start"
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full ">
              <i className="ri-map-pin-2-fill"></i>
            </h2>
            <h4 className="font-medium">{display}</h4>
          </div>
        );
      })}

      <div className="mt-2 px-3">
        <button
          onClick={() => {
            if (onFindTrip) onFindTrip();
            else {
              setVehiclePanelOpen && setVehiclePanelOpen(true);
              setPanelOpen && setPanelOpen(false);
            }
          }}
          className="w-full bg-[#10b461] text-white py-3 rounded-lg font-semibold"
        >
          Find a trip
        </button>
      </div>
    </div>
  );
};

export default LocationSearchPanel;
