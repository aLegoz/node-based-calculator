import { ClassicPreset } from "rete";

const socket = new ClassicPreset.Socket("socket");

export class AddNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Add");
    const left = new ClassicPreset.Input(socket, "Number");
    const right = new ClassicPreset.Input(socket, "Number");

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl("value", new ClassicPreset.InputControl("number", { readonly: true }));
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const { left, right } = inputs;
    const value = (left ? left[0] : 0) + (right ? right[0] : 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}