'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const ZOOM_STEP = 1.25;

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

  // The canvas is always full resolution; displayScale only changes how large it is
  // shown on screen. "fit" is the scale that shows the whole image inside the box.
  const [displayScale, setDisplayScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | 'custom'
  const containerRef = useRef(null);
  const scaleRef = useRef(1);
  const fitRef = useRef(1);
  // Point (in image pixels) that should stay under a given box-relative point after a zoom.
  const anchorRef = useRef(null);

  const computeFitScale = (w, h) => {
    const box = containerRef.current;
    const parentWidth = box?.parentElement?.clientWidth || window.innerWidth - 64;
    const maxW = parentWidth - 32 - 4; // parent padding + box border
    const maxH = window.innerHeight * 0.75;
    return Math.min(1, maxW / w, maxH / h);
  };

  const minScale = () => fitRef.current;
  const maxScale = () => Math.max(1, fitRef.current);

  // Zoom so that image point (ix, iy) stays at box-relative screen point (px, py).
  const zoomTo = (nextScale, anchor) => {
    const next = Math.min(maxScale(), Math.max(minScale(), nextScale));
    if (Math.abs(next - scaleRef.current) < 1e-4) return;
    const box = containerRef.current;
    if (box) {
      const px = anchor?.px ?? box.clientWidth / 2;
      const py = anchor?.py ?? box.clientHeight / 2;
      const ix = anchor?.ix ?? (box.scrollLeft + px) / scaleRef.current;
      const iy = anchor?.iy ?? (box.scrollTop + py) / scaleRef.current;
      anchorRef.current = { ix, iy, px, py };
    }
    setZoomMode(Math.abs(next - fitRef.current) < 1e-4 ? 'fit' : 'custom');
    setDisplayScale(next);
  };

  const zoomBy = (factor) => zoomTo(scaleRef.current * factor);
  const zoomFit = () => zoomTo(fitRef.current);
  const zoomNative = () => zoomTo(1);

  useEffect(() => { scaleRef.current = displayScale; }, [displayScale]);
  useEffect(() => { fitRef.current = fitScale; }, [fitScale]);

  // After the canvas re-renders at the new size, restore the anchored point.
  useLayoutEffect(() => {
    const box = containerRef.current;
    const a = anchorRef.current;
    if (!box || !a) return;
    box.scrollLeft = a.ix * displayScale - a.px;
    box.scrollTop = a.iy * displayScale - a.py;
    anchorRef.current = null;
  }, [displayScale]);

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

      const fit = computeFitScale(naturalWidth, naturalHeight);
      fitRef.current = fit;
      setFitScale(fit);
      setDisplayScale(fit);
      setZoomMode('fit');
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
      setImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Keep "fit" in sync with the window; a custom zoom level is left alone.
  useEffect(() => {
    if (!imageLoaded) return;
    const handleResize = () => {
      const fit = computeFitScale(imageDimensions.width, imageDimensions.height);
      fitRef.current = fit;
      setFitScale(fit);
      if (zoomMode === 'fit') setDisplayScale(fit);
      else if (scaleRef.current < fit) setDisplayScale(fit);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, imageDimensions, zoomMode]);

  // Ctrl / Cmd + scroll-wheel zooms around the cursor. Registered manually because
  // React's onWheel is passive and cannot call preventDefault().
  useEffect(() => {
    const box = containerRef.current;
    if (!box) return;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = box.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const ix = (box.scrollLeft + px) / scaleRef.current;
      const iy = (box.scrollTop + py) / scaleRef.current;
      zoomTo(scaleRef.current * (e.deltaY < 0 ? 1.1 : 1 / 1.1), { ix, iy, px, py });
    };
    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [imageLoaded]);

  const drawArrow = (ctx, fromX, fromY, toX, toY, color) => {
    const headLength = 35;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.lineWidth = 12;

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
        ctx.lineWidth = 12;
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
    ctx.lineWidth = 12;

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

    // Export as JPEG, not PNG. PNG is lossless so a full-resolution photo
    // becomes 20-30 MB; JPEG at 0.9 quality is ~5-10x smaller and looks the same.
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = Date.now();
        const file = new File([blob], `edited_image_${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: timestamp,
        });

        console.log('Created file:', file);
        if (onEditComplete) {
          onEditComplete(file);
        }
      }
    }, 'image/jpeg', 0.9);
  };

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center w-[400px] h-[400px] border-2 border-gray-300 bg-gray-100">
        <p className="text-gray-500">No image provided</p>
      </div>
    );
  }

  const zoomPct = Math.round(displayScale * 100);
  const atMin = displayScale <= minScale() + 1e-4;
  const atMax = displayScale >= maxScale() - 1e-4;
  const isNative = Math.abs(displayScale - 1) < 1e-4;
  const iconBtn =
    'inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent';
  const textBtn = (active) =>
    'inline-flex h-8 items-center rounded-md px-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 ' +
    (active ? 'bg-[#F4FFF3] text-[#5F8D4E]' : 'text-gray-700 hover:bg-gray-100');

  return (
    <div className="max-w-full w-full mx-auto">
      <div className="flex flex-col items-center gap-4 p-4">
        <div
          ref={containerRef}
          className="max-w-full border-2 border-gray-300 bg-white"
          style={{ overflow: 'auto', maxHeight: '80vh' }}
        >
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

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 items-center max-w-full">
          {/* Zoom */}
          <div className="flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white p-1" role="group" aria-label="Zoom">
            <button type="button" onClick={() => zoomBy(1 / ZOOM_STEP)} disabled={!imageLoaded || atMin} className={iconBtn} aria-label="Zoom out" title="Zoom out">
              <ZoomOut size={16} />
            </button>
            <span className="min-w-[3.25rem] text-center text-sm font-medium tabular-nums text-gray-700">{zoomPct}%</span>
            <button type="button" onClick={() => zoomBy(ZOOM_STEP)} disabled={!imageLoaded || atMax} className={iconBtn} aria-label="Zoom in" title="Zoom in">
              <ZoomIn size={16} />
            </button>
            <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />
            <button type="button" onClick={zoomFit} disabled={!imageLoaded} className={textBtn(zoomMode === 'fit')} title="Fit whole image in view">
              Fit
            </button>
            <button type="button" onClick={zoomNative} disabled={!imageLoaded} className={textBtn(isNative)} title="Show at original size">
              100%
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Color
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-10 rounded-md border border-gray-300 bg-white p-0.5 cursor-pointer"
              aria-label="Annotation colour"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Tool
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="field-input h-10 sm:h-10 w-auto pr-8 text-sm sm:text-sm"
            >
              <option value="circle">Circle</option>
              <option value="arrow">Arrow</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clearCanvas}
            className="btn-secondary h-10 sm:h-10 px-4 text-sm sm:text-sm min-w-[90px]"
          >
            Undo
          </button>

          <button
            type="button"
            onClick={saveEditedImage}
            disabled={!imageLoaded}
            className="btn-primary h-10 sm:h-10 px-5 text-sm sm:text-sm min-w-[90px]"
          >
            Save
          </button>
        </div>

        {/* Download Button - Rendered if passed as prop */}
        {downloadButton && (
          <div className="flex justify-center w-full">
            {downloadButton}
          </div>
        )}

        {!imageLoaded && imageUrl && (
          <div className="text-center text-gray-500 text-sm">
            <p>Loading image...</p>
          </div>
        )}

        {imageLoaded && (
          <div className="text-center text-gray-500 text-xs">
            <p>
              Image dimensions: {imageDimensions.width} × {imageDimensions.height}
              <span className="hidden sm:inline"> · Hold Ctrl / ⌘ and scroll to zoom</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
