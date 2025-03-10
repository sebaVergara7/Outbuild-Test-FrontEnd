import React from "react";

interface TaskEditFormProps {
  editContent: string;
  setEditContent: (content: string) => void;
  handleSave: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  setIsEditing: (isEditing: boolean) => void;
  taskContent: string;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  editContent,
  setEditContent,
  handleSave,
  handleKeyPress,
  setIsEditing,
  taskContent,
}) => {
  return (
    <div>
      <textarea
        className="w-full p-2 border rounded text-black"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        onKeyDown={handleKeyPress}
        autoFocus
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-3 py-1 bg-red-400 hover:bg-red-500 rounded mr-2 text-white cursor-pointer"
          onClick={() => {
            setIsEditing(false);
            setEditContent(taskContent);
          }}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskEditForm;
