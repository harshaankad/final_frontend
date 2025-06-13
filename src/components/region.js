import HumanBody from "./HumanBody";
import MenBackBodySvgComponent from "./MenBackBodySvgComponent.js";
import Menbody from "./MenBody";
import MenBodySvgComponent from "./MenBodySvgComponent";

const Region = () => {
  return (
    <div className="App">
      <MenBodySvgComponent />
      <MenBackBodySvgComponent />
      {/* <HumanBody />
      <Menbody /> */}
    </div>
  );
};

export default Region;
