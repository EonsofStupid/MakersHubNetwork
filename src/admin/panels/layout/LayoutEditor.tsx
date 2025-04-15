import React, { useState } from 'react';
import { Layout, LayoutComponent, LayoutComponentType } from '@/shared/types/features/layout.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';

interface LayoutEditorProps {
  initialLayout?: Layout;
  onSave?: (layout: Layout) => void;
}

export function LayoutEditor({ initialLayout, onSave }: LayoutEditorProps) {
  const [layout, setLayout] = useState<Layout>(initialLayout || {
    id: 'new-layout',
    name: 'New Layout',
    components: {},
    layout: [],
    type: 'page',
    scope: 'site'
  });
  
  const logger = useLogger('LayoutEditor', LogCategory.ADMIN);
  
  const handleComponentUpdate = () => {
    setLayout((prev: Layout) => {
      return {
        ...prev,
        type: prev.type as LayoutComponentType,
        id: prev.id,
        name: prev.name,
        description: prev.description,
        components: prev.components,
        layout: prev.layout,
        meta: prev.meta,
        scope: prev.scope
      };
    });
  };
  
  const handleAddComponent = (type: string) => {
    const newComponentId = `component-${Date.now()}`;
    const newComponent = {
      id: newComponentId,
      type,
      props: {}
    };
    
    setLayout(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [newComponentId]: newComponent
      },
      layout: [...prev.layout, {
        id: `layout-${Date.now()}`,
        position: prev.layout.length,
        componentId: newComponentId
      }]
    }));
    
    logger.info('Added new component', { details: { componentType: type } });
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(layout);
    }
    logger.info('Layout saved');
  };
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(prev => ({
      ...prev,
      name: event.target.value
    }));
  };
  
  return (
    <div className="layout-editor p-4 border rounded-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Layout Editor</h2>
        <div className="flex gap-4 items-center mb-4">
          <div>
            <label htmlFor="layout-name" className="block text-sm mb-1">Layout Name</label>
            <input
              id="layout-name"
              type="text"
              value={layout.name}
              onChange={handleNameChange}
              className="px-3 py-2 border rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="layout-type" className="block text-sm mb-1">Type</label>
            <select
              id="layout-type"
              value={layout.type || 'page'}
              onChange={(e) => setLayout(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="page">Page</option>
              <option value="section">Section</option>
              <option value="widget">Widget</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Components</h3>
        <div className="flex gap-2 mb-4">
          <button 
            className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100"
            onClick={() => handleAddComponent('container')}
          >
            Add Container
          </button>
          <button 
            className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100"
            onClick={() => handleAddComponent('text')}
          >
            Add Text
          </button>
          <button 
            className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100"
            onClick={() => handleAddComponent('image')}
          >
            Add Image
          </button>
        </div>
        
        <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">
          {Object.keys(layout.components).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No components added yet. Use the buttons above to add components.
            </div>
          ) : (
            <ul className="space-y-2">
              {Object.values(layout.components).map((component) => (
                <li key={component.id} className="border rounded p-2 bg-white">
                  {component.type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Layout
        </button>
      </div>
    </div>
  );
}
