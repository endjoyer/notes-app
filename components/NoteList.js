import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Note from './Note';

const NoteList = ({ notes, handleOnDragEnd }) => (
  <DragDropContext onDragEnd={handleOnDragEnd}>
    <Droppable droppableId="notes">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {notes.map((note, index) => (
            <Draggable key={note.id} draggableId={note.id} index={index}>
              {(provided) => (
                <Note
                  key={note.id}
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
