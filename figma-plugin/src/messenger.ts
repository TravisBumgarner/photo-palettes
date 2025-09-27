import { getContrastColor } from "./src-messenger";

figma.showUI(__html__, { width: 600, height: 800 });

const RECT_WIDTH = 200;
const MAX_IMAGE_WIDTH = RECT_WIDTH * 6;

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "handle-add-to-canvas") return;

  // Must load font before editing text
  // await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Arial", style: "Regular" });

  const nodes: SceneNode[] = [];

  msg.colors.forEach((color: string, index: number) => {
    // Frame as container
    const frame = figma.createFrame();
    frame.resize(RECT_WIDTH, RECT_WIDTH / 2);

    frame.x = index * (RECT_WIDTH + 20);
    frame.y = 0;

    // Rectangle background
    const rect = figma.createRectangle();
    rect.resize(frame.width, frame.height);
    rect.fills = [{ type: "SOLID", color: hexToRgb(color) }];

    // Text label (safe order!)
    const text = figma.createText();
    text.fontName = { family: "Arial", style: "Regular" }; // set font first
    text.fontSize = 36;
    text.textAlignHorizontal = "CENTER";
    text.textAlignVertical = "CENTER";
    text.resize(frame.width, frame.height);
    text.fills = getContrastColor(color);

    text.characters = color.toUpperCase(); // only now assign characters

    // Place inside frame
    frame.appendChild(rect);
    frame.appendChild(text);

    rect.locked = true;
    nodes.push(frame);
  });

  // --- Optional image below swatches ---
  if (msg.imageBytes) {
    const image = figma.createImage(new Uint8Array(msg.imageBytes));
    const imgRect = figma.createRectangle();

    const imageSize = await image.getSizeAsync();

    const imgWidth = imageSize.width;
    const imgHeight = imageSize.height;
    const aspectRatio = imgWidth / imgHeight;
    if (aspectRatio >= 1) {
      // Wide image
      imgRect.resize(MAX_IMAGE_WIDTH, MAX_IMAGE_WIDTH / aspectRatio);
    } else {
      // Tall image
      imgRect.resize(MAX_IMAGE_WIDTH * aspectRatio, MAX_IMAGE_WIDTH);
    }

    imgRect.x = 0;

    const maxY = nodes.reduce(
      (m, n) => Math.max(m, "height" in n ? n.y + n.height : 0),
      0
    );
    imgRect.y = maxY + 20;

    imgRect.fills = [
      { type: "IMAGE", scaleMode: "FILL", imageHash: image.hash },
    ];
    nodes.push(imgRect);
  }

  const group = figma.group(nodes, figma.currentPage);
  group.name = msg.title || "Color Group";

  figma.currentPage.selection = [group];
  figma.viewport.scrollAndZoomIntoView([group]);

  setTimeout(() => {
    figma.closePlugin("Done!");
  }, 50);
};

// Helper
function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}
