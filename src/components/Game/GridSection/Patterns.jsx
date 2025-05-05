import { Button, Card, Input, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { FaRegImage } from 'react-icons/fa';
import { PATTERNS } from '../../../constants/patterns';
import { createPatternHtml } from '../../../utils/patterns';
import ImagePatternModal from '../../modals/ImagePatternModal';
import PatternPreview from './PatternPreview';

const { Title, Text } = Typography;
const { Search } = Input;

const Patterns = () => {
  const dragPreviewsRef = useRef({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isImagePatternModalOpen, setIsImagePatternModalOpen] = useState(false);

  const handleDragStart = (e, pattern) => {
    e.dataTransfer.setData('application/json', JSON.stringify(pattern));

    let dragImage = dragPreviewsRef.current[pattern.name];

    if (!dragImage) {

      dragImage = document.createElement('div');
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.pointerEvents = 'none';

      dragImage.innerHTML = createPatternHtml(pattern.cells, {

        containerHeight: 80,
      });

      document.body.appendChild(dragImage);
      dragPreviewsRef.current[pattern.name] = dragImage;
    }

    e.dataTransfer.setDragImage(dragImage, 20, 20);
  };

  const filteredPatterns = Object.entries(PATTERNS).filter(([key, pattern]) => (
    pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="w-full max-w-xl max-h-screen p-4 overflow-auto bg-white border border-gray-200 rounded-lg shadow-md">
      <div className='flex items-center justify-between mb-4'>
        <Title level={4} className="mb-0">Pattern Library</Title>
        <Tooltip title="Upload Image Pattern">
          <Button
            size='large'
            icon={<FaRegImage />}
            onClick={() => setIsImagePatternModalOpen(true)}
            type="link"
            aria-label="Upload Image Pattern"
          />
        </Tooltip>
      </div>
      <Text className="block mb-4 text-sm text-gray-500">
        Drag and drop these patterns to the grid
      </Text>

      <Search
        placeholder="Search patterns..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        allowClear
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map(([key, pattern]) => (
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
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No patterns found matching "{searchTerm}"
          </div>
        )}
      </div>
      <ImagePatternModal
        isVisible={isImagePatternModalOpen}
        onClose={() => setIsImagePatternModalOpen(false)}
      />
    </div>
  );
};

export default Patterns;
