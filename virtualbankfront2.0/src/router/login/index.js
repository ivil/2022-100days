import passSignRoutes from "./passSign";
import registerRoutes from "./register";
import forgetPassRoutes from "./forgetPass";
import phoneCodeSignRoutes from "./phoneCodeSign";
import informationRoutes from "./information";
import modifyPhoneRoutes from "./modifyPhone";
import settingsRoutes from "./settings";
import modifySignPassRoutes from "./modifySignPass";
import modifyPayPassRoutes from "./modifyPayPass";
import logoutRoutes from "./logout";
import cancellationRoutes from "./cancellation";
import { Form } from "element-ui";

const loginRoutes = [
    ...passSignRoutes,
    ...registerRoutes,
    ...forgetPassRoutes,
    ...phoneCodeSignRoutes,
    ...informationRoutes,
    ...modifyPhoneRoutes,
    ...settingsRoutes,
    ...modifySignPassRoutes, 
    ...modifyPayPassRoutes,
    ...logoutRoutes,
    ...cancellationRoutes,

]

export default loginRoutes