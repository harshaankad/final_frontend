import React, { useState } from "react";
//import "./menbody.css";
//import "./variables.css";
import MenBodySvgComponent from "./MenBodySvgComponent";
import MenBackBodySvgComponent from "./MenBackBodySvgComponent";

const HumanBody = () => {
  //   const [selectedArea, setSelectedArea] = useState("");

  const handlePieceClick = (event) => {
    // sc-body-model-svg__path--active
    // Get the id or class of the clicked path
    const pathClass = event.target.getAttribute("class");
    console.log(">>", pathClass);

    // Remove 'sc-body-model-svg__path--active' from all paths
    const activePath = document.querySelector(
      ".sc-body-model-svg__path--active",
    );
    if (activePath) {
      activePath.classList.remove("sc-body-model-svg__path--active");
    }

    // Check if the element exists
    if (pathClass) {
      // Add the 'newClass' and remove the 'originalClass'
      event.target.setAttribute(
        "class",
        `${pathClass} sc-body-model-svg__path--active`,
      );
    }
  };

  return (
    <div>
      <div className="sc-body-model evidence-search-body-widget__body-model">
        <div className="ui-dropdown ui-dropdown--compact sc-body-model__dropdown">
          <MenBodySvgComponent handlePieceClick={handlePieceClick} />
        </div>

        <div
          className="ui-button ui-button--text sc-body-model__rotate"
          id="rotate"
          ariaHidden="true"
          tabIndex="-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            role="img"
            className="ui-icon ui-button__icon"
          >
            <path
              fillRule="evenodd"
              d="M40 22c0 1-.453 2.402-3.648 4-1.301.652-2.692 1.117-4.352 1.434v3.957c7.848-1.336 12-4.77 12-9.391 0-6-8.953-10-20-10S4 16 4 22c0 5.43 5.73 9.219 16.45 9.895l-3.762 3.761 2.828 2.828L28 30l-8.484-8.484-2.828 2.828 3.566 3.57c-3.79-.203-6.332-.777-8.606-1.914C8.453 24.402 8 23 8 22s.453-2.402 3.648-4c2.954-1.477 7.317-2 12.352-2s9.398.523 12.352 2C39.547 19.598 40 21 40 22zm0 0"
            ></path>
          </svg>
          Rotate model
        </div>
      </div>
    </div>
  );
};

export default HumanBody;
