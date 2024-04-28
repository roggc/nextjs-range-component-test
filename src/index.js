import mocha from "mocha";
import range from "./components/range/index.spec";
import * as chai from "chai";
import chaiDom from "chai-dom";

chai.use(chaiDom);
mocha.setup("bdd");
// mocha.checkLeaks();
range();
mocha.run();
