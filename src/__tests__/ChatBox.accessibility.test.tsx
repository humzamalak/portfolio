import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBox from '../components/ChatBox';

// Mock the useChat hook
jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    setInput: jest.fn(),
    error: null,
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ChatBox Accessibility Features', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders with proper ARIA attributes', () => {
    render(<ChatBox />);
    
    // Check main container has proper ARIA attributes
    const mainContainer = screen.getByRole('region');
    expect(mainContainer).toHaveAttribute('aria-label', "Chat with Humza's AI assistant");
    expect(mainContainer).toHaveAttribute('aria-live', 'polite');
  });

  test('renders high-contrast toggle button with proper accessibility', () => {
    render(<ChatBox />);
    
    const toggleButton = screen.getByRole('button', { name: /high contrast mode/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label');
    expect(toggleButton).toHaveAttribute('title');
  });

  test('toggles high-contrast mode and persists to localStorage', () => {
    render(<ChatBox />);
    
    const toggleButton = screen.getByRole('button', { name: /high contrast mode/i });
    
    // Click to enable high-contrast mode
    fireEvent.click(toggleButton);
    
    // Check that localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('highContrastMode', 'true');
    
    // Check that button text changes
    expect(toggleButton).toHaveTextContent('🌞 Normal');
  });

  test('initializes high-contrast mode from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    render(<ChatBox />);
    
    const toggleButton = screen.getByRole('button', { name: /disable high contrast mode/i });
    expect(toggleButton).toHaveTextContent('🌞 Normal');
  });

  test('input field has proper accessibility attributes', () => {
    render(<ChatBox />);
    
    const input = screen.getByLabelText("Ask about Humza's projects");
    expect(input).toHaveAttribute('aria-describedby', 'input-help');
    expect(input).toHaveAttribute('tabIndex', '0');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  test('send button has proper accessibility attributes', () => {
    render(<ChatBox />);
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toHaveAttribute('tabIndex', '0');
  });

  test('sample query buttons have proper accessibility attributes', () => {
    render(<ChatBox />);
    
    const sampleButtons = screen.getAllByRole('button');
    const sampleQueryButtons = sampleButtons.filter(button => 
      button.textContent?.includes("What's Humza's best backend project") ||
      button.textContent?.includes("Show me a React app") ||
      button.textContent?.includes("What skills does Humza have")
    );
    
    sampleQueryButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  test('form has proper role and accessibility attributes', () => {
    render(<ChatBox />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Chat input form');
  });

  test('input help text is available for screen readers', () => {
    render(<ChatBox />);
    
    const helpText = screen.getByText(/Type your question about Humza's projects and press Enter or click Send to submit/i);
    expect(helpText).toHaveClass('sr-only');
  });
});
