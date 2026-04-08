'use client';

import { useEffect, useRef, useState } from 'react';

export default function ImageEditor({ imageUrl, onEditComplete, downloadButton }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('circle');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 400, height: 400 });
  const [displayScale, setDisplayScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      setBackgroundImage(img);
      setImageLoaded(true);
      ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);

      // Calculate scale to fit within viewport
      const maxW = Math.min(window.innerWidth - 64, 900);
      const maxH = window.innerHeight * 0.7;
      const scale = Math.min(1, maxW / naturalWidth, maxH / naturalHeight);
      setDisplayScale(scale);
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
      setImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Recalculate scale on window resize
  useEffect(() => {
    if (!imageLoaded) return;
    const handleResize = () => {
      const maxW = Math.min(window.innerWidth - 64, 900);
      const maxH = window.innerHeight * 0.7;
      const scale = Math.min(1, maxW / imageDimensions.width, maxH / imageDimensions.height);
      setDisplayScale(scale);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, imageDimensions]);

  const drawArrow = (ctx, fromX, fromY, toX, toY, color) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

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
      ctx.drawImage(backgroundImage, 0, 0, imageDimensions.width, imageDimensions.height);
    }

    shapes.forEach((shape) => {
      if (shape.type === 'circle') {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === 'arrow') {
        drawArrow(ctx, shape.fromX, shape.fromY, shape.toX, shape.toY, shape.color);
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage) return;
    const ctx = canvas.getContext('2d');
    drawAll(ctx);
  }, [shapes, backgroundImage, imageDimensions]);

  const getScaledPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getScaledPos(e);
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getScaledPos(e);
    setCurrentPos({ x, y });

    drawAll(ctx);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

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

    const { x, y } = getScaledPos(e);

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
    setShapes((prevShapes) => prevShapes.slice(0, -1));
  };

  const saveEditedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = Date.now();
        const file = new File([blob], `edited_image_${timestamp}.png`, {
          type: 'image/png',
          lastModified: timestamp,
        });

        console.log('Created file:', file);
        if (onEditComplete) {
          onEditComplete(file);
        }
      }
    }, 'image/png', 0.9);
  };

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center w-[400px] h-[400px] border-2 border-gray-300 bg-gray-100">
        <p className="text-gray-500">No image provided</p>
      </div>
    );
  }

  return (
    <div className="max-w-full w-full mx-auto">
      <div className="flex flex-col items-center gap-4 p-4">
        <div ref={containerRef} className="max-w-full border-2 border-gray-300 bg-white" style={{ overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            style={{
              width: imageDimensions.width * displayScale,
              height: imageDimensions.height * displayScale,
              display: 'block',
            }}
            className="cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 items-center max-w-full">
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
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#EAFFF0] to-[#E0F9E6] text-[#242424] font-semibold text-base border-2 border-black rounded-[6px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-300/50 hover:border-black hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 min-w-[100px] h-[42px] relative overflow-hidden group"
          >
            <span className="relative z-10">Undo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-emerald-200/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>

          <button
            onClick={saveEditedImage}
            disabled={!imageLoaded}
            className={`w-full sm:w-auto font-semibold text-base sm:text-lg h-[40px] sm:h-[42px] rounded-[6px] px-4 py-2 transform transition-all duration-300 min-w-[100px] relative overflow-hidden group
            ${imageLoaded ? 'bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] hover:scale-105 hover:shadow-xl hover:shadow-green-300/50' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <span className="relative z-10">Save</span>
            {imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            )}
          </button>
        </div>

        {/* Download Button - Rendered if passed as prop */}
        {downloadButton && (
          <div className="flex justify-center w-full">
            {downloadButton}
          </div>
        )}

        {!imageLoaded && imageUrl && (
          <div className="text-center text-gray-500">
            <p>Loading image...</p>
          </div>
        )}

        {imageLoaded && (
          <div className="text-center text-gray-600 text-sm">
            <p>Image dimensions: {imageDimensions.width} × {imageDimensions.height}</p>
          </div>
        )}
      </div>
    </div>
  );
}