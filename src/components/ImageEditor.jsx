'use client';

import { useEffect, useRef, useState } from 'react';

export default function ImageEditor() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('circle');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [shapes, setShapes] = useState([]);

  const imageUrl =
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setBackgroundImage(img);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  const drawArrow = (ctx, fromX, fromY, toX, toY, color) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(toX, toY);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawAll = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    shapes.forEach((shape) => {
      if (shape.type === 'circle') {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === 'arrow') {
        drawArrow(ctx, shape.fromX, shape.fromY, shape.toX, shape.toY, shape.color);
      }
    });
  };

  // ✅ Automatically redraw canvas when shapes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage) return;
    const ctx = canvas.getContext('2d');
    drawAll(ctx);
  }, [shapes, backgroundImage]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPos({ x, y });

    drawAll(ctx);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    if (selectedTool === 'circle') {
      const radius =
        Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)) / 2;
      const centerX = (startPos.x + x) / 2;
      const centerY = (startPos.y + y) / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (selectedTool === 'arrow') {
      drawArrow(ctx, startPos.x, startPos.y, x, y, color);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'circle') {
      const radius =
        Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)) / 2;
      const centerX = (startPos.x + x) / 2;
      const centerY = (startPos.y + y) / 2;

      setShapes((prev) => [
        ...prev,
        { type: 'circle', cx: centerX, cy: centerY, r: radius, color },
      ]);
    } else if (selectedTool === 'arrow') {
      setShapes((prev) => [
        ...prev,
        { type: 'arrow', fromX: startPos.x, fromY: startPos.y, toX: x, toY: y, color },
      ]);
    }
  };

  const clearCanvas = () => {
    setShapes([]);
  };

  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="flex flex-col items-center gap-4 p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-gray-300 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />

        <div className="w-[400px] flex flex-wrap justify-center gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg text-[#242424] font-medium">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 text-[#242424]">
            <label className="text-lg font-medium text-[#242424]">Tool:</label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="circle">Circle</option>
              <option value="arrow">Arrow</option>
            </select>
          </div>

          <button
            onClick={clearCanvas}
            className="bg-brandGreen text-white rounded font-semibold text-[20px] h-[40px] w-[120px] transition-transform hover:scale-105 hover:shadow-lg"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
