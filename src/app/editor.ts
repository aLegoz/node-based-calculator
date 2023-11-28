'use client';
import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { DataflowEngine } from "rete-engine";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin";
import { NumberNode } from "@/app/nodes/NumberNode";
import { AddNode } from "@/app/nodes/AddNode";
import { OutputNode } from "@/app/nodes/OutputNode";
import { InputNode } from "@/app/nodes/InputNode";
import { BaseMathNode, DivNode, MulNode, SubNode, SumNode } from "@/app/nodes/BaseMathNode";

type Node = AddNode | NumberNode | OutputNode | InputNode | BaseMathNode;
type ConnectionProprs = Connection<NumberNode, AddNode> | Connection<AddNode, AddNode>;

class Connection<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}

type Schemes = GetSchemes<
  Node,
  ConnectionProprs
>;

type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const engine = new DataflowEngine<Schemes>();

  function process() {
    engine.reset();
    editor.getNodes().forEach((n) => engine.fetch(n.id));
  }

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Input", () => new InputNode(0, process)],
      ["Output", () => new OutputNode(process, (c) => area.update("control", c.id))],
      ["Add", () => new SumNode(process, (c) => area.update("control", c.id))],
      ["Sub", () => new SubNode(process, (c) => area.update("control", c.id))],
      ["Mul", () => new MulNode(process, (c) => area.update("control", c.id))],
      ["Div", () => new DivNode(process, (c) => area.update("control", c.id))],
    ])
  });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process();
    }
    return context;
  });

  render.addPreset(Presets.classic.setup());
  render.addPreset(Presets.contextMenu.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  editor.use(engine);

  area.use(connection);
  area.use(render);
  area.use(contextMenu);

  AreaExtensions.simpleNodesOrder(area);

  setTimeout(() => {
    // wait until nodes rendered because they don`t have predefined width and height
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy()
  };
}
