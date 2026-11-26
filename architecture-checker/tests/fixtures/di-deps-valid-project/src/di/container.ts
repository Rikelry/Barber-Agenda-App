import { A } from "../usecase/aUseCases";
import { B } from "../usecase/bUseCases";

export const a = new A(new B());
