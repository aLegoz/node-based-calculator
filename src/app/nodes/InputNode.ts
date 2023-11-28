import { ClassicPreset } from "rete";

const socket = new ClassicPreset.Socket("socket");

export class InputNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {

  constructor(
    initial: number,
    change?: () => void,
  ) {
    super("Input");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial, change }),

    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }

  data(): { value: number } {
    return {
      value: this.controls.value.value || 0
    };
  }
}