import { Card, Typography } from 'antd';
import React, { useRef } from 'react';
import { PATTERNS } from '../../../constants/patterns';
import { createPatternHtml } from '../../../utils/patterns';
import PatternPreview from './PatternPreview';

const { Title, Text } = Typography;

const Patterns = () => {
  // Reference to store drag image elements
  const dragPreviewsRef = useRef({});

  const handleDragStart = (e, pattern) => {
    e.dataTransfer.setData('application/json', JSON.stringify(pattern));

    // Method 1: Create custom drag image using HTML element
    let dragImage = dragPreviewsRef.current[pattern.name];

    if (!dragImage) {
      // Create a temporary element for the drag image
      dragImage = document.createElement('div');
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.pointerEvents = 'none';

      // Set the HTML content with responsive dimensions
      dragImage.innerHTML = createPatternHtml(pattern.cells, {
        containerWidth: 80,  // Size of drag preview
        containerHeight: 80,
      });

      // Add to document and store reference
      document.body.appendChild(dragImage);
      dragPreviewsRef.current[pattern.name] = dragImage;
    }

    e.dataTransfer.setDragImage(dragImage, 20, 20);
  };

  return (
    <div className="w-full max-w-xl p-4 overflow-auto overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
      <Title level={4} className="mb-4">Pattern Library</Title>
      <Text className="block mb-4 text-sm text-gray-500">
        Drag and drop these patterns to the grid
      </Text>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(PATTERNS).map(([key, pattern]) => (
          <Card
            key={key}
            className="cursor-move hover:shadow-lg"
            size="small"
            draggable
            onDragStart={(e) => handleDragStart(e, pattern)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 border border-gray-200">
                <PatternPreview
                  cells={pattern.cells}
                  containerWidth={64}
                  containerHeight={64}
                  aliveColor="#4682B4"
                />
              </div>
              <div className="flex-grow text-start">
                <div className="font-medium">{pattern.name}</div>
                <div className="text-xs text-gray-500">{pattern.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Patterns;
