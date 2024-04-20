interface PluginMessage {
  type: string;
  image?: string;
  parameters?: {
    tone: string;
    format: string;
    description: string;
  };
}

// The main function that handles incoming messages.
async function handleMessage(msg: PluginMessage) {
  if (msg.type === "export-png" && figma.currentPage.selection.length > 0) {
    const node = figma.currentPage.selection[0];
    const bytes = await node.exportAsync({
      format: "PNG",
      constraint: { type: "SCALE", value: 2 },
    });
    figma.ui.postMessage({
      type: "exported-png",
      bytes: Array.from(new Uint8Array(bytes)),
    });
  } else if (msg.type === "call-api") {
    const apiUrl = "http://localhost:5000/analyze_image?image=finance.png";
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      const data = await response.json();
      figma.ui.postMessage({ type: "api-response", data });
    } catch (error) {
      console.error("API call failed:", error);
      figma.ui.postMessage({
        type: "api-error",
        message: "Failed to call API",
      });
    }
  } else {
    figma.notify("No component selected or improper message format.");
  }
}

// Initialize the UI with a specific size.
figma.showUI(__html__, { width: 300, height: 400 });
figma.ui.onmessage = (msg: PluginMessage) => handleMessage(msg);
