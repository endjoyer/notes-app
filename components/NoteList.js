import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Note from './Note';

const NoteList = ({ notes, handleOnDragEnd }) => (
  <DragDropContext onDragEnd={handleOnDragEnd}>
    <Droppable droppableId="notes">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {notes.map((note, index) => (
            <Draggable
              key={index.toString()}
              draggableId={index.toString()}
              index={index}
            >
              {(provided) => (
                <Note
                  note={note}
                  provided={provided}
                  innerRef={provided.innerRef}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export default NoteList;
