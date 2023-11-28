import { ClassicPreset } from "rete";

const socket = new ClassicPreset.Socket("socket");

export class OutputNode extends ClassicPreset.Node<
  { value: ClassicPreset.Socket },
  {},
  { value: ClassicPreset.InputControl<"number"> }
> {
  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super("Output");
    this.addInput("value", new ClassicPreset.Input(socket, "Number"));
    this.addControl("value", new ClassicPreset.InputControl("number", { readonly: true }));
  }

  data(inputs: { value?: number[] }): { value: number } {
    const { value } = inputs;
    const result = value ? value[0] : 0;

    this.controls.value.setValue(result);
    if (this.update) this.update(this.controls.value);

    return { value: result };
  }
}