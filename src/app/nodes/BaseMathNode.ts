import { ClassicPreset } from "rete";

const socket = new ClassicPreset.Socket("socket");

export abstract class BaseMathNode extends ClassicPreset.Node<
  { first: ClassicPreset.Socket; second: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {

  constructor(
    label: string,
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(label);
    const first = new ClassicPreset.Input(socket, "First");
    const second = new ClassicPreset.Input(socket, "Second");

    this.addInput("first", first);
    this.addInput("second", second);
    this.addControl("value", new ClassicPreset.InputControl("number", { readonly: true }));
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }

  data(inputs: { first?: number[]; second?: number[] }): { value: number } {
    const { first, second } = inputs;
    const value = this.calculate((first ? first[0] : 0), (second ? second[0] : 0));

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }

  abstract calculate(first: number, second: number) : number;
}

export class SumNode extends BaseMathNode {
  constructor(
    change?: () => void,
    update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Sum", change, update);
  }

  calculate(first: number, second: number): number {
    return first + second;
  }
}

export class SubNode extends BaseMathNode {
  constructor(
    change?: () => void,
    update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Substract", change, update);
  }
  calculate(first: number, second: number): number {
    return first - second;
  }
}

export class MulNode extends BaseMathNode {
  constructor(
    change?: () => void,
    update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Multiply", change, update);
  }
  calculate(first: number, second: number): number {
    return first * second;
  }
}

export class DivNode extends BaseMathNode {
  constructor(
    change?: () => void,
    update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Division", change, update);
  }
  calculate(first: number, second: number): number {
    return first / second;
  }
}