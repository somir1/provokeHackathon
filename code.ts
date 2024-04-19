figma.showUI(__html__, { width: 300, height: 300 });

async function exportAsPng(node: SceneNode) {
  const bytes = await node.exportAsync({
    format: "PNG",
    constraint: {
      type: "SCALE",
      value: 2, // Adjust scaling as needed
    },
  });
  // Send the raw bytes to the UI
  figma.ui.postMessage({ type: "exported-png", bytes });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-png" && figma.currentPage.selection.length > 0) {
    await exportAsPng(figma.currentPage.selection[0]);
  } else {
    figma.notify("No component selected");
  }
  // Don't close the plugin
};
