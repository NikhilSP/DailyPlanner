import { render, screen } from '@testing-library/react';
import App from './App';
import { vi, describe, it, expect } from 'vitest';

// Fix for DragDropContext in test environment (which might lack some DOM APIs)
vi.mock('@hello-pangea/dnd', async () => {
    const actual = await vi.importActual('@hello-pangea/dnd');
    return {
        ...actual,
        DragDropContext: ({ children }) => <div>{children}</div>,
        Droppable: ({ children }) => children({
            draggableProps: {},
            innerRef: vi.fn(),
            placeholder: null
        }, {}),
        Draggable: ({ children }) => children({
            draggableProps: {},
            dragHandleProps: {},
            innerRef: vi.fn()
        }, {})
    };
});

describe('App', () => {
    it('renders the main layout', () => {
        render(<App />);
        expect(screen.getByText('Finish App Logic')).toBeInTheDocument();
    });

    // Add more integration tests as needed
    // Note: Since we mocked DND deeply, we can't test drag interactions easily here without more setup,
    // but we can test clicking buttons etc.
});
