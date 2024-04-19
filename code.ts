figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-png" && figma.currentPage.selection.length > 0) {
    const node = figma.currentPage.selection[0];
    const bytes = await node.exportAsync({
      format: "JPG",
      constraint: { type: "SCALE", value: 2 },
    });
    figma.ui.postMessage({
      type: "exported-png",
      bytes: Array.from(new Uint8Array(bytes)),
    });
  } else {
    figma.notify("No component selected");
  }
};
