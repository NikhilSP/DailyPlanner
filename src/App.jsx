import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BentoGrid from './components/Layout/BentoGrid';
import YearlyMilestones from './components/Header/YearlyMilestones';
import Hopper from './components/Sidebar/Hopper';
import DailyTodos from './components/Center/DailyTodos';
import Character from './components/Companion/Character';
import ViewToggle from './components/Sidebar/ViewToggle';
import MilestoneCenterView from './components/Center/MilestoneCenterView';
import ArchiveCenterView from './components/Center/ArchiveCenterView';
import MilestoneOverlay from './components/Overlay/MilestoneOverlay';
import { useTaskStore } from './hooks/useTaskStore';

function App() {
  const {
    milestones,
    hopper,
    daily,
    archive,
    addTask,
    toggleComplete,
    deleteTask,
    moveTask,
    addCheckpoint,
    toggleCheckpoint,
    deleteCheckpoint,
    addMilestone,
    updateMilestoneTitle,
    deleteMilestone,
    character
  } = useTaskStore();

  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'yearly' | 'archive'
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // "hopper" or "daily"
    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    // Prevent dragging if not in daily mode (though hopper might be visible, daily list isn't)
    if (viewMode !== 'daily' && (sourceList === 'daily' || destList === 'daily')) return;

    moveTask(sourceList, destList, source.index, destination.index);
  };

  const renderCenterContent = () => {
    if (viewMode === 'daily') {
      return (
        <Droppable droppableId="daily">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ height: '100%' }}>
              <DailyTodos
                tasks={daily}
                onAdd={(text) => addTask(text, 'daily')}
                onToggle={(id) => toggleComplete(id, 'daily')}
                onDelete={(id) => deleteTask(id, 'daily')}
                Draggable={Draggable}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }

    if (viewMode === 'yearly') {
      return (
        <MilestoneCenterView
          milestones={milestones}
          onSelectMilestone={setSelectedMilestoneId}
          onAddMilestone={() => addMilestone('New Milestone')}
          onDeleteMilestone={deleteMilestone}
          onToggleCheckpoint={toggleCheckpoint}
        />
      );
    }

    if (viewMode === 'archive') {
      return <ArchiveCenterView archive={archive} />;
    }

    return null;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BentoGrid
        header={
          <YearlyMilestones
            milestones={milestones}
            onToggle={(id) => toggleComplete(id, 'milestones')}
          />
        }
        sidebar={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
            <ViewToggle viewMode={viewMode === 'archive' ? 'daily' : viewMode} onToggle={(mode) => setViewMode(mode)} />
            <Droppable droppableId="hopper">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Hopper
                    tasks={hopper}
                    Draggable={Draggable}
                    onViewArchive={() => setViewMode(viewMode === 'archive' ? 'daily' : 'archive')}
                    isArchiveActive={viewMode === 'archive'}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        }
        center={renderCenterContent()}
        companion={<Character state={character.state} message={character.message} />}
      />

      {/* Overlay */}
      {selectedMilestone && (
        <MilestoneOverlay
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestoneId(null)}
          onUpdateTitle={updateMilestoneTitle}
          onAddCheckpoint={addCheckpoint}
          onToggleCheckpoint={toggleCheckpoint}
          onDeleteCheckpoint={deleteCheckpoint}
        />
      )}
    </DragDropContext>
  );
}

export default App;
