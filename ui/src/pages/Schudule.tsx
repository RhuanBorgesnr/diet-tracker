// src/App.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const Day = styled.div`
  flex: 1;
  margin: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  min-height: 100px;
  border-radius: 4px;
`;

const Note = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  border-radius: 4px;
  user-select: none;
`;

function Schudule() {
  const [days, setDays] = useState([
    { id: 'monday', notes: [1, 2, 3] },
    { id: 'tuesday', notes: [4, 5] },
    // ... add more days as needed
  ]);

  const notes = {
    1: 'Note 1',
    2: 'Note 2',
    3: 'Note 3',
    4: 'Note 4',
    5: 'Note 5',
    // ... add more notes as needed
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceDay = days.find(day => day.id === result.source.droppableId);
    const destinationDay = days.find(day => day.id === result.destination!.droppableId);

    if (!sourceDay || !destinationDay) return;

    const movedNoteId = sourceDay.notes[result.source.index];
    sourceDay.notes.splice(result.source.index, 1);
    destinationDay.notes.splice(result.destination.index, 0, movedNoteId);

    setDays([...days]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {days.map(day => (
          <Droppable key={day.id} droppableId={day.id}>
            {(provided) => (
              <Day
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>{day.id}</h2>
                {day.notes.map((noteId, index) => (
                  <Draggable key={noteId} draggableId={noteId.toString()} index={index}>
                    {(provided) => (
                      <Note
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* {notes[noteId]} */}
                      </Note>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Day>
            )}
          </Droppable>
        ))}
      </Container>
    </DragDropContext>
  );
}

export default Schudule;
