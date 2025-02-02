import { Card } from "@/components/ui/card";
import { BuilderElement } from "@/types/builder";

interface PreviewModeProps {
  elements: BuilderElement[];
}

const PreviewMode = ({ elements }: PreviewModeProps) => {
  const renderElement = (element: BuilderElement) => {
    switch (element.type) {
      case "heading":
        return <h2 className="text-2xl font-bold mb-4">{element.content.text || ''}</h2>;
      case "text":
        return <p className="mb-4">{element.content.text || ''}</p>;
      case "image":
        return (
          <img
            src={element.content.url || ''}
            alt={element.content.alt || ''}
            className="max-w-full h-auto rounded mb-4"
          />
        );
      case "button":
        return (
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors mb-4">
            {element.content.text || ''}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="max-w-4xl mx-auto">
        {elements.map((element) => (
          <div key={element.id}>{renderElement(element)}</div>
        ))}
      </div>
    </Card>
  );
};

export default PreviewMode;