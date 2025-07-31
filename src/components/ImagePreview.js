export default function ImagePreview({ imagePreview, onRemove }) {
  if (!imagePreview) return null;

  return (
    <div className="px-4 pb-2">
      <div className="relative inline-block">
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-[120px] max-h-[100px] rounded border"
        />
        <button
          onClick={onRemove}
          className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
          title="Remove image"
        >
          ×
        </button>
      </div>
    </div>
  );
}
